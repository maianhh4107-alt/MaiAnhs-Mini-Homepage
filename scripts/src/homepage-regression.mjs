import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { spawn } from "node:child_process";

const homepageUrl = process.env.HOMEPAGE_URL ?? "http://127.0.0.1:19392/";
const apiUrl = process.env.API_URL ?? "http://127.0.0.1:8080";
const chromiumPath = process.env.CHROMIUM_PATH ?? "/repl/tools/bin/chromium";

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function waitFor(condition, description, timeout = 10_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await condition()) return;
    await sleep(100);
  }
  throw new Error(`Timed out waiting for ${description}`);
}

async function getJson(url) {
  const response = await fetch(url);
  const body = await response.text();
  assert.equal(response.ok, true, `${url} returned ${response.status}: ${body}`);
  return JSON.parse(body);
}

class DevToolsConnection {
  constructor(socketUrl) {
    this.socketUrl = socketUrl;
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
  }

  async connect() {
    this.socket = new WebSocket(this.socketUrl);
    await new Promise((resolve, reject) => {
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
    });
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        if (message.error) pending.reject(new Error(message.error.message));
        else pending.resolve(message.result);
        return;
      }
      for (const listener of this.listeners.get(message.method) ?? []) {
        listener(message.params, message.sessionId);
      }
    });
  }

  command(method, params = {}, sessionId) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    });
  }

  on(method, listener) {
    const listeners = this.listeners.get(method) ?? [];
    listeners.push(listener);
    this.listeners.set(method, listeners);
  }

  close() {
    this.socket?.close();
  }
}

async function startBrowser() {
  const userDataDir = await mkdtemp(`${tmpdir()}/mai-anh-homepage-`);
  const browser = spawn(chromiumPath, [
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--remote-debugging-port=9223",
    `--user-data-dir=${userDataDir}`,
    "about:blank",
  ], { stdio: ["ignore", "ignore", "pipe"] });

  const browserError = [];
  browser.stderr.on("data", (chunk) => browserError.push(chunk.toString()));
  let version;
  await waitFor(async () => {
    try {
      version = await getJson("http://127.0.0.1:9223/json/version");
      return Boolean(version.webSocketDebuggerUrl);
    } catch {
      if (browser.exitCode !== null) {
        throw new Error(`Chromium exited before starting: ${browserError.join("")}`);
      }
      return false;
    }
  }, "Chromium DevTools");

  const connection = new DevToolsConnection(version.webSocketDebuggerUrl);
  await connection.connect();
  const { targetId } = await connection.command("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await connection.command("Target.attachToTarget", { targetId, flatten: true });
  return {
    browser,
    userDataDir,
    connection,
    sessionId,
    async close() {
      connection.close();
      if (browser.exitCode === null) {
        browser.kill("SIGTERM");
        await new Promise((resolve) => browser.once("exit", resolve));
      }
      for (let attempt = 0; attempt < 5; attempt += 1) {
        try {
          await rm(userDataDir, { recursive: true, force: true });
          return;
        } catch (error) {
          if (error.code !== "ENOTEMPTY" || attempt === 4) throw error;
          await sleep(100);
        }
      }
    },
  };
}

function createPageController(browser) {
  const { connection, sessionId } = browser;
  const evaluate = async (expression) => {
    const result = await connection.command("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    }, sessionId);
    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.text ?? "Browser evaluation failed");
    }
    return result.result?.value;
  };

  return {
    evaluate,
    async navigate(url = homepageUrl) {
      await connection.command("Page.navigate", { url }, sessionId);
      await waitFor(() => evaluate("document.readyState === 'complete'"), "homepage navigation");
    },
    async reload() {
      await connection.command("Page.reload", { ignoreCache: true }, sessionId);
      await waitFor(() => evaluate("document.readyState === 'complete'"), "homepage reload");
    },
    async click(selector) {
      await waitFor(() => evaluate(`Boolean(document.querySelector(${JSON.stringify(selector)}))`), `click target ${selector}`);
      const clicked = await evaluate(`(() => {
        const element = document.querySelector(${JSON.stringify(selector)});
        if (!element) return false;
        element.click();
        return true;
      })()`);
      assert.equal(clicked, true, `Could not click ${selector}`);
    },
    async text(selector) {
      return evaluate(`document.querySelector(${JSON.stringify(selector)})?.textContent ?? ''`);
    },
    async has(selector) {
      return evaluate(`Boolean(document.querySelector(${JSON.stringify(selector)}))`);
    },
    async setText(selector, value) {
      const changed = await evaluate(`(() => {
        const element = document.querySelector(${JSON.stringify(selector)});
        if (!element) return false;
        const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set;
        setter?.call(element, ${JSON.stringify(value)});
        element.dispatchEvent(new Event('input', { bubbles: true }));
        return true;
      })()`);
      assert.equal(changed, true, `Could not edit ${selector}`);
    },
  };
}

function calendarFixture(events) {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date()).filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
  const currentDate = `${parts.year}-${parts.month}-${parts.day}`;
  return {
    currentDate,
    month: `${parts.year}-${parts.month}`,
    timeZone,
    events: events.map((event, index) => ({
      id: `test-event-${index + 1}`,
      summary: event.summary ?? "Regression test event",
      start: event.start ?? `${currentDate}T10:00:00`,
      end: event.end ?? `${currentDate}T11:00:00`,
      allDay: false,
      htmlLink: null,
    })),
  };
}

async function run() {
  const apiHealth = await getJson(`${apiUrl}/api/healthz`);
  assert.equal(apiHealth.status, "ok", "API server health check did not return ok");

  const browser = await startBrowser();
  const page = createPageController(browser);
  let calendarResponse = { status: 200, body: JSON.stringify(calendarFixture([])) };
  let holdNextCalendarRequest = false;
  let heldRequest;

  browser.connection.on("Fetch.requestPaused", async (params, eventSessionId) => {
    if (eventSessionId !== browser.sessionId) return;
    if (!params.request.url.includes("/api/calendar/summary")) {
      await browser.connection.command("Fetch.continueRequest", { requestId: params.requestId }, browser.sessionId);
      return;
    }
    if (holdNextCalendarRequest) {
      heldRequest = params.requestId;
      holdNextCalendarRequest = false;
      return;
    }
    await browser.connection.command("Fetch.fulfillRequest", {
      requestId: params.requestId,
      responseCode: calendarResponse.status,
      responsePhrase: calendarResponse.status === 200 ? "OK" : "Bad Gateway",
      responseHeaders: [{ name: "Content-Type", value: "application/json" }],
      body: Buffer.from(calendarResponse.body).toString("base64"),
    }, browser.sessionId);
  });

  try {
    await browser.connection.command("Fetch.enable", {
      patterns: [{ urlPattern: "*://*/api/calendar/summary*" }],
    }, browser.sessionId);

    const fixture = calendarFixture([{ summary: "Today is a test event" }]);
    calendarResponse = { status: 200, body: JSON.stringify(fixture) };
    holdNextCalendarRequest = true;
    await page.navigate();
    await page.click('[data-testid="button-enter-world"]');
    await waitFor(async () => (await page.text('[data-testid="mini-calendar"]'))?.includes("SYNCING..."), "calendar loading state");
    await waitFor(() => Boolean(heldRequest), "intercepted calendar request");

    await browser.connection.command("Fetch.fulfillRequest", {
      requestId: heldRequest,
      responseCode: 200,
      responsePhrase: "OK",
      responseHeaders: [{ name: "Content-Type", value: "application/json" }],
      body: Buffer.from(calendarResponse.body).toString("base64"),
    }, browser.sessionId);
    heldRequest = undefined;
    await waitFor(async () => (await page.text('[data-testid="mini-calendar"]'))?.includes("LIVE"), "calendar success state");

    const monthLabel = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: fixture.timeZone }).format(new Date(`${fixture.month}-01T00:00:00Z`));
    assert.match(await page.text('[data-testid="mini-calendar"]'), new RegExp(monthLabel));
    assert.match(await page.text('[data-testid="mini-calendar"]'), /1 event this month/);
    assert.equal(await page.has(`[data-testid="calendar-day-${fixture.currentDate}"][data-today="true"][data-event-day="true"]`), true, "today/event day indicator was not rendered");

    calendarResponse = { status: 200, body: JSON.stringify(calendarFixture([])) };
    await page.reload();
    await page.click('[data-testid="button-enter-world"]');
    await waitFor(async () => (await page.text('[data-testid="mini-calendar"]'))?.includes("no events this month"), "calendar empty state");

    calendarResponse = { status: 502, body: JSON.stringify({ error: "Google Calendar is unavailable right now." }) };
    await page.reload();
    await page.click('[data-testid="button-enter-world"]');
    await waitFor(async () => (await page.text('[data-testid="mini-calendar"]'))?.includes("OFFLINE"), "calendar provider-error state");
    assert.match(await page.text('[data-testid="mini-calendar"]'), /calendar needs a reconnect/);

    calendarResponse = { status: 200, body: JSON.stringify(calendarFixture([])) };
    await page.reload();
    await page.click('[data-testid="button-enter-world"]');
    await waitFor(async () => (await page.text('[data-testid="mini-calendar"]'))?.includes("LIVE"), "calendar reset state");

    await page.click('[data-testid="button-create-mood-note"]');
    await waitFor(() => page.has('[data-testid="mood-note-window"]'), "mood note window");
    await page.setText('[data-testid="input-mood-note"]', "A saved regression note");
    await page.click('[data-testid="button-save-mood-note"]');
    await waitFor(async () => (await page.text('[data-testid="button-create-mood-note"]'))?.includes("A saved regression note"), "saved note preview");

    await page.reload();
    await page.click('[data-testid="button-enter-world"]');
    await waitFor(async () => (await page.text('[data-testid="button-create-mood-note"]'))?.includes("A saved regression note"), "saved note after reload");

    await page.click('[data-testid="button-create-mood-note"]');
    await waitFor(() => page.has('[data-testid="mood-note-window"]'), "reopened mood note window");
    await page.setText('[data-testid="input-mood-note"]', "This should be cancelled");
    await page.click('[data-testid="button-cancel-mood-note"]');
    assert.equal(await page.has('[data-testid="mood-note-window"]'), false, "cancel did not close the note window");
    assert.match(await page.text('[data-testid="button-create-mood-note"]'), /A saved regression note/);
    const storedNote = await page.evaluate("JSON.parse(localStorage.getItem('mai-anh-mood-note')).text");
    assert.equal(storedNote, "A saved regression note", "cancel changed the persisted note");

    console.log("Homepage regression checks passed: API health, calendar loading/success/empty/error, and mood note save/reload/cancel.");
  } finally {
    await browser.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
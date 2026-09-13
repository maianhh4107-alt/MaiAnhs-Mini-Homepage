import { Router, type IRouter } from "express";
import { ReplitConnectors } from "@replit/connectors-sdk";
import { GetCalendarSummaryQueryParams, GetCalendarSummaryResponse } from "@workspace/api-zod";

type GoogleCalendarItem = {
  id?: string;
  status?: string;
  summary?: string;
  start?: { date?: string; dateTime?: string };
  end?: { date?: string; dateTime?: string };
  htmlLink?: string;
};

type GoogleCalendarResponse = {
  items?: GoogleCalendarItem[];
};

const router: IRouter = Router();

function getSafeTimeZone(value: unknown) {
  const candidate = typeof value === "string" && value.trim() ? value : "UTC";
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: candidate }).format();
    return candidate;
  } catch {
    return "UTC";
  }
}

function getZonedDateParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  return Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value])) as {
    year: string;
    month: string;
    day: string;
  };
}

function toMonthBounds(date: Date, timeZone: string) {
  const parts = getZonedDateParts(date, timeZone);
  const year = Number(parts.year);
  const month = Number(parts.month);
  const getOffset = (utcDate: Date) => {
    const offset = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "longOffset",
      hour: "2-digit",
      minute: "2-digit",
    }).formatToParts(utcDate).find((part) => part.type === "timeZoneName")?.value;
    return offset && offset !== "GMT" ? offset.replace("GMT", "") : "+00:00";
  };
  const firstDayUtc = new Date(Date.UTC(year, month - 1, 1, 12));
  const nextMonthUtc = new Date(Date.UTC(year, month, 1, 12));
  const firstDayIso = `${parts.year}-${parts.month}-01T00:00:00${getOffset(firstDayUtc)}`;
  const nextMonthIso = `${year + (month === 12 ? 1 : 0)}-${String(month === 12 ? 1 : month + 1).padStart(2, "0")}-01T00:00:00${getOffset(nextMonthUtc)}`;
  return {
    currentDate: `${parts.year}-${parts.month}-${parts.day}`,
    month: `${parts.year}-${parts.month}`,
    timeMin: new Date(firstDayIso).toISOString(),
    timeMax: new Date(nextMonthIso).toISOString(),
  };
}

router.get("/calendar/summary", async (req, res) => {
  const parsedQuery = GetCalendarSummaryQueryParams.safeParse(req.query);
  const timeZone = getSafeTimeZone(parsedQuery.success ? parsedQuery.data.timeZone : undefined);
  const bounds = toMonthBounds(new Date(), timeZone);

  try {
    const connectors = new ReplitConnectors();
    const params = new URLSearchParams({
      timeMin: bounds.timeMin,
      timeMax: bounds.timeMax,
      timeZone,
      singleEvents: "true",
      orderBy: "startTime",
      showDeleted: "false",
      maxResults: "250",
      fields: "items(id,status,summary,start,end,htmlLink)",
    });
    const response = await connectors.proxy(
      "google-calendar",
      `/calendar/v3/calendars/primary/events?${params.toString()}`,
      { method: "GET" },
    );

    if (!response.ok) {
      req.log.error({ status: response.status }, "Google Calendar request failed");
      return res.status(502).json({ error: "Google Calendar is unavailable right now." });
    }

    const payload = await response.json() as GoogleCalendarResponse;
    const events = (payload.items ?? [])
      .filter((item) => item.id && item.status !== "cancelled" && item.start && item.end)
      .map((item) => ({
        id: item.id as string,
        summary: item.summary?.trim() || "Untitled event",
        start: item.start?.dateTime ?? item.start?.date ?? "",
        end: item.end?.dateTime ?? item.end?.date ?? "",
        allDay: Boolean(item.start?.date),
        htmlLink: item.htmlLink ?? null,
      }))
      .filter((item) => item.start && item.end);

    const data = GetCalendarSummaryResponse.parse({
      currentDate: bounds.currentDate,
      month: bounds.month,
      timeZone,
      events,
    });
    return res.json(data);
  } catch (error) {
    req.log.error({ err: error }, "Unable to load Google Calendar");
    return res.status(502).json({ error: "Google Calendar is unavailable right now." });
  }
});

export default router;
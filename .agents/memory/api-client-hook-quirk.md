---
name: Generated API hook quirk
description: The generated React Query client can trigger an invalid-hook-call error in this workspace when used directly by the homepage.
---

Prefer a small component-local fetch wrapper for simple homepage reads when the generated API hook causes a runtime invalid-hook-call error. Keep the OpenAPI contract and generated types in sync even when the UI uses fetch.

**Why:** The generated calendar hook produced a runtime hook error in the existing Vite setup, while the equivalent relative fetch worked with the same API contract.

**How to apply:** If a generated hook is introduced into this artifact, verify it inside the actual preview before replacing the working fetch path.
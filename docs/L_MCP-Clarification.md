# MCP Clarification

This note explains what MCP (Model Context Protocol) is in this setup, and how it differs from me using **external documentation / websites / repos**.

---

## What MCP Is

**MCP (Model Context Protocol)** is a protocol that lets an AI connect to external **tools or data sources** in a structured way.

In this workspace, MCP servers can:

- Provide access to things like:
  - Memory / notes
  - Local project resources
  - Other services exposed through the protocol
- Be called as **tools** (e.g., `memory` server) to:
  - Store and retrieve information
  - Read resources they expose

In short:

> MCP is a way to plug the AI into extra tools or data, not a specific documentation source by itself.

Whether those tools expose **local documents**, **APIs**, or some other data depends on how each MCP server is implemented.

---

## MCP vs Local Files in Your Repo

Your project files (like this `docs/` folder) are **not automatically an MCP server**.

I can read them using IDE/FS tools (like `read_file`) provided by Cascade, not via MCP. MCP is more like a plugin system for extra capabilities.

So:

- When you want me to use **your local docs**:
  - Point me to the file(s), e.g. `docs/FEAT_A-B-loopopoints.md`.
  - I’ll open them via the workspace file tools (not necessarily via MCP).

Example phrasing:

> “Refer to `docs/FEAT_A-B-loopopoints.md` and update it with X.”
> “Before designing this feature, read `README.md` and `docs/Git-Review.md`.”

---

## MCP vs External Documentation (Web, GitHub, etc.)

When you want me to use **external resources** like official Chrome extension docs, MDN, or GitHub repos, that’s **separate** from MCP.

Depending on the tools available, I can:

- Call a **web search / URL-reading tool** to fetch:
  - Official docs (e.g., developer.chrome.com, MDN).
  - Code examples from public repositories.
- Use those as context while designing or reviewing code.

This is not "MCP" in concept; it’s simply “use the web/search tools.” MCP is just one possible mechanism to hook such tools up.

Example phrasing for external docs:

> “Please consult the official Chrome extension docs for content scripts and update the design accordingly.”
> “Search for best practices for A/B loop in HTML5 video and apply them here.”
> “Look at how similar features are implemented in popular open‑source Chrome extensions and summarize relevant patterns.”

---

## How to Ask for Each Type of Context

### 1. Use my local docs / repo context

Use language like:

- "Read `docs/FEAT_A-B-loopopoints.md` and `README.md` before you propose any code changes."
- "Use existing patterns from `content.js` and don’t introduce new architectures." (You already asked for this in your global rules.)

I’ll:

- Open those files via IDE tools.
- Base my suggestions on your current implementation and docs.

### 2. Use external docs / web context

Use language like:

- "Consult external documentation / official Chrome extension docs for best practices before designing this."
- "Use MDN for the right behavior of `HTMLMediaElement` events (e.g., `timeupdate`), and then design the loop logic."
- "Look at external examples of A/B loop features in public repos and adapt the ideas (not copy/paste)."

I’ll then:

- Use search / URL-reading tools to pull in external context.
- Cross‑check our approach against those references.

### 3. MCP-specific requests

If you explicitly want to use MCP features (like stored memories or specialized MCP tools), you can say:

- "Store this workflow in memory so we can reuse it later."
- "Retrieve previous notes about Git workflows from memory."

Those are backed by the **`memory` MCP server**, not by external docs.

---

## TL;DR

- **MCP** is a protocol to connect AI ↔ tools/data (e.g., a memory server). It’s *not* synonymous with web docs.
- **Local project files** (like `docs/` and `content.js`) are accessed via the IDE/workspace tools, not necessarily via MCP.
- **External documentation and repos** are reached via web/search tools.

To guide me:

- Say **“use the local docs / these files”** when you want me to rely on your repo’s documentation.
- Say **“consult external docs / official docs / MDN / GitHub examples”** when you want me to bring in outside context.
- Mention **MCP/memory** when you want me to store or retrieve structured notes/knowledge tied to this project.

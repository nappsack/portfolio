# Ask-me-anything chat

A chat widget on every page of chrisnappi.com. Visitors ask questions about
Chris's experience; Claude answers from a curated knowledge file.

## How it works

There is no database and no search index. The entire knowledge base — about
17,000 tokens — is sent to Claude with every question. At this size that is
both cheaper and more accurate than retrieval, because the model always sees
everything rather than guessing which excerpt is relevant.

```
visitor types a question
  → chat.js POSTs the conversation to /api/chat
  → netlify/functions/chat.mjs prepends kb-public.md + the rules prompt
  → Claude streams an answer back
  → chat.js renders it as it arrives
```

The API key lives only in Netlify's environment. It never reaches the browser.

## Files

| File | What it is |
|---|---|
| `kb-public.md` | **Generated — do not hand-edit.** The only thing the bot knows. |
| `netlify/functions/chat.mjs` | The server side: limits, rules prompt, Claude call |
| `chat.js` / `chat.css` | The widget |
| `~/.thinkos/scripts/kb_public.py` | Regenerates `kb-public.md` from the vault |

## Updating what the bot knows

Edit the career vault, then:

```bash
python3 ~/.thinkos/scripts/kb_public.py
git add kb-public.md && git commit -m "Update chat knowledge base" && git push
```

The generator only publishes material that passes an explicit gate:

- **Accomplishments** — only entries tagged `Sensitivity: public` in the vault
  ledger. Currently 18 of 33 qualify; the other 15 are withheld.
- **Case studies** — only the published narrative in each `case studies/<name>/`
  folder. Internal working files are named in a blocklist and never read.
- **Bio and timeline** — hand-written inside the generator script.

Two safety nets run before anything is written. A pattern list aborts the build
if client financials, personal contact details, or other flagged material
appear. A separate check aborts if any real colleague's name survives the
scrub — ledger entries name people freely, and those are replaced with role
descriptions ("Meevo's design system owner") before publication.

If the generator aborts, it prints exactly what tripped it. Fix the source, do
not weaken the check.

> The generator reads `case studies/meevo/`, which is gitignored. Run it
> locally, where that folder exists.

## Cost and limits

Model is `claude-opus-5`. About **$0.09 per question** cold — 17,400 input
tokens at $5/M plus a short answer at $25/M — dropping to roughly **$0.02** for
follow-ups asked within five minutes, while Claude's prompt cache is still warm.
Since anyone who asks one question usually asks two or three, expect an average
nearer $0.04. Two hundred questions a month is about $8.

Guards, all in `chat.mjs`:

| Guard | Value |
|---|---|
| Questions per visitor per hour | 15 |
| Messages per conversation | 12 |
| Characters per question | 1,000 |
| Answer length | 1,000 tokens |

Set a **monthly spend limit** in the Anthropic console as well. The guards above
bound normal abuse; the spend limit is what bounds the case nobody predicted.

## First deploy

1. Create an API key at console.anthropic.com.
2. Set a monthly spend limit on that account.
3. In Netlify: **Site settings → Environment variables** → add
   `ANTHROPIC_API_KEY`.
4. Push. Netlify installs dependencies and picks up the function automatically.

Verify with:

```bash
curl -N https://chrisnappi.com/api/chat \
  -H 'content-type: application/json' \
  -d '{"messages":[{"role":"user","content":"What does Chris do?"}]}'
```

You should see a stream of `data: {"text":"..."}` lines.

## Local development

```bash
npm install -g netlify-cli   # once
export ANTHROPIC_API_KEY=sk-ant-...
netlify dev
```

Opening the site with a plain static server also works — the widget renders and
shows its error state, since `/api/chat` won't exist.

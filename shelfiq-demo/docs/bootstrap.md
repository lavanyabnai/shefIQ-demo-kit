# ShelfIQ Demo — Session 0: Bootstrap

This is the work you do before Session 1 of `claude-code-prompts.md`. Estimated time: 15 minutes.

---

## 1. Unzip into your project directory

```bash
cd ~/code
unzip ShelfIQ-demo-kit.zip       # extracts ./shelfiq-demo/
cd shelfiq-demo
ls -la
```

You should see:

```
shelfiq-demo/
├── CLAUDE.md                    ← repo-level Claude Code instructions
├── README.md                    ← human orientation
└── docs/
    ├── bootstrap.md             ← this file
    ├── demo-brief.md            ← the narrative spec
    ├── spec.md                  ← the technical contract
    ├── claude-code-prompts.md   ← 5 session prompts
    ├── decisions/               ← empty; populated as you go
    └── wireframe/               ← visual reference (open ShelfIQ.html)
```

Claude Code will create `apps/web/` in Session 1.

---

## 2. Verify the wireframe loads

```bash
cd docs/wireframe
python3 -m http.server 8765 &
# Open http://localhost:8765/ShelfIQ.html in a browser
# Click around to refresh your memory of the visual structure
kill %1
cd ../..
```

---

## 3. Get the Anthropic API key ready

The agent in Session 5 calls `claude-sonnet-4-5` via the Anthropic API. You need an API key.

- If you're on the Anthropic Console: https://console.anthropic.com → API Keys → Create.
- Add ~$10 of credit to the account. The demo build itself will burn maybe $0.50; the dry-runs and the live demo together will use ~$2.

Stash the key somewhere safe for now. Session 5 will ask for it.

---

## 4. Install prerequisites

```bash
node --version       # need ≥20
pnpm --version       # need ≥9; install via: npm i -g pnpm
claude --version     # install via: npm i -g @anthropic-ai/claude-code
```

If you're missing any of these, install them now.

---

## 5. Initialize git (optional but recommended)

```bash
git init
git branch -M main
cat > .gitignore <<EOF
node_modules/
.next/
.env.local
.env*.local
dist/
.DS_Store
*.log
EOF
git add .
git commit -m "chore: bootstrap demo kit"
```

You'll want commits per session so you can rewind if a session goes sideways.

---

## 6. Open Claude Code and verify

From the `shelfiq-demo/` directory:

```bash
claude
```

Ask it:

> Confirm you've read CLAUDE.md and list the three docs you'll reference at the start of every session.

It should reply with `docs/demo-brief.md`, `docs/spec.md`, `docs/claude-code-prompts.md`.

---

## 7. Sanity check before Session 1

- [ ] `shelfiq-demo/CLAUDE.md` exists
- [ ] `shelfiq-demo/docs/{bootstrap,demo-brief,spec,claude-code-prompts}.md` all exist
- [ ] `shelfiq-demo/docs/wireframe/ShelfIQ.html` loaded in a browser successfully
- [ ] `claude` runs and confirms it read CLAUDE.md
- [ ] You have an Anthropic API key in a safe place

If all five pass, you're ready for Session 1.

---

## 8. How to run a session

Each of the 5 sessions in `docs/claude-code-prompts.md` is one Claude Code conversation. The pattern:

1. Start a **fresh** Claude Code conversation in the `shelfiq-demo/` directory
2. Paste the entire Session N prompt block (everything inside the triple-backticks) as your first message
3. Claude Code reads the docs, starts step 1, **stops and summarizes after step 1**
4. Review the summary. Reply "continue" if correct, or note corrections
5. Repeat until all numbered steps in that session are done
6. Verify the session-end demo described in the prompt before starting the next session
7. Commit: `git add . && git commit -m "feat: session N — <epic>"`
8. Start a new conversation for the next session

**Don't compress two sessions into one.** Each one needs the full token budget for the codebase.

---

## 9. Time budget

| Day | Activity |
|---|---|
| 1 | Bootstrap + Session 1 (half-day) |
| 2-3 | Session 2 (all non-editor screens) |
| 4-7 | Session 3 (editor canvas — the big one) |
| 8-9 | Session 4 (what-if, compare) |
| 10-11 | Session 5 (agent + polish) |
| 12 | Dry run #1 (alone) — fix what you see |
| 13 | Dry run #2 (with a colleague) — fix what they see |
| 14 | Demo |

If a session takes longer than budgeted, **cut scope on later sessions, not earlier ones.** Foundations have to be solid; the agent can fall back to scripted responses if needed.

---

## 10. What success looks like

After Session 5, you can:

1. Run `pnpm dev` and open `http://localhost:3000`
2. Walk through all three journeys from `docs/demo-brief.md` end-to-end
3. Each journey takes about 3 minutes of demo time, with no broken UI, no console errors, no spinners
4. Use the `?demo=` URL params to jump to any journey mid-flow
5. With `DEMO_FALLBACK=true`, the agent works without internet

If all five pass, you have a demo. Good luck.

---

## Known limitations to be aware of

These are deliberate trade-offs, not bugs:

1. **State resets on page refresh.** No persistence. The demo URL params restore narrative state, not user state.
2. **No real PSA parser.** The import button toasts success and pre-loads a fixture.
3. **No real PDF generation.** The export button downloads a pre-made sample PDF.
4. **The agent has no real tool calls in v1.** The "tool call" UI is faked for show. The model's text response is real.
5. **No mobile editor.** The editor checks viewport width on mount; if <1024px, it shows a "Desktop required" page. Dashboard and lists work on mobile.
6. **Only one fixture type has a working canvas: cold-vault.** Gondola, endcap, roller grill etc. show as cards in the fixtures list but can't be edited in the demo. That's fine — the demo only uses cold-vault fixtures.

If the audience asks about any of these, the pre-baked honest answers are in `docs/demo-brief.md §"What we explicitly skip"`.

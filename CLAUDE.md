# CLAUDE.md

Behavioral guidelines to reduce common AI coding mistakes. Merge with project-specific instructions as needed.

**Project:** GoLazy / LazyGames Web Hub

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Project Memory
Full architecture reference and project details are in `PROJECT_MEMORY.md` in this folder.  
Read it at session start instead of guessing the project structure.  
When you discover new gotchas, components, or systems, append them to `PROJECT_MEMORY.md`. 

## 2. Session Start Protocol
When the user describes a task:
1. Read `PROJECT_MEMORY.md` (this folder) for architecture context, tech stack, and design philosophy.
2. Identify relevant files and components before touching anything.
3. Consider the impact on the Next.js App Router structure and Vercel hosting constraints.
4. Only then write or edit code.

## 3. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 4. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 5. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 6. Code Standards
- Adhere strictly to the Next.js App Router structure (`src/app/`, `src/components/`, etc.).
- Use TypeScript strictly. Prevent `any` types where possible.
- Use Tailwind CSS v4 utility classes and Framer Motion for animations.
- Early returns on their own line, never compressed:
  ```typescript
  if (!condition) {
      return;
  }
  ```
- No comments unless asked.
- Ensure all new pages meet the Premium Design standard (vibrant colors, glassmorphism, dynamic animations).

## 7. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write logic for invalid inputs, then test via UI"
- "Fix the bug" → "Reproduce the bug locally, then verify the fix works"
- "Refactor X" → "Ensure functionality and UI look identical before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

## 8. Delivery
- Deliver code changes efficiently — no over-explaining standard React/Next.js concepts.
- State which files were modified when showing edits.
- Explanations only when asked or for non-obvious logic.
- Test via the local Next.js dev server (`npm run dev`) or build (`npm run build`) before delivering, to ensure there are no TS/Lint errors.
- Batch all related file changes and identify affected files upfront.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
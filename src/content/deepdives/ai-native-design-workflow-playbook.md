---
title: "The AI-Native Design Playbook"
description: "Buzzvil's October 2026 playbook for AI-native design: explore and deliver, three delivery paths, designer review, the design harness, hiring, and team results."
date: 2026-04-23T10:00:00+09:00
draft: false
featured: true
featured_order: 1
featured_image: "/images/ai-native-design-workflow-playbook.png"
tags: ["ai-design", "design-systems", "product-strategy", "workflow", "engineering"]
---

<!-- SYNC: canonical source for the AI-Native Design Playbook. Mirrored to design.buzzvil.com (EN+KO) and tech-blog (KO condensed). Edits here should propagate per /Users/max/projects/head/projects/playbook-sync.md -->

**How Buzzvil's design team explores, delivers through pull requests, and reviews what ships.**

*Revised October 2026. This edition adds the product design protocol we wrote in September 2026 (two lanes, three delivery paths and the designer's review), how we hire designers, and current numbers from our own work and from industry research. First published 2026-04-23.*

## Preface

In six months, Buzzvil's design team opened 432 pull requests across our repositories. In the first quarter of 2026, 17% of the team opened PRs. Since the second quarter, every designer has. Figma Dev Mode seats fell from 23 in June 2026 to 3 in July, because the handoff they served stopped happening.[^prs]

This playbook is written for **designers** moving from mockups to pull requests. For **PMs and engineers** who now build UI themselves and need to know how design review works with them. For **leaders** who evaluate and adopt these practices. And for **designers who want to join us**: Part 4 explains how we hire.

A quick note on why this moment matters, before the practical parts.

Design has been through a shift like this before. In 1984 and 1985, the Apple Macintosh, the LaserWriter and Aldus PageMaker arrived, and the graphic design profession split in two. Traditionalists saw desktop publishing as a threat to craft. Anyone with a mouse could now set type, and most of them did it badly. The resistance was real. Experienced designers mourned the loss of specialized typesetters, hand-cut paste-ups, and the hard-earned knowledge that separated a professional from an amateur.[^11]

By the mid-1990s, the transition was complete. The designers who thrived were the ones who saw that the tool changed *what design could be*: faster iteration, direct control over production, and the ability to explore more ideas in less time. The craft moved.

Christopher Alexander described the underlying pattern before it ever reached software. In *The Timeless Way of Building* (1979), he argued that lasting quality comes from shared pattern languages: living systems of rules that anyone can use to produce coherent, beautiful results.[^12] When the patterns are right, the buildings come out right. When the language is shared, the system can grow and keep its character.

Alexander's insight moved from architecture to software, inspiring design patterns, the Wiki, and eventually design systems. It moves again now. The *pattern language* is the design. The AI agent is a new kind of builder, faster and more tireless than any before, and only as good as the patterns it is given. We write those patterns. That is the opportunity.

This playbook describes how we work today and how you can start.


## Part 1: Why Everything Changed

### Execution got cheap. Review became the work.

In March 2026, Jenny Wen, head of design for Claude at Anthropic, appeared on Lenny's Podcast in an episode titled "The design process is dead."[^wen] The episode explains why the classic design process (discovery, then mockups, then iteration) is becoming obsolete, and how engineers are pushing the design role to change.

The data points the same way. Each number below comes with its source, its population and its date:

- On average, 51.9% of code is now AI-authored, across more than 400 companies in Q2 2026 (self-reported).[^dx]
- In 2025, developers on teams with high AI adoption completed 21% more tasks and merged 98% more pull requests, while PR review time rose 91% (telemetry from more than 10,000 developers).[^faros25]
- By Q2 2026, across 22,000 developers, median review time had grown 5x and PR size had grown 51%.[^faros26]
- Median PR size grew from 44 to 72 lines between July 2025 and June 2026.[^dx]
- At Anthropic, code output per engineer grew 200% in a year. With AI code review in place, the share of PRs that received substantive review comments went from 16% to 54%.[^anthropic-review]

One caution. METR, which runs controlled studies of AI and developer speed, wrote in February 2026 that its newest data is "only very weak evidence" of how large the speed-up is.[^metr] Read these numbers as a direction. The direction is clear: writing code got cheap, and reading it became the bottleneck.

Mockup-and-handoff was already slow. Now it's the slowest part of the system.

Design work changed in the same period. On the same episode, Jenny Wen described her own shift: "A few years ago, 60 to 70% of it was mocking and prototyping, but now I feel the mocking up part of it is 30 to 40%."[^wen] [^wong]

At Buzzvil, we went further. My work now starts with user stories, written on paper or in text. I describe intent, constraints, and success criteria. Then I build directly in code with Claude Code, or I direct an agent to do it.

The time that used to go into pixel-perfect compositions now goes into *thinking clearly about what should exist and why.* The visual output still happens, faster and closer to production, and the creative work moved upstream. It lives in a well-written user story, a sharp constraint, a decision about what to leave out.

The whole team works this way now. When delivery moved into code, the handoff channel emptied on its own: Figma Dev Mode seats went from 23 in June 2026 to 3 in July. We asked the engineering teams whether they still needed the seats, and they gave them back.[^prs]

One fix shows the speed. Rina, a designer on our team, noticed that the screen jumped back to the top when an ad overlay closed. Everything still worked, so no QA ticket described it. Working with Claude, Rina traced the jump to a shared hook that reset the scroll position when two overlays locked at once, fixed the root cause, added regression tests and opened a PR. The fix reached production 46 minutes after the PR opened. Because it lived in a shared hook, every partner app that uses the overlay improved at the same time.[^prs]

One designer working this way now covers work that used to need a designer, a frontend engineer, and a sprint cycle. The constraint flipped from "can we build it?" to "should we build it?"

### What design is for now

When production capacity approaches zero cost, design's value shifts from execution to discernment.

This is uncomfortable. Execution fluency (the ability to produce polished mockups, pixel-perfect prototypes, and comprehensive design specs) was the core of the job for two decades. Its value is declining. AI now does that work faster, at a level good enough for most decisions.

What stays with people:
- **Judgment:** deciding what's worth building, and what to leave out
- **Articulation:** making intent precise enough for machines to act on
- **Accountability:** someone still has to be responsible for what ships
- **Discovery:** testing whether something is worth building before committing to production

That last point deserves attention. Marty Cagan separates *building to learn* (discovery) from *building to earn* (delivery).[^14] Discovery tests four risks: value, usability, feasibility, and viability. Delivery has to hold up for real customers: scale, performance, reliability, security, and everything else they depend on. Same word, "testing," with very different meanings on each side.

This distinction used to belong to product managers. Designers mocked up, PMs validated, engineers built. When building was expensive, that division made sense. Now a designer with an AI agent can produce a functional prototype in hours, so the discovery loop is within reach of anyone who builds. Designers who work this way extend their own role into territory that used to be out of reach: testing value and usability directly, with real artifacts, before a sprint gets allocated.

The wider field shows the same move. In a survey of more than 900 designers, published in May 2026, 65% said they are taking on more product or engineering responsibilities, and half had shipped AI-generated code to production.[^designerfund]

### "But AI makes everything look the same"

This is the most common concern, from teammates, from designers online, from anyone who's seen a wave of AI-generated landing pages that all look like the same Tailwind template with the same hero layout and the same gradient blob.

The concern was valid. In 2024 and early 2025, it was true. Unharnessed LLMs default to generic patterns, the statistical average of everything they've seen. When intent is vague, AI fills the gaps with the most common solution. That's how you get sameness.

This problem has a known fix. Tools like [design.md](https://getdesign.md/) showed that you can encode brand voice, visual language, component constraints, and tone directly into the agent's context. CLAUDE.md files, design skills, and hooks create a *design environment*, a controlled space where the AI produces on-brand output.

At Buzzvil, we publish and use across products:
- **A design plugin for the whole company.** Since July 2026, our brand skill ships as the `buzzvil-design` plugin for Claude Code. Its skills cover brand foundations, decks, docs, reports, dashboards, illustrations, icons, web editing and SDK release notes. People across the company, most of them outside design, use it to make on-brand decks, reports and pages.
- **Tokens and a brand kit as the shared engine.** In the first half of 2026 we built `@buzzvil/design-library` for agents to read. In August 2026 we narrowed it to its tokens and brand kit, and in September 2026 we froze its component tier. Components now come from each product's own repository, where the agent sees what the product already uses. The [library docs](https://buzzvil.github.io/design-library/) are public.
- **Hooks and checks that enforce consistency:** Biome lint, spacing conventions, token compliance. If the agent writes a hard-coded hex color, the hook catches it before commit. A craft check also runs before every review (Part 2).

Generic output is a setup problem. A designer who opens Claude Code with no CLAUDE.md, no design tokens and no brand skills will get generic output, the same way an engineer with no linter gets inconsistent code.

The designer's new craft is building the environment. Set the constraints, encode the brand, publish the tokens, write the skills. Then the AI produces *your* design.

### The design system's first reader is an agent

The biggest conceptual leap: your design system's main reader may be an agent.

At Buzzvil, we build interaction modules: gamification recipes for ad campaigns (spin wheels, memory matches, quizzes, timing games). In [The Flip](/blog/the-flip/) (2026-02-28), I wrote down the direction:

> "We're building a design system for an AI agent to use. Not for designers. Not for developers. For an agent."

[A Design System for an Agent](/blog/a-design-system-for-an-agent/) (2026-06-17) shows what that means in practice. Each component carries a manifest: data that tells the agent what the component is for and how it combines with others. A test kitchen then checks each recipe before it ships.

This changes what a design system *is*. Components are answers. An agent needs to understand the questions: inputs, constraints, brand compatibility, behavioral rules. Every principle, every behavioral rule, every constraint has to be written down precisely enough to produce consistent outputs across thousands of compositions.[^6] [^10]

The design system becomes structured knowledge: manifests, rules and recipes an agent can read.


## Part 2: The Workflow

For most of design's history, discovery and delivery lived in the same tool. You explored directions in Figma, presented to stakeholders in Figma, and handed off specs from Figma. The intent changed and the tool stayed the same, so the two modes were hard to see.

AI coding agents make them visible. When a designer can produce a functional prototype in hours, the question becomes "am I exploring or shipping?" Each answer needs its own workflow.

Since the second quarter of 2026, every designer on our team works this way.[^prs] In September 2026 we wrote it down as our product design protocol. It starts with one rule:

**A clear task goes straight to delivery, and an open question gets explored first. Everything delivered is a PR in the real product, and a designer makes the final design call.**

Underneath the rule sits Cagan's split from Part 1: explore is building to learn, and deliver is building to earn.[^14]

### Two lanes: explore and deliver

| | Explore | Deliver |
|---|---|---|
| **Purpose** | Decide whether and what to build | Put it in users' hands |
| **Starts from** | An open question | A clear task, or a yes from exploration |
| **Tools** | Whatever is fastest: Figma, prototypes, AI | Code, the design library, repo skills |
| **Quality bar** | Enough to learn | The craft bar |
| **Ends with** | A decision in the ticket: build, change or stop | A merged PR, tested, then released |
| **The work afterwards** | Left behind once decided | Lives in the product |

**Exploration is optional.** Use it when the question is open: is this worth building, and what should it be? A clear task skips it.

In the explore lane, use whatever reaches the answer fastest. Figma is still the best tool we know for spreading eight directions across one surface and comparing them at a glance. Code is linear: once you invest in one direction, you start to defend it. Treat every exploration artifact as something you leave behind once the decision is made.

**Keep the lanes apart.** Work that sits between them gets done twice: a prototype built to learn, redrawn as a spec, then rebuilt for production. Once the answer is yes, delivery starts in the real product. Our first prototypes lived in Figma Make, then as HTML pages on Vercel. They served exploration well and failed at delivery, because a prototype outside the repository knows nothing about our tokens, components or data. It took us about two months to accept that.[^prs]

**Stopping is a good result.** An exploration that ends in "no" saved the delivery lane weeks.

The honest cost: the lanes blur. A designer can build something functional in an afternoon, and then keeps polishing an exploration prototype because it already looks real. Ask your designer which lane they are in right now. A designer who cannot answer is doing both jobs at once.[^prs]

### Three delivery paths

**Designer owns it.** The default for designers. Spot the problem, or take the ticket, and carry it all the way: build the fix in code with AI, get the code reviewed, ship it, and check it live. One person, from problem to production. In late September 2026 this path opened into our native ad SDKs for iOS and Android: designers make UI-only changes with AI and open PRs, and client engineers review them for stability. That work is a pilot today.

**PM or engineer builds, designer reviews.** For UI changes on existing screens: copy, states, layout, small flows. The PM or engineer builds with the design library and the repo's design skills, and opens the PR. The designer of that surface reviews it and makes the final design call. We want more of this path: the person closest to the problem ships the fastest.

**Build together.** For new screens that need data, logic or tracking. The designer builds the UI PR in the real product. The engineer adds data, logic and tracking on the same branch, or in a PR that links it. The designer checks the result before merge. A designer can also open a full UI as a reference PR, and engineers build the implementation from it. Design, frontend and backend PRs often stack and get reviewed together.

### How a designer delivers

1. **Write the intent.** Capture what should exist and why: a user story, a set of constraints, a short description. Paper works. A markdown file works. Precision matters more than format.
2. **Start in the real repository, on a branch.** Ask Claude Code to explain the screen, its components, its tokens and its states before you change anything. A loose HTML file feels safe, but the agent then works with none of the product's context.
3. **Build, and check every state.** Describe the change in plain words, with a screenshot or a Figma link when it helps. Run the app and look at loading, empty, error and a narrow screen.
4. **Run the checks and open a draft PR.** The repository's checks and a pre-PR review run first. The PR description says what changed and why, from a designer's point of view.
5. **Add a preview link.** A branch with a shareable preview URL turns a PR into something a PM can click.
6. **Get it reviewed and merge.** Engineers review the code, and the PR merges after their approval.

Merging hands the change to the project's own release path. In product repositories, engineers own deploys. A PR is a proposal: nothing goes live before an engineer approves.

Delivery happens in code: components, page layout, responsive behavior. The PR is the spec. Figma stays in the explore lane, where it is strong: comparing directions, presenting options before committing, and brand, illustration and visual identity work.

### The designer's review

| Outcome | When | What the designer does |
|---|---|---|
| **Approve** | It meets the bar | Approves the PR |
| **Fix** | Small gaps: spacing, tokens, copy, a missing state | Pushes the fix to the same branch and notes what changed |
| **Send back** | The direction or the problem is unclear | Comments with the reason, and suggests building together when the change is bigger than it looked |

- Review happens within one working day.
- UI PRs merge with the designer's approval. Engineering reviews the code as usual.
- The craft check and an AI reviewer go through the PR first, so the designer's time goes to flow, copy and feel.

This is the rule we work to, and we are still building the habit across every team that ships UI. In September 2026 I described the idea in two sentences: "It is the exact mirror of code review. You review our logic, we review your interface."[^prs]

### The craft bar

A shared standard has to be written down. Our craft bar covers five groups: system fidelity, states and content, motion and feedback, device and performance, and handoff.

A script checks the mechanical half before a person looks: hard-coded colors outside the tokens, type under 12px on product surfaces, support for reduced motion and no endless scale loops, image weight, and accessible names. Each finding carries a file and a line, so it pastes straight into the PR. An AI reviewer then reads UI PRs against the bar and returns its findings with file and line. Designers answer each finding before they mark a PR ready.

When we audited our own UI PRs in October 2026, one pattern was clear: bigger UI changes miss more details, whoever writes them. Most misses can be caught by tools and habits, and a smaller share needs a designer's eye. So we fix a repeated defect once, in the shared component, and every surface that uses it gets the fix.

### Early testing and release

Before public release, the team tests the change: self tests, or early users through a flag or a beta. When the PM judges the team is confident, the PM or product designer updates the product page with Claude and our brand skill. The page can go live ahead of the public release, after our marketing team reviews the content.

Partner customizations follow the same lanes, with a delivery format that matches how each partner finalizes. Partners who finalize in their own tools receive a Figma file made from our code. A skill draws that file from the preview PR and reuses the components and styles already in Figma.

### Tools in October 2026

Our own data comes first. After the drop described in Part 1, Figma Dev Mode seats stood at 4 in August 2026. The fourth seat serves one partner project that still runs a Figma-first handoff.[^prs] The same article says it plainly: "Figma never held our design system. It held a copy of one." The system lives in the codebase, where the product is made.

Dev Mode came from the handoff era: designers drew a specification, and engineers read it and rebuilt it by hand. Code Connect maps Figma components to code components, and through Figma's MCP server it now "keeps your generated code consistent with your codebase."[^figma-mcp]

The market moved toward code during 2026:

- **Figma** opened the canvas to agents on 2026-03-24, in beta: agents can now write directly to Figma files.[^figma-agents] At Config on 2026-06-24, Figma announced code layers, which bring interactive code onto the canvas from a GitHub repository or a local folder (closed beta).[^figma-code] Figma Make can connect to a GitHub repository, edit the running app and open pull requests (closed beta), after an engineer configures the repository.[^figma-make] The Figma agent left beta on 2026-10-06.[^figma-whatsnew]
- **Paper** raised a $34M Series A on 2026-07-22. It renders with HTML and CSS "because they form a natural language for agents."[^paper]
- **Stitch**, from Google Labs, streams its designs to the canvas in real time, can start from an existing codebase and design files, and exports screens to Google Antigravity for backend logic (2026-05-19).[^stitch]
- **Cursor Design Mode** edits the running product: you pick an element, and the agent receives its component, its computed styles and a screenshot (2026-06-05).[^cursor]
- **Claude Design** launched on 2026-04-17. It builds a team's design system by reading the codebase and design files, and packages designs into a handoff bundle for Claude Code.[^claude-design] Since 2026-06-17 it imports design systems from a GitHub repository, checks its output against them, and connects to Claude Code through `/design` and `/design-sync`.[^claude-design-brand] Since September 2026 it works inside any Claude conversation, and on 2026-10-08 it left beta on every Claude plan, Free included.[^claude-design-ga]

Our position stays simple. Whatever tool explores, delivery lands as a PR in the product repository, where the agent can see the tokens, components, data and conventions the product already has.


## Part 3: Setting Up the Environment

This is where most teams fail. They try the workflow from Part 2 without the infrastructure, get generic output, and conclude "AI can't do design." The environment decides the quality of the output.

### Before the first designer PR

A motivated designer cannot set this up alone. Someone has to settle these first:

- **A company-approved LLM,** with a reviewed agreement on how source code sent to the model is handled, signed off by security.
- **Write access to production repositories for people outside engineering.** This is a policy decision, and it belongs to the team that owns each repository.
- **A security review of that decision:** who can merge, which branch protections apply, whether a branch can reach secrets, and what happens when a bad change lands.
- **CI that runs branches from non-engineers,** with preview environments added last.
- **A written review policy:** who reviews design PRs, and how that review fits into their sprint.

For us this took months, and most of the work sat with DevOps, security and engineering leads. Start these conversations early and in parallel, because each one has a different owner.[^prs]

### The five-layer harness

An AI coding agent is like a fast, tireless junior developer. Talented, and in need of structure.

Without guardrails, the agent produces generic output, makes decisions you didn't authorize, and drifts from your system. With the right structure, it becomes a strong collaborator. Research supports this: in a study of 10 repositories and 124 pull requests, AGENTS.md files were associated with 28.64% lower median runtime and 16.58% fewer output tokens, with comparable task completion.[^agentsmd]

**1. Standing Orders (CLAUDE.md)**

A markdown file at the root of every repository. The agent reads it on every session start. It contains:
- Project context and architecture
- Coding conventions and patterns
- What to do and what never to do
- File structure and naming rules

This is the most important file in the repo for AI-native development. Its value grows over time: every convention you write down saves many corrections later.

**2. Skills**

Reusable playbooks for recurring tasks. Our company-wide `buzzvil-design` plugin carries skills for brand foundations, decks, docs, reports, dashboards, illustrations, icons, web editing and SDK release notes. Product repositories add their own design skills: one finds similar components and tokens before you build new UI, one reviews the branch before a PR, and one writes and opens the PR. Other teams at Buzzvil publish their own skills in the same internal marketplace.

A skill tells the agent *how* to approach a category of work. It keeps craft knowledge in the repository, where everyone can use it. When you explain the same thing a third time, ask Claude to make it a skill.

**3. Memory**

Persistent notes the agent maintains across sessions. Patterns confirmed over multiple interactions, architectural decisions, user preferences. The agent builds institutional knowledge over time.

**4. Permissions**

An allowlist of what the agent can do on its own and what requires human approval. File writes, git operations, external API calls: each has an explicit permission level.

**5. Hooks**

Automated checks that run on specific events: before commit, after file write, on session start. At Buzzvil, hooks enforce:
- Biome lint and formatting
- TypeScript type checking
- Spacing conventions
- Destructive operation warnings

Before review, the craft check from Part 2 adds hard-coded colors, type under 12px, reduced motion, image weight and accessible names.

The principle: *silent on success, loud on failure.* The agent works freely within the guardrails. When it hits a boundary, it stops and asks.

Anthropic's own guide to Claude Code names verification as its most impactful tip: give the agent a way to check its own output.[^13] If you adopt one practice from this playbook, make it this one: set up hooks that verify before commit. Everything else builds on it.

### Tokens as the shared language

The design system is the material the surfaces are made of.

At Buzzvil, every color, spacing value, typography scale, and shadow exists as a semantic CSS variable generated from OKLCH color space. The token system has three layers:

1. **Primitives:** raw values (OKLCH lightness, chroma, hue)
2. **Semantic:** intent-based (action-primary, surface-default, text-muted)
3. **Component:** specific to elements (button-bg, card-border)

When the agent builds a page, it uses semantic tokens. When it builds a component, it uses component tokens. Hardcoded values look wrong because everything around them is systematic.

Tool makers now build on the same idea. Figma's MCP server uses Code Connect to keep generated code consistent with the codebase,[^figma-mcp] and Claude Design pulls a team's design system in through `/design-sync`.[^claude-design-brand] Format matters too. Diana Wolosin at Indeed tested 8 MCP configurations across 1,056 prompts, and JSON came out ahead: higher accuracy, 80% fewer tokens and 5x lower annual cost.[^10]

### Principles → Recipes → Guidelines

When an agent composes interfaces, it needs three layers of instruction. Cristian Morales Achiardi at the Design Systems Collective describes this direction as an "agentic design system."[^6]

**Principles** are non-negotiable constraints. "Never use red as a background fill." "All interactive elements must have a minimum 44px touch target." "Type on product surfaces is 12px or larger." These stay the same in every context.

**Recipes** are validated patterns for known contexts. "A campaign interaction follows Hook → Challenge → Reward → Offer." "An advertiser landing page leads with trust metrics, then case study, then CTA." Recipes encode proven solutions.

**Guidelines** are granular rules: tone of voice, token usage, spacing conventions, animation timing. They're the fine-grained knowledge that prevents drift.

At Buzzvil, this maps to:
- **Principles** → CLAUDE.md (repo-level standing orders)
- **Recipes** → Skills (reusable task playbooks) and component patterns
- **Guidelines** → Design tokens, the brand guide, hooks and the craft check (automated enforcement)


## Part 4: The People

The workflow and environment only work if the people running them know what changed. This part covers the mindset shift, the onboarding path, how PMs and engineers work with designers, how we hire, how we measure output, how we ship early, and how we keep the rhythm coherent when everyone can ship fast.

### For designers joining this workflow

Your job changed shape. You are measured by what ships. That means:

- **Put your opinion in the product.** If you see a problem, fix it and open a PR.
- **You own the experience layer.** Engineers own the logic and infrastructure. You own how it looks, feels, and flows. The boundary moved, and the responsibility stayed with you.
- **You own the surface, whoever builds on it.** When a PM or engineer opens a UI PR on your surface, you are the reviewer, and you make the final design call.
- **You need to read code. AI writes most of it.** Understand what a component is, what a token does, what a PR contains. Structural literacy is required. Half of the designers in the Designer Fund 2026 survey have already shipped AI-generated code to production.[^designerfund]
- **Figma is for exploration.** Use it when you need to compare directions side by side. Build what ships in code.
- **Know which risk you're testing.** Every prototype should answer a question. Use the four discovery risks from Part 1 as a self-check: value, usability, feasibility, viability. If you can't name the risk your current work addresses, you may be producing artifacts without learning from them.

The biggest fear: "I'm not a developer. I can't write code." AI writes the code with you. Your part is to read its structure and judge the result.

### Onboarding sequence

Once the path is clear, onboarding is the short part. At Buzzvil, designer onboarding follows this progression:

**Week 1-2: Read first.**
Get to know the repository, its components and its review culture. For example:
- Start in the real repository, on a branch. Ask Claude Code how a screen is built, which components and tokens it uses and which states it has, before you change anything.
- Read 3-4 existing PRs: see what a design change looks like in code.
- Read the repo's CLAUDE.md or equivalent project docs: learn the standing orders.

**Week 3-4: Small, safe changes.**
Build confidence through low-risk contributions that teach the patterns. For example:
- Replace a hard-coded color with a semantic token.
- Adjust spacing or copy on an existing page.
- Run the checks, open a draft PR, and go through the full loop on a change where a mistake costs nothing.

**Week 5+: Own a feature.**
Take full ownership of a feature from intent to production. For example:
- Build a new page or component from a written intent.
- Use the repo's skills and harness, with one session per feature.
- Open the PR, get it reviewed, merge, and check it live.

The key: start with *observation* (components, PRs, project docs), then *low-risk contribution* (tokens, spacing, copy), then *ownership* (features). Each step builds confidence that the system works.

### For PMs and engineers working with designers

The designer on your team opens PRs. You can open UI PRs too.

AI coding agents let anyone on the product team build and change interfaces. At Buzzvil, most UI code is written by frontend engineers, and a growing share comes from backend engineers and PMs. The industry shows the same shift: in Figma's 2026 AI report (8,403 survey responses over three years), the share of developers doing design work rose from 44% to 60%, and the share of designers taking part in development roughly doubled, to 41%.[^figma-report]

Here is how it works with us:

- **What you can build:** UI changes on existing screens: copy, states, layout, small flows.
- **What you build with:** the design library and the repo's design skills. The tokens, components and harness keep the output structurally sound, whoever writes it.
- **Who reviews:** the designer of that surface. They approve, fix small gaps on your branch, or send it back with the reason, within one working day. Engineering reviews the code as usual.
- **Bigger work:** new screens that need data, logic or tracking are built together. The designer builds the UI PR, and you add data, logic and tracking on the same branch or in a linked PR.
- **Review the PR. The working version is the spec.** Comment on the PR, suggest changes, iterate on the branch, the same way you review any other contribution.
- **The design system is shared territory.** Tokens, components, and patterns are the contract between everyone's output. A token change affects the designer's work, and a new component is available to you.
- **Checks run first.** Lint, type checking, formatting and the craft check catch structural issues. Human review focuses on judgment calls: product fit, visual quality, and user experience.

### How we hire designers

We hire for five traits, the same for every seat:

- **Owns it to live.** Carries work from the problem to production, checks it works for users, and stands behind it, including what AI or others produced.
- **Finds the real problem.** Understands the user and the business behind the screen, and checks a problem is worth solving before building.
- **Decides with a point of view.** Chooses what to build and what to cut, what to hand to tools and what to keep. Holds a position with reasons, and changes it when the evidence changes.
- **Thinks in systems.** Sees the pattern behind the screen, turns repeated work into something others reuse, and keeps changing how they work as tools change.
- **Makes intent precise.** Writes intent clear enough for a teammate or an agent to act on, in Korean or English.

Four of them are the principles from Part 1 written as behavior. Judgment becomes deciding with a point of view. Articulation becomes making intent precise. Accountability becomes owning it to live. Discovery becomes finding the real problem. The fifth, thinking in systems, is how a designer builds the environment from Part 3.

**Craft is the floor.** Every seat needs taste and care for detail: every state covered, consistent, clean. The floor rises with seniority. Other design leaders keep the same floor: in the Designer Fund 2026 survey, only 5% of leaders said they put less emphasis on execution quality.[^designerfund]

**AI lives inside every trait.** We look at a candidate's interest in AI and their judgment in how they work with it. Many strong designers work at companies that give them no AI tools, so we weigh the direction they are moving in and what they explore on their own time. Other leaders move the same way: in the same survey, 50% said they put more emphasis on AI fluency when hiring.[^designerfund]

What candidates experience: a few short application questions, answered next to links to their work. Then one main interview of about two hours: a project deep dive, a 60-minute build in a starter repository with our design library and an AI tool we provide, and a walkthrough with the AI closed, where the candidate explains every decision in their own words. A final conversation with company leadership follows. The full candidate view, with the application questions and our promises to candidates, is on [the team page](https://design.buzzvil.com/team/#hiring).

For a wider view of the field, Jenny Wen describes the three archetypes she is hiring for now in the same Lenny's Podcast episode.[^wen]

### Measuring output

If designers ship through PRs, count PRs. Here is every pull request opened by a member of the design team across our repositories in 2026:[^prs]

| | Q1 2026 | Q2 2026 | Q3 2026 (to 2026-09-04) |
|---|---|---|---|
| PRs opened | 10 | 177 | 245 |
| Share of the team contributing | 17% | 100% | 100% |
| Merged | 90% | 82% | 87% |
| Repositories touched | 3 | 14 | 15 |

Two rows matter most. The share of the team is the result: the second quarter is when PRs became the team's default. The merge rate shows that review still filters ideas. The PRs that did not merge are closed exploration branches, replaced stacks, and a few bad ideas that ended in review, which is where bad ideas should end.

PR count measures delivery only. It says nothing about whether we built the right thing. A team that optimizes for it ships 300 confident mistakes. We have no clean metric for exploration yet.

We publish team-level numbers, and only those. DORA explains why: "company-wide aggregates are meaningless, and individual scores are harmful."[^dora-tokens]

### Ship early, then keep improving

We ship early and improve in public. Our web monorepo shows how. Work started in early March 2026, and five weeks later three apps were in production. We moved a tech blog of 195 posts and 227 pages of SDK docs into it.[^website] SDK Docs shipped at 95%, with final QA done through a live content update test with the platform team. The design portal went live before every page was perfect.

Ship, learn, improve. This applies to both lanes: share the rough prototype early and learn from it, then ship the feature and improve it based on real usage. Teams that wait for perfection ship less and learn slower.

### Tempo

AI makes individuals fast. Without a shared rhythm, that speed produces chaos. A team that ships 20 PRs a day with no shared rhythm makes noise.

Creative teams need a shared rhythm. It leaves each person free in what they make, and it makes the parts fit together.

The problem is specific to AI-native workflows: the old cadence was designed around slow production cycles. Standups assumed work took days. Sprint planning assumed a two-week horizon. Design reviews assumed one direction per week. When individuals can ship several features per day, those rhythms are too slow to coordinate and too frequent to be useful.

At Buzzvil, we rebuilt the cadence around what AI produces: commits, PRs, and measured artifacts.

**Daily: async, artifact-based.**
No standups. Open PRs are the status update. If you need to know what someone is working on, check the branch. If you need to give feedback, comment on the PR.

**Weekly: generated reviews.**
Every week, the team review is generated from git logs across active projects. Each designer's weekly note is drafted from their own activity, then checked by them. The evidence answers "what did you do this week?", so we hold no meeting for it. The data also surfaces connections: a change in the interaction library affects the design library docs, which affects the SDK docs. Those dependencies show up in the data.

**Monthly: stakeholder alignment.**
1:1s with the people who use the design team's output: product managers, group leads, engineering partners. These are alignment checks: are we building the right things? Has the priority shifted? What's coming next quarter that we should prepare for?

**Quarterly: a review with counted numbers.**
A quarterly review with numbers counted from artifacts, such as merged PRs and published pages. The conversation is about what the numbers mean.

The cadence serves two purposes. For the individual, it provides checkpoints: moments to step back from the speed of daily AI-assisted work and ask if the direction is still right. For the team, it provides coherence: the assurance that everyone shipping independently builds one product.

We learned this in the wrong order. Individual speed rose first, and the shared rhythm caught up later. It hurt.[^prs]

AI accelerates individual output. Tempo keeps it coherent.


## Notes & Further Reading

### Extend the playbook

Each section of this playbook introduces ideas explored in more depth elsewhere. Pick the topic that matters most to you.

**On the value shift** (Part 1)
- [Designing Above the Interface](/blog/designing-above-the-interface/): What happens to design's value when production costs zero
- [The Job Description Is Wrong](/blog/the-job-description-is-wrong/): Which traits matter in design work when AI handles much of the execution

**On the workflow** (Parts 2 and 4)
- [From Paper to Code](/blog/from-paper-to-code/): Why paper forces thinking, code forces reality, and Figma sits in between
- [Designers Open the PRs Now](/blog/designers-open-the-prs-now/): Six months and 432 pull requests: what got better and what it cost

**On the environment** (Part 3)
- [My Agents' Operating Manual, Written by the Agent](/blog/harnessing-ai-coding-agents/): The five-layer harness in full detail, with examples from production
- [The Flip](/blog/the-flip/): Why we build our design system for an agent to read
- [A Design System for an Agent](/blog/a-design-system-for-an-agent/): Components as data, and a test kitchen that checks recipes before they ship
- [When the Interface Assembles Itself](/blog/when-the-interface-assembles-itself/): Principles, recipes, and guidelines as the architecture of agentic composition
- [Nobody Owned the Website. Now Everybody Does.](/blog/nobody-owned-the-website-now-everybody-does/): A case study of shared tokens replacing four separate web properties

**On the people** (Part 4)
- [Design Tempo](/blog/design-tempo/): How to establish organizational rhythm for creative teams working at AI speed

### Elsewhere

Related articles and resources:

- "Design Engineering at Vercel: What we do and how we do it." Vercel Blog. [vercel.com](https://vercel.com/blog/design-engineering-at-vercel)
- "How Anthropic teams use Claude Code." Anthropic. [claude.com](https://claude.com/resources/articles/how-anthropic-teams-use-claude-code)
- "Claude Code vs Cursor: A Power-User's Playbook." Arize AI. [arize.com](https://arize.com/blog/claude-code-vs-cursor-a-power-users-playbook/)
- "The future of enterprise design systems: 2026 Trends." Supernova.io. [supernova.io](https://www.supernova.io/blog/the-future-of-enterprise-design-systems-2026-trends-and-tools-for-success)
- "Vibe Coding Guide - AI-Directed Development Playbook." Awesome Claude. [awesomeclaude.ai](https://awesomeclaude.ai/vibe-coding-guide)
- "Design Systems And AI: Why MCP Servers Are The Unlock." Figma Blog. [figma.com](https://www.figma.com/blog/design-systems-ai-mcp/)
- "Bridging the gap between design and code with v0." Vercel. [vercel.com](https://vercel.com/customers/bridging-the-gap-between-design-and-code-with-v0)
- "Mapping your design system for AI agents." Cristian Morales Achiardi, Design Systems Collective. [designsystemscollective.com](https://www.designsystemscollective.com/codebase-indexing-for-design-systems-agents-c0f6b563a39e)
- "Why your design system is the most important asset in the AI era." The Design System Guide. [thedesignsystem.guide](https://learn.thedesignsystem.guide/p/why-your-design-system-is-the-most)

### Industry context

| Metric | Value | Source |
|--------|-------|--------|
| Code that is AI-authored (Q2 2026, self-reported) | 51.9% | DX [^dx] |
| Median PR size, Jul 2025 to Jun 2026 | 44 to 72 lines | DX [^dx] |
| PRs merged per developer, high-AI teams (2025) | +98% | Faros AI [^faros25] |
| Tasks completed per developer, high-AI teams (2025) | +21% | Faros AI [^faros25] |
| PR review time, high-AI teams (2025) | +91% | Faros AI [^faros25] |
| Median review time (Q2 2026) | 5x | Faros AI [^faros26] |
| PRs with substantive review comments, with AI code review | 16% to 54% | Anthropic [^anthropic-review] |
| Coding-assistant users who use them daily (2026) | 73% | Stack Overflow [^so26] |
| Jenny Wen's time on mockups and prototypes, a few years ago to now | 60-70% to 30-40% | Jenny Wen [^wen] [^wong] |
| Developers doing design work (2026) | 60%, up from 44% | Figma AI report [^figma-report] |
| Designers taking on more product or engineering work | 65% | Designer Fund [^designerfund] |
| Booking.com PR merge rate, AI users | +16% | DX [^7] |
| AGENTS.md: median runtime / output tokens | -28.64% / -16.58% | Lulla et al. [^agentsmd] |
| JSON vs Markdown for agents (tokens) | 80% fewer tokens | Indeed, via Into Design Systems [^10] |

### Sources

[^prs]: "Designers Open the PRs Now." 2026-09-07. [mmaxence.me](/blog/designers-open-the-prs-now/). Korean edition on the Buzzvil tech blog, 2026-09-08: [tech.buzzvil.com](https://tech.buzzvil.com/blog/designers-open-the-prs-now)

[^website]: "Nobody Owned the Website. Now Everybody Does." 2026-04-14. [mmaxence.me](/blog/nobody-owned-the-website-now-everybody-does/)

[^wen]: Jenny Wen, "The design process is dead. Here's what's replacing it." Lenny's Podcast, 2026-03-01. [lennysnewsletter.com](https://www.lennysnewsletter.com/p/the-design-process-is-dead)

[^wong]: Roger Wong, notes on Jenny Wen's episode of Lenny's Podcast, 2026-03-03. [rogerwong.me](https://rogerwong.me/2026/03/the-design-process-is-dead-jenny-wen-head-of-design-at-claude)

[^dx]: Justin Reock, "AI-authored code has nearly doubled." DX, 2026-06-17. Q2 2026 data from more than 400 companies, self-reported. [getdx.com](https://getdx.com/blog/ai-authored-code-has-nearly-doubled/)

[^faros25]: "The AI Productivity Paradox Report 2025." Faros AI, 2025-07-23. Telemetry from more than 10,000 developers across 1,255 teams. [faros.ai](https://www.faros.ai/blog/ai-software-engineering)

[^faros26]: "The Acceleration Whiplash." Faros AI, AI Engineering Report with data through Q2 2026. Telemetry from 22,000 developers across 4,000 teams. [faros.ai](https://www.faros.ai/research/ai-acceleration-whiplash)

[^anthropic-review]: "Bringing Code Review to Claude Code." Claude Blog, 2026-03-09. [claude.com](https://claude.com/blog/code-review)

[^metr]: "We are Changing our Developer Productivity Experiment Design." METR, 2026-02-24. [metr.org](https://metr.org/blog/2026-02-24-uplift-update/)

[^so26]: Ryan Donovan, "The results of the 2026 Developer Survey are here!" Stack Overflow Blog, 2026-10-06. Daily use measured among people who use coding assistants and agents. [stackoverflow.blog](https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here/)

[^figma-report]: Madeline Stafford and Shane Johnston, "Figma's 2026 AI report: Can AI help us collaborate better?" Figma Blog, 2026-06-24. 8,403 survey responses; a Figma-commissioned survey. [figma.com](https://www.figma.com/blog/2026-ai-report/)

[^designerfund]: Robyn Park, "AI in Design 2026: The inflection point is here." Designer Fund and Foundation Capital, 2026-05-20. More than 900 designers in 60+ countries. [designerfund.com](https://designerfund.com/blog/ai-in-design-2026)

[^dora-tokens]: Evan Conaway, "Finding balance in the era of tokenmaxxing." DORA, 2026-06-02. [dora.dev](https://dora.dev/insights/finding-balance-in-the-era-of-tokenmaxxing/)

[^agentsmd]: Lulla, Mohsenimofidi, Galster, Zhang, Baltes and Treude, "On the Impact of AGENTS.md Files on the Efficiency of AI Coding Agents." arXiv 2601.20404, version 2, 2026-03-30. [arxiv.org](https://arxiv.org/abs/2601.20404)

[^figma-agents]: Matt Colyer, "Agents, meet the Figma canvas." Figma Blog, 2026-03-24. [figma.com](https://www.figma.com/blog/the-figma-canvas-is-now-open-to-agents/)

[^figma-code]: Nikolas Klein, "Code on the Figma canvas." Figma Blog, 2026-06-24. [figma.com](https://www.figma.com/blog/code-on-the-figma-canvas/)

[^figma-make]: "Make in your local codebase." Figma Help Center, closed beta. [help.figma.com](https://help.figma.com/hc/en-us/articles/40775535020695-Make-in-your-local-codebase)

[^figma-whatsnew]: "What's new." Figma, entry of 2026-10-06. [figma.com](https://www.figma.com/whats-new/)

[^figma-mcp]: "Figma MCP server." Figma Developer Docs. [developers.figma.com](https://developers.figma.com/docs/figma-mcp-server/)

[^paper]: Stephen Haney, "Paper raises $34M to build the next great design platform." Paper, 2026-07-22. [paper.design](https://paper.design/blog/series-a)

[^stitch]: Rustin Banks, "We're introducing new ways to design in real time with Stitch." Google, 2026-05-19. [blog.google](https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-updates/)

[^cursor]: Erik Nilsson, Ian Huang and Ryo Lu, "Direct agents with visual prompts in Design Mode." Cursor, 2026-06-05. [cursor.com](https://cursor.com/blog/design-mode)

[^claude-design]: "Introducing Claude Design by Anthropic Labs." Anthropic, 2026-04-17. [anthropic.com](https://www.anthropic.com/news/claude-design-anthropic-labs)

[^claude-design-brand]: "Claude Design now stays on brand for daily work." Claude Blog, 2026-06-17. [claude.com](https://claude.com/blog/claude-design-stays-on-brand-for-daily-work)

[^claude-design-ga]: "Build live dashboards and animate explainers with Claude." Claude Blog, 2026-10-08. [claude.com](https://claude.com/blog/dashboards-and-motion)

[^6]: "Towards an agentic design system." Cristian Morales Achiardi, Design Systems Collective. [designsystemscollective.com](https://www.designsystemscollective.com/towards-an-agentic-design-system-c7e0a6469bb1)

[^7]: "Booking.com uses DX to measure AI's impact on developer productivity." DX. [getdx.com](https://getdx.com/customers/booking-uses-dx-to-measure-impact-of-genai/)

[^10]: "Your Design System Is Not Ready for AI Agents." Into Design Systems, 2026-04-10. Reports Diana Wolosin's tests at Indeed. [intodesignsystems.com](https://www.intodesignsystems.com/blog/design-system-not-ready-for-ai-agents)

[^11]: "Graphic design: The digital revolution." Britannica. [britannica.com](https://www.britannica.com/art/graphic-design/The-digital-revolution) / "American Graphic Design in the 1990s: Deindustrialization and the Death of the Author." Post45. [post45.org](https://post45.org/2019/01/american-graphic-design-in-the-1990s-deindustrialization-and-the-death-of-the-author/)

[^12]: Christopher Alexander, *The Timeless Way of Building* (Oxford University Press, 1979). See also: "The Pattern Technology of Christopher Alexander." Metropolis. [metropolismag.com](https://metropolismag.com/viewpoints/the-pattern-technology-of-christopher-alexander/)

[^13]: "Claude Code power user tips: Verification." Anthropic Help Center. [support.claude.com](https://support.claude.com/en/articles/14554000-claude-code-power-user-tips#h_ae6efc03ec)

[^14]: Marty Cagan, "Build to Learn vs Build to Earn." Silicon Valley Product Group, 2026-04-16. [svpg.com](https://www.svpg.com/build-to-learn-vs-build-to-earn/)

---
title: "The AI-Native Design Playbook"
description: "How Buzzvil's design team ships through pull requests, not handoffs. A full playbook for designers, PMs, engineers, and leaders moving from mockup-and-handoff to AI-native design."
date: 2026-04-23T10:00:00+09:00
draft: false
featured_image: "/images/ai-native-design-workflow-playbook.png"
tags: ["ai-design", "design-systems", "product-strategy", "workflow", "engineering"]
---

**How Buzzvil's design team ships through pull requests, not handoffs.**

## Preface

At Buzzvil, a team of six designers shipped 5 web applications and 344 commits in a single month, with near-zero Figma usage. No engineering sprint allocation. No handoff tickets. No waiting. My own time in Figma dropped to roughly 10%.

This playbook is how we got here, and how you can get here too.

It is written for **designers** making the transition from mockups to pull requests. For **PMs and engineers** who will increasingly ship user stories through shared design patterns, and need to understand what changed. And for **leaders** who must evaluate and adopt these practices, because the teams that move first will define how products get built.

A quick note on why this moment matters, before the practical parts.

Design has been through a shift like this before. In 1985, the Apple Macintosh, the LaserWriter, and Aldus PageMaker arrived, and the graphic design profession split in two. Traditionalists saw desktop publishing as a threat to craft. Anyone with a mouse could now set type, and most of them did it badly. The resistance was real. Experienced designers mourned the loss of specialized typesetters, hand-cut paste-ups, and the hard-earned knowledge that separated a professional from an amateur.[^11]

By the mid-1990s, the transition was complete. The designers who thrived were not the ones who resisted the tool. They were the ones who recognized that the tool changed *what design could be*: faster iteration, direct control over production, and the ability to explore more ideas in less time. The craft didn't die. It moved.

Christopher Alexander described the underlying pattern before it ever reached software. In *The Timeless Way of Building* (1979), he argued that lasting quality comes not from the individual craftsperson's hand, but from shared pattern languages: living systems of rules that anyone can use to produce coherent, beautiful results.[^12] When the patterns are right, the buildings take care of themselves. When the language is shared, the system scales without losing its soul.

Alexander's insight migrated from architecture to software, inspiring design patterns, the Wiki, and eventually design systems. It migrates again now. The AI agent is not the designer. The *pattern language* is the design. The agent is a new kind of builder, faster and more tireless than any before, but only as good as the patterns it's given. We write those patterns. That is the opportunity.

The shift already happened. This playbook helps you catch up, and then move ahead.

---

## Part 1: Why Everything Changed

### Engineers don't wait anymore

Jenny Wen, Head of Design at Anthropic (formerly Director of Design at Figma), said it plainly on Lenny's Podcast in March 2026:

> "The classic discover-diverge-converge loop doesn't work when engineers can spin up seven coding agents and ship a working version before a designer finishes exploring options." [^1]

The numbers back her up. In 2025-2026:
- 51% of code committed to GitHub was AI-generated or AI-assisted [^2]
- AI-assisted engineers finished 21% more tasks and created 98% more pull requests per person [^3]
- Median PR size increased 33% [^3]
- PR review times increased 91% [^3]

Mockup-and-handoff was already slow. Now it's the slowest part of the system.

Jenny's own team at Anthropic saw the shift in real time. The time allocation inverted:

| Work type | A few years ago | Now |
|-----------|-----------------|-----|
| Mocking and prototyping | 60-70% | 30-40% |
| Jamming and pairing with engineers | ~20% | 30-40% |
| Coordination | ~10% | (shrinking) |
| Direct implementation in code | 0% | A new slice |

Time that used to go into pixel-perfect compositions now goes into two modes: *supporting execution* (consulting with engineers as they build, giving feedback, polishing in code) and *setting short-range vision* (3-6 months, not multi-year roadmaps). [^1]

At Buzzvil, we went further. I don't make mockups anymore. I write user stories, on paper or in text. I describe intent, constraints, and success criteria. Then I build directly in code with Claude Code, or I direct an agent to do it.

The time that used to go into pixel-perfect compositions now goes into *thinking clearly about what should exist and why.* The visual output still happens, faster and closer to production, but the creative work moved upstream. It lives in a well-written user story, a sharp constraint, a decision about what *not* to build.

Jenny describes 30-40% on mockups as the new normal. I think that's a midpoint on a curve that keeps falling. For a design leader working with AI agents daily, the floor is closer to 10%. The remaining 90% is judgment, articulation, review, and direction: the work that actually determines product quality.

One designer, working this way, can produce what previously required a designer, a frontend engineer, and a sprint cycle. The constraint flipped from "can we build it?" to "should we build it?"

### What design is for now

When production capacity approaches zero cost, design's value shifts from execution to discernment.

This is uncomfortable. Execution fluency (the ability to produce polished mockups, pixel-perfect prototypes, and comprehensive design specs) was the core of the job for two decades. It's declining in value. Not because it doesn't matter, but because AI does it faster and at a quality level that's good enough for most decisions.

What remains irreplaceable:
- **Judgment:** deciding what's worth building, and what isn't
- **Articulation:** making intent precise enough for machines to act on
- **Accountability:** someone still has to be responsible for what ships [^1]
- **Discovery:** testing whether something is worth building before committing to production

That last point deserves attention. Marty Cagan draws a sharp line between *building to learn* (discovery) and *building to earn* (delivery). [^14] Discovery tests four risks: value, usability, feasibility, and viability. Delivery tests scale, performance, reliability, security, and everything else required for a product customers can depend on. Same word, "testing," with completely different meanings on each side.

This distinction used to belong to product managers. Designers mocked up, PMs validated, engineers built. When building was expensive, that division made sense. Now that a designer with an AI agent can produce a functional prototype in hours, the discovery loop is within reach of anyone who builds. Designers who work this way are not replacing PMs. They are extending their own role into territory that was previously inaccessible: testing value and usability directly, with real artifacts, before a single sprint gets allocated.

### "But AI makes everything look the same"

This is the most common concern, from teammates, from designers online, from anyone who's seen a wave of AI-generated landing pages that all look like the same Tailwind template with the same hero layout and the same gradient blob.

The concern was valid. In 2024 and early 2025, it was true. Unharnessed LLMs default to generic patterns, the statistical average of everything they've seen. When intent is vague, AI fills the gaps with the most common solution. That's how you get sameness.

But this is a solved problem. The era of harnessing strategies changed the equation. Tools like [design.md](https://getdesign.md/) showed that you can encode brand voice, visual language, component constraints, and tone directly into the agent's context. CLAUDE.md files, design skills, and hooks create a *design environment*, a controlled space where the AI produces on-brand output, not generic output.

At Buzzvil, we publish and use across products:
- **Brand and design skills:** Claude Code skills that encode our visual language (Buzzvil brand guidelines, OKLCH color system, typography rules, animation profiles) and enforce them during generation
- **An internal UI library package built for LLMs:** `@buzzvil/design-library` isn't just a React component library. It's structured so agents can discover, select, and compose components with the right tokens, the right spacing, the right behavioral patterns. The library is consumed by 5+ repos and verified across 60 brand × recipe combinations.
- **Hooks that enforce consistency:** Biome lint, spacing conventions, token compliance. If the agent produces a hardcoded hex color, the hook catches it before commit.

The generic output problem is a *setup* problem, not an AI problem. A designer who drops into Claude Code without a CLAUDE.md, without design tokens, without brand skills, yes, they'll get generic output. The same way an engineer without a linter gets inconsistent code.

The designer's new craft is building the environment. Set the constraints, encode the brand, publish the tokens, write the skills. Then the AI produces *your* design, not *a* design.

### The design system is no longer for designers

The biggest conceptual leap: your design system's primary consumer may not be a human.

At Buzzvil, we build interaction modules: gamification recipes for ad campaigns (spin wheels, memory matches, quizzes, timing games). In Q1, the consumer of these patterns shifted from designers composing screens to AI agents composing campaigns autonomously.

> "We're building a design system for an AI agent to use. Not for designers. Not for developers. For an agent."

This changes what a design system *is*. Components are answers. An agent needs to understand the questions: inputs, constraints, brand compatibility, behavioral rules. Every principle, every behavioral rule, every constraint has to be written down precisely enough to produce consistent outputs across thousands of compositions. [^6] [^10]

The design system becomes structured knowledge, not a component library.

---

## Part 2: The Workflow

For most of design's history, discovery and delivery lived in the same tool. You explored directions in Figma, presented to stakeholders in Figma, and handed off specs from Figma. The intent changed; the tool didn't. That made the two modes invisible.

AI coding agents are making them visible. When a designer can produce a functional prototype in hours, the question stops being "which Figma file is this?" and becomes "am I exploring or shipping?" That question demands different workflows for each answer.

Most design teams today, including ours, still blend these modes. AI usage is often layered on top of existing processes rather than replacing them, which creates real pressure on designers' time and attention. The split described below is not yet how most teams operate day to day, but it is where things are heading. The teams that name the distinction early will transition faster, because their designers will know *why* they're opening Figma on one task and Claude Code on another, instead of feeling like they're doing twice the work.

### Discovery: explore the problem

Discovery means building to learn. The tools for discovery are whichever let you explore fastest.

**Figma** remains strong for spatial exploration. Jenny Wen makes the case: "You can spread 8 or 10 directions across a single canvas and compare them simultaneously. Code-based tools are linear. You invest effort in one direction and develop a bias toward it. Figma's spatial layout prevents that sunk-cost thinking." [^1]

Use Figma for discovery when you need to:
- Compare 5+ directions side by side
- Present options to a stakeholder before committing
- Explore brand, illustration, or visual identity work

**Code prototypes** are increasingly viable for discovery too. A quick prototype built with Claude Code can go in front of users with real data, real interactions, and real responsive behavior. This used to require engineering allocation. It doesn't anymore. The prototype's job is to answer a question, not to ship.

The key discipline: discovery artifacts are disposable. A prototype that tested value and failed did its job. A Figma exploration that clarified the wrong direction saved weeks. Treat them as learning instruments, not as partially-completed products.

### Delivery: ship the solution

Delivery is building to earn. The solution has been validated (or at least has enough signal to proceed), and now it needs to work at production quality: scale, reliability, accessibility, token compliance, responsive behavior.

The delivery loop is:

1. **Write the intent.** The direction is validated. Capture it as a user story, a constraint set, or a written description of what should exist and why. Paper works. A markdown file works. Precision matters more than format.
2. **Build in code.** Open Claude Code, describe what you want, iterate until it's right. The agent uses your tokens, your components, your standing orders. Code forces reality.
3. **Open a PR.** Push the branch, describe what changed, request review.
4. **Review and merge.** Design review for visual quality, engineering review for correctness. One process, not two.
5. **Ship.** Vercel deploys on merge. No staging bottleneck.

The entire loop from intent to production can be hours, not weeks. This is where designers ship user stories directly in the codebase, where PRs are the unit of output, and where hooks and tokens enforce quality automatically.

Don't use Figma for delivery:
- Component building (tokens + code are the source of truth)
- Page layout (faster to build directly)
- Spec handoff (there is no handoff: the designer opens the PR)
- Responsive design (you can't fake responsiveness in a canvas)

### The tooling gap

Figma is a strong discovery tool, but it has no meaningful path from canvas to codebase. That gap is its fundamental limitation.

Dev Mode, Figma's answer to the handoff problem, generates CSS snippets and component annotations that engineers are expected to interpret and rewrite. In practice, this creates a translation layer that adds time, introduces drift, and requires manual reconciliation between what was designed and what gets built. The more complex the component, the wider the gap. Features like Code Connect attempt to bridge this by letting teams map Figma components to code components manually, but the mapping is maintained by hand, and the output is reference documentation, not executable code.

Dev Mode is a product of the handoff era. It assumes designers produce visual specifications and engineers interpret them. As designers ship directly through PRs and AI agents consume design systems as structured data, the need for a human translation layer between canvas and code diminishes. Tools built around that assumption will increasingly feel like legacy.

A new generation of tools is designed around this exact gap. Paper works directly with code and design tokens: what you design is already expressed in the same language the codebase uses, eliminating the translation step entirely. Stitch takes a different approach, generating production-ready code from design intent with awareness of your existing component library. Both treat the discovery-to-delivery transition as a first-class problem rather than a side feature.

Claude Design, launched by Anthropic in April 2026, goes further. [^15] It covers both discovery and delivery in a single collaborative surface. Teams explore directions through conversation, refine with inline comments and direct edits, and hand off to Claude Code with bundled design specifications. The design system is read from the team's codebase during onboarding and applied automatically to every project. The collaboration model is what matters most here: PMs, designers, and engineers work in the same live document, removing the role-based tool boundaries that Figma enforced. A PM can prototype a feature flow, a designer can refine the visual direction, and an engineer can export the result with specifications attached. No translation step, no handoff ticket, no waiting for the next person's tool to catch up.

The toolchain is catching up to the workflow. Discovery tools that excel at spatial exploration, delivery tools that work in code natively, collaborative tools that let the whole team shape the product together, and less need for anything in between.

---

## Part 3: Setting Up the Environment

This is where most teams fail. They try the workflow from Part 2 without the infrastructure, get generic output, and conclude "AI can't do design." The environment is everything.

### The five-layer harness

An AI coding agent is like a fast, tireless junior developer. Talented, but needs structure.

Without guardrails, the agent produces generic output, makes decisions you didn't authorize, and drifts from your system. With the right structure, it becomes a high-leverage collaborator. Research from SmartScope confirms the impact: projects with structured agent context files show a 29% reduction in median runtime and 17% reduction in token consumption. [^9]

**1. Standing Orders (CLAUDE.md)**

A markdown file at the root of every repository. The agent reads it on every session start. It contains:
- Project context and architecture
- Coding conventions and patterns
- What to do and what never to do
- File structure and naming rules

This is the most important file in the repo for AI-native development. It compounds: every convention you encode saves hundreds of future corrections.

**2. Skills**

Reusable playbooks for recurring tasks. At Buzzvil, we've built skills for:
- SDK documentation releases
- Brand guideline compliance
- Illustration and icon generation
- Dashboard design patterns
- Blog post creation

A skill tells the agent *how* to approach a category of work. It encodes craft knowledge that would otherwise exist only in someone's head.

**3. Memory**

Persistent notes the agent maintains across sessions. Patterns confirmed over multiple interactions, architectural decisions, user preferences. The agent builds institutional knowledge over time.

**4. Permissions**

An allowlist of what the agent can do autonomously versus what requires human approval. File writes, git operations, external API calls: each has an explicit permission level.

**5. Hooks**

Automated checks that run on specific events: before commit, after file write, on session start. At Buzzvil, hooks enforce:
- Biome lint + formatting
- TypeScript type checking
- Spacing conventions
- Destructive operation warnings

The principle: *silent on success, loud on failure.* The agent works freely within the guardrails. When it hits a boundary, it stops and asks.

The Anthropic team calls verification "the single most impactful tip": give the agent a way to check its own output, and quality goes up dramatically. [^13] If you only adopt one practice from this playbook, make it this: set up hooks that verify before commit. Everything else compounds from there.

### Tokens as the shared language

The design system isn't a Figma library you reference. It's the actual material the surfaces are made of.

At Buzzvil, every color, spacing value, typography scale, and shadow exists as a semantic CSS variable generated from OKLCH color space. The token system has three layers:

1. **Primitives:** raw values (OKLCH lightness, chroma, hue)
2. **Semantic:** intent-based (action-primary, surface-default, text-muted)
3. **Component:** specific to elements (button-bg, card-border)

When the agent builds a page, it uses semantic tokens. When it builds a component, it uses component tokens. Hardcoded values look wrong because everything around them is systematic.

This alignment between design tokens and code tokens is what the UX Collective calls the #1 prerequisite for AI-native design workflows: "ensuring MCP Server, Claude Code, and Codex CLI all spoke the same design language." [^4] Indeed's Diana Wolosin tested 8 MCP configurations across 1,056 prompts and found JSON offered 80% fewer tokens and 5x lower cost compared to prose documentation. [^10]

### Principles → Recipes → Guidelines

When an agent composes interfaces, it needs three layers of instruction. Cristian Morales Achiardi at the Design Systems Collective describes this as the shift toward "agentic design systems": systems that detect drift, report it, and propose fixes autonomously. [^6]

**Principles** are non-negotiable constraints. "Never use red as a background fill." "All interactive elements must have a minimum 44px touch target." "Korean text uses Noto Sans KR." These don't change per context.

**Recipes** are validated patterns for known contexts. "A campaign interaction follows Hook → Challenge → Reward → Offer." "An advertiser landing page leads with trust metrics, then case study, then CTA." Recipes encode proven solutions.

**Guidelines** are granular rules: tone of voice, token usage, spacing conventions, animation timing. They're the fine-grained knowledge that prevents drift.

At Buzzvil, this maps to:
- **Principles** → CLAUDE.md (repo-level standing orders)
- **Recipes** → Skills (reusable task playbooks) + Component patterns
- **Guidelines** → Design tokens + Brand guide + Hooks (automated enforcement)

> **A note on project context.** Design work doesn't happen in one repo. At Buzzvil, the design team touches 10+ active repositories. We use a markdown-driven command center (head) that connects every project: registry, OKRs, weekly reviews from git data. The agent reads it on session start and can pull live data from any project. This isn't required for the workflow, but it's how we keep context across a complex landscape.

---

## Part 4: The People

The workflow and environment only work if the people running them know what changed. This part covers the mindset shift, the onboarding path, how to collaborate across functions, how to measure output, and how to keep the rhythm coherent when everyone can ship fast.

### For designers joining this workflow

Your job didn't get smaller. It got different.

You are no longer measured by the fidelity of your mockups. You are measured by what ships. That means:

- **Your opinion needs to be in the product, not in a deck.** If you see a problem, fix it. Open a PR. Don't file a ticket and wait.
- **You own the experience layer.** Engineers own the logic and infrastructure. You own how it looks, feels, and flows. The boundary moved, but the responsibility didn't.
- **You must be able to read code, not write it.** You'll use AI to write. But you need to understand what a component is, what a token does, what a PR contains. Structural literacy is non-negotiable. [^5]
- **Figma is a thinking tool, not a delivery tool.** Use it when you need to compare directions spatially. Don't use it to produce something that will be rebuilt in code anyway.
- **Know which risk you're testing.** Every prototype should answer a question. Use the four discovery risks from Part 1 as a self-check: value, usability, feasibility, viability. If you can't name which one your current work addresses, you may be producing artifacts without learning from them.

The biggest fear: "I'm not a developer. I can't write code." You don't need to. But you need to read the structure.

### Onboarding sequence

At Buzzvil, designer onboarding follows this progression:

**Week 1-2: Read, don't write.**
Familiarize yourself with the project's component library, codebase conventions, and review culture. For example:
- Browse the component library (e.g. Storybook, a docs site, or the source code directly): see every component, its variants, its props
- Read 3-4 existing PRs: understand what a design change looks like in code
- Read the repo's CLAUDE.md or equivalent project docs: understand the standing orders

**Week 3-4: Small, safe changes.**
Build confidence through low-risk contributions that teach the patterns. For example:
- Document an existing component (add a story, write usage notes, or improve prop descriptions)
- Fix a color token (hardcoded hex → semantic variable)
- Adjust spacing or copy on an existing page

**Week 5+: Own a feature.**
Take full ownership of a feature from intent to production. For example:
- Build a new page or component from a design intent
- Use an AI coding agent with the repo's skills and harness
- Open, get reviewed, merge, ship

The key: start with *observation* (component library, PRs, project docs), then *low-risk contribution* (documentation, tokens), then *ownership* (features). Each step builds confidence that the system works.

### For PMs and engineers working with designers

The designer on your team no longer hands off mockups. They open PRs. And increasingly, you'll ship UI changes too.

AI coding agents make it possible for anyone on the product team to build and modify interfaces. A PM prototyping a flow, an engineer adjusting a layout, a data analyst adding a dashboard view: all of these produce UI output. The design system, tokens, and harness ensure that output is structurally sound regardless of who wrote it.

What changes is the collaboration model, and specifically, who reviews what:

- **Don't wait for specs.** The designer may ship a working version before you'd have reviewed a Figma file. Review the PR instead.
- **You can ship UI too.** With the design system and AI agent, you have the tools to make interface changes directly. Use the tokens, use the components, open a PR.
- **The designer reviews your UI.** When you ship a UI change, the designer is the accountable reviewer for visual quality, consistency, and user experience. This is the mirror of engineering code review: you review their logic, they review your interface. The designer doesn't need to have written the code to own the quality of what ships.
- **Design feedback happens in code.** Comment on the PR, suggest changes, iterate on the branch, the same way you'd review any other contribution.
- **The design system is shared territory.** Tokens, components, and patterns are the contract between everyone's output. If you change a token, it affects the designer's work. If they add a component, it's available to you.
- **Quality gates are automated.** Lint, type checking, formatting: hooks catch structural issues. Human review focuses on judgment calls: product fit, visual quality, and user experience.

### Hiring for this workflow

The traditional design job description optimizes for execution fluency: Figma mastery, pixel-perfect specs, comprehensive documentation. Those skills are declining in value.

What matters now:
- **Judgment:** can you decide what's worth building?
- **Articulation:** can you make your intent precise enough for a machine to act on?
- **Conviction:** can you hold a position without a finished artifact to point at?
- **Speed:** can you ship something rough, learn from it, and iterate?

Jenny Wen at Anthropic uses a clean three-archetype framework for who actually thrives in this workflow. [^1] It is the most useful hiring frame we've found, and we apply it at Buzzvil.

1. **The block-shaped generalist.** Rather than the classic T-shape (one deep skill plus light coverage), this person has several core skills at the 80th percentile. Research, visual design, prototyping, product thinking, maybe light code. The block shape matters because the design role now stretches into PM and engineering territory. Anyone who can flex across a few domains absorbs the role change without breaking.
2. **The deep specialist (long-T).** Top 10% in one specific skill: visual design, motion, typography, illustration, or highly technical design closer to engineering. In a world where anyone can produce good-enough output, the deep specialist is what makes the work feel *special*.
3. **The craft new grad.** Early-career, humble, technically curious, already building in code. Jenny makes the counter-intuitive case: "People without ingrained habits or attachment to established processes are an advantage when those processes are changing fast." The craft new grad hasn't built muscle memory around Figma-first workflows, which means they don't have to unlearn anything.

The common thread is adaptability. The processes are changing fast enough that attachment to any single tool or method is a liability, regardless of experience level.

The best preparation isn't a portfolio of polished case studies. It's evidence of judgment, speed, and willingness to work in code.

### Measuring output

If designers ship through PRs, measure PRs.

At Buzzvil, we track design team pull requests as a key result: 30+ PRs from 3+ designers in Q2 2026. The Q1 baseline was 16 PRs from 2 contributors (Max: 14, Joy: 2).

This is a novel metric. No other design team we've found tracks PR count as an OKR. But it's the most honest measure of the workflow shift, and it answers one question directly: *are designers actually shipping, or are they still handing off?*

The number isn't the point. The trend is. Week over week, the count should grow and the contributors should diversify.

PRs measure delivery. Discovery is harder to quantify: prototypes tested, risks validated, directions eliminated. We don't have a clean metric for that yet. For now, the delivery metric is the forcing function. Once the team is shipping consistently, discovery metrics will follow naturally as the workflow matures.

### Build trust through speed, not perfection

Anthropic ships products early, labels them research previews, and iterates publicly based on real feedback. Jenny argues that what actually degrades a brand isn't launching something rough; it's launching something rough and then going silent. [^1]

We apply the same principle. SDK Docs shipped at 95%, with final QA happening via a live content update test with the platform team. The design portal went live before every page was perfect. The tech blog migrated 195+ posts in one sprint.

Speed with iteration beats perfection with delay. This applies to both discovery (share the rough prototype early, learn from it) and delivery (ship, then improve based on real usage). The teams that wait for perfection ship less and learn slower.

### Tempo

AI makes individuals fast. Without shared rhythm, that speed produces chaos. Five people shipping 20 PRs a day with no coordination is not productivity. It's noise.

Creative teams need tempo the way an orchestra needs a conductor. Not to control what each musician plays, but to ensure the parts make sense together. The music happens in the space between the notes.

The problem is specific to AI-native workflows: the old cadence was designed around slow production cycles. Standups assumed work took days. Sprint planning assumed a two-week horizon. Design reviews assumed one direction per week. When individuals can ship multiple features per day, those rhythms are too slow to coordinate and too frequent to be useful.

At Buzzvil, we rebuilt the cadence around what AI actually produces: commits, PRs, and measured artifacts.

**Daily: async, artifact-based.**
No standups. Work is visible through commits and open PRs. If you need to know what someone is working on, check the branch. If you need to give feedback, comment on the PR. The artifact *is* the status update.

**Weekly: generated reviews.**
Every week, the system scans git logs across all active projects and generates a progress report. KR completion percentages move (or don't). This replaces the "what did you do this week" meeting with evidence. It also surfaces connections: a commit on the interaction library affects the design library docs, which affects the SDK docs. Those dependencies are visible in the data, not in someone's head.

**Monthly: stakeholder alignment.**
1:1s with the people who consume the design team's output: product managers, group leads, engineering partners. These are not status meetings. They're alignment checks: are we building the right things? Has the priority shifted? What's coming next quarter that we should prepare for?

**Quarterly: OKR reset with real numbers.**
Every key result has a completion percentage measured from artifacts, not self-reported. "Storybook coverage" is 92% because we counted the story files. "Design team PRs" is 16 because we queried GitHub. The quarterly review is a conversation about what the numbers mean, not a debate about what they are.

The cadence serves two purposes. For the individual, it provides checkpoints: moments to step back from the speed of daily AI-assisted work and ask if the direction is still right. For the team, it provides coherence: the assurance that six people shipping independently are building one product, not six.

AI accelerates individual output. Tempo keeps it coherent.

---

## Notes & Further Reading

### Extend the playbook

Each section of this playbook introduces ideas explored in more depth elsewhere. Pick the topic that matters most to you.

**On the value shift** (Part 1)
- [Designing Above the Interface](/blog/designing-above-the-interface): What happens to design's value when production costs zero
- [The Job Description Is Wrong](/blog/the-job-description-is-wrong): The five traits that matter in an agentic era, and why execution fluency isn't one of them

**On the workflow** (Part 2)
- [From Paper to Code](/blog/from-paper-to-code): Why paper forces thinking, code forces reality, and Figma sits in between

**On the environment** (Part 3)
- [My Agents' Operating Manual, Written by the Agent](/blog/harnessing-ai-coding-agents): The five-layer harness in full detail, with examples from production
- [The Flip](/blog/the-flip): What it means to build a design system for agents, not designers
- [When the Interface Assembles Itself](/blog/when-the-interface-assembles-itself): Principles, recipes, and guidelines as the architecture of agentic composition
- [Nobody Owned the Website. Now Everybody Does.](/blog/nobody-owned-the-website-now-everybody-does): A case study of shared tokens replacing four separate web properties

**On the people** (Part 4)
- [Design Tempo](/blog/design-tempo): How to establish organizational rhythm for creative teams working at AI speed
- [Head: A Neural System Across Projects](/blog/head-a-neural-system-across-projects): Managing context across 10+ repositories with markdown and agents

### Elsewhere

Related articles and resources not directly cited above:

- "Design Engineering at Vercel: What we do and how we do it." Vercel Blog. [vercel.com](https://vercel.com/blog/design-engineering-at-vercel)
- "How Anthropic teams use Claude Code." Anthropic Blog. [claude.com](https://claude.com/blog/how-anthropic-teams-use-claude-code)
- "Claude Code vs Cursor: A Power-User's Playbook." Arize AI. [arize.com](https://arize.com/blog/claude-code-vs-cursor-a-power-users-playbook/)
- "The future of enterprise design systems: 2026 Trends." Supernova.io. [supernova.io](https://www.supernova.io/blog/the-future-of-enterprise-design-systems-2026-trends-and-tools-for-success)
- "Vibe Coding Guide - AI-Directed Development Playbook." Awesome Claude. [awesomeclaude.ai](https://awesomeclaude.ai/vibe-coding-guide)
- "Design Systems And AI: Why MCP Servers Are The Unlock." Figma Blog. [figma.com](https://www.figma.com/blog/design-systems-ai-mcp/)
- "Bridging the gap between design and code with v0." Vercel Blog. [vercel.com](https://vercel.com/blog/bridging-the-gap-between-design-and-code-with-v0)
- "Mapping your design system for AI agents." Cristian Morales Achiardi, Design Systems Collective. [designsystemscollective.com](https://www.designsystemscollective.com/codebase-indexing-for-design-systems-agents-c0f6b563a39e)
- "Why your design system is the most important asset in the AI era." The Design System Guide. [thedesignsystem.guide](https://learn.thedesignsystem.guide/p/why-your-design-system-is-the-most)

### Industry context

| Metric | Value | Source |
|--------|-------|--------|
| GitHub code AI-assisted | 51% | GitHub [^2] |
| PR size increase (AI-assisted) | +33% | Greptile [^3] |
| PRs per person increase | +98% | Greptile [^3] |
| PR review time increase | +91% | Index.dev [^3] |
| Designer time on mockups (before AI) | 60-70% | Jenny Wen [^1] |
| Designer time on mockups (after AI) | 30-40% | Jenny Wen [^1] |
| Vibe coding market (2026) | $8.5B projected | Industry estimates [^5] |
| Developers using AI coding tools daily | 72% | Industry surveys [^5] |
| Booking.com PR merge rate (AI users) | +16% | DX Core 4 [^7] |
| Booking.com developer hours saved (year 1) | 150,000 | DX [^7] |
| Booking.com MR increase after training | +30% | DORA report [^8] |
| AGENTS.md: median runtime reduction | -29% | SmartScope [^9] |
| AGENTS.md: output token reduction | -17% | SmartScope [^9] |
| JSON vs Markdown for AI (accuracy) | 80% fewer tokens | Indeed [^10] |

### Sources

[^1]: Jenny Wen, "The design process is dead. Here's what's replacing it." Lenny's Newsletter/Podcast, March 2026. [lennysnewsletter.com](https://www.lennysnewsletter.com/p/the-design-process-is-dead)

[^2]: Chris Roth, "Building An Elite AI Engineering Culture In 2026." [cjroth.com](https://cjroth.com/blog/2026-02-18-building-an-elite-engineering-culture)

[^3]: Greptile State of AI Coding Report / Index.dev, cited in "When product managers ship code: AI just broke the software org chart." [dataworldbank.net](https://www.dataworldbank.net/2026/03/29/when-product-managers-ship-code-ai-just-broke-the-software-org-chart/)

[^4]: "Building AI-driven workflows powered by Claude Code and other tools." UX Collective. [uxdesign.cc](https://uxdesign.cc/designing-with-claude-code-and-codex-cli-building-ai-driven-workflows-powered-by-code-connect-ui-f10c136ec11f)

[^5]: "The Complete Vibe Coding Guide for Designers (2026)." Muzli Blog. [muz.li](https://muz.li/blog/the-complete-vibe-coding-guide-for-designers-2026/)

[^6]: "Towards an agentic design system." Cristian Morales Achiardi, Design Systems Collective. [designsystemscollective.com](https://www.designsystemscollective.com/towards-an-agentic-design-system-c7e0a6469bb1)

[^7]: "Booking.com uses DX to measure AI's impact on developer productivity." DX. [getdx.com](https://getdx.com/customers/booking-uses-dx-to-measure-impact-of-genai/)

[^8]: "QCon London 2026: behind Booking.com's AI Evolution." InfoQ. [infoq.com](https://www.infoq.com/news/2026/03/booking-evolution-ai-manuel/)

[^9]: "AGENTS.md Optimization: 5x Performance Boost for AI Coding Agents." SmartScope. [smartscope.blog](https://smartscope.blog/en/generative-ai/claude/agents-md-token-optimization-guide-2026/)

[^10]: "Your Design System Is Not Ready for AI Agents." Into Design Systems. [intodesignsystems.com](https://www.intodesignsystems.com/blog/design-system-not-ready-for-ai-agents)

[^11]: "Graphic design: The digital revolution." Britannica. [britannica.com](https://www.britannica.com/art/graphic-design/The-digital-revolution) / "American Graphic Design in the 1990s: Deindustrialization and the Death of the Author." Post45. [post45.org](https://post45.org/2019/01/american-graphic-design-in-the-1990s-deindustrialization-and-the-death-of-the-author/)

[^12]: Christopher Alexander, *The Timeless Way of Building* (Oxford University Press, 1979). See also: "The Pattern Technology of Christopher Alexander." Metropolis. [metropolismag.com](https://metropolismag.com/viewpoints/the-pattern-technology-of-christopher-alexander/)

[^13]: "Claude Code power user tips: Verification." Anthropic Help Center. [support.claude.com](https://support.claude.com/en/articles/14554000-claude-code-power-user-tips#h_ae6efc03ec)

[^14]: Marty Cagan, "Build to Learn vs Build to Earn." Silicon Valley Product Group, April 2026. [svpg.com](https://www.svpg.com/build-to-learn-vs-build-to-earn/)

[^15]: "Claude Design." Anthropic Labs, April 2026. [anthropic.com](https://www.anthropic.com/news/claude-design-anthropic-labs)

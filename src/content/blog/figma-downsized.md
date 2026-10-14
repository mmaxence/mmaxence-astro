---
title: "Figma, downsized."
description: "How a shift toward design work in code is changing Buzzvil’s Figma usage, handoffs and tool budget."
date: 2026-10-12T10:00:00+09:00
featured_image: "/blog/figma-downgrade/cover.png"
draft: false
tags: ["ai-design", "design-systems", "workflow", "craft"]
---

Buzzvil has asked Figma to move our account from Organization to Professional this quarter. The decision follows a change in how our design team works: LLM use is established, designers open more pull requests, recurring Figma activity has declined and engineers need fewer dedicated Dev Mode seats.

Our [2026 design-stack article](https://tech.buzzvil.com/blog/2026-buzzvil-design-stack), published in November 2025, anticipated a smaller Figma subscription as our design system became usable directly in code. Company-wide LLM access and engineer review helped make that workflow practical. The usage reports now give us a basis for changing the subscription.

## The changes become clearer together

Our reports cover different parts of the workflow. Read together, they show a consistent direction through the spring and summer of 2026.

Across the six-person design team, average **recorded weekly LLM activity rose from about 1.0 billion tokens in March to 3.2 billion in August**. Over those same months, the team’s **monthly pull requests rose from 10 to 89**, reaching 145 in July. By June, all six designers were opening PRs.

Meanwhile, the Figma audit’s five-designer cohort went from **67 recurring design files in March to 35 in August**, a decline of about 48%. A recurring file is one that a designer reopened with edit rights on at least two days during the month. Files shared by several designers count once.

![Recorded LLM activity and design pull requests grew as recurring Figma file use declined](/blog/figma-downgrade/workflow-timeline.png)

Source notes: LLM snapshot August 31; six designers; mean tokens per complete Saturday–Friday week, grouped by the Friday’s month. PR chart published September 7; six designers; PRs opened across the tracked repositories in each full month. Figma audit September 21; five designers; distinct recurring files in each full month. March–August 2026 throughout.

These numbers do not directly measure productivity. We changed which AI activity we tracked during this period, so the token totals are not fully comparable month to month. And opening a PR does not mean the work has shipped. The practical change is what designers now hand over to engineers: working code they can review and build on.

A designer can now bring an engineer a working preview, the component changes and the interaction behavior in a pull request. In a summer partner project, the engineer carried layout values and animation behavior from the design preview into the production implementation. Engineering still supplied the production integration, tracking and operational work. Much of the visual specification was already inspectable in code.

That changes the need for Dev Mode. Its inspection tools were valuable when engineers repeatedly translated Figma designs into implementation. As more of that handoff moved into the repository, we asked engineers which seats they still needed. **Assigned Dev seats fell from 23 at the end of June to 4 by the September audit. Our goal is zero dedicated Dev seats by year-end.**

These are connected observations of a workflow change. The series cover different populations, and several tools and practices changed together. The concrete link is the handoff: more design decisions became reviewable in code, reducing the need for a separate inspection step in Figma.

## How Claude and Codex fit into the work

Buzzvil made Claude access available across roles in the spring. By September, the company policy supported both Claude and Codex. Designers could develop a routine within an approved environment.

The reports show actual use beyond that access. Internal examples include a designer using Claude to investigate retention in a game-like ad experience, turning an interaction into a runnable prototype, and changing a shared React component in the product repository. Analysis, exploration and implementation each have a place.

The delivery workflow is now concrete enough to teach. Our October guide starts with understanding the existing screen and its code. The designer describes a change, works on a branch, inspects the preview and opens a draft PR. A designer reviews the interface and an engineer reviews the code. The [earlier account of designers opening PRs](https://tech.buzzvil.com/blog/designers-open-the-prs-now/) describes how this became a team practice.

Claude can work with the components and conventions already in the repository. The designer remains responsible for the interaction and visual result. Running the product helps evaluate actual content, narrow screens, loading states and timing.

I also use Codex to review code generated with Claude, a workflow I shared internally in April. That is one documented way to use the two tools together. The reports show different patterns across the team; they establish broader LLM use more clearly than adoption of each individual tool.

Shared components, repository instructions, reusable skills and verification hooks make this practical. We described that foundation in [My Agents’ Operating Manual](https://tech.buzzvil.com/blog/harnessing-ai-coding-agents) and our [shared web platform work](https://tech.buzzvil.com/blog/nobody-owned-the-website-now-everybody-does/).

## What changes in the tool budget

We have chosen Professional. With a smaller seat allocation, it brings the recurring Figma cost much closer to how we use the tool today.

The September audit recorded **6 Full, 24 Dev and 67 Collab seats** under our Organization contract. At the recorded rates, that allocation represents **US$15,180 a year**.

Our year-end target is **6 Full and 35 Collab seats, with zero dedicated Dev seats**. On Professional with monthly billing, that comes to **$295 a month, or $3,540 over twelve months**. Compared with the existing allocation, the projected reduction is **$11,640 a year, about 77%**.

![Current Figma allocation costs $15,180 a year; the planned Professional allocation costs $3,540 annualized, a projected reduction of about 77%](/blog/figma-downgrade/cost-bridge.svg)

The comparison uses the September contract rates and [Figma’s monthly Professional prices checked October 12, 2026](https://www.figma.com/pricing/), assuming the target seats and rates remain unchanged for twelve months. It covers seat subscriptions before taxes and fees; migration and ongoing administration sit outside it. The lower recurring cost begins with the new allocation.

**By our current estimate, that Figma saving will roughly offset the design team’s AI costs.** Company-wide LLM access serves a much wider group; this comparison concerns the design team’s share of that spending.

We also see faster iteration and better design quality. Those gains are harder to measure, but they are clear in our day-to-day work. They come on top of the subscription savings, without a dollar value attached here.

## Figma keeps a more specific role

We no longer spend time maintaining a Figma library or design system. Our systems live in code, and designers maintain them there.

Figma is for loose exploration now: trying directions, comparing ideas, leaving things unfinished. Delivery constraints come later, when we work in the repository. That freedom is deliberate.

Agents will have a role here too. Professional gives up Organization’s ability to [require members to authenticate through Google](https://help.figma.com/hc/en-us/articles/360052497994-Set-login-and-authentication-method). We plan to use agents to help cover the recurring administrative work, including access reviews and offboarding follow-up. Authentication enforcement remains a difference between the plans; the agent-assisted process will need clear ownership. The same tools changing how we design will also help us operate the smaller setup.

Engineers still review design changes. Designers still need to understand implementation constraints. Designers, like engineers, maintain the components, and the team keeps agent instructions and previews usable. Those responsibilities are part of the workflow and its cost.

## More of the work belongs to us

Figma still gives us room to explore. But a design no longer has to end with a file handed to someone else. Designers can carry an idea into a working interface, open it for review and stay involved as it becomes part of the product.

That comes with more responsibility: understanding constraints, maintaining components and working through feedback with engineers. AI helps us take on that work; it does not remove the need to learn it.

A smaller Figma subscription is one result. The more meaningful change is that designers can take their ideas further themselves.

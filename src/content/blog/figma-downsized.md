---
title: "Why I’m making less room for Figma"
description: "How working in code changed what I ask of design tools—and where I put the team’s budget."
date: 2026-10-12T10:00:00+09:00
featured_image: "/blog/figma-downgrade/cover.png"
draft: false
tags: ["ai-design", "design-systems", "workflow", "craft"]
---

I’m making less room for Figma in the way my team works. More of our design decisions now happen in code, and I want the tools we pay for to reflect that.

For years, Figma held much of what engineers needed to build an interface: layouts, components, states and interaction intent. Designers maintained that specification; engineers translated it into the product. Libraries, inspection tools and seats across both teams supported that handoff.

Now, more of the design work can happen in the repository itself. A designer can explore an idea, turn it into a working interface with an AI coding agent, and bring the result to an engineer for review. That changes what still needs to happen in Figma—and who needs access to it.

At Buzzvil, where I lead design, we have asked Figma to move our account from Organization to Professional. To explain that choice, I want to trace what changed in the work: where we make design decisions, how they reach the product, and what we still need Figma to do.

Our [2026 design-stack article](https://tech.buzzvil.com/blog/2026-buzzvil-design-stack), published in November 2025, anticipated a smaller subscription as our design system became usable directly in code. Over the following months, I looked for evidence that our everyday work was actually moving that way.

## I started with the handoff

I looked at three signals together: recorded AI use, design work submitted through pull requests, and recurring Figma activity. Each captures a different part of the workflow; together, they help explain where the work is moving. These are our team’s figures from spring and summer 2026.

Across the six-person design team, average **recorded weekly LLM activity rose from about 1.0 billion tokens in March to 3.2 billion in August**. Over those same months, the team’s **monthly pull requests rose from 10 to 89**, reaching 145 in July. By June, all six designers were opening PRs.

Meanwhile, the Figma audit’s five-designer cohort went from **67 recurring design files in March to 35 in August**, a decline of about 48%. A recurring file is one that a designer reopened with edit rights on at least two days during the month. Files shared by several designers count once.

![Recorded LLM activity and design pull requests grew as recurring Figma file use declined](/blog/figma-downgrade/workflow-timeline.png)

Source notes: LLM snapshot August 31; six designers; mean tokens per complete Saturday–Friday week, grouped by the Friday’s month. PR chart published September 7; six designers; PRs opened across the tracked repositories in each full month. Figma audit September 21; five designers; distinct recurring files in each full month. March–August 2026 throughout.

These numbers do not directly measure productivity. We changed which AI activity we tracked during this period, so the token totals are not fully comparable month to month. And opening a PR does not mean the work has shipped. What matters to me is what designers now bring to engineers: working code they can review and build on.

A designer can now bring an engineer a working preview, the component changes and the interaction behavior in a pull request. In a summer partner project, the engineer carried layout values and animation behavior from the design preview into the production implementation. Engineering still supplied the production integration, tracking and operational work. Much of the visual specification was already inspectable in code.

That changes the need for Dev Mode. Its inspection tools were valuable when engineers repeatedly translated Figma designs into implementation. As more of that handoff moved into the repository, we asked engineers which seats they still needed. **Assigned Dev seats fell from 23 at the end of June to 4 by the September audit. Our goal is zero dedicated Dev seats by year-end.**

I read these as connected observations, with limits. The series cover different populations, and several tools and practices changed together. The handoff gives me the clearest explanation: more design decisions became reviewable in code, reducing the need for a separate inspection step in Figma.

## The tools need a practice around them

For this to change a team’s workflow, designers need reliable access to the tools and a way to review what they produce. In our case, Claude became available across roles in the spring, and the company policy supported both Claude and Codex by September. Designers could develop a routine within an approved environment.

The examples I find useful go beyond access: a designer using Claude to investigate retention in a game-like ad experience, turning an interaction into a runnable prototype, or changing a shared React component in the product repository. They show where these tools can help across analysis, exploration and implementation.

The delivery workflow is now concrete enough to teach. Our October guide starts with understanding the existing screen and its code. The designer describes a change, works on a branch, inspects the preview and opens a draft PR. A designer reviews the interface and an engineer reviews the code. The [earlier account of designers opening PRs](https://tech.buzzvil.com/blog/designers-open-the-prs-now/) describes how this became a team practice.

Claude can work with the components and conventions already in the repository. The designer remains responsible for the interaction and visual result. Running the product helps evaluate actual content, narrow screens, loading states and timing.

I also use Codex to review code generated with Claude, a workflow I shared internally in April. That is my own pattern; other designers use the tools differently. The team’s figures tell us more about broader LLM use than adoption of either tool individually.

Shared components, repository instructions, reusable skills and verification hooks make this practical. We described that foundation in [My Agents’ Operating Manual](https://tech.buzzvil.com/blog/harnessing-ai-coding-agents) and our [shared web platform work](https://tech.buzzvil.com/blog/nobody-owned-the-website-now-everybody-does/).

## Let the budget follow the work

With less of the handoff depending on Figma, I had a reason to revisit both the plan and the seats. Professional with a smaller allocation fits the work we still do there more closely.

The September audit recorded **6 Full, 24 Dev and 67 Collab seats** under our Organization contract. At the recorded rates, that allocation represents **US$15,180 a year**.

Our year-end target is **6 Full and 35 Collab seats, with zero dedicated Dev seats**. On Professional with monthly billing, that comes to **$295 a month, or $3,540 over twelve months**. Compared with the existing allocation, the projected reduction is **$11,640 a year, about 77%**.

![Current Figma allocation costs $15,180 a year; the planned Professional allocation costs $3,540 annualized, a projected reduction of about 77%](/blog/figma-downgrade/cost-bridge.svg)

The comparison uses the September contract rates and [Figma’s monthly Professional prices checked October 12, 2026](https://www.figma.com/pricing/), assuming the target seats and rates remain unchanged for twelve months. It covers seat subscriptions before taxes and fees; migration and ongoing administration sit outside it. The lower recurring cost begins with the new allocation.

**By our current estimate, that Figma saving will roughly offset the design team’s AI costs.** Company-wide LLM access serves a much wider group; this comparison concerns the design team’s share of that spending.

I also see faster iteration and better design quality in our day-to-day work. Those are harder judgments to substantiate than a seat count, so I have not assigned them a dollar value here.

## What I still want from Figma

We no longer spend time maintaining a Figma library or design system. Our systems live in code, and designers maintain them there.

I still want a place for loose exploration: trying directions, comparing ideas, leaving things unfinished. Figma gives us that space. Delivery constraints come later, when we work in the repository. I want to keep that freedom.

Agents will have a role here too. Professional gives up Organization’s ability to [require members to authenticate through Google](https://help.figma.com/hc/en-us/articles/360052497994-Set-login-and-authentication-method). We plan to use agents to help cover the recurring administrative work, including access reviews and offboarding follow-up. Authentication enforcement remains a difference between the plans; the agent-assisted process will need clear ownership. The same tools changing how we design will also help us operate the smaller setup.

Engineers still review design changes. Designers still need to understand implementation constraints. Designers, like engineers, maintain the components, and the team keeps agent instructions and previews usable. I have to account for those responsibilities alongside the subscription savings.

## What I’m making room for

Figma still gives us room to explore. But a design no longer has to end with a file handed to someone else. Designers can carry an idea into a working interface, open it for review and stay involved as it becomes part of the product.

That comes with more responsibility: understanding constraints, maintaining components and working through feedback with engineers. AI helps us take on that work; it does not remove the need to learn it.

The question I keep coming back to is how far a designer can take an idea—and what support they need to take it further. Working in code has changed my answer. It has also changed where I think our time and budget belong.

That is why I’m making less room for Figma. I want to make more room for designers to carry their ideas into the product themselves.

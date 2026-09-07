---
title: "Designers Open the PRs Now"
description: "6 months. 432 pull requests. One design team. What got better, and what it cost us."
date: 2026-09-07T10:00:00+09:00
featured_image: "/images/designers-open-the-prs-now.jpg"
draft: false
featured: true
featured_order: 6
tags: ["ai-design", "design-systems", "workflow", "craft"]
---

Recently, one of our designers was exploring a lucky-draw concept in the ad participation flow. Not fixing anything. Just looking around, the way you do when you are early in a direction.

And then the screen jumped.

One second, barely. You open the ad overlay, you close it, and the page snaps back to the top instead of holding your position. Everything worked. No error, no crash, nothing a QA ticket would ever describe. It had been live for a while and nobody had noticed, because functionally it was fine.

Rina noticed. She paired with Claude, found that a shared hook, `usePreventScroll`, was overwriting the scroll position to 0 when two overlays locked at once, fixed the root cause with reference counting, added regression tests, and opened a PR.

![Finn approves the pull request with LGTM, then the branch is merged with 14 checks passed](/blog/designers-open-the-prs-now/pr-10939-approval-merge.png)

46 minutes from PR open to production deploy. Same day. And because the fix went into a shared hook, every partner app using that overlay got better at the same time. You can read that part straight off the labels:

![Pull request 10939 merged, labelled buzzbenefit, kbank, kbstar, monimo and samsung-wallet](/blog/designers-open-the-prs-now/pr-10939-header-labels.png)

Then Finn, Front-End Dev, posted in the channel:

> 오오 직접 배포하는 디자이너 🕺
>
> *(whoa, a designer deploying to production herself)*

That day is not the story. The story is the 6 months that made that day normal.

---

### What a design PR actually is

First, the objection, because it is always the same one and it is fair: *designers pushing to the production repo, are you insane?*

Here is the framing that unlocked it for our team. **A PR is a suggestion edit on a Google Doc.** Nothing merges without the owning engineer's review. Nothing reaches a user before it passes the same gate as any other change: lint, types, tests, CI, code review. The blast radius of a designer's branch is zero until someone with the keys says yes.

What changed is not the safety model. What changed is the artifact.

Instead of a Figma file plus a ticket plus a Slack thread plus a follow-up "hey is this the right spacing", there is one object holding the intent, the implementation, the diff, the review conversation and the deploy. The design PR *is* the spec.

We started somewhere else, by the way. Prototypes in Figma Make, then self-contained HTML prototypes on Vercel. Fine for exploration, useless for delivery, because an out-of-repo prototype does not know your tokens, your components, your data shapes, or the 40 decisions your codebase already made. We spent a good two months there before admitting it.. Moving into the real production repositories changed both speed and quality, for one reason we come back to at the end: the agent could finally see what it was building on.

---

### The numbers

Every pull request opened by a member of the design team, across all our repositories, over six full months.

![Design team pull requests per month in 2026, rising from 10 in March to 145 in July as the share of the team contributing goes from 17% to 100%](/blog/designers-open-the-prs-now/prs-by-month.svg "Design team pull requests per month, 2026")

| | Q1 2026 | Q2 2026 | Q3 2026 (to Sep 4) |
|---|---|---|---|
| PRs opened | 10 | **177** | **245** |
| Share of the team contributing | 17% | **100%** | **100%** |
| Merged | 90% | 82% | 87% |
| Repositories touched | 3 | 14 | 15 |

Two things in that table matter, and neither is the totals.

**The share of the team.** In Q1 every PR was mine, a lead running a personal experiment, which is where most teams stop. Q2 is when it became the team's default instead of the lead's hobby. That row reaching 100% is the result. The 177 is just what it produced.

**The merge rate.** 82% and 87% of design PRs merge. The rest are closed exploration branches, superseded stacks, and a few genuinely bad ideas that died in review, which is where bad ideas should die. If your design PRs merge at 40%, you have a scoping problem, not a workflow problem.

Now a number from the opposite direction. Figma Dev Mode exists so engineers can read a design and rebuild it by hand. If delivery really moved into code, that canal should empty on its own.

![Active Figma Dev Mode seats: 23 in June 2026, 3 in July, 4 in August](/blog/designers-open-the-prs-now/figma-devmode-seats.svg)

It did. Nobody was forced. We asked the engineering teams whether they still needed Dev Mode, and they gave the seats back, because the handoff those seats served had stopped happening.

The 4th seat in August is the honest asterisk on this whole article: one partner customization project still running a Figma-first handoff.

---

### Wide exploration, one delivery lane

None of this makes Figma the enemy, and most people read "designers ship code" as "designers stopped using the canvas". Not what happened.

**Exploration spans everything.** The canvas, throwaway HTML mockups, a coded prototype, a screenshot with arrows on it. Figma is still the best tool I know for spreading 8 directions across one surface and comparing them at a glance. Code is linear, so you invest in one direction and immediately start defending it. Use whatever gets you to the answer fastest, and treat the artifact as disposable, because it is.

**Delivery is strictly the codebase.** One lane, no exceptions. If it ships to a user it was built in the repo, it has tests, it passed review, it went through CI. The moment a direction is chosen, it stops being a picture of a product and becomes the product.

**And Figma never held our design system. It held a copy of one.**

The system always lived in the codebase: tokens, components, behaviours, the actual material the product is made of. What we kept in Figma was a mirror synced by hand, and a hand-synced mirror is just drift with a schedule. Every team that has argued about whether the Figma library or the code is "right" already knows the answer. It was always the code, because the code is what your user touches.

So we stopped maintaining the mirror. Designers now change the system where it lives: same repository, same PR, same review as any engineer's change. When a token moves, it moves once. You should try; you would feel so much lighter. ^^

So before you copy any of the workflow, answer this one for your own team: where does your design system actually live? Then stop maintaining the copy.

---

### What got better

**No buffer.** Another designer, on why she started shipping code herself:

> The FE engineers were too busy debugging, so I started doing it myself.

Her change merged the same week. Under the old loop: a mockup, a ticket, a sprint boundary, and a two-week wait to move a button.

**Real conditions, before release.** A code prototype runs on real data, at real widths, with the real components. Edge cases surface while you design instead of two days after launch. You cannot fake responsiveness on a canvas, and everybody who has tried knows it.

**The things that never survived the effort-versus-impact review.** Motion, transitions, the small timing decisions that make a product feel intentional. They used to lose every prioritization fight because specifying them was expensive. Now the designer just does it, and the argument never happens.

**Fixes land in the shared layer.** In the codebase, you fix behaviour where it lives, usually a shared component or hook, so one change improves every surface using it. Design quality stopped being per-screen.

**Craft reaches the user intact.** This is the one that matters to me. For 15 years we accepted translation loss between the design and the build as the cost of doing business. It is optional now.

---

### What it cost us

I would not trust this article if it stopped there.

**Review load moves onto engineers, and it is real.** Industry-wide, AI-assisted teams see PRs per person up 98%, median PR size up 33%, and review time up 91%. Generating code got cheap. Reading it did not (well, not entirely). Roll designers into the repo without planning for this and you have quietly moved a cost from design onto engineering, and your EMs will notice before you do.

Three things kept ours low. Design PRs build on the modules and conventions already in the repo, so consistency comes largely by construction. An automated pass runs on the branch before the PR is even opened, so the reviewer never sees the obvious stuff. And most design PRs are stacked with the FE and BE PRs they belong to, reviewed together rather than as a surprise.

**The review itself is becoming AI-assisted.** Look at who spoke on Rina's PR before Finn did: a bot had already posted a walkthrough, a file-by-file summary, a sequence diagram of the lock behaviour, and the coverage delta. By the time the human opened it, the diff had been read once. Finn's job was not to reconstruct what changed; it was to decide whether it should ship. The +91% figure is a snapshot of a moment when generation had agents and review did not, and that gap is closing fast.

What should never be automated is the *should this exist* question. That one stays with a person, on both sides of the diff.

**Adoption runs at different speeds, and the blocker is usually not the designer.** Every designer at Buzzvil works this way today, and getting there took very different amounts of time per person. What slowed each one down was rarely someone refusing to learn.

It was the product. Some surfaces are clean, with a component library and an obvious place to put a change. Others are older, tangled with backend work, or behind a partner's release calendar, and a first PR there is genuinely harder.

More often it was the surrounding team. The PM and the engineers had never been asked to accept a design PR and had no idea what to do with it. Who reviews it? Does it slow their sprint? Does it step on their ownership? Fair questions, unanswered, so the work stalled politely, which is the worst way for work to stall.

We solved them, team by team, by talking rather than by tooling. Budget for that, because this does not spread on its own. It spreads one team conversation at a time.

**The two lanes blur, and the line does not draw itself.** Naming exploration and delivery separately is the easy part. Living it is not. A designer can build something functional in an afternoon, and the trap is polishing a discovery prototype because it already looks close to real. Ask any designer on your team which lane they are in right now. The ones who cannot answer are doing both jobs at once.

**Speed without tempo is noise.** A team shipping 20 PRs a day with no shared rhythm is not productivity; it's a merge queue. We killed the daily standup (open PRs are the status update) and generate the weekly review from git logs. Individual velocity went up first and coordination had to catch up after, in that order, painfully.

**PR count measures delivery only.** It says nothing about whether the right thing got built. We track it because it answers one blunt question honestly: *are designers shipping or still handing off*, and because you cannot game it with a nicer mockup. But a team optimizing PR count is a team that will ship 300 confident mistakes. Discovery still has no clean metric, and I don't have one for you.

---

### The setup is the whole job

Most teams who try this get generic output and conclude AI can't do design. Their workflow was not the problem, their environment was.

The fear that AI makes everything look the same was completely valid in 2024. An unharnessed model defaults to the statistical average of everything it has seen, which is a Tailwind hero and a gradient blob. That is a setup problem, and it is solved. In the order I would build it:

1. **Tokens as the actual material.** Every color, space, and type step is a semantic variable, in three layers: primitives, semantic, component. When the whole surface is systematic, a hardcoded hex looks wrong to the agent, not just to you.
2. **Standing orders in the repo.** A `CLAUDE.md` at every repository root. Every rule you write there saves a hundred future corrections.
3. **Skills that encode craft,** so the knowledge lives in the repo instead of in one senior designer's head.
4. **Hooks that verify.** Silent on success, loud on failure. If you adopt one thing from this article, adopt this one.
5. **A preview environment.** A branch with a shareable URL is what turns a PR into something a PM can click.

The designer's new craft is building that environment. Set the constraints, encode the brand, publish the tokens, write the skills, and the agent produces *your* design instead of *a* design.

---

### You cannot start on Monday

Most articles like this end with a five-week plan and a friendly "just open a PR". I wrote that version first and deleted it, because it skips the part that takes the time and makes this sound like a decision a motivated designer can make alone. It is not.

**What someone has to clear before your designers write a line:**

**An LLM your company has actually approved.** An org-level agreement, reviewed for what happens to source code sent to a model, with a data-handling answer security has signed. Not a subscription quietly expensed by one person. Buzzvil had done this company-wide, so it was solved before design needed it. If yours has not, this alone can run a quarter.

**Write access to a production repo for someone whose title is not engineer.** A policy question wearing a permissions costume. The decision belongs to the team who owns the repo, not to you.

**A security review of that decision.** Who can merge, what the branch protections are, whether the branch can reach secrets, what happens if a bad change lands. Good questions. Have answers before you are asked.

**CI a non-engineer's branch can run,** with the preview environment on top. Note the order: preview is the last brick, not the first. Teams get excited and start there, then discover their designers still cannot push.

**A review policy in writing:** who is the required reviewer, and whether it competes with their sprint. Skip it, and the PRs sit open for a week, and everyone quietly concludes the experiment failed.

And underneath all of it, a culture where crossing functions reads as help rather than intrusion. If the first design PR in your company sets off a boundary discussion, fix that conversation before you write any code. No harness will save you from it.

For us, that path took months, carried by DevOps, security, engineering leads and the CTO, and a designer did almost none of it. Start those conversations early and in parallel, because they queue badly and each has a different owner.

**Once the path is clear, the ramp is the short part.** Start small and safe: a hardcoded hex to a semantic token, spacing on a page, the full loop on something where being wrong costs nothing. From there it is a short step to owning a feature end to end.

---

### The one thing to remember

An agent is only as strong as the context it can reach. In the repository, it sees your tokens, your components, your data, your conventions, and it builds on them. Outside, it guesses and hands you back the average of the internet.

So the ceiling is not the model you licensed. It is how many of your people can put a model where the work actually lives.

If the codebase is a room only engineers may enter, that is the only room in your company where AI runs at full strength. Everybody else gets a chat window.

**An AI-native company is not one where everybody uses AI. It is one where everybody can put AI in context, where a cross-functional team is working on the same product and codebase.**

---

### It goes both ways

Now that designers touch code, the honest consequence is that non-designers touch design, and we are putting that protocol in place right now. An engineer or PM who spots a UI problem makes the change themselves, opens a design PR, and a designer is the accountable reviewer on it. Opt-in, never mandatory, with the design system as the shared contract that keeps the output sound no matter who wrote it.

It is the exact mirror of code review. You review our logic, we review your interface.

Which, if you think about it, is just design critics with a diff attached. Peers reviewing peers, on the artifact and not on the person. We have been asking for that for 20 years.

The gap between the thing you intended and the thing your user touches is now about 46 minutes wide, and prior to closing it entirely, we still have a few partners to move.

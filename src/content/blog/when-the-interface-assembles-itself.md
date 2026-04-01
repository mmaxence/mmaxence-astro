---
title: "When the Interface Assembles Itself"
description: "Agentic systems are starting to assemble interfaces in real time, differently for each person. What replaces the fixed screen, and who designs for it, is worth thinking about before it arrives."
date: 2026-03-25T10:00:00+09:00
draft: false
featured_image: "/images/when-the-interface-assembles-itself.png"
tags: ["ai-design", "product-strategy"]
---

For now, everyone using a product sees roughly the same thing. That's about to become the exception. Agentic systems are starting to assemble interfaces in real time, differently for each person, and with it, the way designers think, work, and deliver is about to change fundamentally. What replaces the fixed screen, and who designs for it, is worth thinking about before it arrives.

---

For thirty years, designing a great interface meant making one screen serve as many people as possible. Personas helped. Context mapping helped. Designing for edge cases, for accessibility, for a dozen different devices and moments and states of mind. All of it was sophisticated work in service of a blunt instrument. One fixed thing, shipped to everyone.

For a long time, I had this impossible dream. Probably like some of you reading this. That the better version of this work wasn't one polished screen for everyone, but an experience built for each person individually. Granular, contextual, genuinely personal. We did create variations per segment. We mapped contexts, built flows for different profiles. But that was never close to what I had in mind. The gap between what we could ship and what I actually wanted to build stayed wide. And honestly, I stopped expecting it to close.

What makes it approachable now is the shift toward agentic systems. AI that doesn't just recommend, but composes and delivers, assembling an interface in real time from a set of decisions made long before the user arrived. I've been working on exactly that. [The Flip](https://mmaxence.me/blog/the-flip/) is what it looks like when you start building for it.

But here's what that shift actually means in practice. The screen is dead. Not as a surface, people still have phones and browsers, but as the primary unit of design work. And with it go the limitations that kept us from building experiences at the level of granularity we always wanted. The mockup was never the goal. It was the closest approximation we could ship. That constraint is lifting.

## What an AI-assembled interface actually is

For most of digital design history, an interface was a document. You made decisions, you shipped them, everyone got the same thing. Personalization meant a dark mode toggle and a saved username.

That era is ending.

What replaces it is an interface assembled in real time, tuned continuously across multiple dimensions at once. It adapts to who you are. What you've done before. What you're trying to do right now. What moment you're in. Commuting with one hand, or sitting down with intent. Six months into using a product, or opening it for the first time.

The surface is the same. The experience is not.

This isn't a design trend. It's a structural shift in what an interface is becoming. From noun to verb. From artifact to process. From something you make once to something that happens differently every time.

---

## The problem with letting agents optimize

Good UX and business performance are not in conflict. They converge at the right time horizon. Trust, clarity, simplicity, these aren't nice-to-haves sitting opposite conversion goals. They're the mechanism through which users stay, come back, and eventually contribute to LTV. Long experience is good business. This is not a controversial statement.

The problem is that an AI composition layer doesn't naturally see this.

Left unguided, it optimizes for what it can measure fastest. The tap. The click. The immediate conversion. These signals are legible in the moment. Trust built across forty interactions over six months is not. The feeling of a product being coherent and honest across a year of use is not.

So the AI isn't malicious. It's just myopic. It sees this session clearly and month six barely at all. And if it's only given short-term signals to learn from, it will optimize its way toward an experience that converts today and erodes tomorrow.

Someone has to draw the longer horizon in. That's not an engineering problem. It's a design problem.

---

## The coherence problem in agentic composition

When a human designer makes a screen, it has an implicit coherence. One perspective, one set of decisions, one moment in time. You don't have to specify that the button radius should feel consistent with the card radius. You just know.

An AI assembling an interface from components has no such intuition. It has no memory of why a decision was made. It has no taste that unifies the output. Every composition is stateless. Every instance is new.

Without coherence being explicitly encoded into the system, the result is technically functional, possibly high-converting in session, and completely devoid of the accumulated identity that makes a product feel like itself. Compatible components. Incoherent experience. At scale.

This is how brands get quietly hollowed out by AI composition. Not through bad decisions. Through the absence of constraints that would have made those decisions consistent.

---

## What designers will actually build for agents

This is where the role either evolves or becomes redundant. And the answer is more concrete than most of the discourse admits.

Designers build three things. They're stacked by abstraction.

**Principles.** The constitution. The non-negotiables that the composition system must honor regardless of who it's serving, what it's optimizing for, or what the session metrics say. Clarity before cleverness. Trust before conversion. Whatever the product has decided it is at its core. These are written once and they govern everything below them. They don't bend for a good A/B result.

**Recipes.** Predefined flows and interaction patterns that represent validated, coherent experiences for known contexts. Not every possible combination. The ones that have been thought through, tested, and judged sound. A designer's accumulated judgment, crystallized into reusable structure. The AI can draw from these, extend them, and recombine them. But it does so from a foundation of decisions that were actually made by someone.

**Skills and guidelines.** The granular layer. UX writing rules that govern voice across every generated string. Style tokens that carry visual identity from the design system into the composition layer. Component behavior specs. Interaction grammar. And eventually, a full UI Kit that functions not as a Figma deliverable for engineers, but as a library of agent-ready primitives with explicit rules about how they can and cannot be combined. The micro-decisions that used to live in a designer's head or a file comment, now externalized as structured, machine-readable instructions the composition layer can actually follow.

The interesting thing about this stack is that it maps almost exactly to how a good senior designer already thinks. Principles they don't compromise. Patterns they've learned work. Instincts developed over years about details. The shift is that none of it can stay tacit anymore. It has to be written down. Precise enough that a system with no intuition and no memory can apply it consistently across instances it will never directly observe.

---

## The two skills that still belong to designers

Two skills. Different layers. Both non-negotiable.

Taste is generative. It's what shapes the principles in the first place. It's how you know what good feels like before you can explain why. It's the faculty that decides which recipes are worth crystallizing and which component behaviors are right versus merely functional. Without taste, you have nothing worth encoding. You're documenting arbitrary decisions with great precision.

Articulation is transmissive. It's how taste escapes the individual and becomes operational at scale. A designer with taste but no articulation is a bottleneck. Every good decision dies with the session. A designer with articulation but no taste is producing very legible rules about nothing in particular.

The reason articulation gets elevated in the AI-composed world isn't that it outranks taste. It's that it was previously optional. You could have great taste, make great screens, ship them, and the taste was embedded in the artifact. The artifact carried it forward. Now the artifact is gone. The interface is assembled fresh every time. Taste has nowhere to live except in the system the designer explicitly authors.

Taste is the input. Articulation is the medium. One shapes what the system should be. The other makes sure it actually becomes that, at every instance, for every user, without the designer in the room.

---

## What carries over

Systems thinking carries over completely. The ability to define relationships, constraints, and behaviors at a structural level is exactly what this new role demands.

Taste carries over completely. It just needs a new output channel.

Component-level craft carries over. How something feels at the unit level matters more, not less, when that unit gets assembled into a thousand different contexts you didn't design.

What doesn't carry over: designing a single canonical flow as the final deliverable. Assuming coherence will emerge from the process naturally. Using a finished screen as the primary representation of a design decision.

---

## What this means

The interface isn't going away. It's changing form. From a thing you make to a process you define. From an artifact to a system of decisions that gets assembled differently, every time, for every user, in every context.

Designers won't become less important in that shift. They'll become the authors of something with much higher leverage and much lower visibility. The decisions they make upstream will propagate across compositions they will never directly see.

The question isn't whether designers have a role in an AI-composed world. They'll have a larger one than before.

The question is whether the discipline thinks seriously about that role before the alternative, handing the assembly entirely to the AI and hoping for the best, becomes the default.

It won't make good choices on its own. It will make fast ones.

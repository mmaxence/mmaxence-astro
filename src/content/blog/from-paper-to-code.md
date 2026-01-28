---
title: "From Paper to Code"
description: "Rethinking 0-to-1 in product design"
date: 2026-01-28T10:00:00+09:00
draft: true
---

Design tools have never been more powerful.
They have also never felt this heavy.

At Buzzvil, like most product teams today, we rely heavily on Figma. It is a strong tool. It standardized collaboration, reduced friction between design and engineering, and raised the overall quality bar across the industry.

But lately, I have been feeling a growing discomfort using it as the unquestioned center of our design process.

## When the tool becomes the process

The modern design workflow is now almost a default:

Ideas start in Figma or Figjam.
They get refined, polished, aligned.
They are handed off to engineering via Dev Mode.
They are rebuilt, adjusted, interpreted in code.

This works. We use it every day.

The issue is not so about efficiency.
But more about dependency and a lack of perspective this constrains us.

More and more of our design thinking, interaction logic, and system decisions live inside a tool we do not control. That lock-in is no longer just about files or formats. It is about pricing, feature access, platform direction, and now even LLM tokens.

As a user, this starts to be uncomfortable.

Because design should be about shaping systems and behavior, not about adapting our thinking to the constraints of a tool.

## Asking a different question

Instead of asking how to design better in Figma, I started asking a simpler question:

What if Figma was no longer the place where design starts and ends?

What if we experimented with a flow that looks more like:

**paper → code**

Not as a provocation for the sake of it.
Not as an anti-design stance.
But as a way to reduce unnecessary steps between intent and reality.

## Paper is a deliberate mean to take time to think 

When I say "paper", this could be expanded to notes, or drafting, mind-mapping ideas on a tablet or on Figjam. The point being that we spend time clearly defining the problem we are trying to solve and develop solutions by stripping design down to what actually matters early on:

- Intent
- Structure
- Interaction
- Constraints

Sometimes that takes the form of real sketches.
Sometimes rough wireframes.
Sometimes a simple layout in a basic Figma file.
Sometimes just text.

The point is not fidelity.
The point is clarity.

High-fidelity mockups are expensive. They are useful, but not always necessary to move forward.
And this might be even more true with AI, as we can now concretize an idea into a functional prototype in minutes.

## Code as a design surface

Over the past months, I started using Cursor not only as an engineering tool, but as part of my design process.

With a strong PRD, clear constraints, and lightweight visual references, Cursor can already:

- Generate working UI flows
- Explore interaction logic
- Iterate on states and transitions
- Produce real, runnable prototypes

This matters a lot for Buzzvil.

Our products are not static screens. They are interaction-heavy, multi-step experiences where timing, feedback, and reward logic are core to the value proposition. These qualities are often hard to judge from static mockups alone and tricky to make in Figma Design alone (but possible via Figma Make).

Code forces truth early.

## The real prerequisite: a code-based UI system

While you can experiment and play around with it, this approach only works under one condition in a real product environment:

You need a solid, flexible, code-based UI kit.

Not a visual library that happens to be implemented later, but a real system:

- Components as primitives
- Clear theming rules
- Predictable variants
- Explicit extension patterns

We are not fully there yet.

We are building this system incrementally, as part of the experimentation itself. Historically, we never managed to dedicate enough resources to fully systematize our UI in code. This process forces us to confront that gap.

The difference now is intent.

Instead of designing components visually and translating them later, the system evolves directly in code. The LLM becomes a collaborator that respects existing patterns, extends them, and helps the system grow without constant reinvention.

## Where Figma still fits

This is not about removing Figma from our workflow.

Figma remains extremely valuable for:

- Communication
- Alignment
- Sharing intent across disciplines
- Capturing snapshots of decisions

But it does not have to be the birthplace of every design decision.

Not every problem needs a polished mockup to be understood.

## What we are experimenting with

In 2026, we plan to run small, controlled experiments at Buzzvil:

- Designing some flows directly from PRD to code
- Using sketches or low-fidelity layouts only when they add value
- Treating Cursor as a prototyping surface, not just an editor
- Letting the UI system evolve through usage, not theoretical completeness

This is not a declaration of a new process.
It is a learning phase.

Some experiments will fail.
Some will prove useful.

That is expected.

## Why this matters

Tools shape behavior.

If design lives only in Figma, it risks drifting away from real constraints.
If design lives only in code, it risks losing intent and craft.

The interesting space is in between.

Paper forces thinking.
Code forces reality.

Shortening the distance between the two feels worth exploring, even if it is uncomfortable.

We are not there yet.
But this is the direction we are testing.

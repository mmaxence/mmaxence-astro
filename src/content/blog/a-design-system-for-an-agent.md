---
title: "A Design System for an Agent"
description: "The consumer of our design system changed from designers to agents. What that breaks, and how craft survives when an agent does the composing: the judgment moves into the recipe, it doesn't disappear."
date: 2026-06-16T10:00:00+09:00
draft: true
tags: ["ai-design", "design-systems", "agents", "product-strategy"]
---

<!-- AGENT DRAFT for Max's voice pass. Structural draft only, rewrite the prose in your own voice.
     Running metaphor: the kitchen (cook = agent, ingredients/recipes/cookbook = the library, tasting = review).
     Kept as nuance, not allegory. The banks/river signature line was dropped for one coherent metaphor, restore if you want it.
     TODO before publish: final title/slug, replace [Cooker screenshot], add a ## Related block
     (the-flip / ai-native-design-workflow-playbook / when-the-interface-assembles-itself), set featured + featured_order. -->

As a Frenchman, I love spending time in the kitchen, cooking things for the fam. As a designer, I love crafting delightful interactions. So in the first half of 2026, I spent a crazy amount of time in an interaction cooker. What did I do in there? I taught agents how to cook. How did I do it? This article will tell you. :)

For twenty years a design system was a kitchen built for people. Tokens, components, guidelines: a shared pantry and a shared way of working, so designers and engineers could make the same dish without standing over each other's shoulder.

Last year the cook changed. The hands reaching into the system most often are no longer a designer's. They belong to an agent.

That sounds like a small change. It changes the whole job. A human cook improvises. She reads a recipe, glances at the pantry, and quietly supplies the ten things the recipe left out, from taste, from having made the dish a hundred times. An agent supplies nothing. It makes exactly what the recipe says it can, and stops where the recipe goes quiet. The judgment a cook keeps in her hands has to move onto the page, written down, or the dish is lost.

So the work moved. Less time at the stove. More time deciding what is worth cooking, and writing the recipe precisely enough that someone who cannot taste can still follow it.

## The system, as data

Here is one ingredient, labelled the way a cook who cannot taste needs it labelled.

```ts
export const couponCardManifest: ComponentManifest = {
  id: 'CouponCard',
  layer: 'experiences',
  description: 'Animated coupon reveal with discount value, copyable code, and a "Use Now" CTA. Conversion-stage reward delivery.',
  funnelStages: ['conversion'],
  intent: 'reward',
  flowPredecessors: ['FlipCard', 'ScratchReveal', 'SpinWheel'],
  flowSuccessors: ['Burst'],
  brandHooks: [
    { prop: 'value', brandAspect: 'product', description: 'Discount value, e.g. "15%", "₩5,000".' },
    { prop: 'title', brandAspect: 'tone',    description: 'Coupon title, in brand voice.' },
  ],
  compositionRules: [{
    role: 'reward',
    pairsWith: ['FlipCard', 'ScratchReveal', 'SpinWheel'],
    constraints: 'Use as the reward reveal after a discovery interaction. Always pair with a CTA so users can act on the coupon.',
  }],
};
```

A designer reads this and sees a coupon. The agent reads it and learns where the ingredient belongs in the meal, what it is for, what should come before it, what has to come after, and which parts the diner gets to season and which parts the kitchen keeps. The taste is in the `constraints` line. That one sentence is the design decision, written for a cook that does not improvise.

Every ingredient carries a label like this, shelved across three layers: raw primitives at the bottom, prepared dishes in the middle, plating and theming on top. So the agent reaches for the right shelf instead of one crowded pantry.

The brand is data too. A recipe does not know whose it is until a seed arrives.

```ts
// Same recipe. Two brands. Two seeds.
export const oliveYoung = {
  seed: { primary: '#00A862', mode: 'light', radiusBase: 8 },
  designNotes: 'Clean and inviting. Avoid aggressive urgency.',
};
export const musinsa = {
  seed: { primary: '#000000', mode: 'dark', radiusBase: 2 },
  designNotes: 'Minimal, monochrome, sharp corners. Bold CTAs, nothing cute.',
};
```

Hand the same coupon recipe these two seeds, and one comes out soft, green and rounded, the other sharp, black and editorial. The skeleton underneath is identical. The `designNotes` are taste written for the cook, so the agent reads how each brand wants to feel and cooks toward it.

## The Cooker

A label tells you an ingredient *can* go in a dish. It does not prove the dish holds together, on a real menu, served to a real table. That is what the Interaction Cooker is for.

The Cooker is a test kitchen. It takes a recipe, a brand's house style, and the library, and plates the whole interaction end to end, the way an agent would make it. It is where we found out whether the recipes we wrote were the right recipes, before anything reached a paying table.

![The same O/X Quiz recipe in the Cooker, rendered under Olive Young: green, rounded, a skincare question.](/blog/a-design-system-for-an-agent/ox-quiz-olive-young.jpg)

![And under Musinsa: black, sharp, a streetwear question. Same recipe, same skeleton, opposite feel.](/blog/a-design-system-for-an-agent/ox-quiz-musinsa.jpg)

## Where the craft went

Show a craftsperson a pantry and a cook allowed to improvise from it, and she flinches. It sounds like a machine plating the same dish a thousand times, the thing that makes most AI interfaces feel microwaved.

The craft did not leave. The judgment moved down a level.

It moved off the plate and onto everything that goes into it. The ingredients, the recipes, the cookbook itself. An ingredient is tasted and approved before a cook is ever allowed to reach for it. A recipe is judged as it enters the book, not after it ships. The book as a whole is held to a standard. Get those right and you do not have to taste every plate.

You could not taste every plate anyway. These dishes are made to flex across many tables, many house styles, many goals at once, and table times house style times goal is not a number a person checks one by one. The old move, plate it and taste the result, does not survive that multiplication. The judgment has to live earlier, in the ingredients, where one good decision seasons everything made from it.

You already saw the shape of it on the label above. The order an ingredient is allowed to sit in. The line between what a brand seasons and what the kitchen keeps, so a hundred tables come out coherent and none of them come out the same. The taste, spelled into a sentence the cook has to honor. That is judgment, written down once, holding across every meal.

We did not leave the kitchen unattended either. A second cook tastes each recipe against a written standard before it is trusted on the line. And the cook on shift gets room to improvise, it can lean on dishes it already knows, but on a tether, so it stays inside the meal we asked for and never wanders off the menu.

The cook is free, inside a kitchen built to make a bad dish hard to plate. The kitchen is the craft.

## What shipped

In May, the first real meal went out. An ad campaign, made by an agent, served on a real advertiser's table. An OX quiz, plated from the cookbook rather than cooked to order by hand. The first one that was not a tasting.

And it performed. The dish the agent plated held its own against the ones we had made by hand, on par, no drop a guest would feel. That was the first thing we needed to know: a meal the kitchen composes is as good as one a designer plates by hand.

The next bet is the bigger one, and we are testing it now. If the kitchen can plate one great dish at scale, it can plate a different one for each diner. Step two is to show that a meal curated for each kind of guest beats even these rich, high-performing ones. One kitchen, a plate per guest.

I trust the kitchen more than the single dish. Every pairing of recipe and brand is checked automatically, and nothing leaves the pass that breaks the rules. The pass is a real thing, a suite the build runs every time:

```ts
it('no relationship field references a missing manifest')
it('every recipe step component is registered and reachable')
it('a manifest never supersedes itself')
it('no tokensConsumed entry is stale (listed but unused in source)')
it('every component export has a manifest')
```

If any of these fail, the dish never leaves the kitchen.

## What held, what didn't

The cookbook held. Writing the recipe down as data, where a cook that cannot taste could still follow it, was the right bet.

The honest part: our first recipes were written in our own accent, too shaped by how we think about rewards. An agent following them needed more than we had put on the card, and we learned it by watching it reach for the wrong ingredient at the right moment. The fix lived in the recipe, in sharper words on the card.

```ts
// before — written in our accent, the agent reached wrong
constraints: 'Use as the reward.'

// after — the words do the work, the agent stops guessing
constraints: 'Use as the reward reveal after a discovery interaction. Always pair with a CTA so users can act on the coupon.'
```

We are still rewriting them.

## Why it matters

You can read this as a story about tools. The dish underneath is a question about where the cooking happens, now that an agent can plate faster than any of us.

The cooking moves upstream, off the stove and into the recipe, off the plate and into the cookbook. We became the people who decide what is worth cooking, and who write the recipes the kitchen runs on.

You thought AI was going to build a design system for you. We built one for it.

## Related

- The thesis in short: [The Flip](/blog/the-flip)
- The full method: [AI-Native Design Playbook](/deepdives/ai-native-design-workflow-playbook)
- The deeper case for designing this way: [When the Interface Assembles Itself](/blog/when-the-interface-assembles-itself)

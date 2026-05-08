---
title: "What Rises and What Fades When Agents Reshape the Interface"
description: "Agents reduce the surface of the interface and reshape what's left. This essay identifies what survives the shift and what comes after."
date: 2026-05-08T10:00:00+09:00
draft: false
featured_image: "/images/what-rises-and-what-fades.png"
tags: ["ai-design", "product-strategy", "agents", "future-of-work"]
---

# What Rises and What Fades When Agents Reshape the Interface

*Agents reduce the surface of the interface and reshape what's left. This essay identifies what survives the shift and what comes after.*

---

I work in ad tech. The surface I've spent 11+ years designing for, the screen, the app, the feed, the ad unit, the impression, is moving underneath me. I feel the shift daily in the work, well before it shows up in the analyst's take.

I also have two young kids. Watching them grow up alongside this shift adds a second kind of stake. The way we interact with machines today won't be the way they do. The skills and behavioral patterns we needed to keep up with software won't be the ones they'll need and use for whatever comes after. As a parent, that turns every educational choice into a hell of a headache.

The public argument about AI and product work has been stuck on the wrong question. Replace or augment? Both options assume the work itself stays roughly the same, with AI either taking it or boosting it. The actual move is bigger. The surface we've been working on for thirty years, the graphical interface as the primary site of software, is the thing that's moving. When the surface moves, the work moves with it.

This piece is an attempt to trace where the work actually goes. Three reorganizations are happening at once, in the same window. The software stack is regrouping around agents instead of forms. Product organizations are compressing as one person with a capable agent absorbs the work of a chain of six. The consumer relationship with technology is migrating away from screens, toward voice, toward agents, toward whatever holds attention next. A small number of positions become far more valuable through these moves. A much larger number becomes less needed. And a parallel non-digital economy of presence, craft, and community grows in the space agents can't reach.

I'm writing this from inside one of the shifts, working toward what I think is one of the surviving edges. That's the lens. What follows is the map.

## I. What's actually moving

Start with the part that's now mainstream. SaaS, the dominant software category of the last twenty years, is in structural trouble. Microsoft's Charles Lamanna has put a timeline on it: traditional business applications will become the mainframes of the 2030s, still running but ossified, with agents replacing form-driven interfaces as the primary way work gets done[^lamanna]. Gartner projects 35% of point-product SaaS tools replaced by agents or absorbed into agent ecosystems by 2030[^gartner]. Bain's frame is that agentic AI rebundles control onto a three-layer stack, systems of record, agent operating systems, and outcome interfaces, with the middle SaaS layer directly threatened wherever tasks are automatable[^bain].

The markets have started pricing this in. In February 2026, roughly $285 billion in software market capitalization vanished in a single trading session, with ServiceNow, Salesforce, Intuit, and Thomson Reuters all dropping sharply[^285bn]. The trigger was investors recognizing that per-seat pricing breaks when one employee with agents performs the work of five. This isn't a projection anymore. It's earnings calls.

Benedict Evans adds the most useful reframe. His argument across his recent presentations is that AI is following the classic pattern where a technology stops being called AI once it works. Natural language processing was witchcraft fifteen years ago, then it was AI, and now it's just software. Agentic systems will become ambient infrastructure the same way databases and the internet did, and the interesting question is what kinds of products and companies they make possible or impossible[^evans]. **The interface doesn't disappear. It relocates.** The companies built to produce the old interface are what's actually under threat.

What is relocated alongside the interface is the translation economy. The typical product organization today is a chain. A PM writes a spec. A designer makes the flows. A second designer does the visual pass. A frontend engineer implements. A QA person checks. A researcher runs a study. A PM manages the rollout. Six to ten people, most of them spending most of their time translating between the step before theirs and the step after. That chain exists because handoffs between human specialists were expensive, and someone had to manage each translation. When one person with a capable agent can hold the whole chain, the chain is what compresses. Artiom Dashinsky's prediction is that the design role ends up looking like a screenwriter in Hollywood, a rare job with high demand and low supply[^dashinsky]. Claire Vo's parallel projection is that product managers absorb the work of two to six times more engineers within three years. The shape of these predictions is consistent across roles. The middle of the org chart hollows out.

The aggressive read is Dario Amodei's: AI eliminates up to half of entry-level white-collar jobs and pushes unemployment to 10 to 20% within five years[^amodei]. The conservative read is that automation already drove 50 to 70% of US wage-inequality growth between 1980 and 2016[^acemoglu], and the current wave accelerates a curve already in motion. The direction of travel isn't seriously disputed. The debate is about speed and shape.

My take is close to the one Cat Wu described in a recent interview: The job title doesn't matter, but the capacity to judge and show taste will. As anyone can now do it all, people who can lead a product development with strong judgment and taste will survive and thrive. The others won't.

## II. The two-phase curve

The argument diverges slightly from the consensus here because most analyses either project phase one (an indie-builder explosion) or phase two (workflow consolidation) without connecting them into a single curve. The honest way to think about product count is that it climbs sharply for roughly three to five years, then declines over the following decade as agents absorb workflows and the middle-layer products thin out.

The first phase is the indie explosion we're already inside. The floor for making software has dropped. Every designer with taste is shipping side projects, every PM is prototyping in Cursor, every founder is launching v1 in a weekend. Y Combinator's vertical AI agents thesis is a formal statement of this dynamic, predicting that the specialized agent wave could produce companies ten times larger than the SaaS they replace[^yc]. New product count climbs because the cost of production has dropped to near zero. This is real, and it's happening now.

The second phase is the one that's underdiscussed. Once agents can perform a workflow directly against the underlying system instead of through a dedicated UI, the product that wraps that workflow becomes a middleman. Today, there are roughly two hundred products that help small businesses manage invoices. Each is a UI over roughly the same workflow. When an agent performs invoicing directly against the accounting system, you don't need two hundred products. You need one or two underlying rails and a lot of agent skill. The other 198 quietly stop mattering. The same logic applies across horizontal SaaS categories: project management, CRM, reporting, dashboards, analytics, and most workflow tools. These are UI over data agents that can operate on directly. The curve peaks as the indie wave saturates, then the consolidation pulls product count down for a decade.

This isn't speculative anymore at the narrow end. The AI wrapper discourse from 2023 and 2024 was an early glimpse. Thin products that the base model could absorb didn't survive. The same compression is coming for thicker products, more slowly, because the base capability now includes task execution rather than just text generation.

## III. The four survivors

What lives on the other side of the consolidation is a smaller number of structurally different products. They cluster into four categories.

**Rails** are the underlying systems agents act against. Payment processors, ad platforms, calendars, banks, health records, logistics networks. These get stronger as agents proliferate because more traffic flows through them and less value is captured by the UI layer on top. The travel sector is a live case study. Google's agentic restaurant booking in the UK bypasses OpenTable and TheFork entirely, reducing them to backend data providers while the customer relationship stays with the assistant[^google-restaurants]. The aggregators that had pure-UI value are fading. The ones with real inventory relationships and supplier negotiating power are successfully repositioning as the wholesale layer the agents query. Expedia's latest earnings show AI agents already resolving more than half of customer queries and the company posting double-digit vacation rental growth[^expedia]. This is the rails pattern. The consumer-facing brand thins, the infrastructure thickens.

**Taste objects** are products where the point is the product itself, not the workflow it enables. Games survive almost entirely. A novel, a magazine, a film, a favorite piece of software, people love the way they love a pen. Nintendo, Valve, FromSoftware, Procreate, Ableton, Blender, Substack. These can't be absorbed by agents because the experience is the thing. Erik Brynjolfsson's argument in the Turing Trap essay is that the obsession with human-mimicking AI drives down wages for most people even as it amplifies the market power of a few who own the technology[^brynjolfsson]. The corollary is that what AI can't mimic well, a specific aesthetic and emotional signature, becomes disproportionately valuable. Andrea Grigsby's framing is that taste becomes the differentiator when AI can generate unlimited options at a click, because someone still has to decide which one is worth keeping[^grigsby]. The category is broader than creative software. It includes anything where identity and meaning ride on the artifact rather than its utility.

**Judgment layers** are the surfaces where humans supervise agents. Audit trails, replay interfaces, intervention dashboards, policy editors, confidence displays, and agent observability. Imagine the dashboard a bank's compliance officer uses to watch every action an agent took on a customer's account, replay its reasoning step by step, and approve or roll back actions retroactively. That's a judgment layer. The buyer is the operator who's accountable for what the agent does, not the user the agent is acting on behalf of, which makes it a different shape of product than anything most teams currently ship. This category barely exists in the academic literature yet, which is itself significant. Anthropic's Economic Index is one of the earliest serious attempts to map how agents are actually being used across occupations[^economic-index]. The design problems here are almost entirely open. How do you show an agent's confidence in a way a non-expert trusts? How do you let a compliance officer intervene in an agent's workflow without breaking the flow? How do you replay an agent's reasoning so a regulator can verify it? These are interaction problems with almost nothing to do with pixels, closer to shaping the character of a system than arranging fields on a form. In five years this is probably a category worth tens of billions. Right now almost no one is good at it.

**Vertical depth** survives where the user is an expert practitioner who wants direct control of the model rather than delegation to an agent. Bloomberg Terminal because traders manipulate information density themselves. Epic because doctors need to see and shape patient records, not have them paraphrased. AutoCAD and SolidWorks because the engineer is shaping the model directly, and the model is the product. Specialized legal discovery, industrial simulation, the same pattern. Agents help these users (copilots, smart search, anomaly flagging) but don't replace the deep tool. The cost of being wrong is high, the domain model is rich, and the user base values depth over convenience precisely because they have the expertise to use it. These categories don't stop existing. They get more valuable as agents proliferate, because the work of going deep into them can't be shortcut.

The four categories don't weight equally. Rails probably capture the most economic value, because they sit at the bottom of the stack and every agent has to transact through them. Taste objects capture the most cultural attention. Judgment layers have the highest growth rate from near zero. Vertical depth is the most defensible and the slowest to transform. Any given company's survival odds come down to which of these four it actually belongs to, stripped of how it describes itself.

Of the four, the one I keep working toward is rails. §VII walks through why.

## IV. The workforce reality

Accepting the four-survivors frame means accepting that a very large number of companies and roles don't fit cleanly into any of them. The horizontal SaaS middle, the translation-heavy org charts, the productized workflows agents can now perform directly, much of the "AI wrapper" cohort of the last two years, a large portion of the generic analytics and reporting tools. These are on the changing side of the curve. Not all at once, and not immediately, but on a trajectory that's visible if you squint.

The honest version of this for people currently in product roles is uncomfortable. The middle compresses. A fifty-person product organization will probably become ten to fifteen people over the next five to seven years. That's not a soft landing. Even the optimistic reads, like Brynjolfsson's "both/and" position that there will be a revenge of humanity's tasks and new opportunities in creative and interpersonal work[^brynjolfsson-npr], don't dispute that the aggregate number of seats shrinks. They dispute which seats survive.

Who survives the compression: people at the top of the judgment curve. The ones who consistently pick the right thing to build. This was always scarce and is getting more valuable because a wrong bet now ships ten times faster and burns more trust. People who can hold the whole stack from strategy to shipped artifact without handoffs. People who design the systems other humans and agents build on top of, the classic platform role but vastly more leveraged. People with deep domain knowledge in a vertical where accumulated context is the moat. Roughly the profile Vitor Cavalcanti describes for AI-native operators, arguing that AI-native companies want people who think in systems, ship to production, and use AI as leverage rather than as decoration[^cavalcanti].

Who gets compressed out: the production layer. Anyone whose job was mostly translation, mostly execution of someone else's decision, mostly keeping the machine running. The compression isn't about quality. The machine simply no longer needs that many hands.

The orgs that succeed through this aren't the ones that find the "right" adoption strategy. They're the ones that accept the shape change and restructure around it early, rather than layering AI onto the old assembly line and calling it transformation.

## V. The physical counter-wave

The argument gets less pessimistic here, and the academic backing runs deeper than most of the tech discourse acknowledges. The reorganization of interface-driven software doesn't happen in a vacuum. It happens in a world where attention, meaning, and physical presence become scarcer the more digital abundance saturates. Every previous wave of digital saturation has produced a physical counter-wave. The coming one will be bigger because the saturation is bigger.

The foundational text is Pine and Gilmore's *Experience Economy*, first published as a Harvard Business Review article in 1998 and then as a book in 1999. Their argument, now read in over a dozen languages and with multiple updated editions, is that experiences are as distinct an economic offering from services as services were from goods, and that memory itself becomes the product[^pine-gilmore]. The intellectual debt runs earlier. Alvin and Heidi Toffler's *Future Shock* (1970) anticipated the "psychic load" that producers would add to basic products as a market for psychological gratification developed[^toffler]. Rolf Jensen's *Dream Society* thesis in 1999 argued that in a post-materialistic market, the stories attached to a product become primary and the utility of the product itself becomes secondary[^jensen]. The shift from service to experience was the last time this happened at a civilization scale. The shift from utility to presence is what's happening now.

The scholarly work on the analog revival is more recent and more useful. Beverland, Fernandez, and Eckhardt's 2024 paper in the *Journal of Consumer Research* is the sharpest version. They studied vinyl music, film photography, and analog synthesizers ethnographically, and their findings are that consumers deliberately choose difficult analog technologies over labor-saving digital counterparts as a form of "serious leisure" that generates personal agency[^beverland]. The mechanism is closer to identity than to nostalgia or function. The work of using the technology gives users back a sense of self that frictionless digital had removed. **When labor-saving removes the labor, it also removes the self that the labor produced. The analog revival is a reassertion of agency through friction.**

This isn't a small phenomenon. MIDiA Research found that two-thirds of consumers tried to cut their screen time in Q1 2024, with 21% turning to physical formats and 23% to in-person activities[^midia]. The Vinyl Alliance's 2025 report shows that half of Gen Z vinyl buyers treat the format as a form of digital detox. The percentage of 12 to 15-year-olds taking smartphone breaks rose 18 percentage points to 40% between 2022 and 2025[^gen-alpha]. The trend isn't driven by older consumers looking back. It's led by the youngest users pushing against a saturation they were born into.

Richard Sennett's *The Craftsman* (2008) provides the deeper theoretical grounding. His thesis is that craftsmanship is an enduring basic human impulse to do a job well for its own sake, that all skills, including abstract ones, begin as bodily practices, and that technical understanding develops through the powers of imagination[^sennett]. Matthew Crawford's *Shop Class as Soulcraft* makes the popular version of this argument, tying manual competence to meaning and agency. The return of making, of lineage-based artisanal goods, of named workshops producing high-value objects, follows the same pattern as vinyl. It's a reassertion of human agency through friction, made newly attractive by the ambient frictionlessness of everything else.

Ray Oldenburg's *Great Good Place* (1989), and Karen Christensen's 2023 revised edition, is the third leg of the scholarly frame. Oldenburg's argument was that informal public gathering places, cafes, bars, libraries, parks, barbershops, are anchors of community life and essential infrastructure for democracy and well-being[^oldenburg]. Christensen's update positions third places as the answer to loneliness, political polarization, and climate resilience simultaneously. The WHO has moved social isolation into the public-health emergency category, with research suggesting the risk is comparable to smoking 15 cigarettes a day[^who]. The loneliest demographic is 18 to 25-year-olds, the group currently most digitally native. Derek Thompson's *Atlantic* essay in 2024 on Americans suddenly stopping hanging out was the mainstream signal that this had crossed from sociology into common discourse.

Put these three bodies of work together, and a clear pattern emerges. As digital abundance mediates more of daily life, the categories that grow are experiences (Pine and Gilmore), craft-driven physical objects (Sennett, Beverland), and third places (Oldenburg, Christensen). Joseph Stiglitz, asked directly whether human-created work would become a premium product like hand-woven sweaters versus machine-made ones, said yes, that there's a widespread sense of blandness in AI-generated material, and that demand for creativity will persist[^stiglitz]. His framing isn't just cultural. It's economic. Handmade becomes a category with pricing power precisely because machine-made is now abundant.

The growth areas on the physical side are roughly these. Craft and making as profession and identity, not as hobby. In-person services at premium pricing, particularly anything where human presence is the value rather than the information exchange. Chef-driven restaurants and neighborhood food culture. Experience travel, pilgrimage routes, residencies. Third places, chapter-based associations, maker spaces, community workshops. Objects with provenance and story. Analog tools in specific niches, from mechanical watches to fountain pens to paper notebooks. Live performance as the primary cultural form, with recorded versions carrying less weight. The Taylor Swift tour economy, the farmers-market revival, the return of listening bars and chess clubs, the growth of the Camino de Santiago and similar long walks. These aren't disconnected trends. They're the same trend viewed from different angles.

## VI. The bifurcation risk

The uncomfortable part of the physical counter-wave is that it doesn't distribute evenly. The critique from Stiglitz, LSE's inequality research, and Acemoglu is that AI-driven productivity gains concentrate wealth at the top while displacing workers in the middle, which produces a society where the physical revival shows up as a luxury tier for those with time and money while everyone else gets cheap digital abundance with no path to the premium[^lse]. Google's AI Ultra at $250 a month and OpenAI's reported consideration of $2,000 monthly tiers for frontier models are early signals that AI itself is becoming stratified rather than democratized[^google-ultra]. The risk is that the future looks like a 19th-century split between those who attend the opera and those who work in the factory, translated into 21st-century form.

There's a counter-argument worth naming. A 2024 CEPR paper argues that AI may actually compress the skill premium because it substitutes for nonroutine high-skill tasks, the opposite of the industrial robotics pattern that substituted for routine low-skill tasks[^cepr]. If this holds, the class split is less severe at the wage layer than the consumption layer. The debate is real and unsettled. Even on the optimistic read, the distributional effects depend heavily on policy choices most governments haven't made yet.

The part that isn't debated is that the cheaper end of the physical revival, farmers markets, community gardens, amateur sports leagues, local music, maker spaces, public libraries as third places, has its own momentum and its own economics. Libraries in particular have quietly been having one of their best decades in a long time as people rediscover them as free, air-conditioned, unmonetized third places. This is the democratized version of the physical counter-wave, and it's the one that matters most for whether the future bifurcates or not.

## VII. A worked example: what happens to advertising

Advertising is the worked example I know best because I'm inside it. The structural argument so far lands in concrete form here, and the position I'm writing from has both sides of the move visible at once: the impression economy that's been the engine for thirty years, and the rail layer that's starting to take over for it. The four-survivors logic from earlier maps cleanly onto advertising, and the implications are sharp enough that I want to walk through them in detail.

The current advertising economy is structurally an impression economy. Advertisers pay to place a message in front of a user. The platform captures value by owning the surface. Success is measured primarily in reach and frequency. Every part of this depends on interfaces: banner ads, feed ads, video pre-rolls, sponsored listings, rewarded videos inside apps. Each is just a different physical location for an impression. When interfaces compress, the surface area for impressions compresses with them. The total inventory available to the impression economy thins.

What replaces it isn't "advertising in agents." That framing misses the shift. The walled gardens, OpenAI, Google, Amazon, Meta, will run their own agent-mediated marketplaces and sell preferred placement inside their assistants, which is the impression model ported forward. Some advertising will continue to happen that way, the same way some banner ads still run today. The more interesting shift is the emergence of a parallel model where advertising works by *compensating users for their attention rather than stealing it*. This is closer to how user-aligned agents will actually want to operate.

The mechanics matter, and they're worth walking through slowly because they're the structural reason this model survives. When an agent acts on behalf of its user, it has a direct interest in not being captured by paid placement, because users will abandon assistants that route them toward paying advertisers. The same agent can legitimately surface an opportunity where the user captures the value of their own attention. "Here's a brand that will give you a discount in exchange for a short engagement" is an offer the agent can propose without compromising its relationship with the user. The user gets compensated. The agent stays trusted. The advertiser gets verified attention. None of these interests are in tension. **This is the advertising model that survives agent mediation, because it's the only one that aligns with how agents have to behave to remain useful.**

The implication for the industry is a clean application of the four-survivors logic. The impression layer compresses and gets absorbed into walled-garden marketplaces. Most of today's ad-tech middleware fades. What grows on the other side is infrastructure that operates across whatever surfaces hold attention: a mobile app today, a browser tab next year, a voice assistant after that, an agent interaction after that. The entity that makes rewarded interactions easy to invoke, measurable, and portable becomes the rails layer for a category of advertising the walled gardens are structurally unable to operate themselves. That's a defensible position, and unusually for ad tech, a user-aligned one.

The deeper strategic move underneath this is decoupling the reward architecture from any specific surface. An advertising network whose value lives in an SDK embedded inside a publisher's app is tied to the survival of that surface. An advertising network whose reward architecture runs externally, can be invoked from any entry point, and verifies its outcomes independently of the surface, is portable across the entire surface transition. The SDK becomes an entry point among many rather than the container for the product. The product is the architecture that turns attention into verified outcomes, regardless of where the attention originates.

This framing extends naturally beyond user acquisition into brand-side advertising. The current brand market is also overwhelmingly impression-based, measured in reach and brand-lift studies. A rewarded, externally-run engagement that routes users through a brand's actual product experience, what any serious brand would call an aha moment, the specific interaction where the product demonstrates its value, produces a fundamentally different kind of measurement. The question shifts from "did the user see this brand" to "did the user reach the moment where this brand's value becomes real to them." The same architecture that verifies post-install retention for UA can verify post-engagement conversion for brands, because the underlying capability is the same: routing qualified attention through a verified funnel and measuring what happens on the other side.

Three opportunities follow, and most of the industry is still too organized around impressions to see them.

**Category language.** The industry doesn't yet have good words for post-impression advertising, verified-outcome advertising, or rewarded-as-primitive advertising. Whoever establishes the vocabulary establishes the category. This is Stripe's "payments infrastructure" moment, or Twilio's "communications APIs" moment. The companies that named what they were building owned the conversation about it for the next decade.

**Protocol positioning.** Agent ecosystems are making foundational decisions right now about how advertising and commerce will work inside them. Model Context Protocol, Agentic Commerce Protocol, and similar efforts are the standardization layer. A rewarded advertising architecture that ships as a first-class agent primitive, with documented MCP servers and reference implementations, positions itself as the default when agent ecosystems reach for a rewarded capability. The window for this is short, probably two to three years, because once defaults are set they calcify.

**Neutrality as a commercial asset.** A walled-garden-neutral rewarded infrastructure is valuable to every agent ecosystem precisely because none of them want to route through a competitor. The independent network that can serve ChatGPT, Claude, Gemini, and whatever comes next is more valuable than any one of them could build internally, because the value compounds across the ecosystem rather than being captured by one platform. This is the Visa position, the Stripe position, the Cloudflare position. It requires discipline (the temptation to become a platform yourself is constant), and it's the position with the longest durability.

The same shape applies beyond advertising. As surfaces become more agent-mediated, the inventory tied to specific impressions thins. What grows in its place is the post-impression layer, the architecture that makes attention portable, measurable, and verifiable wherever it lands. The same logic shows up in commerce, in media, and in any industry whose business model has historically depended on owning a particular surface. The surfaces are moving. The value moves with them, into whatever holds attention durably across the transition.

For people working in this industry, the work shifts in a way that mirrors the broader argument. Building the impression, the unit, the placement, the layout, was always the job. As impressions compress, that work compresses with them. The work that grows is around the *post-impression*: the engagement architecture, the reward mechanic, the verified-outcome funnel, the trust signal that lets a user know an offer was actually surfaced in their interest rather than someone else's. Closer in shape to building a payment flow than to building a banner. This is the rail-layer work, and it's where the next decade of ad-tech work lives.

## VIII. The map

The shape of the future is clearer than most of the current AI discourse suggests. The middle of every layer is reorganizing. Software regroups around rails and agents instead of forms. Org charts compress as one operator absorbs the chain. Consumer relationships migrate from screens to whatever holds attention next. What grows is the edges. Rails at the bottom. Taste objects at the top. Judgment layers as a new category. Vertical depth as a defensible specialization. Alongside the digital edges, a parallel physical economy of presence, craft, and community grows to fill the space agents can't reach.

For product people, the implication is that the realm doesn't move. It deepens. The thing that was always the core of good product work, deciding what's worth existing, becomes the whole job. Everything adjacent to that gets absorbed by agents. What remains is the part that was hardest all along.

Some questions sharpen from here. Which of the four survivor categories is your current work actually in, stripped of how your company describes itself? Most teams currently working on horizontal SaaS will honestly answer "none," and that answer should guide the next move. For work inside the digital economy, the highest leverage is in designing the judgment layer, designing rails that other systems consume, designing taste objects agents can't absorb, or going deep enough into a vertical that accumulated context becomes the moat. For work that steps outside the digital economy, the opportunities are larger and less explored than the tech industry treats them. Designing a third place, a craft school, a pilgrimage route, a magazine, a restaurant concept, a festival, a workshop, a residency. These have always been design problems. They're going to matter more as the mediated economy saturates and the unmediated one scales.

What I'm doing about it, since I've been writing from inside one of the shifts the whole time, is building toward the rail layer. The post-impression architecture in §VII is the bet I think survives agent mediation, and it's the one I'm trying to make easier to invoke, more measurable, and more portable than what came before. If I were starting fresh, I'd still pick a rail problem. They're undertilled, they thicken as agents proliferate, and they're one of the few places in software where the work compounds rather than fades.

The transition is happening now, and it isn't reversible. The companies still organized for the old assembly line will keep hiring as if the last decade is the model, and many of them won't survive the gap between how they're structured and how the work actually gets done. The people with the clearest view of this have been making moves for a while already. The ones who haven't started will find that the floor drops faster than they expected.

The shift is already underway. What you do about it depends on which side of it you want to be on.

---

## Sources

[^lamanna]: Charles Lamanna, Microsoft CVP, Madrona "Founded and Funded" podcast, 2025. Reported in The New Stack, "Microsoft: AI 'Business Agents' Will Kill SaaS by 2030" (August 2025).

[^gartner]: Gartner, quoted in Deloitte, "SaaS meets AI agents: Transforming budgets, customer experience, and workforce dynamics" (February 2026).

[^bain]: Bain & Company, "Will Agentic AI Disrupt SaaS?" Technology Report 2025.

[^285bn]: Reported February 2026 software stock correction, covered in "AI Agents Replacing SaaS Tools: What It Means for 2026," Orbilon Tech, April 2026.

[^evans]: Benedict Evans, B2B Marketing Exchange 2026 keynote. Summary in Demand Gen Report, March 2026. See also Evans, "Building AI products" (2024) and "AI eats the world" presentation, Autumn 2025.

[^dashinsky]: Artiom Dashinsky, "How Will AI Affect the Demand for Product Designers?" Prototypr, July 2024.

[^amodei]: Dario Amodei, Axios interview, "Sleepwalking into a white-collar bloodbath," May 2025.

[^acemoglu]: Daron Acemoglu, MIT. Discussed in MIT Technology Review, "AI is making inequality worse," April 2022. See also Acemoglu and Restrepo on "so-so technologies."

[^yc]: Y Combinator "Light Cone" discussion on vertical AI agents. Summary in SuperAnnotate, "Vertical AI agents: Why they'll replace SaaS and how to stay relevant," 2024.

[^google-restaurants]: Reported in "Why Google's Agentic AI Kills the Aggregator Frontend," Product Leaders Day India, April 2026.

[^expedia]: Expedia Group Q3 2025 earnings, reported in CX Dive, "Expedia Group AI agents handle more than half of queries, CFO says," November 2025.

[^brynjolfsson]: Erik Brynjolfsson, "The Turing Trap: The Promise & Peril of Human-Like Artificial Intelligence," Stanford Digital Economy Lab, 2022. Summary in MIT Technology Review.

[^grigsby]: Andrea Grigsby, "AI is coming for our design jobs, but it can't touch taste," UX Collective, June 2025.

[^economic-index]: Anthropic Economic Index, launched 2025, providing occupation-level data on Claude usage.

[^brynjolfsson-npr]: Erik Brynjolfsson, NPR interview with Steve Inskeep, August 2025.

[^cavalcanti]: Vitor Cavalcanti, "Operating as an AI-native product designer in 2026," Verified Insider, March 2026.

[^pine-gilmore]: B. Joseph Pine II and James H. Gilmore, "Welcome to the Experience Economy," Harvard Business Review, July-August 1998. Expanded in *The Experience Economy* (1999, revised editions through 2020).

[^toffler]: Alvin and Heidi Toffler, *Future Shock*, 1970. Chapter 10, "The Experience Makers."

[^jensen]: Rolf Jensen, *The Dream Society*, 1999.

[^beverland]: Michael B. Beverland, Karen V. Fernandez, Giana M. Eckhardt, "Consumer Work and Agency in the Analog Revival," *Journal of Consumer Research*, Volume 51, Issue 4, December 2024, pp. 719-738.

[^midia]: MIDiA Research, "Analogue Revival: A cultural pendulum swing," 2024.

[^gen-alpha]: GWI data, July 2025, reported in Tunheim, "When the most digital generation goes analog, brands need research," September 2025.

[^sennett]: Richard Sennett, *The Craftsman*, Yale University Press, 2008.

[^oldenburg]: Ray Oldenburg, *The Great Good Place*, 1989. Revised edition with Karen Christensen, 2023.

[^who]: World Health Organization research on social isolation and connection, cited in multiple sources including Science Array, "The Vanishing Third Place," 2025.

[^stiglitz]: Joseph Stiglitz, interview with *Scientific American*, "Unregulated AI Will Worsen Inequality," February 2025.

[^lse]: James Muldoon, Mark Graham, Callum Cant, *Feeding the Machine: The Hidden Human Labour Powering AI*, Canongate, 2024. LSE Inequalities blog summary, October 2024.

[^google-ultra]: Reported in Winsome Marketing, "The $250 Stratification: How Google AI Ultra Reveals the Coming AI Class Divide," May 2025.

[^cepr]: CEPR, "The expansion of AI will likely shrink earnings inequality," October 2024.

// Work page entries. Public site: only facts Buzzvil or a client has already published.
// Lines marked TODO(Max) need his wording or a public source before this ships.

export interface WorkLink { label: string; url: string }

export interface WorkEntry {
  slug: string;
  title: string;
  kicker: string; // the angle, one line under the title
  years: string;
  call: string; // what deserved to exist, and why then
  foundation: string; // the system, format or tool built so it could exist more than once
  shipped: string; // what shipped on it, by whom
  image?: string; // public path; omitted = placeholder slot until Max supplies the screen
  imageAlt?: string;
  imagePair?: string; // optional second image (v1 next to current, or two brands on one recipe)
  links?: WorkLink[];
}

export const workEntries: WorkEntry[] = [
  {
    slug: 'interaction-composer',
    title: 'The interaction composer',
    kicker: 'An agent assembling ads from a library it can read, and why that model was retired',
    years: '2025 – 2026',
    call: 'One creative per campaign could not scale to one experience per person. The composing had to move from a designer per screen to a system an agent reads.',
    foundation: 'A design library structured for an agent: tokens, components, recipes and the manifests that describe them, with one brand seed theming the whole set. The composer turns a chosen recipe into a rendered, on-brand interaction.',
    shipped: 'The first agent-assembled campaign went live in May 2026. TODO(Max): why the model was retired and what took its place, in words already public.',
    image: '/blog/a-design-system-for-an-agent/ox-quiz-skincare.jpg',
    imagePair: '/blog/a-design-system-for-an-agent/ox-quiz-streetwear.jpg',
    imageAlt: 'One O/X quiz recipe rendered for two brands',
    links: [
      { label: 'A Design System for an Agent', url: '/blog/a-design-system-for-an-agent/' },
      { label: 'When the Interface Assembles Itself', url: '/blog/when-the-interface-assembles-itself/' },
    ],
  },
  {
    slug: 'game-ua-multi-mission',
    title: 'Game UA, multi-mission',
    kicker: 'The proof that an ad can start where most user acquisition stops',
    years: '2023 – 2026',
    call: 'Traditional game UA pays for the install and disengages at the point where most players churn. Installation should be the beginning of the experience, not the end of the ad.',
    foundation: 'Multi-step rewarded missions, shipped as a server-driven format: each mission surfaces a slice of the game and paces the player toward the advertiser-defined Aha moment, tuned against retention rather than installs.',
    shipped: 'Live across the publisher network as a standard format. TODO(Max): the roadmap claim, kept to what Buzzvil has said publicly.',
    image: '/blog/i-dont-like-ads/ua.png',
    imageAlt: 'Game UA activation flow, from install to the Aha moment',
    links: [{ label: "I Don't Like Ads", url: '/blog/i-dont-like-ads/' }],
  },
  {
    slug: 'buzzvil-mediums',
    title: 'The Buzzvil mediums',
    kicker: 'How design took control of the entire company medium fleet in a single move',
    years: '2025 – 2026',
    call: 'Nobody owned the website, so every external medium drifted on its own. Design should own all of them at once, with a door open for everyone else.',
    foundation: 'One monorepo and one token system under every web property, made AI-native so any team can contribute on-system work and design keeps the review gate.',
    shipped: 'The homepage, SDK docs, tech blog, design portal and culture blog, rebuilt and shipped by the design team, with PMs and engineers now opening design PRs.',
    image: '/blog/nobody-owned-the-website-now-everybody-does/cover.png',
    imageAlt: 'Every Buzzvil web property under one system',
    links: [
      { label: 'Nobody Owned the Website. Now Everybody Does.', url: '/blog/nobody-owned-the-website-now-everybody-does/' },
      { label: 'docs.buzzvil.com', url: 'https://docs.buzzvil.com' },
      { label: 'design.buzzvil.com', url: 'https://design.buzzvil.com' },
      { label: 'tech.buzzvil.com', url: 'https://tech.buzzvil.com' },
    ],
  },
  {
    slug: 'offerwall',
    title: 'The Offerwall',
    kicker: 'The answer to a platform policy change that took away the surface the business ran on',
    years: '2019 – 2022',
    call: 'A platform policy change removed the lockscreen surface that carried the company. The answer had to be a new product publishers would embed, not a workaround on the old one.',
    foundation: 'The Offerwall and the SDK that carries it into partner apps: a reward surface a publisher embeds, with the monetization model rebuilt around it.',
    shipped: 'The pivot the company runs on today, inside banking, commerce and telecom apps. TODO(Max): screen (v1 and current), and the revenue phrasing kept to public wording.',
    links: [{ label: 'Buzzvil Docs, the SDK', url: 'https://docs.buzzvil.com' }],
  },
  {
    slug: 'lockscreen',
    title: 'The lockscreen',
    kicker: 'An early proof that there is a better way to deliver ads to people, carried mostly by the system behind it',
    years: '2014 – 2019',
    call: 'Ads could be delivered on the user’s terms: a chosen moment, a clear exchange, and a reward for attention rather than an interruption.',
    foundation: 'A lockscreen that paid for attention with points, and the ad-serving and reward system behind it. Early proof, mostly system.',
    shipped: 'Buzzvil’s first product, and the model every later format inherits. TODO(Max): screen, and the public figures if any.',
  },
];

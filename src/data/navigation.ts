// Secondary destinations live both near related content and in the footer.
export const navigationGroups = [
  { id: 'work', title: 'Work', links: [
    { label: 'Selected work', href: '/work/' },
    { label: 'Hanji', href: '/work/hanji/' },
    { label: 'About this site', href: '/about/' },
  ] },
  { id: 'writing', title: 'Writing', links: [
    { label: 'Essays', href: '/blog/' },
    { label: 'Deep Dives', href: '/deepdives/' },
    { label: 'Shelf', href: '/library/' },
  ] },
  { id: 'background', title: 'Background', links: [
    { label: 'Experience', href: '/timeline/' },
    { label: 'Press', href: '/press/' },
  ] },
];

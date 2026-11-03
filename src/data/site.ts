export const site = {
  name: 'Kalkidan Yishak Zerihun',
  firstName: 'Kalkidan',
  displayName: 'Kalkidan Yishak',
  role: 'Fullstack developer',
  location: 'Addis Ababa, Ethiopia',
  email: 'kalkidanyishak001@gmail.com',
  description:
    'Kalkidan Yishak Zerihun is a fullstack developer in Addis Ababa building web platforms across hospitality and public health.',
  links: {
    github: 'https://github.com/kalkidanyishak',
    linkedin: 'https://www.linkedin.com/in/kalkidanyishak/',
    telegram: 'https://telegram.me/kalkdn',
  },
} as const;

export const navigation = [
  { label: 'Work', href: '/#work' },
  { label: 'Services', href: '/#services' },
  { label: 'About', href: '/#about' },
] as const;

export const socials = [
  { label: 'GitHub', handle: 'kalkidanyishak', href: site.links.github },
  { label: 'LinkedIn', handle: 'in/kalkidanyishak', href: site.links.linkedin },
  { label: 'Telegram', handle: '@kalkdn', href: site.links.telegram },
] as const;

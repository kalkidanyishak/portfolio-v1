export type ProjectImage = {
  base: string;
  widths: number[];
  width: number;
  height: number;
  alt: string;
  position?: string;
};

export type Project = {
  id: string;
  sector: string;
  year: string;
  title: string;
  fullName?: string;
  client: string;
  role: string;
  summary: string;
  contribution: string;
  scope: string[];
  stack: string[];
  liveUrl: string;
  liveLabel: string;
  image: ProjectImage;
  imageNote: string;
  imageIsIllustrative?: boolean;
  liveNote?: string;
};

export const featuredProject: Project = {
  id: 'kerawi',
  sector: 'Hospitality',
  year: '2026',
  title: 'Kerawi International Hotel',
  client: 'Sabeh Systems',
  role: 'Fullstack developer',
  summary:
    'A live hotel platform in Hawassa, pairing a guest-facing booking experience with the administrative systems a hotel needs behind it.',
  contribution:
    'I built the guest booking interfaces and administrative hotel management systems, designed PostgreSQL schemas, integrated the REST APIs and managed server deployment pipelines.',
  scope: [
    'Guest-facing booking journey, from exploring the hotel to searching availability.',
    'Administrative interfaces for hotel operations.',
    'PostgreSQL schema design, REST API integration and Linux server deployment.',
  ],
  stack: ['Next.js', 'ElysiaJS', 'PostgreSQL', 'REST APIs'],
  liveUrl: 'https://kerawiinternationalhotel.com',
  liveLabel: 'Visit Kerawi International Hotel',
  image: {
    base: '/images/kerawi-booking-focus',
    widths: [640, 960, 1440],
    width: 1440,
    height: 624,
    alt: 'The Kerawi International Hotel booking page, showing the live search form for check-in, check-out, adults, and children.',
  },
  imageNote: 'Public booking interface · captured November 2026',
};

export const supportingProjects: Project[] = [
  {
    id: 'epsirs',
    sector: 'Public health',
    year: '2026 to Present',
    title: 'ePSIRS',
    fullName: 'Electronic Patient Safety Incident Reporting System',
    client: 'A RC ICT',
    role: 'Frontend & partial backend developer',
    summary:
      'A national patient-safety platform for Ethiopia. Health workers can report incidents, near misses and unsafe conditions, and track what happens next.',
    contribution:
      'Built primary frontend components in Next.js, developed C# .NET API integrations and supported partial system deployments.',
    scope: [
      'Primary frontend components for reporting patient safety incidents, near misses and unsafe conditions.',
      'C# .NET API integration, connecting the interface to the wider platform.',
      'Support for partial deployments as part of the A RC ICT build.',
    ],
    stack: ['Next.js', 'C# .NET', 'REST APIs'],
    liveUrl: 'https://epsirs.arclabs.et/',
    liveLabel: 'Visit the ePSIRS platform',
    image: {
      base: '/images/epsirs-home',
      widths: [640, 960, 1440],
      width: 1440,
      height: 1000,
      alt: 'The public ePSIRS homepage, headlined “Help Make Healthcare Safer,” with the five-stage incident reporting flow.',
    },
    imageNote: 'Public landing page · captured November 2026 · No patient data shown',
    liveNote: 'Delivered as part of A RC ICT’s wider platform team.',
  },
  {
    id: 'cuamm',
    sector: 'Healthcare analytics',
    year: '2025',
    title: 'CUAMM EMR Dashboard',
    client: 'A RC ICT',
    role: 'Frontend developer',
    summary:
      'A health service dashboard for CUAMM’s supported facilities and IDP sites, giving teams a single operational view of essential service areas.',
    contribution:
      'Built interactive health monitoring dashboards, integrated analytics for key medical services and managed live application deployment.',
    scope: [
      'Dashboard interfaces covering OPD visits, maternal health, nutrition, immunization, NCDs and family planning.',
      'REST API integration for service data across supported facilities and IDP sites.',
      'Frontend development and live application deployment.',
    ],
    stack: ['Next.js', 'REST APIs'],
    liveUrl: 'https://www.cuammethiopia-emr.org/',
    liveLabel: 'Open the CUAMM EMR sign-in',
    image: {
      base: '/images/cuamm-illustrative',
      widths: [640, 960, 1440],
      width: 1440,
      height: 900,
      alt: 'Illustrative preview of the CUAMM EMR dashboard with synthetic totals for OPD visits, maternal health, immunizations and nutrition, plus a sample facility table.',
    },
    imageNote: 'Illustrative interface preview · synthetic data · not a live dashboard capture',
    imageIsIllustrative: true,
    liveNote: 'The live dashboard requires authentication.',
  },
];

export const explorations = [
  {
    title: 'Agricultural Data Platform',
    context: 'Final-year project · AASTU',
    description:
      'An AI-driven farm management platform combining machine learning, retrieval-augmented generation and LLM features with a deployed backend.',
    stack: 'AdonisJS · TypeScript · Python · ML · RAG · PostgreSQL',
    url: 'https://agri-data-iota.vercel.app/',
    linkLabel: 'Visit the platform',
  },
  {
    title: 'Better Hack 2025',
    context: 'Hackathon prototype',
    description:
      'A working exploration of config-first software development built during the Better Hack 2025 hackathon.',
    stack: 'Prototype',
    url: 'https://client-zeta-rouge.vercel.app/hr/department',
    linkLabel: 'Open the prototype',
  },
] as const;

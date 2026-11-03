export const services = [
  {
    title: 'Web applications & business platforms',
    description:
      'End-to-end builds for customer-facing products and the operations behind them. I handle the interface, API and data model as one product, so booking flows, accounts and internal tools behave consistently.',
    deliverables: [
      'Customer portals and booking flows',
      'Administrative interfaces',
      'Authentication and account areas',
      'Reusable component systems',
    ],
    proof: 'Kerawi International Hotel · ePSIRS',
  },
  {
    title: 'Dashboards, internal tools & API integrations',
    description:
      'Operational views built around real workflows. I connect REST APIs, structure data-heavy interfaces and make reporting easier to act on for the people using it.',
    deliverables: [
      'Interactive service dashboards',
      'Data tables, filters and reporting forms',
      'REST API integration',
      'Responsive data-heavy interfaces',
    ],
    proof: 'CUAMM EMR Dashboard · ePSIRS',
  },
  {
    title: 'Backend systems, databases & deployment',
    description:
      'The foundation that keeps a product running after the interface ships: sensible schemas, reliable API services, Linux servers and repeatable release paths.',
    deliverables: [
      'PostgreSQL schema design',
      'REST API development',
      'Linux and VPS deployment',
      'Production setup and release support',
    ],
    proof: 'Kerawi International Hotel · Agricultural Data Platform',
  },
] as const;

export const workingPrinciples = [
  {
    title: 'Understand the workflow',
    body: 'Start with who uses the product, what they need to decide, and where the current process breaks. The stack comes after that.',
  },
  {
    title: 'Build through the stack',
    body: 'Work in vertical slices, proving the interface, API and data together early, rather than leaving integration until the end.',
  },
  {
    title: 'Leave it legible',
    body: 'Ship with reusable interfaces, clear structure and deployment notes that make the next change easier, not harder.',
  },
] as const;

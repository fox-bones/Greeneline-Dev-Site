/**
 * Everything the site says about Cayce lives in this file. Edit it and the page,
 * the API, the search-engine tags, and the no-JavaScript fallback all follow.
 *
 * `skills` arrays link an item to the Skills section, so each value must exactly
 * match a name in the `skills` list below. `npm test` catches typos.
 */

/** Served only by GET /api/contact, after a visitor clicks "Show email". */
export const contact = {
  email: 'cayceharwood@gmail.com',
  // Left blank so the number stays off the public web. Add one to show it on the site.
  phone: '',
};

export const profile = {
  // The permanent address. It drives the canonical URL and the social sharing preview.
  // If this ever changes, update the routes in wrangler.jsonc to match.
  siteUrl: 'https://greenelinedev.com',

  person: {
    name: 'Cayce Greene',
    title: 'Software Developer and IT Specialist',
    location: 'Traverse City, MI',
    summary: [
      'Software developer who builds tools and fixes the problems they’re meant to solve.',
      'I work in JavaScript, Python, C#, Rust, React, PowerShell, MongoDB, SQL, and more, and I’m just as at home troubleshooting a network as writing code.',
    ],
    metaDescription:
      'Cayce Greene is a software developer and IT specialist in Traverse City, MI, who builds tools and fixes the problems they’re meant to solve.',
    linkedin: 'https://www.linkedin.com/in/cayce-harwood-64403915a/',
    github: 'https://github.com/fox-bones',
  },

  focus: [
    {
      icon: 'tools',
      title: 'Internal tools',
      text: 'WPF applications for support troubleshooting and PowerShell scripts that expedite everyday tasks.',
      skill: 'WPF',
    },
    {
      icon: 'monitoring',
      title: 'Monitoring',
      text: 'Real-time metrics from remote sites, delivered through Prometheus, Grafana, and custom dashboards.',
      skill: 'Prometheus',
    },
    {
      icon: 'network',
      title: 'Networks and systems',
      text: 'Network troubleshooting and configuration, remote server access, and SQL Server communication.',
      skill: 'Network troubleshooting and configuration',
    },
    {
      icon: 'support',
      title: 'Support and training',
      text: 'Remote customer support, RTLS software training, and help desk work across Mac, Windows, iOS, and Android.',
      skill: 'Client communication',
    },
  ],

  experience: [
    {
      id: 'midmark',
      title: 'Technical Solutions Specialist',
      company: 'Midmark Corporation',
      location: 'Traverse City, MI',
      period: 'March 2026 – October 2026',
      highlights: [
        {
          text: 'Supported clients through remote server access, resolving network misconfiguration, Midmark software stack misconfiguration, SQL Server communication, and Midmark hardware malfunction issues.',
          skills: ['Remote server access', 'Network troubleshooting and configuration', 'SQL Server', 'Client communication'],
        },
        {
          text: 'Trained customers on Midmark Real-Time Location Systems (RTLS) software on several occasions.',
          skills: ['RTLS', 'Client communication'],
        },
        {
          text: 'Assisted in developing SHIELD, a program that sends real-time data metrics from remote sites to RTLS support offices, using a Prometheus server, Grafana dashboards, and custom dashboards for proactive data transmission; wrote documentation on how to use the SHIELD dashboards.',
          skills: ['Prometheus', 'Grafana', 'Custom dashboards', 'RTLS'],
        },
        {
          text: 'Developed WPF applications for support troubleshooting and PowerShell scripts to expedite tasks; investigated software bugs and reported them to the development team.',
          skills: ['WPF', 'C#', '.NET 4.8+', 'PowerShell'],
        },
        {
          text: 'Taught coworkers network fundamentals, including OSI model layers; helped new support staff with the RTLS software stack and provided custom software (WPF applications and SHIELD) to assist lower-level staff.',
          skills: ['Network troubleshooting and configuration', 'RTLS', 'WPF'],
        },
        {
          text: 'Imaged devices with Linux operating systems on multiple occasions to create development environments.',
          skills: ['Linux'],
        },
      ],
    },
    {
      id: 'honor-bank',
      title: 'Systems Consultant',
      company: 'Honor Bank',
      location: 'Traverse City, MI',
      period: 'May 2025 – October 2025',
      highlights: [
        {
          text: 'Provided design consultation for the company-wide file system and SharePoint; redesigned and launched the company SharePoint in line with each department liaison’s vision.',
          skills: ['SharePoint'],
        },
        {
          text: 'Explored Microsoft Copilot integrations alongside the company CEO, with an emphasis on cost and utilization.',
          skills: ['Microsoft Copilot'],
        },
      ],
    },
    {
      id: 'nmc-help-desk',
      title: 'Help Desk Associate',
      company: 'Northwestern Michigan College',
      location: 'Traverse City, MI',
      period: 'March 2025 – September 2025',
      highlights: [
        {
          text: 'Provided telephone and in-person support to staff and students, including password resets, multi-factor authentication, and technology questions across Mac, Windows, iOS, and Android; answered general campus inquiries.',
          skills: ['macOS', 'Windows', 'iOS', 'Android', 'Client communication'],
        },
        {
          text: 'Recorded and routed tickets to the proper department using the FreshService ticketing system.',
          skills: ['FreshService'],
        },
        {
          text: 'Assisted with campus website scheduling and design updates at the request of the Head of IT.',
          skills: [],
        },
      ],
    },
  ],

  skills: [
    {
      group: 'Programming Languages',
      items: ['JavaScript', 'TypeScript', 'Python', 'C#', 'Rust', 'Java', 'C++', 'Kotlin', 'PowerShell', 'SQL', 'HTML', 'CSS'],
    },
    {
      group: 'Frameworks',
      items: ['React', 'Next.js', 'Express', 'Flask', 'ASP.NET Core', 'Axum', 'WPF', '.NET 4.8+', 'Electron'],
    },
    { group: 'Databases', items: ['MongoDB', 'SQL Server', 'SQLite'] },
    { group: 'Monitoring and Data', items: ['Prometheus', 'Grafana', 'Custom dashboards', 'Database queries'] },
    {
      group: 'Networking and Systems',
      items: ['Network troubleshooting and configuration', 'Remote server access', 'Windows', 'macOS', 'Linux', 'iOS', 'Android'],
    },
    { group: 'Cloud and Delivery', items: ['Docker', 'GitHub Actions', 'Google Cloud Run', 'Firebase', 'Vercel'] },
    {
      group: 'Tools and Domain',
      items: ['SharePoint', 'Microsoft Copilot', 'FreshService', 'Zendesk', 'Microsoft Excel', 'SaaS', 'RTLS', 'Client communication'],
    },
  ],

  // Long names for abbreviated skills. Shown in the skill detail panel and searchable.
  glossary: {
    WPF: 'Windows Presentation Foundation',
    RTLS: 'Real-Time Location Systems',
    Axum: 'Rust web framework',
  },

  // Suggested starting points shown before a visitor has picked a skill.
  // The first three are the Top Skills on LinkedIn.
  featuredSkills: ['Prometheus', 'Grafana', 'MongoDB', 'Rust'],

  education: [
    {
      credential: 'Associate’s Degree, Computer Software Engineering',
      school: 'Northwestern Michigan College',
      date: 'January 2023 – June 2025',
      detail: '',
    },
  ],

  certifications: [
    { name: 'Microsoft Office Specialist: Excel Associate (Office 2019)', skills: ['Microsoft Excel'] },
    { name: 'IT Specialist – Networking', skills: ['Network troubleshooting and configuration'] },
    { name: 'IT Specialist – JavaScript', skills: ['JavaScript'] },
    { name: 'IT Specialist – HTML and CSS', skills: ['HTML', 'CSS'] },
    { name: 'IT Specialist – Databases', skills: ['SQL', 'SQL Server', 'Database queries'] },
  ],

  spotlight: {
    name: 'SHIELD',
    organization: 'Midmark Corporation',
    summary:
      'A program used to monitor and send real-time data metrics from remote sites to RTLS support offices, using a Prometheus server, Grafana dashboards, and custom dashboards.',
    contribution:
      'I assisted in developing SHIELD, wrote the documentation on how to use its dashboards, and provided it to support staff.',
    pipeline: [
      { label: 'Remote sites', detail: 'Real-time data metrics' },
      { label: 'Prometheus server', detail: 'Metrics collection' },
      { label: 'Grafana and custom dashboards', detail: 'Visualization' },
      { label: 'RTLS support offices', detail: 'Proactive visibility' },
    ],
    skills: ['Prometheus', 'Grafana', 'Custom dashboards', 'RTLS'],
  },

  projectsIntro:
    'Some of my projects include websites for clients, commercial dashboards used to measure hospital server metrics across the US, and networking troubleshooting applications that make non-technical users more capable in their roles.',

  /**
   * group    Which filter the card appears under: Tools, Web, or Games.
   * kind     Picks the icon. See the icons list in Projects.svelte.
   * featured Shows the card in the default view.
   * repo     Adds a "Code" link. Tools built for an employer deliberately have none.
   * demo     Adds a "Live demo" link.
   */
  projects: [
    {
      title: 'Chess',
      category: 'Desktop app',
      group: 'Games',
      kind: 'chess',
      featured: true,
      description:
        'An Electron chess app with full legal-move and check rules, play between two computers over a local network, and a Stockfish opponent at selectable strengths.',
      skills: ['JavaScript', 'Electron'],
      repo: 'https://github.com/fox-bones/chess',
    },
    {
      title: 'AI Pong',
      category: 'Machine learning game',
      group: 'Games',
      kind: 'games',
      featured: true,
      description:
        'My Rust Pong game with an opponent driven by a small neural network, trained through evolution and self-play in a headless simulation. Built with the use of Claude.ai.',
      skills: ['Rust'],
      repo: 'https://github.com/fox-bones/pong_ai',
    },
    {
      title: 'RTLS network status board',
      category: 'Monitoring',
      group: 'Tools',
      kind: 'monitoring',
      featured: true,
      description:
        'A Rust and Axum Windows service that gives a facility one live web page showing the health of its RTLS network hardware.',
      skills: ['Rust', 'Axum', 'RTLS', 'Windows'],
    },
    {
      title: 'Full-stack blog',
      category: 'Web app',
      group: 'Web',
      kind: 'rocket',
      featured: true,
      description:
        'A React frontend and an Express and MongoDB backend with JWT login and Jest tests, shipped through GitHub Actions and Docker to Google Cloud Run. Built while working through Modern Full-Stack React Projects.',
      skills: ['React', 'JavaScript', 'Express', 'MongoDB', 'Docker', 'GitHub Actions', 'Google Cloud Run'],
      repo: 'https://github.com/fox-bones/blog-post-page',
    },
    {
      title: 'Network troubleshooting software',
      category: 'Support tool',
      group: 'Tools',
      kind: 'network',
      featured: true,
      description:
        'WPF applications that run ICMP, TCP, and UDP checks across many devices at once, making non-technical users more capable in their roles.',
      skills: ['C#', 'WPF', '.NET 4.8+', 'Network troubleshooting and configuration'],
    },
    {
      title: 'Weather dashboard',
      category: 'Web app',
      group: 'Web',
      kind: 'weather',
      featured: true,
      description:
        'A Python and Flask dashboard with current conditions, 24-hour and 7-day forecasts, and automatic refresh from the Open-Meteo API. Built with the use of Claude.ai.',
      skills: ['Python', 'Flask'],
      repo: 'https://github.com/fox-bones/weather_app',
    },
    {
      title: 'Network monitoring dashboards',
      category: 'Monitoring',
      group: 'Tools',
      kind: 'monitoring',
      description: 'Commercial dashboards used to measure hospital server metrics across the US.',
      skills: ['Custom dashboards'],
    },
    {
      title: 'Deployment helpers',
      category: 'Support tool',
      group: 'Tools',
      kind: 'tools',
      description:
        'WPF tools that report file versions across an installed software stack and check and install the Windows features it requires, using PowerShell.',
      skills: ['C#', 'WPF', '.NET 4.8+', 'PowerShell', 'Windows'],
    },
    {
      title: 'BLE device scanner',
      category: 'Android app',
      group: 'Tools',
      kind: 'bluetooth',
      description:
        'An Android app in Kotlin and Jetpack Compose that scans for nearby Bluetooth Low Energy devices and reports their signal strength.',
      skills: ['Kotlin', 'Android'],
    },
    {
      title: 'Pi controller board programming',
      category: 'Embedded',
      group: 'Tools',
      kind: 'embedded',
      description: '',
      skills: [],
    },
    {
      title: 'Company websites',
      category: 'Web',
      group: 'Web',
      kind: 'web',
      description: 'Websites built for clients.',
      skills: ['HTML', 'CSS'],
    },
    {
      title: 'Cyber Awareness Portal',
      category: 'Web app',
      group: 'Web',
      kind: 'security',
      description:
        'An ASP.NET Core portal for Northwestern Michigan College with cyber security lessons, tests, and results that students can share with instructors and staff.',
      skills: ['C#', 'ASP.NET Core', 'SQL Server'],
    },
    {
      title: 'Library API',
      category: 'API',
      group: 'Web',
      kind: 'server',
      description: 'A Flask REST API for a book collection, backed by a MongoDB database running in Docker.',
      skills: ['Python', 'Flask', 'MongoDB', 'Docker'],
      repo: 'https://github.com/fox-bones/Simple-API',
    },
    {
      title: 'Hacker Stories',
      category: 'Web app',
      group: 'Web',
      kind: 'web',
      description:
        'A searchable list of stories fetched from a live API, in React and TypeScript and deployed to Firebase. Follows The Road to React.',
      skills: ['React', 'TypeScript', 'Firebase'],
      repo: 'https://github.com/fox-bones/hacker-stories',
      demo: 'https://project-8508376682125880375.web.app',
    },
    {
      title: 'Next.js web portal',
      category: 'Web app',
      group: 'Web',
      kind: 'web',
      description:
        'A full-stack portal in Next.js and TypeScript, built by following Vercel’s course, covering dynamic rendering and streaming data.',
      skills: ['React', 'Next.js', 'TypeScript', 'Vercel'],
      repo: 'https://github.com/fox-bones/Vercel-Next.js-Course',
      demo: 'https://vercel-next-js-course-blush.vercel.app',
    },
    {
      title: 'Rusty Snake',
      category: 'Game',
      group: 'Games',
      kind: 'games',
      description: 'The classic Snake game, written in Rust with the macroquad library.',
      skills: ['Rust'],
      repo: 'https://github.com/fox-bones/RustySnake',
    },
    {
      title: 'Browser game site',
      category: 'Game',
      group: 'Games',
      kind: 'games',
      description: 'A JavaScript term project collecting browser games, including Chess, Grid Knight, and Flyby.',
      skills: ['JavaScript', 'HTML', 'CSS'],
      repo: 'https://github.com/fox-bones/Javascript-Term-Project',
    },
    {
      title: 'Coursework and practice',
      category: 'Archive',
      group: 'Web',
      kind: 'archive',
      description: 'C#, ASP.NET Core, Flask, SQL, C++, and JavaScript exercises from my classes and self-study.',
      skills: ['C#', 'ASP.NET Core', 'Python', 'Flask', 'SQL', 'SQLite', 'C++', 'JavaScript', 'HTML', 'CSS'],
      repo: 'https://github.com/fox-bones',
    },
  ],
};

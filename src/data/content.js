/**
 * Single source of truth for everything the site renders.
 * Kept as plain data so the integrity suite can assert on it.
 */

export const PROFILE = {
  name: 'Debayon Mallik',
  role: 'AI & Agentic Systems Engineer',
  headline: 'I build agents that do the work — not demos that talk about it.',
  subhead:
    'LLM-driven browser automation, multi-agent research pipelines and enterprise data conversion for Oracle Fusion. Deterministic where it matters, intelligent where it helps.',
  location: 'Hyderabad, India',
  portrait: { src: '/debayon.jpg', alt: 'Debayon Mallik' },
  email: 'debayonmallik9932@gmail.com',
  phone: '+91 94756 71612',
  availability: 'Open to AI engineering roles and automation engagements',
  education: [
    { school: 'IIEST Shibpur', detail: 'B.Tech, Electrical Engineering — CGPA 8.3', period: '2022 – 2026' },
    { school: 'Hariyana Vidya Mandir, Kolkata', detail: 'CBSE — 92.8%', period: '2020 – 2022' },
    { school: "The St. Xavier's School, Malda", detail: 'ICSE — 89.4%', period: '2020' },
  ],
  links: [
    { label: 'GitHub', href: 'https://github.com/DEBAYONMALLIK', handle: 'DEBAYONMALLIK' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/debayon-mallik', handle: 'debayon-mallik' },
    { label: 'Hugging Face', href: 'https://huggingface.co/linkinmallik', handle: 'linkinmallik' },
    { label: 'LeetCode', href: 'https://leetcode.com/u/DebayonMallik/', handle: 'DebayonMallik' },
    { label: 'CodeChef', href: 'https://www.codechef.com/users/baku_kijuku', handle: 'baku_kijuku' },
    { label: 'Medium', href: 'https://medium.com/@debayonmallik9932', handle: '@debayonmallik9932' },
  ],
};

export const PROJECTS = [
  {
    id: 'oracle-browser-agent',
    title: 'AI-Powered Browser Automation for Oracle Testing',
    org: 'Trinamix Systems',
    year: 2026,
    featured: true,
    visibility: 'client',
    tags: ['Agentic AI', 'Browser Automation'],
    stack: ['Browser Use', 'Python', 'LLMs', 'Oracle Fusion'],
    summary:
      'An LLM-driven automation system that runs functional tests end to end inside Oracle Fusion 22 — Transfer Orders, Purchase Orders and other business transactions, executed and validated without a human driving the browser.',
    highlights: [
      'Couples LLM reasoning with direct browser control to read a task, find the right UI elements and carry out multi-step workflows.',
      'Validates each transaction automatically instead of leaving a human to eyeball the result.',
      'Survives the UI drift that breaks selector-based scripts, because the agent re-reads the page rather than replaying coordinates.',
    ],
    metrics: [
      { value: 'Fusion 22', label: 'target environment' },
      { value: 'End-to-end', label: 'transaction coverage' },
    ],
    links: [],
  },
  {
    id: 'conversion-workbench',
    title: 'Oracle Fusion Conversion Workbench',
    org: 'Trinamix Systems',
    year: 2026,
    featured: true,
    visibility: 'client',
    tags: ['Data Engineering'],
    stack: ['Python', 'SQL', 'Oracle Database', 'FBDI'],
    summary:
      'Source-to-target mapping and transformation workflows that move enterprise data out of legacy ERP systems — NetSuite, eBOS — and into Oracle Fusion without the usual month of manual reconciliation.',
    highlights: [
      'Lookup-driven transformations, cleansing, deduplication and reconciliation across legacy schemas.',
      'Field-level validation of Oracle FBDI files against customer-specific conversion rules before anything is loaded.',
      'AI-assisted validation that surfaces data issues on its own, so functional consultants review exceptions instead of rows.',
    ],
    metrics: [
      { value: '2 legacy ERPs', label: 'migrated from' },
      { value: 'Field-level', label: 'FBDI validation' },
    ],
    links: [],
  },
  {
    id: 'festive-sale-gadget-advisor',
    title: 'Festive Sale Gadget Advisor',
    org: 'Personal',
    year: 2025,
    featured: true,
    visibility: 'public',
    tags: ['Agentic AI', 'Browser Automation', 'MCP'],
    stack: ['LangGraph', 'OpenAI Agents SDK', 'MCP', 'Browser Use', 'Gradio'],
    summary:
      'Describe what you want in plain words and a pipeline of agents goes and finds it: owner threads on Reddit, real reviews on YouTube, and live per-variant prices read off Amazon and Flipkart by a real Chrome browser.',
    highlights: [
      'Eight LangGraph nodes and four MCP servers — Reddit, YouTube, web search, knowledge-graph memory — with scouts and deep dives fanned out in parallel.',
      'Drives a real browser for live prices, dropping out-of-stock and over-budget variants instead of trusting model-generated figures.',
      'Scoring and price arithmetic stay in deterministic Python, so the numbers cannot be hallucinated.',
      'Every claim is cited back to the thread or video it came from.',
    ],
    metrics: [
      { value: '8', label: 'LangGraph nodes' },
      { value: '4', label: 'MCP servers' },
      { value: '0', label: 'hallucinated prices' },
    ],
    links: [{ label: 'Live app', href: 'https://festive-sale-gadget-advisor.vercel.app/' }],
  },
  {
    id: 'ai-twin-chatbot',
    title: 'AI Twin with Human Escalation',
    org: 'Personal',
    year: 2025,
    featured: false,
    visibility: 'public',
    tags: ['Agentic AI', 'LLM Apps'],
    stack: ['Hugging Face Spaces', 'Python', 'Pushover', 'LLMs'],
    summary:
      'A chatbot that answers as me from my own background, and knows when it should not: anything urgent is pushed straight to my phone through Pushover so a real person picks it up.',
    highlights: [
      'Human-in-the-loop by design — the agent handles the routine and hands off the rest.',
      'Grounded in my own profile and history rather than free-associating about me.',
    ],
    metrics: [{ value: 'Instant', label: 'escalation to phone' }],
    links: [{ label: 'Try it on Hugging Face', href: 'https://huggingface.co/spaces/linkinmallik/1_foundations' }],
  },
  {
    id: 'agentic-chatbot-system',
    title: 'Agentic Chatbot System',
    org: 'Personal',
    year: 2025,
    featured: false,
    visibility: 'public',
    tags: ['Agentic AI', 'LLM Apps'],
    stack: ['OpenAI SDK', 'Gemini API', 'Tool Calling', 'Python'],
    summary:
      'A chatbot built around reasoning and tool use rather than single-shot answers — it plans, calls real tools to act on the outside world, and reports what it actually did.',
    highlights: [
      'Function calling to perform external actions through programmatic tools.',
      'Streaming responses, structured outputs and tracing for real-time interaction and observability.',
    ],
    metrics: [{ value: 'Traced', label: 'every tool call' }],
    links: [{ label: 'Source', href: 'https://github.com/DEBAYONMALLIK' }],
  },
  {
    id: 'hospital-management-system',
    title: 'Hospital Management System',
    org: 'Personal',
    year: 2025,
    featured: false,
    visibility: 'public',
    tags: ['Full-Stack'],
    stack: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS'],
    summary:
      'A full hospital workflow in one app — patient and doctor records, role-separated dashboards, and a chat layer with natural-language handling on top.',
    highlights: [
      'Separate dashboards for the roles that need different things from the same data.',
      'Patient and doctor record creation with a REST API behind it.',
      'An in-app chat application built on natural language processing.',
    ],
    metrics: [{ value: 'Role-based', label: 'dashboards' }],
    links: [{ label: 'Live app', href: 'https://hms-frontend-1.vercel.app/' }],
  },
];

export const EXPERIENCE = [
  {
    company: 'Trinamix Systems Pvt. Ltd.',
    location: 'Hyderabad',
    period: 'June 2026 – Present',
    roles: [
      {
        title: 'AI-Powered Browser Automation for Oracle Testing',
        stack: ['Browser Use', 'LLMs', 'Python'],
        bullets: [
          'Built an LLM-driven browser automation system for functional testing in Oracle Fusion 22, automating Transfer Orders, Purchase Orders and other business transactions end to end.',
          'Combined LLM reasoning with browser control to interpret tasks, navigate workflows, identify UI elements and execute multi-step actions with automated validation.',
        ],
      },
      {
        title: 'Oracle Fusion Conversion Workbench',
        stack: ['Python', 'SQL', 'Oracle Database', 'FBDI'],
        bullets: [
          'Built source-to-target mapping and transformation workflows for migrating enterprise data from legacy ERP systems (NetSuite, eBOS) into Oracle Fusion.',
          'Implemented lookup-driven transformations, cleansing, deduplication and reconciliation, plus field-level validation of Oracle FBDI files against business-specific conversion rules.',
          'Added AI-assisted validation to surface data issues automatically, and worked with functional consultants on mapping requirements and customer demonstrations.',
        ],
      },
    ],
  },
];

export const SERVICES = [
  {
    id: 'browser-agent',
    title: 'Put an agent on the software you already pay for',
    outcome:
      'The repetitive clicking in your ERP, CRM or admin portal gets done by an agent that reads the screen like a person would — overnight, every night, with a validation pass on every record it touches.',
    bullets: [
      'Works against the UI you have, so there is no integration project first',
      'Reads the page instead of replaying selectors, so a layout change does not break it',
      'Every run is validated and logged',
    ],
    proof: ['oracle-browser-agent', 'festive-sale-gadget-advisor'],
  },
  {
    id: 'data-pipeline',
    title: 'Move and clean data between systems without a manual month',
    outcome:
      'Legacy records mapped, cleansed, de-duplicated and reconciled into the target system, with field-level validation catching the bad rows before a load fails rather than after.',
    bullets: [
      'Source-to-target mapping built with your functional team',
      'AI-assisted validation that surfaces exceptions for review',
      'Reconciliation you can hand to an auditor',
    ],
    proof: ['conversion-workbench'],
  },
  {
    id: 'research-agent',
    title: 'Turn scattered research into a decision you can defend',
    outcome:
      'A pipeline of agents reads the forums, reviews and live sources your team does not have time for, then returns a scored shortlist where every claim links back to where it came from.',
    bullets: [
      'Real sources, cited — not a model recalling from memory',
      'Live figures read from the actual page',
      'Scoring kept in deterministic code so the numbers hold up',
    ],
    proof: ['festive-sale-gadget-advisor'],
  },
  {
    id: 'support-agent',
    title: 'Answer the routine questions, escalate the ones that matter',
    outcome:
      'A grounded assistant that handles the repeat questions from your own material, recognises what it should not answer, and pushes the urgent ones to a human immediately.',
    bullets: [
      'Grounded in your documents, not improvising',
      'Explicit escalation path to a real person',
      'Traced and observable end to end',
    ],
    proof: ['ai-twin-chatbot', 'agentic-chatbot-system'],
  },
];

export const SKILL_GROUPS = [
  { name: 'AI & Agentic Systems', items: ['LangGraph', 'LangChain', 'OpenAI Agents SDK', 'MCP', 'Gemini API', 'Tool / Function Calling', 'LLMs'] },
  { name: 'Browser Automation', items: ['Browser Use', 'Playwright', 'LLM-Powered Automation', 'Automated Application Testing'] },
  { name: 'Languages', items: ['Python', 'C / C++', 'JavaScript', 'SQL'] },
  { name: 'Web & Data', items: ['React', 'Redux', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'REST APIs', 'Oracle Database', 'FBDI'] },
  { name: 'Tooling', items: ['Git', 'Docker', 'Postman', 'Vercel', 'Render', 'Hugging Face Spaces'] },
];

export const CERTIFICATIONS = [
  {
    title: 'Cloud Computing Fundamentals',
    issuer: 'Google Cloud',
    date: 'Oct 2023',
    href: 'https://www.skills.google/public_profiles/574c64df-c774-49f2-9661-2c07e49d6f0d/badges/5524017',
  },
  {
    title: 'Introduction to Generative AI',
    issuer: 'Google Cloud',
    date: 'Oct 2023',
    href: 'https://www.skills.google/public_profiles/574c64df-c774-49f2-9661-2c07e49d6f0d/badges/5512209',
  },
  {
    title: 'Level 3 GenAI: Prompt Engineering',
    issuer: 'Google Cloud',
    date: 'Oct 2023',
    href: 'https://www.skills.google/public_profiles/574c64df-c774-49f2-9661-2c07e49d6f0d/badges/5511978',
  },
];

export const ACHIEVEMENTS = [
  { value: '350+', label: 'algorithmic problems solved', detail: 'LeetCode, CodeChef and GeeksforGeeks' },
  { value: '8.3', label: 'CGPA at IIEST Shibpur', detail: 'B.Tech, Electrical Engineering' },
  { value: '3', label: 'Google Cloud badges', detail: 'Cloud fundamentals and generative AI' },
];

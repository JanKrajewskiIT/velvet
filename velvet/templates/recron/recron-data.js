// Recron demo data + small domain helpers. Shapes mirror recron-web/src/models (Offer, Interview, Question, PortfolioData, UserProfile).
(() => {
  const TODAY = new Date(2026, 9, 6, 9, 30);
  const STATUS = {
    new: { label: 'New', tone: 'info', color: 'var(--dv-4)' },
    considering: { label: 'Considering', tone: 'warning', color: 'var(--dv-3)' },
    applied: { label: 'Applied', tone: 'brand', color: 'var(--dv-1)' },
    rejected: { label: 'Rejected', tone: 'neutral', color: 'var(--dv-8)' }
  };
  const STATUS_ORDER = ['new', 'considering', 'applied', 'rejected'];
  const STAGES = ['Screening', 'Technical', 'HR', 'Offer', 'Onboarding'];
  const fmtNum = (n) => new Intl.NumberFormat('en-US').format(n);
  const salary = (o) => {
    if (o.salaryMin == null && o.salaryMax == null) return '—';
    const per = o.period === 'hour' ? '/h' : o.period === 'year' ? '/yr' : '/mo';
    const a = o.salaryMin != null ? fmtNum(o.salaryMin) : '';
    const b = o.salaryMax != null ? fmtNum(o.salaryMax) : '';
    return (a && b ? a + '–' + b : a || b) + ' ' + (o.currency || 'PLN') + per;
  };
  const monthly = (o) => { const v = o.salaryMax ?? o.salaryMin; if (v == null) return null; return o.period === 'hour' ? v * 168 : o.period === 'year' ? Math.round(v / 12) : v; };
  const d = (s) => new Date(s);
  const fmtDate = (s, opt) => d(s).toLocaleDateString('en-GB', opt || { day: 'numeric', month: 'short' });
  const fmtTime = (s) => d(s).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const relDay = (s) => {
    const a = new Date(TODAY); a.setHours(0, 0, 0, 0);
    const b = d(s); b.setHours(0, 0, 0, 0);
    const n = Math.round((b - a) / 864e5);
    if (n === 0) return 'Today';
    if (n === 1) return 'Tomorrow';
    if (n === -1) return 'Yesterday';
    if (n > 1 && n < 7) return d(s).toLocaleDateString('en-GB', { weekday: 'long' });
    return fmtDate(s);
  };
  const daysAgo = (s) => Math.round((TODAY - d(s)) / 864e5);

  const md = (role, company, stack) => `**${company}** is hiring a ${role} to join a product team of eight.\n\n### What you'll do\n- Build and own customer-facing features in ${stack.join(', ')}\n- Work with design on a shared component library\n- Review code and mentor two mid-level engineers\n- Take part in planning and technical discovery\n\n### What we expect\n- 4+ years of commercial frontend experience\n- Strong ${stack[0]} and TypeScript\n- Experience with testing (Jest, Playwright)\n- English at B2 or higher\n\n### Nice to have\n- Design-system work\n- GraphQL\n- Accessibility audits`;

  const offers = [
    { id: 'o1', name: 'Senior Frontend Developer', company: 'Acme Software', city: 'Warsaw', status: 'applied', workMode: 'Remote', salaryMin: 18000, salaryMax: 24000, currency: 'PLN', period: 'month', source: 'LinkedIn', match: 82, tags: ['React', 'TypeScript'], added: '2026-09-22', aiParsed: true, reasons: ['Good salary', 'Fully remote'], link: 'https://example.com/acme' },
    { id: 'o2', name: 'React Engineer', company: 'Globex', city: 'Kraków', status: 'applied', workMode: 'Hybrid', salaryMin: 16000, salaryMax: 21000, currency: 'PLN', period: 'month', source: 'JustJoin.it', intermediary: 'Hays IT', match: 71, tags: ['React'], added: '2026-09-25', aiParsed: true, reasons: ['Interesting product', 'Hybrid in Kraków'], link: 'https://example.com/globex' },
    { id: 'o3', name: 'Frontend Engineer, Design Systems', company: 'Initech', city: 'Gdańsk', status: 'applied', workMode: 'Hybrid', salaryMin: 17000, salaryMax: 22000, currency: 'PLN', period: 'month', source: 'Referral', match: 88, tags: ['Design systems', 'React', 'Dream job'], added: '2026-09-18', reasons: ['Design-system role', 'Strong team'], link: 'https://example.com/initech' },
    { id: 'o4', name: 'UI Engineer', company: 'Umbrella Health', city: 'Wrocław', status: 'considering', workMode: 'On-site', salaryMin: 14000, salaryMax: 18000, currency: 'PLN', period: 'month', source: 'Pracuj.pl', match: null, tags: ['Vue'], added: '2026-09-24', aiParsed: true, link: 'https://example.com/umbrella' },
    { id: 'o5', name: 'Fullstack Developer (Node + React)', company: 'Hooli', city: 'Remote', status: 'applied', workMode: 'Remote', salaryMin: 20000, salaryMax: 26000, currency: 'PLN', period: 'month', source: 'LinkedIn', match: 64, tags: ['Node', 'React'], added: '2026-09-20', link: 'https://example.com/hooli' },
    { id: 'o6', name: 'Frontend Developer', company: 'Stark Fintech', city: 'Warsaw', status: 'considering', workMode: 'Hybrid', salaryMin: 15000, salaryMax: 19000, currency: 'PLN', period: 'month', source: 'Company site', intermediary: 'Michael Page', match: 76, tags: ['Angular', 'Follow up'], added: '2026-09-27', link: 'https://example.com/stark' },
    { id: 'o7', name: 'Senior React Developer', company: 'Wayne Logistics', city: 'Poznań', status: 'new', workMode: 'Remote', salaryMin: 60000, salaryMax: 75000, currency: 'EUR', period: 'year', source: 'Email', intermediary: 'Talent Hunters', match: null, tags: ['React'], added: '2026-10-05', link: 'https://example.com/wayne' },
    { id: 'o8', name: 'TypeScript Developer', company: 'Soylent', city: 'Remote', status: 'new', workMode: 'Remote', salaryMin: 140, salaryMax: 170, currency: 'PLN', period: 'hour', source: 'JustJoin.it', match: null, tags: ['TypeScript'], added: '2026-10-04', link: 'https://example.com/soylent' },
    { id: 'o9', name: 'Frontend Developer', company: 'Cyberdyne', city: 'Łódź', status: 'rejected', workMode: 'On-site', salaryMin: 12000, salaryMax: 15000, currency: 'PLN', period: 'month', source: 'NoFluffJobs', match: 58, tags: [], added: '2026-09-08', decidedBy: 'them', reasons: ['Failed technical', 'Wanted more backend'], link: 'https://example.com/cyberdyne' },
    { id: 'o10', name: 'JavaScript Developer', company: 'Vandelay Industries', city: 'Remote', status: 'rejected', workMode: 'Remote', salaryMin: 13000, salaryMax: 16000, currency: 'PLN', period: 'month', source: 'LinkedIn', match: null, tags: [], added: '2026-09-02', decidedBy: 'me', reasons: ['Salary too low', 'On-site 5 days'], link: 'https://example.com/vandelay' }
  ].map((o) => ({ reasons: [], intermediary: '', aiParsed: false, decidedBy: null, ...o, description: md(o.name, o.company, o.tags.length ? o.tags : ['React']) }));

  const interviews = [
    { id: 'i1', offerId: 'o1', stage: 'Screening', status: 'done', outcomeNote: 'Moved to technical the same day.', at: '2026-09-30T11:00', duration: 30, location: 'Phone', notes: 'Recruiter: Kasia. Asked about notice period and salary range.' },
    { id: 'i2', offerId: 'o1', stage: 'Technical', status: 'scheduled', at: '2026-10-07T10:00', duration: 60, location: 'Google Meet', notes: 'Live coding in React. Review hooks and performance.' },
    { id: 'i3', offerId: 'o3', stage: 'Screening', status: 'done', at: '2026-09-26T09:30', duration: 30, location: 'Phone', notes: '' },
    { id: 'i4', offerId: 'o3', stage: 'Technical', status: 'done', at: '2026-10-02T13:00', duration: 90, location: 'Teams', notes: 'Went well — design-token architecture question.' },
    { id: 'i5', offerId: 'o3', stage: 'HR', status: 'scheduled', at: '2026-10-08T14:30', duration: 45, location: 'Initech office, Gdańsk', notes: '' },
    { id: 'i6', offerId: 'o2', stage: 'Screening', status: 'scheduled', at: '2026-10-09T09:00', duration: 30, location: 'Phone', notes: '' },
    { id: 'i8', offerId: 'o6', stage: 'Screening', status: 'scheduled', at: '2026-10-05T15:00', duration: 30, location: 'Phone', notes: 'Recruiter call via Michael Page.' },
    { id: 'i9', offerId: 'o9', stage: 'Screening', status: 'done', at: '2026-09-12T10:00', duration: 30, location: 'Phone', notes: '' },
    { id: 'i10', offerId: 'o9', stage: 'Technical', status: 'failed', at: '2026-09-17T12:00', duration: 90, location: 'Teams', notes: '', outcomeNote: 'Struggled with the Node.js part.' },
    { id: 'i11', offerId: 'o5', stage: 'Screening', status: 'cancelled', at: '2026-09-29T16:00', duration: 30, location: 'Zoom', notes: '', outcomeNote: 'Rescheduled by the recruiter.' },
    { id: 'i7', offerId: 'o5', stage: 'Technical', status: 'scheduled', at: '2026-10-13T11:00', duration: 90, location: 'Zoom', notes: 'System design: real-time notifications.' }
  ];

  const catTree = [
    { id: 'js', name: 'JavaScript', icon: 'code', subs: ['Event loop & async', 'Closures & scope', 'Prototypes & classes', 'Functions', 'Modules', 'Types & coercion', 'Arrays & objects', 'Error handling', 'Iterators & generators', 'Patterns', 'Memory', 'ES2023+'] },
    { id: 'ts', name: 'TypeScript', icon: 'code', subs: ['Types vs interfaces', 'Generics', 'Conditional types', 'Utility types', 'Narrowing', 'Declaration files', 'Config & strictness', 'Decorators', 'Enums & literals'] },
    { id: 'react', name: 'React', icon: 'layers', subs: ['Hooks', 'Rendering & reconciliation', 'State management', 'Server Components', 'Forms', 'Routing', 'Performance', 'Context', 'Suspense & data', 'Refs & DOM', 'Patterns', 'Testing React'] },
    { id: 'angular', name: 'Angular', icon: 'zap', subs: ['Signals', 'Change detection', 'RxJS', 'DI', 'Routing', 'Forms', 'Standalone APIs'] },
    { id: 'vue', name: 'Vue', icon: 'git-merge', subs: ['Reactivity', 'Composition API', 'Pinia', 'Nuxt', 'Directives'] },
    { id: 'css', name: 'CSS & HTML', icon: 'palette', subs: ['Cascade & specificity', 'Layout: grid & flex', 'Responsive & container queries', 'Animations', 'Semantics', 'Custom properties', 'Architecture', 'Forms & inputs'] },
    { id: 'web', name: 'Browser & Web APIs', icon: 'globe', subs: ['Rendering pipeline', 'Storage', 'Networking & fetch', 'Workers', 'Events', 'Security headers', 'Web components'] },
    { id: 'perf', name: 'Performance', icon: 'monitor', subs: ['Core Web Vitals', 'Bundle size', 'Caching', 'Images & fonts', 'Profiling', 'Runtime performance'] },
    { id: 'a11y', name: 'Accessibility', icon: 'eye', subs: ['ARIA', 'Keyboard & focus', 'Screen readers', 'Colour & contrast', 'Testing a11y'] },
    { id: 'testing', name: 'Testing', icon: 'filter', subs: ['Unit', 'Integration', 'End-to-end', 'Mocking', 'Flaky tests', 'TDD', 'Visual regression'] },
    { id: 'node', name: 'Node.js', icon: 'server', subs: ['Event loop', 'Streams', 'HTTP & APIs', 'Databases', 'Auth', 'Scaling'] },
    { id: 'security', name: 'Security', icon: 'shield', subs: ['XSS', 'CSRF', 'Auth & sessions', 'CSP', 'Dependencies'] },
    { id: 'tooling', name: 'Git & tooling', icon: 'git-branch', subs: ['Git workflows', 'Bundlers', 'CI/CD', 'Monorepos', 'Linting'] },
    { id: 'design', name: 'System design', icon: 'database', subs: ['Real-time', 'Design systems', 'Architecture', 'Scalability', 'Data fetching', 'Micro-frontends', 'Offline-first', 'Case studies'] },
    { id: 'behavioral', name: 'Behavioral', icon: 'message-square', subs: ['Conflict', 'Motivation', 'Leadership', 'Failure', 'Teamwork', 'Feedback', 'Career goals', 'Salary talk'] }
  ];
  const categories = catTree.map((c) => c.name);
  const roles = [
    { id: 'frontend', name: 'Frontend Developer', categories: categories.filter((c) => c !== 'Node.js') },
    { id: 'fullstack', name: 'Fullstack Developer', categories: categories.filter((c) => !['Angular', 'Vue'].includes(c)) },
    { id: 'backend', name: 'Backend Developer', categories: ['JavaScript', 'TypeScript', 'Node.js', 'Security', 'Testing', 'Git & tooling', 'System design', 'Behavioral'] },
    { id: 'qa', name: 'QA Engineer', categories: ['JavaScript', 'Testing', 'Accessibility', 'Git & tooling', 'Behavioral'] }
  ];
  const INTERVIEW = {
    scheduled: { label: 'Scheduled', tone: 'brand', icon: 'calendar' },
    done: { label: 'Passed', tone: 'success', icon: 'check' },
    failed: { label: 'Not passed', tone: 'danger', icon: 'x' },
    cancelled: { label: 'Cancelled', tone: 'neutral', icon: 'x-circle' }
  };
  const tags = [
    { id: 't1', name: 'React', color: 'var(--dv-1)' }, { id: 't2', name: 'TypeScript', color: 'var(--dv-4)' }, { id: 't3', name: 'Design systems', color: 'var(--dv-6)' },
    { id: 't4', name: 'Vue', color: 'var(--dv-5)' }, { id: 't5', name: 'Node', color: 'var(--dv-2)' }, { id: 't6', name: 'Angular', color: 'var(--dv-3)' },
    { id: 't7', name: 'Dream job', color: 'var(--dv-7)' }, { id: 't8', name: 'Follow up', color: 'var(--dv-8)' }
  ];
  const REASONS = {
    considering: ['Good salary', 'Interesting product', 'Tech stack fit', 'Fully remote', 'Growth', 'Strong team', 'Close to home'],
    applied: ['Good salary', 'Interesting product', 'Tech stack fit', 'Fully remote', 'Design-system role', 'Strong team', 'Referral'],
    rejected: { me: ['Salary too low', 'Wrong tech stack', 'On-site 5 days', 'Company culture', 'Long process', 'Accepted another offer'], them: ['No reply', 'Failed screening', 'Failed technical', 'Wanted more backend', 'Too junior', 'Position closed'] }
  };
  const SUB = { q1: 'Event loop & async', q2: 'Hooks', q3: 'Rendering & reconciliation', q4: 'Types vs interfaces', q5: 'Conditional types', q6: 'Cascade & specificity', q7: 'Responsive & container queries', q8: 'Unit', q9: 'Real-time', q10: 'Design systems', q11: 'Conflict', q12: 'Motivation', q13: 'Closures & scope', q14: 'Server Components', q15: 'Functions', q16: 'Flaky tests', q17: 'Hooks', q18: 'State management', q19: 'Forms', q20: 'Core Web Vitals', q21: 'Keyboard & focus', q22: 'Storage', q23: 'Streams', q24: 'XSS', q25: 'Patterns', q26: 'Signals' };
  let qOrder = 0;
  const q = (id, category, question, answer, level, difficulty, votes, extra) => ({ id, category, sub: SUB[id], question, answer, aiRole: null, level, difficulty, votes, voted: false, learning: false, mine: false, pending: false, order: qOrder++, ...extra });
  const questions = [
    q('q1', 'JavaScript', 'What is the event loop and how do microtasks differ from macrotasks?', 'The event loop takes the next task from the macrotask queue (timers, I/O, UI events). After each task it drains the whole microtask queue (promise callbacks, queueMicrotask, MutationObserver) before rendering. So a resolved promise always runs before a setTimeout(0) queued at the same time.', 'Mid', 3, 142, { learning: true }),
    q('q2', 'React', 'When would you reach for useMemo or useCallback — and when not?', 'Use them when referential identity matters: a memoised child, an effect dependency, or an expensive derivation. Skip them for cheap values — memoisation has its own cost and makes code harder to read.', 'Mid', 3, 118, { voted: true }),
    q('q3', 'React', 'How does React reconcile lists, and why do keys matter?', 'React matches children by key between renders. Stable, unique keys let it move, keep or remove DOM nodes and component state correctly. Index keys break when items are inserted, removed or reordered.', 'Junior', 2, 96),
    q('q4', 'TypeScript', 'Explain the difference between `type` and `interface`.', 'Both describe object shapes. Interfaces can be re-opened (declaration merging) and extended. Types can express unions, intersections, mapped and conditional types. Use interfaces for public object contracts, types for everything else.', 'Junior', 2, 88),
    q('q5', 'TypeScript', 'What are conditional types and `infer`? Give a practical example.', '`T extends U ? X : Y` picks a type based on assignability; `infer` captures a part of the matched type. Example: `type Awaited<T> = T extends Promise<infer R> ? R : T`.', 'Senior', 4, 61, { learning: true }),
    q('q6', 'CSS & HTML', 'How does the cascade decide which rule wins?', 'Origin and importance first, then cascade layers, then specificity, then source order. Inline styles beat selectors; !important flips origin order. @layer lets you control priority without specificity hacks.', 'Mid', 2, 74),
    q('q7', 'CSS & HTML', 'When would you use container queries over media queries?', 'When a component must adapt to the space it is given rather than the viewport — cards in sidebars vs main columns, widgets in dashboards. Media queries stay right for page-level layout.', 'Mid', 3, 52),
    q('q8', 'Testing', 'What would you test with unit tests vs end-to-end tests in a React app?', 'Unit/component tests: pure logic, hooks, rendering states and interactions of single components. E2E: critical user journeys across pages and the real backend — sign-in, checkout. Keep E2E few and stable.', 'Mid', 3, 47),
    q('q9', 'System design', 'Design a real-time notification system for a web app.', 'Clients keep a WebSocket/SSE connection to a gateway; events come from a queue (Kafka/SQS); a fan-out service resolves recipients; unread state lives in a store with TTL; fall back to polling; batch and rate-limit; deliver push/email for offline users.', 'Senior', 5, 39),
    q('q10', 'System design', 'How would you structure a design system so multiple apps can adopt it?', 'Layered tokens (raw → semantic → component), headless behaviour separated from styles, versioned packages with codemods, documentation with live examples, and adoption metrics.', 'Senior', 4, 33, { mine: true }),
    q('q11', 'Behavioral', 'Tell me about a time you disagreed with a technical decision.', 'Use STAR: the situation, what you proposed and why (data, prototypes), how you listened, the outcome — and what you would repeat. Show you can disagree and commit.', 'Mid', 2, 81),
    q('q12', 'Behavioral', 'Why are you leaving your current role?', 'Stay positive and forward-looking: the scope or growth you want next and how this role offers it. Never criticise your current employer.', 'Junior', 1, 64),
    q('q13', 'JavaScript', 'What is a closure? Show a bug closures commonly cause.', 'A function that keeps access to variables from its defining scope. Classic bug: `var` in a loop with async callbacks — all callbacks see the final value. Fix with `let` or an IIFE.', 'Junior', 2, 77),
    q('q14', 'React', 'What problems do Server Components solve?', 'They render on the server with direct data access, send no JS for static parts, and stream UI. That cuts bundle size and waterfalls; interactive parts stay Client Components.', 'Senior', 4, 45),
    q('q15', 'JavaScript', 'Debounce vs throttle — when do you use each?', 'Debounce waits until calls stop (search-as-you-type, resize end). Throttle runs at most once per interval (scroll handlers, drag).', 'Junior', 2, 58),
    q('q16', 'Testing', 'How do you keep flaky E2E tests under control?', 'Wait on state, not time; isolate test data; mock third parties; retry with reporting; quarantine flaky tests and track them.', 'Mid', 3, 29),
    q('q17', 'React', 'Why does useEffect run twice in development?', null, 'Mid', 2, 33),
    q('q18', 'React', 'How would you share state between distant components without prop drilling?', 'Lift it only as far as needed; use Context for low-frequency values (theme, user), and a store (Zustand, Redux, signals) for frequently-changing shared state to avoid re-rendering whole subtrees.', 'Mid', 3, 27),
    q('q19', 'React', 'What is the difference between controlled and uncontrolled inputs?', null, 'Junior', 1, 19),
    q('q20', 'Performance', 'What does INP measure and how would you improve it?', null, 'Senior', 4, 22),
    q('q21', 'Accessibility', 'How do you build an accessible modal dialog?', 'Move focus into the dialog, trap it while open, restore it on close, label it with aria-labelledby, close on Escape and make the background inert.', 'Mid', 3, 31),
    q('q22', 'Browser & Web APIs', 'localStorage vs sessionStorage vs cookies — when do you use each?', null, 'Junior', 2, 14),
    q('q23', 'Node.js', 'How do streams help when processing large files?', 'They process data in chunks instead of loading it all into memory, with backpressure so a slow consumer doesn’t get flooded.', 'Mid', 3, 12),
    q('q24', 'Security', 'How do you prevent XSS in a React app?', null, 'Mid', 3, 18),
    q('q25', 'React', 'When should you split a component into smaller ones?', 'When parts change for different reasons, re-render at different rates, or are reused. Not just to make files shorter.', 'Mid', 2, 4, { pending: true, author: 'anna.k' }),
    q('q26', 'Angular', 'What do signals change about change detection in Angular?', null, 'Mid', 3, 9, { pending: true, author: 'tomasz.w' })
  ];

  const profile = { first: 'Jan', last: 'Kowalski', name: 'Jan Kowalski', email: 'jan.kowalski@example.com', phone: '+48 600 123 456', location: 'Warsaw, Poland', role: 'Frontend Developer', years: 5, skills: ['React', 'TypeScript', 'Next.js', 'CSS', 'Testing Library', 'Figma'], linkedin: 'linkedin.com/in/jankowalski', github: 'github.com/jkowalski', website: 'jankowalski.dev', bio: 'Frontend developer focused on design systems and accessible, fast interfaces.' };

  const cv = {
    summary: 'Frontend developer with 5 years of experience building React and TypeScript products. I lead design-system work, care about accessibility and performance, and like turning fuzzy product ideas into shipped features.',
    experience: [
      { id: 'e1', role: 'Frontend Developer', company: 'Brightloop', start: '2023', end: '', current: true, place: 'Warsaw', tech: 'React, TypeScript, Storybook, Vite, Playwright', desc: 'Lead developer of the company design system used by 4 product teams. Cut bundle size by 38% and raised Lighthouse accessibility to 100.' },
      { id: 'e2', role: 'Junior Frontend Developer', company: 'Pixelforge', start: '2021', end: '2023', current: false, place: 'Remote', tech: 'React, D3, Redux, Jest, Playwright', desc: 'Built dashboards in React and D3 for logistics clients. Introduced Playwright end-to-end tests.' }
    ],
    education: [{ id: 'ed1', school: 'Warsaw University of Technology', degree: 'BSc, Computer Science', start: '2017', end: '2021' }],
    projects: [
      { id: 'p1', name: 'Tokenflow', link: 'github.com/jkowalski/tokenflow', tech: 'TypeScript, Style Dictionary', desc: 'Open-source design-token pipeline — 1.2k GitHub stars, used by 30+ teams.' },
      { id: 'p2', name: 'a11y-lint-react', link: 'npmjs.com/a11y-lint-react', tech: 'ESLint, React', desc: 'Lint rules that catch inaccessible component patterns before review.' }
    ],
    certifications: [
      { id: 'c1', name: 'Web Accessibility Specialist (WAS)', issuer: 'IAAP', year: '2024' },
      { id: 'c2', name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon', year: '2023' }
    ],
    skills: [{ id: 's1', text: 'React', level: 'Expert' }, { id: 's2', text: 'TypeScript', level: 'Advanced' }, { id: 's3', text: 'CSS / design systems', level: 'Expert' }, { id: 's4', text: 'Node.js', level: 'Intermediate' }, { id: 's5', text: 'Testing (Jest, Playwright)', level: 'Advanced' }],
    languages: [{ id: 'l1', text: 'Polish', level: 'Native' }, { id: 'l2', text: 'English', level: 'C1' }, { id: 'l3', text: 'German', level: 'A2' }]
  };

  const activity = [];
  (() => { let s = 7; const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280; for (let i = 0; i < 140; i++) { const dt = new Date(TODAY); dt.setDate(dt.getDate() - i); const wd = dt.getDay(); const base = i < 40 ? 0.62 : 0.3; const v = wd === 0 || wd === 6 ? (rnd() < 0.15 ? 1 : 0) : rnd() < base ? 1 + Math.floor(rnd() * 3) : 0; if (v) activity.push({ date: dt.toISOString().slice(0, 10), value: v }); } })();

  const matchFor = (o) => ({
    score: o.match ?? 74,
    headline: (o.match ?? 74) >= 80 ? 'Strong fit — lead with your design-system work' : 'Good fit with a couple of gaps to address',
    summary: `Your CV covers most of what ${o.company} asks for in a ${o.name}. React and TypeScript depth is clear; testing and mentoring are present but thin.`,
    sections: [
      { title: 'Strengths', icon: 'circle-check', tone: 'success', items: ['5 years of React with measurable outcomes', 'Design-system leadership across 4 teams', 'Accessibility work with concrete results'] },
      { title: 'Gaps', icon: 'triangle-alert', tone: 'warning', items: ['No GraphQL mentioned', 'Mentoring is implied, not stated'] },
      { title: 'Do next', icon: 'sparkles', tone: 'brand', items: ['Add one line about mentoring juniors at Brightloop', 'Mention Playwright in the summary', 'Move the bundle-size result to the first bullet'] }
    ]
  });
  const atsFor = (o) => ({
    score: 78,
    verdict: 'Readable by most ATS — keywords need work',
    summary: `Structure and formatting parse cleanly. Three keywords from the ${o.company} posting are missing or only implied.`,
    categories: [{ label: 'Keywords', score: 64, weight: 3 }, { label: 'Formatting', score: 92, weight: 2 }, { label: 'Structure', score: 88, weight: 2 }, { label: 'Length', score: 80, weight: 1 }, { label: 'Language', score: 74, weight: 1 }],
    keywords: { matched: ['React', 'TypeScript', 'Design system', 'Accessibility', 'Jest'], partial: ['Playwright', 'Mentoring'], missing: ['GraphQL', 'Code review'] },
    recommendations: [
      { severity: 'critical', title: 'Add “GraphQL” if you have used it', message: 'It appears 3 times in the posting and never in your CV.' },
      { severity: 'warning', title: 'State mentoring explicitly', message: 'The posting asks for mentoring two engineers.', evidence: { quote: 'Review code and mentor two mid-level engineers', source: 'Job posting' } },
      { severity: 'suggestion', title: 'Use a plain section title for skills', message: '“What I’m good at” may not be recognised — use “Skills”.' }
    ]
  });
  const letter = (o, tone) => {
    const open = { Formal: 'Dear Hiring Team,', Friendly: `Hi ${o.company} team,`, Creative: `Four product teams, one component library, zero arguments about button padding.`, Concise: `Hello,` }[tone];
    const close = { Formal: 'Yours sincerely,', Friendly: 'Looking forward to talking,', Creative: 'Let’s build something people enjoy using,', Concise: 'Best,' }[tone];
    const body = tone === 'Creative'
      ? `That’s what the design system I lead at Brightloop delivers — and it’s the kind of work your ${o.name} role describes.\n\nIn two years we cut bundle size by 38%, took Lighthouse accessibility to 100 and turned Playwright tests into the gate every release passes. I like systems that make other engineers faster and products feel consistent.\n\nI’d love to bring that to ${o.company} — and hear what you’d want the component library to do next.`
      : tone === 'Concise'
      ? `I'm applying for the ${o.name} role. I have 5 years of React and TypeScript experience and currently lead the design system at Brightloop, where I cut bundle size by 38% and brought accessibility scores to 100.\n\nI'd bring the same focus on quality and shared components to ${o.company}.`
      : `I'm writing to apply for the ${o.name} position at ${o.company}. For the last five years I have built React and TypeScript products, and for the last two I have led the design system at Brightloop, used by four product teams.\n\nThat work taught me to balance consistency with team autonomy: we cut bundle size by 38%, raised Lighthouse accessibility to 100 and introduced Playwright tests that now gate every release.\n\nYour posting mentions a shared component library and mentoring. Both are what I enjoy most, and I'd love to bring that experience to ${o.company}.`;
    return `${open}\n\n${body}\n\n${close}\nJan Kowalski`;
  };

  window.RecronData = { TODAY, STATUS, STATUS_ORDER, STAGES, INTERVIEW, REASONS, roles, tags, catTree, offers, interviews, questions, categories, profile, cv, activity, sources: ['LinkedIn', 'JustJoin.it', 'NoFluffJobs', 'Pracuj.pl', 'Referral', 'Email', 'Company site', 'Other'], workModes: ['Remote', 'Hybrid', 'On-site'] };
  // Lets a child view (RecronCv.dc.html etc.) render on its own: static data, navigation hands off to the full app.
  window.RecronStandalone = (cmp) => {
    const st = cmp.__sa || (cmp.__sa = { offers: offers, interviews: interviews });
    const open = (route, extra) => { try { localStorage.setItem('recron-proto', JSON.stringify({ route, ...(extra || {}) })); } catch (e) {} location.href = './Recron.dc.html'; };
    const noop = () => {};
    return { D: window.RecronData, U: window.RecronUtil, NS: window.VelvetUIDesignSystem_ee2bd8 || {}, newUser: false, route: 'standalone', offers: st.offers, interviews: st.interviews, offerId: 'o1', offerTab: cmp.__tab || 'overview', prepTab: cmp.__prep || 'bank', addOpen: false, checklistDone: {}, checklistDismissed: false,
      go: (r) => open(r), openOffer: (id, tab) => open('offer', { offerId: id, offerTab: tab || 'overview' }),
      setOfferTab: (t) => { cmp.__tab = t; cmp.forceUpdate(); }, setPrepTab: (t) => { cmp.__prep = t; cmp.forceUpdate(); },
      updateOffer: (id, p) => { st.offers = st.offers.map((o) => (o.id === id ? { ...o, ...p } : o)); cmp.forceUpdate(); },
      setOffers: (n) => { st.offers = n; cmp.forceUpdate(); }, addOffer: noop, removeOffer: noop,
      addInterview: (i) => { st.interviews = [...st.interviews, { ...i, id: 'i' + Date.now() }]; cmp.forceUpdate(); }, removeInterview: (id) => { st.interviews = st.interviews.filter((x) => x.id !== id); cmp.forceUpdate(); },
      updateInterview: (id, p) => { st.interviews = st.interviews.map((x) => (x.id === id ? { ...x, ...p } : x)); cmp.forceUpdate(); },
      roleId: st.roleId || 'frontend', setRole: (id) => { st.roleId = id; cmp.forceUpdate(); }, tags: st.tags || tags, setTags: (n) => { st.tags = n; cmp.forceUpdate(); },
      decide: (id, status) => { st.offers = st.offers.map((o) => (o.id === id ? { ...o, status } : o)); cmp.forceUpdate(); }, decision: null, closeDecision: noop,
      openAdd: () => open('pipeline'), closeAdd: noop, markDone: noop, dismissChecklist: noop, finishOnboarding: () => open('today'), toast: (t) => console.info('[toast]', t) };
  };
  const tagColor = (list, name) => { const x = (list || tags).find((t) => t.name === name); return x ? x.color : 'var(--fg-tertiary)'; };
  window.RecronUtil = { tagColor, salary, monthly, fmtDate, fmtTime, relDay, daysAgo, matchFor, atsFor, letter, fmtNum };
})();

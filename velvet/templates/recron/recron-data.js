// Recron demo data + small domain helpers. Shapes mirror recron-web/src/models (Offer, Interview, Question, PortfolioData, UserProfile).
(() => {
  const TODAY = new Date(2026, 9, 6, 9, 30);
  const STATUS = {
    new: { label: 'New', tone: 'info', color: 'var(--dv-4)' },
    considering: { label: 'Considering', tone: 'warning', color: 'var(--dv-3)' },
    applied: { label: 'Applied', tone: 'brand', color: 'var(--dv-1)' },
    offer: { label: 'Offer', tone: 'success', color: 'var(--dv-2)' },
    accepted: { label: 'Accepted', tone: 'success', color: 'var(--dv-6)' },
    rejected: { label: 'Rejected', tone: 'neutral', color: 'var(--dv-8)' }
  };
  // 6 statuses, but only 5 are always visible: 'accepted' is terminal and shows up (board column, filter chip) only once an offer reaches it.
  const STATUS_ORDER = ['new', 'considering', 'applied', 'offer', 'accepted', 'rejected'];
  const STATUS_CORE = ['new', 'considering', 'applied', 'offer', 'rejected'];
  const ACTIVE = ['new', 'considering', 'applied', 'offer'];
  const CONTRACTS = { uop: { label: 'Employment (UoP)', short: 'UoP', form: 'uop' }, b2b: { label: 'B2B contract', short: 'B2B', form: 'ryczalt' }, either: { label: 'UoP or B2B', short: 'UoP / B2B', form: 'uop' }, mandate: { label: 'Mandate (UZ)', short: 'UZ', form: 'uop' } };
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
    { id: 'o1', name: 'Senior Frontend Developer', company: 'Acme Software', city: 'Warsaw', status: 'applied', workMode: 'Remote', salaryMin: 18000, salaryMax: 24000, currency: 'PLN', period: 'month', source: 'LinkedIn', match: 82, tags: ['React', 'TypeScript'], added: '2026-09-22', aiParsed: true, reasons: ['Good salary', 'Fully remote'], link: 'https://example.com/acme', contractType: 'either', terms: { notice: '1 month', holidays: '26 days (UoP)', equipment: 'Laptop of choice' }, sent: [{ id: 's1', kind: 'cv', ref: 'cv-ds', at: '2026-09-22' }, { id: 's2', kind: 'letter', label: 'Cover letter · Formal', at: '2026-09-22' }] },
    { id: 'o2', name: 'React Engineer', company: 'Globex', city: 'Kraków', status: 'applied', workMode: 'Hybrid', salaryMin: 16000, salaryMax: 21000, currency: 'PLN', period: 'month', source: 'JustJoin.it', intermediary: 'Hays IT', match: 71, tags: ['React'], added: '2026-09-25', aiParsed: true, reasons: ['Interesting product', 'Hybrid in Kraków'], link: 'https://example.com/globex', contractType: 'b2b', sent: [{ id: 's3', kind: 'cv', ref: 'cv-main', at: '2026-09-25' }] },
    { id: 'o3', name: 'Frontend Engineer, Design Systems', company: 'Initech', city: 'Gdańsk', status: 'applied', workMode: 'Hybrid', salaryMin: 17000, salaryMax: 22000, currency: 'PLN', period: 'month', source: 'Referral', match: 88, tags: ['Design systems', 'React', 'Dream job'], added: '2026-09-18', reasons: ['Design-system role', 'Strong team'], link: 'https://example.com/initech', contractType: 'uop', terms: { notice: '3 months', holidays: '26 days', benefits: ['Medical care', 'Relocation package'] }, sent: [{ id: 's4', kind: 'cv', ref: 'cv-ds', at: '2026-09-18' }, { id: 's5', kind: 'link', label: 'Public CV link · tracked', at: '2026-09-18' }] },
    { id: 'o4', name: 'UI Engineer', company: 'Umbrella Health', city: 'Wrocław', status: 'considering', workMode: 'On-site', salaryMin: 14000, salaryMax: 18000, currency: 'PLN', period: 'month', source: 'Pracuj.pl', match: null, tags: ['Vue'], added: '2026-09-24', aiParsed: true, link: 'https://example.com/umbrella', contractType: 'uop', applyBy: '2026-10-10' },
    { id: 'o5', name: 'Fullstack Developer (Node + React)', company: 'Hooli', city: 'Remote', status: 'applied', workMode: 'Remote', salaryMin: 20000, salaryMax: 26000, currency: 'PLN', period: 'month', source: 'LinkedIn', match: 64, tags: ['Node', 'React'], added: '2026-09-20', link: 'https://example.com/hooli', contractType: 'b2b', sent: [{ id: 's6', kind: 'cv', ref: 'cv-main', at: '2026-09-20' }] },
    { id: 'o6', name: 'Frontend Developer', company: 'Stark Fintech', city: 'Warsaw', status: 'considering', workMode: 'Hybrid', salaryMin: 15000, salaryMax: 19000, currency: 'PLN', period: 'month', source: 'Company site', intermediary: 'Michael Page', match: 76, tags: ['Angular', 'Follow up'], added: '2026-09-27', link: 'https://example.com/stark', contractType: 'uop', applyBy: '2026-10-12' },
    { id: 'o7', name: 'Senior React Developer', company: 'Wayne Logistics', city: 'Poznań', status: 'new', workMode: 'Remote', salaryMin: 60000, salaryMax: 75000, currency: 'EUR', period: 'year', source: 'Email', intermediary: 'Talent Hunters', match: null, tags: ['React'], added: '2026-10-05', link: 'https://example.com/wayne' },
    { id: 'o8', name: 'TypeScript Developer', company: 'Soylent', city: 'Remote', status: 'new', workMode: 'Remote', salaryMin: 140, salaryMax: 170, currency: 'PLN', period: 'hour', source: 'JustJoin.it', match: null, tags: ['TypeScript'], added: '2026-10-04', link: 'https://example.com/soylent' },
    { id: 'o9', name: 'Frontend Developer', company: 'Cyberdyne', city: 'Łódź', status: 'rejected', workMode: 'On-site', salaryMin: 12000, salaryMax: 15000, currency: 'PLN', period: 'month', source: 'NoFluffJobs', match: 58, tags: [], added: '2026-09-08', decidedBy: 'them', reasons: ['Failed technical', 'Wanted more backend'], link: 'https://example.com/cyberdyne' },
    { id: 'o12', name: 'Frontend Platform Engineer', company: 'Pied Piper', city: 'Warsaw', status: 'offer', workMode: 'Hybrid', salaryMin: 25000, salaryMax: 26000, currency: 'PLN', period: 'month', source: 'Referral', match: 84, tags: ['React', 'Design systems'], added: '2026-09-10', reasons: ['Above expectations', 'Strong team'], link: 'https://example.com/piedpiper', contractType: 'b2b', responseBy: '2026-10-09', terms: { asked: 28000, start: '2026-11-03', notice: '1 month', holidays: '24 paid days off', equipment: 'MacBook Pro + 3,000 zł home office', benefits: ['Medical care', 'Multisport', 'Learning budget 4,000 zł / yr'] }, sent: [{ id: 's7', kind: 'cv', ref: 'cv-ds', at: '2026-09-10' }, { id: 's8', kind: 'portfolio', label: 'Portfolio · jankowalski.dev', at: '2026-09-10' }] },
    { id: 'o11', name: 'Frontend Engineer', company: 'Massive Dynamic', city: 'Warsaw', status: 'applied', workMode: 'Hybrid', salaryMin: 19000, salaryMax: 23000, currency: 'PLN', period: 'month', source: 'LinkedIn', match: 69, tags: ['React', 'Follow up'], added: '2026-09-12', reasons: ['Good salary'], link: 'https://example.com/massive' },
    { id: 'o10', name: 'JavaScript Developer', company: 'Vandelay Industries', city: 'Remote', status: 'rejected', workMode: 'Remote', salaryMin: 13000, salaryMax: 16000, currency: 'PLN', period: 'month', source: 'LinkedIn', match: null, tags: [], added: '2026-09-02', decidedBy: 'me', reasons: ['Salary too low', 'On-site 5 days'], link: 'https://example.com/vandelay' }
  ].map((o) => ({ reasons: [], intermediary: '', aiParsed: false, decidedBy: null, contractType: o.period === 'hour' ? 'b2b' : 'uop', terms: {}, sent: [], responseBy: null, applyBy: null, ...o, description: md(o.name, o.company, o.tags.length ? o.tags : ['React']) }));

  const interviews = [
    { id: 'i1', offerId: 'o1', stage: 'Screening', status: 'done', outcomeNote: 'Moved to technical the same day.', at: '2026-09-30T11:00', duration: 30, location: 'Phone', notes: 'Recruiter: Kasia. Asked about notice period and salary range.', interviewers: ['Kasia Zielińska'], asked: ['What notice period do you have?', 'What are your salary expectations?'], rating: 4 },
    { id: 'i2', offerId: 'o1', stage: 'Technical', status: 'scheduled', at: '2026-10-07T10:00', duration: 60, location: 'Google Meet', notes: 'Live coding in React. Review hooks and performance.' },
    { id: 'i3', offerId: 'o3', stage: 'Screening', status: 'done', at: '2026-09-26T09:30', duration: 30, location: 'Phone', notes: '' },
    { id: 'i4', offerId: 'o3', stage: 'Technical', status: 'done', at: '2026-10-02T13:00', duration: 90, location: 'Teams', notes: 'Went well — design-token architecture question.', interviewers: ['Marta Nowak', 'Adam Wiśniewski'], asked: ['How would you version design tokens across three apps?', 'Walk us through a component API you regret'], rating: 4 },
    { id: 'i5', offerId: 'o3', stage: 'HR', status: 'scheduled', at: '2026-10-08T14:30', duration: 45, location: 'Initech office, Gdańsk', notes: '' },
    { id: 'i6', offerId: 'o2', stage: 'Screening', status: 'scheduled', at: '2026-10-09T09:00', duration: 30, location: 'Phone', notes: '' },
    { id: 'i8', offerId: 'o6', stage: 'Screening', status: 'scheduled', at: '2026-10-05T15:00', duration: 30, location: 'Phone', notes: 'Recruiter call via Michael Page.' },
    { id: 'i9', offerId: 'o9', stage: 'Screening', status: 'done', at: '2026-09-12T10:00', duration: 30, location: 'Phone', notes: '' },
    { id: 'i10', offerId: 'o9', stage: 'Technical', status: 'failed', at: '2026-09-17T12:00', duration: 90, location: 'Teams', notes: '', outcomeNote: 'Struggled with the Node.js part.' },
    { id: 'i11', offerId: 'o5', stage: 'Screening', status: 'cancelled', at: '2026-09-29T16:00', duration: 30, location: 'Zoom', notes: '', outcomeNote: 'Rescheduled by the recruiter.' },
    { id: 'i12', offerId: 'o12', stage: 'Screening', status: 'done', at: '2026-09-15T10:00', duration: 30, location: 'Phone', notes: '' },
    { id: 'i13', offerId: 'o12', stage: 'Technical', status: 'done', at: '2026-09-22T13:00', duration: 90, location: 'Google Meet', notes: 'Pairing on a Storybook addon.', interviewers: ['Tomasz Bielski'], asked: ['How do you keep a component library from becoming a bottleneck?'], rating: 5 },
    { id: 'i14', offerId: 'o12', stage: 'HR', status: 'done', at: '2026-09-29T11:00', duration: 45, location: 'Pied Piper office, Warsaw', notes: '' },
    { id: 'i15', offerId: 'o12', stage: 'Offer', status: 'done', at: '2026-10-03T16:00', duration: 30, location: 'Phone', notes: '', outcomeNote: '25–26k B2B, answer by 9 Oct.' },
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
    offer: ['Above expectations', 'Matches my ask', 'Below my ask', 'Strong team', 'Good benefits', 'Fast decision needed'],
    rejected: { me: ['Salary too low', 'Wrong tech stack', 'On-site 5 days', 'Company culture', 'Long process', 'Accepted another offer', 'Withdrew'], them: ['No reply', 'Failed screening', 'Failed technical', 'Wanted more backend', 'Too junior', 'Position closed'] }
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

  // ── Plans & AI credits. 1 credit ≈ one standard AI action; heavier ones cost more. Every tool also has free tries.
  const AI_COSTS = { parse: { label: 'Read offer from link', cost: 0, icon: 'link' }, match: { label: 'CV match', cost: 1, icon: 'target' }, letter: { label: 'Cover letter', cost: 1, icon: 'file-text' }, ats: { label: 'ATS check', cost: 2, icon: 'shield-check' }, answer: { label: 'AI answer', cost: 1, icon: 'message-square' }, negotiate: { label: 'Negotiation plan', cost: 2, icon: 'trending-up' }, followup: { label: 'Follow-up draft', cost: 1, icon: 'mail' } };
  const FREE_TRIES = 3;
  const plan = { id: 'free', credits: 6, monthly: 10, renews: '2026-11-01', trials: { match: 1, letter: 2, ats: 0, answer: 3, negotiate: 3, followup: 2 },
    usage: [{ feature: 'match', n: 5 }, { feature: 'letter', n: 2 }, { feature: 'ats', n: 3 }, { feature: 'answer', n: 1 }, { feature: 'parse', n: 9 }],
    history: [{ label: 'Jun', value: 8 }, { label: 'Jul', value: 10 }, { label: 'Aug', value: 10 }, { label: 'Sep', value: 10 }, { label: 'Oct', value: 4 }] };
  const PLANS = [
    { id: 'free', name: 'Free', price: '0 zł', period: '', blurb: 'Everything you need to run a search.', features: ['Unlimited offers & interviews', 'Question bank & flashcards', 'CV builder · 1 template', 'B2B vs UoP calculator', '10 AI credits / month', '3 free tries of every AI tool'], cta: 'Current plan' },
    { id: 'pro', name: 'Pro', price: { monthly: '29 zł', yearly: '290 zł' }, note: { monthly: 'cancel anytime', yearly: '≈ 24 zł / month' }, blurb: 'For an active search — weeks, not months.', includes: 'Everything in Free, plus', features: ['300 AI credits / month', 'All CV templates', 'Public CV link with view stats', 'Salary benchmarks & negotiation plans', 'Follow-up drafts & reminders', 'Full search insights'], featured: true, cta: 'Upgrade to Pro' },
    { id: 'sprint', name: 'Sprint pass', price: '59 zł', period: { monthly: '/ 30 days', yearly: '/ 30 days' }, note: 'one-off · no renewal', blurb: 'Pro for one focused month.', includes: 'Everything in Pro', features: ['No subscription', 'Extends if you buy again'], cta: 'Buy 30 days' }
  ];
  const PACKS = [{ id: 'p50', credits: 50, price: '19 zł' }, { id: 'p150', credits: 150, price: '49 zł', best: true }, { id: 'p400', credits: 400, price: '99 zł' }];

  // ── Search insights (last 90 days)
  const insights = {
    funnel: [{ label: 'Saved', value: 46 }, { label: 'Applied', value: 31 }, { label: 'Got a reply', value: 14 }, { label: 'Interviewed', value: 9 }, { label: 'Offer', value: 2 }],
    sources: [{ label: 'Referral', applied: 3, replied: 3 }, { label: 'LinkedIn', applied: 12, replied: 4 }, { label: 'JustJoin.it', applied: 8, replied: 3 }, { label: 'NoFluffJobs', applied: 4, replied: 2 }, { label: 'Pracuj.pl', applied: 2, replied: 1 }, { label: 'Agency', applied: 2, replied: 1 }],
    replyDays: [9, 7, 8, 6, 5, 6, 4, 5], replyAvg: 5.2,
    reasonsThem: [{ label: 'No reply', n: 9 }, { label: 'Failed technical', n: 2 }, { label: 'Wanted more backend', n: 2 }, { label: 'Position closed', n: 1 }],
    reasonsMe: [{ label: 'Salary too low', n: 4 }, { label: 'On-site 5 days', n: 3 }, { label: 'Long process', n: 1 }],
    stagePass: [{ label: 'Screening', pass: 86 }, { label: 'Technical', pass: 57 }, { label: 'HR', pass: 100 }]
  };

  // ── Follow-ups
  const followUps = [
    { id: 'f1', type: 'thanks', offerId: 'o3', title: 'Thank Initech for the technical interview', why: 'Technical on 2 Oct · nothing sent yet', due: '2026-10-03', contact: 'Marta Nowak', email: 'marta.nowak@initech.example' },
    { id: 'f2', type: 'nudge', offerId: 'o11', title: 'Nudge Massive Dynamic', why: 'Applied 24 days ago · no reply', due: '2026-10-06', contact: 'Recruitment team', email: 'jobs@massive.example' },
    { id: 'f3', type: 'checkin', offerId: 'o6', title: 'Ask Michael Page about next steps', why: 'Screening on 5 Oct · no news since', due: '2026-10-07', contact: 'Piotr Lis (Michael Page)', email: 'piotr.lis@michaelpage.example' },
    { id: 'f4', type: 'nudge', offerId: 'o2', title: 'Confirm Thursday’s screening with Hays', why: 'Screening 9 Oct · not confirmed', due: '2026-10-08', contact: 'Ola Wrona (Hays IT)', email: 'ola.wrona@hays.example' }
  ];
  const FU_TYPES = { thanks: { label: 'Thank-you', icon: 'heart', tone: 'success' }, nudge: { label: 'Follow-up', icon: 'mail', tone: 'brand' }, checkin: { label: 'Check-in', icon: 'message-square', tone: 'info' } };
  const fuDraft = (f, o, tone) => {
    const hi = tone === 'Friendly' ? 'Hi ' + f.contact.split(' ')[0] + ',' : 'Dear ' + f.contact.split(' (')[0] + ',';
    const bye = tone === 'Friendly' ? 'Thanks,\nJan' : 'Kind regards,\nJan Kowalski';
    const body = {
      thanks: `Thank you for the technical interview for the ${o.name} role. I enjoyed the design-token architecture discussion — it’s exactly the kind of problem I like working on.\n\nIf anything from our conversation needs a follow-up, I’m happy to send it over.`,
      nudge: `I applied for the ${o.name} role at ${o.company} on ${fmtDate(o.added, { day: 'numeric', month: 'long' })} and wanted to check whether my application is still being considered.\n\nI’m still very interested — the role matches my React and design-system experience closely.`,
      checkin: `Thanks again for the screening call about the ${o.name} role at ${o.company}. Could you share what the next steps look like and a rough timeline?`
    }[f.type];
    const subj = { thanks: 'Thank you — ' + o.name + ' interview', nudge: 'Application: ' + o.name, checkin: 'Next steps — ' + o.name }[f.type];
    return { subject: subj, body: hi + '\n\n' + body + '\n\n' + bye };
  };

  // ── Polish net-pay calculator (2026 rates, simplified: no PPK, no joint filing, no reliefs beyond the listed ones)
  const TAX = { zusFull: 1927, zusPref: 456, zusCap: 282600, healthMinLin: 432.54, healthRycz: [[60000, 498.35], [300000, 830.58], [Infinity, 1495.04]], linHealthDeductCap: 12900 };
  const progressive = (base) => (base <= 30000 ? 0 : base <= 120000 ? base * 0.12 - 3600 : 10800 + (base - 120000) * 0.32);
  const netPay = (monthlyAmount, form, opt) => {
    opt = opt || {}; const A = monthlyAmount * 12; const costs = (opt.costs || 0) * 12;
    if (form === 'uop') { const zus = Math.min(A, TAX.zusCap) * 0.1126 + A * 0.0245; const health = (A - zus) * 0.09; const kup = 3000 + Math.min(120000, (A - zus) * (opt.creative || 0) * 0.5); const ppkE = opt.ppk ? A * 0.015 : 0; const base = Math.max(0, A - zus - kup + ppkE); const tax = Math.max(0, progressive(base)); const ppk = opt.ppk ? A * 0.02 : 0; return { net: (A - zus - health - tax - ppk) / 12, zus: zus / 12, health: health / 12, tax: tax / 12, costs: 0, ppk: ppk / 12, saved: opt.ppk ? A * 0.035 / 12 : 0 }; }
    const daysOff = opt.daysOff || 0; const R = A * (1 - daysOff / 252);
    const social = (opt.zus === 'start' ? 0 : opt.zus === 'pref' ? TAX.zusPref : TAX.zusFull) * 12;
    let health, tax;
    if (form === 'ryczalt') { health = (TAX.healthRycz.find(([lim]) => R <= lim)[1]) * 12; tax = Math.max(0, (R - social - health / 2) * 0.12); }
    else if (form === 'liniowy') { const inc = R - costs - social; health = Math.max(TAX.healthMinLin * 12, inc * 0.049); tax = Math.max(0, (inc - Math.min(health, TAX.linHealthDeductCap)) * 0.19); }
    else { const inc = R - costs - social; health = Math.max(TAX.healthMinLin * 12, inc * 0.09); tax = Math.max(0, progressive(inc)); }
    const c = form === 'ryczalt' ? costs : costs; return { net: (R - social - health - tax - c) / 12, zus: social / 12, health: health / 12, tax: tax / 12, costs: c / 12, lost: (A - R) / 12 };
  };
  const FORMS = [{ id: 'uop', label: 'Employment (UoP)', short: 'UoP' }, { id: 'ryczalt', label: 'B2B · lump-sum 12%', short: 'B2B ryczałt' }, { id: 'liniowy', label: 'B2B · flat 19%', short: 'B2B liniowy' }, { id: 'skala', label: 'B2B · tax scale', short: 'B2B skala' }];

  // ── Salary expectations — one source of truth, set once on the Salary screen, reused by every offer.
  // unit: what the amount means — 'net' take-home, 'uop' gross on UoP, or a B2B form id (invoice, net of VAT).
  const expectations = { unit: 'net', target: 15000, floor: 13000, zus: 'full', costs: 300, paidDaysB2B: 0, sickDays: 8, creative: 0, ppk: false };
  const HOLIDAYS = 26, WORKDAYS = 252, HOURS = 168;
  // ── Salary benchmark (monthly, PLN) — community-reported offers, Q3 2026
  const bench = { sample: 1240, period: 'Jul–Sep 2026', uop: { p10: 13500, p25: 16500, p50: 19500, p75: 23000, p90: 27000 }, b2b: { p10: 17000, p25: 20500, p50: 24000, p75: 28500, p90: 33000 }, trend: '+4% vs Q2' };

  // ── Public CV link
  const cvShare = { slug: 'jan-kowalski', url: 'recron.app/cv/jan-kowalski', views: [3, 5, 2, 8, 6, 4, 1, 2, 9, 12, 7, 5, 3, 6], unique: 31, downloads: 9, avgTime: '1 min 48 s',
    tracked: [{ id: 'l1', offerId: 'o1', label: 'Acme Software', url: 'recron.app/cv/jan-kowalski?r=acme', views: 7, last: '2026-10-05' }, { id: 'l2', offerId: 'o3', label: 'Initech', url: 'recron.app/cv/jan-kowalski?r=initech', views: 11, last: '2026-10-06' }, { id: 'l3', offerId: 'o2', label: 'Globex', url: 'recron.app/cv/jan-kowalski?r=globex', views: 0, last: null }],
    recent: [{ id: 'v1', who: 'Initech', where: 'Gdańsk', via: 'Tracked link', at: '2026-10-06T08:12', dur: '3 min 05 s', dl: true }, { id: 'v2', who: 'Acme Software', where: 'Warsaw', via: 'Tracked link', at: '2026-10-05T16:40', dur: '1 min 12 s', dl: false }, { id: 'v3', who: 'Unknown visitor', where: 'Kraków', via: 'LinkedIn', at: '2026-10-05T11:02', dur: '0 min 41 s', dl: false }, { id: 'v4', who: 'Initech', where: 'Gdańsk', via: 'Tracked link', at: '2026-10-04T09:30', dur: '2 min 20 s', dl: true }, { id: 'v5', who: 'Unknown visitor', where: 'Berlin', via: 'GitHub', at: '2026-10-03T19:15', dur: '1 min 03 s', dl: false }] };

  // ── Moderation
  const reports = [
    { id: 'r1', kind: 'answer', target: 'q13', excerpt: 'A function that keeps access to variables from its defining scope…', reason: 'Incorrect', note: 'The loop example is wrong for `let` in old Safari.', by: 'piotr.z', at: '2026-10-05T14:10', count: 2 },
    { id: 'r2', kind: 'question', target: 'q12', excerpt: 'Why are you leaving your current role?', reason: 'Duplicate', note: 'Same as “Why do you want to change jobs?”', by: 'kasia.m', at: '2026-10-04T09:02', count: 1 },
    { id: 'r3', kind: 'answer', target: 'q9', excerpt: 'Clients keep a WebSocket/SSE connection to a gateway…', reason: 'Spam / self-promo', note: 'Links to a paid course in the edit history.', by: 'auto-filter', at: '2026-10-06T07:45', count: 4 }
  ];
  const modLog = [{ id: 'm1', action: 'approved', what: 'How do you debug a memory leak in a SPA?', who: 'you', at: '2026-10-05T18:20' }, { id: 'm2', action: 'rejected', what: 'Best IDE?', who: 'you', at: '2026-10-05T18:18', reason: 'Not an interview question' }, { id: 'm3', action: 'edited', what: 'Explain CSS specificity', who: 'ewa.k', at: '2026-10-04T12:00' }];

  // ── People across processes (recruiters, agencies, hiring managers). An agency recruiter often runs several of your processes.
  const contacts = [
    { id: 'c1', name: 'Marta Nowak', role: 'Engineering Manager', org: 'Initech', email: 'marta.nowak@initech.example', offerIds: ['o3'], last: '2026-10-02' },
    { id: 'c2', name: 'Ola Wrona', role: 'IT Recruiter', org: 'Hays IT', agency: true, email: 'ola.wrona@hays.example', phone: '+48 501 220 114', offerIds: ['o2'], last: '2026-09-30' },
    { id: 'c3', name: 'Piotr Lis', role: 'Senior Consultant', org: 'Michael Page', agency: true, email: 'piotr.lis@michaelpage.example', offerIds: ['o6'], last: '2026-10-05' },
    { id: 'c4', name: 'Kasia Zielińska', role: 'Talent Partner', org: 'Acme Software', email: 'kasia.z@acme.example', offerIds: ['o1'], last: '2026-09-30' },
    { id: 'c5', name: 'Tomasz Bielski', role: 'Head of Frontend', org: 'Pied Piper', email: 'tomasz@piedpiper.example', linkedin: 'linkedin.com/in/tbielski', offerIds: ['o12'], last: '2026-10-03' }
  ];
  // ── Where you work now — the baseline every offer is compared against ("is it worth leaving?").
  const current = { id: 'current', company: 'Brightloop', name: 'Frontend Developer', status: 'current', city: 'Warsaw', workMode: 'Hybrid', salaryMin: 17500, salaryMax: 17500, currency: 'PLN', period: 'month', contractType: 'uop', since: '2023-03-01', match: null, tags: [], terms: { notice: '3 months', holidays: '26 days', equipment: 'MacBook Pro', benefits: ['Medical care', 'Multisport'] } };
  const GHOST_DAYS = 21; // no reply this long after applying → suggest closing as "No reply"
  // ── CV versions — every application records which one went out.
  const cvVersions = [{ id: 'cv-main', label: 'Main CV · EN', updated: '2026-10-03' }, { id: 'cv-ds', label: 'Design-systems focus · EN', updated: '2026-09-16' }, { id: 'cv-pl', label: 'CV · PL', updated: '2026-08-28' }];
  const SENT_KINDS = { cv: { label: 'CV', icon: 'file-text' }, letter: { label: 'Cover letter', icon: 'mail' }, portfolio: { label: 'Portfolio', icon: 'globe' }, link: { label: 'CV link', icon: 'link' }, other: { label: 'Other', icon: 'paperclip' } };
  // ── Billing (Polish VAT invoices — many users are B2B and expense the plan)
  const billing = { company: false, nip: '', companyName: '', address: '', email: 'jan.kowalski@example.com', invoices: [{ id: 'FV/2026/09/1182', date: '2026-09-04', item: 'Credit pack · 50', amount: '19,00 zł' }, { id: 'FV/2026/07/0631', date: '2026-07-12', item: 'Sprint pass · 30 days', amount: '59,00 zł' }] };

  window.RecronData = { expectations, HOLIDAYS, WORKDAYS, HOURS, current, GHOST_DAYS, STATUS_CORE, ACTIVE, CONTRACTS, contacts, cvVersions, SENT_KINDS, billing, AI_COSTS, FREE_TRIES, plan, PLANS, PACKS, insights, followUps, FU_TYPES, FORMS, bench, cvShare, reports, modLog, TODAY, STATUS, STATUS_ORDER, STAGES, INTERVIEW, REASONS, roles, tags, catTree, offers, interviews, questions, categories, profile, cv, activity, sources: ['LinkedIn', 'JustJoin.it', 'NoFluffJobs', 'Pracuj.pl', 'Referral', 'Email', 'Company site', 'Other'], workModes: ['Remote', 'Hybrid', 'On-site'] };
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
      decide: (id, status) => { st.offers = st.offers.map((o) => (o.id === id ? { ...o, status } : o)); cmp.forceUpdate(); }, decision: null, closeDecision: noop, expectations: st.expectations || expectations, setExpectations: (p) => { st.expectations = { ...(st.expectations || expectations), ...p }; cmp.forceUpdate(); }, current: st.current || current, setCurrent: (p) => { st.current = { ...(st.current || current), ...p }; cmp.forceUpdate(); }, closeAsGhost: noop, wonDone: {}, markWon: noop, accepting: null, closeAccept: noop, commitAccept: noop, searchClosed: null, reopenSearch: noop, contacts: st.contacts || contacts, setContacts: (n) => { st.contacts = n; cmp.forceUpdate(); }, addQuestions: noop, billing: st.billing || billing, setBilling: (p) => { st.billing = { ...(st.billing || billing), ...p }; cmp.forceUpdate(); },
      openAdd: () => open('pipeline'), closeAdd: noop, markDone: noop, dismissChecklist: noop, finishOnboarding: () => open('today'), toast: (t) => console.info('[toast]', t), plan: st.plan || plan, spend: (f) => { const p = st.plan || plan; const c = AI_COSTS[f] || { cost: 1 }; if ((p.trials[f] || 0) > 0) { st.plan = { ...p, trials: { ...p.trials, [f]: p.trials[f] - 1 } }; return true; } if (p.credits >= c.cost) { st.plan = { ...p, credits: p.credits - c.cost }; return true; } return true; }, upgrade: () => { st.plan = { ...(st.plan || plan), id: 'pro', credits: (st.plan || plan).credits + 300, monthly: 300 }; cmp.forceUpdate(); }, buyPack: (n) => { st.plan = { ...(st.plan || plan), credits: (st.plan || plan).credits + n }; cmp.forceUpdate(); }, cancelPlan: noop, closeLimit: noop, limit: null };
  };
  const tagColor = (list, name) => { const x = (list || tags).find((t) => t.name === name); return x ? x.color : 'var(--fg-tertiary)'; };
  const ics = (i, o) => { const st = new Date(i.at); const en = new Date(st.getTime() + (i.duration || 60) * 6e4); const z = (x) => x.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Recron//EN', 'BEGIN:VEVENT', 'UID:' + i.id + '@recron.app', 'DTSTAMP:' + z(new Date()), 'DTSTART:' + z(st), 'DTEND:' + z(en), 'SUMMARY:' + i.stage + ' interview · ' + o.company, 'LOCATION:' + (i.location || ''), 'DESCRIPTION:' + o.name + (i.notes ? '\\n' + i.notes : ''), 'BEGIN:VALARM', 'TRIGGER:-PT1H', 'ACTION:DISPLAY', 'DESCRIPTION:Interview in 1 hour', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([body], { type: 'text/calendar' })); a.download = (o.company + '-' + i.stage).toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.ics'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 0); };
  const netOf = (o) => { const m = monthly(o); if (m == null) return null; const c = CONTRACTS[o.contractType] || CONTRACTS.uop; const pln = o.currency === 'EUR' ? m * 4.3 : o.currency === 'USD' ? m * 4 : m; return Math.round(netPay(pln, c.form, { zus: 'full' }).net); };
  const daysLeft = (s) => { const a = new Date(TODAY); a.setHours(0, 0, 0, 0); const b = new Date(s); b.setHours(0, 0, 0, 0); return Math.round((b - a) / 864e5); };
  const declineDraft = (o, chosen) => ({ subject: 'Re: ' + o.name + ' — my decision', body: 'Hi,\n\nThank you for your time during the ' + o.name + ' process at ' + o.company + '. I’ve decided to accept another offer' + (chosen ? ' that fits my plans a little better right now' : '') + ', so I’d like to withdraw my application.\n\nI enjoyed meeting the team and would be glad to stay in touch.\n\nBest regards,\nJan Kowalski' });
  // Polish Labour Code: a notice counted in months ends on the last day of the month; in weeks — on a Saturday.
  const noticeEnd = (notice, from) => { const m = /(\d+)\s*(month|week)/i.exec(notice || ''); if (!m) return null; const n = +m[1]; const f = new Date(from || TODAY);
    if (/month/i.test(m[2])) return new Date(f.getFullYear(), f.getMonth() + n + 1, 0);
    const d2 = new Date(f); d2.setDate(d2.getDate() + n * 7); d2.setDate(d2.getDate() + ((6 - d2.getDay() + 7) % 7)); return d2; };
  const resignation = (cur, p) => p.first + ' ' + p.last + '\n' + p.location.split(',')[0] + ', ' + TODAY.toLocaleDateString('pl-PL') + '\n\n' + cur.company + '\n\nWYPOWIEDZENIE UMOWY O PRACĘ\n\nNiniejszym wypowiadam umowę o pracę zawartą w dniu ' + new Date(cur.since).toLocaleDateString('pl-PL') + ' z zachowaniem ' + (cur.terms.notice === '3 months' ? 'trzymiesięcznego' : cur.terms.notice === '1 month' ? 'jednomiesięcznego' : 'ustawowego') + ' okresu wypowiedzenia.\n\nJednocześnie proszę o rozważenie rozwiązania umowy za porozumieniem stron z dniem ……………… .\n\n\n……………………………\n' + p.first + ' ' + p.last;
  // Options for netPay derived from expectations. UoP pays holiday and (80%) sick leave; on B2B every unpaid day is lost revenue.
  const optsOf = (e, form) => form === 'uop' ? { creative: e.creative || 0, ppk: !!e.ppk } : { zus: e.zus, costs: e.costs, daysOff: Math.max(0, HOLIDAYS - (e.paidDaysB2B || 0)) + (e.sickDays || 0) };
  // Inverse of netPay: the gross / invoice you need on `form` to take home `net` a month. Bisection — netPay is monotonic.
  const grossFor = (net, form, e) => { const o = optsOf(e, form); let lo = 0, hi = Math.max(20000, net * 3); for (let k = 0; k < 48; k++) { const m = (lo + hi) / 2; if (netPay(m, form, o).net < net) lo = m; else hi = m; } return Math.ceil(hi / 100) * 100; };
  const netFrom = (amount, unit, e) => (unit === 'net' ? amount : netPay(amount, unit, optsOf(e, unit)).net);
  // Where an offer lands against your expectations, on its own contract type.
  const vsExpect = (o, e) => { const m = monthly(o); if (m == null || !e) return null; const pln = o.currency === 'EUR' ? m * 4.3 : o.currency === 'USD' ? m * 4 : m; const c = CONTRACTS[o.contractType] || CONTRACTS.uop; const net = netPay(pln, c.form, optsOf(e, c.form)).net;
    const tgt = netFrom(e.target, e.unit, e), flo = netFrom(e.floor, e.unit, e); const level = net < flo ? 'below' : net < tgt ? 'within' : 'above';
    return { level, net, need: grossFor(tgt, c.form, e), min: grossFor(flo, c.form, e), form: c.form, label: { below: 'Below your minimum', within: 'Between min and target', above: 'Meets your target' }[level], tone: { below: 'danger', within: 'warning', above: 'success' }[level] }; };
  const MASK = '••••••';
  window.RecronUtil = { discreet: false, optsOf, grossFor, netFrom, vsExpect, noticeEnd, resignation, ics, netOf, daysLeft, declineDraft, netPay, fuDraft, pln: (n) => (window.RecronUtil.discreet ? MASK : fmtNum(Math.round(n))) + ' zł', tagColor, salary: (o) => (window.RecronUtil.discreet && (o.salaryMin != null || o.salaryMax != null) ? MASK + ' ' + (o.currency || 'PLN') : salary(o)), monthly, fmtDate, fmtTime, relDay, daysAgo, matchFor, atsFor, letter, fmtNum };
})();

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
    const per = o.period === 'hour' ? '/h' : '/mo';
    const a = o.salaryMin != null ? fmtNum(o.salaryMin) : '';
    const b = o.salaryMax != null ? fmtNum(o.salaryMax) : '';
    return (a && b ? a + '–' + b : a || b) + ' ' + (o.currency || 'PLN') + per;
  };
  const monthly = (o) => { const v = o.salaryMax ?? o.salaryMin; if (v == null) return null; return o.period === 'hour' ? v * 168 : v; };
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
    { id: 'o1', name: 'Senior Frontend Developer', company: 'Acme Software', city: 'Warsaw', status: 'applied', workMode: 'Remote', salaryMin: 18000, salaryMax: 24000, currency: 'PLN', period: 'month', source: 'LinkedIn', match: 82, tags: ['React', 'TypeScript'], added: '2026-09-22', link: 'https://example.com/acme' },
    { id: 'o2', name: 'React Engineer', company: 'Globex', city: 'Kraków', status: 'applied', workMode: 'Hybrid', salaryMin: 16000, salaryMax: 21000, currency: 'PLN', period: 'month', source: 'JustJoin.it', match: 71, tags: ['React'], added: '2026-09-25', link: 'https://example.com/globex' },
    { id: 'o3', name: 'Frontend Engineer, Design Systems', company: 'Initech', city: 'Gdańsk', status: 'applied', workMode: 'Hybrid', salaryMin: 17000, salaryMax: 22000, currency: 'PLN', period: 'month', source: 'Referral', match: 88, tags: ['Design systems', 'React'], added: '2026-09-18', link: 'https://example.com/initech' },
    { id: 'o4', name: 'UI Engineer', company: 'Umbrella Health', city: 'Wrocław', status: 'considering', workMode: 'On-site', salaryMin: 14000, salaryMax: 18000, currency: 'PLN', period: 'month', source: 'NoFluffJobs', match: null, tags: ['Vue'], added: '2026-09-24', link: 'https://example.com/umbrella' },
    { id: 'o5', name: 'Fullstack Developer (Node + React)', company: 'Hooli', city: 'Remote', status: 'applied', workMode: 'Remote', salaryMin: 20000, salaryMax: 26000, currency: 'PLN', period: 'month', source: 'LinkedIn', match: 64, tags: ['Node', 'React'], added: '2026-09-20', link: 'https://example.com/hooli' },
    { id: 'o6', name: 'Frontend Developer', company: 'Stark Fintech', city: 'Warsaw', status: 'considering', workMode: 'Hybrid', salaryMin: 15000, salaryMax: 19000, currency: 'PLN', period: 'month', source: 'Company site', match: 76, tags: ['Angular'], added: '2026-09-27', link: 'https://example.com/stark' },
    { id: 'o7', name: 'Senior React Developer', company: 'Wayne Logistics', city: 'Poznań', status: 'new', workMode: 'Remote', salaryMin: 22000, salaryMax: 28000, currency: 'PLN', period: 'month', source: 'LinkedIn', match: null, tags: ['React'], added: '2026-10-05', link: 'https://example.com/wayne' },
    { id: 'o8', name: 'TypeScript Developer', company: 'Soylent', city: 'Remote', status: 'new', workMode: 'Remote', salaryMin: 140, salaryMax: 170, currency: 'PLN', period: 'hour', source: 'JustJoin.it', match: null, tags: ['TypeScript'], added: '2026-10-04', link: 'https://example.com/soylent' },
    { id: 'o9', name: 'Frontend Developer', company: 'Cyberdyne', city: 'Łódź', status: 'rejected', workMode: 'On-site', salaryMin: 12000, salaryMax: 15000, currency: 'PLN', period: 'month', source: 'NoFluffJobs', match: 58, tags: [], added: '2026-09-08', link: 'https://example.com/cyberdyne' },
    { id: 'o10', name: 'JavaScript Developer', company: 'Vandelay Industries', city: 'Remote', status: 'rejected', workMode: 'Remote', salaryMin: 13000, salaryMax: 16000, currency: 'PLN', period: 'month', source: 'LinkedIn', match: null, tags: [], added: '2026-09-02', link: 'https://example.com/vandelay' }
  ].map((o) => ({ ...o, description: md(o.name, o.company, o.tags.length ? o.tags : ['React']) }));

  const interviews = [
    { id: 'i1', offerId: 'o1', stage: 'Screening', status: 'done', at: '2026-09-30T11:00', duration: 30, location: 'Phone', notes: 'Recruiter: Kasia. Asked about notice period and salary range.' },
    { id: 'i2', offerId: 'o1', stage: 'Technical', status: 'scheduled', at: '2026-10-07T10:00', duration: 60, location: 'Google Meet', notes: 'Live coding in React. Review hooks and performance.' },
    { id: 'i3', offerId: 'o3', stage: 'Screening', status: 'done', at: '2026-09-26T09:30', duration: 30, location: 'Phone', notes: '' },
    { id: 'i4', offerId: 'o3', stage: 'Technical', status: 'done', at: '2026-10-02T13:00', duration: 90, location: 'Teams', notes: 'Went well — design-token architecture question.' },
    { id: 'i5', offerId: 'o3', stage: 'HR', status: 'scheduled', at: '2026-10-08T14:30', duration: 45, location: 'Initech office, Gdańsk', notes: '' },
    { id: 'i6', offerId: 'o2', stage: 'Screening', status: 'scheduled', at: '2026-10-09T09:00', duration: 30, location: 'Phone', notes: '' },
    { id: 'i7', offerId: 'o5', stage: 'Technical', status: 'scheduled', at: '2026-10-13T11:00', duration: 90, location: 'Zoom', notes: 'System design: real-time notifications.' }
  ];

  const categories = ['JavaScript', 'React', 'TypeScript', 'CSS', 'Testing', 'System design', 'Behavioral'];
  const q = (id, category, question, answer, level, difficulty, votes, extra) => ({ id, category, question, answer, level, difficulty, votes, voted: false, learning: false, mine: false, ...extra });
  const questions = [
    q('q1', 'JavaScript', 'What is the event loop and how do microtasks differ from macrotasks?', 'The event loop takes the next task from the macrotask queue (timers, I/O, UI events). After each task it drains the whole microtask queue (promise callbacks, queueMicrotask, MutationObserver) before rendering. So a resolved promise always runs before a setTimeout(0) queued at the same time.', 'Mid', 3, 142, { learning: true }),
    q('q2', 'React', 'When would you reach for useMemo or useCallback — and when not?', 'Use them when referential identity matters: a memoised child, an effect dependency, or an expensive derivation. Skip them for cheap values — memoisation has its own cost and makes code harder to read.', 'Mid', 3, 118, { voted: true }),
    q('q3', 'React', 'How does React reconcile lists, and why do keys matter?', 'React matches children by key between renders. Stable, unique keys let it move, keep or remove DOM nodes and component state correctly. Index keys break when items are inserted, removed or reordered.', 'Junior', 2, 96),
    q('q4', 'TypeScript', 'Explain the difference between `type` and `interface`.', 'Both describe object shapes. Interfaces can be re-opened (declaration merging) and extended. Types can express unions, intersections, mapped and conditional types. Use interfaces for public object contracts, types for everything else.', 'Junior', 2, 88),
    q('q5', 'TypeScript', 'What are conditional types and `infer`? Give a practical example.', '`T extends U ? X : Y` picks a type based on assignability; `infer` captures a part of the matched type. Example: `type Awaited<T> = T extends Promise<infer R> ? R : T`.', 'Senior', 4, 61, { learning: true }),
    q('q6', 'CSS', 'How does the cascade decide which rule wins?', 'Origin and importance first, then cascade layers, then specificity, then source order. Inline styles beat selectors; !important flips origin order. @layer lets you control priority without specificity hacks.', 'Mid', 2, 74),
    q('q7', 'CSS', 'When would you use container queries over media queries?', 'When a component must adapt to the space it is given rather than the viewport — cards in sidebars vs main columns, widgets in dashboards. Media queries stay right for page-level layout.', 'Mid', 3, 52),
    q('q8', 'Testing', 'What would you test with unit tests vs end-to-end tests in a React app?', 'Unit/component tests: pure logic, hooks, rendering states and interactions of single components. E2E: critical user journeys across pages and the real backend — sign-in, checkout. Keep E2E few and stable.', 'Mid', 3, 47),
    q('q9', 'System design', 'Design a real-time notification system for a web app.', 'Clients keep a WebSocket/SSE connection to a gateway; events come from a queue (Kafka/SQS); a fan-out service resolves recipients; unread state lives in a store with TTL; fall back to polling; batch and rate-limit; deliver push/email for offline users.', 'Senior', 5, 39),
    q('q10', 'System design', 'How would you structure a design system so multiple apps can adopt it?', 'Layered tokens (raw → semantic → component), headless behaviour separated from styles, versioned packages with codemods, documentation with live examples, and adoption metrics.', 'Senior', 4, 33, { mine: true }),
    q('q11', 'Behavioral', 'Tell me about a time you disagreed with a technical decision.', 'Use STAR: the situation, what you proposed and why (data, prototypes), how you listened, the outcome — and what you would repeat. Show you can disagree and commit.', 'Mid', 2, 81),
    q('q12', 'Behavioral', 'Why are you leaving your current role?', 'Stay positive and forward-looking: the scope or growth you want next and how this role offers it. Never criticise your current employer.', 'Junior', 1, 64),
    q('q13', 'JavaScript', 'What is a closure? Show a bug closures commonly cause.', 'A function that keeps access to variables from its defining scope. Classic bug: `var` in a loop with async callbacks — all callbacks see the final value. Fix with `let` or an IIFE.', 'Junior', 2, 77),
    q('q14', 'React', 'What problems do Server Components solve?', 'They render on the server with direct data access, send no JS for static parts, and stream UI. That cuts bundle size and waterfalls; interactive parts stay Client Components.', 'Senior', 4, 45),
    q('q15', 'JavaScript', 'Debounce vs throttle — when do you use each?', 'Debounce waits until calls stop (search-as-you-type, resize end). Throttle runs at most once per interval (scroll handlers, drag).', 'Junior', 2, 58),
    q('q16', 'Testing', 'How do you keep flaky E2E tests under control?', 'Wait on state, not time; isolate test data; mock third parties; retry with reporting; quarantine flaky tests and track them.', 'Mid', 3, 29)
  ];

  const profile = { first: 'Jan', last: 'Kowalski', name: 'Jan Kowalski', email: 'jan.kowalski@example.com', phone: '+48 600 123 456', location: 'Warsaw, Poland', role: 'Frontend Developer', years: 5, skills: ['React', 'TypeScript', 'Next.js', 'CSS', 'Testing Library', 'Figma'], linkedin: 'linkedin.com/in/jankowalski', github: 'github.com/jkowalski', website: 'jankowalski.dev', bio: 'Frontend developer focused on design systems and accessible, fast interfaces.' };

  const cv = {
    summary: 'Frontend developer with 5 years of experience building React and TypeScript products. I lead design-system work, care about accessibility and performance, and like turning fuzzy product ideas into shipped features.',
    experience: [
      { id: 'e1', role: 'Frontend Developer', company: 'Brightloop', start: '2023', end: '', current: true, desc: 'Lead developer of the company design system used by 4 product teams. Cut bundle size by 38% and raised Lighthouse accessibility to 100.' },
      { id: 'e2', role: 'Junior Frontend Developer', company: 'Pixelforge', start: '2021', end: '2023', current: false, desc: 'Built dashboards in React and D3 for logistics clients. Introduced Playwright end-to-end tests.' }
    ],
    education: [{ id: 'ed1', school: 'Warsaw University of Technology', degree: 'BSc, Computer Science', start: '2017', end: '2021' }],
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
    const open = { Formal: 'Dear Hiring Team,', Friendly: `Hi ${o.company} team,`, Concise: `Hello,` }[tone];
    const close = { Formal: 'Yours sincerely,', Friendly: 'Looking forward to talking,', Concise: 'Best,' }[tone];
    const body = tone === 'Concise'
      ? `I'm applying for the ${o.name} role. I have 5 years of React and TypeScript experience and currently lead the design system at Brightloop, where I cut bundle size by 38% and brought accessibility scores to 100.\n\nI'd bring the same focus on quality and shared components to ${o.company}.`
      : `I'm writing to apply for the ${o.name} position at ${o.company}. For the last five years I have built React and TypeScript products, and for the last two I have led the design system at Brightloop, used by four product teams.\n\nThat work taught me to balance consistency with team autonomy: we cut bundle size by 38%, raised Lighthouse accessibility to 100 and introduced Playwright tests that now gate every release.\n\nYour posting mentions a shared component library and mentoring. Both are what I enjoy most, and I'd love to bring that experience to ${o.company}.`;
    return `${open}\n\n${body}\n\n${close}\nJan Kowalski`;
  };

  window.RecronData = { TODAY, STATUS, STATUS_ORDER, STAGES, offers, interviews, questions, categories, profile, cv, activity, sources: ['LinkedIn', 'JustJoin.it', 'NoFluffJobs', 'Referral', 'Company site', 'Other'], workModes: ['Remote', 'Hybrid', 'On-site'] };
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
      openAdd: () => open('pipeline'), closeAdd: noop, markDone: noop, dismissChecklist: noop, finishOnboarding: () => open('today'), toast: (t) => console.info('[toast]', t) };
  };
  window.RecronUtil = { salary, monthly, fmtDate, fmtTime, relDay, daysAgo, matchFor, atsFor, letter, fmtNum };
})();

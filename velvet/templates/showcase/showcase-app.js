(function(){
let Button, Stat, Sparkline, Switch, Slider, ChipGroup, Toast, Calendar, Avatar, AvatarGroup, Progress, ThemeToggle, Input;
const ROOT = '../../';
function useDS() {
  const [ok, setOk] = React.useState(!!window.VelvetUIDesignSystem_ee2bd8);
  React.useEffect(() => {
    if (ok) return;
    const t = setInterval(() => {
      if (window.VelvetUIDesignSystem_ee2bd8) {
        clearInterval(t);
        setOk(true);
      }
    }, 50);
    return () => clearInterval(t);
  }, [ok]);
  if (ok) ({
    Button,
    Stat,
    Sparkline,
    Switch,
    Slider,
    ChipGroup,
    Toast,
    Calendar,
    Avatar,
    AvatarGroup,
    Progress,
    ThemeToggle,
    Input
  } = window.VelvetUIDesignSystem_ee2bd8);
  return ok;
}
class Safe extends React.Component {
  constructor(p) {
    super(p);
    this.state = {
      err: false
    };
  }
  static getDerivedStateFromError() {
    return {
      err: true
    };
  }
  render() {
    return this.state.err ? null : this.props.children;
  }
}
const BLURB = {
  '01 Overview': 'How the system is put together — token layers and composition rules.',
  '02 Brand': 'Wordmark, signet and how they sit on light, dark and brand fills.',
  '03 Color': 'OKLCH ramps, semantic roles and contrast — every pairing checked.',
  '04 Type': 'Three families, one role scale. Display, text, mono.',
  '05 Icons': 'One stroke-based set, sized to the 12–24 icon scale.',
  '06 Shape': 'Radius and border weights, from hairline to pill.',
  '07 Space & Layout': 'A 4px grid, containers, breakpoints and the app shell.',
  '08 Depth': 'Elevation intents, layers, shadows and scrims.',
  '09 Motion': 'Five durations, five curves, named by intent.',
  '10 State': 'Hover, pressed, selected and focus — one consistent language.',
  '11 Atoms': 'The smallest parts every component is built from.',
  '12 Layout': 'Stacks, dividers, split panes and scroll areas.',
  '13 Display': 'Badges, tags, avatars, key caps and inline content.',
  '14 Feedback': 'Alerts, toasts, progress, skeletons and loaders.',
  '15 Actions': 'Buttons in every variant, size and state.',
  '16 Inputs': 'Text, numbers, passwords, phones, files and rich text.',
  '17 Selection': 'Select, autocomplete, chips, checkboxes, sliders, switches.',
  '18 Pickers': 'Dates, ranges, times and colours.',
  '19 Forms': 'Layout, validation and multi-step flows.',
  '20 Overlays': 'Dialogs, drawers, sheets, popovers, tooltips and tours.',
  '21 Menus': 'Menus, context menus, split buttons and the command palette.',
  '22 Navigation': 'Navbar, sidebar, tabs, breadcrumbs, steppers and pagination.',
  '23 Cards': 'Card and every card built on top of it.',
  '24 Media': 'Carousels, lightbox, players and image tools.',
  '25 Data viz': 'Charts coloured from one categorical palette, keyboard-readable.',
  '26 Data': 'Tables, grids, lists, timelines and logs.',
  '27 Planning': 'Calendars, kanban boards and schedulers.',
  '28 Patterns': 'Product-level compositions — AI panels, filters, comments, pricing.'
};
const HIDE = ['guidelines/theme-switch.html', 'guidelines/token-lint.html'];
const RAMP = [['50', '#fdf2f5'], ['100', '#fbe5ec'], ['200', '#f6c6d5'], ['300', '#ee98b3'], ['400', '#e05f88'], ['500', '#c92d62'], ['600', '#ac1249'], ['700', '#8b0036'], ['800', '#72002d'], ['900', '#5c0526'], ['950', '#380014']];
function Nav() {
  return React.createElement("header", {
    className: "sc-nav"
  }, React.createElement("div", {
    className: "sc-wrap"
  }, React.createElement("a", {
    className: "sc-brand",
    href: "#top"
  }, React.createElement("i", null, "V"), "Velvet UI"), React.createElement("nav", {
    className: "sc-links"
  }, React.createElement("a", {
    href: "#brand"
  }, "Brand"), React.createElement("a", {
    href: "#foundations"
  }, "Foundations"), React.createElement("a", {
    href: "#ecosystem"
  }, "Ecosystem"), React.createElement("a", {
    href: "#library"
  }, "Library")), React.createElement(Safe, null, React.createElement(ThemeToggle, {
    appearance: "segmented",
    size: "sm"
  }))));
}
const SPARK = [12, 14, 11, 18, 16, 22, 20, 27, 25, 31, 29, 36];
function Hero({
  total
}) {
  const day = n => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), t.getDate() + n);
  };
  return React.createElement("section", {
    className: "sc-hero",
    id: "top"
  }, React.createElement("div", {
    className: "sc-wrap"
  }, React.createElement("div", null, React.createElement("div", {
    className: "sc-over"
  }, "Velvet UI \xB7 Design system"), React.createElement("h1", {
    className: "sc-h1"
  }, "Quietly confident ", React.createElement("em", null, "interfaces.")), React.createElement("p", {
    className: "sc-lead"
  }, "One brand colour, three typefaces and a token architecture that carries every component through light and dark \u2014 from a single checkbox to a full scheduler."), React.createElement("div", {
    className: "sc-ctas"
  }, React.createElement(Button, {
    size: "lg",
    iconRight: "arrow-right",
    onClick: () => location.hash = 'library'
  }, "Browse components"), React.createElement(Button, {
    size: "lg",
    variant: "secondary",
    onClick: () => location.hash = 'foundations'
  }, "See foundations")), React.createElement("div", {
    className: "sc-facts"
  }, React.createElement("div", null, React.createElement("b", null, "183"), React.createElement("span", null, "Components")), React.createElement("div", null, React.createElement("b", null, "958"), React.createElement("span", null, "Design tokens")), React.createElement("div", null, React.createElement("b", null, total || 249), React.createElement("span", null, "Live specimens")), React.createElement("div", null, React.createElement("b", null, "2"), React.createElement("span", null, "Themes")))), React.createElement("div", {
    className: "sc-stage"
  }, React.createElement("div", {
    className: "sc-bento"
  }, React.createElement("div", {
    className: "sc-col"
  }, React.createElement("div", {
    className: "sc-panel"
  }, React.createElement(Safe, null, React.createElement(Stat, {
    label: "Revenue",
    value: "\u20AC48,290",
    delta: "+12.4%",
    hint: "vs. last month"
  })), React.createElement(Safe, null, React.createElement(Sparkline, {
    data: SPARK,
    area: true,
    height: 56,
    label: "Revenue"
  }))), React.createElement("div", {
    className: "sc-panel"
  }, React.createElement("h4", null, "Workspace ", React.createElement("small", null, "Saved automatically")), React.createElement(Safe, null, React.createElement(Switch, {
    label: "Email notifications",
    defaultChecked: true
  })), React.createElement(Safe, null, React.createElement(Switch, {
    label: "Compact density"
  })), React.createElement(Safe, null, React.createElement(Slider, {
    label: "Monthly budget",
    defaultValue: [20, 70],
    step: 5,
    format: v => '$' + v + 'k'
  }))), React.createElement(Safe, null, React.createElement(Toast, {
    tone: "success",
    title: "Invite sent",
    description: "anna@velvet.io will get an email.",
    onClose: () => {}
  }))), React.createElement("div", {
    className: "sc-col"
  }, React.createElement("div", {
    className: "sc-panel",
    style: {
      alignItems: 'center'
    }
  }, React.createElement(Safe, null, React.createElement(Calendar, {
    mode: "range",
    defaultValue: {
      start: day(-1),
      end: day(4)
    },
    marks: [day(7), day(9)]
  }))), React.createElement("div", {
    className: "sc-panel"
  }, React.createElement(Safe, null, React.createElement(ChipGroup, {
    size: "sm",
    label: "Category",
    defaultValue: ['design'],
    options: [{
      value: 'design',
      label: 'Design',
      count: 24
    }, {
      value: 'eng',
      label: 'Engineering',
      count: 41
    }, {
      value: 'research',
      label: 'Research',
      count: 8
    }]
  }))), React.createElement("div", {
    className: "sc-panel"
  }, React.createElement("h4", null, "Launch v1.0 ", React.createElement(Safe, null, React.createElement(AvatarGroup, null, React.createElement(Avatar, {
    name: "Anna Kowalska",
    size: "sm"
  }), React.createElement(Avatar, {
    name: "Marek Nowak",
    size: "sm",
    tone: "neutral"
  }), React.createElement(Avatar, {
    name: "Ola Lis",
    size: "sm"
  }), React.createElement(Avatar, {
    initials: "+5",
    size: "sm",
    tone: "neutral"
  })))), React.createElement(Safe, null, React.createElement(Progress, {
    label: "Onboarding",
    value: 3,
    max: 5,
    showValue: true,
    tone: "success",
    format: (a, b) => a + '/' + b + ' steps'
  }))))))));
}
function BrandBand() {
  const [copied, setCopied] = React.useState(null);
  const copy = h => {
    navigator.clipboard?.writeText(h);
    setCopied(h);
    clearTimeout(window.__scT);
    window.__scT = setTimeout(() => setCopied(null), 1600);
  };
  return React.createElement("section", {
    className: "sc-band",
    id: "brand"
  }, React.createElement("div", {
    className: "sc-wrap sc-band-top"
  }, React.createElement("div", null, React.createElement("div", {
    className: "sc-over"
  }, "Brand colour \xB7 Velvet 700"), React.createElement("div", {
    className: "sc-band-hex"
  }, "#8B0036")), React.createElement("p", null, "A deep, saturated crimson that reads premium without shouting. Built as an eleven-step OKLCH ramp \u2014 lightness steps evenly, chroma peaks mid-ramp. Click a step to copy it.")), React.createElement("div", {
    className: "sc-ramp"
  }, RAMP.map(([s, h]) => {
    const dark = +s >= 400;
    return React.createElement("button", {
      key: s,
      className: s === '700' ? 'is-brand' : '',
      style: {
        background: h,
        color: dark ? '#fff' : '#5c0526'
      },
      onClick: () => copy(h),
      "aria-label": 'Copy velvet ' + s + ' ' + h
    }, React.createElement("b", null, s), React.createElement("span", null, copied === h ? 'Copied' : h));
  })));
}
function Foundations() {
  const [go, setGo] = React.useState(false);
  React.useEffect(() => {
    const t = setInterval(() => setGo(g => !g), 1600);
    return () => clearInterval(t);
  }, []);
  const neutrals = ['--bg-page', '--bg-subtle', '--bg-raised', '--bg-sunken', '--bg-inverse', '--fg-primary', '--fg-secondary', '--fg-tertiary'];
  const status = [['success', '--status-success-solid'], ['warning', '--status-warning-solid'], ['danger', '--status-danger-solid'], ['info', '--status-info-solid'], ['brand', '--action-primary'], ['neutral', '--status-neutral-solid']];
  const roles = [['display-md', 'Display', 'var(--type-display-md)'], ['h2', 'Heading', 'var(--type-h2)'], ['title-lg', 'Title', 'var(--type-title-lg)'], ['body-lg', 'Body', 'var(--type-body-lg)'], ['mono', 'Code', '400 14px/1.5 var(--font-mono)']];
  const radii = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full'];
  const elev = ['control', 'card', 'raised', 'popover', 'dialog', 'brand'];
  const eases = ['linear', 'standard', 'emphasized', 'exit', 'spring'];
  return React.createElement("section", {
    className: "sc-sec",
    id: "foundations"
  }, React.createElement("div", {
    className: "sc-wrap"
  }, React.createElement("div", {
    className: "sc-head"
  }, React.createElement("div", null, React.createElement("div", {
    className: "sc-over"
  }, "Foundations"), React.createElement("h2", {
    className: "sc-h2"
  }, "Decisions made once, inherited everywhere.")), React.createElement("p", null, "Raw scales become intent tokens, intent tokens become component knobs. Switch the theme above \u2014 every value on this page re-resolves without a single component changing.")), React.createElement("div", {
    className: "sc-fgrid"
  }, React.createElement("div", {
    className: "sc-tile sc-s12"
  }, React.createElement("div", {
    className: "sc-tile-h"
  }, React.createElement("h3", null, "Typography"), React.createElement("span", {
    className: "sc-mono",
    style: {
      color: 'var(--fg-tertiary)'
    }
  }, "3 families \xB7 18 roles")), React.createElement("div", {
    className: "sc-type"
  }, React.createElement("div", null, React.createElement("span", {
    className: "sc-over"
  }, "Display"), React.createElement("span", {
    className: "aa",
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600
    }
  }, "Aa"), React.createElement("b", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 20
    }
  }, "Space Grotesk"), React.createElement("p", null, "Headlines, titles and figures. Tight tracking, geometric confidence.")), React.createElement("div", null, React.createElement("span", {
    className: "sc-over"
  }, "Text"), React.createElement("span", {
    className: "aa",
    style: {
      fontFamily: 'var(--font-sans)',
      fontWeight: 500
    }
  }, "Aa"), React.createElement("b", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 20
    }
  }, "Hanken Grotesk"), React.createElement("p", null, "Body, labels and controls. Open, legible, calm at every size.")), React.createElement("div", null, React.createElement("span", {
    className: "sc-over"
  }, "Mono"), React.createElement("span", {
    className: "aa",
    style: {
      fontFamily: 'var(--font-mono)',
      letterSpacing: '-.06em'
    }
  }, "Aa"), React.createElement("b", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 18
    }
  }, "JetBrains Mono"), React.createElement("p", null, "Code, tokens, counters and tabular data.")))), React.createElement("div", {
    className: "sc-tile sc-s7"
  }, React.createElement("div", {
    className: "sc-tile-h"
  }, React.createElement("h3", null, "Type roles")), React.createElement("div", {
    className: "sc-scale"
  }, roles.map(([k, l, f]) => React.createElement("div", {
    key: k
  }, React.createElement("span", {
    className: "sc-mono"
  }, k), React.createElement("p", {
    style: {
      font: f
    }
  }, l, " \u2014 Calm, precise, quietly confident"))))), React.createElement("div", {
    className: "sc-tile sc-s5"
  }, React.createElement("div", {
    className: "sc-tile-h"
  }, React.createElement("h3", null, "Status")), React.createElement("div", {
    className: "sc-chips"
  }, status.map(([n, t]) => React.createElement("div", {
    className: "sc-chip",
    key: n
  }, React.createElement("i", {
    style: {
      background: `var(${t})`
    }
  }), React.createElement("span", null, n)))), React.createElement("div", {
    className: "sc-tile-h"
  }, React.createElement("h3", null, "Surfaces & ink")), React.createElement("div", {
    className: "sc-chips"
  }, neutrals.map(t => React.createElement("div", {
    className: "sc-chip",
    key: t
  }, React.createElement("i", {
    style: {
      background: `var(${t})`
    }
  }), React.createElement("span", {
    className: "sc-mono"
  }, t.slice(2)))))), React.createElement("div", {
    className: "sc-tile sc-s6"
  }, React.createElement("div", {
    className: "sc-tile-h"
  }, React.createElement("h3", null, "Shape"), React.createElement("span", {
    className: "sc-mono",
    style: {
      color: 'var(--fg-tertiary)'
    }
  }, "--radius-*")), React.createElement("div", {
    className: "sc-radii"
  }, radii.map(r => React.createElement("div", {
    key: r
  }, React.createElement("i", {
    style: {
      borderRadius: `var(--radius-${r})`
    }
  }), React.createElement("span", {
    className: "sc-mono"
  }, r))))), React.createElement("div", {
    className: "sc-tile sc-s6"
  }, React.createElement("div", {
    className: "sc-tile-h"
  }, React.createElement("h3", null, "Motion"), React.createElement("span", {
    className: "sc-mono",
    style: {
      color: 'var(--fg-tertiary)'
    }
  }, "5 curves")), React.createElement("div", {
    className: 'sc-ease' + (go ? ' go' : '')
  }, eases.map(e => React.createElement("div", {
    key: e
  }, React.createElement("span", {
    className: "sc-mono"
  }, e), React.createElement("div", {
    className: "trk"
  }, React.createElement("b", {
    style: {
      transitionTimingFunction: `var(--ease-${e})`
    }
  })))))), React.createElement("div", {
    className: "sc-tile sc-s12"
  }, React.createElement("div", {
    className: "sc-tile-h"
  }, React.createElement("h3", null, "Depth"), React.createElement("span", {
    className: "sc-mono",
    style: {
      color: 'var(--fg-tertiary)'
    }
  }, "--elevation-*")), React.createElement("div", {
    className: "sc-elev",
    style: {
      gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))'
    }
  }, elev.map(e => React.createElement("div", {
    key: e,
    style: {
      boxShadow: `var(--elevation-${e})`
    }
  }, React.createElement("span", {
    className: "sc-mono"
  }, e))))))));
}
const PKGS = {
  ui: {
    n: 'VelvetUi',
    p: '@jankrajewskiit/ui',
    v: '3.1.3',
    d: 'The component library — 183 components, tokens, light & dark themes. mountVelvetApp wires theme, locale, toasts and an error boundary in one call.',
    rel: ['i18n', 'solid', 'configs']
  },
  auth: {
    n: 'VelvetAuth',
    p: '@jankrajewskiit/auth',
    v: '3.2.0',
    d: 'Browser-side OIDC sign-in. Redirect flow, callback, silent renewal, cross-tab sign-out and roles behind one provider and one hook.',
    rel: ['oidc', 'solid', 'configs']
  },
  reactive: {
    n: 'VelvetReactive',
    p: '@jankrajewskiit/reactive',
    v: '3.2.0',
    d: 'Headless data layer — HTTP clients, queries, mutations, pagination and local or synced stores.',
    rel: ['solid', 'configs']
  },
  i18n: {
    n: 'VelvetI18n',
    p: '@jankrajewskiit/i18n',
    v: '3.2.1',
    d: 'Type-safe translations. ICU plurals, rich-text tags, Intl formatting and compile-time key checks.',
    rel: ['solid', 'configs']
  },
  configs: {
    n: 'VelvetConfigs',
    p: '@jankrajewskiit/configs',
    v: '3.2.0',
    d: 'Shared tooling presets — ESLint, Prettier, Stylelint, TypeScript, Vite, lint-staged, Husky, Nginx. Used by every package at build time.',
    rel: []
  }
};
const back = k => Object.keys(PKGS).filter(o => PKGS[o].rel.includes(k));
function Ecosystem() {
  const [h, setH] = React.useState(null);
  const lit = k => !h || h === k || PKGS[h] && PKGS[h].rel.includes(k) || back(h).includes(k) || h === 'app' && ['ui', 'auth', 'reactive', 'i18n'].includes(k) || k === 'app' && ['ui', 'auth', 'reactive', 'i18n'].includes(h);
  const box = (k, extra) => {
    const p = PKGS[k];
    return React.createElement("div", {
      className: 'sc-pkg' + (lit(k) ? '' : ' dim') + (h === k ? ' on' : ''),
      onMouseEnter: () => setH(k),
      onMouseLeave: () => setH(null),
      tabIndex: 0,
      onFocus: () => setH(k),
      onBlur: () => setH(null),
      style: extra
    }, React.createElement("div", {
      className: "sc-pkg-h"
    }, React.createElement("b", null, p.n), React.createElement("span", {
      className: "sc-mono"
    }, "v", p.v)), React.createElement("span", {
      className: "sc-mono sc-pkg-id"
    }, p.p), React.createElement("p", null, p.d));
  };
  const ext = (k, label, note) => React.createElement("div", {
    className: 'sc-ext' + (lit(k) ? '' : ' dim')
  }, React.createElement("span", {
    className: "sc-mono"
  }, label), React.createElement("small", null, note));
  const link = (k, label) => React.createElement("div", {
    className: 'sc-link' + (lit(k) ? '' : ' dim')
  }, React.createElement("i", null), React.createElement("span", {
    className: "sc-mono"
  }, label));
  return React.createElement("section", {
    className: "sc-sec",
    id: "ecosystem"
  }, React.createElement("div", {
    className: "sc-wrap"
  }, React.createElement("div", {
    className: "sc-head"
  }, React.createElement("div", null, React.createElement("div", {
    className: "sc-over"
  }, "Ecosystem"), React.createElement("h2", {
    className: "sc-h2"
  }, "Five packages. One way of building.")), React.createElement("p", null, "Everything ships for SolidJS from one scope. Install only what you need \u2014 the packages stay independent, and your app is where they meet. Hover a package to trace its connections.")), React.createElement("div", {
    className: "sc-eco"
  }, React.createElement("div", {
    className: 'sc-app' + (lit('app') ? '' : ' dim'),
    onMouseEnter: () => setH('app'),
    onMouseLeave: () => setH(null)
  }, React.createElement("span", {
    className: "sc-over"
  }, "Your app"), React.createElement("b", null, "SolidJS application"), React.createElement("span", {
    className: "sc-mono"
  }, "mountVelvetApp \xB7 AuthProvider \xB7 configureReactive")), React.createElement("div", {
    className: "sc-eco-row"
  }, link('ui', 'imports'), link('auth', 'imports'), link('reactive', 'imports')), React.createElement("div", {
    className: "sc-eco-row"
  }, box('ui'), box('auth'), box('reactive')), React.createElement("div", {
    className: "sc-eco-row"
  }, link('i18n', 'peer dependency'), link('oidc', 'peer dependency'), React.createElement("div", {
    className: 'sc-wire' + (lit('auth') && lit('reactive') ? '' : ' dim')
  }, React.createElement("span", {
    className: "sc-mono"
  }, "access token \u2192 getAccessToken"), React.createElement("small", null, "wired in your app, not a package dependency"))), React.createElement("div", {
    className: "sc-eco-row"
  }, box('i18n'), ext('oidc', 'oidc-client-ts', 'external · ≥ 3.1'), React.createElement("div", null)), React.createElement("div", {
    className: 'sc-solid' + (lit('solid') ? '' : ' dim')
  }, React.createElement("span", {
    className: "sc-mono"
  }, "solid-js \u2265 1.9"), React.createElement("small", null, "Shared peer of every runtime package \u2014 one instance per app")), React.createElement("div", {
    className: 'sc-cfg' + (lit('configs') ? '' : ' dim') + (h === 'configs' ? ' on' : ''),
    onMouseEnter: () => setH('configs'),
    onMouseLeave: () => setH(null),
    tabIndex: 0
  }, React.createElement("div", null, React.createElement("span", {
    className: "sc-over"
  }, "Build time"), React.createElement("div", {
    className: "sc-pkg-h",
    style: {
      marginTop: 8
    }
  }, React.createElement("b", null, PKGS.configs.n), React.createElement("span", {
    className: "sc-mono"
  }, "v", PKGS.configs.v)), React.createElement("span", {
    className: "sc-mono sc-pkg-id"
  }, PKGS.configs.p)), React.createElement("p", null, PKGS.configs.d)))));
}
const FQ = { busy: 0, q: [], n: 0, max: +(new URLSearchParams(location.search).get('max') || 1e9) };
let lastScroll = 0;
addEventListener('scroll', () => { lastScroll = performance.now(); clearTimeout(FQ.s); FQ.s = setTimeout(() => fqNext(), 300); }, { passive: true });
const fqNext = () => { if (FQ.busy || !FQ.q.length) return; if (performance.now() - lastScroll < 280) return; const go = FQ.q.shift(); if (!go.want) return fqNext(); if (FQ.n >= FQ.max) return; FQ.n++; FQ.busy = 1; go(); FQ.t = setTimeout(fqDone, 3000); };
const fqDone = () => { clearTimeout(FQ.t); FQ.busy = 0; setTimeout(fqNext, 60); };
function Frame({
  c
}) {
  const [W, H] = (c.viewport || '960x400').split('x').map(Number);
  const ref = React.useRef(null);
  const [tw, setTw] = React.useState(0);
  const [load, setLoad] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    const go = () => setLoad(true);
    const ro = new ResizeObserver(([e]) => setTw(e.contentRect.width));
    ro.observe(el);
    const near = new IntersectionObserver(([e]) => {
      go.want = e.isIntersecting;
      if (e.isIntersecting && !FQ.q.includes(go)) { FQ.q.push(go); fqNext(); }
    }, { rootMargin: '200px 0px' });
    const far = new IntersectionObserver(([e]) => { if (!e.isIntersecting) setLoad(false); }, { rootMargin: '1600px 0px' });
    near.observe(el);
    far.observe(el);
    return () => {
      go.want = false;
      ro.disconnect();
      near.disconnect();
      far.disconnect();
    };
  }, []);
  const s = tw && tw < W ? tw / W : 1;
  const iw = tw && tw > W ? tw : W;
  return React.createElement("div", {
    className: "sc-frame",
    ref: ref,
    style: {
      height: Math.round(H * s)
    }
  }, load ? React.createElement("iframe", {
    src: ROOT + c.path,
    title: c.name,
    onLoad: fqDone,
    style: {
      width: iw,
      height: H,
      transform: s < 1 ? `scale(${s})` : 'none'
    }
  }) : React.createElement("div", {
    className: "ph sc-mono"
  }, c.name));
}
const span = vp => {
  const w = +(vp || '960x').split('x')[0];
  return w <= 420 ? 4 : w <= 640 ? 6 : 12;
};
function Library({
  cards
}) {
  const [q, setQ] = React.useState('');
  const [scope, setScope] = React.useState('all');
  const [sel, setSel] = React.useState('g11');
  const groups = React.useMemo(() => {
    const ql = q.trim().toLowerCase();
    const m = {};
    cards.forEach(c => {
      const n = parseInt(c.group, 10);
      if (scope === 'found' && n > 10) return;
      if (scope === 'comp' && n <= 10) return;
      if (ql && !(c.name + ' ' + (c.subtitle || '') + ' ' + c.group).toLowerCase().includes(ql)) return;
      (m[c.group] = m[c.group] || []).push(c);
    });
    return Object.keys(m).sort().map(g => ({
      g,
      n: g.slice(0, 2),
      title: g.slice(3),
      id: 'g' + g.slice(0, 2),
      items: m[g]
    }));
  }, [cards, q, scope]);
  const searching = q.trim().length > 0;
  const cur = groups.find(g => g.id === sel) || groups[0];
  const shown = searching ? groups : cur ? [cur] : [];
  const ci = cur ? groups.indexOf(cur) : -1;
  const pick = (id) => { setSel(id); setQ(''); const el = document.getElementById('library'); if (el) window.scrollTo(0, el.getBoundingClientRect().top + scrollY + 260); };
  const count = groups.reduce((a, g) => a + g.items.length, 0);
  return React.createElement("section", {
    className: "sc-sec",
    id: "library"
  }, React.createElement("div", {
    className: "sc-wrap"
  }, React.createElement("div", {
    className: "sc-head"
  }, React.createElement("div", null, React.createElement("div", {
    className: "sc-over"
  }, "Library"), React.createElement("h2", {
    className: "sc-h2"
  }, "Everything in the box. All of it live.")), React.createElement("p", null, "Every specimen below is the real component, rendered from the shipping bundle. Click, type, drag and tab through them \u2014 then flip the theme and watch them follow.")), React.createElement("div", {
    className: "sc-lib"
  }, React.createElement("aside", {
    className: "sc-idx",
    "aria-label": "Sections"
  }, groups.map((g, i) => React.createElement(React.Fragment, {
    key: g.g
  }, i > 0 && +g.n === 11 && +groups[i - 1].n <= 10 ? React.createElement("hr", null) : null, React.createElement("a", {
    href: '#' + g.id,
    className: !searching && cur === g ? 'on' : '',
    onClick: e => { e.preventDefault(); pick(g.id); }
  }, React.createElement("span", null, g.n), React.createElement("span", null, g.title), React.createElement("span", null, g.items.length))))), React.createElement("div", null, React.createElement("div", {
    className: "sc-tools"
  }, React.createElement("div", {
    className: "sc-search"
  }, React.createElement(Safe, null, React.createElement(Input, {
    "aria-label": "Filter specimens",
    placeholder: `Filter ${cards.length} specimens — button, date, chart…`,
    iconLeft: "search",
    value: q,
    onChange: e => setQ(e && e.target ? e.target.value : e)
  }))), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, [['all', 'All'], ['found', 'Foundations'], ['comp', 'Components']].map(([k, l]) => React.createElement(Button, {
    key: k,
    variant: scope === k ? 'soft' : 'ghost',
    onClick: () => setScope(k),
    "aria-pressed": scope === k
  }, l)))), count === 0 ? React.createElement("div", {
    className: "sc-empty"
  }, "Nothing matches \u201C", q, "\u201D. Try a component name like \u201Ctable\u201D or \u201Cpicker\u201D.") : null, React.createElement("div", { className: "sc-mobsel" }, React.createElement("select", { value: cur ? cur.id : '', onChange: e => pick(e.target.value), "aria-label": "Section" }, groups.map(g => React.createElement("option", { key: g.id, value: g.id }, g.n + ' ' + g.title + ' (' + g.items.length + ')')))), shown.map(g => React.createElement("div", {
    className: "sc-grp",
    id: g.id,
    key: g.g
  }, React.createElement("div", {
    className: "sc-grp-h"
  }, React.createElement("span", {
    className: "n"
  }, g.n), React.createElement("div", null, React.createElement("h3", null, g.title), React.createElement("p", null, BLURB[g.g] || '')), React.createElement("span", {
    className: "sc-mono",
    style: {
      color: 'var(--fg-tertiary)'
    }
  }, g.items.length, " ", g.items.length === 1 ? 'specimen' : 'specimens')), React.createElement("div", {
    className: "sc-cards",
    style: {
      gridAutoFlow: 'dense'
    }
  }, g.items.map(c => React.createElement("div", {
    className: "sc-card",
    key: c.path,
    style: {
      gridColumn: 'span ' + span(c.viewport)
    }
  }, React.createElement("div", {
    className: "sc-card-h"
  }, React.createElement("b", null, c.name), React.createElement("span", null, c.subtitle)), React.createElement(Frame, {
    c: c
  }))))))))));
}
function App() {
  const ready = useDS();
  const [cards, setCards] = React.useState([]);
  React.useEffect(() => {
    fetch('cards.json').then(r => r.json()).then(l => setCards(l.filter(c => !HIDE.includes(c.path))));
  }, []);
  if (!ready) return null;
  const O = window.__ONLY || 'nhbfel';
  return React.createElement(React.Fragment, null, O.includes('n') && React.createElement(Nav, null), O.includes('h') && React.createElement(Hero, {
    total: cards.length
  }), O.includes('b') && React.createElement(BrandBand, null), O.includes('f') && React.createElement(Foundations, null), O.includes('e') && React.createElement(Ecosystem, null), O.includes('l') && React.createElement(Library, {
    cards: cards
  }), React.createElement("footer", {
    className: "sc-foot"
  }, React.createElement("div", {
    className: "sc-wrap"
  }, React.createElement("span", null, "Velvet UI Design System"), React.createElement("span", {
    className: "sc-mono"
  }, "Light & dark \xB7 Built on tokens"))));
}
window.ShowcaseApp = App;
})();

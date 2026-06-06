// Single source of truth for post structure: section types, their editable
// fields (web + email), blank defaults, and helpers for numbering / TOC.
// Shared by the dashboard editor, the web renderer, and the email serializer.

export const genId = () =>
  (globalThis.crypto?.randomUUID?.() ||
    'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36))

export function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

// strip tags → plain text (for deriving condensed email copy from web rich text)
export const stripHtml = (html) =>
  String(html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

// ── Section type registry ───────────────────────────────────────────────
// Each entry is a content section that gets an auto NN number + a TOC row.
//   fields       — web editable shape
//   emailFields  — email editable shape (omitted ⇒ section absent from email)
//   defaults()   — blank web data for a newly added section
//   emailDefaults(web) — condensed email data derived from web (used when the
//                  section has no explicit email override)
//   emailCard    — true ⇒ rendered in email as a generated gradient PNG
// kinds: 'text' | 'textarea' | 'rich' | 'lines' | 'list'
//
// hero / letter / footer are structural singletons handled as top-level post
// fields (see blankPost), not part of `sections[]`.

const LINK_FIELDS = [{ key: 'linkText', label: 'Email link text', kind: 'text' }]

export const SECTION_TYPES = [
  {
    type: 'feature',
    label: 'Feature (numbered launch)',
    hint: 'Headline announcement with a video placeholder and a numbered list of points. Mirrors “Faith in Fair Elections”.',
    defaultAnchor: 'fair-elections',
    fields: [
      { key: 'title', label: 'Section title', kind: 'text' },
      { key: 'announceItalic', label: 'Announce (italic line)', kind: 'text' },
      { key: 'announceBold', label: 'Announce (bold line)', kind: 'text' },
      { key: 'videoLabel', label: 'Video label', kind: 'text' },
      { key: 'lead', label: 'Intro paragraph', kind: 'rich' },
      {
        key: 'ways',
        label: 'Numbered points',
        kind: 'list',
        addLabel: 'Add point',
        item: [
          { key: 'title', label: 'Title', kind: 'text' },
          { key: 'body', label: 'Body', kind: 'textarea' },
        ],
      },
      { key: 'ctaText', label: 'Button text', kind: 'text' },
      { key: 'ctaHref', label: 'Button link', kind: 'text' },
    ],
    emailFields: [
      { key: 'title', label: 'Title', kind: 'text' },
      { key: 'bodyHtml', label: 'Condensed body', kind: 'rich' },
      ...LINK_FIELDS,
    ],
    defaults: () => ({
      title: 'New Feature',
      announceItalic: 'Announcing:',
      announceBold: 'Our new initiative',
      videoLabel: 'WATCH',
      lead: '<p>Introduce the feature here.</p>',
      ways: [{ title: 'First point', body: 'Describe it.' }],
      ctaText: 'Learn More',
      ctaHref: '#resources',
    }),
    emailDefaults: (w) => ({
      title: w.title,
      bodyHtml: w.lead,
      linkText: w.ctaText || 'Learn more',
    }),
  },
  {
    type: 'cards',
    label: 'Cards (lettered resources)',
    hint: 'Lead paragraph plus a list of badge cards. Mirrors “Resources & Opportunities”.',
    defaultAnchor: 'resources',
    fields: [
      { key: 'title', label: 'Section title', kind: 'text' },
      { key: 'lead', label: 'Lead paragraph', kind: 'rich' },
      {
        key: 'cards',
        label: 'Cards',
        kind: 'list',
        addLabel: 'Add card',
        item: [
          { key: 'badge', label: 'Badge (letter)', kind: 'text' },
          { key: 'title', label: 'Title', kind: 'text' },
          { key: 'body', label: 'Body', kind: 'rich' },
          { key: 'tag', label: 'Tag pill (optional)', kind: 'text' },
        ],
      },
    ],
    emailFields: [
      { key: 'title', label: 'Title', kind: 'text' },
      { key: 'bodyHtml', label: 'Condensed body', kind: 'rich' },
      ...LINK_FIELDS,
    ],
    defaults: () => ({
      title: 'Resources & Opportunities',
      lead: '<p>Ways to take action right now.</p>',
      cards: [{ badge: 'A', title: 'First resource', body: '<p>Describe it.</p>', tag: '' }],
    }),
    emailDefaults: (w) => ({
      title: w.title,
      bodyHtml: w.lead,
      linkText: 'Explore all',
    }),
  },
  {
    type: 'events',
    label: 'Events (date chips)',
    hint: 'List of events with gradient date chips. Chips render as dark-mode-safe images in the email. Mirrors “Featured Events”.',
    defaultAnchor: 'events',
    fields: [
      { key: 'title', label: 'Section title', kind: 'text' },
      {
        key: 'events',
        label: 'Events',
        kind: 'list',
        addLabel: 'Add event',
        item: [
          { key: 'mo', label: 'Month (e.g. Jun)', kind: 'text' },
          { key: 'day', label: 'Day (e.g. 17)', kind: 'text' },
          { key: 'timeET', label: 'Time ET (e.g. 12:00 PM ET)', kind: 'text' },
          { key: 'timePT', label: 'Time PT (e.g. 9:00 AM PT)', kind: 'text' },
          { key: 'chipTime', label: 'Chip time (short, e.g. 12pm ET)', kind: 'text' },
          { key: 'tag', label: 'Category tag', kind: 'text' },
          { key: 'title', label: 'Title', kind: 'text' },
          { key: 'body', label: 'Description', kind: 'textarea' },
        ],
      },
      { key: 'ctaText', label: 'Footer link text', kind: 'text' },
    ],
    emailFields: [
      { key: 'title', label: 'Title', kind: 'text' },
      {
        key: 'events',
        label: 'Events (condensed)',
        kind: 'list',
        addLabel: 'Add event',
        item: [
          { key: 'tag', label: 'Category tag', kind: 'text' },
          { key: 'title', label: 'Title', kind: 'text' },
          { key: 'body', label: 'Short description', kind: 'textarea' },
        ],
      },
      ...LINK_FIELDS,
    ],
    defaults: () => ({
      title: 'Featured Events',
      events: [
        {
          mo: 'Jun',
          day: '1',
          timeET: '12:00 PM ET',
          timePT: '9:00 AM PT',
          chipTime: '12pm ET',
          tag: 'Category',
          title: 'New Event',
          body: 'Describe the event.',
        },
      ],
      ctaText: 'Register for any event',
    }),
    emailDefaults: (w) => ({
      title: w.title,
      events: (w.events || []).map((e) => ({ tag: e.tag, title: e.title, body: e.body })),
      linkText: w.ctaText || 'Register',
    }),
  },
  {
    type: 'spotlight',
    label: 'Spotlight (gradient feature)',
    hint: 'Full-width gradient card highlighting one story, with stat figures. Mirrors “Partner Spotlight”.',
    defaultAnchor: 'spotlight',
    fields: [
      { key: 'title', label: 'Section title', kind: 'text' },
      { key: 'where', label: 'Location / eyebrow', kind: 'text' },
      { key: 'org', label: 'Org name', kind: 'text' },
      { key: 'body', label: 'Body', kind: 'rich' },
      {
        key: 'stats',
        label: 'Stats',
        kind: 'list',
        addLabel: 'Add stat',
        item: [
          { key: 'num', label: 'Number', kind: 'text' },
          { key: 'label', label: 'Label', kind: 'text' },
        ],
      },
      { key: 'ctaText', label: 'Link text', kind: 'text' },
    ],
    emailFields: [
      { key: 'eyebrow', label: 'Eyebrow', kind: 'text' },
      { key: 'org', label: 'Org name', kind: 'text' },
      { key: 'bodyHtml', label: 'Condensed body', kind: 'rich' },
      ...LINK_FIELDS,
    ],
    defaults: () => ({
      title: 'Partner Spotlight',
      where: 'City, ST',
      org: 'Organization',
      body: '<p>Tell the story.</p>',
      stats: [{ num: '100+', label: 'people reached' }],
      ctaText: 'Read the story',
    }),
    emailDefaults: (w) => ({
      eyebrow: w.where ? `Partner Spotlight · ${w.where}` : 'Partner Spotlight',
      org: w.org,
      bodyHtml: w.body,
      linkText: w.ctaText || 'Read the story',
    }),
  },
  {
    type: 'happenings',
    label: 'Happenings (3-up grid)',
    hint: 'Grid of org cards with a colored monogram. Mirrors “Partner Happenings”.',
    defaultAnchor: 'happenings',
    fields: [
      { key: 'title', label: 'Section title', kind: 'text' },
      { key: 'lead', label: 'Lead paragraph', kind: 'rich' },
      {
        key: 'cards',
        label: 'Cards',
        kind: 'list',
        addLabel: 'Add card',
        item: [
          { key: 'mark', label: 'Monogram letter', kind: 'text' },
          { key: 'org', label: 'Org', kind: 'text' },
          { key: 'title', label: 'Title', kind: 'text' },
          { key: 'body', label: 'Body', kind: 'textarea' },
          { key: 'cta', label: 'Link text', kind: 'text' },
          { key: 'href', label: 'Link URL', kind: 'text' },
        ],
      },
    ],
    emailFields: [
      { key: 'title', label: 'Title', kind: 'text' },
      { key: 'bodyHtml', label: 'Condensed body', kind: 'rich' },
      ...LINK_FIELDS,
    ],
    defaults: () => ({
      title: 'Partner Happenings',
      lead: '<p>What partners are up to across the network.</p>',
      cards: [
        { mark: 'O', org: 'Org', title: 'Campaign', body: 'Describe it.', cta: 'Read more', href: '#happenings' },
      ],
    }),
    emailDefaults: (w) => ({
      title: w.title,
      bodyHtml: w.lead,
      linkText: 'See what partners are up to',
    }),
  },
  {
    type: 'accordion',
    label: 'Accordion (FAQ)',
    hint: 'Expandable question/answer items. Web-only (omitted from the email). Mirrors “Common Questions”.',
    defaultAnchor: 'faq',
    fields: [
      { key: 'title', label: 'Section title', kind: 'text' },
      { key: 'lead', label: 'Lead paragraph', kind: 'text' },
      {
        key: 'items',
        label: 'Questions',
        kind: 'list',
        addLabel: 'Add question',
        item: [
          { key: 'q', label: 'Question', kind: 'text' },
          { key: 'a', label: 'Answer', kind: 'rich' },
        ],
      },
    ],
    // emailFields omitted ⇒ this section type does not appear in the email.
    defaults: () => ({
      title: 'Common Questions',
      lead: 'Everything people ask — answered.',
      items: [{ q: 'A question?', a: '<p>An answer.</p>' }],
    }),
  },
  {
    type: 'qotd',
    label: 'Question of the Week (quiz)',
    hint: 'Interactive civics quiz on the web; a dark-mode-safe gradient card in the email. Mirrors “Question of the Day”.',
    defaultAnchor: 'game',
    emailCard: true, // rendered in email as a generated PNG card
    fields: [
      { key: 'kicker', label: 'Kicker', kind: 'text' },
      { key: 'heading', label: 'Heading', kind: 'text' },
      { key: 'blurb', label: 'Blurb', kind: 'textarea' },
      { key: 'cardBlurb', label: 'Email card blurb', kind: 'textarea' },
      { key: 'cardButton', label: 'Card button text', kind: 'text' },
      {
        key: 'questions',
        label: 'Questions',
        kind: 'list',
        addLabel: 'Add question',
        item: [
          { key: 'q', label: 'Question', kind: 'text' },
          { key: 'opts', label: 'Options (one per line)', kind: 'lines' },
          { key: 'a', label: 'Correct option # (1-based)', kind: 'text' },
          { key: 'ex', label: 'Explanation (HTML ok)', kind: 'textarea' },
        ],
      },
    ],
    defaults: () => ({
      kicker: 'Question of the Week',
      heading: 'Think you know your democracy?',
      blurb:
        'A quick, nonpartisan civics challenge — a few questions on the institutions, rights, and history that make a more perfect union.',
      cardBlurb:
        'A quick, nonpartisan civics challenge — five questions on the rights and institutions behind a more perfect union.',
      cardButton: "Play today's challenge",
      questions: [
        {
          q: 'A sample civics question?',
          opts: ['Option A', 'Option B', 'Option C'],
          a: '2',
          ex: '<b>Option B.</b> Explanation goes here.',
        },
      ],
    }),
  },
  {
    type: 'prose',
    label: 'Prose (free text)',
    hint: 'General-purpose titled rich-text block for anything not covered by the other templates.',
    defaultAnchor: 'section',
    fields: [
      { key: 'title', label: 'Section title', kind: 'text' },
      { key: 'html', label: 'Body', kind: 'rich' },
    ],
    emailFields: [
      { key: 'title', label: 'Title', kind: 'text' },
      { key: 'bodyHtml', label: 'Body', kind: 'rich' },
      ...LINK_FIELDS,
    ],
    defaults: () => ({ title: 'New Section', html: '<p>Write here.</p>' }),
    emailDefaults: (w) => ({ title: w.title, bodyHtml: w.html, linkText: '' }),
  },
]

export const TYPE_MAP = Object.fromEntries(SECTION_TYPES.map((t) => [t.type, t]))

// Convert stored qotd questions (opts may be a newline string; `a` is 1-based)
// into the shape the quiz engine + preview expect (`opts` array, `a` 0-based).
export function toQuizQuestions(questions = []) {
  return questions.map((q) => ({
    q: q.q,
    opts: Array.isArray(q.opts) ? q.opts : String(q.opts || '').split('\n').filter(Boolean),
    a: Math.max(0, (parseInt(q.a, 10) || 1) - 1),
    ex: q.ex || '',
  }))
}

export function newSection(type) {
  const def = TYPE_MAP[type]
  if (!def) throw new Error('Unknown section type: ' + type)
  return {
    id: genId(),
    type,
    anchor: def.defaultAnchor,
    tocTitle: '',
    tocSub: '',
    web: def.defaults(),
    email: null, // null ⇒ email auto-derived from web; an object ⇒ explicit override
  }
}

// Effective email data for a section (explicit override, else auto-derived).
// Returns null when this section type does not appear in the email.
export function emailData(section) {
  const def = TYPE_MAP[section.type]
  if (!def || (!def.emailFields && !def.emailCard)) return null
  if (section.email) return section.email
  return def.emailDefaults ? def.emailDefaults(section.web) : { ...section.web }
}

// Numbered sections in order, each annotated with its NN string.
export function numberedSections(post) {
  return (post.sections || []).map((s, i) => ({
    ...s,
    num: String(i + 1).padStart(2, '0'),
  }))
}

// TOC rows derived from the ordered sections.
export function tocItems(post) {
  return numberedSections(post).map((s) => ({
    n: s.num,
    href: '#' + s.anchor,
    title: s.tocTitle || s.web.title || s.web.heading || TYPE_MAP[s.type]?.label || 'Section',
    sub: s.tocSub || '',
  }))
}

// Ensure section anchors are unique within a post.
export function withUniqueAnchors(sections) {
  const seen = new Map()
  return sections.map((s) => {
    const base = s.anchor || TYPE_MAP[s.type]?.defaultAnchor || 'section'
    const n = (seen.get(base) || 0) + 1
    seen.set(base, n)
    return n === 1 ? s : { ...s, anchor: `${base}-${n}` }
  })
}

export function blankPost() {
  return {
    slug: '',
    status: 'draft',
    title: 'Untitled edition',
    preheader: '',
    edition: { eyebrow: 'Partner Newsletter', label: 'New Edition', issueDate: '' },
    hero: {
      bannerUrl: '/assets/header-banner.png',
      bannerAlt: 'A More Perfect Union — The Jewish Partnership for Democracy',
    },
    letter: {
      kicker: 'From the team',
      html: '<p>Write the opening letter here.</p>',
      signName: '',
      signRole: '',
      email: null, // optional condensed email intro: { head, html, ctaText, ctaHref, note }
    },
    footer: {
      org: 'A MORE PERFECT UNION',
      tagline: 'The Jewish Partnership for Democracy',
      email: 'info@jewishdemocracy.org',
      fine: "You're receiving this because you're a valued partner. © 2026 A More Perfect Union · Nonpartisan · 501(c)(3)",
    },
    sections: [],
    assets: {}, // { editionStrip, qotdCard, "chip:<sectionId>:<i>" } → Storage URLs
  }
}

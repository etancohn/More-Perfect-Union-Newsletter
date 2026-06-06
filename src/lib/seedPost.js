// The current newsletter, expressed as a post document. Seeding this and
// rendering it must reproduce today's web page AND email exactly. It doubles as
// the canonical example of every section type's web + email-override shape.
//
// Web copy is lifted from src/sections/*; email overrides match email.html
// (the condensed copy). Fixed section ids make re-seeding idempotent.

export function seedPost() {
  return {
    slug: 'special-election-edition',
    status: 'published',
    title: 'A More Perfect Union — Special Election Edition',
    preheader:
      "It's go time — introducing Faith in Fair Elections, our 2026 community strategy. Read the full edition online.",
    edition: {
      eyebrow: 'Partner Newsletter',
      label: 'Special Election Edition',
      issueDate: '2026 Midterm Elections',
    },
    hero: {
      bannerUrl: '/assets/header-banner.png',
      bannerAlt: 'A More Perfect Union — The Jewish Partnership for Democracy',
    },
    letter: {
      kicker: 'From the Vice President',
      html: `<p>It's go time! In this special 2026 Midterm Elections edition, we're excited to officially launch <a href="#fair-elections">Faith in Fair Elections</a> — a Jewish community strategy to ensure free, fair, safe, and accessible elections this year.</p><p>Below, you'll learn about five nonpartisan, proven-effective actions that Jewish organizations can take to preserve the integrity of our elections — including toolkits, programs, connections, and funding. We are so grateful for your partnership in protecting and strengthening democracy. We are excited to do this work together.</p>`,
      signName: 'Jeremy Bannett',
      signRole: 'Vice President, Programs & Partnerships',
      // Condensed email intro (matches email.html "From the Vice President" block).
      email: {
        eyebrow: 'From the Vice President',
        head: "It's go time.",
        html: `<p>In this special 2026 Midterm Elections edition, we're excited to officially launch <a href="#fair-elections">Faith in Fair Elections</a> — a Jewish community strategy to ensure free, fair, safe, and accessible elections. Here's everything in this issue, in brief.</p>`,
        ctaText: 'Read the full edition online',
        note: "The full stories, plus today's civics challenge.",
      },
    },
    footer: {
      org: 'A MORE PERFECT UNION',
      tagline: 'The Jewish Partnership for Democracy',
      email: 'info@jewishdemocracy.org',
      fine: "You're receiving this because you're a valued partner. © 2026 A More Perfect Union · Nonpartisan · 501(c)(3)",
    },
    assets: {},
    sections: [
      // ── 01 FEATURE ──────────────────────────────────────────────
      {
        id: 'sec-feature',
        type: 'feature',
        anchor: 'fair-elections',
        tocTitle: 'Faith in Fair Elections',
        tocSub: 'Our 2026 launch & five ways to get involved',
        web: {
          title: 'Faith in Fair Elections',
          announceItalic: 'Announcing:',
          announceBold: 'Our 2026 community strategy',
          videoLabel: 'FAIR · ELECTIONS',
          lead: `<p>Our <a href="#fair-elections">Faith in Fair Elections</a> campaign is a Jewish community strategy to protect democracy at the midterms, through free, fair, safe, and accessible elections. It centers on five key ways the Jewish community can get involved:</p>`,
          ways: [
            { title: 'Serving as a Poll Worker', body: 'Trained community members help elections run smoothly and safely by serving as poll workers on Election Day.' },
            { title: 'Serving as a Poll Chaplain in key states', body: 'Poll chaplains provide a calming, supportive presence and help de-escalate tensions at polling locations in nine key states.' },
            { title: 'Providing legal support to election officials', body: 'Pro bono attorneys support election officials who are experiencing threats, doxxing, or harassment.' },
            { title: 'Building trusted relationships with election officials', body: 'Community members show support for good-faith public servants, learn more, and share how elections are run.' },
            { title: 'Being a trusted messenger', body: 'Community members and leaders strengthen public confidence and trust in elections through intentional messaging.' },
          ],
          ctaText: 'Learn More & Get Involved',
          ctaHref: '#resources',
        },
        email: {
          title: 'Faith in Fair Elections',
          bodyHtml: `<p>Our 2026 community strategy to protect democracy at the midterms, built on five nonpartisan, proven actions: serving as <b>poll workers</b> &amp; <b>poll chaplains</b>, providing <b>legal support</b> to officials, <b>building trusted relationships</b>, and being <b>trusted messengers</b>.</p>`,
          linkText: 'Watch the kick-off & get involved',
        },
      },
      // ── 02 CARDS (Resources) ────────────────────────────────────
      {
        id: 'sec-resources',
        type: 'cards',
        anchor: 'resources',
        tocTitle: 'Resources & Opportunities',
        tocSub: 'Toolkits, grants, and shared infrastructure',
        web: {
          title: 'Resources & Opportunities for Partners',
          lead: `<p>Five ways to take action right now — from ready-to-use toolkits to grant funding and shared infrastructure.</p>`,
          cards: [
            { badge: 'A', title: 'Access our toolkits', body: `<p>The <a href="#resources">Communications &amp; Action Toolkit</a> and <a href="#resources">Election Official Outreach Toolkit</a> are designed to help you take action — messaging, graphics, templates, and outreach resources to engage your community and build trusted relationships.</p>`, tag: '' },
            { badge: 'B', title: 'Apply for Ignition Grants', body: `<p>We're awarding up to <strong>$125,000</strong> (up to $3K per organization) in Ignition Grants to organizations in the Jewish Partnership for Democracy to support efforts to protect elections.</p>`, tag: 'Up to $3,000 per organization' },
            { badge: 'C', title: 'Use the JPD Election Connection Google Group', body: `<p>Stay connected with partners and our team through our central hub for election updates, resources, events, and discussion. Email <a href="#resources">moreply@groups.google.com</a> to join.</p>`, tag: '' },
            { badge: 'D', title: 'Opt in to our shared Google Calendar', body: `<p>Partners can access a shared Faith in Fair Elections calendar featuring upcoming events and election-related programming, tied right into your workflow.</p>`, tag: '' },
            { badge: 'E', title: 'Use our Election Intern', body: `<p>Our elections intern will build a detailed tracker of local election information and ways to get involved in election protection efforts locally for partners to access. Email <a href="#resources">info@jewishdemocracy.org</a> to learn more.</p>`, tag: '' },
          ],
        },
        email: {
          title: 'Resources & Opportunities',
          bodyHtml: `<p><b>Toolkits</b> for communications &amp; official outreach · <b>Ignition Grants</b> (up to $3K/org) · the <b>JPD Election Connection</b> group · a shared <b>events calendar</b> · and a dedicated <b>Election Intern</b>.</p>`,
          linkText: 'Explore all five',
        },
      },
      // ── 03 EVENTS ───────────────────────────────────────────────
      {
        id: 'sec-events',
        type: 'events',
        anchor: 'events',
        tocTitle: 'Featured Events',
        tocSub: 'Three gatherings this summer',
        web: {
          title: 'Featured Events',
          events: [
            { mo: 'Jun', day: '17', timeET: '12:00 PM ET', timePT: '9:00 AM PT', chipTime: '12pm ET', tag: 'Brewing Community', title: 'Virtual Partner Forum', body: 'A chance to connect with Jewish leaders and community members across the network to discuss current challenges, exchange ideas, and plan next steps to inform civic engagement and programming. And your coffee is on us!' },
            { mo: 'Jun', day: '24', timeET: '1:00 PM ET', timePT: '10:00 AM PT', chipTime: '1pm ET', tag: 'Faith in Fair Elections', title: 'Ignition Grants Info Session', body: "Learn more about the grants available as part of Faith in Fair Elections. We'll explore ideas, better understand the grant process, and discuss the types of projects we're excited to support. Plenty of time for Q&A." },
            { mo: 'Jul', day: '21', timeET: '1:00 PM ET', timePT: '10:00 AM PT', chipTime: '1pm ET', tag: 'High Holy Days', title: 'Drashing Democracy 2026: Reflection during the High Holidays', body: 'As the High Holy Days approach, join leading rabbis and explore democracy and what it means for American Jews today. A 90-minute webinar to find themes for your High Holy Day sermons.' },
          ],
          ctaText: 'Register for any event',
        },
        email: {
          title: 'Featured Events',
          events: [
            { tag: 'Brewing Community', title: 'Virtual Partner Forum', body: 'Connect with leaders across the network — and your coffee is on us.' },
            { tag: 'Faith in Fair Elections', title: 'Ignition Grants Info Session', body: "Walk through the grant process and the projects we're excited to support." },
            { tag: 'High Holy Days', title: 'Drashing Democracy 2026', body: 'Reflection with leading rabbis to inform your High Holy Day sermons.' },
          ],
          linkText: 'Register for any event',
        },
      },
      // ── 04 SPOTLIGHT ────────────────────────────────────────────
      {
        id: 'sec-spotlight',
        type: 'spotlight',
        anchor: 'spotlight',
        tocTitle: 'Partner Spotlight',
        tocSub: "NCJW Pittsburgh's Vote Block Party",
        web: {
          title: 'Partner Spotlight',
          where: 'Pittsburgh, PA',
          org: 'NCJW Pittsburgh',
          body: `<p>This spring, NCJW Pittsburgh helped more than 100 Pittsburgh-area high school students cast their first ballots through its first Vote Block Party. Newly eligible voters were able to complete and submit mail-in ballots at an official satellite voting location before joining a downtown block party featuring music, food, student speakers, elected officials, and community organizations.</p>`,
          stats: [
            { num: '100+', label: 'first-time voters' },
            { num: '1st', label: 'Vote Block Party' },
          ],
          ctaText: 'Read about this amazing initiative',
        },
        email: {
          eyebrow: 'Partner Spotlight · Pittsburgh',
          org: 'NCJW Pittsburgh',
          bodyHtml: `<p>This spring, NCJW Pittsburgh helped more than <b>100 high school students</b> cast their first ballots through its first <b>Vote Block Party</b> — complete with music, food, and student speakers.</p>`,
          linkText: 'Read the story',
        },
      },
      // ── 05 HAPPENINGS ───────────────────────────────────────────
      {
        id: 'sec-happenings',
        type: 'happenings',
        anchor: 'happenings',
        tocTitle: 'Partner Happenings',
        tocSub: 'Campaigns & grants across the network',
        web: {
          title: 'Partner Happenings',
          lead: `<p>Amplifying the democracy-related work and impact of our partners across the network.</p>`,
          cards: [
            { mark: 'N', org: 'NCJW', title: 'Vote Your Values | 2026', body: 'A campaign focused on helping people prepare to vote, protecting voter rights, and mobilizing nonpartisan voter engagement across the country — toolkits, voter IDs, letter-writing templates, and more.', cta: 'Read more', href: '#happenings' },
            { mark: 'R', org: 'RAC', title: 'Every Voice, Every Vote | 2026', body: "The Reform Movement's 2026 Every Voice, Every Vote campaign and the many ways you can take action — sending postcards to voters, educational trainings, and related conversations.", cta: 'Watch the launch', href: '#happenings' },
            { mark: 'R', org: 'Repair the World', title: 'America250 Grants | Jun 10 – Jul 10', body: '$250 micro grants, powered by Repair the World, are available for Jewish Service Corps Alliance (JSA) organizations running Jewish service projects in honor of America turning 250.', cta: 'Apply by July 10', href: '#happenings' },
          ],
        },
        email: {
          title: 'Partner Happenings',
          bodyHtml: `<p><b>NCJW</b> — Vote Your Values 2026 · <b>RAC</b> — Every Voice, Every Vote 2026 · <b>Repair the World</b> — America250 micro-grants ($250).</p>`,
          linkText: 'See what partners are up to',
        },
      },
      // ── 06 ACCORDION (web-only) ─────────────────────────────────
      {
        id: 'sec-faq',
        type: 'accordion',
        anchor: 'faq',
        tocTitle: 'Common Questions',
        tocSub: 'Everything partners ask, answered',
        web: {
          title: 'Common Questions',
          lead: 'Everything partners ask before getting involved — answered.',
          items: [
            { q: 'What does it mean that this work is “nonpartisan”?', a: `<p>We don't support candidates, parties, or partisan outcomes. Faith in Fair Elections protects the <i>process</i> — making sure every eligible voter can cast a ballot safely and have it counted. That commitment is what lets people across the political spectrum work side by side.</p>` },
            { q: 'Do I need legal or election experience to take part?', a: `<p>Not at all. Poll workers and poll chaplains receive full training before Election Day, and most roles ask only for a willingness to show up and be a calm, supportive presence. Legal support roles are reserved for licensed attorneys — but they're just one of five ways to help.</p>` },
            { q: 'Which states are the “key states” for poll chaplains?', a: `<p>We're concentrating chaplain capacity in nine priority states where a supportive presence at the polls matters most this cycle. The current list shifts as the calendar develops — <a href="#resources">reach out to our team</a> and we'll point you to where you're needed.</p>` },
            { q: 'How do Ignition Grants work?', a: `<p>Organizations in the Jewish Partnership for Democracy can apply for up to <b>$3,000</b> to support election-protection projects, drawn from a total pool of $125,000. The application is short and reviewed on a rolling basis — join the <a href="#events">June 24 info session</a> to walk through it with us.</p>` },
            { q: 'How much time does getting involved actually take?', a: `<p>As little as a single Election Day shift, or as much as ongoing relationship-building with local officials — it's entirely up to your capacity. Tell us what you can give and we'll match you to a role that fits.</p>` },
            { q: 'How do I bring this to my congregation or organization?', a: `<p>Start with our ready-to-use <a href="#resources">toolkits</a>, join the JPD Election Connection group for updates and peer ideas, and lean on our team for support. Many partners begin with one event or conversation and build from there.</p>` },
          ],
        },
        email: null,
      },
      // ── 07 QUESTION OF THE WEEK ─────────────────────────────────
      {
        id: 'sec-qotd',
        type: 'qotd',
        anchor: 'game',
        tocTitle: 'Question of the Day',
        tocSub: 'Test your civics — daily challenge',
        web: {
          kicker: 'Question of the Day',
          heading: 'Think you know your democracy?',
          blurb:
            'A quick, nonpartisan civics challenge — five questions on the institutions, rights, and history that make a more perfect union. New questions each day.',
          cardBlurb:
            'A quick, nonpartisan civics challenge — five questions on the rights and institutions behind a more perfect union.',
          cardButton: "Play today's challenge",
          questions: [
            { q: 'How many U.S. states must ratify a constitutional amendment for it to be adopted?', opts: ['Two-thirds (34)', 'Three-quarters (38)', 'A simple majority (26)'], a: '2', ex: '<b>Three-quarters — 38 of 50 states.</b> Article V requires ratification by three-fourths of the states, either through their legislatures or special conventions.' },
            { q: 'Who has the constitutional power to declare war?', opts: ['The President', 'The Supreme Court', 'Congress'], a: '3', ex: '<b>Congress.</b> Article I, Section 8 gives Congress the power to declare war, though presidents have often committed forces under other authorities.' },
            { q: 'How many members serve in the U.S. House of Representatives?', opts: ['435', '100', '538'], a: '1', ex: '<b>435 voting members</b>, apportioned among the states by population. The Senate has 100; 538 is the total number of electors in the Electoral College.' },
            { q: 'Which amendment guarantees freedom of speech, religion, press, assembly, and petition?', opts: ['The Fourth Amendment', 'The First Amendment', 'The Tenth Amendment'], a: '2', ex: '<b>The First Amendment.</b> It protects five core freedoms and is the cornerstone of civic participation in a democracy.' },
            { q: 'What is the minimum age to be elected President of the United States?', opts: ['30', '35', '40'], a: '2', ex: '<b>35 years old.</b> The Constitution also requires the President to be a natural-born citizen and a U.S. resident for at least 14 years.' },
          ],
        },
        email: null,
      },
    ],
  }
}

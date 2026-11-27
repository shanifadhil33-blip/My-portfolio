export interface FlowNode {
  title: string;
  detail: string;
  via?: string;
}

export interface Challenge {
  title: string;
  problem: string;
  decision: string;
  implementation: string;
  result: string;
}

export interface CaseStep {
  title: string;
  detail: string;
}

export interface Milestone {
  name: string;
  status: string;
}

export interface CaseStudy {
  slug: string;
  client: string;
  title: string;
  sentence: string;
  labels: string[];
  heroFlow: FlowNode[];
  overview: string[];
  responsibility: string[];
  architectureIntro: string[];
  architectureFlows: { title: string; nodes: FlowNode[] }[];
  challenges: Challenge[];
  steps: CaseStep[];
  deliveryIntro: string[];
  milestones: Milestone[];
  deliveryNotes: string[];
  outcome: string[];
  capabilities: string[];
  cta: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "multi-site-recommendation-platform",
    client: "A founder running several online consumer businesses",
    title: "One platform behind many recommendation sites",
    sentence:
      "One codebase and one database that run many branded recommendation sites. Each new site is set up and published from an admin panel, not built from scratch.",
    labels: ["Paid client work", "8 approved milestones", "Repeat client", "Client details withheld", "Not launched"],
    heroFlow: [
      { title: "Branded sites", detail: "Visitors arrive on each site." },
      { title: "One shared app", detail: "The same code serves every site.", via: "reads the active snapshot" },
      { title: "Published snapshot", detail: "One active version per site.", via: "frozen at publish" },
      { title: "Rules, then an explanation", detail: "A shortlist of one to four, then a checked explanation.", via: "after the questions" },
    ],
    overview: [
      "The client runs online businesses in several consumer areas. He wanted a branded recommendation site for each one. A visitor answers a few questions, gets a short list of options with a plain explanation, and is passed to the right specialist provider.",
      "He did not want a new build every time. Adding a site had to be a setup job, and he had to configure, publish and roll a site back himself. The first area covered setting up a company abroad, with more planned.",
    ],
    responsibility: [
      "I owned the engineering from the brief through each release: milestones, architecture, the database and every migration, access control, the admin and publishing workflows, the questionnaire, the rules and the explanation checks, security hardening, testing, deployment on serverless hosting, and the written communication.",
      "I wrote the specifications, reviewed every change, tested on real devices and signed off each release.",
      "The client owned the business rules and the principles the recommendations had to follow. He tested every release himself on a laptop and a phone. Every production account stayed in his name.",
    ],
    architectureIntro: [
      "A site is a database row plus its configuration. Nothing in the code changes based on which site is being served. Publishing freezes that configuration into a read only snapshot. A separate step chooses which snapshot visitors see.",
      "Visitors answer the questionnaire. A rules engine picks the shortlist. The explanation is built only from verified records. Every result keeps a trail of the answers, the rules, the options and the sources.",
    ],
    architectureFlows: [
      {
        title: "How a site is prepared",
        nodes: [
          { title: "Admin console", detail: "Super admin and site admin." },
          { title: "Config tables", detail: "Postgres with row level security on every table.", via: "configure" },
          { title: "Published snapshot", detail: "Frozen. A database trigger blocks edits and deletes.", via: "publish" },
          { title: "Branded sites", detail: "One shared app. Visitors see only the active snapshot.", via: "activate" },
        ],
      },
      {
        title: "How a visitor gets a result",
        nodes: [
          { title: "Questionnaire", detail: "Branching questions, with progress." },
          { title: "Rules engine", detail: "Picks a shortlist of one to four. Commercial terms never decide it.", via: "answers" },
          { title: "Knowledge records", detail: "Verified sources, each with a date.", via: "only these records" },
          { title: "Explanation", detail: "Language model integration. The server checks the answer before it is shown.", via: "checked" },
          { title: "Runs and routing", detail: "A full trail, then the visitor is passed to a provider.", via: "stored" },
        ],
      },
    ],
    challenges: [
      {
        title: "Many sites, and no code per site",
        problem: "Each new area would have meant a new build.",
        decision: "A site is configuration, never code.",
        implementation:
          "Shared libraries of providers, products, questions, scoring methods and prompt templates. A site admin attaches them in the admin panel.",
        result:
          "The client set up a full site himself and tested it on an area the model was not designed around. He found no failures in the core flows.",
      },
      {
        title: "Publishing that cannot change a site mid edit",
        problem: "An edit must not change what a visitor sees halfway through.",
        decision: "Publishing and choosing the active version are two separate steps.",
        implementation:
          "Publishing freezes the configuration into a snapshot. A database trigger makes that snapshot impossible to edit or delete. Any earlier version can be made active again.",
        result: "Accepted in the configuration and publishing milestone.",
      },
      {
        title: "Isolation the database enforces",
        problem: "One database holds many sites and many admins.",
        decision: "Enforce access in the database, not only in the app.",
        implementation:
          "Row level security on every table. Roles are checked in the server and again in the database. After the first contract I audited my own work, found four rules that lived only in the app, and raised them before visitors used the system.",
        result: "Those four rules were fixed in the first milestone of the next contract.",
      },
      {
        title: "Recommendations you can explain",
        problem: "An explanation must not invent facts, and commercial terms must not decide the shortlist.",
        decision: "The rules choose. The language model only explains.",
        implementation:
          "The rules engine picks one to four options. The explanation uses only verified, in date records. The server checks every answer for citations, countries outside the brief, commercial terms and links, and uses plain wording when the evidence is thin.",
        result: "Accepted in the knowledge and explanation milestone.",
      },
    ],
    steps: [
      { title: "Set up the site", detail: "Questions, providers, products, scoring and prompts, all in the admin panel." },
      { title: "Publish", detail: "The configuration freezes into a snapshot." },
      { title: "Activate", detail: "One snapshot becomes the version visitors see." },
      { title: "Ask", detail: "The visitor answers the branching questionnaire." },
      { title: "Choose", detail: "The rules engine picks a shortlist of one to four." },
      { title: "Explain", detail: "An explanation is written only from verified records and checked on the server." },
      { title: "Record", detail: "The run is stored with its trail, and the visitor is passed to a specialist provider." },
    ],
    deliveryIntro: [
      "Eight approved milestones across two contracts, from June to October 2026. The first contract closed with a public 5.0 review and an immediate rehire.",
    ],
    milestones: [
      { name: "Architecture and schema with row level isolation", status: "Approved Jun 5" },
      { name: "Database foundation", status: "Approved Jun 15" },
      { name: "Admin core", status: "Approved Jul 9" },
      { name: "Configuration and publishing", status: "Approved Jul 25" },
      { name: "Hardening and a database region move", status: "Approved Aug 26" },
      { name: "Visitor recommendation flow", status: "Approved Sep 20" },
      { name: "Recommendation logic and supplier data", status: "Approved Oct 9" },
      { name: "Knowledge library and explanations", status: "Approved Oct 23" },
    ],
    deliveryNotes: [
      "31 migrations. 586 unit tests.",
      "Every schema change was a reviewed SQL file with a preflight check, a verify step and a rollback. Bad import rows are flagged, never quietly fixed.",
      "Error monitoring is in place. I do not claim the product has launched. That decision is his.",
    ],
    outcome: [
      "The first contract closed with a public 5.0 review, and he hired me again straight away for the next phase. The second contract grew as he added another branded site and the cited explanations.",
      "He tested every release himself, against principles he set in writing, and I reported every step in writing. He wants to keep me on the technical and integration side. Launch remains his decision.",
    ],
    capabilities: [
      "Postgres data modelling",
      "Row level security",
      "Versioned publishing and rollback",
      "Admin tools for non technical owners",
      "Rules engines",
      "Language model integration with server side checks",
      "Validated data import",
      "Security hardening",
      "Migration discipline",
      "Written client communication",
    ],
    cta: "Building one engine behind many brands, or recommendations that have to explain themselves?",
  },
  {
    slug: "at-home-vision-screening",
    client: "An online eye care business run by an optometrist",
    title: "Vision screening at home, in the browser",
    sentence:
      "A browser check of whether glasses or lenses still give 6/6 vision, with letters drawn at true physical size on any screen. Screening, never diagnosis.",
    labels: ["Paid client work", "7 approved milestones", "Repeat client", "Client details withheld"],
    heroFlow: [
      { title: "Laptop", detail: "Shows the chart at a calculated size." },
      { title: "Phone", detail: "The answer pad, paired by QR code.", via: "paired" },
      { title: "Server", detail: "Owns the session. Answers are safe to send twice.", via: "kept in sync" },
      { title: "Postgres", detail: "A private schema, reached through narrow functions.", via: "row level security" },
    ],
    overview: [
      "An online eye care business run by a qualified optometrist wanted customers to check their vision at home, in a browser, on their own laptop and phone. The hard part was physical. A letter has to be a precise size at a known distance, on a screen the software does not already know.",
      "The work started with a feasibility phase on a 15 day deadline, then continued in small steps. Each step was approved before the next began.",
    ],
    responsibility: [
      "I owned the architecture and every technical decision, the scoping of each step, the database, deployment on serverless hosting, and all client communication. I wrote the specifications, reviewed every change, tested on real devices and signed off each release. The device testing was on real laptops and phones, at taped distances.",
      "The optometrist owned every clinical rule: how the test progresses and stops, how it is scored, the wording of the result, and how long records are kept. Every rule was agreed in writing before I built it.",
    ],
    architectureIntro: [
      "The laptop shows the chart and the phone is the answer pad, paired with a QR code. The server owns the session, so a reload or a lost connection does not corrupt a test, and answers are safe to send twice.",
      "Letter size is pure maths from the calibration, pinned by unit tests. Data sits in a private database schema. The app reaches it only through a few narrow functions, with row level security.",
    ],
    architectureFlows: [
      {
        title: "The two devices",
        nodes: [
          { title: "Laptop", detail: "Draws the chart. Letter size comes from the calibration." },
          { title: "Bank card calibration", detail: "Two independent matches. A third runs if they disagree by about 2 percent.", via: "before the test" },
          { title: "Phone", detail: "Answer pad. Pairing is a QR code.", via: "paired" },
          { title: "Distance", detail: "The customer measures 3 or 2 metres and confirms it.", via: "confirmed" },
        ],
      },
      {
        title: "What the server owns",
        nodes: [
          { title: "Session", detail: "The server holds the state. Answers are safe to resend." },
          { title: "Sync", detail: "Updates go out as they happen, with polling if that path drops.", via: "kept together" },
          { title: "Private schema", detail: "Postgres with row level security. The app uses narrow functions only.", via: "stored" },
          { title: "Movement check", detail: "The phone camera watches a marker on the screen. In testing, not delivered.", via: "separate from the approved work" },
        ],
      },
    ],
    challenges: [
      {
        title: "True size on an unknown screen",
        problem: "A browser does not know how big its pixels are.",
        decision: "Calibrate against a bank card, something the customer already has.",
        implementation:
          "Two independent card matches, and a third when they disagree. The size estimate is corrected when browser zoom is not 100 percent, and card matching does not misfire on a touchscreen.",
        result:
          "A check page measured the drawn letters within one screen pixel on Chrome, Firefox and Safari. The testing milestone was approved.",
      },
      {
        title: "Two devices, one test",
        problem: "The chart and the answers sit on different devices.",
        decision: "The server owns the session, not either device.",
        implementation:
          "QR pairing, updates with a polling fallback, and answers that are safe to resend through reloads, tab switches and zoom changes.",
        result: "Delivered as part of the quick test. I do not claim that test is launched.",
      },
      {
        title: "Clinical rules that belong to the optometrist",
        problem: "The test has to follow how he actually works.",
        decision: "Every clinical rule comes from him, in writing, before I build it.",
        implementation:
          "The test starts at 6/12, with five letters at each level. It moves finer while at least three of five are read, and larger if the first level is missed. If the screen cannot draw the smallest letters, a separate display limited result is used.",
        result: "Approved as the final result milestone.",
      },
      {
        title: "When the results looked too good",
        problem: "Scores on the screen beat a paper chart.",
        decision: "Rule out letter size before changing anything else.",
        implementation:
          "His calipers matched the drawn letters within 0.1 to 0.2 mm. I then built a staff only Landolt C comparison: one C, four gap directions, answered on the phone, with two practice letters. Guessing alone passes a size one time in 64.",
        result: "Approved on Nov 2.",
      },
      {
        title: "Distance and movement",
        problem: "The customer has to stay at the measured distance.",
        decision: "Confirm the distance with the customer, then watch for movement instead of trusting the first mark.",
        implementation:
          "The distance is marked and confirmed. The phone camera watches a marker of known size on the screen and compares each view with the first. If the screen cannot draw the adjusted letter, the test pauses. The aim is about 1 cm at 2 metres.",
        result: "In testing. Not delivered.",
      },
    ],
    steps: [
      { title: "Calibrate", detail: "Match a bank card on the screen, twice. A third match runs if the first two disagree." },
      { title: "Pair", detail: "Scan the QR code so the phone becomes the answer pad." },
      { title: "Set the distance", detail: "Measure 3 or 2 metres and confirm." },
      { title: "Read", detail: "The test starts on its own. The laptop shows the letters and the phone takes the answers." },
      { title: "Result", detail: "The wording was agreed with the optometrist. A separate result is used when the screen cannot draw the smallest letters." },
    ],
    deliveryIntro: [
      "Seven approved milestones, from September to November 2026. Movement detection was asked for during the build and is still in testing.",
    ],
    milestones: [
      { name: "Feasibility and prototype", status: "Approved Sep 14" },
      { name: "Defects and corrections", status: "Approved Sep 26" },
      { name: "Two independent card matches", status: "Approved Sep 28" },
      { name: "Final result and display limited wording", status: "Approved Oct 8" },
      { name: "Browser and device testing", status: "Approved Oct 14" },
      { name: "Establishing the test distance", status: "Approved Oct 27" },
      { name: "Landolt C comparison test", status: "Approved Nov 2" },
      { name: "Movement detection from the baseline", status: "In testing" },
    ],
    deliveryNotes: [
      "437 unit tests. Letter size is covered by those tests, and the check page measured letters within one screen pixel on Chrome, Firefox and Safari.",
      "The feasibility prototype was ready on the deadline day, and the calibration was signed off in writing.",
      "Movement detection is in testing. It is not delivered, and I do not claim any part of this work is launched.",
    ],
    outcome: [
      "He was already working with me on a separate platform when he hired me for this. After the feasibility sign off, the approved work ran through seven milestones, and he asked for the movement check during the build.",
      "That check is still in testing. Customer usage is his, and it is not shown here.",
    ],
    capabilities: [
      "Precise browser rendering",
      "Device calibration",
      "Two device sync",
      "Camera input",
      "Session state and recovery",
      "Checks on Chrome, Firefox and Safari",
      "Working to a clinician's rules",
      "Honest status reporting",
    ],
    cta: "Have a feature that has to work on real devices, in the real world?",
  },
];

export function caseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}

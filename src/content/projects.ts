/**
 * Projects shown on /projects. Order here is the order on the page.
 * A project with `detail` gets its own page at /projects/<slug>;
 * one without it shows as a "Details coming soon" card.
 */

export type ProjectFilter = "tech" | "hands";

export type FlowStep = { via?: string; title: string; text?: string };

export type Project = {
  slug: string;
  filter: ProjectFilter;
  kind: string;
  title: string;
  summary: string;
  tags: string[];
  /** Photo shown across the top of the project's card and first on its page (files in /public/images/projects). */
  image?: { src: string; alt: string; focus?: string };
  /** More photos shown after `image` on the project's page. */
  gallery?: { src: string; alt: string }[];
  detail?: {
    lede: string;
    /** Empty list: no facts row. */
    facts: { label: string; value: string; href?: string }[];
    /** Empty list: a "Highlights" placeholder until there's real text. */
    highlights: string[];
    /** Optional "Features" list shown after Highlights. */
    features?: string[];
    flowTitle?: string;
    /** Small facts shown under the flow diagram (e.g. compatibility). */
    flowFacts?: { label: string; value: string }[];
    flow?: FlowStep[];
    deepDive?: string[];
    /** A placeholder string, or a list of bullet points once written. Leave out to hide the section. */
    learned?: string | string[];
  };
};

export const projectFilters: { key: "all" | ProjectFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "tech", label: "Technical" },
  { key: "hands", label: "Hands-on" },
];

export const projectsIntro =
  "Things I've built and figured out, both technical and creative. Select a project to see more details.";

const learnedPlaceholder = "Placeholder: what was hardest, how I figured it out, and what I'd do differently.";

export const projects: Project[] = [
  {
    slug: "dipstick",
    filter: "tech",
    kind: "iPhone app, in development",
    title: "Dipstick: Car Maintenance and MPG Tracker",
    summary: "An iPhone app for tracking fill-ups and maintenance on my cars, with automatic MPG and city/highway detection.",
    tags: ["Swift", "SwiftUI", "iOS"],
    image: {
      src: "/images/projects/dipstick.jpg",
      alt: "Four Dipstick screens: the home screen with three cars and service lamps, the fuel log, the maintenance log, and MPG stats",
    },
    detail: {
      lede: "My maintenance records were spread across paper notebooks and iPhone Notes, and I was working out MPG by hand after every fill-up, so I'm building an app that puts it all in one place and does the math for me.",
      facts: [
        { label: "My role", value: "Everything: design and code" },
        {
          label: "Built with",
          value: "Swift, SwiftUI, SwiftData, Swift Charts, Core Location, App Intents, VisionKit",
        },
        {
          label: "Code",
          value: "github.com/colinfriedel/Dipstick",
          href: "https://github.com/colinfriedel/Dipstick",
        },
      ],
      highlights: [
        "I use it day to day on my own cars while I keep adding features",
        "Calculates MPG automatically between full tanks, with partial fills rolling into the next full tank",
        "Tells me when service is due by miles or time, with due-soon and overdue items for every car on the home screen",
        "No backend: all data stays on the phone, stored so iCloud sync can be added later",
        "Unit tests cover the core logic: MPG, due dates, stats, CSV, trip classification, and pump-screen parsing",
      ],
      features: [
        "Fuel log with MPG per tank, average MPG, and cost per mile",
        "Maintenance log with parts, part numbers, costs, search, and filters by service type",
        "Service reminders by miles and/or time",
        "Stats: MPG trend chart and monthly fuel spend",
        "CSV import and export for existing records and backups",
        "In testing: trips start and stop on their own when the phone connects to the car",
        "In testing: pump scanning, which reads gallons and total off the pump's screen with the camera",
        "Planned: iCloud sync and importing maintenance schedules from owner's manuals",
      ],
      flowTitle: "How city/highway MPG works (in testing)",
      flow: [
        { via: "CarPlay or Bluetooth", title: "Phone connects to the car", text: "A Shortcuts automation starts the trip and recognizes which car it is" },
        { via: "GPS speed", title: "Each half-mile is classified", text: "City or highway. Only mile totals are saved, never the route" },
        { title: "Fill-up", text: "Gallons logged by hand or scanned from the pump" },
        { title: "City, highway, and combined MPG", text: "Solved across all tracked tanks from each tank's mix and gallons" },
      ],
    },
  },
  {
    slug: "volume-switch",
    filter: "tech",
    kind: "Personal build",
    title: "Arduino Volume Switch for My Car",
    summary: "A physical volume control for my Acura, built from a sunroof switch and an Arduino.",
    tags: ["Arduino", "Hardware", "Problem solving"],
    image: {
      src: "/images/projects/volume-knob.jpg",
      alt: "The sunroof switch installed as a volume control in the Acura's dashboard switch panel",
    },
    detail: {
      lede: "My 2003 Acura RSX has no steering wheel controls, so I built a physical volume control out of a junkyard sunroof switch and an Arduino.",
      facts: [
        { label: "My role", value: "Everything: design, wiring, and code" },
        {
          label: "Built with",
          value: "Arduino Nano clone (ATmega328P), factory sunroof switch, 12V to 5V buck converter, 1A inline fuse",
        },
        {
          label: "Code",
          value: "github.com/colinfriedel/jvc-carplay-remote",
          href: "https://github.com/colinfriedel/jvc-carplay-remote",
        },
      ],
      highlights: [
        "Repurposed a 2003 Acura RSX sunroof switch (part M20778) and mounted it in the blank fog light switch cutout, since my car has no fog lights",
        "An Arduino Nano clone (ATmega328P) reads the switch inputs and sends volume up and down commands to the head unit's steering wheel control input",
        "Powered from the car's 12V cigarette lighter wiring through a buck converter that steps it down to 5V",
      ],
      // Gestures from the project README (github.com/colinfriedel/jvc-carplay-remote).
      features: [
        "Tap: volume up or down one step",
        "Long hold: continuous volume up or down",
        "Short hold, then release: next or previous track",
        "Double tap up: Siri",
        "Double tap down: mute",
      ],
      flowTitle: "How it works",
      flowFacts: [{ label: "Works with", value: "JVC KW-M560BT head unit" }],
      flow: [
        { title: "Sunroof switch", text: "Press up or down, mounted where the fog light switch would go" },
        { via: "Pins D3 and D5", title: "Arduino Nano clone (ATmega328P)", text: "Reads the switch and decides which command to send" },
        { via: "Pin D7", title: "JVC KW-M560BT", text: "Receives the volume commands on its steering wheel remote wire" },
      ],
      deepDive: [
        "Pin layout: switch down on D3, switch up on D5, signal out to the JVC on D7",
        "The timing and basic volume codes came from an AVForums thread. I found the rest by scanning all 128 codes (0x00 to 0x7F) on the head unit with a scanner tool, sending one code at a time and watching the screen. That found mute (0x0E), the voice assistant (0x1A), and CarPlay track skip forward and back (0x12 and 0x13), which the thread didn't cover for this model",
        "Mute needed a single-repeat send, otherwise it undid itself instantly. No scanned code pauses playback, so mute is the closest option",
      ],
      learned: [
        "Reading signals from a rocker switch through an Arduino",
        "Improving my soldering skills",
        "Testing circuits with a multimeter",
      ],
    },
  },
  {
    slug: "reef",
    filter: "tech",
    kind: "Senior design project",
    title: "Reef Monitoring Communication System",
    summary:
      "Underwater sensor data sent through the water by acoustic modem, then to the cloud over cellular for live monitoring.",
    tags: ["Embedded", "Serial protocols", "Cellular IoT"],
    image: {
      src: "/images/projects/reef.jpg",
      alt: "The reef monitoring hardware on a dock: a clear sensor housing, a tether reel and cabling on an aluminum frame",
    },
    detail: {
      lede: "Getting data from an underwater reef sensor network onto a live web page by chaining serial, acoustic, and cellular links together.",
      facts: [
        { label: "My role", value: "Led the software and data pipeline" },
        {
          label: "Built with",
          value: "RS-485 and RS-232 serial, Feather Adalogger M0, Succorfish Delphis acoustic modems, Particle Boron 4G LTE",
        },
        {
          label: "Code",
          value: "github.com/colinfriedel/IRIS-Senior-Design",
          href: "https://github.com/colinfriedel/IRIS-Senior-Design",
        },
      ],
      highlights: [
        "Led the software and data pipeline, covering the whole path from underwater sensor to the cloud",
        "Connected three different kinds of links: wired serial (RS-485 and RS-232), acoustic signals through water, and 4G LTE cellular",
        "Built for the Palos Verdes artificial reef, with the data feeding a public Google Site for live monitoring",
      ],
      flowTitle: "How the data travels",
      flow: [
        { title: "Underwater sensor network", text: "Collects the reef data" },
        { via: "RS-485", title: "Feather Adalogger M0", text: "Pulls the data in and buffers it locally" },
        { via: "RS-232", title: "Acoustic modem", text: "Succorfish Delphis, driven by the converted signal" },
        { via: "Acoustic signals through the water column", title: "Second acoustic modem", text: "Receives the transmission" },
        { via: "RS-232 and RS-485", title: "Feather Adalogger M0", text: "An identical chain on the receiving side" },
        { title: "Particle Boron 4G LTE", text: "Programmed to publish the data to the cloud" },
        { via: "4G LTE cellular", title: "Cloud and Google Sheet", text: "The published data feeds a Google Sheet" },
        { title: "Public Google Site", text: "Embeds the sheet for live monitoring" },
      ],
      deepDive: [
        "Wired and programmed an RS-485 interface to pull data from the underwater sensor network into a Feather Adalogger M0 for local buffering",
        "Converted the signal to RS-232 to drive a Succorfish Delphis acoustic modem, transmitting it through the water column to a second acoustic modem and back through an identical RS-232/RS-485/Feather Adalogger M0 chain",
        "Programmed a Particle Boron 4G LTE module (404X) to publish the received data to the cloud, feeding a Google Sheet embedded in a public Google Site for live monitoring",
      ],
      learned: [
        "Designing, implementing, and debugging different data transmission protocols (serial, acoustic, and cellular)",
        "Working with an interdisciplinary team on a common goal with differing deadlines and progress checkpoints",
        "Waterproofing microcontrollers, electrical connections, and data cables",
        "Managing a materials budget across multiple funding sources",
      ],
    },
  },
  {
    slug: "radio",
    filter: "tech",
    kind: "Software project",
    title: "Automatic Radio Recording System",
    summary: "A cloud service that records every show on the station and emails it to the DJ, with no one touching it.",
    tags: ["Python", "AWS"],
    image: {
      src: "/images/projects/radio.jpg",
      alt: "Working the mixing board in the KSCU radio station studio",
      focus: "60% 50%",
    },
    detail: {
      lede: "A cloud service that records each show on the radio station and emails the recording to the DJ who was on air.",
      facts: [
        { label: "My role", value: "Built the service and its cloud storage pipeline" },
        { label: "Built with", value: "Python, AWS EC2, AWS S3, ffmpeg, Spinitron API, yagmail" },
        {
          label: "Code",
          value: "github.com/colinfriedel/KSCU-Show-Recorder",
          href: "https://github.com/colinfriedel/KSCU-Show-Recorder",
        },
      ],
      highlights: [
        "Built for KSCU 103.3 FM, Santa Clara University's student-run radio station, after a previous recording system had gone down and DJs were no longer receiving recordings of their shows",
        "A Python service on AWS EC2 that runs continuously and records each show from the station's live stream",
        "Pulls the show schedule, with each DJ's name and email, from the Spinitron API to know who is on air",
        "Stores each recording in AWS S3 and emails the DJ a link to download it",
        "Runs unattended 24/7; the one manual step is creating the new schedule each quarter",
        "Distributed recordings to 130+ active DJs and volunteers over several months, and the recording and distribution logic has since been adopted and extended as part of a broader station management platform",
      ],
      flowTitle: "How it works",
      flow: [
        { title: "Live station stream", text: "KSCU's on-air broadcast" },
        { title: "Python service on AWS EC2", text: "Records each show with ffmpeg, using the schedule to know who is on air" },
        { title: "AWS S3", text: "Stores the recording" },
        { via: "Email (yagmail)", title: "The DJ's inbox", text: "A link to download their show" },
      ],
      learned: [
        "Using AWS: EC2 to host an always-on service and S3 for cloud storage",
        "Building and testing an automated system that runs unattended",
        "Working with Python libraries like yagmail and boto3",
      ],
    },
  },
  {
    slug: "floor-mats",
    filter: "hands",
    kind: "Hands-on",
    title: "Custom Persian-Rug Floor Mats",
    summary:
      "Custom floor mats for my car, cut from a Persian rug and bound on my sewing machine.",
    tags: ["Car", "Sewing", "DIY"],
    image: {
      src: "/images/projects/floor-mats-front.jpg",
      alt: "Finished Persian-rug floor mats with red binding in the driver's footwell, seen through the open door of the red Acura RSX",
    },
    gallery: [
      { src: "/images/projects/floor-mats-before.jpg", alt: "The RSX's original worn grey carpet floor mats" },
      {
        src: "/images/projects/floor-mats-rear.jpg",
        alt: "The rear floor mat in the same rug pattern, bound in red, seen past the folded-forward front seat",
      },
      {
        src: "/images/projects/floor-mats.jpg",
        alt: "Close-up of the driver's mat showing the sewn red webbing binding, with the rug's border running diagonally",
      },
      { src: "/images/projects/floor-mats-rug.jpg", alt: "The vintage Persian-style rug before cutting: cream field, red and green florals, red border" },
    ],
    detail: {
      lede: "My RSX still had its original worn grey mats. I wanted something custom, so I made my own from a decorative Persian rug instead of buying traditional mats.",
      facts: [
        { label: "My role", value: "Design, tracing, cutting, and sewing" },
        {
          label: "Built with",
          value: "Vintage Persian-style area rug, red polypropylene webbing, upholstery thread, metal grommets, Brother XR-7700 sewing machine",
        },
        { label: "Mats made", value: "3: driver, passenger, and rear" },
      ],
      highlights: [
        "Got the rug for free on Facebook Marketplace and chose it because its reds match the car's paint",
        "Traced the original mats onto the back of the rug to get the exact shapes",
        "Cut from the back with a utility knife so the pile didn't get shaved at the edges",
        "Bound every edge in red webbing on my Brother XR-7700 with a walking foot and a heavy-duty needle, rounding the corners as I went",
        "Accidentally ordered 1\" webbing instead of the 1.5\" I planned on, which left almost no room to catch both sides, so I trimmed the pile closer and stitched near the inner edge to keep the binding even",
        "Added grommets to the driver's mat for the factory retention hooks and made sure the pedals still had full travel",
      ],
      flowTitle: "How I made them",
      flow: [
        { title: "Trace", text: "Original mats traced onto the back of the rug" },
        { title: "Cut", text: "From the back, with a utility knife" },
        { title: "Bind", text: "Red webbing sewn around every edge" },
        { title: "Install grommets", text: "For the factory retention hooks" },
        { title: "Fit in car", text: "Checked pedal travel" },
      ],
      learned: [
        "Sewing thick, multi-layer stacks on a home sewing machine",
        "Balancing heavy upholstery thread on top against all-purpose thread in the bobbin",
        "Installing metal grommets in carpet",
      ],
    },
  },
  {
    slug: "jean-hem",
    filter: "hands",
    kind: "Hands-on",
    title: "Hemming My Jeans",
    summary: "Teaching myself to hem a pair of jeans.",
    tags: ["Sewing", "Learning a new skill"],
    image: { src: "/images/projects/jean-hem.jpg", alt: "The hemmed legs of a pair of jeans on a windowsill", focus: "40% 60%" },
    detail: {
      lede: "Teaching myself to hem a pair of jeans.",
      facts: [],
      highlights: [],
      learned: learnedPlaceholder,
    },
  },
  {
    // Placeholder wording until Colin sends his own title and summary.
    slug: "jean-pockets",
    filter: "hands",
    kind: "Hands-on",
    title: "Extending My Jean Pockets",
    summary: "Extending the pockets on a pair of jeans.",
    tags: ["Sewing", "Learning a new skill"],
    image: { src: "/images/projects/jean-pockets.jpg", alt: "Jeans turned inside out, showing the lengthened pocket linings" },
    detail: {
      lede: "Extending the pockets on a pair of jeans.",
      facts: [],
      highlights: [],
      learned: learnedPlaceholder,
    },
  },
  {
    slug: "music",
    filter: "hands",
    kind: "Creative",
    title: "Music Production",
    summary: "Recording and producing my own tracks.",
    tags: ["Music", "Recording"],
  },
];

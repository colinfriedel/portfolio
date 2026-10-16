/**
 * Projects shown on /projects. Order here is the order on the page.
 * A project with `detail` gets its own page at /projects/<slug>;
 * one without it shows as a "Details coming soon" card.
 */

export type ProjectFilter = "tech" | "hands";

export type FlowStep = { via?: string; title: string; text: string };

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
    /** A placeholder string, or a list of bullet points once written. */
    learned: string | string[];
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
    title: "New Floor Mats for My Car",
    summary: "Making new floor mats for my car.",
    tags: ["Car", "DIY"],
    image: { src: "/images/projects/floor-mats.jpg", alt: "A patterned rug floor mat in the driver's footwell of the Acura" },
    gallery: [
      { src: "/images/projects/floor-mats-front.jpg", alt: "The driver's side floor mat with the door open, showing the Acura's red paint" },
      { src: "/images/projects/floor-mats-rear.jpg", alt: "The rear floor mat behind the front passenger seat" },
    ],
    detail: {
      lede: "Making new floor mats for my car.",
      facts: [],
      highlights: [],
      learned: learnedPlaceholder,
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

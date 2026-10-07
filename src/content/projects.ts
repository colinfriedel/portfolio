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
  detail?: {
    lede: string;
    facts: { label: string; value: string; href?: string }[];
    highlights: string[];
    flowTitle?: string;
    flow?: FlowStep[];
    deepDive?: string[];
    learned: string;
  };
};

export const projectFilters: { key: "all" | ProjectFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "tech", label: "Technical" },
  { key: "hands", label: "Hands-on" },
];

export const projectsIntro =
  "Things I've built and figured out, from embedded systems to sewing. Open any project for the full story.";

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
    detail: {
      lede: "Getting data off an underwater reef sensor network and onto a live web page, by chaining serial, acoustic, and cellular links together.",
      facts: [
        { label: "My role", value: "Led the software and data pipeline" },
        {
          label: "Built with",
          value: "RS-485 and RS-232 serial, Feather Adalogger M0, Succorfish Delphis acoustic modem, Particle Boron 4G LTE",
        },
        {
          label: "Code",
          value: "github.com/colinfriedel/IRIS-Senior-Design",
          href: "https://github.com/colinfriedel/IRIS-Senior-Design",
        },
      ],
      highlights: [
        "Led the software and data pipeline, covering the whole path from underwater sensor to the cloud",
        "Connected three different kinds of links: wired serial (RS-485 and RS-232), sound through water, and 4G LTE cellular",
        "Built for a reef off Palos Verdes, with the data feeding a public Google Site for live monitoring",
      ],
      flowTitle: "How the data travels",
      flow: [
        { title: "Underwater sensor network", text: "Collects the reef data" },
        { via: "RS-485", title: "Feather Adalogger M0", text: "Pulls the data in and buffers it locally" },
        { via: "RS-232", title: "Acoustic modem", text: "Succorfish Delphis, driven by the converted signal" },
        { via: "Sound through the water column", title: "Second acoustic modem", text: "Receives the transmission" },
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
      learned: learnedPlaceholder,
    },
  },
  {
    slug: "knob",
    filter: "tech",
    kind: "Personal build",
    title: "Arduino Volume Knob for My Car",
    summary: "A physical volume knob for my Acura, built from a sunroof switch and an Arduino.",
    tags: ["Arduino", "Hardware", "Problem solving"],
    detail: {
      lede: "My Acura has no steering wheel controls, so I built a physical volume knob out of a sunroof switch and an Arduino.",
      facts: [
        { label: "My role", value: "Everything: design, wiring, and code" },
        { label: "Built with", value: "Arduino Nano, 2003 Acura RSX sunroof switch, 12V to 5V buck converter" },
        { label: "Works with", value: "JVC KW-M560BT head unit" },
      ],
      highlights: [
        "Repurposed a 2003 Acura RSX sunroof switch (part M20778) and mounted it in the blank fog light switch cutout, since the car has no fog lights",
        "An Arduino Nano reads the switch and sends volume up and down commands to the head unit's steering wheel control input",
        "Powered from the car's 12V wiring through a buck converter that steps it down to 5V",
      ],
      flowTitle: "How it works",
      flow: [
        { title: "Sunroof switch", text: "Press up or down, mounted where the fog light switch would go" },
        { via: "Pins D3 and D5", title: "Arduino Nano", text: "Reads the switch and decides which command to send" },
        { via: "Pin D7", title: "JVC KW-M560BT", text: "Receives the volume commands on its steering wheel remote wire" },
      ],
      deepDive: [
        "Pin layout: switch down on D3, switch up on D5, signal out to the JVC on D7",
        "Testing the head unit turned up other working commands too: track skip forward and back on 0x12 and 0x13 (works over USB CarPlay), mute on 0x0E, and the voice assistant on 0x1A",
        "Mute needed a single-repeat send, otherwise it undid itself instantly",
        "The Arduino is powered from the cigarette lighter wire through a 12V to 5V buck converter with a USB output",
      ],
      learned: learnedPlaceholder,
    },
  },
  {
    slug: "radio",
    filter: "tech",
    kind: "Software project",
    title: "Automatic Radio Recording System",
    summary: "A cloud service that records every hour of the station and emails it to the DJ, with no one touching it.",
    tags: ["Python", "AWS"],
    detail: {
      lede: "A cloud service that records each hour of the radio station and emails the recording to the DJ who was on air.",
      facts: [
        { label: "My role", value: "Built the service and its cloud storage pipeline" },
        { label: "Built with", value: "Python, AWS EC2, AWS S3" },
        {
          label: "Code",
          value: "github.com/colinfriedel/KSCU-Show-Recorder",
          href: "https://github.com/colinfriedel/KSCU-Show-Recorder",
        },
      ],
      highlights: [
        "A Python service on AWS EC2 that runs continuously and records the station's output every hour",
        "Emails each recording straight to the DJ who was on air, in a downloadable format",
        "Recordings go through a cloud storage pipeline on AWS S3, and the whole thing runs unattended 24/7 with no manual steps",
      ],
      learned: learnedPlaceholder,
    },
  },
  {
    slug: "jeans",
    filter: "hands",
    kind: "Hands-on",
    title: "Hemming My Jeans",
    summary: "Teaching myself to hem a pair of jeans.",
    tags: ["Sewing", "Learning a new skill"],
  },
  {
    slug: "floor-mats",
    filter: "hands",
    kind: "Hands-on",
    title: "New Floor Mats for My Car",
    summary: "Making new floor mats for my car.",
    tags: ["Car", "DIY"],
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

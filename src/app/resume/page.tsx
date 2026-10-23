import type { Metadata } from "next";
import { Panel } from "@/components/Panel";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Resume" };

export default function ResumePage() {
  return (
    <Panel
      label="Resume"
      doc
      actions={
        <a className="dl" href={site.resumePdf} download>
          Download PDF
        </a>
      }
    >
      <div className="doc-head">
        <div>
          <h2>Colin Friedel</h2>
          <p className="contact">
            <span>San Ramon, CA</span>
            <a href="mailto:colin@friedelsweb.com">colin@friedelsweb.com</a>
            <a href="https://www.linkedin.com/in/colinfriedel" target="_blank" rel="noopener">
              LinkedIn
            </a>
            <a href="https://github.com/colinfriedel" target="_blank" rel="noopener">
              GitHub
            </a>
          </p>
        </div>
      </div>

      <section>
        <h3>Education</h3>
        <div className="entry">
          <div className="row">
            <strong>Santa Clara University</strong>
            <span className="when">June 2026</span>
          </div>
          <div className="sub2">B.S. Computer Science and Engineering &middot; Santa Clara, CA</div>
          <p className="note">
            Certifications: AI Fluency Framework &amp; Foundations (Anthropic, June 2026) &middot; Claude 101 (Anthropic,
            July 2026)
          </p>
          <p className="note">
            Relevant coursework: Software Engineering, Operating Systems, AI, Algorithms, Computer Networks, Embedded
            Systems
          </p>
        </div>
      </section>

      <section>
        <h3>Projects</h3>
        <div className="entry">
          <div className="row">
            <strong>Reef Monitoring Communication System</strong>
          </div>
          <div className="sub2">
            C, RS-485, RS-232, Acoustic Modems, Cellular &middot;{" "}
            <a href="https://github.com/colinfriedel/IRIS-Senior-Design" target="_blank" rel="noopener">
              github.com/colinfriedel/IRIS-Senior-Design
            </a>
          </div>
          <ul>
            <li>
              Led the software and data pipeline for an underwater reef sensor system designed for the Palos Verdes
              Reef, coordinating cellular, acoustic, and serial communication from sensor to cloud, and validated it
              through pool and harbor testing
            </li>
            <li>
              Wired and programmed an RS-485 interface to buffer sensor data on a Feather Adalogger M0, then converted it
              to RS-232 to drive a Succorfish Delphis acoustic modem that transmitted it through the water to a matching
              receiving chain
            </li>
            <li>Programmed a Particle Boron 4G LTE module (404X) to publish the data to a Google Sheet on a public Google Site</li>
          </ul>
        </div>
        <div className="entry">
          <div className="row">
            <strong>Dipstick: Car Maintenance and Mileage Tracker</strong>
          </div>
          <div className="sub2">
            Swift, SwiftUI, SwiftData &middot;{" "}
            <a href="https://github.com/colinfriedel/Dipstick" target="_blank" rel="noopener">
              github.com/colinfriedel/Dipstick
            </a>
          </div>
          <ul>
            <li>
              Developing a native iPhone app that tracks car maintenance and shows real fuel efficiency split into
              highway and city, helping users spot possible problems
            </li>
            <li>
              Records speed whenever the phone connects to the car over Bluetooth or CarPlay to separate highway and city
              mileage, with all data stored on the device in SwiftData
            </li>
            <li>Includes logs, charts, and maintenance reminders; testing the tracking through regular personal use</li>
          </ul>
        </div>
        <div className="entry">
          <div className="row">
            <strong>Car Stereo Controller</strong>
          </div>
          <div className="sub2">
            Arduino Nano, C++ &middot;{" "}
            <a href="https://github.com/colinfriedel/jvc-carplay-remote" target="_blank" rel="noopener">
              github.com/colinfriedel/jvc-carplay-remote
            </a>
          </div>
          <ul>
            <li>
              Built a physical volume knob for an Acura RSX by wiring a repurposed sunroof switch to an Arduino Nano that
              commands the JVC head unit through its steering wheel remote input
            </li>
            <li>
              Mapped press, hold, and double-tap gestures on one switch to volume, track skip, mute, and voice
              assistant, using command codes found through testing
            </li>
            <li>
              Soldered and multimeter-tested the connections, and powered the board from the car&apos;s 12V line through
              a buck converter
            </li>
          </ul>
        </div>
        <div className="entry">
          <div className="row">
            <strong>Automatic Radio Recording Distribution System</strong>
          </div>
          <div className="sub2">
            Python, AWS EC2, AWS S3 &middot;{" "}
            <a href="https://github.com/colinfriedel/KSCU-Show-Recorder" target="_blank" rel="noopener">
              github.com/colinfriedel/KSCU-Show-Recorder
            </a>
          </div>
          <ul>
            <li>
              Built a continuously running Python service on AWS EC2 that auto-records hourly radio output and emails
              each recording directly to the on-air DJ in a downloadable format
            </li>
            <li>Architected a cloud storage pipeline using AWS S3; runs unattended 24/7 with zero manual intervention</li>
          </ul>
        </div>
      </section>

      <section>
        <h3>Work experience</h3>
        <div className="entry">
          <div className="row">
            <strong>General Manager, KSCU 103.3 FM Radio Station</strong>
            <span className="when">June 2025 &ndash; June 2026</span>
          </div>
          <div className="sub2">Santa Clara, CA</div>
          <ul>
            <li>
              Managed 16 hired student staff across programming, production, and operations, and oversaw 130+ active
              DJs and volunteers to sustain a 24/7 live broadcast
            </li>
            <li>
              Planned and executed multiple live music events per quarter, coordinating artists, venues, and logistics
              end-to-end
            </li>
            <li>Was solely responsible for staff hiring, station strategy, and day-to-day operations</li>
          </ul>
        </div>
        <div className="entry">
          <div className="row">
            <strong>Software Development Intern, NationsBenefits, LLC</strong>
            <span className="when">June &ndash; August 2023</span>
          </div>
          <div className="sub2">Plantation, FL</div>
          <ul>
            <li>
              Developed and optimized C# programs to parse and reformat healthcare data files received from external
              partners, improving processing efficiency
            </li>
            <li>
              Operated in an Agile/Scrum environment; presented technical progress and findings to the software
              development team
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h3>Skills</h3>
        <dl className="skills">
          <dt>Languages</dt>
          <dd>Python, C, C++, C#, JavaScript, Swift, HTML, CSS</dd>
          <dt>Tools and platforms</dt>
          <dd>AWS, React, Git/GitHub, VS Code, Xcode, Arduino IDE, Azure DevOps, Jira</dd>
          <dt>AI tools</dt>
          <dd>Claude chat, Projects, and Claude Code, used in developing Dipstick, the Car Stereo Controller, and my portfolio site</dd>
          <dt>Hardware</dt>
          <dd>Arduino, Particle Boron, RS-485/RS-232, soldering, multimeter testing</dd>
          <dt>Concepts</dt>
          <dd>Full-stack development, REST APIs, Agile/Scrum, cloud infrastructure, embedded systems</dd>
        </dl>
      </section>

      <section>
        <h3>Additional</h3>
        <p className="note">
          Eagle Scout (2022) &middot; Backpacking &middot; Rock Climbing &middot; Automotive Repair &middot; Guitar
          (monthly volunteer performances) &middot; Trivia
        </p>
      </section>
    </Panel>
  );
}

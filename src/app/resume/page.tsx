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
            Relevant coursework: Software Engineering, Operating Systems, Artificial Intelligence, Theory of
            Algorithms, Computer Networks, Embedded Systems
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
            Cellular / acoustic / serial communication &middot;{" "}
            <a href="https://github.com/colinfriedel/IRIS-Senior-Design" target="_blank" rel="noopener">
              github.com/colinfriedel/IRIS-Senior-Design
            </a>
          </div>
          <ul>
            <li>
              Led the software and data pipeline for an underwater reef sensor system in the Palos Verdes Reef,
              coordinating cellular, acoustic, and serial communication protocols across the full sensor-to-cloud path
            </li>
            <li>
              Wired and programmed an RS-485 interface to pull data from the underwater sensor network into a Feather
              Adalogger M0 for local buffering
            </li>
            <li>
              Converted the signal to RS-232 to drive a Succorfish Delphis acoustic modem, transmitting it through the
              water column to a second acoustic modem and back through an identical RS-232/RS-485/Feather Adalogger M0
              chain
            </li>
            <li>
              Programmed a Particle Boron 4G LTE module (404X) to publish the received data to the cloud, feeding a
              Google Sheet embedded in a public Google Site for live monitoring
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
            <li>Architected cloud storage pipeline using AWS S3; runs unattended 24/7 with zero manual intervention</li>
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
            <li>Managed a team of 16 hired student staff across programming, production, and station operations</li>
            <li>Oversaw 130+ active DJs and off-campus volunteers to sustain a 24/7 live broadcast</li>
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
          <dd>Python, JavaScript, HTML, CSS, C#, C++, SQL</dd>
          <dt>Tools and platforms</dt>
          <dd>AWS, React, Git/GitHub, VS Code, Azure DevOps, Jira</dd>
          <dt>Concepts</dt>
          <dd>Full-stack development, REST APIs, Agile/Scrum, cloud infrastructure, embedded systems</dd>
        </dl>
      </section>

      <section>
        <h3>Interests</h3>
        <p className="note">Backpacking, automotive repair, guitar, rock climbing, trivia</p>
      </section>
    </Panel>
  );
}

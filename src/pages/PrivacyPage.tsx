import { ReactNode } from "react";
import { PRIVACY_CONTACT_EMAIL, PRIVACY_NOTICE_VERSION } from "../lib/privacy";

const LAST_UPDATED = new Date(`${PRIVACY_NOTICE_VERSION}T12:00:00`).toLocaleDateString("en-NG", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const Section = ({ id, title, children }: { id: string; title: string; children: ReactNode }) => (
  <section id={id} className="mb-12 scroll-mt-32">
    <h2 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h2>
    <div className="space-y-4 text-gray-700 leading-relaxed">{children}</div>
  </section>
);

const Bullets = ({ items }: { items: ReactNode[] }) => (
  <ul className="space-y-2">
    {items.map((item, index) => (
      <li key={index} className="flex items-start gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2.5 flex-shrink-0" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const processing = [
  {
    activity: "Course registration",
    data: "Full name, WhatsApp number, chosen course, preferred location",
    purpose: "To contact you about enrolment, schedules and fees",
    basis: "Your consent, and steps you ask us to take before enrolment (NDPA s.25(1)(a)–(b))",
  },
  {
    activity: "Find My Course",
    data: "Name, WhatsApp number, education level, field of study, computer literacy, skills, interests, goals, notes",
    purpose: "To recommend a suitable course and follow up with you",
    basis: "Your consent (NDPA s.25(1)(a))",
  },
  {
    activity: "Newsletter",
    data: "Email address",
    purpose: "To send news about courses, cohort dates and career tips",
    basis: "Your consent (NDPA s.25(1)(a)). Unsubscribe any time",
  },
  {
    activity: "Course assistant chat",
    data: "The messages you type",
    purpose: "To answer your questions about our courses",
    basis: "Our legitimate interest in answering enquiries (NDPA s.25(1)(v))",
  },
  {
    activity: "Online payment (when offered)",
    data: "Name, email, course, amount, payment reference",
    purpose: "To take payment and confirm your place",
    basis: "Performance of a contract, and legal obligations for financial records (NDPA s.25(1)(b)–(c))",
  },
  {
    activity: "Running the website",
    data: "IP address, browser type, pages requested (server logs)",
    purpose: "To keep the site secure and working, and prevent abuse",
    basis: "Our legitimate interest in a secure service (NDPA s.25(1)(v))",
  },
];

export const PrivacyPage = () => {
  const mail = (
    <a href={`mailto:${PRIVACY_CONTACT_EMAIL}`} className="text-purple-600 underline hover:text-purple-700">
      {PRIVACY_CONTACT_EMAIL}
    </a>
  );

  return (
    <div className="min-h-screen bg-mint pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6 sm:px-8">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4">Privacy Notice</h1>
        <p className="text-gray-600 mb-2">Last updated: {LAST_UPDATED}</p>
        <p className="text-lg text-gray-700 leading-relaxed mb-12">
          This notice explains how PEISCL collects and uses your personal data when you use this
          website, and the rights you have under the Nigeria Data Protection Act 2023 (NDPA) and
          the NDPC General Application and Implementation Directive (GAID) 2025.
        </p>

        <Section id="who-we-are" title="1. Who we are">
          <p>
            PEISCL is the data controller for personal data collected on this website. You can
            reach us, and our data protection contact, at:
          </p>
          <Bullets
            items={[
              <>Email: {mail} (subject line: “Data Protection”)</>,
              <>
                Phone / WhatsApp:{" "}
                <a href="tel:08097545740" className="text-purple-600 underline hover:text-purple-700">
                  08097545740
                </a>
              </>,
              "Address: Garki, Abuja 900103, Federal Capital Territory, Nigeria",
            ]}
          />
        </Section>

        <Section id="what-we-collect" title="2. What we collect, why, and our lawful basis">
          <p>We only collect what we need for each purpose below. We do not sell your data.</p>
          <div className="space-y-4">
            {processing.map((row) => (
              <div key={row.activity} className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6">
                <h3 className="font-semibold text-gray-900 mb-3">{row.activity}</h3>
                <dl className="grid sm:grid-cols-[120px_1fr] gap-x-4 gap-y-2 text-sm">
                  <dt className="text-gray-500">Data</dt>
                  <dd>{row.data}</dd>
                  <dt className="text-gray-500">Purpose</dt>
                  <dd>{row.purpose}</dd>
                  <dt className="text-gray-500">Lawful basis</dt>
                  <dd>{row.basis}</dd>
                </dl>
              </div>
            ))}
          </div>
          <p>
            Please don’t share sensitive personal data (such as health, religious or financial
            details) in forms or in the chat. We don’t need it.
          </p>
        </Section>

        <Section id="sharing" title="3. Who we share it with">
          <p>
            We share personal data only with service providers that help us run the site, under
            terms that require them to protect it and use it only on our instructions:
          </p>
          <Bullets
            items={[
              "Airtable: stores registrations, course-finder answers and newsletter sign-ups",
              "Vercel: hosts the website and its server functions",
              "Google (Gemini) or Anthropic (Claude): generates replies in the course assistant chat. We don’t store chat conversations",
              "Paystack: processes payments when online payment is offered. We never see or store your card details",
              "WhatsApp (Meta): only when you choose to message us on WhatsApp",
              "OpenStreetMap: shows the map in the footer, which loads from their servers",
            ]}
          />
          <p>We may also disclose data where Nigerian law requires it.</p>
        </Section>

        <Section id="transfers" title="4. Transfers outside Nigeria">
          <p>
            Some of these providers store or process data outside Nigeria, mainly in the United
            States and the European Union. Where we do this, we rely on the safeguards in NDPA
            sections 41–43, such as the provider’s contractual data protection commitments. Where
            required, we also rely on your consent after telling you about the possible risks. You
            can ask us for more detail on these safeguards.
          </p>
        </Section>

        <Section id="retention" title="5. How long we keep it">
          <Bullets
            items={[
              "Registrations and course-finder answers: up to 24 months after our last contact with you, then deleted",
              "Newsletter: until you unsubscribe",
              "Payment records: as long as Nigerian tax and accounting law requires (generally six years)",
              "Server logs: kept briefly by our hosting provider for security",
            ]}
          />
        </Section>

        <Section id="your-rights" title="6. Your rights">
          <p>Under NDPA sections 34–38, you have the right to:</p>
          <Bullets
            items={[
              "Be told how your data is used (this notice)",
              "Get a copy of the personal data we hold about you",
              "Have inaccurate or incomplete data corrected",
              "Have your data deleted",
              "Restrict how we use your data",
              "Object to processing, including direct marketing, at any time",
              "Receive your data in a common, machine-readable format, or have it sent to another organisation",
              "Withdraw consent at any time. This does not affect processing that happened before you withdrew",
              "Not be subject to a decision based solely on automated processing that significantly affects you. We don’t make such decisions",
            ]}
          />
          <p>
            To use any of these rights, email {mail} with the subject “Data Request”. We may ask
            you to confirm your identity. We will respond without undue delay and within 30 days.
            Requests are free unless they are clearly unfounded or excessive.
          </p>
          <p>
            You can also complain to the Nigeria Data Protection Commission (NDPC) at{" "}
            <a
              href="https://ndpc.gov.ng"
              target="_blank"
              rel="noreferrer"
              className="text-purple-600 underline hover:text-purple-700"
            >
              ndpc.gov.ng
            </a>
            . We would appreciate the chance to resolve your concern first.
          </p>
        </Section>

        <Section id="children" title="7. Children">
          <p>
            Our forms are for people aged 18 and over. If you are under 18, a parent or guardian
            must agree before you submit your details (NDPA s.31). If we learn we have collected
            a child’s data without this consent, we will delete it.
          </p>
        </Section>

        <Section id="security" title="8. Security and breaches">
          <p>
            We protect personal data with access controls, encrypted (HTTPS) connections, input
            validation and limited staff access. If a breach is likely to put your rights at risk,
            we will notify the NDPC within 72 hours of becoming aware of it. If the risk to you is
            high, we will also tell you directly.
          </p>
        </Section>

        <Section id="cookies" title="9. Cookies">
          <p>
            We don’t use advertising or analytics cookies, and we don’t track you across other
            websites. Your browser may receive strictly necessary technical data from our hosting
            provider and from the embedded map. If we ever add non-essential cookies, we will ask
            for your consent first.
          </p>
        </Section>

        <Section id="changes" title="10. Changes to this notice">
          <p>
            We will update this notice when our practices change and show the new date at the
            top. If a change is significant, we will tell you before it applies.
          </p>
        </Section>
      </div>
    </div>
  );
};

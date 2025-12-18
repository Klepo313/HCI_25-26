import { contactData } from "@/app/data/companyData";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col gap-12 px-4 py-12 md:px-10">
      {/* Header */}
      <section className="flex flex-col gap-4 text-center max-w-3xl mx-auto">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">Get In Touch</p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          {contactData.title}
        </h1>
        <p className="text-base md:text-lg text-muted">
          {contactData.description}
        </p>
      </section>

      {/* Office Locations */}
      <section className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-extrabold tracking-tight">Our Offices</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          {contactData.offices.map((office) => (
            <div
              key={office.location}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6"
            >
              <h3 className="text-lg font-semibold mb-4">{office.location}</h3>
              <div className="space-y-3">
                <div className="flex gap-3 items-start">
                  <MapPin
                    className="text-[var(--color-primary)] flex-shrink-0 mt-0.5"
                    size={18}
                  />
                  <p className="text-sm text-[var(--color-fg-muted)]">
                    {office.address}
                  </p>
                </div>
                <div className="flex gap-3 items-center">
                  <Phone
                    className="text-[var(--color-primary)] flex-shrink-0"
                    size={18}
                  />
                  <a
                    href={`tel:${office.phone}`}
                    className="text-sm text-[var(--color-primary)] hover:underline"
                  >
                    {office.phone}
                  </a>
                </div>
                <div className="flex gap-3 items-center">
                  <Mail
                    className="text-[var(--color-primary)] flex-shrink-0"
                    size={18}
                  />
                  <a
                    href={`mailto:${office.email}`}
                    className="text-sm text-[var(--color-primary)] hover:underline"
                  >
                    {office.email}
                  </a>
                </div>
                <div className="flex gap-3 items-start">
                  <Clock
                    className="text-[var(--color-primary)] flex-shrink-0 mt-0.5"
                    size={18}
                  />
                  <p className="text-xs text-[var(--color-fg-muted)] whitespace-pre-line">
                    {office.hours}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Social Media */}
      <section className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-extrabold tracking-tight">Follow Us</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {contactData.socialMedia.map((social) => (
            <a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 text-center hover:bg-[var(--color-primary)]/10 transition"
            >
              <p className="font-semibold text-lg mb-2">{social.platform}</p>
              <p className="text-xs text-[var(--color-fg-muted)]">
                {social.handle}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="space-y-4">
          {contactData.faq.map((item, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6"
            >
              <h3 className="font-semibold text-base mb-3">{item.question}</h3>
              <p className="text-sm text-[var(--color-fg-muted)]">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

import { aboutData } from "@/app/data/companyData";

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col gap-12 px-4 py-12 md:px-10">
      {/* Header */}
      <section className="flex flex-col gap-4 text-center max-w-3xl mx-auto">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">About</p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          {aboutData.title}
        </h1>
        <p className="text-base md:text-lg text-muted">
          {aboutData.description}
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto w-full">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
          <h2 className="text-2xl font-extrabold mb-3">Our Mission</h2>
          <p className="text-[var(--color-fg-muted)]">{aboutData.mission}</p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
          <h2 className="text-2xl font-extrabold mb-3">Our Vision</h2>
          <p className="text-[var(--color-fg-muted)]">{aboutData.vision}</p>
        </div>
      </section>

      {/* Values */}
      <section className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">Our Values</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {aboutData.values.map((value) => (
            <div
              key={value.title}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5"
            >
              <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
              <p className="text-sm text-[var(--color-fg-muted)]">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Achievements */}
      <section className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">By The Numbers</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {aboutData.achievements.map((achievement) => (
            <div
              key={achievement.metric}
              className="rounded-lg border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-secondary)]/5 p-6 text-center"
            >
              <p className="text-3xl font-extrabold text-[var(--color-primary)]">
                {achievement.metric}
              </p>
              <p className="text-sm text-[var(--color-fg-muted)] mt-2">
                {achievement.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">Our Team</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {aboutData.team.map((member) => (
            <div
              key={member.name}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 text-center"
            >
              <p className="text-5xl mb-4">{member.image}</p>
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-sm text-[var(--color-primary)] font-medium mb-2">
                {member.role}
              </p>
              <p className="text-xs text-[var(--color-fg-muted)]">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

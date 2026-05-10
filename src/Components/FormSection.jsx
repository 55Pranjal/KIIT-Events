// Visual grouping for long forms. Renders a small heading + description above
// the children, with a hairline divider above (skipped for the first section).
//
// Usage:
//   <FormSection title="Basics" description="Headline info attendees see first.">
//     <input ... />
//     <textarea ... />
//   </FormSection>

export default function FormSection({ title, description, children }) {
  return (
    <section className="space-y-4 first:pt-0 first:border-t-0 pt-6 border-t border-[#eeeeea]">
      <header>
        <h3 className="font-display text-base sm:text-lg font-semibold text-[#111] tracking-tightish">
          {title}
        </h3>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        )}
      </header>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}

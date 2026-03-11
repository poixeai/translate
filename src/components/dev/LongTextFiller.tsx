interface LongTextFillerProps {
  paragraphs?: number;
  className?: string;
}

const TEXT =
  "This is a very long placeholder text designed to test layout wrapping behavior in UI components. " +
  "It simulates real user input, documentation content, or AI generated responses. " +
  "When containers are too narrow, the text should wrap correctly without overflow, " +
  "and when containers are wide enough, readability should remain comfortable. " +
  "This helps developers verify typography scale, line-height, and responsive breakpoints. ";

export default function LongTextFiller({
  paragraphs = 8,
  className = "",
}: LongTextFillerProps) {
  return (
    <div className={className}>
      {Array.from({ length: paragraphs }).map((_, i) => (
        <p key={i} className="mb-3 leading-relaxed">
          {TEXT.repeat(4)}
        </p>
      ))}
    </div>
  );
}
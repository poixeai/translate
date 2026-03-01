interface PageFillerProps {
  rows?: number;        // 渲染多少行
  prefix?: string;      // 行前缀
  className?: string;
}

export default function PageFiller({
  rows = 60,
  prefix = "row",
  className = "",
}: PageFillerProps) {

  return (
    <div className={className}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
        >
          {prefix} {i + 1}
        </div>
      ))}
    </div>
  );
}
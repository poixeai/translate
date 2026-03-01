export default function Footer() {
  return (
    <div className="w-full border-t dark:border-t-white text-muted-foreground dark:text-white bg-[#FBFBFB] dark:bg-[#0B0B0C]">
      <div className="max-w-7xl mx-auto flex flex-row justify-between items-center px-2">
        <span className="text-sm">© {new Date().getFullYear()} Poixe Translate</span>
        <div className="text-sm">links</div>
      </div>
    </div>
  );
}

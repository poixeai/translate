export default function Footer() {
  return (
    <footer className="flex flex-row border border-blue-500">
      <small>© {new Date().getFullYear()} Your App</small>
    </footer>
  );
}

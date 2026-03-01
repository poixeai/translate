import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function AppLayout() {
  return (
    <>
      <div className="h-screen flex flex-col">
        <header className="flex-none">
          <Header/>
        </header>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>

        <footer className="flex-none">
          <Footer />
        </footer>
      </div>
    </>
  );
}

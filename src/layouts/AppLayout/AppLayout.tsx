import { Outlet } from "react-router-dom";

import AuthNotice from "@/components/common/AuthNotice";
import Footer from "./Footer";
import Header from "./Header";

export default function AppLayout() {
  return (
    <>
      <div className="h-screen flex flex-col">
        <header className="flex-none">
          <Header />
        </header>

        <AuthNotice />

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

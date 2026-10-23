import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({
  children,
}: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="min-h-[calc(100vh-9rem)] flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}
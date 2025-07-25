import { ThemeToggle } from "@acme/ui/theme";

import "~/app/globals.css";

import Header from "~/components/header";

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {props.children}
      <div className="fixed bottom-4 right-4">
        <ThemeToggle />
      </div>
    </>
  );
}

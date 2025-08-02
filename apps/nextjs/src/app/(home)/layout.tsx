// import { ThemeToggle } from "@acme/ui/theme";

import Header from "~/components/header";

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <div className="no-scrollbar h-full max-h-[calc(100)] overflow-auto bg-gradient-to-br from-card via-primary/20 to-card">
      <Header />
      {props.children}
    </div>
  );
}

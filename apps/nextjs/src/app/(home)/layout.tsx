import OnboardingDialog from "~/components/auth/onboarding-modal";
import Header from "~/components/header";

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <div className="no-scrollbar h-full max-h-[calc(100)] overflow-auto bg-gradient-to-br from-card/60 via-primary/10 to-card/60">
      <Header />
      {props.children}
      <OnboardingDialog />
    </div>
  );
}

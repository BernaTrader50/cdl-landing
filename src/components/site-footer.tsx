import { Logo } from "./site-nav";

export function SiteFooter() {
  return (
    <footer className="border-t" style={{ borderColor: "#e8e8e8" }}>
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-4 px-6 py-8 text-[13px] text-neutral-500 md:grid-cols-3">
        <div className="flex justify-start">
          <Logo />
        </div>
        <p className="text-center">Your buying lab. For the right decision.</p>
        <p className="text-center md:text-right">© 2026 ClickDecisionLab</p>
      </div>
    </footer>
  );
}

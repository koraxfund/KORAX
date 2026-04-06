import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="hidden lg:block w-64 shrink-0 border-r border-white/10 bg-black/30 backdrop-blur">
      <div className="p-6">
        <div className="text-sm font-semibold tracking-widest text-white/90">KORAX</div>
        <div className="mt-2 text-xs text-white/50">korax.fund</div>

        <nav className="mt-6 space-y-2 text-sm">
          <Link className="block rounded-lg px-3 py-2 text-white/70 hover:bg-white/5 hover:text-white" href="/">
            Home
          </Link>
          <Link className="block rounded-lg px-3 py-2 text-white/70 hover:bg-white/5 hover:text-white" href="/presale">
            Presale
          </Link>
        </nav>
      </div>
    </aside>
  );
}
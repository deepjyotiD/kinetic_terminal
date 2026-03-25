"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";

const navItems = [
  { icon: "dashboard", label: "Dashboard", href: "/" },
  { icon: "terminal", label: "Repositories", href: "#", comingSoon: true },
  { icon: "analytics", label: "Analytics", href: "#", comingSoon: true },
];

const bottomItems = [
  { icon: "menu_book", label: "Docs", href: "#", comingSoon: true },
  { icon: "logout", label: "Logout", href: "#", danger: true, action: "logout" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();

  const handleAction = (e: React.MouseEvent, item: any) => {
    if (item.comingSoon) {
      e.preventDefault();
      alert(`[SYSTEM] ${item.label} module is currently offline. Available in v1.1.0-stable update.`);
    } else if (item.action === "logout") {
      e.preventDefault();
      signOut(() => router.push("/"));
    }
  };

  return (
    <aside className="hidden lg:flex flex-col py-8 fixed left-0 h-full w-64 bg-surface-container-lowest border-r border-outline-variant/15 shadow-[0_0_40px_rgba(161,250,255,0.05)] pt-20 z-40">
      <div className="px-6 mb-10 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-primary">
            terminal
          </span>
        </div>
        <div>
          <h2 className="text-primary font-bold font-[family-name:var(--font-headline)]">
            Dev Terminal
          </h2>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-mono">
            v1.0.4-stable
          </p>
        </div>
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href && item.icon === "dashboard";
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={(e) => handleAction(e, item)}
              className={`flex items-center gap-3 px-6 py-3 transition-all text-sm font-medium ${
                isActive
                  ? "bg-surface-container-high text-primary rounded-r-lg border-l-4 border-primary"
                  : "text-on-surface/50 hover:bg-surface-container-low hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto px-4 space-y-1 border-t border-outline-variant/10 pt-4">
        {bottomItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={(e) => handleAction(e, item)}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
              item.danger
                ? "text-error/70 hover:bg-error-container/20"
                : "text-on-surface/50 hover:text-on-surface hover:bg-surface-container-high"
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}

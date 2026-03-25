"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const TRENDING_PROFILES = [
  {
    name: "Alex Rivera",
    handle: "@arivera_dev",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCymcycJTqpvj0xE6VcIsr6SonA8NRmNdo0qRARcraS21QgO4kfmICFDQOpWxaiHBQnkYZr7xxjsHLZ8qS5_ISABaQwfIUsKvuZaxz5sf-VgbYtuNTXo3oTVcAqFM37kFM-dW2w5RZg-fZ7ZGVka6-bJ0OO6drjR0dyi0oUyoA5PsfBf833agNGygFSim9m0XpxPpqXlB5rbYPRLcCdaDIWfHsJBWjosgcjdvfz5eZclREP0k9OxOI9X0I74UArMkNlIK-GR2S-Isk",
    tags: ["RUST", "WASM"],
    impact: "98.4",
    username: "nickel-org",
  },
  {
    name: "Sarah Chen",
    handle: "@schen_codes",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtIoZN4FWpJcaz3et7DelHhQb_YK4KfcXHpz9He8EmPT4X95pjgGrtvm_8c1F-7H0RQjwDe7tqohGi-IqqIBGEXcD0ZCVE3cX5HPETGQc3j0xDje_-bV6kAJX_i-wLYHFsrDHV33lqehd7Hrtxa-GMA7V0PL8T1swlL_1ESYNiixwOQd3Kb1h0WJp3l78Iec4BijM1S5wPeiMeHDmhjNlAqxD_MNuZEb2cSo3KUjXVnTP8iAAkfLVv_DrU_nuFxou9-FLnqiqujrE",
    tags: ["GO", "K8S"],
    impact: "96.1",
    username: "ahmetb",
  },
  {
    name: "Marc Dupont",
    handle: "@mdupont",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPDnfI16KOKd5Uao77ALoAzWI0Pduf-L3P_RZLOHvWvr2rwRo1jiXXJaBV-qbQghE2SZ56YpL9bd9sQ2KCL2zvMSCdOlzpo2VaJjIk9cGebck1XlmrMKM4U9XwzveDUmgqmsjjgGZQ8EIMMjYlcWvySiRRZS5ILfHglNLKlvoYQmob2Y1BJXJbEInDCdnKLS569MKzVJpMxH4UhPLaXcsmB53XNcShk8JCW45hFSYYW57UdfAKEfiznAwjESDzUDfreWZMOL8EgiQ",
    tags: ["TYPESCRIPT", "GRAPHQL"],
    impact: "94.8",
    username: "graphql",
  },
  {
    name: "Jasmine Li",
    handle: "@jas_cli",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFWGGIZAN7Y-0yIKseIb6u7ZRI9eOIoiLoXWSzjdRkiF4kGvnqRgGduinTgWTftg9t_TLLNcEQtcdNMPdS36zg7CPmpaNDkbmqtNM9amBgEPwUDihl0UUlAtKbJeQZvilAdzgqr3cUWLxRqq1jEORUgTHQ6zHnEKUzN310xkoyDXJOBn2gUK0Fzu_TuncbtzFqDhxI6HiMhIxbMeEmZF9XVBLgUOhxx-QNVnUad7aAUbNDzzLvlvCBm-BuQluXmL2fka1L6sxG_DM",
    tags: ["PYTHON", "PYTORCH"],
    impact: "93.2",
    username: "pytorch",
  },
];

function AnimatedCounter({
  end,
  suffix = "",
}: {
  end: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          const duration = 2000;
          const startTime = performance.now();

          const step = (time: number) => {
            const progress = Math.min((time - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(end * eased));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end]);

  const display =
    end >= 1000000
      ? (count / 1000000).toFixed(1) + "M"
      : end >= 1000
        ? (count / 1000).toFixed(1) + "k"
        : count.toString();

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const scrollRef = useScrollAnimation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    router.push(`/profile/${searchQuery.trim()}`);
  };

  const handleProfileClick = (username: string) => {
    router.push(`/profile/${username}`);
  };

  return (
    <div ref={scrollRef}>
      <Header />
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto page-enter">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center mb-32 scroll-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-secondary-container/30 border border-secondary/20">
            <span className="w-2 h-2 rounded-full bg-secondary pulse-dot" />
            <span className="text-xs font-[family-name:var(--font-label)] font-medium text-secondary">
              v1.0.4-stable live telemetry
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-[family-name:var(--font-headline)] font-bold tracking-tighter mb-6 max-w-4xl text-gradient">
            Visualizing the Human Side of Source Code.
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mb-12">
            Analyze stats, view history, see trends. Kinetic Terminal transforms
            cold GitHub data into a curated narrative of technical expertise.
          </p>

          {/* Command Line Search */}
          <form onSubmit={handleSearch} className="w-full max-w-2xl relative group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-primary/50">
                terminal
              </span>
            </div>
            <input
              id="search-input"
              className="w-full h-16 pl-14 pr-32 bg-surface-container-lowest border-none rounded-xl text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
              placeholder="Search for any developer (e.g. torvalds)"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              disabled={isSearching}
              className="absolute right-2 top-2 bottom-2 px-6 bg-gradient-to-br from-primary to-primary-container text-on-primary font-[family-name:var(--font-label)] font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
            >
              {isSearching ? "LOADING..." : "EXECUTE"}
            </button>
          </form>
        </section>

        {/* Bento Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
          <div className="md:col-span-2 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between overflow-hidden relative group scroll-fade-left">
            <div className="relative z-10">
              <span className="font-[family-name:var(--font-label)] text-tertiary font-bold tracking-widest text-xs uppercase mb-4 block">
                Telemetry Data
              </span>
              <h3 className="text-3xl font-[family-name:var(--font-headline)] font-bold mb-4">
                Deep Repository Intelligence
              </h3>
              <p className="text-on-surface-variant max-w-md">
                Our algorithm maps contribution density, language proficiency,
                and impact scores across 100M+ data points.
              </p>
            </div>
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 group-hover:opacity-20 transition-opacity duration-700">
              <div className="w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-tertiary/20" />
            </div>
          </div>

          <div className="bg-surface-container-low rounded-xl p-8 flex flex-col items-center justify-center text-center scroll-fade-right">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-primary text-3xl">
                monitoring
              </span>
            </div>
            <h4 className="text-xl font-[family-name:var(--font-headline)] font-bold mb-2">
              Trend Analysis
            </h4>
            <p className="text-sm text-on-surface-variant">
              Identify rising stars and technology shifts before they hit the
              mainstream.
            </p>
          </div>

          <div className="bg-surface-container-high rounded-xl p-8 flex flex-col justify-between scroll-scale-in">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-secondary">
                history
              </span>
              <span className="text-xs font-[family-name:var(--font-label)] text-on-surface-variant">
                Live Feed
              </span>
            </div>
            <div>
              <div className="text-4xl font-[family-name:var(--font-headline)] font-bold text-secondary mb-1">
                14.2ms
              </div>
              <p className="text-xs text-on-surface-variant">
                Average latency per query profile
              </p>
            </div>
          </div>

          <div className="md:col-span-2 bg-surface-container-low rounded-xl p-8 grid grid-cols-2 gap-8 scroll-fade-up">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-[family-name:var(--font-label)] text-on-surface-variant">
                Active Developers
              </span>
              <span className="text-3xl font-[family-name:var(--font-headline)] font-bold">
                <AnimatedCounter end={2400000} suffix="+" />
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-[family-name:var(--font-label)] text-on-surface-variant">
                Visualized Events
              </span>
              <span className="text-3xl font-[family-name:var(--font-headline)] font-bold">
                <AnimatedCounter end={890000000} />
              </span>
            </div>
          </div>
        </section>

        {/* Trending Profiles */}
        <section className="mb-32 scroll-fade-up">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-[family-name:var(--font-headline)] font-bold mb-2">
                Trending Profiles
              </h2>
              <p className="text-on-surface-variant">
                Top performing developers in the last 24 hours.
              </p>
            </div>
            <button
              onClick={() => alert(`[SYSTEM] Full directory access is currently restricted. Available in v1.1.0-stable.`)}
              className="text-primary font-[family-name:var(--font-label)] text-sm flex items-center gap-2 group cursor-pointer"
            >
              VIEW ALL TERMINALS
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 stagger-children">
            {TRENDING_PROFILES.map((profile) => (
              <div
                key={profile.name}
                onClick={() => handleProfileClick(profile.username)}
                className="bg-surface-container-low rounded-xl p-6 hover:bg-surface-container-high transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-outline-variant/20">
                    <img
                      alt={profile.name}
                      src={profile.avatar}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-[family-name:var(--font-headline)] font-bold text-on-surface">
                      {profile.name}
                    </h4>
                    <span className="text-xs text-on-surface-variant">
                      {profile.handle}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {profile.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-surface-container-highest text-[10px] font-[family-name:var(--font-label)] text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <span className="block text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">
                      Impact
                    </span>
                    <span className="text-xl font-[family-name:var(--font-headline)] font-bold text-secondary">
                      {profile.impact}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
                    north_east
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-surface-container-low rounded-2xl p-12 relative overflow-hidden scroll-scale-in">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(161,250,255,0.3),transparent_70%)]" />
          </div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <h2 className="text-4xl font-[family-name:var(--font-headline)] font-bold mb-6">
              Ready to see your terminal?
            </h2>
            <p className="text-on-surface-variant mb-10 max-w-xl">
              Join thousands of developers using Kinetic Terminal to visualize
              their technical narrative and career progression.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() =>
                  document.getElementById("search-input")?.focus()
                }
                className="px-8 py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary font-[family-name:var(--font-label)] font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all"
              >
                CONNECT GITHUB
              </button>
              <button 
                onClick={() => alert(`[SYSTEM] Documentation module is currently offline. Available in v1.1.0-stable.`)}
                className="px-8 py-3 border border-outline-variant/30 text-on-surface font-[family-name:var(--font-label)] font-bold rounded-lg hover:bg-surface-container-high active:scale-95 transition-all"
              >
                DOCUMENTATION
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-outline-variant/10 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-xl font-[family-name:var(--font-headline)] font-bold text-primary mb-2">
              Kinetic Terminal
            </span>
            <span className="text-sm text-on-surface-variant">
              © 2026 Kinetic Systems. All rights reserved.
            </span>
          </div>
          <div className="flex gap-8 text-sm font-[family-name:var(--font-label)] text-on-surface-variant">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              API
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Twitter
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

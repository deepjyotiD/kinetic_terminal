"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import type { ProfileData } from "@/lib/types";

function ContributionHeatmap({
  contributions,
}: {
  contributions: ProfileData["contributions"];
}) {
  const levelColors = [
    "bg-surface-container-high",
    "bg-secondary-container/40",
    "bg-secondary-container/70",
    "bg-secondary/70",
    "bg-secondary",
  ];

  return (
    <div className="grid gap-[3px]" style={{ gridTemplateColumns: "repeat(52, 1fr)", gridTemplateRows: "repeat(7, 1fr)" }}>
      {contributions.map((day, i) => (
        <div
          key={i}
          className={`aspect-square rounded-[2px] ${levelColors[day.level]} hover:ring-1 hover:ring-primary/30 transition-all`}
          title={`${day.date}: ${day.count} contributions`}
        />
      ))}
    </div>
  );
}

function LanguageBar({
  languages,
}: {
  languages: ProfileData["languages"];
}) {
  return (
    <div className="space-y-6">
      {languages.map((lang) => (
        <div key={lang.name} className="space-y-2">
          <div className="flex justify-between text-xs font-[family-name:var(--font-label)] uppercase tracking-widest">
            <span className="flex items-center gap-2" style={{ color: lang.color }}>
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: lang.color }}
              />
              {lang.name}
            </span>
            <span className="mono-data">{lang.percentage}%</span>
          </div>
          <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${lang.percentage}%`,
                backgroundColor: lang.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const scrollRef = useScrollAnimation([data]);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/user/${username}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setData(json);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Animated Background Mesh */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30 mix-blend-screen isolate z-[-1]">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full animate-mesh-1" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-secondary/20 blur-[150px] rounded-full animate-mesh-2" />
        </div>
        
        <Header />
        <Sidebar />
        <main className="lg:ml-64 pt-24 px-6 md:px-12 pb-20 max-w-[1400px]">
          <section className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-16 animate-pulse">
            <div className="xl:col-span-8 flex flex-col md:flex-row gap-8 items-start">
              <div className="w-40 h-40 md:w-56 md:h-56 rounded-xl bg-surface-container-high border border-primary/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              </div>
              <div className="flex-1 pt-2 w-full space-y-5">
                <div className="h-10 bg-surface-container-high border border-primary/10 rounded-lg w-2/3 md:w-1/2 relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                </div>
                <div className="h-4 bg-surface-container-high border border-primary/10 rounded w-3/4 max-w-2xl relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                </div>
                <div className="h-4 bg-surface-container-high border border-primary/10 rounded w-1/2 max-w-xl relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                </div>
                <div className="flex gap-4 mt-8">
                  <div className="h-6 bg-surface-container-high rounded border border-primary/10 w-24 relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                  </div>
                  <div className="h-6 bg-surface-container-high rounded border border-primary/10 w-24 relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="xl:col-span-4 grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-surface-container-low border border-primary/10 rounded-2xl p-6 h-32 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                </div>
              ))}
            </div>
          </section>
          
          <div className="h-64 bg-surface-container-low border border-primary/10 rounded-2xl mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-[400px] bg-surface-container-low border border-primary/10 rounded-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            </div>
            <div className="h-[400px] bg-surface-container-low border border-primary/10 rounded-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-6 text-center">
          <span className="material-symbols-outlined text-6xl text-error">
            error_outline
          </span>
          <h2 className="text-2xl font-[family-name:var(--font-headline)] font-bold">
            User Not Found
          </h2>
          <p className="text-on-surface-variant max-w-md">
            {error || "Could not load profile data."}
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-lg hover:brightness-110 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { user, repos, languages, totalStars, events, contributions } = data;
  const joinDate = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
  const totalContributions = contributions.reduce(
    (sum, d) => sum + d.count,
    0
  );

  const repoIcons = ["terminal", "api", "database", "architecture"];

  return (
    <div ref={scrollRef}>
      <Header />
      <Sidebar />

      <main className="lg:ml-64 pt-24 px-6 md:px-12 pb-20 max-w-[1400px] page-enter">
        {/* Profile Hero */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-16 scroll-fade-up">
          <div className="xl:col-span-8 flex flex-col md:flex-row gap-8 items-start">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-tertiary rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
              <img
                alt={user.name || user.login}
                src={user.avatar_url}
                className="relative w-40 h-40 md:w-56 md:h-56 rounded-xl object-cover bg-surface-container-high"
              />
            </div>
            <div className="flex-1 pt-2">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-headline)] tracking-tighter text-on-background">
                  {user.name || user.login}
                </h1>
                <span className="bg-secondary-container/30 text-secondary text-[10px] px-2 py-1 rounded uppercase tracking-widest font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary pulse-dot" />
                  Pro
                </span>
              </div>
              <p className="text-lg text-on-surface-variant mb-6 max-w-2xl leading-relaxed">
                {user.bio || `Developer @${user.login}`}
                {user.company && (
                  <>
                    {" "}
                    at{" "}
                    <span className="text-primary underline underline-offset-4 decoration-primary/30">
                      {user.company}
                    </span>
                  </>
                )}
              </p>
              <div className="flex flex-wrap gap-6 text-sm font-[family-name:var(--font-label)] uppercase tracking-widest text-on-surface/60">
                {user.location && (
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary scale-90">
                      location_on
                    </span>
                    {user.location}
                  </div>
                )}
                {user.blog && (
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary scale-90">
                      link
                    </span>
                    <a
                      href={
                        user.blog.startsWith("http")
                          ? user.blog
                          : `https://${user.blog}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      {user.blog.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary scale-90">
                    calendar_month
                  </span>
                  Joined {joinDate}
                </div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-4 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between border-l-4 border-primary/20">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-xs font-[family-name:var(--font-label)] uppercase tracking-widest text-on-surface-variant mb-1">
                  Followers
                </div>
                <div className="text-4xl font-bold font-[family-name:var(--font-headline)] text-primary mono-data">
                  {user.followers >= 1000
                    ? (user.followers / 1000).toFixed(1) + "k"
                    : user.followers}
                </div>
              </div>
              <div>
                <div className="text-xs font-[family-name:var(--font-label)] uppercase tracking-widest text-on-surface-variant mb-1">
                  Following
                </div>
                <div className="text-4xl font-bold font-[family-name:var(--font-headline)] text-on-background mono-data">
                  {user.following}
                </div>
              </div>
              <div>
                <div className="text-xs font-[family-name:var(--font-label)] uppercase tracking-widest text-on-surface-variant mb-1">
                  Stars
                </div>
                <div className="text-4xl font-bold font-[family-name:var(--font-headline)] text-tertiary mono-data">
                  {totalStars >= 1000
                    ? (totalStars / 1000).toFixed(1) + "k"
                    : totalStars}
                </div>
              </div>
              <div>
                <div className="text-xs font-[family-name:var(--font-label)] uppercase tracking-widest text-on-surface-variant mb-1">
                  Repos
                </div>
                <div className="text-4xl font-bold font-[family-name:var(--font-headline)] text-on-background mono-data">
                  {user.public_repos}
                </div>
              </div>
            </div>
            <a
              href={user.html_url}
              target="_blank"
              rel="noreferrer"
              className="mt-8 w-full py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-lg text-sm uppercase tracking-[0.2em] hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">person_add</span>
              Follow {user.login}
            </a>
          </div>
        </section>

        {/* Heatmap & Languages */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-16">
          <div className="xl:col-span-2 bg-surface-container-low p-8 rounded-xl flex flex-col scroll-fade-left">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-[family-name:var(--font-headline)] text-xl font-bold">
                Contribution Activity
              </h3>
              <div className="flex gap-1 items-center text-[10px] text-on-surface-variant font-mono uppercase">
                <span>Less</span>
                <div className="w-3 h-3 bg-surface-container-high rounded-sm" />
                <div className="w-3 h-3 bg-secondary-container/40 rounded-sm" />
                <div className="w-3 h-3 bg-secondary-container/70 rounded-sm" />
                <div className="w-3 h-3 bg-secondary rounded-sm" />
                <span>More</span>
              </div>
            </div>
            <ContributionHeatmap contributions={contributions} />
            <div className="mt-6 flex justify-between text-sm text-on-surface-variant">
              <span>
                {totalContributions.toLocaleString()} contributions in the last
                year
              </span>
              <a href={user.html_url} className="text-primary hover:underline">
                View commit log
              </a>
            </div>
          </div>

          <div className="bg-surface-container-low p-8 rounded-xl scroll-fade-right">
            <h3 className="font-[family-name:var(--font-headline)] text-xl font-bold mb-8">
              Top Languages
            </h3>
            <LanguageBar languages={languages} />
          </div>
        </section>

        {/* Repositories */}
        <section className="scroll-fade-up">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-3xl font-bold font-[family-name:var(--font-headline)] tracking-tight">
              Popular Repositories
            </h2>
            {repos.length > 0 && (
              <a
                href={`${user.html_url}?tab=repositories`}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-[family-name:var(--font-label)] uppercase tracking-widest text-primary flex items-center gap-1 hover:gap-2 transition-all"
              >
                Browse all{" "}
                <span className="material-symbols-outlined text-base">
                  arrow_forward
                </span>
              </a>
            )}
          </div>
          {repos.length === 0 ? (
            <div className="bg-surface-container-low p-12 rounded-xl text-center border-l-4 border-error/50 flex flex-col items-center">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">
                folder_off
              </span>
              <h4 className="text-xl font-bold font-[family-name:var(--font-headline)] mb-2">No Public Repositories</h4>
              <p className="text-on-surface-variant max-w-md">
                This user doesn't have any public repositories available. They might be working entirely on private codebase securely out of sight.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-children">
              {repos.slice(0, 4).map((repo, i) => (
                <Link
                  key={repo.id}
                  href={`/repo/${repo.full_name}`}
                  className="group bg-surface-container-low hover:bg-surface-container-high transition-all p-8 rounded-xl relative overflow-hidden block"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-30 transition-opacity">
                    <span className="material-symbols-outlined text-6xl">
                      {repoIcons[i % repoIcons.length]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="material-symbols-outlined"
                      style={{
                        color:
                          i % 3 === 0
                            ? "#a1faff"
                            : i % 3 === 1
                            ? "#c180ff"
                            : "#69f6b8",
                      }}
                    >
                      folder
                    </span>
                    <h4 className="text-xl font-bold text-on-background font-[family-name:var(--font-headline)]">
                      {repo.name}
                    </h4>
                  </div>
                  <p className="text-on-surface-variant text-sm mb-8 leading-relaxed max-w-[85%]">
                    {repo.description || "No description available."}
                  </p>
                  <div className="flex items-center gap-6 text-xs font-mono uppercase tracking-widest text-on-surface/40">
                    {repo.language && (
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">
                        star
                      </span>
                      {repo.stargazers_count >= 1000
                        ? (repo.stargazers_count / 1000).toFixed(1) + "k"
                        : repo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">
                        fork_right
                      </span>
                      {repo.forks_count}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-12 pb-safe w-full flex items-center justify-around z-50">
        <div className="bg-surface/90 backdrop-blur-xl border border-outline-variant/20 rounded-2xl mx-4 px-6 h-16 w-full flex items-center justify-around shadow-2xl">
          <button 
            onClick={() => router.push("/")}
            className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-all p-2 rounded-lg"
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-[9px] uppercase font-bold tracking-widest">Dash</span>
          </button>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex flex-col items-center gap-1 text-primary p-2 rounded-lg"
          >
            <span className="material-symbols-outlined shrink-0">person</span>
            <span className="text-[9px] uppercase font-bold tracking-widest">Me</span>
          </button>
          <button 
            onClick={() => {
              const reposSection = document.getElementById("repos");
              if (reposSection) reposSection.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-all p-2 rounded-lg"
          >
            <span className="material-symbols-outlined">terminal</span>
            <span className="text-[9px] uppercase font-bold tracking-widest">Repos</span>
          </button>
          <button 
            onClick={() => alert(`[SYSTEM] Analytics module is currently offline. Available in v1.1.0-stable update.`)}
            className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary py-2 px-1 rounded-lg"
          >
            <span className="material-symbols-outlined">timeline</span>
            <span className="text-[9px] uppercase font-bold tracking-widest">Data</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import type { RepoDetails } from "@/lib/types";

export default function RepoPage({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
}) {
  const { owner, repo: repoName } = use(params);
  const [data, setData] = useState<RepoDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const scrollRef = useScrollAnimation([data]);

  const fetchRepo = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/repo/${owner}/${repoName}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setData(json);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load repository");
    } finally {
      setLoading(false);
    }
  }, [owner, repoName]);

  useEffect(() => {
    fetchRepo();
  }, [fetchRepo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-on-surface-variant font-[family-name:var(--font-label)] text-sm uppercase tracking-widest">
            Loading repository...
          </p>
        </div>
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
            Repository Not Found
          </h2>
          <p className="text-on-surface-variant max-w-md">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { repo, languages, commits, contributors } = data;

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return `${Math.floor(days / 30)}mo ago`;
  }

  function getEventDescription(event: RepoDetails["commits"][0]) {
    const type = event.type || "Event";
    const payload = event.payload as Record<string, unknown>;
    if (type === "PushEvent") {
      const pushCommits = (payload.commits as Array<{ message: string }>) || [];
      return pushCommits.length > 0
        ? pushCommits[0].message.split("\n")[0]
        : "Push event";
    }
    if (type === "PullRequestEvent") {
      const pr = payload.pull_request as { title: string } | undefined;
      return pr?.title || "Pull request event";
    }
    if (type === "IssuesEvent") {
      const issue = payload.issue as { title: string } | undefined;
      return issue?.title || "Issue event";
    }
    if (type === "CreateEvent") {
      return `Created ${payload.ref_type || "resource"}${
        payload.ref ? ` ${payload.ref}` : ""
      }`;
    }
    return type.replace("Event", " event");
  }

  function getEventIcon(type: string) {
    switch (type) {
      case "PushEvent":
        return { icon: "commit", color: "text-primary" };
      case "PullRequestEvent":
        return { icon: "merge", color: "text-secondary" };
      case "IssuesEvent":
        return { icon: "bug_report", color: "text-error" };
      case "CreateEvent":
        return { icon: "add_circle", color: "text-tertiary" };
      default:
        return { icon: "history", color: "text-on-surface-variant" };
    }
  }

  return (
    <div ref={scrollRef}>
      <Header />
      <Sidebar />

      <main className="lg:pl-64 pt-16 min-h-screen page-enter">
        <div className="max-w-7xl mx-auto p-8 lg:p-12 space-y-12">
          {/* Repo Header */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-8 scroll-fade-up">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary pulse-dot" />
                  {repo.visibility || "Public"}
                </span>
                <Link
                  href={`/profile/${owner}`}
                  className="text-on-surface-variant font-mono text-sm hover:text-primary transition-colors"
                >
                  {owner} / {repo.name}
                </Link>
              </div>
              <h1 className="text-5xl md:text-6xl font-[family-name:var(--font-headline)] font-bold tracking-tighter text-on-surface leading-tight">
                {repo.name}
              </h1>
              <p className="text-on-surface-variant text-lg leading-relaxed font-light">
                {repo.description || "No description available."}
              </p>
              {repo.topics && repo.topics.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {repo.topics.slice(0, 6).map((topic: string) => (
                    <span
                      key={topic}
                      className="px-3 py-1 bg-surface-container-high rounded-full text-xs text-primary/80 border border-primary/10"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <a
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 bg-surface-container-high hover:bg-surface-container-highest transition-all rounded-lg font-[family-name:var(--font-headline)] font-bold text-on-surface flex items-center gap-2 group"
              >
                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">
                  star
                </span>
                Star
                <span className="ml-2 font-mono text-primary-fixed text-sm">
                  {repo.stargazers_count >= 1000
                    ? (repo.stargazers_count / 1000).toFixed(1) + "k"
                    : repo.stargazers_count}
                </span>
              </a>
              <a
                href={`${repo.html_url}/fork`}
                target="_blank"
                rel="noreferrer"
                className="px-8 py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary font-[family-name:var(--font-headline)] font-bold rounded-lg hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-primary/10"
              >
                <span className="material-symbols-outlined">fork_right</span>
                Fork Project
              </a>
            </div>
          </section>

          {/* Metrics Grid */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Language Distribution */}
            <div className="md:col-span-2 bg-surface-container-low rounded-xl p-6 flex flex-col justify-between overflow-hidden relative group scroll-fade-left">
              <div className="relative z-10">
                <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-4">
                  Language Distribution
                </p>
                <div className="space-y-4">
                  {languages.slice(0, 1).map((lang) => (
                    <div key={lang.name}>
                      <div className="flex justify-between text-sm font-mono mb-2">
                        <span className="text-on-surface">{lang.name}</span>
                        <span style={{ color: lang.color }}>
                          {lang.percentage}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
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
                  <div className="grid grid-cols-2 gap-4">
                    {languages.slice(1, 3).map((lang) => (
                      <div key={lang.name}>
                        <div className="flex justify-between text-xs font-mono mb-1">
                          <span className="text-on-surface/70">
                            {lang.name}
                          </span>
                          <span style={{ color: lang.color }}>
                            {lang.percentage}%
                          </span>
                        </div>
                        <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{
                              width: `${Math.min(lang.percentage * 3, 100)}%`,
                              backgroundColor: lang.color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Open Issues */}
            <div className="bg-surface-container-low rounded-xl p-6 space-y-4 flex flex-col scroll-scale-in">
              <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">
                Open Issues
              </p>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-[family-name:var(--font-headline)] font-bold text-on-surface">
                  {repo.open_issues_count}
                </span>
              </div>
              <div className="mt-auto h-12 flex items-end gap-1">
                {[4, 6, 10, 8, 12].map((h, i) => (
                  <div
                    key={i}
                    className={`w-full rounded-sm ${
                      i === 3 ? "bg-error" : "bg-surface-container-high"
                    }`}
                    style={{ height: `${h * 3}px` }}
                  />
                ))}
              </div>
            </div>

            {/* Forks */}
            <div className="bg-surface-container-low rounded-xl p-6 space-y-4 flex flex-col scroll-scale-in">
              <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">
                Forks
              </p>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-[family-name:var(--font-headline)] font-bold text-on-surface">
                  {repo.forks_count}
                </span>
                <span className="text-secondary text-sm font-mono mb-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">
                    trending_up
                  </span>
                </span>
              </div>
              <div className="mt-auto h-12 flex items-end gap-1">
                {[12, 8, 6, 10, 7].map((h, i) => (
                  <div
                    key={i}
                    className={`w-full rounded-sm ${
                      i === 0 ? "bg-secondary" : "bg-surface-container-high"
                    }`}
                    style={{ height: `${h * 3}px` }}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Activity + Side Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Recent Activity */}
            <div className="lg:col-span-2 space-y-8 scroll-fade-up">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-[family-name:var(--font-headline)] font-bold tracking-tight">
                  Recent Activity
                </h3>
                <a
                  href={`${repo.html_url}/activity`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary text-sm font-mono hover:underline underline-offset-8"
                >
                  view_all_history
                </a>
              </div>
              <div className="space-y-4 stagger-children">
                {commits.length === 0 ? (
                  <div className="bg-surface-container-low p-8 rounded-xl text-center text-on-surface-variant">
                    No recent activity found.
                  </div>
                ) : (
                  commits.slice(0, 5).map((event, i) => {
                    const { icon, color } = getEventIcon(event.type);
                    return (
                      <div
                        key={event.id || i}
                        className="bg-surface-container-low hover:bg-surface-container-high transition-colors p-5 rounded-xl flex gap-5 group"
                      >
                        <div className="relative">
                          <img
                            alt={event.actor.login}
                            src={event.actor.avatar_url}
                            className="w-10 h-10 rounded-lg ring-1 ring-primary/20 object-cover"
                          />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-background rounded-full flex items-center justify-center">
                            <span
                              className={`material-symbols-outlined text-[10px] ${color}`}
                            >
                              {icon}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 space-y-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <p className="text-on-surface font-medium leading-tight truncate">
                              {getEventDescription(event)}
                            </p>
                          </div>
                          <p className="text-on-surface-variant text-sm">
                            <span className="text-primary">
                              @{event.actor.login}
                            </span>{" "}
                            {timeAgo(event.created_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Side Panels */}
            <div className="space-y-8 scroll-fade-right">
              {/* Contributors */}
              {contributors.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">
                    Contributors
                  </h4>
                  <div className="flex -space-x-3">
                    {contributors.slice(0, 4).map((c) => (
                      <Link
                        key={c.login}
                        href={`/profile/${c.login}`}
                        className="hover:z-10 transition-transform hover:scale-110"
                      >
                        <img
                          alt={c.login}
                          src={c.avatar_url}
                          className="w-10 h-10 rounded-full border-2 border-background object-cover"
                        />
                      </Link>
                    ))}
                    {contributors.length > 4 && (
                      <div className="w-10 h-10 rounded-full border-2 border-background bg-surface-container-highest flex items-center justify-center text-[10px] font-bold text-primary">
                        +{contributors.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="bg-surface-container-low rounded-xl p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">
                      terminal
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-mono">
                      Default Branch
                    </p>
                    <p className="text-on-surface font-[family-name:var(--font-headline)] font-bold">
                      {repo.default_branch}
                    </p>
                  </div>
                </div>
                {repo.license && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-tertiary">
                        verified_user
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-on-surface-variant font-mono">
                        License
                      </p>
                      <p className="text-on-surface font-[family-name:var(--font-headline)] font-bold">
                        {repo.license.spdx_id}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary">
                      storage
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-mono">
                      Repository Size
                    </p>
                    <p className="text-on-surface font-[family-name:var(--font-headline)] font-bold">
                      {repo.size >= 1024
                        ? (repo.size / 1024).toFixed(1) + " MB"
                        : repo.size + " KB"}
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-surface-container-high to-background border border-primary/5 space-y-4">
                <p className="text-sm text-on-surface leading-snug">
                  Want to contribute or report issues?
                </p>
                <a
                  href={`${repo.html_url}/issues`}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full py-2 border border-primary/30 text-primary rounded hover:bg-primary/5 transition-all text-sm font-[family-name:var(--font-headline)] font-bold text-center"
                >
                  Open Issues
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const GITHUB_API = "https://api.github.com";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const headers: Record<string, string> = {
  Accept: "application/vnd.github.v3+json",
  "User-Agent": "KineticTerminal/1.0",
};
if (GITHUB_TOKEN) headers["Authorization"] = `Bearer ${GITHUB_TOKEN}`;

const LANG_COLORS: Record<string, string> = {
  Rust: "#dea584",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Go: "#00ADD8",
  "C++": "#f34b7d",
  C: "#555555",
  Java: "#b07219",
  Ruby: "#701516",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  PHP: "#4F5D95",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Elixir: "#6e4a7e",
  Haskell: "#5e5086",
  Scala: "#c22d40",
  Zig: "#ec915c",
};

function getLangColor(lang: string): string {
  return LANG_COLORS[lang] || "#a3aac4";
}

export async function fetchUser(username: string) {
  const res = await fetch(`${GITHUB_API}/users/${username}`, {
    headers,
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`User not found: ${username}`);
  return res.json();
}

export async function fetchRepos(username: string) {
  const res = await fetch(
    `${GITHUB_API}/users/${username}/repos?sort=stars&direction=desc&per_page=30&type=owner`,
    { headers, next: { revalidate: 300 } }
  );
  if (!res.ok) throw new Error("Failed to fetch repos");
  return res.json();
}

export async function fetchRepoDetails(owner: string, repo: string) {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, {
    headers,
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error("Failed to fetch repo");
  return res.json();
}

export async function fetchRepoLanguages(owner: string, repo: string) {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/languages`, {
    headers,
    next: { revalidate: 300 },
  });
  if (!res.ok) return {};
  return res.json();
}

export async function fetchRepoContributors(owner: string, repo: string) {
  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/contributors?per_page=15`,
    { headers, next: { revalidate: 300 } }
  );
  if (!res.ok) return [];
  return res.json();
}

export async function fetchEvents(username: string) {
  const res = await fetch(
    `${GITHUB_API}/users/${username}/events/public?per_page=30`,
    { headers, next: { revalidate: 60 } }
  );
  if (!res.ok) return [];
  return res.json();
}

export async function fetchRepoEvents(owner: string, repo: string) {
  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/events?per_page=20`,
    { headers, next: { revalidate: 60 } }
  );
  if (!res.ok) return [];
  return res.json();
}

export function computeLanguageStats(
  repos: Array<{ language: string | null; stargazers_count: number }>
) {
  const langMap: Record<string, number> = {};
  let total = 0;
  for (const repo of repos) {
    if (repo.language) {
      const weight = 1 + Math.log2(1 + repo.stargazers_count);
      langMap[repo.language] = (langMap[repo.language] || 0) + weight;
      total += weight;
    }
  }
  const sorted = Object.entries(langMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);
  return sorted.map(([name, value]) => ({
    name,
    percentage: Math.round((value / total) * 100),
    color: getLangColor(name),
  }));
}

export function computeRepoLanguages(langBytes: Record<string, number>) {
  const total = Object.values(langBytes).reduce((a, b) => a + b, 0);
  if (total === 0) return [];
  return Object.entries(langBytes)
    .sort(([, a], [, b]) => b - a)
    .map(([name, bytes]) => ({
      name,
      percentage: Math.round((bytes / total) * 1000) / 10,
      color: getLangColor(name),
    }));
}

export async function fetchContributions(username: string) {
  // GitHub GraphQL API requires a token — use it to fetch real contribution data
  if (!GITHUB_TOKEN) {
    return generateFallbackContributions();
  }

  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                contributionLevel
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        "User-Agent": "KineticTerminal/1.0",
      },
      body: JSON.stringify({ query, variables: { username } }),
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return generateFallbackContributions();
    }

    const json = await res.json();
    const calendar =
      json?.data?.user?.contributionsCollection?.contributionCalendar;

    if (!calendar) {
      return generateFallbackContributions();
    }

    const days: { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }[] =
      [];

    const levelMap: Record<string, 0 | 1 | 2 | 3 | 4> = {
      NONE: 0,
      FIRST_QUARTILE: 1,
      SECOND_QUARTILE: 2,
      THIRD_QUARTILE: 3,
      FOURTH_QUARTILE: 4,
    };

    for (const week of calendar.weeks) {
      for (const day of week.contributionDays) {
        days.push({
          date: day.date,
          count: day.contributionCount,
          level: levelMap[day.contributionLevel] ?? 0,
        });
      }
    }

    return days;
  } catch {
    return generateFallbackContributions();
  }
}

function generateFallbackContributions() {
  const days = [];
  const now = new Date();
  for (let i = 364; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const rand = Math.random();
    let count = 0;
    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (rand > 0.3) {
      count = Math.floor(Math.random() * 12) + 1;
      if (count <= 3) level = 1;
      else if (count <= 6) level = 2;
      else if (count <= 9) level = 3;
      else level = 4;
    }
    days.push({
      date: date.toISOString().split("T")[0],
      count,
      level,
    });
  }
  return days;
}

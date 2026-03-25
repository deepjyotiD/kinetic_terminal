export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  license: { spdx_id: string; name: string } | null;
  topics: string[];
  visibility: string;
  default_branch: string;
}

export interface GitHubEvent {
  id: string;
  type: string;
  actor: {
    login: string;
    avatar_url: string;
  };
  repo: {
    name: string;
  };
  payload: Record<string, unknown>;
  created_at: string;
}

export interface LanguageStats {
  [language: string]: number;
}

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ProfileData {
  user: GitHubUser;
  repos: GitHubRepo[];
  languages: { name: string; percentage: number; color: string }[];
  totalStars: number;
  totalForks: number;
  events: GitHubEvent[];
  contributions: ContributionDay[];
}

export interface RepoDetails {
  repo: GitHubRepo;
  languages: { name: string; percentage: number; color: string }[];
  commits: GitHubEvent[];
  contributors: { login: string; avatar_url: string; contributions: number }[];
}

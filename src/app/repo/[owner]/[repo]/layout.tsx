import { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ owner: string; repo: string }>;
};

// Next.js dynamic metadata generation for social cards and SEO
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { owner, repo } = await params;
  
  return {
    title: `${owner}/${repo} | Kinetic Terminal`,
    description: `Explore the GitHub repository telemetry, statistics, and contributors for ${owner}/${repo} on Kinetic Terminal.`,
    openGraph: {
      title: `${owner}/${repo} | Kinetic Terminal`,
      description: `Analyze commits, issues, pull requests, and telemetry for ${owner}/${repo}.`,
      images: [`https://github.com/${owner}.png`],
    },
    twitter: {
      card: "summary_large_image",
      title: `${owner}/${repo} | Kinetic Terminal`,
      description: `Open source repository analytics for ${owner}/${repo}.`,
      images: [`https://github.com/${owner}.png`],
    },
  };
}

export default function RepoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

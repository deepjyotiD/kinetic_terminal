import { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ username: string }>;
};

// Next.js dynamic metadata generation for social cards and SEO
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { username } = await params;
  
  // optionally fetch data here to get the real name, but username 
  // is sufficient for a snappy unfurl/SEO title as well.
  // Wait, if we use the API endpoint, we might cache it.
  
  return {
    title: `${username}'s Developer Kinetics | Kinetic Terminal`,
    description: `Explore the GitHub telemetry and coding statistics for ${username} on Kinetic Terminal.`,
    openGraph: {
      title: `${username} | Kinetic Terminal`,
      description: `Analyze stats, view history, and see trends for ${username}.`,
      images: [`https://github.com/${username}.png`],
    },
    twitter: {
      card: "summary_large_image",
      title: `${username} | Kinetic Terminal`,
      description: `View the technical narrative and GitHub telemetry for ${username}.`,
      images: [`https://github.com/${username}.png`],
    },
  };
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

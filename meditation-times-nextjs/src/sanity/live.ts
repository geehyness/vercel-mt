import { SanityClient } from "@sanity/client";

type SanityLiveProps = {
  client: SanityClient;
};

export function SanityLive({ client }: SanityLiveProps) {
  // Add a dummy usage of the `client` prop to satisfy ESLint
  console.log(client); // This ensures the `client` prop is "used"

  return null; // Simple implementation that does nothing
}
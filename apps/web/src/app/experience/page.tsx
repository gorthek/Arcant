import type { Metadata } from "next";
import { ArcantExperience } from "@/components/experience/ArcantExperience";

export const metadata: Metadata = {
  title: "Arcant — The Frozen Monument",
  description:
    "A scroll-bound WebGL experience: an architectural ice monument of thousands of instanced frosted-glass blocks deconstructs into a volumetric organism and condenses into a physical artifact.",
  openGraph: {
    title: "Arcant — The Frozen Monument",
    description:
      "Deconstruct the architecture. Watch it reassemble as a living system. Inspect the artifact it becomes.",
    type: "website",
  },
};

/**
 * Server component: it exports metadata and renders exactly one client
 * boundary. Keeping the route shell on the server means the document, the
 * `<title>` and the Open Graph tags are all present in the initial HTML even
 * though the entire visual payload is client-only.
 */
export default function ExperiencePage() {
  return <ArcantExperience />;
}

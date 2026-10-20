import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Jawad Veterinary Hospital",
    short_name: "Jawad Vet",
    description: "Veterinary hospital, home visits, pet mall and client portal in Al Kabir Town, Lahore.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f3ea",
    theme_color: "#0e3a44",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}

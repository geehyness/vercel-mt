import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "iqh0j8zv",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});
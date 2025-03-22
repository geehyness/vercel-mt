import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "nf8eqs51",
  dataset: "production",
  apiVersion: "2024-11-01",
  useCdn: false,
});
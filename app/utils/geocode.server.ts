import { Client } from "@googlemaps/google-maps-services-js";

export async function geocode(query: string) {
  const key = process.env.GOOGLE_API_KEY ?? "";
  const client = new Client({});
  return await client.geocode({ params: { address: query, key } });
}

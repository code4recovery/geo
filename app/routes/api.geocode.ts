import { LoaderFunction, json } from "@remix-run/node";

import { geocode } from "~/utils/geocode.server";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get("search")?.toString();

  if (!searchQuery) {
    return json({ error: "No search query provided" }, { status: 400 });
  }

  return json(await geocode(searchQuery));
};

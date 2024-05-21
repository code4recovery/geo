import type { MetaFunction } from "@remix-run/node";
import { useFetcher, useNavigation, useSearchParams } from "@remix-run/react";

import { strings, useStrings } from "~/hooks/strings";
import { Location } from "~/components/Location";

export const meta: MetaFunction = () => {
  const { appTitle, appDescription } = strings;
  return [
    { title: appTitle },
    { name: "description", content: appDescription },
  ];
};

export default function Index() {
  const { appTitle, appDescription, searchPlaceholder } = useStrings();
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const geocode = useFetcher();

  return (
    <div className="flex flex-col min-h-screen lg:flex-row">
      <div className="flex flex-col gap-6 p-6 lg:order-2 lg:p-14 lg:w-[33%]">
        <div>
          <h1 className="font-bold text-xl">{appTitle}</h1>
          <p>{appDescription}</p>
        </div>
        <geocode.Form method="get" action="/api/geocode">
          <fieldset disabled={navigation.state === "submitting"}>
            <input
              type="search"
              name="search"
              className="rounded w-full"
              placeholder={searchPlaceholder}
              defaultValue={searchParams.get("search") ?? ""}
            />
          </fieldset>
        </geocode.Form>
        <Location formattedAddress="123 Main St, Kelowna, BC, Canada" />
      </div>
      <div className="bg-blue-300 flex-grow"></div>
    </div>
  );
}

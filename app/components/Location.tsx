import { MapPinIcon } from "@heroicons/react/24/outline";

export function Location({ formattedAddress }: { formattedAddress: string }) {
  return (
    <button className="border border-gray-400 rounded p-3 flex gap-1 items-center focus:border-blue-500">
      <MapPinIcon className="w-12 h-12" />
      <div className="flex flex-col">
        <address className="not-italic font-lg font-bold">
          {formattedAddress}
        </address>
        <dl>
          <div className="flex gap-2">
            <dd>Type:</dd>
            <dt>Specific Location</dt>
          </div>
        </dl>
      </div>
    </button>
  );
}

<?php

namespace App\Http\Controllers;

use App\Models\Geocode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;

class ApiController extends Controller
{
    public static function geocode(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'application' => 'string|required',
            'language' => 'string',
            'referrer' => 'url|required',
            'search' => 'string|required',
            'north' => 'numeric',
            'south' => 'numeric',
            'east' => 'numeric',
            'west' => 'numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'reason' => $validator->errors()->first(),
            ], 422);
        }

        $region = $formatted_address = null;

        // supported languages
        if (!in_array($request->language, self::$languages)) {
            $request->language = 'en';
        }

        // bias results by region 
        $domain = parse_url($request->referrer, PHP_URL_HOST);
        $domain_parts = explode('.', $domain);
        $tld = end($domain_parts);
        if (in_array($tld, self::$countryTlds)) {
            $region = $tld;
        }
        if ($domain_parts[0] === 'www') {
            array_shift($domain_parts);
            $domain = implode('.', $domain_parts);
        }

        // check database
        $geocode = Geocode::where(function ($query) use ($request) {
            return $query->where('search', $request->search)->orWhere('formatted_address', $request->search);
        })
            ->where('region', $region)
            ->where('language', $request->language)
            ->where('north', $request->north)
            ->where('south', $request->south)
            ->where('east', $request->east)
            ->where('west', $request->west)
            ->first();

        if ($geocode) {
            return [
                'type' => 'cache',
                'request' => [
                    'search' => $request->search,
                    'language' => $request->language,
                    'referrer' => $request->referrer,
                    'region' => $region,
                    'north' => $request->north ? (float) $request->north : null,
                    'south' => $request->south ? (float) $request->south : null,
                    'east' => $request->east ? (float) $request->east : null,
                    'west' => $request->west ? (float) $request->west : null,
                ],
                ...$geocode->response,
            ];
        }

        $response = Http::get('https://maps.googleapis.com/maps/api/geocode/json?' . http_build_query([
            'address' => $request->search,
            'key' => env('GOOGLE_API_KEY'),
            'language' => $request->language,
            'region' => $region,
            'bounds' => ($request->north && $request->south && $request->east && $request->west) ?
                "$request->south,$request->west|$request->north,$request->east"
                : null,
        ]))->json();

        if (is_array($response['results']) && count($response['results'])) {
            $formatted_address = $response['results'][0]['formatted_address'];
        }

        $geocode = Geocode::create([
            'application' => $request->application,
            'formatted_address' => $formatted_address,
            'language' => $request->language,
            'referrer' => $request->referrer,
            'domain' => $domain,
            'region' => $region,
            'response' => $response,
            'search' => $request->search,
            'north' => $request->north,
            'south' => $request->south,
            'east' => $request->east,
            'west' => $request->west,
        ]);

        return [
            'type' => 'live',
            'request' => [
                'search' => $request->search,
                'language' => $request->language,
                'referrer' => $request->referrer,
                'region' => $region,
                'north' => $request->north,
                'south' => $request->south,
                'east' => $request->east,
                'west' => $request->west,
            ],
            ...$response,
        ];
    }
}

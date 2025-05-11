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
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'reason' => $validator->errors()->first(),
            ], 422);
        }

        $region = $formatted_address = null;

        // bias results by region 
        $domain = parse_url($request->referrer, PHP_URL_HOST);
        $domain_parts = explode('.', $domain);
        $tld = end($domain_parts);
        if (in_array($tld, self::$countryTlds)) {
            $region = $tld;
        }

        // check database
        $geocode = Geocode::where(function ($query) use ($request) {
            return $query->where('search', $request->search)->orWhere('formatted_address', $request->search);
        })
            ->where('region', $region)
            ->where('language', $request->language)
            ->first();

        if ($geocode) {
            return [
                'type' => 'cache',
                'request' => [
                    'address' => $request->address,
                    'language' => $request->language,
                    'referrer' => $request->referrer,
                    'region' => $region,
                ],
                ...$geocode->response,
            ];
        }

        $response = Http::get('https://maps.googleapis.com/maps/api/geocode/json?' . http_build_query([
            'address' => $request->search,
            'key' => env('GOOGLE_API_KEY'),
            'language' => $request->language,
            'region' => $region,
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
        ]);

        return [
            'type' => 'live',
            'request' => [
                'address' => $request->address,
                'language' => $request->language,
                'referrer' => $request->referrer,
                'region' => $region,
            ],
            ...$response,
        ];
    }
}

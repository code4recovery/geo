<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Geocode extends Model
{
    protected $fillable = [
        'application',
        'domain',
        'formatted_address',
        'language',
        'referrer',
        'region',
        'response',
        'search',
        'north',
        'south',
        'east',
        'west',
    ];

    protected $casts = [
        'response' => 'json',
    ];

}

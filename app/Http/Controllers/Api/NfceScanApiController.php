<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class NfceScanApiController extends Controller
{
    public function scan(Request $request)
    {
        $data = $request->validate([
            'url' => 'required|url',
        ]);

        $rawValue = $data['url'];
        $regex = '/\b\d{44}\b/';
        preg_match($regex, $rawValue, $matches);
        $data['resultado'] = $matches[0] ?? null;

        if (!isset($data['resultado'])) {
            return response()->json(['message' => 'Invalid NFC-e URL.'], 400);
        }


        try {
            if (\App\Models\PendingScraping::where('key', $data['resultado'])->first()) {
                return response()->json(['message' => 'This URL is already scheduled for scraping.'], 200);
            }

            \App\Models\PendingScraping::create([
                'url' => $request->input('url'),
                'key' => $data['resultado'],
            ]);

            return response()->json(['message' => 'Scraping scheduled successfully.'], 200);
        } catch (\Exception $e) {
            Log::error('Error scheduling scraping: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred while scheduling the scraping.'], 500);
        }
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TagController extends Controller
{
    public function fetch_create(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:tags,name',
        ]);

        $tag = \App\Models\Tag::create([
            'name' => $request->name
        ]);

        return response()->json($tag);
    }
}

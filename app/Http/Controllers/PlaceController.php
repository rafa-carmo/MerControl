<?php

namespace App\Http\Controllers;

use App\Models\Place;
use Illuminate\Http\Request;

class PlaceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia('Places/Index', [
            'places' => Place::orderBy('created_at', 'desc')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Places/Form');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'cnpj' => 'required|string|unique:places,cnpj',
            'name' => 'required|string',
            'business_name' => 'nullable|string',
        ]);

        Place::create([
            'cnpj' => $request->cnpj,
            'name' => $request->name,
            'business_name' => $request->business_name,
        ]);
        return to_route('places.index')->with('success', 'Place created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Place $place)
    {
        return inertia('Places/Form', ['place' => $place, 'disabled' => true]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Place $place)
    {
        return inertia('Places/Form', ['place' => $place]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Place $place)
    {
        $request->validate([
            'cnpj' => 'required|string|unique:places,cnpj,' . $place->id,
            'name' => 'required|string',
            'business_name' => 'nullable|string',
        ]);

        $place->update([
            'cnpj' => $request->cnpj,
            'name' => $request->name,
            'business_name' => $request->business_name,
        ]);
        return to_route('places.index')->with('success', 'Place updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Place $place)
    {
        $place->delete();
        return response()->noContent(202);
    }
}

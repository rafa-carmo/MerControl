<?php

namespace App\Http\Controllers;

use App\Models\FinancialFlow;
use Illuminate\Http\Request;

class FinancialFlowController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $perPage = $request->input('perPage', 20);

        $financialFlows = FinancialFlow::orderBy('id', 'desc')->paginate($perPage)->withQueryString();
        return inertia('FinancialFlows/Index', [
            'financialFlows' => $financialFlows,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('FinancialFlows/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
      
        // dd($request->all());
        $request->validate([
            // expect a date string (YYYY-MM-DD). Use date validation and keep uniqueness on the column
           'year' => 'required|digits:4|integer|unique:financial_flows,year',
        ]);

        FinancialFlow::create([
            'year' => $request->year,
        ]);
        return to_route('financial-flows.index')->with('success', 'Financial Flow created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(FinancialFlow $financialFlow)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FinancialFlow $financialFlow)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, FinancialFlow $financialFlow)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FinancialFlow $financialFlow)
    {
        //
    }
}

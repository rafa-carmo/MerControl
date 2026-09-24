<?php

namespace App\Http\Controllers;

use App\Models\FinancialFlow;
use App\Models\FinancialLaunch;
use App\Models\Revenue;
use App\Models\RevenueType;
use Illuminate\Http\Request;

class RevenueController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, FinancialFlow $financialFlow, FinancialLaunch $financialLaunch)
    {

        $perPage = $request->input('perPage', 20);


        $query = Revenue::query();
        if ($financialLaunch) {
            $query->where('financial_launch_id', $financialLaunch->id);
        }
        if ($request->filled('description')) {
            $query->where('description', 'like', "%{$request->input('description')}%");
        }

        // $query = Revenue::where('financial_launch_id', $financialLaunch->id);


        $revenues = $query->orderBy('id', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        return inertia('Revenues/Index', [
            'revenues' => $revenues,
            'financial_launch_id' => $financialLaunch ? $financialLaunch->id : null,
            'financial_flow_id' => $financialFlow ? $financialFlow->id : null,
            'filters' => $request->only('description'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request, FinancialFlow $financialFlow, FinancialLaunch $financialLaunch)
    {
        $revenueTypes = RevenueType::orderBy('name')->get();

        return inertia('Revenues/Create', [
            'revenue_types' => $revenueTypes,
            'financial_launch_id' => $financialLaunch->id,
            'financial_flow_id' => $financialFlow->id,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, FinancialFlow $financialFlow, FinancialLaunch $financialLaunch)
    {
        $request->validate([
             'revenueType' => 'required|exists:revenue_types,id',
             'value' => 'required|numeric',
             'description' => 'nullable|string',
         ]);
        //  dd($request->all());
        $data = $request->only(['value', 'description']);
        $data['financial_launch_id'] = $financialLaunch->id;

        $data['revenue_type_id'] = $request->revenueType;
        $data =  Revenue::create($data);

    

        return redirect()->route('revenues.index', ['financial_flow' => $financialFlow->id, 'financial_launch' => $financialLaunch->id])->with('success', trans('Revenue created successfully.'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Revenue $revenue)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FinancialFlow $financialFlow, FinancialLaunch $financialLaunch, Revenue $revenue)
    {
        $revenueTypes = RevenueType::orderBy('name')->get();

        return inertia('Revenues/Edit', [
            'revenue' => $revenue,
            'revenue_types' => $revenueTypes,
            'financial_launch_id' => $financialLaunch->id,
            'financial_flow_id' => $financialFlow->id,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, FinancialFlow $financialFlow, FinancialLaunch $financialLaunch, Revenue $revenue)
    {
        $request->validate([
            'revenue_type_id' => 'required|exists:revenue_types,id',
            'value' => 'required|numeric',
            'description' => 'nullable|string',
        ]);
        $data = $request->only(['revenue_type_id', 'value', 'description']);
        $data['financial_launch_id'] = $financialLaunch->id;

        $revenue->update($data);

        return redirect()->route('revenues.index', ['financial_flow' => $financialFlow->id, 'financial_launch' => $financialLaunch->id])->with('success', trans('Revenue updated successfully.'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, FinancialFlow $financialFlow, FinancialLaunch $financialLaunch, Revenue $revenue)
    {

      try {

            $revenue->delete();

            $message = 'Revenue deleted successfully.';
            if ($request->wantsJson()) {
                return response()->json(['message' => $message], 200);
            }

            return to_route('revenues.index', ['financial_flow' => $financialFlow->id, 'financial_launch' => $financialLaunch->id])->with('success', $message);
        } catch (\Throwable $e) {
            $msg = $e->getMessage() ?: 'Delete failed.';
            if ($request->wantsJson()) {
                return response()->json(['message' => $msg], 500);
            }
            return redirect()->back()->with('error', $msg);
        }
    }

}

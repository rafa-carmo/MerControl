<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response | RedirectResponse
    {
        if (!config('app.allow_registration')) {
            return redirect()->route('login')->withErrors(['registration' => 'User registration is disabled. Please contact the administrator.']);
        }
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        if (!config('app.allow_registration')) {
            return redirect()->route('login')->withErrors(['registration' => 'User registration is disabled. Please contact the administrator.']);
        }
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect()->intended(route('dashboard', absolute: false));
    }

    public function generateToken(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'expiration' => 'string|in:1D,7D,30D,1Y,never',
        ]);
        $validated['expiration'] = null;

        if ($request->expiration !== 'never') {

            switch ($request->expiration) {
                case '1D':
                    $validated['expiration'] = now()->addDay();
                    break;
                case '7D':
                    $validated['expiration'] = now()->addDays(7);
                    break;
                case '30D':
                    $validated['expiration'] = now()->addDays(30);
                    break;
                case '1Y':
                    $validated['expiration'] = now()->addYear();
                    break;
            }

        }
        // dd(Carbon::create($validated['expiration'])->toDateTimeString());

        $token =  $request->user()->createToken($request->name, ['*'], $validated['expiration'] ?? null);

        return response()->json([
            'token' => $token->plainTextToken,
            'tokenData' => $token->accessToken,
        ], 201);
    }

    public function revokeToken(Request $request, $tokenId)
    {
        $token = $request->user()->tokens()->where('id', $tokenId)->first();

        if ($token) {
            $token->delete();
            return response()->json(['message' => 'Token revoked'], 200);
        }

        return response()->json(['error' => 'Token not found'], 404);
    }
}

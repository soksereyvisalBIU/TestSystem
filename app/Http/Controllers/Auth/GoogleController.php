<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Exception;
use Inertia\Inertia;

class GoogleController extends Controller
{

    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            $user = User::where('email', $googleUser->getEmail())->first();

            if (!$user) {
                // ✅ Register with Google
                $user = User::create([
                    'name'      => $googleUser->getName(),
                    'email'     => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'avatar'    => $googleUser->getAvatar(),
                    'password'  => bcrypt(str()->random(24)), // temp password
                ]);
            } else {
                // ✅ Login OR link Google account
                if (!$user->google_id) {
                    $user->update([
                        'google_id' => $googleUser->getId(),
                    ]);
                }

                // Always keep avatar fresh (optional)
                $user->update([
                    'avatar' => $googleUser->getAvatar(),
                ]);
            }

            Auth::login($user, true);

            // 🔐 Force password setup if user never set one
            if (!$user->password_changed_at) {
                return redirect()->route('password.force');
            }

            return redirect()->intended('/dashboard');
        } catch (\Exception $e) {
            return redirect()->route('login')
                ->withErrors(['email' => 'Google authentication failed.']);
        }
    }



    public function handleCredential(Request $request)
    {
        $token = $request->token;

        try {
            // Verify the JWT and get user details
            $googleUser = Socialite::driver('google')->userFromToken($token);

            $user = User::updateOrCreate([
                'email' => $googleUser->getEmail(),
            ], [
                'name' => $googleUser->getName(),
                'google_id' => $googleUser->getId(),
                'avatar' => $googleUser->getAvatar(),
                // If new user, set a random password
                'password' => $user->password ?? bcrypt(str()->random(24)),
            ]);

            Auth::login($user, true);

            return redirect()->intended('/dashboard');
        } catch (\Exception $e) {
            return back()->withErrors(['email' => 'Google authentication failed.']);
        }
    }

    public function showForcePassword()
    {
        return Inertia::render('auth/force-password');
    }

    public function storeForcePassword(Request $request)
    {
        $request->validate([
            'password' => 'required|min:8|confirmed',
        ]);

        $user = auth()->user();

        $user->update([
            'password' => Hash::make($request->password),
            'password_changed_at' => now(),
        ]);

        return redirect('/dashboard')
            ->with('success', 'Password updated successfully');
    }


    // public function redirect()
    // {
    //     return Socialite::driver('google')->redirect();
    // }

    // public function callback()
    // {
    //     $googleUser = Socialite::driver('google')->stateless()->user();

    //     $user = User::updateOrCreate(
    //         ['email' => $googleUser->email],
    //         [
    //             'name' => $googleUser->name,
    //             'google_id' => $googleUser->id,
    //             'avatar' => $googleUser->avatar,
    //             'password' => bcrypt('google-login')
    //         ]
    //     );

    //     Auth::login($user);

    //     return redirect('/dashboard'); // or Inertia route
    // }
}

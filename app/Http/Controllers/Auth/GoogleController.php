<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Exception;
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

            $user = User::updateOrCreate(
                ['email' => $googleUser->email],
                [
                    'name' => $googleUser->name,
                    'google_id' => $googleUser->id,
                    'avatar' => $googleUser->avatar,
                    'password' => bcrypt(str()->random(16)) // Security: Use random pass
                ]
            );

            Auth::login($user, true); // true = remember user

            return view('auth.callback', ['status' => 'success']);
        } catch (Exception $e) {
            return view('auth.callback', ['status' => 'error']);
        }
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

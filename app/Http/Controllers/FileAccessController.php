<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class FileAccessController extends Controller
{
    public function shosw(string $path): StreamedResponse|Response
    {
        // 1. Performance: Use ltrim to sanitize and prevent double slashes
        $path = ltrim(urldecode($path), '/');
        $fullPath = "private/{$path}";

        // 2. Security & Stability: Check existence BEFORE calling metadata-heavy methods
        // This prevents the 500 error and returns a clean 404.
        if (!Storage::disk('local')->exists($fullPath)) {
            // abort(Response::HTTP_NOT_FOUND, 'File not found.');
        }

        // 3. Performance: Stream directly. 
        // If you don't need to force a download dialogue, use 'response()'.
        // If you want to maximize speed and bypass Flysystem's metadata overhead, 
        // you can manually set headers, but response() is generally the Laravel standard.
        // return Storage::disk('local')->response($fullPath);
        return response()->file(storage_path("app/{$filepath}"));
    }
    public function showsss(string $path)
    {
        // dd($path);  
        // "uploads/answers/9b89aeee-9fc3-41d7-85c3-1e9bc7a061ec_20260108_143506.jpg"
        // Decode URL-encoded path
        // $path = urldecode($path);

        // // 🔐 SECURITY: must be logged in
        // // abort_unless(auth()->check(), 403);

        // // Optional: role / ownership checks here
        // // Example:
        // // abort_unless(auth()->user()->can('viewSubmission', $path), 403);

        // $fullPath = "private/{$path}";

        // // dd($fullPath);

        // // abort_unless(Storage::exists($fullPath), 404);

        // // return Storage::download($fullPath);
        // return Storage::disk('local')->response($fullPath);

        $filepath = "private/" . $path;

        // dd($filename);
        if (!Storage::exists($filepath)) {
            // abort(404 , 'File not found.');
            // return response()->json(['message' => 'File not found.'], 404);
        }


        return response()->file(storage_path("app/{$filepath}"));
    }

    public function show(string $path): BinaryFileResponse
    {
        // 1. SANITIZATION (Security)
        // Remove any "../" and leading slashes to prevent directory traversal
        $path = str_replace('..', '', urldecode($path));
        $path = ltrim($path, '/');

        $fullPath = storage_path("app/private/{$path}");

        // 3. AUTHORIZATION (Security/Speed)
        // Logic: Can this specific user see this specific file?
        // Optimization: Check this via a database record or a naming convention
        // Example: if (!auth()->user()->can('view-answer', $path)) { abort(403); }

        // 4. EXISTENCE CHECK (Stability)
        if (!file_exists($fullPath)) {
            abort(404);
        }

        // 5. DELIVERY (Performance)
        return response()->file($fullPath, [
            // Set to 'private' so public CDNs/proxies don't cache private student data
            'Cache-Control' => 'private, no-transform, max-age=86400',
        ]);




        // 1. Security: Clean the path to prevent ../../ attacks
        // $path = ltrim(urldecode($path), '/');
        $fullAbsolutePath = storage_path("app/private/{$path}");

        // 2. Performance: Fail fast if the file doesn't exist to save resources
        if (!file_exists($fullAbsolutePath)) {
            abort(404);
        }

        // 3. Speed: response()->file() returns a BinaryFileResponse.
        // This is highly efficient as it uses the server's underlying 'sendfile' 
        // capability if configured (like in Nginx/Apache).
        return response()->file($fullAbsolutePath, [
            'Cache-Control' => 'private, max-age=86400', // Cache for 24h to reduce server load
        ]);
    }
}

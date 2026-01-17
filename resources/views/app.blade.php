<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title inertia>{{ config('app.name', 'Assessment Platform') }}</title>
    <meta name="description"
        content="{{ $pageDescription ?? 'Professional assessment tools for skill evaluation and performance tracking.' }}">
    <meta name="keywords" content="assessment, skill test, evaluation, recruitment, online testing">
    <meta name="author" content="{{ config('app.name') }}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="{{ url()->current() }}">

    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:title" content="{{ $pageTitle ?? config('app.name') }}">
    <meta property="og:description"
        content="{{ $pageDescription ?? 'Evaluate skills effectively with our professional assessment platform.' }}">
    <meta property="og:image" content="{{ asset('assets/meta/og-image.png') }}"> {{-- Ensure this file exists in /public --}}
    <meta property="og:site_name" content="{{ config('app.name') }}">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="{{ url()->current() }}">
    <meta name="twitter:title" content="{{ $pageTitle ?? config('app.name') }}">
    <meta name="twitter:description"
        content="{{ $pageDescription ?? 'Evaluate skills effectively with our professional assessment platform.' }}">
    <meta name="twitter:image" content="{{ asset('assets/meta/og-image.png') }}">


    <!-- Primary Meta Tags -->
    {{-- <title>Assessment Platform</title>
    <meta name="title" content="Assessment Platform" />
    <meta name="description" content="Professional assessment tools for skill evaluation and performance tracking." />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="" />
    <meta property="og:title" content="Assessment Platform" />
    <meta property="og:description" content="Professional assessment tools for skill evaluation and performance tracking." />
    <meta property="og:image" content="https://metatags.io/images/meta-tags.png" />

    <!-- X (Twitter) -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="" />
    <meta property="twitter:title" content="Assessment Platform" />
    <meta property="twitter:description" content="Professional assessment tools for skill evaluation and performance tracking." />
    <meta property="twitter:image" content="https://metatags.io/images/meta-tags.png" /> --}}

    <!-- Meta Tags Generated with https://metatags.io -->

    {{-- Inline script to detect system dark mode preference --}}
    <script>
        (function() {
            const appearance = '{{ $appearance ?? 'system' }}';

            if (appearance === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                if (prefersDark) {
                    document.documentElement.classList.add('dark');
                }
            }
        })();
    </script>

    {{-- Inline style to set the HTML background color --}}
    <style>
        html {
            background-color: oklch(1 0 0);
        }

        html.dark {
            background-color: oklch(0.145 0 0);
        }
    </style>

    <link rel="icon" href="{{ asset('assets/meta/favicon.ico') }}" sizes="any">
    <link rel="icon" href="{{ asset('assets/meta/favicon.svg') }}" type="image/svg+xml">
    <link rel="apple-touch-icon" href="{{ asset('assets/meta/logo.png') }}">

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    @viteReactRefresh
    @routes
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>

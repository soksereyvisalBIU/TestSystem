<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}"
    class="{{ ($appearance ?? 'system') === 'dark' ? 'dark' : '' }}">

<head>
    {{-- =========================
        Basic Meta
    ========================== --}}
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title inertia>
        {{ $pageTitle ?? config('app.name', 'Assessment Platform') }}
    </title>

    <meta name="description"
        content="{{ $pageDescription ?? 'Professional assessment tools for skill evaluation, testing, and performance tracking.' }}">

    <meta name="keywords"
        content="{{ $pageKeywords ?? 'assessment, online test, skill evaluation, recruitment, examination system' }}">

    <meta name="author" content="{{ config('app.name') }}">
    <meta name="robots" content="index, follow">

    {{-- Google Search Console Verification --}}
    <meta name="google-site-verification" content="{{ config('services.google.site_verification') }}">


    {{-- Canonical --}}
    <link rel="canonical" href="{{ url()->current() }}">

    {{-- =========================
        Open Graph (Facebook, LinkedIn)
    ========================== --}}
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="{{ config('app.name') }}">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:title" content="{{ $pageTitle ?? config('app.name') }}">
    <meta property="og:description"
        content="{{ $pageDescription ?? 'Evaluate skills effectively using our professional assessment platform.' }}">
    <meta property="og:image" content="{{ asset('assets/meta/og-image.png') }}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">

    {{-- =========================
        Twitter Card
    ========================== --}}
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ $pageTitle ?? config('app.name') }}">
    <meta name="twitter:description"
        content="{{ $pageDescription ?? 'Evaluate skills effectively using our professional assessment platform.' }}">
    <meta name="twitter:image" content="{{ asset('assets/meta/og-image.png') }}">

    {{-- =========================
        Icons
    ========================== --}}
    <link rel="icon" href="{{ asset('assets/meta/favicon.ico') }}" sizes="any">
    <link rel="icon" href="{{ asset('assets/meta/favicon.svg') }}" type="image/svg+xml">
    <link rel="apple-touch-icon" href="{{ asset('assets/meta/apple-touch-icon.png') }}">

    {{-- =========================
        Fonts
    ========================== --}}
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet">

    {{-- =========================
        Prevent Dark Mode Flash
    ========================== --}}

    <meta property="og:type" content="website">
    <meta property="og:site_name" content="BELTEI IU Assessment System">
    <meta property="og:url" content="https://assessment.beltei.edu.kh">
    <meta property="og:title" content="BELTEI IU Assessment System">
    <meta property="og:description" content="Evaluate skills effectively with our professional assessment platform.">

    <meta property="og:image" content="https://assessment.beltei.edu.kh/assets/meta/og-image.png">
    <meta property="og:image:secure_url" content="https://assessment.beltei.edu.kh/assets/meta/og-image.png">
    <meta property="og:image:type" content="image/png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:image" content="https://assessment.beltei.edu.kh/assets/meta/og-image.png">

    <script>
        (function() {
            const appearance = '{{ $appearance ?? 'system' }}';

            if (appearance === 'dark' ||
                (appearance === 'system' &&
                    window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
            }
        })();
    </script>

    <style>
        html {
            background-color: oklch(1 0 0);
        }

        html.dark {
            background-color: oklch(0.145 0 0);
        }
    </style>

    {{-- =========================
        Inertia / Vite
    ========================== --}}
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia

</body>

</html>

{{-- =========================
    Structured Data (JSON-LD)
========================== --}}
{{-- <script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "{{ config('app.name') }}",
  "url": "{{ config('app.url') }}",
  "logo": "{{ asset('assets/meta/og-image.png') }}",
  "sameAs": [
    "https://www.facebook.com/",
    "https://www.linkedin.com/"
  ]
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "{{ config('app.name') }}",
  "url": "{{ config('app.url') }}",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "{{ config('app.url') }}/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script> --}}
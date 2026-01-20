<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}"
    class="{{ ($appearance ?? 'system') === 'dark' ? 'dark' : '' }}">

<head>
    {{-- ======================================================
        BASIC META
    ======================================================= --}}
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    @php
        $pageTitle = $pageTitle ?? 'BELTEI IU Assessment System';

        $pageDescription =
            $pageDescription ??
            implode(' ', [
                'BELTEI IU Assessment System is a secure and professional online assessment platform.',
                'Designed for universities, schools, and institutions to conduct exams, quizzes,',
                'skill evaluations, student testing, and performance analysis.',
                'Supports online exams, automated grading, result tracking, and analytics.',
            ]);

        $pageKeywords =
            $pageKeywords ??
            implode(', ', [
                'BELTEI IU',
                'BELTEI International University',
                'online assessment system',
                'assessment platform',
                'online exam system',
                'student assessment',
                'skill evaluation platform',
                'online testing',
                'university examination system',
                'school exam platform',
                'education technology',
                'e-learning assessment',
                'digital examination',
                'computer-based test',
                'CBT system',
                'quiz management system',
                'student performance tracking',
                'academic assessment software',
                'secure online exams',
                'exam management system',
                'assessment software Cambodia',
            ]);

        // ABSOLUTE URL ONLY (crawler-safe)
        $ogImage = 'https://assessment.beltei.edu.kh/assets/meta/og-img.png';
        $ogUrl = url()->current();
    @endphp


    <title inertia>{{ $pageTitle }}</title>

    <meta name="description" content="{{ $pageDescription }}">
    <meta name="keywords" content="{{ $pageKeywords }}">
    <meta name="author" content="BELTEI IU">
    <meta name="robots" content="index, follow">

    {{-- Google Search Console --}}
    <meta name="google-site-verification" content="{{ config('services.google.site_verification') }}">

    {{-- Canonical --}}
    <link rel="canonical" href="{{ $ogUrl }}">

    {{-- ======================================================
        OPEN GRAPH (Facebook, Telegram, LinkedIn)
    ======================================================= --}}
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="BELTEI IU Assessment System">
    <meta property="og:url" content="{{ $ogUrl }}">
    <meta property="og:title" content="{{ $pageTitle }}">
    <meta property="og:description" content="{{ $pageDescription }}">

    <meta property="og:image" content="{{ $ogImage }}">
    <meta property="og:image:secure_url" content="{{ $ogImage }}">
    <meta property="og:image:type" content="image/png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">

    {{-- ======================================================
        TWITTER CARD
    ======================================================= --}}
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ $pageTitle }}">
    <meta name="twitter:description" content="{{ $pageDescription }}">
    <meta name="twitter:image" content="{{ $ogImage }}">

    {{-- ======================================================
        ICONS
    ======================================================= --}}
    <link rel="icon" href="{{ asset('assets/meta/favicon.ico') }}" sizes="any">
    <link rel="icon" href="{{ asset('assets/meta/favicon.svg') }}" type="image/svg+xml">
    <link rel="apple-touch-icon" href="{{ asset('assets/meta/apple-touch-icon.png') }}">

    {{-- ======================================================
        FONTS
    ======================================================= --}}
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet">

    {{-- ======================================================
        DARK MODE FLASH PREVENTION
    ======================================================= --}}
    <script>
        (function() {
            const appearance = '{{ $appearance ?? 'system' }}';
            if (
                appearance === 'dark' ||
                (appearance === 'system' &&
                    window.matchMedia('(prefers-color-scheme: dark)').matches)
            ) {
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

    {{-- ======================================================
        INERTIA + VITE
    ======================================================= --}}
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>

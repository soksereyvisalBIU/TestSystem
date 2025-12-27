<!DOCTYPE html>
<html lang="en">
<head>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <style>body { background: #05070a; font-family: monospace; }</style>
</head>
<body class="min-h-screen flex items-center justify-center overflow-hidden text-cyan-400">
    <div class="absolute inset-0 opacity-10" style="background-image: repeating-linear-gradient(0deg, #22d3ee 0px, transparent 1px); background-size: 100% 4px;"></div>
    <main class="text-center z-10">
        <div class="relative mb-6 inline-block">
            <h1 class="text-9xl font-black tracking-tighter opacity-20">401</h1>
            <div id="scanner" class="absolute inset-0 border-2 border-cyan-500 rounded-lg flex items-center justify-center bg-cyan-950/20">
                <div class="w-full h-1 bg-cyan-400 absolute top-0 animate-[bounce_2s_infinite]"></div>
                <svg width="60" height="60" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>
        </div>
        <h2 class="text-2xl font-bold mb-2">IDENTITY_REQUIRED</h2>
        <p class="text-cyan-800 mb-8">Access to this node requires active credentials.</p>
        <button onclick="location.href='/login'" class="px-8 py-3 bg-cyan-500 text-black font-bold hover:shadow-[0_0_20px_#22d3ee] transition-all">SIGN_IN_TO_PROCEED</button>
    </main>
</body>
</html>
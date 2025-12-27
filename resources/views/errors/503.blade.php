<!DOCTYPE html>
<html lang="en">
<head>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <style>body { background: #08050a; font-family: monospace; }</style>
</head>
<body class="min-h-screen flex items-center justify-center text-purple-400">
    <main class="text-center">
        <div id="construct" class="mb-10 flex gap-4 justify-center">
            <div class="w-12 h-12 bg-purple-600 rounded"></div>
            <div class="w-12 h-12 bg-purple-900 rounded"></div>
        </div>
        <h1 class="text-[10rem] font-bold leading-none mb-4">503</h1>
        <h2 class="text-2xl font-bold bg-purple-950 px-4 py-1 inline-block border-x-4 border-purple-500">CORE_RECONSTRUCTION</h2>
        <p class="mt-6 text-purple-800 max-w-md mx-auto italic">Optimizing database clusters. We'll be back online shortly.</p>
    </main>
    <script>
        gsap.to("#construct div", { y: -30, stagger: 0.2, repeat: -1, yoyo: true, ease: "power1.inOut" });
        gsap.to("#construct", { rotation: 360, duration: 8, repeat: -1, ease: "none" });
    </script>
</body>
</html>
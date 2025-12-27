<!DOCTYPE html>
<html lang="en">
<head>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <style>body { background: #0a0a05; font-family: monospace; }</style>
</head>
<body class="min-h-screen flex items-center justify-center text-amber-500">
    <main class="text-center px-4">
        <h1 id="digit" class="text-[12rem] font-black italic tracking-tighter">429</h1>
        <div class="flex gap-2 justify-center mb-6">
            <div class="w-12 h-2 bg-amber-500 animate-pulse"></div>
            <div class="w-12 h-2 bg-amber-900"></div>
            <div class="w-12 h-2 bg-amber-900"></div>
        </div>
        <h2 class="text-3xl font-bold mb-4">THROTTLE_ENGAGED</h2>
        <p class="text-amber-700 max-w-sm mx-auto mb-8">System buffer full. Your request frequency has exceeded safety thresholds. Standby for cooldown.</p>
        <div id="timer" class="text-4xl font-mono mb-8 font-bold">00:30</div>
        <button onclick="location.reload()" class="border-2 border-amber-500 px-8 py-3 hover:bg-amber-500 hover:text-black transition-all">RETRY_CONNECTION</button>
    </main>
    <script>
        gsap.to("#digit", { skewX: 10, duration: 0.1, repeat: -1, yoyo: true });
        let sec = 30;
        setInterval(() => { if(sec > 0) sec--; document.getElementById('timer').innerText = `00:${sec < 10 ? '0' : ''}${sec}`; }, 1000);
    </script>
</body>
</html>
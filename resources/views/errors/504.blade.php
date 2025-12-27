<!DOCTYPE html>
<html lang="en">
<head>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <style>body { background: #050a08; font-family: monospace; }</style>
</head>
<body class="min-h-screen flex items-center justify-center text-emerald-500">
    <div class="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,#064e3b_0%,transparent_70%)] opacity-20"></div>
    <main class="text-center z-10">
        <h1 class="text-[14rem] font-thin opacity-30 animate-pulse tracking-[1rem]">504</h1>
        <div class="h-[1px] w-full bg-emerald-500/50 mb-8 relative">
            <div id="signal" class="w-4 h-4 bg-emerald-400 rounded-full absolute -top-1.5 shadow-[0_0_15px_#34d399]"></div>
        </div>
        <h2 class="text-3xl font-bold italic tracking-widest">GATEWAY_TIMEOUT</h2>
        <p class="text-emerald-900 mt-4 font-bold uppercase tracking-tighter">Uplink synchronization failure: Sub-node is unresponsive.</p>
        <div class="mt-12 flex gap-4 justify-center">
            <button onclick="location.reload()" class="px-10 py-3 bg-emerald-500 text-black font-black hover:bg-emerald-400">RE-SYNC_SIGNAL</button>
        </div>
    </main>
    <script>
        gsap.to("#signal", { left: "100%", duration: 3, repeat: -1, ease: "none" });
    </script>
</body>
</html>
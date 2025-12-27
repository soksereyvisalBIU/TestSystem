<!DOCTYPE html>
<html lang="en">
<head>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <style>
        body { background: #0a0705; font-family: monospace; overflow: hidden; }
        .glitch { text-shadow: 2px 0 #f59e0b, -2px 0 #78350f; }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center text-amber-500">
    <div class="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,#78350f_0%,transparent_70%)] opacity-20"></div>

    <main class="text-center z-10 p-6">
        <h1 class="text-[14rem] font-thin opacity-30 tracking-[1rem] glitch">405</h1>
        
        <div class="h-[2px] w-full bg-amber-900/50 mb-8 relative overflow-hidden">
            <div id="scanner" class="w-24 h-full bg-amber-400 absolute shadow-[0_0_20px_#f59e0b]"></div>
        </div>

        <h2 class="text-3xl font-bold italic tracking-[0.5rem] uppercase">Method_Not_Allowed</h2>
        <p class="text-amber-900 mt-4 font-black uppercase tracking-widest bg-amber-500/10 py-2">
            Protocol Violation: The requested action is restricted by security sub-routines.
        </p>

        <div class="mt-12 flex flex-col items-center gap-6">
            <div class="text-xs opacity-50 animate-pulse">TERMINATING_UNAUTHORIZED_REQUEST...</div>
            <div class="flex gap-4">
                <button onclick="history.back()" class="px-10 py-3 border border-amber-500 text-amber-500 font-black hover:bg-amber-500 hover:text-black transition-all">
                    RETURN_TO_ROOT
                </button>
            </div>
        </div>
    </main>

    <script>
        // Scanner animation
        gsap.to("#scanner", { 
            left: "100%", 
            duration: 1.5, 
            repeat: -1, 
            ease: "power2.inOut", 
            yoyo: true 
        });

        // Subtle flicker effect
        gsap.to(".glitch", {
            opacity: 0.4,
            duration: 0.1,
            repeat: -1,
            yoyo: true,
            repeatDelay: Math.random() * 2
        });
    </script>
</body>
</html>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CRITICAL: 500_SERVER_COLLAPSE</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&display=swap');
        
        body { font-family: 'Fira Code', monospace; background-color: #0d0202; }

        .heat-glow {
            text-shadow: 0 0 10px #ff4400, 0 0 20px #ff4400, 0 0 40px #ff0000;
        }

        .smoke-overlay {
            background: radial-gradient(circle at 50% 50%, transparent, #1a0505 150%);
            pointer-events: none;
        }

        @keyframes flicker {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
            80% { opacity: 0.9; }
        }
        .flicker-anim { animation: flicker 0.1s infinite; }
    </style>
</head>
<body class="text-orange-500 min-h-screen flex flex-col items-center justify-center overflow-hidden uppercase">

    <div class="fixed inset-0 smoke-overlay z-50"></div>
    <div id="alarm-light" class="fixed inset-0 bg-red-900/10 pointer-events-none z-40"></div>

    <main id="stage" class="relative z-10 text-center px-4">
        <div class="mb-4 inline-flex items-center gap-3 border-2 border-orange-600 px-6 py-2 bg-orange-950/30">
            <span class="w-3 h-3 bg-orange-600 rounded-full animate-ping"></span>
            <span class="font-bold tracking-[0.3em]">CORE_TEMP_CRITICAL</span>
        </div>

        <div class="relative">
            <h1 id="error-code" class="text-[10rem] md:text-[18rem] font-black leading-none heat-glow text-orange-600 select-none">
                500
            </h1>
            <p class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black font-black text-2xl md:text-4xl mix-blend-overlay">
                OVERLOAD
            </p>
        </div>

        <div class="mt-8 space-y-4 max-w-xl mx-auto">
            <h2 class="text-2xl md:text-3xl font-bold text-white italic underline decoration-orange-600">INTERNAL_SERVER_ERROR</h2>
            <div class="bg-black/60 p-4 border-l-4 border-orange-600 text-left text-xs md:text-sm text-orange-400/80 leading-relaxed">
                <p>> THREAD_PANIC: Stack overflow in core/kernel.sys</p>
                <p>> HEAT_SYNC: Failure detected in cluster 0x9f</p>
                <p>> STATUS: Attempting to prevent hardware meltdown...</p>
            </div>
        </div>

        <div class="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
            <button onclick="location.reload()" class="group relative px-10 py-4 bg-orange-600 text-black font-black transition-all hover:bg-white hover:shadow-[0_0_30px_#ff4400]">
                REBOOT_SYSTEM
            </button>
            <a href="/" class="px-10 py-4 border-2 border-orange-600 text-orange-600 font-bold hover:bg-orange-600/10 transition-colors">
                ESCAPE_TO_SAFETY
            </a>
        </div>
    </main>

    <div class="absolute top-1/2 left-10 -translate-y-1/2 hidden lg:block opacity-20 origin-left -rotate-90">
        VOLTAGE: 450V | TEMP: 104°C | LOAD: 99.9%
    </div>

    <script>
        // 1. Constant Shaking (The Overheat Effect)
        gsap.to("#stage", {
            x: 2,
            y: 2,
            duration: 0.05,
            repeat: -1,
            yoyo: true,
            ease: "none"
        });

        // 2. Alarm Light Pulsing
        gsap.to("#alarm-light", {
            opacity: 0.4,
            duration: 0.8,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut"
        });

        // 3. Reactive Mouse Wobble (UX Interactivity)
        document.addEventListener('mousemove', (e) => {
            const moveX = (e.clientX / window.innerWidth - 0.5) * 40;
            const moveY = (e.clientY / window.innerHeight - 0.5) * 40;

            gsap.to("#error-code", {
                x: moveX,
                y: moveY,
                duration: 1,
                ease: "power2.out"
            });
            
            // Subtle change in glow intensity based on mouse speed
            gsap.to(".heat-glow", {
                textShadow: `0 0 ${20 + Math.abs(moveX)}px #ff4400`,
                duration: 0.2
            });
        });

        // 4. Random Glitch Spikes
        function triggerSpike() {
            const tl = gsap.timeline();
            tl.to("body", { backgroundColor: "#220000", duration: 0.05 })
              .to("#error-code", { skewX: 20, scale: 1.1, duration: 0.05 })
              .to("body", { backgroundColor: "#0d0202", duration: 0.05 })
              .to("#error-code", { skewX: 0, scale: 1, duration: 0.05 });
            
            setTimeout(triggerSpike, Math.random() * 4000 + 1000);
        }
        triggerSpike();
    </script>
</body>
</html>
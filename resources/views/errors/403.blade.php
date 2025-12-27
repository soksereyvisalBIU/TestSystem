<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TERMINAL: 403_RESTRICTED_ACCESS</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;800&display=swap');
        
        body { font-family: 'JetBrains Mono', monospace; background-color: #050505; }

        .glitch-red {
            text-shadow: 2px 0 #ff0000, -2px 0 #00ffff;
        }

        /* Scanline effect */
        .vignette {
            background: radial-gradient(circle, transparent 20%, black 150%);
            pointer-events: none;
        }

        .border-blink {
            animation: blink 1s step-end infinite;
        }

        @keyframes blink {
            50% { opacity: 0; }
        }
    </style>
</head>
<body class="text-red-600 min-h-screen flex flex-col items-center justify-center overflow-hidden uppercase tracking-tighter">

    <div class="fixed inset-0 vignette z-50"></div>
    <div class="fixed inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.05),rgba(0,255,0,0.02),rgba(0,0,255,0.05))] bg-[length:100%_4px,3px_100%] pointer-events-none z-40"></div>

    <main class="relative z-10 text-center">
        <div class="mb-8 border-2 border-red-600 px-4 py-1 inline-block animate-pulse">
            <span class="font-bold">⚠ SECURITY ALERT: UNAUTHORIZED_ENTRY ⚠</span>
        </div>

        <div class="relative inline-block mb-4">
            <h1 id="code" class="text-[9rem] md:text-[15rem] font-extrabold leading-none italic glitch-red">
                403
            </h1>
            <div id="status" class="absolute -bottom-2 left-0 right-0 bg-red-600 text-black text-xl font-black py-1">
                FORBIDDEN
            </div>
        </div>

        <div class="max-w-md mx-auto space-y-6 px-6 mt-12">
            <p id="typewriter" class="text-sm md:text-base leading-relaxed text-red-500/80">
                // Credentials verification failed... <br>
                // Your IP has been logged... <br>
                // Access to this sector is restricted to LEVEL_5 admins only.
            </p>
        </div>

        <div class="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button onclick="history.back()" class="w-64 py-3 border-2 border-red-600 hover:bg-red-600 hover:text-black transition-all duration-200 font-bold flex items-center justify-center gap-2">
                &lt; ABORT_MISSION
            </button>
            <a href="/login" class="w-64 py-3 bg-red-600 text-black border-2 border-red-600 hover:bg-transparent hover:text-red-600 transition-all duration-200 font-bold flex items-center justify-center gap-2">
                RE-AUTHENTICATE _
            </a>
        </div>
    </main>

    <div class="absolute top-10 left-10 border-l-2 border-t-2 border-red-900 w-20 h-20 opacity-30"></div>
    <div class="absolute bottom-10 right-10 border-r-2 border-b-2 border-red-900 w-20 h-20 opacity-30"></div>
    <div class="absolute bottom-10 left-10 text-[10px] opacity-40 leading-tight">
        X-REF: 0x000403 <br>
        UID: UNKNOWN_GHOST <br>
        SIG: MALFORMED_TOKEN
    </div>

    <script>
        // 1. Random Glitch Pulse
        function glitchEffect() {
            const tl = gsap.timeline();
            tl.to("#code", {
                skewX: () => (Math.random() - 0.5) * 50,
                x: () => (Math.random() - 0.5) * 20,
                duration: 0.1,
                ease: "power4.inOut"
            })
            .to("#code", { skewX: 0, x: 0, duration: 0.05 });
            
            setTimeout(glitchEffect, Math.random() * 2000 + 200);
        }
        glitchEffect();

        // 2. Mouse Response (Camera Distortion)
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;

            gsap.to("main", {
                x: x,
                y: y,
                rotateY: x / 2,
                rotateX: -y / 2,
                duration: 0.8,
                ease: "power2.out"
            });
        });

        // 3. Simple Audio-style Click Feedback
        document.querySelectorAll('button, a').forEach(el => {
            el.addEventListener('mouseenter', () => {
                gsap.to("#status", { backgroundColor: "#fff", color: "#000", duration: 0.1 });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to("#status", { backgroundColor: "#dc2626", color: "#000", duration: 0.1 });
            });
        });
    </script>
</body>
</html>
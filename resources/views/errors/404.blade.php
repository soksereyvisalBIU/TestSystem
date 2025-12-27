<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ERROR: 404 - SYSTEM_BREACH</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
        
        body { font-family: 'Space Mono', monospace; }

        /* Custom glitch layers */
        .glitch-layer {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            pointer-events: none;
        }
        
        .scanline {
            width: 100%;
            height: 2px;
            background: rgba(34, 211, 238, 0.2);
            position: absolute;
            z-index: 50;
            pointer-events: none;
        }

        .crt-overlay {
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), 
                        linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
            background-size: 100% 4px, 3px 100%;
            pointer-events: none;
        }
    </style>
</head>
<body class="bg-[#0a0a0c] text-cyan-400 min-h-screen flex flex-col items-center justify-center overflow-hidden uppercase tracking-widest">

    <div class="fixed inset-0 crt-overlay z-[100]"></div>
    <div id="scanline" class="scanline"></div>

    <div class="absolute inset-0 opacity-10" 
         style="background-image: radial-gradient(#22d3ee 0.5px, transparent 0.5px); background-size: 20px 20px;">
    </div>

    <main class="relative z-10 text-center px-4">
        <div class="mb-2 text-xs font-bold opacity-50 flex items-center justify-center gap-2">
            <span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            CRITICAL_ERROR_DETECTED
        </div>

        <div class="relative group cursor-default">
            <h1 id="main-404" class="text-[8rem] md:text-[14rem] font-bold leading-none text-white">
                404
            </h1>
            <div id="glitch-r" class="glitch-layer text-red-500 text-[8rem] md:text-[14rem] font-bold leading-none mix-blend-screen translate-x-1">404</div>
            <div id="glitch-b" class="glitch-layer text-blue-500 text-[8rem] md:text-[14rem] font-bold leading-none mix-blend-screen -translate-x-1">404</div>
        </div>

        <div class="mt-4 space-y-6">
            <h2 id="status-text" class="text-xl md:text-2xl bg-cyan-950 px-4 py-1 inline-block border-x-4 border-cyan-400">
                PAGE_NOT_FOUND
            </h2>
            
            <p class="text-xs md:text-sm text-cyan-700 max-w-sm mx-auto leading-relaxed">
                The requested resource has been purged from the mainframe. <br>
                Unauthorized access to null-space is prohibited.
            </p>
        </div>

        <div class="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button onclick="history.back()" class="group relative px-8 py-3 bg-transparent border border-cyan-900 overflow-hidden">
                <div class="absolute inset-0 bg-cyan-900/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span class="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors">
                    [ GO_BACK ]
                </span>
            </button>

            <a href="/" class="group relative px-10 py-3 bg-cyan-500 text-black font-bold overflow-hidden shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                <div class="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                <span class="relative z-10 flex items-center gap-2">
                    RETURN_TO_ROOT
                </span>
            </a>
        </div>
    </main>

    <div class="absolute bottom-8 left-8 text-[10px] text-cyan-900 hidden md:block">
        LOC: 34.902 // 11.002 <br>
        STATUS: ERR_VOID_POINTER
    </div>

    <script>
        // 1. Scanline Loop
        gsap.to("#scanline", {
            top: "100%",
            duration: 4,
            ease: "none",
            repeat: -1
        });

        // 2. High-Frequency Glitch Function
        const glitchLayers = ["#glitch-r", "#glitch-b"];
        
        function triggerGlitch() {
            const tl = gsap.timeline();
            
            // Randomly flicker visibility and shift position
            tl.to(glitchLayers, {
                opacity: () => Math.random() * 0.8,
                x: () => (Math.random() - 0.5) * 20,
                y: () => (Math.random() - 0.5) * 10,
                duration: 0.1,
                stagger: 0.05
            })
            .to(glitchLayers, {
                opacity: 0,
                x: 0,
                y: 0,
                duration: 0.05
            });

            // Set next glitch timing randomly
            setTimeout(triggerGlitch, Math.random() * 3000 + 500);
        }
        triggerGlitch();

        // 3. Mouse Reactive Tilt
        document.addEventListener('mousemove', (e) => {
            const xPercent = (e.clientX / window.innerWidth) - 0.5;
            const yPercent = (e.clientY / window.innerHeight) - 0.5;

            gsap.to("main", {
                rotationY: xPercent * 10,
                rotationX: -yPercent * 10,
                transformPerspective: 1000,
                duration: 0.5
            });
            
            // Subtle blue glow following mouse
            gsap.to(".crt-overlay", {
                background: `radial-gradient(circle at ${e.clientX}px ${e.clientY}px, rgba(34, 211, 238, 0.05) 0%, transparent 50%)`,
                duration: 0.3
            });
        });

        // 4. "Typewriter" effect for status text
        const status = document.getElementById('status-text');
        const originalText = status.innerText;
        status.addEventListener('mouseenter', () => {
            let iterations = 0;
            const interval = setInterval(() => {
                status.innerText = originalText.split("")
                    .map((char, index) => {
                        if(index < iterations) return originalText[index];
                        return String.fromCharCode(65 + Math.floor(Math.random() * 26));
                    })
                    .join("");
                
                if(iterations >= originalText.length) clearInterval(interval);
                iterations += 1/3;
            }, 30);
        });
    </script>
</body>
</html>
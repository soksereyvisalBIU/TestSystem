import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
    Maximize2, 
    Minimize2, 
    Moon, 
    Sun,
    Keyboard, 
    Plus,
    Minus,
    LayoutGrid // Import the new icon
} from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from 'react';

export function FloatingTools({ 
    fontSize, 
    isFocusMode, 
    onFontSizeIncrease, 
    onFontSizeDecrease, 
    onToggleFocusMode,
    onOpenNavigator // New prop to trigger the mobile drawer
}) {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains('dark'));
    }, []);

    const toggleTheme = () => {
        const root = document.documentElement;
        if (root.classList.contains('dark')) {
            root.classList.remove('dark');
            setIsDark(false);
        } else {
            root.classList.add('dark');
            setIsDark(true);
        }
    };

    return (
        <TooltipProvider>
            {/* The container is now fixed at bottom-6. 
               We use backdrop-blur and a subtle border for a modern "Glassmorphism" feel.
            */}
            <div className="fixed bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-1 sm:gap-2 rounded-full border border-border bg-background/90 p-1.5 shadow-2xl backdrop-blur-xl transition-all z-[100] max-w-[95vw]">
                
                {/* 1. Navigator FAB (Mobile Only Trigger) */}
                <div className="lg:hidden border-r border-border pr-1 sm:pr-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button 
                                variant="default" 
                                size="icon" 
                                onClick={onOpenNavigator} 
                                className="h-9 w-9 sm:h-10 sm:w-10 rounded-full shadow-lg transition-transform active:scale-90"
                            >
                                <LayoutGrid className="h-4 w-4 sm:h-5 sm:w-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="rounded-full px-3 py-1 text-xs">
                            Navigator
                        </TooltipContent>
                    </Tooltip>
                </div>

                {/* 2. Font Controls */}
                <div className="flex items-center gap-0.5 sm:gap-1 border-r border-border pr-1 sm:pr-2">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={onFontSizeDecrease} 
                        className="h-8 w-8 sm:h-9 sm:w-9 rounded-full text-body hover:bg-accent"
                    >
                        <Minus className="h-3.5 w-3.5" />
                    </Button>
                    
                    <div className="flex h-8 w-6 sm:w-8 items-center justify-center font-mono text-[10px] sm:text-xs font-bold text-title">
                        {fontSize}
                    </div>
                    
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={onFontSizeIncrease} 
                        className="h-8 w-8 sm:h-9 sm:w-9 rounded-full text-body hover:bg-accent"
                    >
                        <Plus className="h-3.5 w-3.5" />
                    </Button>
                </div>

                {/* 3. Theme Toggle */}
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleTheme}
                    className="h-8 w-8 sm:h-9 sm:w-9 rounded-full text-body hover:bg-accent"
                >
                    {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>

                {/* 4. Focus Mode Toggle */}
                <Button 
                    variant={isFocusMode ? "secondary" : "ghost"} 
                    size="icon" 
                    onClick={onToggleFocusMode}
                    className={cn(
                        "hidden lg:flex h-8 w-8 sm:h-9 sm:w-9 rounded-full transition-colors",
                        isFocusMode ? "bg-primary/10 text-primary hover:bg-primary/20" : "text-body hover:bg-accent"
                    )}
                >
                    {isFocusMode ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>

                {/* 5. Keyboard Shortcuts */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="hidden sm:flex h-9 w-9 rounded-full bg-muted/50 text-muted-foreground hover:bg-accent"
                        >
                            <Keyboard className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent 
                        side="top" 
                        className="mb-4 w-64 rounded-2xl p-4 shadow-xl bg-popover border border-border text-popover-foreground"
                    >
                        <div className="space-y-2">
                            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Shortcuts</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <span className="text-body">Next Question</span>
                                <kbd className="text-[10px] font-bold bg-muted px-1.5 py-0.5 rounded border border-border ml-auto">Alt + →</kbd>
                                
                                <span className="text-body">Prev Question</span>
                                <kbd className="text-[10px] font-bold bg-muted px-1.5 py-0.5 rounded border border-border ml-auto">Alt + ←</kbd>
                                
                                <span className="text-body">Focus Mode</span>
                                <kbd className="text-[10px] font-bold bg-muted px-1.5 py-0.5 rounded border border-border ml-auto">Alt + F</kbd>
                                
                                <span className="text-body">Summary</span>
                                <kbd className="text-[10px] font-bold bg-muted px-1.5 py-0.5 rounded border border-border ml-auto">Alt + S</kbd>
                            </div>
                        </div>
                    </TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    );
}
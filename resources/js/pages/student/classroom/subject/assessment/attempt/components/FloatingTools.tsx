import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
    Type, 
    Maximize2, 
    Minimize2, 
    Contrast, 
    Keyboard, 
    RotateCcw,
    Plus,
    Minus
} from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export function FloatingTools({ 
    fontSize, 
    highContrast, 
    isFocusMode, 
    onFontSizeIncrease, 
    onFontSizeDecrease, 
    onToggleContrast, 
    onToggleFocusMode 
}) {
    return (
<TooltipProvider>
    <div className="fixed bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-background/80 p-2 shadow-2xl backdrop-blur-xl transition-all hover:scale-105 z-[100]">
        
        {/* Font Controls */}
        <div className="flex items-center gap-1 border-r border-border pr-2">
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={onFontSizeDecrease} 
                className="h-9 w-9 rounded-full text-body hover:bg-accent hover:text-accent-foreground"
            >
                <Minus className="h-4 w-4" />
            </Button>
            
            <div className="flex h-9 w-9 items-center justify-center font-bold text-xs text-title">
                {fontSize}
            </div>
            
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={onFontSizeIncrease} 
                className="h-9 w-9 rounded-full text-body hover:bg-accent hover:text-accent-foreground"
            >
                <Plus className="h-4 w-4" />
            </Button>
        </div>

        {/* Visual Toggles */}
        <Button 
            variant={highContrast ? "default" : "ghost"} 
            size="icon" 
            onClick={onToggleContrast}
            className={`h-9 w-9 rounded-full ${highContrast ? "bg-primary text-primary-foreground" : "text-body hover:bg-accent"}`}
        >
            <Contrast className="h-4 w-4" />
        </Button>

        <Button 
            variant={isFocusMode ? "default" : "ghost"} 
            size="icon" 
            onClick={onToggleFocusMode}
            className={`h-9 w-9 rounded-full ${isFocusMode ? "bg-primary text-primary-foreground" : "text-body hover:bg-accent"}`}
        >
            {isFocusMode ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>

        {/* Keyboard Shortcut Guide */}
        <Tooltip>
            <TooltipTrigger asChild>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 rounded-full bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                    <Keyboard className="h-4 w-4" />
                </Button>
            </TooltipTrigger>
            <TooltipContent 
                side="top" 
                className="mb-4 w-64 rounded-2xl p-4 shadow-xl bg-popover border border-border text-popover-foreground"
            >
                <div className="space-y-2">
                    <p className="text-xs font-black uppercase tracking-widest text-description">Shortcuts</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <span className="text-body">Next Question</span>
                        <kbd className="text-[10px] font-bold bg-muted px-1.5 py-0.5 rounded border border-border">Alt + →</kbd>
                        
                        <span className="text-body">Prev Question</span>
                        <kbd className="text-[10px] font-bold bg-muted px-1.5 py-0.5 rounded border border-border">Alt + ←</kbd>
                        
                        <span className="text-body">Focus Mode</span>
                        <kbd className="text-[10px] font-bold bg-muted px-1.5 py-0.5 rounded border border-border">Alt + F</kbd>
                        
                        <span className="text-body">Summary</span>
                        <kbd className="text-[10px] font-bold bg-muted px-1.5 py-0.5 rounded border border-border">Alt + S</kbd>
                    </div>
                </div>
            </TooltipContent>
        </Tooltip>
    </div>
</TooltipProvider>
    );
}
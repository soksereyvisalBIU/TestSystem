import { useEffect, useRef } from "react";
import { useSpring, useInView, useMotionValue, useTransform, motion } from "framer-motion";

type AnimatedCounterProps = {
    value: number;
    direction?: "up" | "down";
    decimals?: number; // Support for float
    className?: string;
};

export const AnimatedCounter = ({
    value,
    decimals = 0,
    className,
}: AnimatedCounterProps) => {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        damping: 60,
        stiffness: 100,
    });
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [motionValue, isInView, value]);

    // Transform logic for floats
    const displayValue = useTransform(springValue, (latest) =>
        latest.toFixed(decimals)
    );

    return <motion.span ref={ref} className={className}>{displayValue}</motion.span>;
};
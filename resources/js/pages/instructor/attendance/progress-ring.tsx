
export const ProgressRing = ({
    progress,
    size = 44,
}: {
    progress: number;
    size?: number;
}) => {
    const radius = size / 2 - 4;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 60) * circumference;
    return (
        <svg width={size} height={size} className="rotate-[-90deg]">
            <circle
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                r={radius}
                cx={size / 2}
                cy={size / 2}
                className="text-slate-200"
            />
            <circle
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={circumference}
                style={{
                    strokeDashoffset: offset,
                    transition: 'stroke-dashoffset 1s linear',
                }}
                strokeLinecap="round"
                fill="transparent"
                r={radius}
                cx={size / 2}
                cy={size / 2}
                className="text-primary"
            />
        </svg>
    );
};
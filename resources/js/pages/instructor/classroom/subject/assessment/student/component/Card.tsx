

// --- MOCK UI COMPONENTS ---
export const Card = ({ children, className = '' }) => (
    <div
        className={`overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm ${className}`}
    >
        {children}
    </div>
);
export const CardHeader = ({ children, className = '' }) => (
    <div
        className={`border-b border-gray-100 bg-gray-50/50 px-6 py-4 ${className}`}
    >
        {children}
    </div>
);
export const CardTitle = ({ children, className = '' }) => (
    <h2 className={`text-xl font-bold text-gray-800 ${className}`}>
        {children}
    </h2>
);
export const CardContent = ({ children, className = '' }) => (
    <div className={`p-6 ${className}`}>{children}</div>
);
export const Badge = ({ children, className = '' }) => (
    <span
        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
        {children}
    </span>
);
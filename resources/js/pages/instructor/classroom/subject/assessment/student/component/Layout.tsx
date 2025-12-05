export const AppLayout = ({ breadcrumbs, children }) => (
    <div className="min-h-screen bg-gray-50 p-4 font-sans sm:p-8">
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
            {breadcrumbs.map((item, index) => (
                <React.Fragment key={index}>
                    <a
                        href={item.href}
                        className="text-blue-600 transition-colors hover:text-blue-800"
                    >
                        {item.title}
                    </a>
                    {index < breadcrumbs.length - 1 && (
                        <span className="text-gray-400">/</span>
                    )}
                </React.Fragment>
            ))}
        </nav>
        {children}
    </div>
);
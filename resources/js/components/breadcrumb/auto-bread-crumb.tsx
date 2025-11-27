import * as React from "react";
import { usePage, Link } from "@inertiajs/react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { useBreadcrumbNames } from "@/hooks/breadcrumb/useBreadcrumbNames";

type AutoBreadcrumbProps = {
  overrides?: Record<string, string>;
  showIds?: boolean;
};

const formatLabel = (segment: string) =>
  segment
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export default function AutoBreadcrumb({
  overrides = {},
  showIds = false,
}: AutoBreadcrumbProps) {
  const { url } = usePage();
  const names = useBreadcrumbNames();

  const path = url.split("?")[0];
  const segments = path.split("/").filter(Boolean);

  const [isMobile, setIsMobile] = React.useState(false);

  // Detect mobile
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Mobile truncation
  const displaySegments =
    isMobile && segments.length > 2
      ? ["...", ...segments.slice(-2)]
      : segments;

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex flex-wrap items-center text-sm text-muted-foreground">
        {/* Home (desktop only) */}
        {!isMobile && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {segments.length > 0 && <BreadcrumbSeparator />}
          </>
        )}

        {displaySegments.map((segment, index) => {
          if (segment === "...") {
            return (
              <React.Fragment key="ellipsis">
                <BreadcrumbItem>
                  <span className="mx-1 text-gray-400">...</span>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </React.Fragment>
            );
          }

          const actualIndex =
            isMobile && segments.length > 2
              ? segments.length - (displaySegments.length - index)
              : index;

          const href = "/" + segments.slice(0, actualIndex + 1).join("/");
          const isLast = actualIndex === segments.length - 1;

          let label: string;

          // 1. Check override
          if (overrides[segment]) {
            label = overrides[segment];
          }
          // 2. If numeric ID → fetch name from hook if possible
          else if (/^\d+$/.test(segment)) {
            const parent = segments[actualIndex - 1];

            if (names[parent]?.id && String(names[parent].id) === segment) {
              label = names[parent].label;
            } else {
              label = showIds ? `#${segment}` : segment;
            }
          }
          // 3. Default formatting
          else {
            label = formatLabel(segment);
          }

          return (
            <React.Fragment key={href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

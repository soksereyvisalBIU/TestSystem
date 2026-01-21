// import {
//     Breadcrumb,
//     BreadcrumbItem,
//     BreadcrumbLink,
//     BreadcrumbList,
//     BreadcrumbPage,
//     BreadcrumbSeparator,
// } from '@/components/ui/breadcrumb';
// import { useBreadcrumbNames } from '@/hooks/breadcrumb/useBreadcrumbNames';
// import { Link, usePage } from '@inertiajs/react';
// import * as React from 'react';

// type AutoBreadcrumbProps = {
//     overrides?: Record<string, string>;
//     showIds?: boolean;
// };

// // Security: Define internal routing segments to be stripped from UI
// const INTERNAL_SEGMENTS = new Set(['student', 'instructor']);

// const formatLabel = (segment: string) =>
//     segment
//         .replace(/[-_]/g, ' ')
//         .split(' ')
//         .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//         .join(' ');

// export default function AutoBreadcrumb({
//     overrides = {},
//     showIds = false,
// }: AutoBreadcrumbProps) {
//     const { url } = usePage();
//     const names = useBreadcrumbNames();

//     /**
//      * PERFORMANCE: Memoized breadcrumb calculation and filtering.
//      * This logic now handles the removal of internal path prefixes.
//      */
//     const breadcrumbs = React.useMemo(() => {
//         const rawPath = url.split('?')[0];
//         const rawSegments = rawPath.split('/').filter(Boolean);

//         const items: { href: string; label: string; isLast: boolean }[] = [];
//         let cumulativePath = '';

//         rawSegments.forEach((segment, index) => {
//             cumulativePath += `/${segment}`;

//             // LOGIC: Skip internal segments like /student or /instructor
//             if (INTERNAL_SEGMENTS.has(segment.toLowerCase())) return;

//             let label: string;
//             if (overrides[segment]) {
//                 label = overrides[segment];
//             } else if (/^\d+$/.test(segment)) {
//                 const parent = rawSegments[index - 1];
//                 label =
//                     names[parent]?.id && String(names[parent].id) === segment
//                         ? names[parent].label
//                         : showIds
//                           ? `#${segment}`
//                           : segment;
//             } else {
//                 label = formatLabel(segment);
//             }

//             items.push({
//                 href: cumulativePath,
//                 label,
//                 isLast: index === rawSegments.length - 1,
//             });
//         });

//         return items;
//     }, [url, overrides, names, showIds]);

//     /**
//      * SEO: Generate JSON-LD BreadcrumbList schema
//      */
//     const jsonLd = React.useMemo(
//         () => ({
//             '@context': 'https://schema.org',
//             '@type': 'BreadcrumbList',
//             itemListElement: breadcrumbs.map((crumb, i) => ({
//                 '@type': 'ListItem',
//                 position: i + 1,
//                 name: crumb.label,
//                 item: `${window.location.origin}${crumb.href}`,
//             })),
//         }),
//         [breadcrumbs],
//     );

//     return (
//         <>
//             {/* SEO Security: Search engines now see the clean hierarchy */}
//             <script
//                 type="application/ld+json"
//                 dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
//             />

//             <Breadcrumb className="transform-gpu">
//                 <BreadcrumbList className="flex items-center text-sm">
//                     <BreadcrumbItem className="hidden sm:inline-flex">
//                         <BreadcrumbLink asChild>
//                             <Link
//                                 href="/"
//                                 className="font-medium transition-colors hover:text-foreground"
//                             >
//                                 Home
//                             </Link>
//                         </BreadcrumbLink>
//                     </BreadcrumbItem>

//                     {breadcrumbs.length > 0 && (
//                         <BreadcrumbSeparator className="hidden sm:inline-flex" />
//                     )}

//                     {breadcrumbs.map((crumb, index) => {
//                         const isMobileHidden =
//                             breadcrumbs.length > 2 &&
//                             index < breadcrumbs.length - 2;

//                         return (
//                             <React.Fragment key={crumb.href}>
//                                 {index === 0 && isMobileHidden && (
//                                     <div className="flex items-center sm:hidden">
//                                         <BreadcrumbItem>
//                                             <span className="px-1 text-muted-foreground/50">
//                                                 ...
//                                             </span>
//                                         </BreadcrumbItem>
//                                         <BreadcrumbSeparator />
//                                     </div>
//                                 )}

//                                 <BreadcrumbItem
//                                     className={
//                                         isMobileHidden
//                                             ? 'hidden sm:inline-flex'
//                                             : 'inline-flex'
//                                     }
//                                 >
//                                     {crumb.isLast ? (
//                                         <BreadcrumbPage className="font-bold text-foreground">
//                                             {crumb.label}
//                                         </BreadcrumbPage>
//                                     ) : (
//                                         <BreadcrumbLink asChild>
//                                             <Link
//                                                 href={crumb.href}
//                                                 className="transition-colors hover:text-foreground"
//                                             >
//                                                 {crumb.label}
//                                             </Link>
//                                         </BreadcrumbLink>
//                                     )}
//                                 </BreadcrumbItem>

//                                 {!crumb.isLast && (
//                                     <BreadcrumbSeparator
//                                         className={
//                                             isMobileHidden
//                                                 ? 'hidden sm:inline-flex'
//                                                 : 'inline-flex'
//                                         }
//                                     />
//                                 )}
//                             </React.Fragment>
//                         );
//                     })}
//                 </BreadcrumbList>
//             </Breadcrumb>
//         </>
//     );
// }


import * as React from "react";
import { usePage, Link } from "@inertiajs/react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import { useBreadcrumbNames } from "@/hooks/breadcrumb/useBreadcrumbNames";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const STRIP_LIST = new Set(['student', 'instructor' , 'admin']);

export default function AutoBreadcrumb({ overrides = {}, showIds = false }) {
  const { url } = usePage();
  const names = useBreadcrumbNames();

  const items = React.useMemo(() => {
    const segments = url.split("?")[0].split("/").filter(Boolean);
    const result = [];
    let path = "";

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      path += `/${seg}`;

      if (STRIP_LIST.has(seg.toLowerCase())) continue;

      let label = overrides[seg];
      if (!label) {
        if (/^\d+$/.test(seg)) {
          const parent = segments[i - 1];
          label = names[parent]?.id === Number(seg) ? names[parent].label : (showIds ? `#${seg}` : seg);
        } else {
          label = seg.replace(/[-_]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
        }
      }

      result.push({ href: path, label });
    }
    return result;
  }, [url, overrides, names, showIds]);

  // SEO: Clean hierarchy for Google Search
  const jsonLd = React.useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((it, i) => ({
      "@type": "ListItem", "position": i + 1, "name": it.label, "item": `${window.location.origin}${it.href}`
    }))
  }), [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <Breadcrumb>
        <BreadcrumbList>
          {/* Always show Home */}
          <BreadcrumbItem className="shrink-0">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          {items.length > 3 ? (
            <>
              {/* Show first actual segment after Home */}
              <BreadcrumbItem className="shrink-0">
                <Link href={items[0].href} className="hover:text-foreground truncate max-w-[120px]">
                  {items[0].label}
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />

              {/* Professional Middle Collapse */}
              <BreadcrumbItem>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1">
                    <BreadcrumbEllipsis className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {items.slice(1, -1).map((item, idx) => (
                      <DropdownMenuItem key={idx} asChild>
                        <Link href={item.href}>{item.label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          ) : (
            // Show all if 3 or fewer
            items.slice(0, -1).map((item, idx) => (
              <React.Fragment key={idx}>
                <BreadcrumbItem className="shrink-0">
                  <Link href={item.href} className="hover:text-foreground truncate max-w-[120px]">
                    {item.label}
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </React.Fragment>
            ))
          )}

          {/* Always show the Current Page (Tail) */}
          <BreadcrumbItem className="min-w-0">
            <BreadcrumbPage className="font-bold text-foreground truncate max-w-[200px] sm:max-w-[400px]">
              {items[items.length - 1].label}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </nav>
  );
}
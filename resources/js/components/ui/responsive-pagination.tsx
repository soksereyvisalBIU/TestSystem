import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { router } from "@inertiajs/react";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      className={cn("flex flex-row items-center gap-1.5", className)} // Increased gap for better touch targets
      {...props}
    />
  )
);
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn("list-none", className)} {...props} />
  )
);
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
  disabled?: boolean;
} & React.ComponentProps<"button"> & {
    size?: "default" | "sm" | "lg" | "icon";
};

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  disabled,
  ...props
}: PaginationLinkProps) => (
  <button
    type="button" // Security: Always specify button type
    aria-current={isActive ? "page" : undefined}
    disabled={disabled}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      "min-w-9 h-9 transition-colors", // Performance: Use h-9 for layout stability
      isActive && "pointer-events-none border-primary bg-primary/5 font-bold",
      disabled && "pointer-events-none opacity-40",
      "cursor-pointer flex items-center justify-center",
      className
    )}
    {...props}
  />
);

interface ResponsivePaginationProps {
  links: { url: string | null; label: string; active: boolean }[];
  meta: { current_page: number; last_page: number };
}

export function ResponsivePagination({ links, meta }: ResponsivePaginationProps) {
  // Performance: Return early if no pagination is needed
  if (!links || links.length <= 3) return null;

  const handleNavigate = (url: string | null) => {
    if (!url) return;
    router.get(url, {}, {
      preserveScroll: true,
      preserveState: true,
      only: ["users"], // Low Latency: Partial reload
    });
  };

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationLink
            onClick={() => handleNavigate(links[0].url)}
            disabled={!links[0].url}
            size="default"
            className="px-3 gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline-block">Previous</span>
          </PaginationLink>
        </PaginationItem>

        {/* Page Numbers */}
        {links.slice(1, -1).map((link, i) => {
          const pageNum = parseInt(link.label);
          const isCurrent = link.active;
          
          // Responsive Spacing Logic
          // Show: Current, Neighbors, and First/Last pages
          const isNearCurrent = Math.abs(meta.current_page - pageNum) <= 1;
          const isEndCaps = pageNum === 1 || pageNum === meta.last_page;

          if (!isEndCaps && !isNearCurrent) {
            // Ellipsis logic
            if (pageNum === 2 || pageNum === meta.last_page - 1) {
              return (
                <PaginationItem key={`ellipsis-${i}`} className="hidden md:block">
                  <span className="flex h-9 w-9 items-center justify-center text-muted-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </span>
                </PaginationItem>
              );
            }
            return null;
          }

          return (
            <PaginationItem 
              key={`page-${i}`} 
              className={cn(!isCurrent && !isNearCurrent && "hidden md:block")}
            >
              <PaginationLink
                isActive={isCurrent}
                onClick={() => handleNavigate(link.url)}
                // Sanitize/Clean label for performance
                className="text-sm"
              >
                {link.label}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* Next Button */}
        <PaginationItem>
          <PaginationLink
            onClick={() => handleNavigate(links[links.length - 1].url)}
            disabled={!links[links.length - 1].url}
            size="default"
            className="px-3 gap-1"
          >
            <span className="hidden sm:inline-block">Next</span>
            <ChevronRight className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
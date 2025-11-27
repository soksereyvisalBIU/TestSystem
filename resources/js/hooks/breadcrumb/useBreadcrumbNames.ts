import { usePage } from "@inertiajs/react";

type BreadcrumbNames = {
  [key: string]: {
    id?: number | string;
    label: string;
  };
};

/**
 * Automatically extracts human-readable names from Inertia props
 * for use in breadcrumbs, page titles, etc.
 */
export function useBreadcrumbNames(): BreadcrumbNames {
  const { props } = usePage();

  const names: BreadcrumbNames = {};

  // 👇 Extend this pattern to match your data shape
  if (props.course) {
    names.course = {
      id: props.course.id,
      label: props.course.name || props.course.title || `Course #${props.course.id}`,
    };
  }

  if (props.assessment) {
    names.assessment = {
      id: props.assessment.id,
      label: props.assessment.title || `Assessment #${props.assessment.id}`,
    };
  }

  if (props.student) {
    names.student = {
      id: props.student.id,
      label: props.student.name || `Student #${props.student.id}`,
    };
  }

  // add more model names here if needed (e.g., teacher, review, quiz, etc.)

  return names;
}

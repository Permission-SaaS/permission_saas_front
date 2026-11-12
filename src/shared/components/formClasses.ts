export const FIELD_LABEL_CLASSES = "text-sm font-medium text-gray-700";

export const FIELD_ERROR_CLASSES = "text-sm text-red-700";

export const fieldClasses = (hasError: boolean) => {
  const stateClasses = hasError
    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500";

  return `w-full rounded-md border px-3 py-1.5 text-sm text-gray-900 focus:ring-1 focus:outline-none ${stateClasses}`;
};

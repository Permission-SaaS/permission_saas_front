const BASE_CLASSES = "rounded-md border px-3 py-1.5 text-sm font-medium";

const VARIANT_CLASSES = {
  default:
    "border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none",
  danger: "border-red-300 text-red-700 hover:bg-red-100",
  primary: "border-blue-600 bg-blue-600 text-white hover:bg-blue-700",
};

export type ButtonVariant = keyof typeof VARIANT_CLASSES;

export const buttonClasses = (variant: ButtonVariant) => {
  return `${BASE_CLASSES} ${VARIANT_CLASSES[variant]}`;
};

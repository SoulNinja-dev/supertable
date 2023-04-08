import { UseFormRegister, FieldValues } from "react-hook-form";

export const isProperSlug = (slug: string): string => {
  if (slug.length === 0) {
    return "Error: Slug cannot be empty.";
  }

  const hasInvalidCharacters = /[^a-z0-9-_]/.test(slug);
  if (hasInvalidCharacters) {
    return "Error: Slug contains invalid characters. Use only lowercase alphanumeric characters, hyphens, and underscores.";
  }

  const startsOrEndsWithSeparator = /^[-_]|[-_]$/.test(slug);
  if (startsOrEndsWithSeparator) {
    return "Error: Slug cannot start or end with a hyphen or underscore.";
  }

  const hasConsecutiveSeparators = /[-_]{2,}/.test(slug);
  if (hasConsecutiveSeparators) {
    return "Error: Slug cannot have consecutive hyphens or underscores.";
  }

  return ""; // No error messages, the slug is valid.
};

export interface RHFProps {
  register: UseFormRegister<FieldValues>;
  registerDataA: string;
  registerDataB: boolean;
}
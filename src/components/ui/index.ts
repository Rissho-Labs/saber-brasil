/**
 * Atomic UI barrel — named re-exports only.
 * Prefer deep imports (`@/components/ui/button`) in Server Components when possible
 * so client leaves (SearchInput) stay out of the module graph.
 */

export { Button, buttonVariants, type ButtonProps } from "./button";
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  type CardProps,
  type CardHeaderProps,
  type CardTitleProps,
  type CardDescriptionProps,
  type CardContentProps,
  type CardFooterProps,
} from "./card";
export { Badge, badgeVariants, type BadgeProps } from "./badge";
export { Input } from "./input";
export { SearchInput, type SearchInputProps } from "./search-input";

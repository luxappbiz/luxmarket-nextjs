import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function timeAgo(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.round(diffMs / 1000);
  const diffMins = Math.round(diffSecs / 60);
  const diffHours = Math.round(diffMins / 60);
  const diffDays = Math.round(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMins < 1) {
    return 'Now';
  } else if (diffHours < 1) {
    return `${diffMins}m ago`;
  } else if (diffDays < 1) {
    return `${diffHours}hr ago`;
  } else if (diffMonths < 1) {
    const days = Math.floor(diffDays);
    const remainingHours = diffHours % 24;
    return remainingHours > 0
      ? `${days}d ${remainingHours}hr ago`
      : `${days}d ago`;
  } else {
    return `${diffMonths}mo ago`;
  }
}
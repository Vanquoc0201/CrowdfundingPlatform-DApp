import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const formatTimeLeft = (deadline: bigint): string => {
    const timeLeftSeconds = Number(deadline) - Math.floor(Date.now() / 1000);
    if (timeLeftSeconds <= 0) return "Ended";

    const days = Math.floor(timeLeftSeconds / (3600 * 24));
    const hours = Math.floor((timeLeftSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((timeLeftSeconds % 3600) / 60);

    if (days > 0) return `${days} days left`;
    if (hours > 0) return `${hours} hours left`;
    return `${minutes} minutes left`;
};
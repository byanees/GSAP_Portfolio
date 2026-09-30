import type { ReactNode } from "react";

/**
 * Joins lines of copy from src/data with a <br />, keeping the space before
 * each break so the words still separate wherever the break is hidden. Returns
 * an array rather than a fragment, so RevealText can split it by word.
 */
export function withBreaks(lines: string[], brClassName?: string): ReactNode[] {
    return lines.flatMap((line, i) => (i === 0 ? [line] : [" ", <br key={i} className={brClassName} />, line]));
}

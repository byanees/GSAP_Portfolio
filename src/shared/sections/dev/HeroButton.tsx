// Inside of the home hero's action pills: a label that rolls on hover, an
// optional muted note, and an icon in a circle that swaps on hover. The pill
// itself (link or button) carries `hero-btn` plus a --primary, --secondary or
// --ghost modifier; see "Home hero actions" in custom.css.

import type { ReactNode } from "react";

type Props = {
    label: string;
    /** Muted text after the label, for a detail worth knowing before clicking. */
    note?: string;
    icon: ReactNode;
};

export default function HeroButtonContent({ label, note, icon }: Props) {
    return (
        <>
            <span className="hero-btn__text">
                <span className="hero-btn__label">
                    <span>{label}</span>
                    <span aria-hidden="true">{label}</span>
                </span>
                {note ? <span className="hero-btn__note">{note}</span> : null}
            </span>
            <span className="hero-btn__chip" aria-hidden="true">
                {icon}
                {icon}
            </span>
        </>
    );
}

import { ARROW_SVG } from "./icons";

/** Small uppercase section label with the site's arrow swap, e.g. "WHAT I DO ↗". */
export default function Eyebrow({ children, light = false }: { children: string; light?: boolean }) {
    return (
        <span className={`at-btn ${light ? "text-white" : "common-black"} bg-transparent mb-10 rounded-0 p-0`}>
            <span className="text-uppercase">
                <span className="text-1">{children}</span>
                <span className="text-2">{children}</span>
            </span>
            <i>
                {ARROW_SVG}
                {ARROW_SVG}
            </i>
        </span>
    );
}

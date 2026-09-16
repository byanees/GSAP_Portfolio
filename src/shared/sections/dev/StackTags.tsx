function toSentence(items: string[]) {
    if (items.length <= 2) return items.join(" and ");
    return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/** Tech stack written as a short line under a small label, e.g. "BUILT WITH / .NET 9, ABP.io and Redis". */
export default function StackTags({
    tags,
    label = "Built with",
    dark = false,
    className = "",
}: {
    tags: string[];
    label?: string;
    dark?: boolean;
    className?: string;
}) {
    if (!tags.length) return null;
    return (
        <p className={`stack-line${dark ? " stack-line--dark" : ""} ${className}`.trim()}>
            {label && <span className="stack-line__label">{label}</span>}
            {toSentence(tags)}
        </p>
    );
}

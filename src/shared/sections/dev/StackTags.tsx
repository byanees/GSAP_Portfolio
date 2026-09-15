/** Tech stack shown as small monospace tags. */
export default function StackTags({ tags, dark = false, className = "" }: { tags: string[]; dark?: boolean; className?: string }) {
    return (
        <ul className={`dev-tags${dark ? " dev-tags--dark" : ""} ${className}`.trim()} aria-label="Tech stack">
            {tags.map((tag) => (
                <li key={tag} className="dev-tag">
                    {tag}
                </li>
            ))}
        </ul>
    );
}

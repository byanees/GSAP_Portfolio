import { NavLink } from "react-router-dom";
import { PAGES } from "@/data/navigation";
import { MainMenuRootList } from "@/shared/mobile-menu/MobileMenuCloneContext";

type Item = { to: string; label: string };

const MENU_LINKS: Item[] = PAGES.map((p) => ({ to: p.to, label: p.menuLabel ?? p.label }));

function LinkSwap({ label }: { label: string }) {
  return (
    <span className="at-link-swap">
      <span className="text-1">{label}</span>
      <span className="text-2">{label}</span>
    </span>
  );
}

function MenuLink({ to, label }: Item) {
  return (
    <NavLink to={to} className={({ isActive }) => (isActive ? "active" : undefined)}>
      <LinkSwap label={label} />
    </NavLink>
  );
}

export default function MainMenu() {
  return (
    <MainMenuRootList>
      {MENU_LINKS.map((item) => (
        <li key={item.label}>
          <MenuLink to={item.to} label={item.label} />
        </li>
      ))}
    </MainMenuRootList>
  );
}
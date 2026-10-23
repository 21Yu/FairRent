import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const getLinkClass = ({ isActive } : { isActive: boolean }) =>
    `relative flex shrink-0 items-center px-3 py-3 text-sm font-medium transition-colors after:absolute after:inset-x-3 after:bottom-0 after:h-[3px] after:rounded-t-full after:transition-colors md:h-full md:px-4 ${
      isActive 
        ? "text-gray-950 after:bg-indigo-300" 
        : "text-gray-500 hover:text-gray-950 after:bg-transparent"
    }`;

  return (
    <header className="sticky top-0 z-[1000] border-b border-gray-200 bg-white/95 backdrop-blur">
      <nav aria-label="Main navigation" className="mx-auto flex h-16 max-w-[1600px] items-center gap-2 px-4 md:px-8">
        <NavLink to="/" className="mr-auto flex shrink-0 items-center gap-2.5 pr-3">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-indigo-300 text-sm font-bold text-gray-950">F</span>
          <span className="font-semibold tracking-wide text-gray-950">FairRent</span>
        </NavLink>
        <div className="hidden h-full items-center gap-1 md:flex">
          <NavLink to="/" end className={getLinkClass}>Explore</NavLink>
          <NavLink to="/listview" className={getLinkClass}>List View</NavLink>
          <NavLink to="/savedlistings" className={getLinkClass}>Saved</NavLink>
          <NavLink to="/about" className={getLinkClass}>About</NavLink>
          <NavLink to="/profile" className={getLinkClass}>{user ? "Profile" : "Sign in"}</NavLink>
          {user?.is_admin && <NavLink to="/admin" className={getLinkClass}>Admin</NavLink>}
        </div>
        <button
          type="button"
          className="rounded-md border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-indigo-300 md:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? "Close" : "Menu"}
        </button>
      </nav>
      {isMenuOpen && (
        <div id="mobile-navigation" className="border-t border-gray-100 bg-white px-4 pb-3 md:hidden">
          <nav aria-label="Mobile navigation" className="flex flex-col">
            <NavLink to="/" end onClick={() => setIsMenuOpen(false)} className={getLinkClass}>Explore</NavLink>
            <NavLink to="/listview" onClick={() => setIsMenuOpen(false)} className={getLinkClass}>List View</NavLink>
            <NavLink to="/savedlistings" onClick={() => setIsMenuOpen(false)} className={getLinkClass}>Saved Listings</NavLink>
            <NavLink to="/about" onClick={() => setIsMenuOpen(false)} className={getLinkClass}>About</NavLink>
            <NavLink to="/profile" onClick={() => setIsMenuOpen(false)} className={getLinkClass}>{user ? "Profile" : "Sign in"}</NavLink>
            {user?.is_admin && <NavLink to="/admin" onClick={() => setIsMenuOpen(false)} className={getLinkClass}>Admin</NavLink>}
          </nav>
        </div>
      )}
    </header>
  );
}
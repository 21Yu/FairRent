import { NavLink } from "react-router-dom";

export default function Header() {
  const getLinkClass = ({ isActive } : { isActive: boolean }) =>
    `px-3 md:px-12 flex items-center text-[12px] font-bold ${
      isActive 
        ? "bg-indigo-300 text-white" 
        : ""
    }`;

  return (
    <header>

      <nav className="h-[60px] bg-white flex">
        
        <h1 className="px-4 md:px-8 items-center flex font-bold">FairRent</h1>

        <NavLink to="/" className={getLinkClass}>
          Home
        </NavLink>

        <NavLink to="/about" className={getLinkClass}>
          About
        </NavLink>

        <NavLink to="/contact" className={getLinkClass}>
          Contact
        </NavLink>
      </nav>
    </header>
  );
}
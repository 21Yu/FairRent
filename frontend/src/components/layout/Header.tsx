import { Link, NavLink } from "react-router-dom";

export default function Header() {
  const getLinkClass = ({ isActive } : { isActive: boolean }) =>
    `px-3 lg:px-12 flex items-center text-[12px] font-bold transition-colors ${
      isActive 
        ? "bg-[#0000ff] text-white" 
        : "text-black hover:bg-black hover:text-white"
    }`;

  return (
    <header>

      <nav className="h-[60px] bg-white flex">
        
        <Link to="/" className="px-4 lg:px-8 items-center hover:bg-black hover:text-white flex font-bold">
          <h1>FairRent</h1>
        </Link>

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
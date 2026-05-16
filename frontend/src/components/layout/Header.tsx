import { Link, NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header>

      <nav className="Header_nav">
        
        <Link to="/" className="Header_header-nav">
          <h1>FairRent</h1>
        </Link>

        <NavLink to="/" className="Header_nav-link">
          Home
        </NavLink>

        <NavLink to="/about" className="Header_nav-link">
          About
        </NavLink>

        <NavLink to="/contact" className="Header_nav-link">
          Contact
        </NavLink>
      </nav>
    </header>
  );
}
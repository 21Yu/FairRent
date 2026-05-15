import { Link, NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="Header_header">
      <div className="Header_header-logo-section">
        <Link to="/">
          <h1 className="Header_header-title">FairRent</h1>
        </Link>
      </div>

      <nav className="Header_header-nav">
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
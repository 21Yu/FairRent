import { Link, useLocation } from "react-router-dom";

import { headerStyles as styles } from "../../styles/header.styles";

export default function Header() {
  const location = useLocation();

  return (
    <header className={styles.header}>
      
      <div className={styles.logoSection}>
        <Link
          to="/"
        >
          <h1 className={styles.title}>
            FairRent
          </h1>
        </Link>
      </div>

      <nav className={styles.nav}>
        <Link
          to="/"
          className={styles.navLink(
            location.pathname === "/"
          )}
        >
          Home
        </Link>

        <Link
          to="/about"
          className={styles.navLink(
            location.pathname === "/about"
          )}
        >
          About
        </Link>

        <Link
          to="/contact"
          className={styles.navLink(
            location.pathname === "/contact"
          )}
        >
          Contact
        </Link>
      </nav>
    </header>
  );
}
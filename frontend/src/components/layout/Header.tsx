import { Link, useLocation } from "react-router-dom";

import { headerStyles as styles } from "../../styles/header.styles";

export default function Header() {
  const location = useLocation();

  return (
    <header className={styles.header}>
      
      {/* LOGO */}
      <div className={styles.logoSection}>
        <Link
          to="/"
          className={styles.logoWrapper}
        >
          <div className={styles.logoBars}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={styles.bar}
              />
            ))}
          </div>

          <h1 className={styles.title}>
            FairRent
          </h1>
        </Link>
      </div>

      {/* NAV */}
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

      {/* RIGHT UTILITY */}
      <div className={styles.rightSection}>
        <div className={styles.statusWrapper}>
          <div className={styles.statusDot} />

          <p className={styles.statusText}>
            Live_v1.0
          </p>
        </div>
      </div>
    </header>
  );
}
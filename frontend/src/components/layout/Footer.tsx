import { footerStyles as styles } from "../../styles/footer.styles";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        {/* LEFT SECTION */}
        <div className={styles.leftSection}>
          
          <div className={styles.accentBar} />

          <p className={styles.copyright}>
            © 2026{" "}
            <span className={styles.brand}>
              FairRent
            </span>{" "}
            // ALL RIGHTS RESERVED
          </p>
        </div>

        {/* RIGHT SECTION */}
        <div className={styles.rightSection}>
          
          <div className={styles.divider} />

          <p className={styles.techStack}>
            
            <span className={styles.techItem}>
              React_18
            </span>

            <span className={styles.techItem}>
              TypeScript_5
            </span>

            <span className={styles.techItem}>
              FastAPI
            </span>

            <span className={styles.techItem}>
              Leaflet_Map
            </span>
          </p>

          {/* DECORATION */}
          <div className={styles.decoration}>
            
            <div className={styles.dotGray} />

            <div className={styles.dotDark} />

            <div className={styles.dotPulse} />
          </div>
        </div>
      </div>
    </footer>
  );
}
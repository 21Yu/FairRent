import { footerStyles as styles } from "../../styles/footer.styles";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.copyright}>
        © 2026{" "}
        <span>
          FairRent
        </span>{" "}
        ALL RIGHTS RESERVED
      </p>
    </footer>
  );
}
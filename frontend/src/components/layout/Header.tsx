import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <div>
        <Link to="/">
          <h1>FairRent</h1>
        </Link>
      </div>

      <nav>
        <Link to="/">
          Home
        </Link>
      </nav>
    </header>
  );
}
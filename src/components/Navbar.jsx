import { NavLink } from "react-router";
import { HashLink } from "react-router-hash-link";

export default function Navbar() {
  return (
    <nav className="site-nav">
      <NavLink className="brand" to="/">
        mellemrum<span>.</span>
      </NavLink>
      <div className="nav-links">
        <HashLink to="/#events" aria-label="Se kommende events">
          Events
        </HashLink>
        <NavLink to="/om">Om Mellemrum</NavLink>
        <NavLink to="/tilmeldinger">Dine tilmeldinger</NavLink>
      </div>
    </nav>
  );
}

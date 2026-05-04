import "./page.css";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import Login from "./Login";
function Navbar() {
  const { user } = useContext(UserContext);
  return (
    <div className="navbar-section">
      {user ? <Link to="/logout">Logout</Link> : <Link to="/login">Login</Link>}
    </div>
  );
}

export default Navbar;

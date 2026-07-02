import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import "./Header.css";
import logo from "../../assets/Logo.svg";
import defaultAvatar from "../../assets/avatar.png";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import { Link } from "react-router-dom";

function Header({
  handleAddClick,
  weatherData,
  onLoginClick,
  onRegisterClick,
  isLoggedIn,
  userName,
}) {
  const currentUser = useContext(CurrentUserContext);
  const currentDate = new Date().toLocaleString("default", {
    month: "long",
    day: "numeric",
  });
  const userAvatar = currentUser?.avatar || defaultAvatar;
  const displayName = currentUser?.name || "User";

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/">
          <img className="header__logo" src={logo} alt="logo" />
        </Link>
        <p className="header__date-and-location">
          {currentDate}, {weatherData.city}
        </p>
      </div>

      <div className="header__user-container">
        <ToggleSwitch />

        {isLoggedIn && (
          <button
            onClick={handleAddClick}
            type="button"
            className="header__add-clothes-btn"
          >
            + Add Clothes
          </button>
        )}

        {isLoggedIn ? (
          <Link to="/profile" className="header__link">
            <p className="header__username">{displayName}</p>
            <img
              className="header__avatar"
              src={userAvatar}
              alt={`${displayName}'s avatar`}
            />
          </Link>
        ) : (
          <>
            <button
              onClick={onRegisterClick}
              type="button"
              className="header__auth-btn"
            >
              Sign Up
            </button>
            <button
              onClick={onLoginClick}
              type="button"
              className="header__auth-btn header__auth-btn_primary"
            >
              Log In
            </button>
          </>
        )}
      </div>
    </header>
  );
}
export default Header;

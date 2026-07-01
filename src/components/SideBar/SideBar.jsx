// SideBar.jsx
import "./SideBar.css";
import avatar from "../../assets/avatar.png";

function SideBar({ userName, currentUser, onLogout, onEditProfile }) {
  const userAvatar = currentUser?.avatar || avatar;
  const displayName = userName || "User";

  const handleLogoutClick = () => {
    console.log("Logout button clicked!");
    if (typeof onLogout === "function") {
      onLogout();
    } else {
      console.error("onLogout is not a function!");
      localStorage.removeItem("jwt");
      localStorage.removeItem("userData");
      window.location.href = "/";
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar__user-info">
        <img
          className="sidebar__avatar"
          src={userAvatar}
          alt={`${displayName}'s avatar`}
        />
        <p className="sidebar__username">{displayName}</p>
      </div>
      <div className="sidebar__buttons">
        <button
          className="sidebar__edit-btn"
          onClick={onEditProfile}
          type="button"
        >
          Change profile data
        </button>

        <button
          className="sidebar__logout-btn"
          onClick={handleLogoutClick}
          type="button"
        >
          Log out
        </button>
      </div>
    </div>
  );
}

export default SideBar;

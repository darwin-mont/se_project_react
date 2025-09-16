import "./SideBar.css";
import avatar from "../../assets/avatar.png";

function SideBar() {
  return (
    <div className="sidebar">
      <img className="sidebar__avatar" src={avatar} alt="default Avatar" />
      <p className="sidebar__username"> user name</p>
    </div>
  );
}

export default SideBar;

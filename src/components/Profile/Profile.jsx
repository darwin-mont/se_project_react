import { useContext } from "react";
import { Navigate } from "react-router-dom";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import SideBar from "../SideBar/SideBar";
import ClothesSection from "../ClothesSection/ClothesSection";
import "./Profile.css";

function Profile({
  onCardClick,
  handleAddClick,
  clothingItems = [],
  isLoggedIn,
  userName,
  onLogout,
  onEditProfile,
  onCardLike,
}) {
  const currentUser = useContext(CurrentUserContext);

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="profile">
      <section className="profile__sidebar">
        <SideBar
          userName={userName}
          currentUser={currentUser}
          onLogout={onLogout}
          onEditProfile={onEditProfile}
        />
      </section>
      <section className="profile__clothing-items">
        <ClothesSection
          onCardClick={onCardClick}
          handleAddClick={handleAddClick}
          clothingItems={clothingItems}
          onCardLike={onCardLike}
        />
      </section>
    </div>
  );
}

export default Profile;

import "./ItemCard.css";
import likeIcon from "../../assets/like-icon.svg";
import likedIcon from "../../assets/liked-icon.svg";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function ItemCard({ item, onCardClick, onCardLike, isLiked }) {
  const currentUser = useContext(CurrentUserContext);
  const isLoggedIn = !!currentUser;

  const handleCardClick = () => {
    onCardClick(item);
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      return;
    }
    onCardLike({ id: item._id, isLiked });
  };
  const imageUrl = item.imageUrl || item.link || "";

  return (
    <li className="card" onClick={handleCardClick}>
      <div className="card__header">
        <h2 className="card__name">{item.name}</h2>
        {isLoggedIn && (
          <button
            className={`card__like-btn ${isLiked ? "card__like-btn--liked" : ""}`}
            onClick={handleLikeClick}
            aria-label={isLiked ? "Unlike item" : "Like item"}
            type="button"
          >
            <img
              src={isLiked ? likedIcon : likeIcon}
              alt={isLiked ? "Liked" : "Not liked"}
              className="card__like-icon"
            />
          </button>
        )}
      </div>
      <img className="card__image" src={imageUrl} alt={item.name} />
    </li>
  );
}

export default ItemCard;

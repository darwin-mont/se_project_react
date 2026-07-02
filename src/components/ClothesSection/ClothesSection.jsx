import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import ItemCard from "../ItemCard/ItemCard";
import { defaultClothingItems } from "../../utils/constants";
import "./ClothesSection.css";

function ClothesSection({
  onCardClick,
  handleAddClick,
  clothingItems,
  onCardLike,
}) {
  const currentUser = useContext(CurrentUserContext);
  const items = Array.isArray(clothingItems)
    ? clothingItems
    : defaultClothingItems;

  const ownItems = items.filter((item) => item.owner === currentUser?._id);

  return (
    <div className="clothes-section">
      <div className="clothes-section__header">
        <p className="clothes-section__title">Your Items</p>
        <button
          onClick={handleAddClick}
          type="button"
          className="clothes-section__add-btn"
        >
          + Add New
        </button>
      </div>

      <ul className="clothes-section__list">
        {ownItems.length === 0 ? (
          <p className="clothes-section__empty">
            No clothes added yet. Add your first item!
          </p>
        ) : (
          ownItems.map((item) => {
            const isLiked =
              currentUser &&
              item.likes &&
              Array.isArray(item.likes) &&
              item.likes.includes(currentUser._id);

            return (
              <ItemCard
                key={item._id || item.id}
                item={item}
                onCardClick={onCardClick}
                onCardLike={onCardLike}
                isLiked={isLiked}
              />
            );
          })
        )}
      </ul>
    </div>
  );
}

export default ClothesSection;

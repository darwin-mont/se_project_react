import "./ClothesSection.css";
import ItemCard from "../ItemCard/ItemCard";
import { defaultClothingItems } from "../../utils/constants";
import AddItemModal from "../AddItemModal/AddItemModal";
import { getItems } from "../../utils/api";
import { useEffect, useState } from "react";

function ClothesSection({
  onCardClick,
  handleAddClick,
  clothingItems,
  onCardLike,
  currentUser,
}) {
  const items = Array.isArray(clothingItems)
    ? clothingItems
    : defaultClothingItems;

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
        {items.length === 0 ? (
          <p className="clothes-section__empty">
            No clothes added yet. Add your first item!
          </p>
        ) : (
          items.map((item) => {
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

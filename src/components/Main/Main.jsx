import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";
import { defaultClothingItems } from "../../utils/constants";
import "./Main.css";
import WeatherCard from "../WeatherCard/WeatherCard";
import ItemCard from "../ItemCard/ItemCard";

function Main({ weatherData, handleCardClick, clothingItems, onCardLike }) {
  const currentUser = useContext(CurrentUserContext);
  const { currentTemperatureUnit } = useContext(CurrentTemperatureUnitContext);

  const items = Array.isArray(clothingItems) ? clothingItems : [];

  let displayItems = [];
  if (currentUser) {
    displayItems = items.filter((item) => item.owner === currentUser._id);
  } else {
    displayItems = defaultClothingItems;
  }
  displayItems = displayItems.map((item) => ({
    ...item,
    imageUrl: item.imageUrl || item.link || "",
  }));

  const filteredItems = displayItems.filter(
    (item) => item.weather === weatherData.type,
  );

  return (
    <main className="main__page">
      <WeatherCard weatherData={weatherData} />
      <section className="cards">
        <p className="cards__text">
          Today is{" "}
          {currentTemperatureUnit === "F"
            ? weatherData.temp.F
            : weatherData.temp.C}
          &deg;{currentTemperatureUnit} you may want to wear:
        </p>
        <ul className="cards__list">
          {filteredItems.length === 0 ? (
            <p>No clothing items available for this weather.</p>
          ) : (
            filteredItems.map((item) => {
              const isLiked =
                currentUser &&
                item.likes &&
                Array.isArray(item.likes) &&
                item.likes.includes(currentUser._id);
              return (
                <ItemCard
                  key={
                    item._id || item.id || `item-${item.name}-${Math.random()}`
                  }
                  item={item}
                  onCardClick={handleCardClick}
                  onCardLike={onCardLike}
                  isLiked={isLiked}
                />
              );
            })
          )}
        </ul>
      </section>
    </main>
  );
}
export default Main;

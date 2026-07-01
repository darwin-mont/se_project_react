import "./Main.css";
import WeatherCard from "../WeatherCard/WeatherCard";
import ItemCard from "../ItemCard/ItemCard";
import { useContext } from "react";
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";

function Main({
  weatherData,
  handleCardClick,
  clothingItems,
  onCardLike,
  currentUser,
}) {
  const { currentTemperatureUnit } = useContext(CurrentTemperatureUnitContext);

  const items = Array.isArray(clothingItems) ? clothingItems : [];
  const filteredItems = items.filter(
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
                  key={item._id || item.id}
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

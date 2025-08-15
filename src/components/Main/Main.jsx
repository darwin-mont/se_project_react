import "./Main.css";
import WeatherCard from "../WeatherCard/WeatherCard";
import ItemCard from "../ItemCard/ItemCard";

function Main({ weatherData, handleCardClick, clothingItems }) {
  const filteredItems = clothingItems.filter(
    (item) => item.weather === weatherData.type
  );

  return (
    <main className="main__page">
      <WeatherCard weatherData={weatherData} />
      <section className="cards">
        <p className="cards__text">
          Today is {weatherData.temp.F}&deg;F you may want to wear:
        </p>
        <ul className="cards__list">
          {filteredItems.length === 0 ? (
            <p>No clothing items available for this weather.</p>
          ) : (
            filteredItems.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                onCardClick={handleCardClick}
              />
            ))
          )}
        </ul>
      </section>
    </main>
  );
}
export default Main;

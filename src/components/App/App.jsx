import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { coordinates, APIkey } from "../../utils/constants";
import Header from "../Header/Header";
import Main from "../Main/Main";
import Footer from "../Footer/Footer";
import AddItemModal from "../AddItemModal/AddItemModal";
import ItemModal from "../ItemModal/ItemModal";
import ItemCard from "../ItemCard/ItemCard";
import Profile from "../../components/Profile/Profile";
import { getWeather, filterWeatherData } from "../../utils/weatherApi";
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";
import { getItems, addItem, deleteItem } from "../../utils/api";

function App() {
  // State to hold clothing items and weather data
  const [clothingItems, setClothingItems] = useState([]);

  const [weatherData, setWeatherData] = useState({
    type: "",
    temp: { F: 99, C: 99 },
    city: "",
    condition: "",
    isDay: false,
  });
  const [activeModal, setActiveModal] = useState("");
  const [selectedCard, setSelectedCard] = useState({});
  const [currentTemperatureUnit, setCurrentTemperatureUnit] = useState("F");
  const [geoError, setGeoError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const handleToggleSwitchChange = () => {
    setCurrentTemperatureUnit(currentTemperatureUnit === "F" ? "C" : "F");
  };

  const handleCardClick = (card) => {
    setActiveModal("preview");
    setSelectedCard(card);
  };

  const handleAddClick = () => {
    setActiveModal("add-garment");
  };

  const onAddItem = (inputValues) => {
    const newCardData = {
      name: inputValues.name,
      imageUrl: inputValues.link,
      weather: inputValues.weatherType,
    };
    // Call API to add item, then update local state
    addItem(newCardData)
      .then((addedItem) => {
        setClothingItems([...clothingItems, addedItem]);
        closeActiveModal();
      })
      .catch((err) => {
        console.error("Failed to add item:", err);
      });

    // Optimistic update (commented out since we're now waiting for API response)
    // setClothingItems([...clothingItems, newCardData]);
    // closeActiveModal();
  };

  const closeActiveModal = () => {
    setActiveModal("");
  };

  // Delete handler: confirms and deletes a card. If the card has an _id, call API; always remove from local state.
  const handleDeleteCard = (card) => {
    if (!card) return;
    // If card has an _id, attempt to delete from backend
    if (card._id !== undefined && card._id !== null) {
      deleteItem(card._id)
        .then(() => {
          setClothingItems((prev) => prev.filter((c) => c._id !== card._id));
        })
        .catch((err) => {
          console.error("Failed to delete item:", err);
        });
    } else {
      // Local-only card (not persisted) — remove by matching unique combination
      setClothingItems((prev) =>
        prev.filter(
          (c) =>
            !(
              c.name === card.name &&
              (c.imageUrl || c.link) === (card.imageUrl || card.link)
            )
        )
      );
    }
  };

  useEffect(() => {
    // Simplified, easier-to-read geolocation logic using async/await.
    let didCancel = false;

    const fetchForCoords = async (coords) => {
      try {
        const data = await getWeather(coords, APIkey);
        if (didCancel) return;
        const filteredData = filterWeatherData(data);
        setWeatherData(filteredData);
        setGeoError(null);
        setUsingFallback(false);
      } catch (error) {
        if (didCancel) return;
        console.error("Failed to fetch weather data:", error);
        setGeoError("Weather fetch failed");
        setUsingFallback(true);
      }
    };

    const getPosition = (opts = {}) =>
      new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, opts)
      );

    const run = async () => {
      try {
        if (navigator && navigator.geolocation) {
          // If Permissions API is present, check first to avoid unnecessary prompt
          let permState = "prompt";
          if (navigator.permissions && navigator.permissions.query) {
            try {
              const status = await navigator.permissions.query({
                name: "geolocation",
              });
              permState = status && status.state ? status.state : "prompt";
            } catch (e) {
              permState = "prompt";
            }
          }

          if (permState === "denied") {
            setGeoError("permission denied");
            setUsingFallback(true);
            await fetchForCoords(coordinates);
            return;
          }

          // Attempt to get position with a reasonable timeout, retry once on timeout
          try {
            const pos = await getPosition({
              enableHighAccuracy: false,
              timeout: 10000,
            });
            const userCoords = {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            };
            await fetchForCoords(userCoords);
          } catch (err) {
            if (err && err.code === 3) {
              // timeout -> one retry
              try {
                const pos = await getPosition({
                  enableHighAccuracy: false,
                  timeout: 15000,
                });
                const userCoords = {
                  latitude: pos.coords.latitude,
                  longitude: pos.coords.longitude,
                };
                await fetchForCoords(userCoords);
              } catch (e) {
                console.warn("Geolocation retry failed:", e && e.message);
                setGeoError(e && e.message ? e.message : "Geolocation failed");
                setUsingFallback(true);
                await fetchForCoords(coordinates);
              }
            } else {
              console.warn("Geolocation error:", err && err.message);
              setGeoError(
                err && err.message ? err.message : "Geolocation failed"
              );
              setUsingFallback(true);
              await fetchForCoords(coordinates);
            }
          }
        } else {
          // No geolocation support
          await fetchForCoords(coordinates);
        }
      } catch (e) {
        console.error("Unexpected error in geolocation flow:", e);
        setGeoError("Geolocation failed");
        setUsingFallback(true);
        await fetchForCoords(coordinates);
      }
    };

    run();

    return () => {
      didCancel = true;
    };
  }, []);

  // Allow manual retry when geolocation previously failed
  function handleRetryGeolocation() {
    setGeoError(null);
    setUsingFallback(false);
    // Re-run the same effect logic by calling getCurrentPosition directly
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          getWeather(userCoords, APIkey)
            .then((data) => setWeatherData(filterWeatherData(data)))
            .catch((e) => {
              console.error(e);
              setGeoError("Weather fetch failed on retry");
              setUsingFallback(true);
            });
        },
        (err) => {
          console.warn("Retry geolocation failed:", err && err.message);
          setGeoError(err && err.message ? err.message : "Retry failed");
          setUsingFallback(true);
        },
        { enableHighAccuracy: false, timeout: 15000 }
      );
    } else {
      setGeoError("Geolocation not supported");
      setUsingFallback(true);
    }
  }

  useEffect(() => {
    getItems()
      .then((data) => {
        // console.log(data);
        setClothingItems(data);
      })
      .catch((error) => {
        console.error("Failed to fetch clothing items:", error);
      });
  }, []);

  return (
    <CurrentTemperatureUnitContext.Provider
      value={{ currentTemperatureUnit, handleToggleSwitchChange }}
    >
      <div className="page">
        <div className="page__content">
          <Header handleAddClick={handleAddClick} weatherData={weatherData} />
          {geoError && (
            <div className="geo-banner">
              <p>
                Could not get your location ({geoError}). Showing default
                location instead.
              </p>
              <button className="geo-retry" onClick={handleRetryGeolocation}>
                Retry location
              </button>
            </div>
          )}
          <Routes>
            <Route
              path="/"
              element={
                <Main
                  weatherData={weatherData}
                  handleCardClick={handleCardClick}
                  clothingItems={clothingItems}
                />
              }
            />
            <Route
              path="/profile"
              element={
                <Profile
                  onCardClick={handleCardClick}
                  handleAddClick={handleAddClick}
                  clothingItems={clothingItems}
                />
              }
            />
            {/* Fallback route: render Main for unmatched paths to avoid console warnings when
                the app is served from a subpath that the router doesn't expect. */}
            <Route
              path="*"
              element={
                <Main
                  weatherData={weatherData}
                  handleCardClick={handleCardClick}
                  clothingItems={clothingItems}
                />
              }
            />
          </Routes>

          <Footer />
        </div>

        <AddItemModal
          isOpen={activeModal === "add-garment"}
          onClose={closeActiveModal}
          onAddItem={onAddItem}
        />
        <ItemModal
          activeModal={activeModal}
          card={selectedCard}
          onClose={closeActiveModal}
          onDeleteCard={handleDeleteCard}
        />
      </div>
    </CurrentTemperatureUnitContext.Provider>
  );
}

export default App;

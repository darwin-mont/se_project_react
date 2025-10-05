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
import { getItems } from "../../utils/api";

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
      link: inputValues.link,
      weather: inputValues.weatherType,
    };
    setClothingItems([...clothingItems, newCardData]);
    closeActiveModal();
  };

  const closeActiveModal = () => {
    setActiveModal("");
  };

  useEffect(() => {
    // Try to get the user's location via the browser geolocation API.
    // If successful, fetch weather for the user's coords. If not, fall back to default coordinates.
    let didCancel = false;

    function fetchForCoords(coords) {
      getWeather(coords, APIkey)
        .then((data) => {
          if (didCancel) return;
          const filteredData = filterWeatherData(data);
          setWeatherData(filteredData);
          // successful fetch for real coords resets geolocation error state
          setGeoError(null);
          setUsingFallback(false);
        })
        .catch((error) => {
          if (didCancel) return;
          console.error("Failed to fetch weather data:", error);
          setGeoError("Weather fetch failed");
          setUsingFallback(true);
        });
    }

    if (navigator && navigator.geolocation) {
      const tryGetPosition = (opts) =>
        new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, opts)
        );

      const opts = { enableHighAccuracy: false, timeout: 10000 };

      // If Permissions API is available, check the state first to avoid unnecessary prompt
      const handleFallback = (reason) => {
        const msg = reason && (reason.message || reason);
        console.warn(
          "Geolocation failed or was denied, using fallback coordinates:",
          msg
        );
        setGeoError(msg || "Geolocation failed or denied");
        setUsingFallback(true);
        fetchForCoords(coordinates);
      };

      if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions
          .query({ name: "geolocation" })
          .then((status) => {
            if (status.state === "denied") {
              // user already denied — don't trigger prompt
              handleFallback("permission denied");
              return;
            }

            // state is 'granted' or 'prompt' — try to get position
            tryGetPosition(opts)
              .then((position) => {
                const userCoords = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                };
                fetchForCoords(userCoords);
              })
              .catch((err) => {
                // If timed out or other error, try once more with a longer timeout
                if (err && err.code === 3) {
                  // timeout code
                  tryGetPosition({ ...opts, timeout: 15000 })
                    .then((position) => {
                      const userCoords = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                      };
                      fetchForCoords(userCoords);
                    })
                    .catch(handleFallback);
                } else {
                  handleFallback(err);
                }
              });
          })
          .catch(() => {
            // If Permissions API fails, fall back to attempting geolocation directly
            tryGetPosition(opts)
              .then((position) => {
                const userCoords = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                };
                fetchForCoords(userCoords);
              })
              .catch((err) => {
                // final fallback
                handleFallback(err);
              });
          });
      } else {
        // No Permissions API — just attempt geolocation and fallback on error
        tryGetPosition(opts)
          .then((position) => {
            const userCoords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            fetchForCoords(userCoords);
          })
          .catch((err) => {
            // If timed out, one retry with longer timeout
            if (err && err.code === 3) {
              tryGetPosition({ ...opts, timeout: 15000 })
                .then((position) => {
                  const userCoords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                  };
                  fetchForCoords(userCoords);
                })
                .catch((e) => fetchForCoords(coordinates));
            } else {
              fetchForCoords(coordinates);
            }
          });
      }
    } else {
      // No geolocation support — use fallback coordinates
      fetchForCoords(coordinates);
    }

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
      .catch(console.error);
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
        />
      </div>
    </CurrentTemperatureUnitContext.Provider>
  );
}

export default App;

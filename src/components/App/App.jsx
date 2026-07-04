import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import { coordinates, APIkey } from "../../utils/constants";
import Header from "../Header/Header";
import Main from "../Main/Main";
import Footer from "../Footer/Footer";
import AddItemModal from "../AddItemModal/AddItemModal";
import Profile from "../../components/Profile/Profile";
import LoginModal from "../../components/LoginModal/LoginModal";
import RegisterModal from "../../components/RegisterModal/RegisterModal";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import { getWeather, filterWeatherData } from "../../utils/weatherApi";
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import {
  getItems,
  addItem,
  deleteItem,
  loginUser,
  registerUser,
  getCurrentUser,
  addCardLike,
  removeCardLike,
} from "../../utils/api";
import ItemModal from "../ItemModal/ItemModal";
import EditProfileModal from "../EditProfileModal/EditProfileModal";
import { updateProfile } from "../../utils/api";

function App() {
  const navigate = useNavigate();
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
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  ///-------///

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("jwt");
  });

  const [userName, setUserName] = useState(() => {
    const savedUser = localStorage.getItem("userData");
    if (savedUser) {
      try {
        return JSON.parse(savedUser).name || "";
      } catch {
        return "";
      }
    }
    return "";
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("userData");
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  //---------//
  const handleToggleSwitchChange = () => {
    setCurrentTemperatureUnit(currentTemperatureUnit === "F" ? "C" : "F");
  };

  const handleCardClick = (card) => {
    setActiveModal("preview");
    setSelectedCard(card);
  };

  const handleAddClick = () => {
    if (!isLoggedIn) {
      alert("Please log in to add clothes.");
      setActiveModal("login");
      return;
    }
    setActiveModal("add-garment");
  };

  // LIKE handler

  const handleCardLike = ({ id, isLiked }) => {
    const token = localStorage.getItem("jwt");

    if (!currentUser) {
      console.error("No user logged in");
      return;
    }

    if (!isLiked) {
      addCardLike(id, token)
        .then((updatedCard) => {
          if (updatedCard && updatedCard._id) {
            setClothingItems((cards) =>
              cards.map((item) => (item._id === id ? updatedCard : item)),
            );
          } else {
            setClothingItems((cards) =>
              cards.map((item) => {
                if (item._id === id) {
                  const currentLikes = item.likes || [];
                  if (!currentLikes.includes(currentUser._id)) {
                    return {
                      ...item,
                      likes: [...currentLikes, currentUser._id],
                    };
                  }
                  return item;
                }
                return item;
              }),
            );
          }
        })
        .catch((err) => console.log("Error liking item", err));
    } else {
      // Remove like
      removeCardLike(id, token)
        .then((updatedCard) => {
          if (updatedCard && updatedCard._id) {
            setClothingItems((cards) =>
              cards.map((item) => (item._id === id ? updatedCard : item)),
            );
          } else {
            // Fallback: manually remove like
            setClothingItems((cards) =>
              cards.map((item) => {
                if (item._id === id) {
                  return {
                    ...item,
                    likes: (item.likes || []).filter(
                      (userId) => userId !== currentUser._id,
                    ),
                  };
                }
                return item;
              }),
            );
          }
        })
        .catch((err) => console.log("Error removing like", err));
    }
  };
  // Auth handlers
  const handleLoginClick = () => {
    setActiveModal("login");
  };

  const handleRegisterClick = () => {
    setActiveModal("register");
  };

  const closeActiveModal = () => {
    setActiveModal("");
  };

  const handleLogin = async ({ email, password }) => {
    try {
      const userData = await loginUser({ email, password });
      // userData now contains {_id, email, name, avatar}
      setIsLoggedIn(true);
      setUserName(userData.name || "User");
      setCurrentUser(userData);
      setActiveModal("");
      localStorage.setItem("userData", JSON.stringify(userData));
      navigate("/profile");
    } catch (error) {
      console.error("Login failed:", error);
      alert(error.message || "Login failed. Please check your credentials. ");
    }
  };

  const handleRegister = async ({ name, email, avatarURL, password }) => {
    try {
      // Register the user
      const userData = await registerUser({ name, email, avatarURL, password });
      console.log("Registration successful:", userData);

      //
      let token = localStorage.getItem("jwt");
      let finalUserData = userData;
      if (!token) {
        console.log(
          "No token found after registration, attempting auto-login...",
        );
        const loginData = await loginUser({ email, password });
        token = localStorage.getItem("jwt");
        finalUserData = loginData;
        console.log("Auto-login successful:", loginData);
      }

      // Set state and store data
      setIsLoggedIn(true);
      setUserName(finalUserData.name || finalUserData.data?.name || "User");
      setCurrentUser(finalUserData);
      localStorage.setItem("userData", JSON.stringify(finalUserData));
      // Token stored in localStorage by loginUser

      closeActiveModal();
      navigate("/profile");
    } catch (error) {
      console.error("Registration failed:", error);
      alert(error.message || "Registration failed. Please try again.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName("");
    setCurrentUser(null);
    localStorage.removeItem("jwt");
    localStorage.removeItem("userData");
    closeActiveModal();
    navigate("/");
  };

  const handleSwitchToRegister = () => {
    setActiveModal("register");
  };

  const handleSwitchToLogin = () => {
    setActiveModal("login");
  };

  const handleEditProfile = () => {
    setIsEditProfileModalOpen(true);
  };

  const onAddItem = (inputValues) => {
    const newCardData = {
      name: inputValues.name,
      imageUrl: inputValues.link,
      weather: inputValues.weatherType,
    };

    addItem(newCardData)
      .then((response) => {
        let addedItem = response;

        if (response && response.data) {
          addedItem = response.data;
        }
        setClothingItems((prevItems) => {
          const updatedItems = [...prevItems, addedItem];
          return updatedItems;
        });

        closeActiveModal();
      })
      .catch((err) => {
        console.error("Failed to add item:", err);
        alert("Failed to add item. Please try again.");
      });
  };

  const handleDeleteCard = (card) => {
    if (!card) return;

    if (card._id !== undefined && card._id !== null) {
      deleteItem(card._id)
        .then(() => {
          setClothingItems((prev) => prev.filter((c) => c._id !== card._id));
          closeActiveModal();
        })
        .catch((err) => {
          console.error("Failed to delete item:", err);
        });
    } else {
      setClothingItems((prev) =>
        prev.filter(
          (c) =>
            !(
              c.name === card.name &&
              (c.imageUrl || c.link) === (card.imageUrl || card.link)
            ),
        ),
      );
      closeActiveModal();
    }
  };

  //-----//

  // ====== Escape key listener ======
  useEffect(() => {
    if (!activeModal && !isEditProfileModalOpen) return;

    const handleEscClose = (e) => {
      if (e.key === "Escape") {
        if (activeModal) {
          closeActiveModal();
        }

        if (isEditProfileModalOpen) {
          setIsEditProfileModalOpen(false);
        }
      }
    };

    document.addEventListener("keydown", handleEscClose);

    return () => {
      document.removeEventListener("keydown", handleEscClose);
    };
  }, [activeModal, isEditProfileModalOpen]);

  useEffect(() => {
    if (!activeModal && !isEditProfileModalOpen) return;

    const handleClickOutside = (e) => {
      const modalElement = document.querySelector(".modal_opened");
      if (modalElement && e.target === modalElement) {
        if (activeModal) {
          closeActiveModal();
        }
        if (isEditProfileModalOpen) {
          setIsEditProfileModalOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeModal, isEditProfileModalOpen]);

  // === TOKEN check on MOUNT ===//
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("jwt");

      if (token) {
        try {
          // -- verification with backend
          const userData = await getCurrentUser();
          setIsLoggedIn(true);
          setUserName(userData.name || "User");
          setCurrentUser(userData);
          localStorage.setItem("userData", JSON.stringify(userData));
        } catch (error) {
          console.error("Backend verification failed:", error);
          localStorage.removeItem("jwt");
          localStorage.removeItem("userData");
          setIsLoggedIn(false);
          setUserName("");
          setCurrentUser(null);
        }
      }
    };

    checkToken();
  }, []);

  useEffect(() => {
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
        navigator.geolocation.getCurrentPosition(resolve, reject, opts),
      );

    const run = async () => {
      try {
        if (navigator && navigator.geolocation) {
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
                err && err.message ? err.message : "Geolocation failed",
              );
              setUsingFallback(true);
              await fetchForCoords(coordinates);
            }
          }
        } else {
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

  function handleRetryGeolocation() {
    setGeoError(null);
    setUsingFallback(false);

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
        { enableHighAccuracy: false, timeout: 15000 },
      );
    } else {
      setGeoError("Geolocation not supported");
      setUsingFallback(true);
    }
  }

  useEffect(() => {
    getItems()
      .then((data) => {
        setClothingItems(data);
      })
      .catch((error) => {
        console.error("Failed to fetch clothing items:", error);
      });
  }, []);

  const handleUpdateProfile = async ({ name, avatar }) => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        console.error("No token found");
        alert("Please login again to update your profile.");
        return;
      }

      if (!currentUser || !currentUser._id) {
        console.error("Current user data is missing _id");
        alert("User data is missing. Please login again.");
        return;
      }
      console.log("Update profile for user:", currentUser._id);
      console.log("New data:", { name, avatar });

      const updatedUser = await updateProfile({ name, avatar });
      console.log("Profile update response", updatedUser);

      const mergedUser = { ...currentUser, ...updatedUser };
      setUserName(mergedUser.name);
      setCurrentUser(mergedUser);

      localStorage.setItem("userData", JSON.stringify(mergedUser));

      setIsEditProfileModalOpen(false);
      console.log("Profile updated successfully:", mergedUser);
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert(error.message || "Failed to update profile. Please try again.");
    }
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <CurrentTemperatureUnitContext.Provider
        value={{ currentTemperatureUnit, handleToggleSwitchChange }}
      >
        <div className="page">
          <div className="page__content">
            <Header
              handleAddClick={handleAddClick}
              weatherData={weatherData}
              onLoginClick={handleLoginClick}
              onRegisterClick={handleRegisterClick}
              isLoggedIn={isLoggedIn}
            />
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
                    onCardLike={handleCardLike}
                  />
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <Profile
                      onCardClick={handleCardClick}
                      handleAddClick={handleAddClick}
                      clothingItems={clothingItems}
                      isLoggedIn={isLoggedIn}
                      userName={userName}
                      onLogout={handleLogout}
                      onEditProfile={handleEditProfile}
                      onCardLike={handleCardLike}
                    />
                  </ProtectedRoute>
                }
              />

              <Route
                path="*"
                element={
                  <Main
                    weatherData={weatherData}
                    handleCardClick={handleCardClick}
                    clothingItems={clothingItems}
                    onCardLike={handleCardLike}
                  />
                }
              />
            </Routes>
          </div>
          <Footer />

          {/* MOdals */}
          {isLoggedIn && (
            <AddItemModal
              isOpen={activeModal === "add-garment"}
              onClose={closeActiveModal}
              onAddItem={onAddItem}
            />
          )}
          <ItemModal
            activeModal={activeModal}
            card={selectedCard}
            onClose={closeActiveModal}
            onDeleteCard={handleDeleteCard}
          />
          <LoginModal
            isOpen={activeModal === "login"}
            onClose={closeActiveModal}
            onLogin={handleLogin}
            onSwitchToRegister={handleSwitchToRegister}
          />
          <RegisterModal
            isOpen={activeModal === "register"}
            onClose={closeActiveModal}
            onRegister={handleRegister}
            onSwitchToLogin={handleSwitchToLogin}
          />
          <EditProfileModal
            isOpen={isEditProfileModalOpen}
            onClose={() => setIsEditProfileModalOpen(false)}
            onEditProfile={handleUpdateProfile}
          />
        </div>
      </CurrentTemperatureUnitContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;

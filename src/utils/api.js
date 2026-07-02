const baseUrl = "http://localhost:3001";

function getToken() {
  return localStorage.getItem("jwt");
}

function getItems() {
  return fetch(`${baseUrl}/items`, {
    headers: {
      // No Authorization needed for GET /items (public)
    },
  })
    .then(checkResponse)
    .then((data) => {
      console.log("Get items response:", data);
      // The backend returns { items: [...] }
      return data.items || data || [];
    });
}

function addItem(item) {
  return fetch(`${baseUrl}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(item),
  })
    .then(checkResponse)
    .then((data) => {
      console.log("Add item response:", data);
      return data.data || data;
    });
}

function deleteItem(_id) {
  return fetch(`${baseUrl}/items/${_id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })
    .then(checkResponse)
    .then((data) => {
      console.log("Delete item response:", data);
      return data;
    });
}

function registerUser({ name, email, avatarURL, password }) {
  return fetch(`${baseUrl}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      avatar: avatarURL,
      password,
    }),
  })
    .then(checkResponse)
    .then((data) => {
      // Backend returns: { _id, email, name, avatar }
      console.log("Registration successful:", data);
      if (data.token) {
        localStorage.setItem("jwt", data.token);
      }
      return data;
    });
}

// LOGIN USER
function loginUser({ email, password }) {
  return fetch(`${baseUrl}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then(checkResponse)
    .then((data) => {
      // Your backend returns: { token, data: { _id, email, name, avatar } }
      console.log("Login successful:", data);

      // Store token in localStorage for future requests
      if (data.token) {
        localStorage.setItem("jwt", data.token);
      }

      // Return the user data from the nested 'data' object
      return data.data || data;
    });
}

// New Feature -- log in after refresh
function getCurrentUser() {
  return fetch(`${baseUrl}/users/me`, {
    headers: {
      Authorization: `Bearer ${getToken()}`, //--TOKEN
    },
  }).then(checkResponse);
}

function checkResponse(res) {
  if (res.status === 401) {
    localStorage.removeItem("jwt");
    localStorage.removeItem("userData");
    throw new Error("Session expired. Please login again.");
  }

  if (res.status === 403) {
    throw new Error("You don't have permission to perform this action.");
  }

  if (!res.ok) {
    return res.json().then((error) => {
      throw new Error(error.message || `Error: ${res.status}`);
    });
  }
  return res.json();
}

function updateProfile({ name, avatar }) {
  return fetch(`${baseUrl}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`, //---TOKEN
    },
    body: JSON.stringify({ name, avatar }),
  }).then(checkResponse);
}
function addCardLike(id, token) {
  return fetch(`${baseUrl}/items/${id}/likes`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  }).then(checkResponse);
}

function removeCardLike(id, token) {
  return fetch(`${baseUrl}/items/${id}/likes`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  })
    .then((res) => {
      if (res.status === 204) {
        return fetch(`${baseUrl}/items/${id}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }).then(checkResponse);
      }
      return checkResponse(res);
    })
    .catch((err) => {
      console.error("Error in removeCardLike:", err);
      throw err;
    });
}

export {
  getItems,
  addItem,
  deleteItem,
  checkResponse,
  registerUser,
  loginUser,
  getCurrentUser,
  updateProfile,
  addCardLike,
  removeCardLike,
};

const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://api.watawe.unibutton.com"
    : "http://localhost:3001";

function getToken() {
  return localStorage.getItem("jwt");
}

// ======== Reusable request function.  ======
function request(url, options = {}) {
  return fetch(url, options).then(checkResponse);
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

// ============ Public EndPoints ========= //

function getItems() {
  return request(`${baseUrl}/items`).then((data) => {
    console.log("Get items response:", data);
    // The backend returns { items: [...] }
    return data.items || data || [];
  });
}

function registerUser({ name, email, avatarURL, password }) {
  return request(`${baseUrl}/signup`, {
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
  }).then((data) => {
    console.log("Registration successful:", data);
    if (data.token) {
      localStorage.setItem("jwt", data.token);
    }
    return data;
  });
}

function loginUser({ email, password }) {
  return request(`${baseUrl}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  }).then((data) => {
    console.log("Login successful:", data);

    if (data.token) {
      localStorage.setItem("jwt", data.token);
    }

    return data.data || data;
  });
}

// ============ Protected EndPoints ========= //

function getCurrentUser() {
  return request(`${baseUrl}/users/me`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

function addItem(item) {
  return request(`${baseUrl}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(item),
  }).then((data) => {
    console.log("Add item response:", data);
    return data.data || data;
  });
}

function deleteItem(_id) {
  return request(`${baseUrl}/items/${_id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  }).then((data) => {
    console.log("Delete item response:", data);
    return data;
  });
}

function updateProfile({ name, avatar }) {
  return request(`${baseUrl}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ name, avatar }),
  });
}

function addCardLike(id, token) {
  return request(`${baseUrl}/items/${id}/likes`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
}

function removeCardLike(id, token) {
  return request(`${baseUrl}/items/${id}/likes`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  }).catch((err) => {
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

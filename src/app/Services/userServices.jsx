import toast from "react-hot-toast";

const API_URL = 'https://ecommerce-bracelet-tunisie-backend.onrender.com/api';

//
// Token management
const TOKEN_KEY = 'auth_token';

export const setAuthToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};



export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add auth token if available
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers,
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle token expiration
      if (response.status === 401 && data.message?.includes('Token expired')) {
        removeAuthToken();
        toast.error('Session expirée. Veuillez vous reconnecter.');
        window.location.href = '/connexion'; 
      }
      throw new Error(data.message || 'Une erreur est survenue.');
    }

    return data.data? data.data:data;
};

// ============ USER FUNCTIONS ============

export const getUsers = async () => {
  try {
    return await apiCall('/users');
  } catch (error) {
    toast.error("Impossible de récupérer les utilisateurs.");
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    return await apiCall(`/users/${userId}`);
  } catch (error) {
    toast.error("Impossible de récupérer l’utilisateur.");
    throw error;
  }
};

export const getUserByEmail = async (email) => {
  try {
    const users = await getUsers();
    return users.find(user => user.email === email) || null;
  } catch (error) {
    toast.error("Impossible de récupérer l’utilisateur avec cette adresse e-mail.");
    throw error;
  }
};

export const addUser = async (userData) => {
  try {
    const result = await apiCall('/users', {
      method: 'POST',
      body: JSON.stringify({
        full_name: userData.full_name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone || '',
        address: userData.address || '',
      }),
    });

    // Store token and user data
    if (result.token) {
      setAuthToken(result.token);
    }

    return result;
  } catch (error) {
    toast.error('Impossible de créer le compte.');
    throw error;
  }
};

export const updateUser = async (userId, updates) => {
  try {
    const updatedUser = await apiCall(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });

    // Update stored user data
    toast.success('Profil mis à jour avec succès !');
    return updatedUser;
  } catch (error) {
    toast.error('Impossible de mettre à jour le profil.');
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    await apiCall(`/users/${userId}`, {
      method: 'DELETE',
    });

    // Clear auth data
    removeAuthToken();
    toast.success('Compte supprimé avec succès.');
    return true;
  } catch (error) {
    toast.error('Impossible de supprimer le compte.');
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const result = await apiCall('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    // Store token and user data
    if (result.token) {
      setAuthToken(result.token);
    }

    return result;
  } catch (error) {
    toast.error('Adresse e-mail ou mot de passe invalide.');
    throw error;
  }
};

export const logoutUser = () => {
  removeAuthToken();
  toast.success('Vous êtes déconnecté.');
  window.location.href = '/connexion';
};

// ============ CART MANAGEMENT ============

export const getUserCart = async (userId) => {
  try {
    return await apiCall(`/cart/${userId}`);
  } catch (error) {
    toast.error("Impossible de récupérer le panier.");
    throw error;
  }
};

export const addToUserCart = async (userId, product, quantity) => {
  try {
    const cartItem = await apiCall(`/cart/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ product, quantity }),
    });

    return cartItem;
  } catch (error) {
    toast.error('Impossible d’ajouter l’article au panier.');
    throw error;
  }
};

export const updateUserCartItem = async (userId, productId, newQuantity) => {
  try {
    const cartItem = await apiCall(`/cart/${userId}/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity: newQuantity }),
    });

    return cartItem;
  } catch (error) {
    toast.error('Impossible de mettre à jour le panier.');
    throw error;
  }
};

export const removeFromUserCart = async (userId, productId) => {
  try {
    await apiCall(`/cart/${userId}/${productId}`, {
      method: 'DELETE',
    });

    toast.success('Article retiré du panier.');
    return true;
  } catch (error) {
    toast.error('Impossible de retirer l’article du panier.');
    throw error;
  }
};

export const clearUserCart = async (userId) => {
  try {
    await apiCall(`/cart/${userId}`, {
      method: 'DELETE',
    });

    toast.success('Panier vidé.');
    return true;
  } catch (error) {
    toast.error('Impossible de vider le panier.');
    throw error;
  }
};

// ============ FAVORITES MANAGEMENT ============

export const getUserFavorites = async (userId) => {
  try {
    return await apiCall(`/favorites/${userId}`);
  } catch (error) {
    toast.error("Impossible de récupérer les favoris.");
    throw error;
  }
};

export const addToFavorites = async (userId, product) => {
  try {
    const favorite = await apiCall(`/favorites/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ product }),
    });

    toast.success('Article ajouté aux favoris.');
    return favorite;
  } catch (error) {
    toast.error('Impossible d’ajouter l’article aux favoris.');
    throw error;
  }
};

export const removeFromFavorites = async (userId, productId) => {
  try {
    await apiCall(`/favorites/${userId}/${productId}`, {
      method: 'DELETE',
    });

    toast.success('Article retiré des favoris.');
    return true;
  } catch (error) {
    toast.error('Impossible de retirer l’article des favoris.');
    throw error;
  }
};

// ============ ORDER FUNCTIONS ============

export const getUserOrders = async (userId) => {
  try {
    return await apiCall(`/orders/${userId}`);
  } catch (error) {
    toast.error("Impossible de récupérer les commandes.");
    throw error;
  }
};

export const addOrderToUser = async (userId, order) => {
  try {
    const newOrder = await apiCall(`/orders/${userId}`, {
      method: 'POST',
      body: JSON.stringify(order),
    });

    toast.success('Commande enregistrée avec succès !');
    return newOrder;
  } catch (error) {
    toast.error('Impossible d’enregistrer la commande.');
    throw error;
  }
};

export const addCartOrdersToUser = async (userId, cartItems, itemsList = '') => {
  try {

    const orders = await apiCall(`/orders/${userId}/checkout`, {
      method: 'POST',
      body: JSON.stringify({ cartItems, itemsList }),
    });

    toast.success('Commandes enregistrées avec succès !');
    return orders;
  } catch (error) {
    toast.error('Impossible d’enregistrer les commandes du panier.');
    throw error;
  }
};

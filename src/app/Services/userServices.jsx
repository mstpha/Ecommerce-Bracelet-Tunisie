import toast from "react-hot-toast";

const API_URL = 'https://ecommerce-bracelet-tunisie-backend.onrender.com/api';

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
  try {
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
        toast.error('Session expired. Please login again.');
        window.location.href = '/login'; // Redirect to login
      }
      throw new Error(data.message || 'Something went wrong');
    }

    return data.data;
  } catch (error) {
    throw error;
  }
};

// ============ USER FUNCTIONS ============

export const getUsers = async () => {
  try {
    return await apiCall('/users');
  } catch (error) {
    toast.error("Error fetching users");
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    return await apiCall(`/users/${userId}`);
  } catch (error) {
    toast.error("Error fetching user");
    throw error;
  }
};

export const getUserByEmail = async (email) => {
  try {
    const users = await getUsers();
    return users.find(user => user.email === email) || null;
  } catch (error) {
    toast.error("Error fetching user by email");
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
    toast.error( 'Error adding user');
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
    toast.success('User updated successfully!');
    return updatedUser;
  } catch (error) {
    toast.error('Error updating user');
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
    toast.success('User deleted successfully!');
    return true;
  } catch (error) {
    toast.error( 'Error deleting user');
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
    toast.error('Invalid email or password');
    throw error;
  }
};

export const logoutUser = () => {
  removeAuthToken();
  toast.success('Logged out successfully!');
  window.location.href = '/login';
};

// ============ CART MANAGEMENT ============

export const getUserCart = async (userId) => {
  try {
    return await apiCall(`/cart/${userId}`);
  } catch (error) {
    toast.error("Error fetching cart");
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
    toast.error( 'Error adding to cart');
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
    toast.error( 'Error updating cart item');
    throw error;
  }
};

export const removeFromUserCart = async (userId, productId) => {
  try {
    await apiCall(`/cart/${userId}/${productId}`, {
      method: 'DELETE',
    });

    toast.success('Removed from cart!');
    return true;
  } catch (error) {
    toast.error( 'Error removing from cart');
    throw error;
  }
};

export const clearUserCart = async (userId) => {
  try {
    await apiCall(`/cart/${userId}`, {
      method: 'DELETE',
    });

    toast.success('Cart cleared!');
    return true;
  } catch (error) {
    toast.error( 'Error clearing cart');
    throw error;
  }
};

// ============ FAVORITES MANAGEMENT ============

export const getUserFavorites = async (userId) => {
  try {
    return await apiCall(`/favorites/${userId}`);
  } catch (error) {
    toast.error("Error fetching favorites");
    throw error;
  }
};

export const addToFavorites = async (userId, product) => {
  try {
    const favorite = await apiCall(`/favorites/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ product }),
    });

    toast.success('Added to favorites!');
    return favorite;
  } catch (error) {
    toast.error( 'Error adding to favorites');
    throw error;
  }
};

export const removeFromFavorites = async (userId, productId) => {
  try {
    await apiCall(`/favorites/${userId}/${productId}`, {
      method: 'DELETE',
    });

    toast.success('Removed from favorites');
    return true;
  } catch (error) {
    toast.error( 'Error removing from favorites');
    throw error;
  }
};

// ============ REVIEW FUNCTIONS ============

export const getReviews = async (productId) => {
  try {
    if (!productId) {
      toast.error('Product ID is required');
      return [];
    }
    return await apiCall(`/reviews/${productId}`);
  } catch (error) {
    toast.error("Error fetching reviews");
    throw error;
  }
};

export const addReview = async (productId, userName, reviewMessage) => {
  try {
    if (!productId || !userName || !reviewMessage) {
      toast.error('Product ID, user name, and review message are required');
      return null;
    }

    const review = await apiCall(`/reviews/${productId}`, {
      method: 'POST',
      body: JSON.stringify({ userName, reviewMessage }),
    });

    toast.success('Review added successfully!');
    return review;
  } catch (error) {
    toast.error( 'Error adding review');
    throw error;
  }
};

// ============ ORDER FUNCTIONS ============

export const getUserOrders = async (userId) => {
  try {
    return await apiCall(`/orders/${userId}`);
  } catch (error) {
    toast.error("Error fetching orders");
    return [];
  }
};

export const addOrderToUser = async (userId, order) => {
  try {
    const newOrder = await apiCall(`/orders/${userId}`, {
      method: 'POST',
      body: JSON.stringify(order),
    });

    toast.success('Order placed successfully!');
    return newOrder;
  } catch (error) {
    toast.error( 'Error adding order');
    throw error;
  }
};

export const addCartOrdersToUser = async (userId, cartItems, itemsList = '') => {
  try {
    const orders = await apiCall(`/orders/${userId}/checkout`, {
      method: 'POST',
      body: JSON.stringify({ cartItems, itemsList }),
    });

    toast.success('Orders placed successfully!');
    return orders;
  } catch (error) {
    toast.error( 'Error adding cart orders');
    throw error;
  }
};
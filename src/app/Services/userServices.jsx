const BIN_ID = import.meta.env.VITE_BIN_ID;
const API_KEY = import.meta.env.VITE_XACCESS_KEY;
const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;
const ACCESS_KEY = import.meta.env.VITE_XMASTER_KEY;
// Helper function to fetch all users
const fetchAllUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/latest`, {
      headers: {
        'X-Access-Key': API_KEY,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return Array.isArray(data.record) ? data.record : [];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Helper function to save users to bin
const saveUsers = async (users) => {
  try {
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': ACCESS_KEY
      },
      body: JSON.stringify(users)
    });
    
    if (!response.ok) {
      throw new Error('Failed to save users');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving users:', error);
    throw error;
  }
};

// Get all users
export const getUsers = async () => {
  return await fetchAllUsers();
};

// Get a single user by ID
export const getUserById = async (userId) => {
  const users = await fetchAllUsers();
  return users.find(user => user.id === userId);
};

// Get a user by email
export const getUserByEmail = async (email) => {
  const users = await fetchAllUsers();
  return users.find(user => user.email === email);
};

// Add a new user
export const addUser = async (userData) => {
  try {
    const users = await fetchAllUsers();
    
    // Check if email already exists
    const emailExists = users.some(user => user.email === userData.email);
    if (emailExists) {
      throw new Error('Email already exists');
    }
    
    // Generate new ID (find the highest ID and add 1)
    const maxId = users.length > 0 
      ? Math.max(...users.map(u => u.id)) 
      : 0;
    
    const newUser = {
      id: maxId + 1,
      fullName: userData.fullName,
      email: userData.email,
      password: userData.password,
      confirmPassword: userData.confirmPassword,
      phone: userData.phone || '',
      address: userData.address || '',
      orders: userData.orders || [],
      createdAt: new Date().toISOString()
    };
    const updatedUsers = [...users, newUser];
    await saveUsers(updatedUsers);
    
    return newUser;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

// Update an existing user
export const updateUser = async (userId, updates) => {
  try {
    const users = await fetchAllUsers();
    
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    // If updating email, check if new email already exists
    if (updates.email && updates.email !== users[userIndex].email) {
      const emailExists = users.some(user => user.email === updates.email);
      if (emailExists) {
        throw new Error('Email already exists');
      }
    }
    console.log(updates)
    const updatedUsers = users.map(user =>
      user.id === userId
        ? { 
            ...user, 
            ...updates, 
          }
        : user
    );
    
    await saveUsers(updatedUsers);
    return updatedUsers.find(user => user.id === userId);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Delete a user
export const deleteUser = async (userId) => {
  try {
    const users = await fetchAllUsers();
    const updatedUsers = users.filter(user => user.id !== userId);
    
    if (users.length === updatedUsers.length) {
      throw new Error('User not found');
    }
    
    await saveUsers(updatedUsers);
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Add multiple orders from cart items
export const addCartOrdersToUser = async (userId, cartItems, itemsList = '') => {
  try {
    const users = await fetchAllUsers();
    
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Create order items from cart
    const orderItems = cartItems.map(item => ({
      displayString: itemsList,
      productId: item.id,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
      name: item.name,
      timestamp: new Date().toISOString()
    }));

    // Update user's orders
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          orders: [...(user.orders || []), ...orderItems]
        };
      }
      return user;
    });
    
    await saveUsers(updatedUsers);
    return updatedUsers.find(user => user.id === userId);
  } catch (error) {
    console.error('Error adding cart orders:', error);
    throw error;
  }
};


// Add an order to a user
export const addOrderToUser = async (userId, order) => {
  try {
    const users = await fetchAllUsers();
    
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        const newOrder = {
          orderId: Date.now(),
          productId: order.productId,
          quantity: order.quantity,
          price: order.price,
          total: order.total,
          date: new Date().toISOString(),
          ...order
        };
        
        return {
          ...user,
          orders: [...(user.orders || []), newOrder]
        };
      }
      return user;
    });
    
    await saveUsers(updatedUsers);
    return updatedUsers.find(user => user.id === userId);
  } catch (error) {
    console.error('Error adding order:', error);
    throw error;
  }
};

// Get user orders
export const getUserOrders = async (userId) => {
  const user = await getUserById(userId);
  return user ? user.orders || [] : [];
};

// Update user password
export const updateUserPassword = async (userId, newPassword, confirmPassword) => {
  if (newPassword !== confirmPassword) {
    throw new Error('Passwords do not match');
  }
  
  return await updateUser(userId, {
    password: newPassword,
    confirmPassword: confirmPassword
  });
};

// Login user (check credentials)
export const loginUser = async (email, password) => {
  try {
    const users = await fetchAllUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Don't return password in response
    const { password: _, confirmPassword: __, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};
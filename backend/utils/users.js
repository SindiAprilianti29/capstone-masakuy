const fs = require("fs");
const path = require("path");

const usersPath = path.join(__dirname, "../data/users.json");

// Load semua user
function loadUsers() {
  if (!fs.existsSync(usersPath)) return [];
  const raw = fs.readFileSync(usersPath, "utf-8");
  return JSON.parse(raw);
}

// Simpan semua user
function saveUsers(users) {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), "utf-8");
}

// Tambah user baru
function addUser({ name, email, password }) {
  const users = loadUsers();
  if (users.find((u) => u.email === email)) {
    return { error: "Email sudah terdaftar" };
  }

  const user = {
    id: Date.now().toString(),
    name,
    email,
    password,
    isPremium: false,
    promptHistory: [],
  };

  users.push(user);
  saveUsers(users);
  return { user };
}

// Login
function authenticateUser(email, password) {
  const users = loadUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return { error: "Email atau password salah" };
  }
  return { user };
}

// Cari user by ID
function findUserById(id) {
  const users = loadUsers();
  return users.find((u) => u.id === id);
}

// Update user
function updateUser(updatedUser) {
  const users = loadUsers();
  const index = users.findIndex((u) => u.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    saveUsers(users);
    return true;
  }
  return false;
}

module.exports = {
  loadUsers,
  saveUsers,
  addUser,
  authenticateUser,
  findUserById,
  updateUser,
};

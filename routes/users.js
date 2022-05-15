const express = require('express');

const userRoutes = express.Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

userRoutes.get('/', getUsers);
userRoutes.get('/:userId', getUserById);
userRoutes.post('/', createUser);
userRoutes.patch('/me', updateUser);
userRoutes.patch('/me/avatar', updateUserAvatar);

module.exports = {
  userRoutes,
};

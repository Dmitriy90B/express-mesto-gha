/* eslint-disable no-constant-condition */
/* eslint-disable no-cond-assign */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const NotFoundError = require('../errors/NotFoundError');

const createUser = async (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  if (!email || !password) {
    next(new BadRequestError('Неверный логин или пароль'));
    return;
  }
  try {
    const hash = await bcrypt.hash(password, 8);
    const userCreate = new User({
      email,
      password: hash,
      name,
      about,
      avatar,
    });
    const savedUser = await userCreate.save();
    const { password: removedPassword, ...result } = savedUser.toObject();
    res.status(201).send(result);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Ошибка валидации'));
      return;
    }
    if ((err.code = 11000)) {
      next(new ConflictError('Пользователь уже существует'));
      return;
    }
    next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    next(new UnauthorizedError('Неверный логин или пароль'));
    return;
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    next(new UnauthorizedError('Неверный логин или пароль'));
    return;
  }
  try {
    res.status(200).send({
      token: jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' }),
    });
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  try {
    res.status(200).send({ data: user });
  } catch (err) {
    if (!user) {
      next(new NotFoundError('Такого пользователя не существует'));
      return;
    }
    if (err.name === 'CastError') {
      next(new BadRequestError('Пользователя не найдено'));
      return;
    }
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  const userId = await User.findById(req.params.userId);
  if (!userId) {
    next(new NotFoundError('Такого пользователя не существует'));
    return;
  }
  try {
    res.status(200).send({ data: userId });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Пользователя с таким id не найдено'));
      return;
    }
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const userUpdate = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    res.status(200).send(userUpdate);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при обновлении пользователя'));
      return;
    }
    next(err);
  }
};

const updateUserAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const userId = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    res.status(200).send(userId);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
      return;
    }
    next(err);
  }
};

module.exports = {
  login,
  getUsers,
  getUser,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
};

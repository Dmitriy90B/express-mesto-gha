/* eslint-disable no-constant-condition */
/* eslint-disable no-cond-assign */
/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { getToken, isAuthorization } = require('../utils/jwt');

const createUser = async (req, res) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  if (!email || !password) {
    res.status(400).send({ message: 'Неверный логин или пароль' });
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
    res.status(201).send(await userCreate.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({
        message: 'Ошибка валидации',
      });
      return;
    }
    if ((err.code = 11000)) {
      res.status(409).send({ message: 'Пользователь уже существует' });
      return;
    }
    res.status(500).send({ message: 'Произошла ошибка в работе сервера' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send({ message: '0Неверный логин или пароль' });
    return;
  }
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).send({ message: '1Неверный логин или пароль' });
      return;
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).send({ message: '2Неверный логин или пароль' });
      return;
    }
    // res.status(200).send({
    //   token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' }),
    // });
    const token = await getToken(user._id);
    res.status(200).send({ token });
  } catch (err) {
    res.status(500).send({
      message: 'Произошла ошибка в работе сервера',
    });
  }
};

const getUsers = async (req, res) => {
  const isAuth = await isAuthorization(req.headers.authorization);
  if (!isAuth) {
    return res.status(401).send({ message: 'Нет доступа к пользователям' });
  }
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({
      message: 'Произошла ошибка в работе сервера',
    });
  }
};

const getUser = async (req, res) => {
  const isAuth = await isAuthorization(req.headers.authorization);
  if (!isAuth) {
    return res.status(401).send({ message: 'НЕТ доступа к профилю' });
  }
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) {
      res.status(404).send({ message: 'ТАКОГО пользователя не существует' });
      return;
    }
    res.status(200).send({ data: user });
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({
        message: 'Пользователя не найдено',
      });
      return;
    }
    res.status(500).send({
      message: 'Произошла ошибка в работе сервера',
    });
  }
};

const getUserById = async (req, res) => {
  const isAuth = await isAuthorization(req.headers.authorization);
  if (!isAuth) {
    return res.status(401).send({ message: 'Нет доступа к профилю' });
  }
  try {
    const userId = await User.findById(req.params.userId);
    if (!userId) {
      res.status(404).send({ message: 'Такого пользователя не существует' });
      return;
    }
    res.status(200).send({ data: userId });
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({
        message: 'Пользователя с таким id не найдено',
      });
      return;
    }
    res.status(500).send({
      message: 'Произошла ошибка в работе сервера',
    });
  }
};

const updateUser = async (req, res) => {
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
      res.status(400).send({
        message: `${Object.values(err.errors)
          .map((error) => error.message)
          .join(', ')}`,
      });
      return;
    }
    res.status(500).send({
      message: 'Произошла ошибка в работе сервера',
    });
  }
};

const updateUserAvatar = async (req, res) => {
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
      res.status(400).send({
        message: 'Переданы некорректные данные при обновлении аватара',
      });
      return;
    }
    res.status(500).send({
      message: 'Произошла ошибка в работе сервера',
    });
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

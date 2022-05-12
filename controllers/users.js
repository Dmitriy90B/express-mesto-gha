const User = require('../models/user');

// возвращает всех пользователей из базы
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    if (err.errors.name.name === 'ValidationError') {
      res.status(400).send({
        message: 'Ошибка введеных данных',
        err,
      });
      return;
    }
    res.status(500).send({
      message: 'Произошла ошибка в работе сервера',
      err,
    });
  }
};

// возвращает пользователя по _id
const getUserById = async (req, res) => {
  try {
    const userId = await User.findById(req.user._id);
    res.status(200).send(userId);
  } catch (err) {
    if (err.king === 'ObjectID') {
      res.status(404).send({
        message: 'Пользователя с таким id не найдено',
        err,
      });
      return;
    }
    res.status(500).send({
      message: 'Произошла ошибка в работе сервера',
      err,
    });
  }
};

// создаёт пользователя
const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const userCreate = new User({ name, about, avatar });
    res.status(201).send(await userCreate.save());
  } catch (err) {
    if (err.errors.name.name === 'ValidationError') {
      res.status(400).send({
        message: 'Ошибка введеных данных',
        err,
      });
      return;
    }
    res.status(500).send({
      message: 'Произошла ошибка в работе сервера',
      err,
    });
  }
};

// обновляет профиль
const updateUser = async (req, res) => {
  try {
    const { name, about } = req.body;
    const userUpdate = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true },
    );
    res.status(200).send(userUpdate);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({
        message: 'Переданы некорректные данные при обновлении профиля',
        err,
      });
      return;
    }
    if (err.name === 'ObjectID') {
      res.status(404).send({
        message: 'Пользователь с указанным id не найден',
        err,
      });
      return;
    }
    res.status(500).send({
      message: 'Произошла ошибка в работе сервера',
      err,
    });
  }
};

// обновляет аватар
const updateUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const userId = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true },
    );
    res.status(200).send(userId);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({
        message: 'Переданы некорректные данные при обновлении аватара',
        err,
      });
      return;
    }
    if (err.name === 'ObjectID') {
      res.status(404).send({
        message: 'Пользователь с указанным id не найден',
        err,
      });
      return;
    }
    res.status(500).send({
      message: 'Произошла ошибка в работе сервера',
      err,
    });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
};

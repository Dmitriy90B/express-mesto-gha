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

const getUserById = async (req, res) => {
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
        message: 'Переданы некорректные данные при создании пользователя',
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
    if (err.name === 'CastError') {
      res.status(400).send({
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
      { new: true, runValidators: true },
    );
    res.status(200).send(userId);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({
        message: 'Переданы некорректные данные при обновлении аватара',
        ...err,
      });
      return;
    }
    if (err.name === 'CastError') {
      res.status(400).send({
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

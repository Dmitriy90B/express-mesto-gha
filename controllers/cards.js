const Card = require('../models/card');

const getCards = async (req, res) => {
  try {
    const users = await Card.find({});
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({
      message: 'Произошла ошибка в работе сервера',
    });
  }
};

const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    const { _id, ...result } = card.toObject();
    res.status(201).send(result);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({
        message: 'Ошибка введеных данных',
      });
      return;
    }
    res.status(500).send({
      message: 'Произошла ошибка в работе сервера',
    });
  }
};

const deleteCardById = async (req, res) => {
  try {
    const cardId = await Card.findById(req.params.cardId);
    if (!cardId) {
      res.status(404).send({
        message: 'Карточка с указанным id не найдена',
      });
      return;
    }
    if (!cardId.owner.equals(req.user._id)) {
      res.status(403).send({
        message: 'Чужая карточка',
      });
      return;
    }
    const cardRemove = await Card.findByIdAndRemove(cardId);
    res.status(200).send(cardRemove);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Невалидный id' });
      return;
    }
    res.status(500).send({
      message: 'Произошла ошибка в работе сервера',
    });
  }
};

const likeCard = async (req, res) => {
  try {
    const like = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    );
    if (!like) {
      res.status(404).send({
        message: 'Передан несуществующий id карточки',
      });
      return;
    }
    res.status(200).send({ data: like });
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({
        message: 'Переданы некорректные данные для постановки лайка',
      });
      return;
    }
    res.status(500).send({
      message: 'Произошла ошибка в работе сервера',
    });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const dislike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    );
    if (!dislike) {
      res.status(404).send({
        message: 'Передан несуществующий id карточки',
      });
      return;
    }
    res.status(200).send({ data: dislike });
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({
        message: 'Переданы некорректные данные для снятии лайка',
      });
      return;
    }
    res.status(500).send({
      message: 'Произошла ошибка в работе сервера',
    });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};

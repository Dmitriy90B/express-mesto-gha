const Card = require('../models/card');

const getCards = async (req, res) => {
  try {
    const users = await Card.find({});
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

const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    res
      .status(201)
      .send(await Card.create({ name, link, owner: req.user._id }));
  } catch (err) {
    if (err.name === 'ValidationError') {
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

const deleteCardById = async (req, res) => {
  try {
    const cardId = await Card.findByIdAndRemove(req.params.cardId);
    res.status(200).send(cardId);
  } catch (err) {
    if (err.name === 'ObjectID') {
      res.status(404).send({
        message: 'Карточка с указанным id не найдена',
        err,
      });
    }
  }
};

const likeCard = async (req, res) => {
  try {
    const like = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    );
    res.status(200).send({ data: like });
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({
        message: 'Переданы некорректные данные для постановки лайка',
        err,
      });
      return;
    }
    if (err.name === 'ObjectId') {
      res.status(404).send({
        message: 'Передан несуществующий id карточки',
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

const dislikeCard = async (req, res) => {
  try {
    const dislike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    );
    res.status(200).send({ data: dislike });
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({
        message: 'Переданы некорректные данные для снятии лайка',
        err,
      });
      return;
    }
    if (err.kind === 'ObjectId') {
      res.status(404).send({
        message: 'Передан несуществующий id карточки',
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
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};

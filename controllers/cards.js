const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch (err) {
    next(err);
  }
};

const createCard = async (req, res, next) => {
  const { name, link } = req.body;
  const card = await Card.create({ name, link, owner: req.user._id });
  try {
    const { _id: removedId, ...result } = card.toObject();
    res.status(201).send(result);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Ошибка введеных данных'));
      return;
    }
    next(err);
  }
};

const deleteCardById = async (req, res, next) => {
  const cardId = await Card.findById(req.params.cardId);
  if (!cardId) {
    next(new NotFoundError('Карточка с указанным id не найдена'));
    return;
  }
  if (!cardId.owner.equals(req.user._id)) {
    next(new ForbiddenError('Чужая карточка'));
    return;
  }
  try {
    const cardRemove = await Card.findByIdAndRemove(cardId);
    res.status(200).send(cardRemove);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Невалидный id'));
      return;
    }
    next(err);
  }
};

const likeCard = async (req, res, next) => {
  try {
    const like = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    );
    if (!like) {
      next(new NotFoundError('Передан несуществующий id карточки'));
      return;
    }
    res.status(200).send(like);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные для постановки лайка'));
      return;
    }
    next(err);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const dislike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    );
    if (!dislike) {
      next(new NotFoundError('Передан несуществующий id карточки'));
      return;
    }
    res.status(200).send(dislike);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные для снятии лайка'));
      return;
    }
    next(err);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};

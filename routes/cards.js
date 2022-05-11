const express = require("express");
const cardRoutes = express.Router();

const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

cardRoutes.get("/", getCards);
cardRoutes.post("/", express.json(), createCard);
cardRoutes.delete("/:cardId", deleteCardById);
cardRoutes.put("/:cardId/likes", likeCard);
cardRoutes.delete("/:cardId/likes", dislikeCard);

module.exports = {
  cardRoutes,
};

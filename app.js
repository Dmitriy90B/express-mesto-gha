const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const { userRoutes } = require('./routes/users');
const { cardRoutes } = require('./routes/cards');
const { createUser, login } = require('./controllers/users');

const app = express();

app.use(express.json());

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/(www\.)?[0-9A-Za-z-.]*\.[A-Za-z-.]{2,}([0-9A-Za-z-._~:/?#[\]@!$&'()*+,;=])*#*$/),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.use('/users', auth, userRoutes);
app.use('/cards', auth, cardRoutes);
app.use(auth, (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });

  app.listen(PORT, () => {
    // eslint-disable-next-line
    console.log(`Слушаем ${PORT} порт`);
  });
}

app.use(errors());

app.use((req, res, next) => {
  // eslint-disable-next-line
  console.log(req.method, req.url);
  next();
});

main();

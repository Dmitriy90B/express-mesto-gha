const express = require('express');
const mongoose = require('mongoose');
// const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const { userRoutes } = require('./routes/users');
const { cardRoutes } = require('./routes/cards');
const { createUser, login } = require('./controllers/users');

const app = express();

app.use(express.json());
app.use('/users', userRoutes);
app.use('/cards', cardRoutes);
app.post('/signup', createUser);
app.post('/signin', login);
app.use((req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});
// app.use('/', auth, (req, res) => {
//   res.status(404).send({ message: 'Страница не найдена' });
// });

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

app.use((req, res, next) => {
  // eslint-disable-next-line
  console.log(req.method, req.url);
  next();
});

main();

const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const { userRoutes } = require('./routes/users');
const { cardRoutes } = require('./routes/cards');

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '627768844f8de9f35c05896e',
  };

  next();
});

app.use(express.json());
app.use('/users', userRoutes);
app.use('/cards', cardRoutes);
app.use((req, res) => {
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

main();

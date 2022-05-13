const express = require('express');
const mongoose = require('mongoose');

const path = require('path');
// стандартное поведение для ОС
const { PORT = 3000 } = process.env;

const { userRoutes } = require('./routes/users');
const { cardRoutes } = require('./routes/cards');

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '627ebb71949e8014367b8e27',
  };

  next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

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

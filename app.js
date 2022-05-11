const express = require("express");
const mongoose = require("mongoose");

const path = require("path"); // стандартное поведение для ОС
const { PORT = 3000 } = process.env;

const { userRoutes } = require("./routes/users");
const { cardRoutes } = require("./routes/cards");
const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: "627768844f8de9f35c05896e",
  };

  next();
});

app.use(express.static(path.join(__dirname, "public")));
app.use("/users", userRoutes);
app.use("/cards", cardRoutes);

async function main() {
  await mongoose.connect("mongodb://localhost:27017/mestodb", {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });

  app.listen(PORT, () => {
    console.log(`Слушаем ${PORT} порт`);
  });
}

main();

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

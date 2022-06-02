const jwt = require('jsonwebtoken');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).send({ message: '1 Необходима авторизация' });
  }

  const token = authorization;
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret');
  } catch (err) {
    return res.status(401).send({ message: '2 Необходима авторизация' });
  }

  req.user = payload;
  next();
};
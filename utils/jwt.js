const jwt = require('jsonwebtoken');

const JWT_SECRET = 'jasioyjkmnvmjuqnnsloabqawdwq';
// eslint-disable-next-line no-return-await
const getToken = async (id) => await jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });

const isAuthorization = async (token) => {
  try {
    const decoded = await jwt.verify(token, JWT_SECRET);
    return !!decoded;
  } catch (err) {
    return false;
  }
};

module.exports = {
  getToken,
  isAuthorization,
};

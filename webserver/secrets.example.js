// secrets.js
module.exports = {
  DB_HOST: 'pi-desk',
  DB_USER: 'example',
  DB_PASSWORD: 'example',
  DB_NAME: 'example',

  // Basic auth users: username: password pairs
  AUTH_USERS: {
    'example': 'example',
    'anotheruser': 'anotherpassword',
  },

  // Session secret for cookie signing; made using openssl rand -base64 32
  SESSION_SECRET: 'example',
};
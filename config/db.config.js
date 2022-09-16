module.exports = {
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PWD,
  DB: process.env.DB_NAME,
  dialect: process.env.DB_DRIVER,

  pool: {
    max: parseInt(process.env.POOL_MAX),
    min: parseInt(process.env.POOL_MIN),
    acquire: parseInt(process.env.POOL_ACQUIRE),
    idle: parseInt(process.env.POOL_IDLE),
  },
  dialectOptions: {
    connectTimeout: parseInt(process.env.POOL_CONNECTED_TIMEOUT),
  },
}

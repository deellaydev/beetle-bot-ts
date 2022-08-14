import { Dialect, Sequelize } from 'sequelize';

export const db = new Sequelize({
  dialect: process.env.DB_TYPE as Dialect,
  logging: process.env.DB_LOG ? console.log : false,
  host: process.env.DB_HOSTNAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  timezone: '+00:00',
  define: {
    timestamps: false,
  },
});

export const openConnection = () => {
  return db.authenticate();
};

export const closeConnection = () => {
  return db.close();
};

import dotenv from "dotenv";
dotenv.config();

export default {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "share-test",
    host: process.env.DB_HOST,
    dialect: "postgres",
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "share-test",
    host: process.env.DB_HOST,
    dialect: "postgres",
  },
  // production: {
  //   url: "postgresql://test_dev_5ssc_user:bCaUQwFn0N5ZPXdfra6taf4vPSlAPeEz@dpg-cqn69slsvqrc73fk8cvg-a.oregon-postgres.render.com/test_dev_5ssc",
  //   dialect: "postgres",
  //   logging: false,
  //   dialectOptions: {
  //     ssl: {
  //       require: true,
  //       rejectUnauthorized: false,
  //     },
  //   },
  // },
};

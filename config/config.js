import dotenv from "dotenv";
dotenv.config();

export default {
  development: {
    url: process.env.DB_URL,
    dialect: "postgres",
    logging: false,
  },
  test: {
    dialect: "postgres",
    logging: false,
  },
  production: {
    url: process.env.DB_URL,
    dialect: "postgres",
    logging: false,
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

// {
//     username: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     database: "share-test",
//     host: process.env.DB_HOST,
//     dialect: "postgres",
//   },

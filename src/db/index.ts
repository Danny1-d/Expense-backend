import pkg from "pg";
const { Pool } = pkg
import dotenv from "dotenv";
dotenv.config();

declare const process: {
  env: {
    POSTGRE_USER: string;
    POSTGRE_HOST: string;
    POSTGRE_DATABASE: string;
    POSTGRE_PASSWORD: string;
    POSTGRE_PORT: number;
  };
};

const db = new Pool ({
  user: process.env.POSTGRE_USER,
  host:  process.env.POSTGRE_HOST,
  database:  process.env.POSTGRE_DATABASE,
  password: process.env.POSTGRE_PASSWORD,
  port: process.env.POSTGRE_PORT,
});

export default db;
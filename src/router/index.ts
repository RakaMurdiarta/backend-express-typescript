import express from "express";
import auth from "./auth";
import alluser from "./user";

const router = express.Router();

export default (): express.Router => {
  auth(router);
  alluser(router);
  return router;
};

import express from "express";
import { getAllUser } from "../controller/user";
export default (router: express.Router): express.Router => {
  return router.get("/users", getAllUser);
};

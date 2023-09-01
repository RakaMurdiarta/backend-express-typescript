import express from "express";
import { getUsers } from "../db/user";

export const getAllUser = async (req: express.Request, res: express.Response) => {
  try {
    const users = await getUsers();
    return res.status(200).json({
      method: req.method,
      data: users,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

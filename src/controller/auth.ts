import express from "express";
import { createUser, getUserbyEmail } from "../db/user";
import { random, authentication } from "../helpers";

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    const userLogin = await getUserbyEmail(email).select(
      "+authentication.salt +authentication.password"
    );
    if (!userLogin) {
      return res.sendStatus(403).json({
        msg: "this email not exist , please consider to register",
      });
    }

    const expectedHash = authentication(
      userLogin.authentication.salt,
      password
    );

    if (userLogin.authentication.password !== expectedHash.toString()) {
      return res.status(403).json({
        msg: "credentials error",
      });
    }

    const salt = random();
    userLogin.authentication.sessionToken = authentication(
      salt,
      userLogin._id.toString()
    ).toString();

    await userLogin.save();

    res.cookie("AUTH-SESSION", userLogin.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });

    const {authentication : auth_ , email : user_email , _id , username} = userLogin

    return res
      .status(200)
      .json({
        method: req.method,
        data: {
            _id,
            email : user_email,
            username
        },
      })
      .end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.sendStatus(400);
    }
    const existingUser = await getUserbyEmail(email);

    if (existingUser) {
      return res.sendStatus(400);
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res
      .status(200)
      .json({
        method: req.method,
        data: user,
      })
      .end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

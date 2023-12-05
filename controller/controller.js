import { server } from "@passwordless-id/webauthn";
import { deleteChallenge, getChallenge } from "../utils/challenge.js";
import User from "../database/models/user.js";
import jwt from "jsonwebtoken";
export const registerUser = async (req, res, next) => {
  try {
    const registerationParsed = await server.verifyRegistration(
      req.body.registration,
      {
        challenge: getChallenge(req.body.clientId),
        origin: process.env.ORIGIN,
      }
    );
    console.log(registerationParsed);
    //check credentials existance
    if (registerationParsed.credential) {
      //check if the user already exists!
      const checkUser = await User.findOne({
        username: registerationParsed.username,
      });

      if (!checkUser) {
        //save the user in database!
        const newUser = new User();
        newUser.username = registerationParsed.username;
        newUser.credential = registerationParsed.credential;
        await newUser.save();

        res.status(200).send({ message: "Successfully registered!!" });
      } else {
        //if user already exists!!
        res.send({ message: "User already exists! Please login!" });
      }
    } else {
      //throw error if something goes wrong!
      res.status(500).send({ err: "Something went wrong!" });
    }
    deleteChallenge(req.body.clientId);
  } catch (err) {
    res.send({ err: err });
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { clientId, username, authentication } = req.body;
    const user = await User.findOne({ username: username });
    if (user) {
      const expected = {
        challenge: getChallenge(clientId),
        origin: process.env.ORIGIN,
        userVerified: true,
      };

      const authenticationParsed = await server.verifyAuthentication(
        authentication,
        user.credential,
        expected
      );

      //generate a token
      var token = jwt.sign({ username: username }, process.env.SECRET, {
        expiresIn: "1h",
      });
      //save cookie in client
      res.cookie("token", token, {
        httpOnly: true,
      });

      res.send({ message: "success" });
    } else {
      res.send({ err: "User not registered!!" });
    }
    deleteChallenge(clientId);
  } catch (err) {
    console.log(err);
    res.send({ err: err });
  }
};

export const getSecret = (req, res, next) => {
  res.render("secret");
};

export const getHome = (req, res, next) => {
  res.render("index");
};

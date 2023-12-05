import express from "express";
import {
  registerUser,
  getHome,
  loginUser,
  getSecret,
} from "../controller/controller.js";
import { v4 as uuidv4 } from "uuid";
import { setChallenge } from "../utils/challenge.js";
import User from "../database/models/user.js";
import { checkAuthentication } from "../utils/verifyToken.js";
const router = express.Router();

router.get("/", getHome);

router.get("/secret", checkAuthentication, getSecret);

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/getchallenge", async (req, res, next) => {
  const challenge = uuidv4();
  const clientId = Math.random() * 1000;
  setChallenge(clientId, challenge);
  let response = { challenge: challenge, clientId: clientId };

  if (req.body.withId) {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      response.cId = user.credential.id;
    }
  }

  res.send(response);
});

// router.post("/test", (req, res, next) => {});

export default router;

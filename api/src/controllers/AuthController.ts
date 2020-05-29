import { Request, Response } from "express";
import * as i18n from "i18n";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { User } from "../entity/User";

class AuthController {

  public static login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!(username && password)) {
      res.status(400).end(JSON.stringify({error: i18n.__("errors.usernameOrPasswordEmpty")}));
    }

    // Get user from database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.createQueryBuilder("user")
        .addSelect("user.password")
        .where("user.username = :username", { username })
        .getOne();
    } catch (error) {
      res.status(401).end(JSON.stringify({message: i18n.__("errors.wrongUsername")}));
    }

    if (!user) {
      res.status(401).end(JSON.stringify({message: i18n.__("errors.wrongUsername")}));
      return;
    }
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      res.status(401).end(JSON.stringify({message: i18n.__("errors.wrongPassword")}));
      return;
    }
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      req.app.locals.config.JWT_SECRET,
      { expiresIn: "1h" },
    );

    const response = {
      ...user,
      token,
    };
    response.password = undefined;

    // Send the jwt in the response
    res.send(response);
  }

}
export default AuthController;

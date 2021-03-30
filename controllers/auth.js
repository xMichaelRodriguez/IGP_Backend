import { response } from "express";
import bcrypt from "bcryptjs";

import { User } from "../models/auth.js";
import { generarJWT } from "../helpers/jwt.js";

export const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const userSchema = await User.findOne({ email });

    if (!userSchema) {
      return res.status(400).json({
        ok: false,
        msg: "User not found that email",
      });
    }

    //confirmar los password
    const validPassword = bcrypt.compareSync(password, userSchema.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Invalid password",
      });
    }
    // Generar JWT
    const token = await generarJWT(userSchema.id, userSchema.name);
    return res.json({
      ok: true,
      uid: userSchema.id,
      name: userSchema.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "something went wrong",
    });
  }
};

export default {
  login,
};

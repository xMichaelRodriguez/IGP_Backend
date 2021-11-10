const { response } = require('express')
const bcrypt = require('bcryptjs')

const User = require('../models/auth.js')
const { generarJWT } = require('../helpers/jwt.js')

const login = async (req, res = response) => {
  const { email, password } = req.body

  try {
    const userSchema = await User.findOne({ email })

    if (!userSchema) {
      return res.status(400).json({
        ok: false,
        msg: 'no existe usuario con ese correo',
      })
    }

    //confirmar los password
    const validPassword = bcrypt.compareSync(
      password,
      userSchema.password
    )

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Invalid password',
      })
    }
    // Generar JWT
    const token = await generarJWT(
      userSchema.id,
      userSchema.name
    )
    return res.json({
      ok: true,
      uid: userSchema.id,
      name: userSchema.name,
      token,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'something went wrong',
    })
  }
}
const revalidarToken = async (req, res = response) => {
  const { uid, name } = req

  // Generar JWT
  const token = await generarJWT(uid, name)

  res.json({
    ok: true,
    token,
    uid,
    name,
  })
}
module.exports = {
  login,
  revalidarToken,
}

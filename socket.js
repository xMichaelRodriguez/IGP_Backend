const ForumUser = require('./models/forum')

module.exports.listen = function (io, socket) {
  socket.on('register', async (data, cb) => {
    try {
      if (!data.userName) {
        cb({ msg: "Apodo requerido", user: null })
      }
      const userDublicated = await ForumUser.findOne({ name: data.userName })

      if (userDublicated) {

        return cb({ msg: "Ya existe un usuario con ese apodo, utiliza otro :0", user: null })
      } else {
        const userToSave = new ForumUser({ name: data.userName });
        const userSaved = await userToSave.save()

        if (!userSaved) {
          cb({ msg: "Error al intentar registrarte", user: userToSave })
        }
        return cb({ msg: 'usuario Registrado', user: userSaved })
      }

    } catch (error) {
      return cb({ msg: `error interno ${error}`, user: null })
    }

  })
  socket.on('create-forums', async (data, cb) => { })

}

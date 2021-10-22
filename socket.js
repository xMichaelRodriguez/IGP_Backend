const ForumUser = require('./models/forum')
const Forums = require('./models/forums')

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
          cb({ msg: "Error al intentar registrarte", user: null })
        }
        return cb({ msg: 'usuario Registrado', user: userSaved })
      }

    } catch (error) {
      return cb({ msg: `error interno ${error}`, user: null })
    }

  })
  socket.on('create-forums', async (data, cb) => {
    try {
      if (!data) {
        cb({ msg: "Tema y Contenido para el foro requerido", forum: null })
      }
      const themeDuplicated = await Forums.findOne({ theme: data.forum.theme })
      if (themeDuplicated) {

        return cb({ msg: "Ya existe un Foro con ese tema, utiliza otro :0", forum: null })
      } else {


        const forumToSave = new Forums({ ...data.forum, user: data.uid });
        const forumSaved = await forumToSave.save()

        if (!forumSaved) {
          cb({ msg: "Error al intentar crear el foro", forum: forumToSave })
        }
        return cb({ msg: 'Foro creado!!!', forum: forumSaved })
      }

    } catch (error) {
      return cb({ msg: `error interno ${error}`, forum: null })
    }

  })

  socket.on('loading-forums', async () => {
    try {
      const result = await Forums.find()
      if (!result) {
        cb({ msg: "foros", forums: [] })
      }


      socket.emit('loaded-forums', result);

    } catch (error) {
      return cb({ msg: `error interno ${error}`, forums: null })
    }
  })

  socket.on('findById', async (data, cb) => {
    try {
      const forum = await Forums.findById(data.foroId);
      if (!forum) {
        cb({ msg: "No existe foro con ese id", forum: null })
      }

      cb({ msg: "", forum })
    } catch (error) {
      console.log(error)
      cb({ msg: "Error de servidor" })
    }
  })

}

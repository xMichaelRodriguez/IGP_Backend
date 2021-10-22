const CommentsForum = require('./models/commentsForum')
const ForumUser = require('./models/forum')
const forums = require('./models/forums')
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

  socket.on('loading-active-foro', async () => {
    try {
      //llamar todos los foros
      const forums = await Forums.find()

      if (!forums) return

      const comments = []
      forums.forEach(element => {
        comments.push(element._id)
      });

      //llamar todos los commentarios de cada foro
      let commentToCompare = []
      for (const uid of comments) {
        const resp = await CommentsForum.find({ forumId: uid })
        commentToCompare.push(resp)
      }


      const mayor = []
      for (let i = 0; i < commentToCompare.length; i++) {
        const item = commentToCompare[i];
        for (let j = 0; j < commentToCompare.length; j++) {
          const element = commentToCompare[j];
          if (item.length > element.length) {
            mayor.push(...item)
          }

        }
      }

      const resp = await Forums.findById(mayor[0].forumId)
      socket.emit('loaded-active-forums', resp);

    } catch (error) {
      console.log(error)
      // return cb({ msg: `error interno ${error}`, forums: null })
    }
  })

  socket.on('findById', async (data, cb) => {
    try {
      const forum = await Forums.findById(data.foroId)

      if (!forum) {
        cb({ msg: "No existe foro con ese id", forum: null })
      }

      cb({ msg: "", forum })
    } catch (error) {
      console.log(error)
      cb({ msg: "Error de servidor", forum: null })
    }
  });

  socket.on('comment-in-forum', async (data, cb) => {
    try {
      const { commentBox, userId, forumId } = data;

      if (!commentBox) {
        cb({ msg: "falta parametro comentario", comment: null })
      }
      if (!userId) {
        cb({ msg: "falta parametro usuario", comment: null })
      }
      if (!forumId) {
        cb({ msg: "falta parametro foro", comment: null })
      }

      const commentToSave = new CommentsForum({ comment: commentBox, forumId, user: userId });
      await commentToSave.save();


      const commentsOfForum = await CommentsForum.findOne({ forumId, _id: commentToSave._id }).populate('user')
      cb({ msg: "", comment: commentsOfForum })


    } catch (error) {
      console.log(error)
      cb({ msg: "Error de servidor", comment: null })
    }
  })

  socket.on('load-comments', async (data) => {
    try {

      const commentsOfForum = await CommentsForum.find({ forumId: data }).populate('user')

      socket.emit('comments-loaded', commentsOfForum)

    } catch (error) {
      console.log(error)
    }



  })


}


const CommentsForum = require('./models/commentsForum')
const ForumUser = require('./models/forum')
const Forums = require('./models/forums')
const ReplyComments = require('./models/ReplyComments')

module.exports.listen = function (io, socket) {
  socket.on('register', async (data, cb) => {
    try {
      if (!data.userName) {
        cb({ msg: 'Apodo requerido', user: null })
      }
      const userDublicated = await ForumUser.findOne({
        name: data.userName,
      })

      if (userDublicated) {
        return cb({
          msg: 'Ya existe un usuario con ese apodo, utiliza otro :0',
          user: null,
        })
      } else {
        const userToSave = new ForumUser({
          name: data.userName,
        })
        const userSaved = await userToSave.save()

        if (!userSaved) {
          cb({
            msg: 'Error al intentar registrarte',
            user: null,
          })
        }
        return cb({
          msg: 'usuario Registrado',
          user: userSaved,
        })
      }
    } catch (error) {
      return cb({
        msg: `error interno ${error}`,
        user: null,
      })
    }
  })
  socket.on('create-forums', async (data, cb) => {
    try {
      if (!data) {
        cb({
          msg: 'Tema y Contenido para el foro requerido',
          forum: null,
        })
      }
      const themeDuplicated = await Forums.findOne({
        theme: data.forum.theme,
      })
      if (themeDuplicated) {
        return cb({
          msg: 'Ya existe un Foro con ese tema, utiliza otro :0',
          forum: null,
        })
      } else {
        const forumToSave = new Forums({
          ...data.forum,
          user: data.uid,
        })
        const forumSaved = await forumToSave.save()

        if (!forumSaved) {
          cb({
            msg: 'Error al intentar crear el foro',
            forum: forumToSave,
          })
        }
        return cb({
          msg: 'Foro creado!!!',
          forum: forumSaved,
        })
      }
    } catch (error) {
      return cb({
        msg: `error interno ${error}`,
        forum: null,
      })
    }
  })

  socket.on('loading-forums', async (page) => {

    try {
      //Recoger Pagina actual
      if (
        !page ||
        page === '0' ||
        page === null ||
        page === undefined
      ) {
        page = 1
      } else {
        page = parseInt(page)
      }

      const options = {
        sort: { date: -1 },
        limit: 10,
        page,
      }
      const result = await Forums.paginate({}, options)
      if (!result) {
        cb({ msg: 'foros', forums: [] })
      }

      socket.emit('loaded-forums', {
        forums: result.docs,
        totalDocs: result.totalDocs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
      })
    } catch (error) {
      return cb({
        msg: `error interno ${error}`,
        forums: null,
      })
    }
  })

  socket.on('loading-active-foro', async () => {
    try {
      //llamar todos los foros
      const forums = await Forums.find()

      if (!forums) {
        socket.emit('loaded-active-forums', [])
      }
      // sacar comentarios de cada foro
      const comments = []
      forums.forEach((element) => {
        comments.push(element._id)
      })

      //llamar todos los commentarios de cada foro

      const commentToCompare = await Promise.all(await comments.map(async comment => {
        const resp = await CommentsForum.find({ forumId: comment })
        if (resp) {
          return { foro: resp, totalComments: resp.length }
        }

      }))
      // sacamos el total de comentarios de cada foro
      let resp = []
      commentToCompare.forEach((currentValue) => {

        if (Object.entries(currentValue).length !== 0) {
          resp.push(currentValue.totalComments)
        }
        return resp
      });
      if (Object.entries(resp).length === 0) {
        socket.emit(
          'loaded-active-forums',
          null
        )
      } else {
        //ordenamos y retornamos el numero mayor de los totales de comentarios de cada foro
        const maxComments = resp.sort(comparar).pop()


        //comparamos cada foro y verificamos si el maxComments que sacamos coincide
        //  con un foro para luego retornar este
        let forumActive = []
        commentToCompare.forEach(async (element) => {
          if (element.totalComments === maxComments) {
            forumActive.push(...element.foro)
          }
        })
        const forumToFind = forumActive.pop()

        const forumUltimateActive = await Forums.findById(
          forumToFind?.forumId
        )
        socket.emit(
          'loaded-active-forums',
          forumUltimateActive
        )
      }

    } catch (error) {
      console.log(error)
      // return cb({ msg: `error interno ${error}`, forums: null })
    }
  })

  socket.on('findById', async (data, cb) => {
    try {
      const forum = await Forums.findById(
        data.foroId
      ).populate('user')

      if (!forum) {
        cb({
          msg: 'No existe foro con ese id',
          forum: null,
        })
      }

      cb({ msg: '', forum })
    } catch (error) {
      console.log(error)
      cb({ msg: 'Error de servidor', forum: null })
    }
  })

  socket.on('comment-in-forum', async (data, cb) => {
    try {
      const { commentBox, userId, forumId } = data

      if (!commentBox) {
        cb({
          msg: 'falta parametro comentario',
          comment: null,
        })
      }
      if (!userId) {
        cb({
          msg: 'falta parametro usuario',
          comment: null,
        })
      }
      if (!forumId) {
        cb({ msg: 'falta parametro foro', comment: null })
      }

      const commentToSave = new CommentsForum({
        comment: commentBox,
        forumId,
        user: userId,
      })
      await commentToSave.save()

      const commentsOfForum = await CommentsForum.findOne({
        forumId,
        _id: commentToSave._id,
      }).populate('user')
      cb({ msg: '', comment: commentsOfForum })
    } catch (error) {
      console.log(error)
      cb({ msg: 'Error de servidor', comment: null })
    }
  })

  socket.on('reply-comment', async (data, cb) => {
    const { commentBox, commentId, user } = data;

    if (!commentBox) {
      cb({
        msg: 'falta parametro comentario',
        comment: null,
      })
    }
    if (!commentId) {
      cb({
        msg: 'falta parametro commentId',
        comment: null,
      })
    }
    if (!user) {
      cb({ msg: 'falta parametro user', comment: null })
    }

    const replyCommentToSave = new ReplyComments({ comment: commentBox, commentId, user })
    try {
      const reply = await replyCommentToSave.save();
      const replyComment = await ReplyComments.findOne({
        commentId,
        _id: reply._id
      }).populate('user');

      cb({ msg: "", replies: replyComment })
    } catch (error) {
      console.log(error)
      cb({ msg: 'Algo Salio Mal :(', replies: null })
    }
  })
  socket.on('load-comments', async (data) => {
    try {
      const commentsOfForum = await CommentsForum.find({
        forumId: data,
      }).populate('user');

      if (!commentsOfForum) return [];

      const combineComments = await Promise.all(commentsOfForum.map(async comment => {
        const replyComments = await ReplyComments.find({ commentId: comment._id }).populate('user');
        const commentsFilterd = await replyComments.filter(reply => String(reply.commentId) === String(comment._id));
        return { commentFather: comment, replyComments: commentsFilterd }
      }))
      socket.emit('comments-loaded', combineComments)

    } catch (error) {
      console.log(error)
    }
  })

  socket.on('load-my-forums', async (data) => {
    const myForums = await Forums.find({ user: data })
    if (!myForums) {
      socket.emit('loaded-my-forums', {
        msg: 'no tienes foros',
        forums: null,
      })
    }

    socket.emit('loaded-my-forums', {
      msg: '',
      forums: myForums,
    })
  })

  socket.on('delete-my-forum', async (data, cb) => {
    try {
      await Forums.findByIdAndDelete(data.forumId)

      cb({ msg: 'Foro Eliminado' })
    } catch (error) {
      cb({ msg: 'Error de servidor' })
    }
  });

  socket.on('delete-comment', async (id, cb) => {
    try {
      const response = await CommentsForum.findByIdAndDelete(id);
      if (!response) {
        return cb("No se encontro un foro con ese id");
      }

      return socket.emit('deletedComment', "Comentario eliminado")
    } catch (error) {
      cb(error)
    }

  })
}

const comparar = (a, b) => {
  return a - b
}

const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

io.on('connection', socket => {
  socket.on('userLeft', (id) => {

  })

  socket.on('disconnect', () => {
    const user = users.remove(socket.id)
    if (user) {
      io.to(user.room).emit('updateUsers', users.getByRoom(user.room))
      io.to(user.room).emit(
        'newMessage',
        m('admin', `Пользователь ${user.name} вышел.`)
      )
    }
  })
})

module.exports = {
  app,
  server
}
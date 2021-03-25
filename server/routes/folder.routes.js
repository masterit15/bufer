const { Router } = require('express')
const router = Router()
const Folder = require('../model/folder')


router.post('/', (req, res, next) =>{
    const {name, path} = req.body
    Folder.create({
      name,
      path, 
  }).then(users=>{
      return res.status(201).json({ 
          success: true,
          message: 'Раздел добавлен',
          users
      })
  }).catch((err)=>{
      return res.status(500).json({
          success: false,
          message: 'Что-то пошло не так, попробуйте еще раз',
          err
      })
  });
})

module.exports = router
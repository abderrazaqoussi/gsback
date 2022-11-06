const { getAllUsers } = require('./../controllers/userController')
const userRouter = require('express').Router()

userRouter.route('/').get(getAllUsers)

module.exports = userRouter

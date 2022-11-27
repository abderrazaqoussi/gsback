const { getAllUsers, getUseryById } = require('./../controllers/userController')
const userRouter = require('express').Router()

userRouter.route('/').get(getAllUsers)
userRouter.route('/:id').get(getUseryById)

module.exports = userRouter

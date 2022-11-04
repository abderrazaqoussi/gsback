const express = require('express')
const { getAllTeams, addTeam } = require('./../controllers/TeamController')

const teamRouter = express.Router()

teamRouter.route('/').get(getAllTeams).post(addTeam)

module.exports = teamRouter

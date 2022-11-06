const express = require('express')
const { getAllTeams, addTeam } = require('./../controllers/teamController')

const teamRouter = express.Router()

teamRouter.route('/').get(getAllTeams).post(addTeam)

module.exports = teamRouter

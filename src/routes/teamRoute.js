const teamRouter = require('express').Router()
const {
  getAllTeams,
  addTeam,
  deleteTeam,
  getTeamsByUserId,
  deleteUserFromTeam,
} = require('./../controllers/teamController')

const upload = require('../lib/multerConfig')

teamRouter.route('/').get(getAllTeams).post(upload.single('teamImage'), addTeam)
teamRouter.route('/:id').delete(deleteTeam)
teamRouter.route('/user/:id').get(getTeamsByUserId)
teamRouter.route('/user/:userId/:teamId').delete(deleteUserFromTeam)

module.exports = teamRouter

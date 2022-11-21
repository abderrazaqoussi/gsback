const teamRouter = require('express').Router()
const {
  getAllTeams,
  addTeam,
  deleteTeam,
  getTeamsByUserId,
  deleteUserFromTeam,
  getTeamByInviteCode,
  addUserToPendingList,
  rejectUserDemand,
  confirmUserDemand,
} = require('./../controllers/teamController')

const upload = require('../lib/multerConfig')

teamRouter.route('/').get(getAllTeams).post(upload.single('teamImage'), addTeam)
teamRouter.route('/:code').get(getTeamByInviteCode)
teamRouter.route('/:id').delete(deleteTeam)
teamRouter.route('/user/:id').get(getTeamsByUserId)
teamRouter
  .route('/user/:userId/:teamId')
  .delete(deleteUserFromTeam)
  .post(addUserToPendingList)
teamRouter.route('/reject/:userId/:teamId').post(rejectUserDemand)
teamRouter.route('/confirm/:userId/:teamId').post(confirmUserDemand)

module.exports = teamRouter

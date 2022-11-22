const teamRouter = require('express').Router()
const {
  getTeams,
  addTeam,
  deleteTeamByID,
  getTeamsByUserId,
  deleteUserFromTeam,
  getTeamByCode,
  addUserToPendingList,
  rejectUserDemand,
  confirmUserDemand,
} = require('./../controllers/teamController')

const upload = require('../lib/multerConfig').single('teamImage')

teamRouter
  .route('/')
  .get(getTeams)
  .post(function (req, res, next) {
    upload(req, res, function (err) {
      if (err) {
        return res.status(422).json({
          status: 'Error',
          message: err,
        })
      }
      next()
    })
  }, addTeam)

//
teamRouter.route('/:code').get(getTeamByCode)
teamRouter.route('/:id').delete(deleteTeamByID)
teamRouter.route('/user/:id').get(getTeamsByUserId)
teamRouter
  .route('/:teamid/user/:userid')
  .delete(deleteUserFromTeam)
  .post(addUserToPendingList)
teamRouter.route('/:teamid/user/:userid/rejected').post(rejectUserDemand)
teamRouter.route('/:teamid/user/:userid/confirmed').post(confirmUserDemand)

module.exports = teamRouter

const sessionRouter = require('express').Router()
const {
  getRecordedSessions,
  getSessions,
  addSession,
} = require('../controllers/sessionController')

sessionRouter.route('/recorded/:id').get(getRecordedSessions)
sessionRouter.route('/planned/').get(getSessions).post(addSession)

module.exports = sessionRouter

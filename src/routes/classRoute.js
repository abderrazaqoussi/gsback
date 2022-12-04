const classRouter = require('express').Router()
const {
  getRecordedClass,
  getClasses,
  addClass,
} = require('./../controllers/classController')

classRouter.route('/recorded/:id').get(getRecordedClass)
classRouter.route('/planified/').get(getClasses).post(addClass)
// classRouter
//   .route('/planified/:id')
//   .get(getClassByTeamId)
//   .put(updateClassByTeamId)

module.exports = classRouter

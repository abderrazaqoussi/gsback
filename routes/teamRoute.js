const express = require('express')
const { getAllTeams, addTeam } = require('../controllers/TeamController')

const router = express.Router()

router.route('/').get(getAllTeams).post(addTeam)

module.exports = router

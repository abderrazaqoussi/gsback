const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args))
// name,owner,inviteCode,pendingList,creationDate,members,classes

// /recorded/:id
exports.getRecordedClass = catchAsync(async (req, res) => {
  const userId = req.params.id

  // ** Create new Instance
  let user = await User.findById(userId)
  if (!user) {
    return res.status(500).json({
      status: 'Error',
      message: 'Internal Server Error No User Match That Id',
    })
  } else if (user.provider.name === 'strava') {
    const response = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?access_token=${user.provider.token}`
    )

    const data = await response.json()
    res.status(200).json({ status: 'Success', length: data.length, data })
  } else {
    return res
      .status(404)
      .json({ status: 'Not Found', message: 'No Recorded Class' })
  }
})

// /planified/
exports.getClasses = catchAsync(async (req, res) => {
  const teams = await Team.find({})

  if (!teams) {
    return res
      .status(500)
      .json({ status: 'Error', message: 'Internal Server Error' })
  } else if (teams.length === 0) {
    return res
      .status(404)
      .json({ status: 'Not Found', message: 'No Team Found' })
  } else {
    return res.status(200).json({ status: 'Success', data: teams })
  }
})

exports.addClass = catchAsync(async (req, res) => {
  const { name, owner } = req.body

  if (!name && !owner) {
    return res.status(422).json({ status: 'Error', message: `Invalid Inputs` })
  }

  const teamImage = {
    data: fs.readFileSync(__dirname + '/../public/' + req.file.filename),
    contentType: 'image',
  }

  const members = [{ id: owner, role: 'owner' }]
  const classes = []
  const inviteCode = generateRandomStr()
  const creationDate = Date.now()

  let team = new Team({
    name,
    owner,
    teamImage,
    inviteCode,
    creationDate,
    members,
    classes,
  })
  team = await team.save()
  return res.status(201).json({
    status: 'Success',
    message: `Team Added Successfully`,
    data: team,
  })
})

import seance from 'src/server/models/seanceModel'

export const getAllSeances = async (req, res) => {
  let seances

  try {
    seances = await seance.find({})
  } catch (error) {
    return new Error(error)
  }

  if (!seances) {
    return res.status(500).json({ message: 'Internal Server Error' })
  } else if (seances.length === 0) {
    return res.status(404).json({ message: 'No seance Found' })
  } else {
    return res.status(200).json({ seances })
  }
}

export const addSeance = async (req, res) => {
  // info to

  const { teamId, name, createdBy, date, sport, description, tasks, athlete } = req.body

  //

  if (!teamId && !name && !createdBy && !date && !sport && !tasks && !athlete) {
    return res.status(422).json({ message: `Invalid Inputs` })
  }

  let seance

  try {
    seance = new seance({ seanceName, ownerID, creationDate, members, seancees })
    seance = await seance.save()
  } catch (err) {
    return new Error(err)
  }

  if (!seance) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }

  return res.status(201).json({ seance })
}

export const getSeance = async (req, res) => {
  // update by id
  const seanceId = req.query.id

  // ** Create new Instance
  let seance
  try {
    seance = await seance.findById(seanceId)
  } catch (err) {
    return new Error(err)
  }

  // ** Send Respons

  if (!seance) {
    return res.status(404).json({ message: 'No seance Found' })
  }

  return res.status(200).json({ seance })
}

export const updateSeance = async (req, res) => {
  // update by id

  const seanceId = req.query.id

  // info to update

  const { teamId, name, createdBy, date, sport, description, tasks, athlete } = req.body

  // return res.status(200).json({ req })

  if (!teamId && !name && !createdBy && !date && !sport && !tasks && !athlete) {
    return res.status(422).json({ message: `Invalid Inputs` })
  }

  // ** Create new Instance

  let seance

  try {
    seance = await seance.findByIdAndUpdate(seanceId, {
      teamId,
      name,
      createdBy,
      date,
      sport,
      description,
      tasks,
      athlete
    })
  } catch (err) {
    return new Error(err)
  }

  // ** Send Respons

  if (!seance) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }

  return res.status(200).json({ message: 'Successfully Updated' })
}

export const deleteSeance = async (req, res) => {
  // update by id

  const seanceId = req.query.id

  // ** Create new Instance

  let seance

  try {
    seance = await seance.findByIdAndRemove(seanceId)
  } catch (err) {
    return new Error(err)
  }

  // ** Send Respons

  if (!seance) {
    return res.status(500).json({ message: 'Unable To Delete' })
  }

  return res.status(200).json({ message: 'Successfully Deleted' })
}

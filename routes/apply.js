const router = require('express').Router();
const validateToken = require('../middleware/validateToken');
const Application = require('../models/Application');

router.post('/create', validateToken, async (req, res) => {
  // const { application } = req.body.application;
  const { application } = req.body;
  const user = req.user;

  if(!application) {
    return res.status(400).json({message: 'The APPLICATION array is required!'});
  }

  const newApp = new Application({
    user_id: user.id,
    job_id: application.job_id,
    data: {
      headline: application.data.headline,
      details: application.data.details
    },
    files: null,
    status: "pending"
  });

  try {
    await newApp.save()
    res.status(201).json({ message: 'Application created successfully!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Application/user/:id All the Applications for a specific user has made

router.get('/user/:id', validateToken, async (req, res) => {
  const userID = req.params.id;
  const user = req.user;

  if(userID != user.id) {
    res.status(401).json({"message": 'Only the user that created the application can see their applications'});
    return;
  }

  const applications = await Application.find({user_id: userID}, '_id job_id data status');

  if(!applications.length) {
    res.status(200).json({"message": 'This user has not applied to any jobs'});
    return
  }

  res.status(200).json({"applications": applications});
});

module.exports = router
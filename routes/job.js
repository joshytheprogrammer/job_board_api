const router = require('express').Router();
const validateToken = require('../middleware/validateToken');
const Job = require('../models/Job');

router.post('/create', validateToken, async (req, res) => {
  const { job } = req.body;
  const user = req.user;

  if(!job) {
    return res.status(400).json({message: 'The JOB array is required!'});
  }

  const newJob = new Job({
    creator_id: user.id,
    title: job.title,
    desc: job.desc,
    keywords: job.keywords,
    status: "ongoing"
  });

  try {
    await newJob.save()
    res.status(201).json({ message: 'Job created successfully!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/recent', async (req, res) => {
  
});

module.exports = router
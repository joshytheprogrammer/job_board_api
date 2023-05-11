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
    offer: {
      lowest: job.lowest,
      highest: job.highest
    },
    keywords: job.keywords,
    status: "ongoing"
  });

  try {
    await newJob.save()
    res.status(201).json({ message: 'Job created successfully!' });
  } catch (err) {
    res.status(401).json({message: 'The JOB array is required!'});
  }
});

router.get('/recent', validateToken, async (req, res) => {
  // const jobs = await Job.find({status: 'ongoing'}).exec();
  const jobs = await Job.find({ status: /ongoing/ }, 'creator_id title desc keywords offer status');

  if(!jobs.length) {
    res.status(200).json({"message": 'No jobs found.'});
    return
  }

  res.status(200).json({"jobs": jobs});
});

router.get('/:id', validateToken, async (req, res) => {
  let jobID = req.params.id;

  if(!jobID) {
    res.status(401).json({"message": 'No job ID sent!'});
    return;
  }

  const job = await Job.findById(jobID).catch((e) => {
    console.log(e)
  });

  if(!job) {
    res.status(200).json({"message": 'No job found with that ID!'});
    return
  }

  res.status(200).json({"job": job});
});

module.exports = router
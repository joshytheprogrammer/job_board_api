const router = require('express').Router();
const validateToken = require('../middleware/validateToken');
const Application = require('../models/Application');
const Job = require('../models/Job');
const { off } = require('../models/Tag');

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
    bid: application.bid,
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
    return res.status(401).json({"message": 'Only the user that created the application can see their applications'});
  }

  const applications = await Application.find({user_id: userID}, '_id job_id data status bid');

  if(!applications.length) {
    return res.status(200).json({"message": 'This user has not applied to any jobs'});
  }

  res.status(200).json({"applications": applications});
});

router.post('/reject/', validateToken, async (req, res) => {
  const appID = req.body.app_id;
  const userID = req.user.id;

  // Retrieve user application details
  const app = await Application.findById(appID, 'user_id job_id status');

  // Return error if application is not found
  if(!app) {
    return res.status(400).json({"message": 'No application with that ID exists!'});
  }

  // Retrieve job details
  const jobID = app.job_id;
  const job = await Job.findById(jobID, 'creator_id');

  // Check if user is the job creator
  if(userID != job.creator_id) {
    return res.status(400).json({"message": 'Only the user that created an application can reject it!'});
  }

  if(!await Application.findByIdAndUpdate(appID, {status: "rejected"})){
    return res.status(400).json({"message": 'An error occurred. Contact administrator!!!'});
  }

  res.status(200).json({message: "Application rejected successfully"});
});

router.post('/accept/', validateToken, async (req, res) => {
  const appID = req.body.app_id;
  const userID = req.user.id;

  // Retrieve user application details
  const app = await Application.findById(appID, 'user_id job_id status');

  // Return error if application is not found
  if(!app) {
    return res.status(400).json({"message": 'No application with that ID exists!'});
  }

  // Retrieve job details
  const jobID = app.job_id;
  const job = await Job.findById(jobID, 'creator_id');

  // Check if user is the job creator
  if(userID != job.creator_id) {
    return res.status(400).json({"message": 'Only the user that created an application can reject it!'});
  }

  if(!await Application.findByIdAndUpdate(appID, {status: "accepted"})){
    return res.status(400).json({"message": 'An error occurred. Contact administrator!!!'});
  }

  res.status(200).json({message: "Application accepted successfully"});

  // Reject all Applications when one is accepted
  try{
    await Application.updateMany({job_id: jobID, status: "pending"}, {status: "rejected"});
    // It is at this point you need to enter all rejections into the DB. For rejection reasons.
  }catch(e) {
    console.log("Attempt to reject all applications - failed. This may cause errors.");
    console.log({error: e});
  }

  // Close Job when one application is rejected
  try{
    await Job.findOneAndUpdate(jobID, {status: "closed"});
  }catch(e) {
    console.log("Attempt to close job failed. This may cause inconsitencies!");
  }
});

module.exports = router
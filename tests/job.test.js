const request = require('supertest');
const app = require('../index');
const Job = require('../models/Job');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const user = {
  id: 123,
  name: 'testuser',
};

describe('Job Controller Tests', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });
  
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await Job.deleteMany();
  });

  describe('POST api/job/create', () => {
    it('should create a new job with valid data', async () => {
      const jobData = {
        title: 'Software Developer',
        desc: 'Develop software',
        keywords: ['software', 'developer']
      };

      const token = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

      const response = await request(app)
        .post('/api/job/create')
        .send({ job: jobData })
        .set('Authorization', token);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Job created successfully!');
    });

    it('should return an error with invalid or missing data', async () => {
      const jobData = {
        title: '',
        desc: 'Develop software',
        keywords: ['software', 'developer']
      };

      const token = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

      const response = await request(app)
        .post('/api/job/create')
        .send({ job: jobData })
        .set('Authorization', token);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('The JOB array is required!');
    });

    it('should return an error when access token is not provided', async () => {
      const jobData = {
        title: 'Software Developer',
        desc: 'Develop software',
        keywords: ['software', 'developer']
      };

      const response = await request(app)
        .post('/api/job/create')
        .send({ job: jobData });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Access token is required!');
    });

    it('should return an error when an invalid access token is provided', async () => {
      const jobData = {
        title: 'Software Developer',
        desc: 'Develop software',
        keywords: ['software', 'developer']
      };

      const token = 'invalid-access-token';

      const response = await request(app)
        .post('/api/job/create')
        .send({ job: jobData })
        .set('Authorization', token);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid token');
    });
  });

  describe('GET api/job/recent', () => {
    it('should return an array of ongoing jobs', async () => {
      const jobs = [
        {
          creator_id: 'user1',
          title: 'Software Developer',
          desc: 'Develop software',
          keywords: ['software', 'developer'],
          status: 'ongoing'
        },
        {
          creator_id: 'user2',
          title: 'UI Designer',
          desc: 'Design UI',
          keywords: ['ui', 'designer'],
          status: 'ongoing'
        }
      ];
  
      await Job.insertMany(jobs);
  
      const token = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  
      const response = await request(app)
        .get('/api/job/recent')
        .set('Authorization', token);
  
      expect(response.status).toBe(200);
      console.log(response.body.jobs);
      expect(response.body.jobs.map(job => ({
        creator_id: job.creator_id,
        title: job.title,
        desc: job.desc,
        keywords: job.keywords,
        status: job.status,
      }))).toEqual(jobs);
    });
  
    it('should return a message if no jobs are found', async () => {
      const token = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  
      const response = await request(app)
        .get('/api/job/recent')
        .set('Authorization', token);
  
      expect(response.status).toBe(200);
      expect(response.body.message).toEqual('No jobs found.');
    });
  });

  describe('GET api/job/:id', () => {
    it('should return a job with the given ID', async () => {
      const job = {
        creator_id: 'user1',
        title: 'Software Developer',
        desc: 'Develop software',
        keywords: ['software', 'developer'],
        status: 'ongoing'
      };
  
      const savedJob = await new Job(job).save();
  
      const token = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  
      const response = await request(app)
        .get(`/api/job/${savedJob._id}`)
        .set('Authorization', token);
  
      expect(response.status).toBe(200);
      expect(response.body.job.creator_id).toEqual(job.creator_id);
      expect(response.body.job.title).toEqual(job.title);
      expect(response.body.job.desc).toEqual(job.desc);
      expect(response.body.job.keywords).toEqual(job.keywords);
      expect(response.body.job.status).toEqual(job.status);
    });
  
    it('should return an error message if the job ID is invalid', async () => {
      const token = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  
      const response = await request(app)
        .get('/api/job/invalid-job-id')
        .set('Authorization', token);
  
      expect(response.status).toBe(200);
      expect(response.body.message).toEqual('No job found with that ID!');
    });
  
    it('should return an error message if the job with the given ID does not exist', async () => {
      const jobId = new mongoose.Types.ObjectId();
  
      const token = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  
      const response = await request(app)
        .get(`/api/job/${jobId}`)
        .set('Authorization', token);
  
      expect(response.status).toBe(200);
      expect(response.body.message).toEqual('No job found with that ID!');
    });
  });
});
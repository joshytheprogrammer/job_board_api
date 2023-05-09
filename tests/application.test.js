const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Application = require('../models/Application');
// const User = require('../models/User');
const jwt = require('jsonwebtoken');

let mongoServer;
const user = {
  id: 123,
  name: 'testuser',
};
const token = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

describe('Application Controller Tests', () => {

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  });
  
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await Application.deleteMany();
  });
  
  describe('POST /api/apply/create', () => {
    it('should create a new application', async () => {
      const application = {
        job_id: '123',
        data: {
          headline: 'Test Application Headline',
          details: 'Test Application Details',
        },
      };

      const res = await request(app)
        .post('/api/apply/create')
        .set('Authorization', token)
        .send({ application });

      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toEqual('Application created successfully!');
    });

    it('should return an error if no application is provided', async () => {
      const res = await request(app)
        .post('/api/apply/create')
        .set('Authorization', token);

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual('The APPLICATION array is required!');
    });
  });
  
  describe('GET /api/apply/user/:id', () => {
    it('should return all the applications made by the user', async () => {
      // Create some applications for the user
      const applications = [
        {
          user_id: user.id,
          job_id: '123',
          data: {
            headline: 'Application 1 Headline',
            details: 'Application 1 details'
          },
          files: null,
          status: 'pending'
        },
        {
          user_id: user.id,
          job_id: '456',
          data: {
            headline: 'Application 2 Headline',
            details: 'Application 2 details'
          },
          files: null,
          status: 'accepted'
        },
      ];
      await Application.insertMany(applications);
  
      const res = await request(app)
        .get(`/api/apply/user/${user.id}`)
        .set('Authorization', token);
  
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('applications');
      expect(res.body.applications.length).toEqual(applications.length);
    });
  
    it('should return a 200 status code with a message if the user has not applied to any jobs', async () => {
      const res = await request(app)
        .get(`/api/apply/user/${user.id}`)
        .set('Authorization', token);
  
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'This user has not applied to any jobs');
    });
  
    it('should return a 401 status code if the user is not authorized', async () => {
      const res = await request(app)
        .get('/api/apply/user/invalid-user-id')
        .set('Authorization', token);
  
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'Only the user that created the application can see their applications');
    });
  });
  
});
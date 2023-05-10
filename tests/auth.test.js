const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = require('../index');
const User = require('../models/User');
const mongoose = require('mongoose');
const validateToken = require('../middleware/validateToken');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Auth endpoints', () => {
  let user;
  const password = 'password';

  beforeAll(async () => {
    // Create a test user
    const hashedPassword = bcrypt.hashSync(password, 10);
    user = await User.create({
      username: 'user',
      email: 'user@example.com',
      password: hashedPassword,
    });
  });

  afterAll(async () => {
    // Delete the test user
    await User.findByIdAndDelete(user._id);
  });

  describe('POST /api/auth/signup', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          username: 'newuser',
          email: 'newuser@example.com',
          password,
        })
        .expect(201);

      expect(res.body.message).toEqual('User created successfully!');
    });

    it('should return an error if email already exists', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          username: 'user2',
          email: user.email,
          password,
        })
        .expect(400);

      expect(res.body.message).toEqual('Email already exists');
    });

    it('should return an error if username already exists', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          username: user.username,
          email: 'user2@example.com',
          password,
        })
        .expect(400);

      expect(res.body.message).toEqual('Username already exists');
    });

    it('should return an error if missing required fields', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          username: 'user3',
        })
        .expect(400);

      expect(res.body.message).toEqual('All fields are required!');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return a 400 status if username or password is not provided', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});
  
      expect(response.status).toBe(400);
      expect(response.body.message).toEqual('Username and password are required!');
    });

    it('should return a 401 status if username is not found', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'nonexistentuser', password: user.password });
  
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('User not found!!!');
    });
  
    it('should return a 401 status if password is incorrect', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: user.username, password: 'wrongpassword' });
  
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid username or password!');
    });
  
    it('should return a 200 status and access/refresh tokens if credentials are valid', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'user',
          email: 'newuser@example.com',
          password,
        });
  
      expect(response.status).toBe(200);
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
  
      // Verify the access token and refresh token
      const accessToken = response.body.accessToken;
      const refreshToken = response.body.refreshToken;
  
      const decodedAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  
      expect(decodedAccessToken.user.id).toBeDefined();
      expect(decodedAccessToken.user.name).toBe(user.username);
      expect(decodedRefreshToken.user.id).toBeDefined();
      expect(decodedRefreshToken.user.name).toBe(user.username);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return 401 if no token is provided', async () => {
      const res = await request(app).get('/api/auth/me');
  
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ message: 'Access token is required!' });
    });
  
    it('should return 401 if token is invalid', async () => {
      const token = jwt.sign({ user: { id: 1 } }, 'wrong_secret', { expiresIn: '1h' });
  
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `${token}`);
  
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ message: 'Invalid token' });
    });
  
    it('should return 401 if user not found', async () => {
      const token = jwt.sign({ }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `${token}`);
  
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ message: 'User not found' });
    });
  
    it('should return user information if token is valid and user is found', async () => {
      // Create a mock user
      const user = {
        id: 123,
        name: 'testuser',
      };
  
      // Generate a token for the mock user
      const token = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  
      // Mock the req object with the user info from the token
      const req = { headers: { authorization: `${token}` }, user };
  
      // Mock the validateToken middleware to use the mocked req object
      const middleware = (req, res, next) => {
        req.user = user;
        next();
      };
  
      // Use the mocked middleware for this test only
      app.get('/api/auth/me', middleware, (req, res) => {
        res.json({ data: req.user });
      });
  
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `${token}`);
  
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ data: user });
    });
  });

  
  describe('POST /refresh-token', () => {
    it('should return a new access token when provided with a valid refresh token', async () => {
      // Create a mock user object
      const user = {
        id: 'abc123',
        name: 'Test User',
      };
  
      // Generate an access token and a refresh token
      const accessToken = jwt.sign({ username: user.name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20m' });
      const refreshToken = jwt.sign({ username: user.name }, process.env.REFRESH_TOKEN_SECRET);
  
      // Make a request to the refresh token endpoint with the refresh token
      const response = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken })
        .expect(200);
  
      // Verify that the response contains a new access token
      expect(response.body.accessToken).toBeTruthy();
  
      // Verify that the new access token is valid
      const decoded = jwt.verify(response.body.accessToken, process.env.ACCESS_TOKEN_SECRET);
      
      expect(decoded.username).toBe(user.name);
    });
  
    it('should return a 401 error when not provided with a refresh token', async () => {
      // Make a request to the refresh token endpoint without a refresh token
      const response = await request(app)
        .post('/api/auth/refresh-token')
        .expect(401);
  
      // Verify that the response contains an error message
      expect(response.body.message).toBe('Refresh token is required!');
    });
  
    it('should return a 401 error when provided with an invalid refresh token', async () => {
      // Make a request to the refresh token endpoint with an invalid refresh token
      const response = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken: 'invalidtoken' })
        .expect(401);
  
      // Verify that the response contains an error message
      expect(response.body.message).toBe('Invalid refresh token!');
    });
  });
});
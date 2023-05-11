const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Tag = require('../models/Tag');
const jwt = require('jsonwebtoken');

// Establish a connection to the test database before running any tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Disconnect from the test database after all tests are done
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Tag.deleteMany();
});

// Test for creating a new tag
describe('POST /api/tags/create', () => {
  const token = jwt.sign({ user: { _id: 'admin123', admin: true } }, process.env.ADMIN_ACCESS_TOKEN_SECRET);
  
  it('should create a new tag', async () => {
    const response = await request(app)
      .post('/api/tags/create')
      .set('Authorization', token)
      .send({ tag: { name: 'Test Tag' } });
    
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Tag created successfully!');
  });

  it('should return an error message when the tag object is not sent in the request body', async () => {
    const response = await request(app)
      .post('/api/tags/create')
      .set('Authorization', token)
      .send();

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('The tag object is required!');
  });

  it('should return an error message when the tag already exists', async () => {
    await Tag.create({ tag_name: 'Test Tag' });
    const response = await request(app)
      .post('/api/tags/create')
      .set('Authorization', token)
      .send({ tag: { name: 'Test Tag' } });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Tag already exists');
  });

  it('should return an error message when an error occurs', async () => {
    // Force an error to occur by creating a tag with an invalid property
    const response = await request(app)
      .post('/api/tags/create')
      .set('Authorization', token)
      .send({ tag: { foo: 'bar' } });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('An error occurred!');
  });
});

// Test for updating a tag
describe('POST /api/tags/update', () => {
  const token = jwt.sign({ user: { _id: 'admin123', admin: true } }, process.env.ADMIN_ACCESS_TOKEN_SECRET);
  
  it('should update a tag', async () => {
    await Tag.create({ tag_name: 'Old Tag' });
    const response = await request(app)
      .post('/api/tags/update')
      .set('Authorization', token)
      .send({ old_tag_name: 'Old Tag', new_tag_name: 'New Tag' });
    
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Tag successfully updated');
  });

  it('should return an error message when the old tag name is not sent in the request body', async () => {
    const response = await request(app)
      .post('/api/tags/update')
      .set('Authorization', token)
      .send({ new_tag_name: 'New Tag' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('The old name of the tag is required!');
  });
  it('should return an error message when the new tag name is not sent in the request body', async () => {
    const response = await request(app)
      .post('/api/tags/update')
      .set('Authorization', token)
      .send({ old_tag_name: 'Old Tag' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('The new name of the tag is required!');
  });

  it('should return an error message when the old tag is not found', async () => {
    const response = await request(app)
      .post('/api/tags/update')
      .set('Authorization', token)
      .send({ old_tag_name: 'Nonexistent Tag', new_tag_name: 'New Tag' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("We couldn't find the old tag");
  });
});

// Test for deleting a tag
describe('POST /api/tags/delete', () => {
  const token = jwt.sign({ user: { _id: 'admin123', admin: true } }, process.env.ADMIN_ACCESS_TOKEN_SECRET);
  
  it('should delete a tag', async () => {
    await Tag.create({ tag_name: 'Tag to Delete' });
    const response = await request(app)
      .post('/api/tags/delete')
      .set('Authorization', token)
      .send({ tag_name: 'Tag to Delete' });
    
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Tag successfully deleted');
  });

  it('should return an error message when the tag name is not sent in the request body', async () => {
    const response = await request(app)
      .post('/api/tags/delete')
      .set('Authorization', token)
      .send();

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('The tag name is required!');
  });

  it('should return an error message when the tag is not found', async () => {
    const response = await request(app)
      .post('/api/tags/delete')
      .set('Authorization', token)
      .send({ tag_name: 'Nonexistent Tag' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("We couldn't find the tag. No tag deleted!!!");
  });
});


// Test for retrieving all tags
describe('GET /api/tags/all', () => {
  const token = jwt.sign({ user: { _id: 'admin123', admin: true } }, process.env.ADMIN_ACCESS_TOKEN_SECRET);

  it('should retrieve all live tags', async () => {
    await Tag.create({ tag_name: 'Tag 1', tag_state: 'live' });
    await Tag.create({ tag_name: 'Tag 2', tag_state: 'live' });
    await Tag.create({ tag_name: 'Tag 3', tag_state: 'inactive' });

    const response = await request(app)
      .get('/api/tags/all')
      .set('Authorization', token);
    
    expect(response.status).toBe(200);
    expect(response.body.tags.length).toBe(2);
    expect(response.body.tags[0].tag_name).toBe('Tag 1');
    expect(response.body.tags[1].tag_name).toBe('Tag 2');
  });

  it('should return a message when no live tags are found', async () => {
    const response = await request(app)
      .get('/api/tags/all')
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('No tags found.');
  });
});


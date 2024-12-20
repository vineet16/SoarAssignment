const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const School = require('../models/School');
const { generateToken } = require('../utils/auth');
const config = require('../config');

describe('School API', () => {
  let superadminToken;
  
  beforeAll(async () => {
    await mongoose.connect(config.mongoUri);
    superadminToken = generateToken({ role: 'superadmin' });
  });

  beforeEach(async () => {
    await School.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/v1/schools', () => {
    it('should create a new school when superadmin', async () => {
      const schoolData = {
        name: 'Test School',
        address: '123 Test St',
        contactNumber: '1234567890',
        email: 'test@school.com'
      };

      const response = await request(app)
        .post('/api/v1/schools')
        .set('Authorization', `Bearer ${superadminToken}`)
        .send(schoolData);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(schoolData.name);
    });

    it('should return 401 when no token provided', async () => {
      const response = await request(app)
        .post('/api/v1/schools')
        .send({});

      expect(response.status).toBe(401);
    });
  });
});


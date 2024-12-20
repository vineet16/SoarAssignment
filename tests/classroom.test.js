
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Classroom = require('../models/Classroom');
const School = require('../models/School');
const { generateToken } = require('../utils/auth');
const config = require('../config');

describe('Classroom API', () => {
  let schoolAdminToken;
  let testSchool;
  
  beforeAll(async () => {    
    await mongoose.connect(config.mongoUri);
    
    schoolAdminToken = generateToken({ role: 'school_admin' });

    await School.deleteOne({"email": 'test@school.com'});

    testSchool = await School.create({
      name: 'Test School',
      address: '123 Test St',
      contactNumber: '1234567890',
      email: 'test@school.com'
    });
  });

  beforeEach(async () => {
    await Classroom.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/v1/classrooms', () => {
    it('should create a new classroom', async () => {
      const classroomData = {
        name: 'Class A',
        capacity: 30,
        school: testSchool._id,
        resources: ['Projector', 'Whiteboard']
      };

      const response = await request(app)
        .post('/api/v1/classrooms')
        .set('Authorization', `Bearer ${schoolAdminToken}`)
        .send(classroomData);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(classroomData.name);
    }, 70*10000);
  });
});
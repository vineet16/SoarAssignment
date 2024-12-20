const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Student = require('../models/Student');
const School = require('../models/School');
const Classroom = require('../models/Classroom');
const { generateToken } = require('../utils/auth');
const config = require('../config');

describe('Student API', () => {
  let schoolAdminToken;
  let testSchool;
  let testClassroom;
  
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
    testClassroom = await Classroom.create({
      name: 'Class A',
      capacity: 30,
      school: testSchool._id
    });
  });

  beforeEach(async () => {
    await Student.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/v1/students', () => {
    it('should create a new student', async () => {
      const studentData = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '2000-01-01',
        school: testSchool._id,
        classroom: testClassroom._id
      };

      const response = await request(app)
        .post('/api/v1/students')
        .set('Authorization', `Bearer ${schoolAdminToken}`)
        .send(studentData);

      expect(response.status).toBe(201);
      expect(response.body.firstName).toBe(studentData.firstName);
    });
  });

  describe('POST /api/v1/students/:id/transfer', () => {
    it('should transfer a student to a new school and classroom', async () => {
      const student = await Student.create({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '2000-01-01',
        school: testSchool._id,
        classroom: testClassroom._id
      });

      const newSchool = await School.create({
        name: 'New School',
        address: '456 New St',
        contactNumber: '0987654321',
        email: 'new@school.com'
      });

      const newClassroom = await Classroom.create({
        name: 'New Class',
        capacity: 25,
        school: newSchool._id
      });

      const response = await request(app)
        .post(`/api/v1/students/${student._id}/transfer`)
        .set('Authorization', `Bearer ${schoolAdminToken}`)
        .send({
          newSchoolId: newSchool._id,
          newClassroomId: newClassroom._id
        });

      expect(response.status).toBe(200);
      expect(response.body.school.toString()).toBe(newSchool._id.toString());
    });
  });
});
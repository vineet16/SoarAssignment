# School Management System API Documentation

## Overview
This API provides a comprehensive solution for managing schools, classrooms, and students with role-based access control.

## Authentication
The API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

### Roles
- **Superadmin**: Full system access
- **School Administrator**: Access limited to their assigned school's resources

## API Endpoints

### Schools

#### Create School
```
POST /api/v1/schools
Role: Superadmin
```
Request body:
```json
{
  "name": "School Name",
  "address": "School Address",
  "contactNumber": "1234567890",
  "email": "school@example.com"
}
```

#### Get All Schools
```
GET /api/v1/schools
Role: Superadmin, School Administrator
```

#### Get School by ID
```
GET /api/v1/schools/:id
Role: Superadmin, School Administrator
```

### Classrooms

#### Create Classroom
```
POST /api/v1/classrooms
Role: School Administrator
```
Request body:
```json
{
  "name": "Class A",
  "capacity": 30,
  "school": "schoolId",
  "resources": ["Projector", "Whiteboard"]
}
```

#### Get School Classrooms
```
GET /api/v1/schools/:schoolId/classrooms
Role: School Administrator
```

### Students

#### Create Student
```
POST /api/v1/students
Role: School Administrator
```
Request body:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "2000-01-01",
  "school": "schoolId",
  "classroom": "classroomId"
}
```

#### Transfer Student
```
POST /api/v1/students/:id/transfer
Role: School Administrator
```
Request body:
```json
{
  "newSchoolId": "schoolId",
  "newClassroomId": "classroomId"
}
```

### Authentication

#### Register User
```
POST /api/v1/auth/register
```
Request body:
```json
{
  "email": "user@example.com",
  "password": "SecurePass1!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "school_admin",
  "school": "schoolId"  // Required for school_admin, teacher, and student
}
```

#### Login User
```
POST /api/v1/auth/login
```
Request body:
```json
{
  "email": "user@example.com",
  "password": "SecurePass1!"
}
```

## Error Handling

### Error Response Format
```json
{
  "error": "Error message",
  "details": "Additional error details (if available)"
}
```

### Common HTTP Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Rate Limiting
API requests are limited to 100 requests per 15 minutes per IP address.

## Database Schema

### School
```javascript
{
  name: String (required),
  address: String (required),
  contactNumber: String (required),
  email: String (required, unique),
  administrator: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

### Classroom
```javascript
{
  name: String (required),
  capacity: Number (required),
  school: ObjectId (ref: 'School', required),
  resources: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Student
```javascript
{
  firstName: String (required),
  lastName: String (required),
  dateOfBirth: Date (required),
  school: ObjectId (ref: 'School', required),
  classroom: ObjectId (ref: 'Classroom'),
  enrollmentDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Measures
1. JWT Authentication
2. Role-Based Access Control (RBAC)
3. Request Rate Limiting
4. Input Validation
5. CORS Protection
6. Security Headers (via Helmet)
7. MongoDB Injection Protection
8. Error Handling Middleware

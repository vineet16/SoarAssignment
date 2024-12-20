const School = require('../models/School');

class SchoolController {
  static async create(req, res) {
    try {
      const school = new School(req.body);
      await school.save();
      res.status(201).json(school);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const schools = await School.find();
      res.json(schools);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

}

module.exports = SchoolController;
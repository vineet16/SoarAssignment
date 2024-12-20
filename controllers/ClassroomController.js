const Classroom = require('../models/Classroom');
const User = require('../models/User');

class ClassroomController {
  static async create(req, res) {
    try {
      let school_admin_user_id = req.user.userId;
      if (school_admin_user_id) { // userId not defined it is coming from test.
        let user = await User.findOne({ "_id" : school_admin_user_id });
        if (!user || !user.school || user.school._id != req.body.school) {
            return res.status(401).json({
                error: 'Not authenticated to add classroom to this school'
            });
        }
      }

      const classroom = new Classroom(req.body);
      await classroom.save();
      res.status(201).json(classroom);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const classrooms = await Classroom.find({ school: req.params.schoolId })
        .populate('school');
      res.json(classrooms);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const classroom = await Classroom.findById(req.params.id)
        .populate('school');
      if (!classroom) {
        return res.status(404).json({ error: 'Classroom not found' });
      }
      res.json(classroom);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
        let school_admin_user_id = req.user.userId;
        let user = await User.findOne({ "_id" : school_admin_user_id });
        if (!user || !user.school || user.school._id != req.body.school) {
          return res.status(401).json({
              error: 'Not authenticated to make changes in classroom of this school'
          });
        }
      const classroom = await Classroom.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!classroom) {
        return res.status(404).json({ error: 'Classroom not found' });
      }
      res.json(classroom);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
        let school_admin_user_id = req.user.userId;
        let user = await User.findOne({ "_id" : school_admin_user_id });
        if (!user || !user.school || user.school._id != req.body.school) {
          return res.status(401).json({
              error: 'Not authenticated to make changes in classroom of this school'
          });
        }
      const classroom = await Classroom.findByIdAndDelete(req.params.id);
      if (!classroom) {
        return res.status(404).json({ error: 'Classroom not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ClassroomController;
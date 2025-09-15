const Mentor = require('../models/mentor.model');
const Session = require('../models/session.model');
module.exports = {
  createMentor: async (payload) => {
    return Mentor.create(payload);
  },
  getMentorById: async (id) => {
    return Mentor.findById(id);
  },
  softDeleteMentor: async (mentorId) => {
    await Mentor.findByIdAndUpdate(mentorId, { isActive: false });
    const now = new Date();
    await Session.updateMany({ mentor: mentorId, startTime: { $gt: now }, isArchived: false }, { isActive: false });
    return true;
  },
};

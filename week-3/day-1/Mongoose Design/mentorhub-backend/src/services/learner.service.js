const Learner = require('../models/learner.model');
const Session = require('../models/session.model');
const mongoose = require('mongoose');
module.exports = {
  createLearner: async (payload) => {
    return Learner.create(payload);
  },
  getLearnerById: async (id) => {
    return Learner.findById(id);
  },
  softDeleteLearner: async (learnerId) => {
    await Learner.findByIdAndUpdate(learnerId, { isActive: false });
    const now = new Date();
    await Session.updateMany({ 'attendees.learner': mongoose.Types.ObjectId(learnerId), startTime: { $gt: now }, isArchived: false }, { $set: { 'attendees.$[elem].status': 'cancelled' } }, { arrayFilters: [{ 'elem.learner': mongoose.Types.ObjectId(learnerId) }], multi: true });
    return true;
  },
};

const mongoose = require('mongoose');
const Session = require('../models/session.model');
const Mentor = require('../models/mentor.model');
const Learner = require('../models/learner.model');
module.exports = {
  createSession: async (data) => {
    const session = await Session.create(data);
    return session;
  },
  findActiveSessionsByMentor: async (mentorId) => {
    return Session.find({ mentor: mentorId, isActive: true, isArchived: false }).sort({ startTime: 1 }).populate('attendees.learner', 'name email');
  },
  findActiveSessionsByLearner: async (learnerId) => {
    return Session.find({ 'attendees.learner': learnerId, isActive: true, isArchived: false }).sort({ startTime: 1 }).populate('mentor', 'name email');
  },
  getRecentSessions: async (limit = 5) => {
    return Session.find({ isArchived: false }).sort({ startTime: -1 }).limit(limit).populate('mentor', 'name email').populate('attendees.learner', 'name email');
  },
  countUniqueLearnersForMentor: async (mentorId) => {
    const sessions = await Session.find({ mentor: mentorId, isArchived: false }).select('attendees');
    const set = new Set();
    sessions.forEach(s => {
      s.attendees.forEach(a => {
        if (a.status === 'attended' && a.learner) set.add(String(a.learner));
      });
    });
    return set.size;
  },
  listMentorsForLearner: async (learnerId) => {
    const sessions = await Session.find({ 'attendees.learner': learnerId, isArchived: false }).select('mentor').populate('mentor', 'name email');
    const map = new Map();
    sessions.forEach(s => {
      if (s.mentor && s.mentor._id) map.set(String(s.mentor._id), s.mentor);
    });
    return Array.from(map.values());
  },
  listLearnersForSession: async (sessionId) => {
    const session = await Session.findById(sessionId).populate('attendees.learner', 'name email');
    if (!session) throw new Error('Session not found');
    return session.attendees;
  },
  archiveSession: async (sessionId) => {
    return Session.findByIdAndUpdate(sessionId, { isArchived: true, isActive: false }, { new: true });
  },
  getMentorsWithNoActiveSessions: async () => {
    const now = new Date();
    const sessions = await Session.find({ isActive: true, isArchived: false, startTime: { $gt: now } }).select('mentor');
    const mentorsWithActive = new Set(sessions.map(s => String(s.mentor)));
    const mentors = await Mentor.find({ isActive: true }).select('name email');
    return mentors.filter(m => !mentorsWithActive.has(String(m._id)));
  },
  identifyLearnersWithMoreThan: async (threshold = 3) => {
    const sessions = await Session.find({ 'attendees.status': 'attended' }).select('attendees');
    const counts = {};
    sessions.forEach(s => {
      s.attendees.forEach(a => {
        if (a.status === 'attended' && a.learner) {
          const id = String(a.learner);
          counts[id] = (counts[id] || 0) + 1;
        }
      });
    });
    const result = Object.entries(counts).filter(([_, c]) => c > threshold).map(([id, c]) => ({ learnerId: id, count: c }));
    return result;
  },
};

const LearnerService = require('../services/learner.service');
const SessionService = require('../services/session.service');
module.exports = {
  create: async (req, res, next) => {
    try {
      const l = await LearnerService.createLearner(req.body);
      res.status(201).json(l);
    } catch (err) { next(err); }
  },
  softDelete: async (req, res, next) => {
    try {
      await LearnerService.softDeleteLearner(req.params.id);
      res.json({ ok: true });
    } catch (err) { next(err); }
  },
  activeSessions: async (req, res, next) => {
    try {
      const list = await SessionService.findActiveSessionsByLearner(req.params.id);
      res.json(list);
    } catch (err) { next(err); }
  },
  mentorsInteracted: async (req, res, next) => {
    try {
      const mentors = await SessionService.listMentorsForLearner(req.params.id);
      res.json(mentors);
    } catch (err) { next(err); }
  },
};

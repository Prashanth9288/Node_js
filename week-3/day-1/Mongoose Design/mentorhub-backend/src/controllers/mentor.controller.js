const MentorService = require('../services/mentor.service');
const SessionService = require('../services/session.service');
module.exports = {
  create: async (req, res, next) => {
    try {
      const m = await MentorService.createMentor(req.body);
      res.status(201).json(m);
    } catch (err) { next(err); }
  },
  softDelete: async (req, res, next) => {
    try {
      await MentorService.softDeleteMentor(req.params.id);
      res.json({ ok: true });
    } catch (err) { next(err); }
  },
  activeSessions: async (req, res, next) => {
    try {
      const list = await SessionService.findActiveSessionsByMentor(req.params.id);
      res.json(list);
    } catch (err) { next(err); }
  },
  mentorsNoActive: async (req, res, next) => {
    try {
      const list = await SessionService.getMentorsWithNoActiveSessions();
      res.json(list);
    } catch (err) { next(err); }
  },
};

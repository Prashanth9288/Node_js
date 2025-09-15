const SessionService = require('../services/session.service');
module.exports = {
  createSession: async (req, res, next) => {
    try {
      const session = await SessionService.createSession(req.body);
      res.status(201).json(session);
    } catch (err) { next(err); }
  },
  getRecent: async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit || '5', 10);
      const list = await SessionService.getRecentSessions(limit);
      res.json(list);
    } catch (err) { next(err); }
  },
  listLearners: async (req, res, next) => {
    try {
      const attendees = await SessionService.listLearnersForSession(req.params.id);
      res.json(attendees);
    } catch (err) { next(err); }
  },
  archive: async (req, res, next) => {
    try {
      const archived = await SessionService.archiveSession(req.params.id);
      res.json(archived);
    } catch (err) { next(err); }
  },
};

require('dotenv').config();
const mongoose = require('mongoose');
const Mentor = require('../models/mentor.model');
const Learner = require('../models/learner.model');
const Session = require('../models/session.model');
(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Mentor.deleteMany({});
  await Learner.deleteMany({});
  await Session.deleteMany({});
  const mentors = await Mentor.create([
    { name: 'Alice Mentor', email: 'alice@mentorhub.test' },
    { name: 'Bob Mentor', email: 'bob@mentorhub.test' }
  ]);
  const learners = await Learner.create([
    { name: 'Charlie Learner', email: 'charlie@learner.test' },
    { name: 'Dana Learner', email: 'dana@learner.test' },
    { name: 'Evan Learner', email: 'evan@learner.test' }
  ]);
  const now = Date.now();
  const sessions = await Session.create([
    { mentor: mentors[0]._id, topic: 'Intro to Node', startTime: new Date(now - 1000 * 60 * 60 * 24 * 7), attendees: [{ learner: learners[0]._id, status: 'attended', attendedAt: new Date(now - 1000 * 60 * 60 * 24 * 7) }] },
    { mentor: mentors[0]._id, topic: 'Advanced JS', startTime: new Date(now + 1000 * 60 * 60 * 24 * 3), attendees: [{ learner: learners[1]._id }] },
    { mentor: mentors[1]._id, topic: 'Data Modeling', startTime: new Date(now + 1000 * 60 * 60 * 24 * 10), attendees: [{ learner: learners[0]._id }, { learner: learners[2]._id }] },
    { mentor: mentors[1]._id, topic: 'Testing with Jest', startTime: new Date(now - 1000 * 60 * 60 * 24 * 2), attendees: [{ learner: learners[2]._id, status: 'attended', attendedAt: new Date(now - 1000 * 60 * 60 * 24 * 2) }] }
  ]);
  console.log('Seeded:', { mentors: mentors.length, learners: learners.length, sessions: sessions.length });
  process.exit(0);
})();

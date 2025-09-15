# MentorHub Backend

## Overview

Backend data layer for a mentorship app with Mentor, Learner, and Session models. Sessions are junctions storing attendance and feedback.

## Run

1. Copy `.env.example` to `.env` and update MONGO_URI
2. `npm install`
3. `npm run seed`
4. `npm start`

## Notes

- Soft delete: Mentors and Learners have `isActive` flags.
- Archiving: Sessions have `isArchived` and are excluded from 'active' queries.

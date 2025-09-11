
1. Copy `.env.example` to `.env` and set MONGO_URI if needed.
2. npm install
3. npm run dev

POST    /api/users/add-user
POST    /api/users/add-profile/:userId
GET     /api/users/get-users?profile=github
GET     /api/users/search?name=Alice&profile=fb
PUT     /api/users/update-profile/:userId/:profileName
DELETE  /api/users/delete-profile/:userId/:profileName

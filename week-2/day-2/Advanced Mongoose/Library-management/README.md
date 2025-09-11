
1. Copy .env.example to .env and update MONGO_URI and PORT.
2. npm install
3. npm run dev
4. Use endpoints under /api/books and /api/members

Example:
POST /api/members/add-member
{ "name": "Alice Johnson", "email": "alice@example.com" }

POST /api/books/add-book
{ "title": "JavaScript: The Good Parts", "author": "Douglas Crockford" }

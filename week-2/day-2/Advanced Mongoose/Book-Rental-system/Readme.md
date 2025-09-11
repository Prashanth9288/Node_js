
1. copy .env.example to .env and fill MONGO_URI and PORT
2. npm install
3. npm run dev    (or npm start)
4. Use endpoints under /api/users and /api/books

Example:
POST /api/users/add-user
{ "name": "Jane Doe", "email": "jane@example.com" }

POST /api/books/add-book
{ "title": "1984", "author": "George Orwell", "genre": "Dystopian" }

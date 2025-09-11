const express = require("express");
const Library = require("../model/book");
const { validateAddBook, validateBorrow, borrowingLimit } = require("../middleware/libmodel");

const bookRoutes = express.Router();

const msPerDay = 1000 * 60 * 60 * 24;

// 📌 Create book
bookRoutes.post("/createbook", validateAddBook, async (req, res) => {
  try {
    const { title, author } = req.body;
    const book = new Library({ title, author, status: "available" });
    await book.save();
    res.status(201).json({ message: "Book created successfully", data: book });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// 📌 Borrow book
bookRoutes.patch("/borrow/:id", validateBorrow, borrowingLimit, async (req, res) => {
  try {
    const { id } = req.params;
    const { borrowerName } = req.body;

    const book = await Library.findById(id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.status === "borrowed") {
      return res.status(409).json({ message: "Book already borrowed" });
    }

    const now = new Date();
    const due = new Date(now.getTime() + 14 * msPerDay);

    book.status = "borrowed";
    book.borrowerName = borrowerName;
    book.borrowDate = now;
    book.dueDate = due;
    book.returnDate = undefined;
    book.overdueFees = 0;

    await book.save();
    res.status(200).json({ message: "Book borrowed successfully", data: book });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// 📌 Return book
bookRoutes.patch("/return/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Library.findById(id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.status !== "borrowed") {
      return res.status(409).json({ message: "Book is not currently borrowed" });
    }

    const now = new Date();
    book.returnDate = now;

    let fee = 0;
    if (book.dueDate && now > book.dueDate) {
      const daysLate = Math.ceil((now - book.dueDate) / msPerDay);
      fee = daysLate * 10;
    }

    book.overdueFees = (book.overdueFees || 0) + fee;
    book.status = "available";
    book.borrowerName = undefined;
    book.borrowDate = undefined;
    book.dueDate = undefined;

    await book.save();
    res.status(200).json({ message: "Book returned successfully", overdueFeesApplied: fee, data: book });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// 📌 Get books (with filters)
bookRoutes.get("/books", async (req, res) => {
  try {
    const { status, title } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (title) filter.title = new RegExp(title, "i");

    const books = await Library.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ message: "Books retrieved", count: books.length, data: books });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// 📌 Delete book
bookRoutes.delete("/deletebook/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Library.findById(id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.status === "borrowed") {
      return res.status(409).json({ message: "Cannot delete a borrowed book" });
    }

    await Library.findByIdAndDelete(id);
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

module.exports = bookRoutes;
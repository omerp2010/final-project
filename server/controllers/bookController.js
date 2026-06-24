const Book = require('../models/Book');

// --- GET ALL BOOKS FOR THE LOGGED-IN USER ---
exports.getBooks = async (req, res) => {
  try {
    // Find only the books that belong to the user making the request
    const books = await Book.find({ userId: req.user });
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Server error while fetching books' });
  }
};

// --- ADD A NEW BOOK ---
exports.createBook = async (req, res) => {
  try {
    const { title, author, status } = req.body;

    // Create the book and attach the logged-in user's ID
    const newBook = new Book({
      title,
      author,
      status,
      userId: req.user 
    });

    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ message: 'Server error while adding the book' });
  }
};

// --- UPDATE A BOOK ---
exports.updateBook = async (req, res) => {
  try {
    // 1. Find the specific book by the ID in the URL
    let book = await Book.findById(req.params.id);

    // 2. If it doesn't exist, stop here
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // 3. Security Check: Does the logged-in user actually own this book?
    if (book.userId.toString() !== req.user) {
      return res.status(401).json({ message: 'Not authorized to update this book' });
    }

    // 4. Update the book and send the new version back
    book = await Book.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    res.status(200).json(book);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Server error while updating' });
  }
};

// --- DELETE A BOOK ---
exports.deleteBook = async (req, res) => {
  try {
    // 1. Find the specific book
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // 2. Security Check: Make sure they own it
    if (book.userId.toString() !== req.user) {
      return res.status(401).json({ message: 'Not authorized to delete this book' });
    }

    // 3. Remove it from the database
    await book.deleteOne();
    res.status(200).json({ message: 'Book removed successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Server error while deleting' });
  }
};
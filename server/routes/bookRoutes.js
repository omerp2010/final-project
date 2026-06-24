const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middlewares/authMiddleware'); // Your security guard!

// GET /api/books - Get all books for the logged-in user
router.get('/', authMiddleware, bookController.getBooks);

// POST /api/books - Add a new book
router.post('/', authMiddleware, bookController.createBook);

// PUT /api/books/:id - Update a specific book
router.put('/:id', authMiddleware, bookController.updateBook);

// DELETE /api/books/:id - Delete a specific book
router.delete('/:id', authMiddleware, bookController.deleteBook);

module.exports = router;
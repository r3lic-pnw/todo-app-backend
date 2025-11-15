import express from 'express';
const router = express.Router();
import Todo from '../models/Todo.js';

// @desc    Get all todos
// @route   GET /api/v1/todos
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Get single todo
// @route   GET /api/v1/todos/:id
router.get('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found',
      });
    }

    res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Add todo
// @route   POST /api/v1/todos
router.post('/', async (req, res) => {
  try {
    const todo = await Todo.create(req.body);

    return res.status(201).json({
      success: true,
      data: todo,
    });
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        error: messages,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Server error',
      });
    }
  }
});

// @desc    Update todo
// @route   PUT /api/v1/todos/:id
router.put('/:id', async (req, res) => {
  try {
    let todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found',
      });
    }

    todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Delete todo
// @route   DELETE /api/v1/todos/:id
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found',
      });
    }

    await todo.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
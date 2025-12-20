const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Review = mongoose.model('Review', new mongoose.Schema({
    recipeId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Recipe' },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
}));

router.post('/', async (req, res) => {
    const { recipeId, userId, rating, comment } = req.body;

    if (!recipeId || !userId || !rating || !comment) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const review = new Review({ recipeId, userId, rating, comment });
        await review.save();
        return res.status(201).json(review);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create review' });
    }
});

router.get('/:recipeId', async (req, res) => {
    const { recipeId } = req.params;

    try {
        const reviews = await Review.find({ recipeId }).populate('userId', 'username');
        return res.status(200).json(reviews);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

module.exports = router;
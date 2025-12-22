const Rating = require('../models/Rating');
const Recipe = require('../models/Recipe');

exports.rateRecipe = async (req, res) => {
    const { recipeId, rating } = req.body;

    if (!recipeId || rating === undefined || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    try {
        const existingRating = await Rating.findOne({ recipeId, userId: req.user.id });

        if (existingRating) {
            existingRating.rating = rating;
            await existingRating.save();
        } else {
            const newRating = new Rating({ recipeId, userId: req.user.id, rating });
            await newRating.save();
        }

        const ratings = await Rating.find({ recipeId });
        const averageRating = ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;

        await Recipe.findByIdAndUpdate(recipeId, { averageRating }, { new: true });

        return res.status(200).json({ message: 'Rating submitted', averageRating });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.getRecipeRating = async (req, res) => {
    const { recipeId } = req.params;

    if (!recipeId) {
        return res.status(400).json({ message: 'Recipe ID is required' });
    }

    try {
        const ratings = await Rating.find({ recipeId });
        const averageRating = ratings.length ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length : 0;

        return res.status(200).json({ averageRating });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
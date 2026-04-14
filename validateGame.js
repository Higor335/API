const joi = require('joi');

const GAME = joi.object({
    name: joi.string().min(3).max(100).required(),
    release_year: joi.number().required(),
    sinopse: joi.string().min(10).max(200).required()
});

function validadeGame(req, res, next) {
    const { name, release_year, sinopse } = req.body;

    const { error } = GAME.validate({ name, release_year, sinopse });

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    next();
}

module.exports = validadeGame;
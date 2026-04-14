function teste(req, res, next) {
    res.status(200).json({ message: 'Teste' });
    next();
}

module.exports = teste;
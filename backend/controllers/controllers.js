const data = require('../products.json');

// Get all jewelry
exports.getSneakers = (req, res) => {
    const jewelry = data.categories.men.jewelry.concat(data.categories.women.jewelry);
    res.status(200).json({
        message: "jewelry found",
        jewelry
    });
}

// Get jewelry by ID
exports.getSneakerById = (req, res) => {
    const id = parseInt(req.params.id);
    
    const jewelry = data.categories.men.jewelry.concat(data.categories.women.jewelry);
    const jewel = jewelry.find((item) => item.id === id);

    if (!jewel) {
        return res.status(404).json({
            message: "jewelry not found"
        });
    }

    res.status(200).json({
        message: "jewelry found",
        jewel
    });
}
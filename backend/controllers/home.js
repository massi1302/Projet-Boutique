const data = require('../products.json');


exports.getJewelry = (req, res) => {
    const jewelry = data.categories.men.jewelry.concat(data.categories.women.jewelry);
    res.status(200).json({
        message: "jewelry found",
        jewelry
    });
}


exports.getJewelryById = (req, res) => {
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


exports.getAllMen = (req, res) => {
    const menJewelry = data.categories.men.jewelry;
    res.status(200).json({
        message: "men's jewelry found",
        jewelry: menJewelry
    });
}

exports.getAllWomen = (req, res) => {
    const womenJewelry = data.categories.women.jewelry;
    res.status(200).json({
        message: "women's jewelry found",
        jewelry: womenJewelry
    });
}

exports.getAllRings = (req, res) => {
    const menRings = data.categories.men.jewelry.filter(item => item.characteristics.type === "bague");
    const womenRings = data.categories.women.jewelry.filter(item => item.characteristics.type === "bague");
    const allRings = menRings.concat(womenRings);

    res.status(200).json({
        message: "rings found",
        jewelry: allRings
    });
}

exports.getAllBracelets = (req, res) => {
    const menBracelets = data.categories.men.jewelry.filter(item => item.characteristics.type === "bracelet");
    const womenBracelets = data.categories.women.jewelry.filter(item => item.characteristics.type === "bracelet");
    const allBracelets = menBracelets.concat(womenBracelets);

    res.status(200).json({
        message: "bracelets found",
        jewelry: allBracelets
    });
}

exports.getAllNecklaces = (req, res) => {
    const menNecklaces = data.categories.men.jewelry.filter(item => item.characteristics.type === "collier");
    const womenNecklaces = data.categories.women.jewelry.filter(item => item.characteristics.type === "collier");
    const allNecklaces = menNecklaces.concat(womenNecklaces);

    res.status(200).json({
        message: "necklaces found",
        jewelry: allNecklaces
    });
}

exports.getAllEarrings = (req, res) => {
    const menEarrings = data.categories.men.jewelry.filter(item => item.characteristics.type === "boucle");
    const womenEarrings = data.categories.women.jewelry.filter(item => item.characteristics.type === "boucle");
    const allEarrings = menEarrings.concat(womenEarrings);

    res.status(200).json({
        message: "earrings found",
        jewelry: allEarrings
    });
}

exports.getAllWatches = (req, res) => {
    const menWatches = data.categories.men.jewelry.filter(item => item.characteristics.type === "montre");
    const womenWatches = data.categories.women.jewelry.filter(item => item.characteristics.type === "montre");
    const allWatches = menWatches.concat(womenWatches);

    res.status(200).json({
        message: "watches found",
        jewelry: allWatches
    });
}

exports.getWomenRings = (req, res) => {
    const womenRings = data.categories.women.jewelry.filter(item => item.characteristics.type === "bague");

    res.status(200).json({
        message: "women's rings found",
        jewelry: womenRings
    });
}

exports.getMenRings = (req, res) => {
    const menRings = data.categories.men.jewelry.filter(item => item.characteristics.type === "bague");

    res.status(200).json({
        message: "men's rings found",
        jewelry: menRings
    });
}

exports.getWomenBracelets = (req, res) => {
    const womenBracelets = data.categories.women.jewelry.filter(item => item.characteristics.type === "bracelet");

    res.status(200).json({
        message: "women's bracelets found",
        jewelry: womenBracelets
    });
}

exports.getMenBracelets = (req, res) => {
    const menBracelets = data.categories.men.jewelry.filter(item => item.characteristics.type === "bracelet");

    res.status(200).json({
        message: "men's bracelets found",
        jewelry: menBracelets
    });
}

exports.getWomenNecklaces = (req, res) => {
    const womenNecklaces = data.categories.women.jewelry.filter(item => item.characteristics.type === "collier");

    res.status(200).json({
        message: "women's necklaces found",
        jewelry: womenNecklaces
    });
}

exports.getMenNecklaces = (req, res) => {
    const menNecklaces = data.categories.men.jewelry.filter(item => item.characteristics.type === "collier");

    res.status(200).json({
        message: "men's necklaces found",
        jewelry: menNecklaces
    });
}

exports.getWomenEarrings = (req, res) => {
    const womenEarrings = data.categories.women.jewelry.filter(item => item.characteristics.type === "boucle");

    res.status(200).json({
        message: "women's earrings found",
        jewelry: womenEarrings
    });
}

exports.getMenEarrings = (req, res) => {
    const menEarrings = data.categories.men.jewelry.filter(item => item.characteristics.type === "boucle");

    res.status(200).json({
        message: "men's earrings found",
        jewelry: menEarrings
    });
}

exports.getWomenWatches = (req, res) => {
    const womenWatches = data.categories.women.jewelry.filter(item => item.characteristics.type === "montre");

    res.status(200).json({
        message: "women's watches found",
        jewelry: womenWatches
    });
}

exports.getMenWatches = (req, res) => {
    const menWatches = data.categories.men.jewelry.filter(item => item.characteristics.type === "montre");

    res.status(200).json({
        message: "men's watches found",
        jewelry: menWatches
    });
}
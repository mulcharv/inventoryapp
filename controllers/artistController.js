const Artist = require("../models/artist");
const Record = require("../models/record");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.artist_list = asyncHandler(async (req, res, next) => {
    const allArtists = await Artist.find().sort({ name: 1}).exec();
    res.render('artist_list', {
        title: "List of Artists", 
        artist_list: allArtists,
    });
});

exports.artist_detail = asyncHandler(async (req, res, next) => {
    const [artist, allRecordsByArtist] = await Promise.all([
        Artist.findById(req.params.id).exec(),
        Record.find({ artist: req.params.id }, "title release_date cover_image").exec(),
    ]);

    if (artist === null) {
        const err = new Error("Artist not found");
        err.status = 404;
        return next(err);
    }

    res.render('artist_detail', {
        title: "Artist Detail",
        artist: artist,
        artist_records: allRecordsByArtist,
    });
});

exports.artist_create_get = asyncHandler(async (req, res, next) => {
    res.render("artist_form", { title: "Create Artist" });
});

exports.artist_create_post= [
    body("name")
        .trim()
        .isLength({ min: 1 })
        .escape() 
        .withMessage("Name must be specified."),
    body("start_date", "Invalid start date (must be within 1930-2023)")
        .optional( {values: "falsy "})
        .toInt()
        .isInt({ min: 1930, max: 2023 }),
    body("end_date", "Invalid end date (must be within 1930-2023)") 
        .optional({ values: "falsy"})
        .toInt()
        .isInt( {min: 1930, max: 2023}),

    asyncHandler(async (req, res, next) => {
        
        const errors = validationResult(req);

        const artist = new Artist({ 
            name: req.body.name,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
        });

        if (!errors.isEmpty()) {

            res.render("artist_form", {
                title: "Create Artist", 
                artist: artist,
                errors: errors.array(),
            });
            return; 
        } else {

            await artist.save();

            res.redirect(artist.url); 

        }
    }),
];

exports.artist_delete_get= asyncHandler(async (req, res, next) => {
    const [artist, allRecordsByArtist] = await Promise.all([
        Artist.findById(req.params.id).exec(),
        Record.find( {artist: req.params.id }, 'title release_date').exec(),
    ]);

    if (artist === null) {

        res.redirect('/catalog/artists');
    }

    res.render('artist_delete', {
        title: 'Delete Artist',
        artist: artist,
        artist_records: allRecordsByArtist,
    });
});

exports.artist_delete_post= asyncHandler(async (req, res, next) => {
    const [artist, allRecordsByArtist] = await Promise.all([
        Aritst.findById(req.params.id).exec(),
        Record.find({ artist: req.params.id }, 'title release_date').exec(),
    ]);

    if (allRecordsByArtist.length > 0) {

        res.render('artist_delete', {
            title: 'Delete Artist',
            artist: artist,
            artist_records: allRecordsByArtist,
        });
        return;
    } else {

        await Artist.findByIdAndRemove(req.body.artistid);
        res.redirect('/catalog/artists');
    }
});

exports.artist_update_get= asyncHandler(async (req, res, next) => {
    const artist = await Artist.findById(req.params.id).exec();

    if (artist === null) {

        const err = new Error('Artist not found');
            err.status = 404;
            return next(err);
    }

    res.render('artist_form', {
        title: 'Update Artist',
        artist: artist,
    });
});

exports.artist_update_post= [
    body("name")
        .trim()
        .isLength({ min: 1 })
        .escape() 
        .withMessage("Name must be specified."),
    body("start_date", "Invalid start date (must be within 1930-2023)")
        .optional( {values: "falsy "})
        .toInt()
        .isInt({ min: 1930, max: 2023 }),
    body("end_date", "Invalid end date (must be within 1930-2023)") 
        .optional({ values: "falsy"})
        .toInt()
        .isInt( {min: 1930, max: 2023}),
    
        asyncHandler(async (req, res, next) => {
        
            const errors = validationResult(req);
    
            const artist = new Artist({ 
                name: req.body.name,
                start_date: req.body.start_date,
                end_date: req.body.end_date,
                _id: req.params.id
            });
            
            if (!errors.isEmpty()) {
                
                res.render('artist_form', {
                    title: 'Update Artist',
                    artist: artist,
                    errors: errors.array(),
                });
                return;
            } else {
                const theartist = await Artist.findByIdAndUpdate(req.params.id, artist, {});

                res.redirect(theartist.url)
            }
        }),
]


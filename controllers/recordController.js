const Record = require("../models/record");
const Artist = require("../models/artist");
const Genre = require("../models/genre");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");  
const record = require("../models/record");

exports.index = asyncHandler(async (req, res, next) => {

    const [
        numRecords,
        numGenres,
        numArtists,
    ] = await Promise.all([
        Record.countDocuments({}).exec(),
        Artist.countDocuments({}).exec(),
        Genre.countDocuments({}).exec(),
    ]);

    res.render("index", {
        title: "Official Inventory Site for London Records",
        record_count: numRecords,
        genre_count: numGenres,
        artist_count: numArtists,
    });
  });
  
  exports.record_list = asyncHandler(async (req, res, next) => {
    const allRecords = await Record.find({}, "title artist cover_image")
        .sort({ title: 1})
        .populate("artist")
        .exec();

    res.render('record_list', { title: 'List of Records For Sale', record_list: allRecords })
  });
  
  exports.record_detail = asyncHandler(async (req, res, next) => {
    const record = await Record.findById(req.params.id).populate("artist").populate("genre").exec();

    if (record === null) {
        const err = new Error("Record not found");
        err.status = 404;
        return next (err);
    }

    res.render("record_detail", {
        title: record.title,
        record: record,
    });
  });
  
  exports.record_create_get = asyncHandler(async (req, res, next) => {
    const [allArtists, allGenres] = await Promise.all([
        Artist.find().exec(),
        Genre.find().exec(),
    ]);

    res.render("record_form", {
        title: "Create Record",
        artists: allArtists,
        genres: allGenres, 
    });
  });
  
  exports.record_create_post = [

    (req, res, next) => {
        if (!(req.body.genre instanceof Array)) {
            if (typeof req.body.genre === 'undefined') req.body.genre = []; 
            else req.body.genre = new Array(req.body.genre);
        }
        next();
    },

    body('title', 'Title must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('artist', 'Artist must not be empty.')
        .trim()
        .isLength({min: 1 })
        .escape(),
    body('summary', 'Summary must not be empty.') 
        .trim()
        .isLength( {min: 1})
        .escape(),
    body('release_date', 'Release date must not be empty')
        .isISO8601()
        .toDate(),
    body("genre.*").escape(),
    body('label', 'Label must not be empty.')
        .trim()
        .isLength( {min: 1})
        .escape(),
    body('length_minutes', 'Minutes length must not be empty, and within range(1-99).')
        .toInt({min:1, max: 99}),
    body('length_seconds', 'Seconds length must not be empty, and within range(0-59).')
        .toInt({min:0, max: 59}),
    body('number_in_stock', 'Number in stock must not be empty, and within range(0-10).')
        .toInt({min:0, max: 10}),
    body('price', 'Price must not be empty, and within range(1-1000)')
        .toInt({min:1, max: 1000}),
    body('cover_image', 'Url must be provided')
        .optional({ values: 'falsy'})
        .trim()
        .isLength( {min: 1})
        .escape(),

    asyncHandler(async (req, res, next) => {

        const errors = validationResult(req);
        
        const record = new Record({
            title: req.body.title, 
            artist: req.body.artist,
            summary: req.body.summary,
            release_date: req.body.release_date,
            genre: req.body.genre,
            label: req.body.label,
            length_minutes: req.body.length_minutes,
            length_seconds: req.body.length_seconds, 
            number_in_stock: req.body.number_in_stock,
            price: req.body.price,
            cover_image: req.body.cover_image,
        });

        if (!errors.isEmpty()) {

            const [allArtists, allGenres] = await Promise.all([
                Artist.find().exec(),
                Genre.find().exec(),
            ]);

            for (const genre of allGenres) {
                if (record.genre.indexOf(genre._id) > -1) {
                    genre.checked = 'true';
                }
            }
            res.render('record_form', {
                title: 'Create Record',
                artists: allArtists,
                genres: allGenres,
                record: record,
                errors: errors.array(),
            })
        }
            else {
                await record.save();
                res.redirect(record.url);
            }
        }),
  ];
  
  exports.record_delete_get = asyncHandler(async (req, res, next) => {
        const record = await Record.findById(req.params.id).exec();
        
        if (record === null) {

            res.redirect('/catalog/records');
        }

        res.render('record_delete', {
            title: "Delete Record", 
            record: record,
        })
  });
  
  exports.record_delete_post = asyncHandler(async (req, res, next) => {
        await Record.findByIdAndRemove(req.body.recordid);
        res.redirect('/catalog/records');
  });
  
  exports.record_update_get = asyncHandler(async (req, res, next) => {
        const [record, allArtists, allGenres] = await Promise.all([
            Record.findById(req.params.id).populate('artist').populate('genre').exec(),
            Artist.find().exec(),
            Genre.find().exec(),
        ]);

        if (record === null) {
            
            const err = new Error('Record not found');
            err.status = 404;
            return next(err);
        }

        for (const genre of allGenres) {
            for(const record_g of record.genre) {
                if(genre._id.toString() === record_g._id.toString()) {
                    genre.checked = 'true';
                }
            }
        }

        res.render('record_form', {
            title: "Update Record",
            artists: allArtists,
            genres: allGenres,
            record: record,
        });
  });
  
  exports.record_update_post = [
    (req, res, next) => {
        if (!(req.body.genre instanceof Array)) {
            if (typeof req.body.genre === 'undefined') {
                req.body.genre = [];
            } else {
                req.body.genre = new Array(req.body.genre)
            }
        }
        next();
    },

    body('title', 'Title must not be empty')
        .trim()
        .isLength({ min: 1})
        .escape(),
    body('artist', 'Artist must not be empty.')
        .trim()
        .isLength({min: 1 })
        .escape(),
    body('summary', 'Summary must not be empty.') 
        .trim()
        .isLength( {min: 1})
        .escape(),
    body('release_date', 'Release date must not be empty')
        .isISO8601()
        .toDate(),
    body("genre.*").escape(),
    body('label', 'Label must not be empty.')
        .trim()
        .isLength( {min: 1})
        .escape(),
    body('length_minutes', 'Minutes length must not be empty, and within range(1-99).')
        .toInt({min:1, max: 99}),
    body('length_seconds', 'Seconds length must not be empty, and within range(0-59).')
        .toInt({min:0, max: 59}),
    body('number_in_stock', 'Number in stock must not be empty, and within range(0-10).')
        .toInt({min:0, max: 10}),
    body('price', 'Price must not be empty, and within range(1-1000)')
        .toInt({min:1, max: 1000}),
    body('cover_image', 'Url must be provided')
        .optional({ values: 'falsy'})
        .trim()
        .isLength( {min: 1})
        .escape(),

    asyncHandler(async (req, res, next) => {

        const errors = validationResult(req);

        const record = new Record({
            title: req.body.title,
            artist: req.body.artist,
            summary: req.body.summary,
            release_date: req.body.release_date,
            genre: typeof req.body.genre === 'undefined' ? [] : req.body.genre,
            label: req.body.label,
            length_minutes: req.body.length_minutes,
            length_seconds: req.body.length_seconds, 
            number_in_stock: req.body.number_in_stock,
            price: req.body.price,
            cover_image: req.body.cover_image,
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {

            const [allArtists, allGenres] = await Promise.all([
                Artist.find().exec(),
                Genre.find().exec(),
            ]);

            for (const genre of allGenres) {
                if (record.genre.indexOf(genres._id) > -1) {
                    genre.checked = 'true';
                }
            }
            res.render('record_form', {
                title: 'Update Record', 
                artist: allArtists,
                genres: allGenres,
                record: record,
                errors: errors.array(),
            });
            return;
        } else {

            const therecord = await Record.findByIdAndUpdate(req.params.id, record, {});

            res.redirect(therecord.url)
        }
    }),
];
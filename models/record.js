const mongoose = require("mongoose");

const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const RecordSchema = new Schema({
    title: { type: String, required: true},
    artist: { type: Schema.Types.ObjectId, ref: "Artist", required: true},
    summary: { type: String, required: true},
    release_date: { type: Date, required: true },
    genre: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
    label: { type: String, required: true},
    length_minutes: {type: Number, min:1, max: 99, required: true},
    length_seconds: {type: Number, min:0, max: 59, required: true},
    number_in_stock: { type: Number, min: 0, max: 10, required: true },
    price: { type: Number, min: 1, max: 1000, required: true },
    cover_image: { type: String }
});

RecordSchema.virtual("url").get(function () {
    return `/catalog/record/${this._id}`;
});

RecordSchema.virtual("release_date_formatted").get(function () {
    return DateTime.fromJSDate(this.release_date).toLocaleString(DateTime.DATE_MED);
});

RecordSchema.virtual("length_formatted").get(function() {
    let length = `${this.length_minutes}:${this.length_seconds}`;
    return length;
})

module.exports = mongoose.model("Record", RecordSchema)
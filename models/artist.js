const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
    name: { type: String, required: true, maxLength: 100 },
    start_date: { type: Number, min: 1930, max: 2023},
    end_date: { type: Number, min: 1930, max: 2023},
});

ArtistSchema.virtual("url").get(function () {
    return `/catalog/artist/${this._id}`;
});

ArtistSchema.virtual("years_active").get(function () {
    let years;
    if (this.end_date) {
    years=`${this.start_date} - ${this.end_date}`
    }
    if (!this.end_date) {
    years=`${this.start_date} - `
    }
    return years;
    
})

module.exports = mongoose.model("Artist", ArtistSchema);


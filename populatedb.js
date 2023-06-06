#! /usr/bin/env node

console.log(
    'This script populates some test records, artists, and genres to the database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const Record = require("./models/record");
  const Artist = require("./models/artist");
  const Genre = require("./models/genre");
  
  const genres = [];
  const artists = [];
  const records = [];
  
  const mongoose = require("mongoose");
const genre = require("./models/genre");
  mongoose.set("strictQuery", false); // Prepare for Mongoose 7
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createGenres();
    await createArtists();
    await createRecords();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  async function genreCreate(name) {
    const genre = new Genre({ name: name });
    await genre.save();
    genres.push(genre);
    console.log(`Added genre: ${name}`);
  }
  
  async function artistCreate(name, s_date, e_date) {
    artistdetail = { name: name };
    if (s_date != false) artistdetail.start_date = s_date;
    if (e_date != false) artistdetail.end_date = e_date;
  
    const artist = new Artist(artistdetail);
  
    await artist.save();
    artists.push(artist);
    console.log(`Added artist: ${name}`);
  }
  
  async function recordCreate(title, artist, summary, release_date, genre, label, length_minutes, length_seconds, number_in_stock, price, cover_image) {
    recorddetail = {
      title: title,
      artist: artist,
      summary: summary,
      release_date: release_date,
      label: label,
      length_minutes: length_minutes,
      length_seconds: length_seconds,
      number_in_stock: number_in_stock,
      price: price,
      cover_image: cover_image
    };
    if (genre != false) recorddetail.genre = genre;
  
    const record = new Record(recorddetail);
    await record.save();
    records.push(record);
    console.log(`Added record: ${title}`);
  }
  
  async function createGenres() {
    console.log("Adding genres");
    await Promise.all([
      genreCreate("Rap"),
      genreCreate("Hip Hop"),
      genreCreate("R&B"),
      genreCreate("Indie Rock"),
      genreCreate("Pop"),
      genreCreate("Alternative Rock"),
      genreCreate("Soul"),
      genreCreate("Dance"),
      genreCreate("Electronic"),
      genreCreate("House"),
      genreCreate("Drum and Bass"),
      genreCreate("Jazz"),
      genreCreate("Folk")
    ]);
  }
  
  async function createArtists() {
    console.log("Adding artists");
    await Promise.all([
      artistCreate("Childish Gambino", 2011, false),
      artistCreate("Mac Miller", 2007, 2018),
      artistCreate("Frank Ocean", 2005, false),
      artistCreate("Coldplay", 1997, false),
      artistCreate("Flume", 2010, false),
      artistCreate("SZA", 2011, false),
      artistCreate("Kendrick Lamar", 2003, false),
      artistCreate("Lizzy McAlpine", 2016, false),
      artistCreate("Paramore", 2004, false),
    ]);
  }
  
  async function createRecords() {
    console.log("Adding Records");
    await Promise.all([
      recordCreate(
        "Because The Internet",
        artists[0],
        "Because the Internet is the second studio album by American recording artist Donald Glover, under the stage name Childish Gambino. It was released on December 10, 2013, by Glassnote Records. The recording process began in 2012 and ended in October 2013.",
        "2013-12-10",
        [genres[1]],
        "Glassnote",
        57,
        52,
        3,
        29.99,
        "https://media.pitchfork.com/photos/5929a4ce13d1975652138dc8/1:1/w_600/a61ee51a.jpg"
      ),
      recordCreate(
        "Swimming",
        artists[1],
        "Swimming is the fifth studio album by American rapper Mac Miller. It was released on August 3, 2018 by REMember Music and Warner Bros. Records. Miller produced the album himself, with Jon Brion, Dev Hynes, J. Cole, ID Labs, Dâm-Funk, DJ Dahi, Tae Beast, Flying Lotus, and Cardo, among others.",
        "2018-08-03",
        [genres[0], genres[1]],
        "Warner Records",
        58,
        39,
        1,
        34.99,
        "https://media.pitchfork.com/photos/5b4e36a4dc6c142e533571c8/1:1/w_320,c_limit/Mac%20Miller_Swimming.jpg"

      ),
      recordCreate(
        "Blonde",
        artists[2],
        "Blonde is the second studio album by American singer Frank Ocean. It was released on August 20, 2016, as a timed exclusive on the iTunes Store and Apple Music, and followed the August 19 release of Ocean's video album Endless. The album features guest vocals from André 3000, Beyoncé, and Kim Burrell, among others.",
        "2016-08-20",
        [genres[2], genres[6]],
        "BOYS DON'T CRY",
        60,
        08,
        2,
        29.99,
        "https://upload.wikimedia.org/wikipedia/en/a/a0/Blonde_-_Frank_Ocean.jpeg"
      ),
      recordCreate(
        "Ghost Stories",
        artists[3],
        "Ghost Stories is the sixth studio album by British rock band Coldplay. Co-produced by the band with Paul Epworth along with returning Mylo Xyloto producers Dan Green and Rik Simpson, it was released by Parlophone on 16 May 2014. The album was released by Atlantic Records in North America on 19 May 2014.",
        "2014-05-16",
        [genres[4], genres[5]],
        "Parlaphone",
        42,
        37,
        1,
        25.34,
        "https://media.pitchfork.com/photos/5929a790b1335d7bf16990a4/1:1/w_320,c_limit/38e1b6ab.jpg"
      ),
      recordCreate(
        "Brand New Eyes",
        artists[8],
        "Brand New Eyes is the third studio album by American rock band Paramore, released on September 29, 2009, through Fueled by Ramen in the United States and Canada. The album was produced by Rob Cavallo and recorded in Hidden Hills, California from January to March 2009.",
        "2009-09-29",
        [genres[4], genres[5]],
        "Fuled By Ramen",
        40,
        18,
        2,
        34.99,
        "https://cdn.hmv.com/r/w-1280/p-webp/hmv/files/d6/d64fe639-98dd-4ad8-94d2-cfc4ab330fa2.jpg"
        
      ),
      recordCreate(
        "Hi This Is Flume",
        artists[4],
        "Hi This Is Flume is the first mixtape released by Australian electronic musician Flume. It was released on 20 March 2019 by Future Classic. The mixtape follows the release of Flume's Skin: The Remixes in 2017.",
        "2019-03-20",
        [genres[7], genres[8]],
        "Future Classic",
        38,
        10,
        1,
        32.00,
        "https://i.discogs.com/3m6R2WDHDFa7WuBgK_kGVta35z3VlIWX1BfrDdYnP4w/rs:fit/g:sm/q:90/h:600/w:599/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTE1NDU3/ODY5LTE2MTk4NjY3/MjQtNDEyNy5qcGVn.jpeg"
      ),
    ]);
  }
  
  
// Do not change this file
require('dotenv').config();

const mongoose = require('mongoose');
const URI = process.env['MONGO_URI'];

main().catch(error => {
  console.log(error);
  throw new Error('Unable to Connect to Database');
});

async function main(){
  await mongoose.connect(URI);
}

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  comments: { type: [String], default: [] }
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
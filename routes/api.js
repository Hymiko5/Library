/*
*
*
*       Complete the API routing below
*       
*       
*/

const Book = require('../Book');
const ObjectID =require('mongo').ObjectID;

'use strict';

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      let project = {
        _id: 1,
        title: 1,
        commentcount: { $size: '$comments' }
      }
      Book.aggregate([{ $match: {} }, { $project: project }], (err, books) => {
        if(err) res.send(err);
        else res.json(books);
      })
    })
    
    .post(function (req, res){
      let title = req.body.title;
      if(!title) return res.send('missing required field title');
      //response will contain new book object including atleast _id and title
      const newBook = new Book({ title });
      newBook.save(function (err, book) {
        if(err)res.send('could not save');
        else res.json(book);
      })
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}, function(err){
        if(err) res.send(err);
        else res.send('complete delete successful');
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findById(bookid, function(err, doc) {
        if(err||!doc)res.send('no book exists');
        else res.json(doc);
      })
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      if(!comment) return res.send('missing required field comment');
      Book.findByIdAndUpdate(bookid, { $push: { comments: comment },}, { new: true}, (err, doc) => {
        if(err||!doc)res.send('no book exists');
        else res.json(doc);
      } )

    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.findByIdAndDelete(bookid, (err, doc) => {
        if(err||!doc)res.send('no book exists');
        else res.send('delete successful');
      })

    });
  
};

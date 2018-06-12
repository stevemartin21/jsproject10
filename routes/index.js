var express = require('express');
var router = express.Router();
var dateFormat = require('dateformat');
var moment = require('moment');
var methodOverride = require('method-override');
const Books =require('../models').Books;
const Patrons =require('../models').Patrons;
const Loans =require('../models').Loans;
var now = moment().format('YYYY-MM-DD').toString();
var dueDate = moment().add(7, 'days').format('YYYY-MM-DD'); 
/////////////////////////////////////////////////////////////////   HOME PAGE //////////////////////////////////////////////////////////////////////
/* GET home page. */

router.get('/', function(req, res) {
	 res.render('home', { title: "Stevo's" })
  .catch(function (err) {
	  console.log(err.message)
	});
});
	/////////////////////////////////////////////////////////////////  ADD NEW BOOK , LOAN , PATRON	
// New books add a book 
router.get('/booksNew', function(req, res, next) {
	res.render('new_book', {book: Books.build()})
	.catch(function (err) {
	  console.log('This is an error')
	});
});

// Add a new patron/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/patronsNew', function(req, res, next) {	
  res.render('new_patron', {patron: Patrons.build()})
  	.catch(function (err) {
	  console.log('This is an error')
	});
});

// Add a new loan//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/loansNew', function(req, res, next) {	
	Books.findAll().then(function(books){
		Patrons.findAll().then(function(patrons){
			res.render('new_loan',  {

				books:books, 
				patrons:patrons,
				now:now,
				dueDate:dueDate
			})
		});	

	});
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// CHECkOUT BOOKS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Book Checked Out  Books that are checked out 
	
router.get('/checkedOut', function(req, res, next) {	
	Loans.findAll({

		where: {returned_on: null },
		include:[Books	
		]
		
	}).then(function(books){
		console.log(books[0].dataValues.Book.dataValues.title);
		
			res.render('checked_books', {
				books:books 	
			})
		});	
	});

///////////////  THis will help return a book//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//  RETURN A BOOK //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/return_book/:id', function(req, res, next) {	
	console.log(req.body)
	Loans.findById(req.params.id, {
		//console.log(loanId)
			include: [
					 {model: Patrons,required: true},
					 {model: Books,required: true}
					]
			
		}).then(function(info){	

				res.render('return_book', { info:info, now:now});
				console.log(info)
			})
		});

////////////////////////////////////////////////////////////////////////////////////////////////////////  OVER DUE LOANS & BOOKS /////////////////////////////////

// Book Over Due  This will grab the overdue books from the list

router.get('/overdue', function(req, res, next) {	
	Loans.findAll({
		where: {returned_on: {$eq: null}, return_by: {$lt: now}},
		include:[{model:Books}]
	}).then(function(books){
		console.log(books)
			res.render('overdue_books', {
				books:books 
			})
		});	
	});

// OVer due loans 


router.get('/overdueLoans', function(req, res, next) {
		
	Loans.findAll({
		where: {returned_on: {$eq: null}, return_by: {$lt: now }},
		include:[{model:Books}, {model:Patrons}]

	}).then(function(checkLoans){
		console.log(checkLoans)
		res.render('overdue', {
			checkLoans:checkLoans
		})
		//console.log(checkLoans[0].dataValues.Patron.first_name)
	}).catch(function (err) {
	  console.log(err.message)
	});
	
});

////////////////////////////////////////////////////////////////////////  Loans Checked OUt///////////////////////////////////////////////////////////////////////////

router.get('/loansCheckedOut', function(req, res, next) {	
	Loans.findAll({
		where: {returned_on: null },
		include:[{model:Books}, {model:Patrons}]
	}).then(function(checkLoans){
			res.render('checked_loans', {
				checkLoans:checkLoans 
			})
			console.log(checkLoans[0].dataValues.Patron.last_name)
		});	

	});

// Get by Id grab the book and details from the book once selected /////////////////////////////////////////////////////////////////////////////////////////////

//  BOOK BY ID//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/books/:id', function(req, res, next) {
	//console.log(req.body)
			Books.findById(req.params.id).then(function(bookId){
				//
				Loans.findAll({

					include: [
							  {model: Books}, 
							  {model: Patrons}
							 ],
					where: {
						book_id: req.params.id
					}
				}).then(function(info){
				var Details = bookId
				res.render('book_detail', {Details:Details, info:info});
				
			})
		});
	});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// PATRON BY ID ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//grab the details from the patron 

router.get('/patrons/:id', function(req, res, next) {
	console.log('it worked')
	Patrons.findById(req.params.id).then(function(patronsId){
		//console.log(patronsId.dataValues);
		Loans.findAll({

					include: [
							  {model: Books}, 
							  {model: Patrons}
							 ],
					where: {
						patron_id: req.params.id
					}
				}).then(function(info){
				var Details = patronsId
				res.render('patron_detail', {Details:Details, info:info});
				console.log(info)
			})
	})
});

/////////////////////////////////////////////////////////////       POST & PUT ROUTES  //////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//  Update the book details, ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.put("/books/:id", function(req, res, next){
	//console.log(req.body)
	
	Books.findById(req.params.id).then(function(book){
		console.log(book)
		return book.update(req.body);	
	}).then(function(){
			res.redirect('/all_books')
				}).catch(function (err) {
			  console.log('This is an error')
			})
	}); 

////////////////////  UPdate Patron////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.put("/patrons/:id", function(req, res, next){
	console.log(req.body)
	
	Patrons.findById(req.params.id).then(function(patron){
		console.log(req.body)
		return patron.update(req.body);	
	}).then(function(){
			res.redirect('/all_patrons')
				}).catch(function (err) {
			  console.log('This is an error')
			})
	}); 

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////   RETURN A BOOK & RETURN A LOAN ////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////  Return a book

router.put("/return_book/:id", function(req, res, next){
	
	Loans.findById(req.params.id).then(function(loan){
			//console.log(req.body)
				var loanInfo = loan	
				//console.log(req.body)
		return loan.update(req.body)}).then(function(){

				res.redirect('/all_loans')
			}).catch(function (err) {
			 if(err.name=== 'SequelizeValidationError' ){
	  		console.log(req.body)
	  		//res.render('return_book', {
	  			//book: req.body,
	  			//errors: err.errors
	  			res.sendStatus(500);
	  		
	  	}else{
	  		throw err;
	  	}
	  }).catch(function (err) {
	  res.sendStatus(500);
	});
}); 

///////////////////   GETS ALL BOOK & ALL PATRONS AN ALL LOANS ///////////////////////////////////////////////////////////////////////////////////////////

	//  This will return all book s 

router.get('/all_books', function(req, res, next) {
	
	Books.findAll().then(function(allBooks){
		//include:[{model: Patrons,required: true}]
		//console.log(allBooks);
		var Library = allBooks;
		//console.log(Library)
		res.render('all_books', {Library});
	}).catch(function (err) {
	  console.log('This is an error')
	});
  
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// Returns all laosn

router.get('/all_loans', function(req, res, next) {
		
	Loans.findAll({
		include:[{model:Books}, {model:Patrons}]

	}).then(function(allLoans){
		res.render('all_Loans', {allLoans});
		//console.log(allLoans[3])
	})
});

// Return all patrons


router.get('/all_patrons', function(req, res, next) {
	Patrons.findAll().then(function(allPatrons){
		
		var Members = allPatrons;
		//console.log(Members)
		res.render('all_patrons', {Members});
	}).catch(function (err) {
	  console.log(err.message)
	});
  
});


// Post Methods returns and adds book to the database

router.post('/booksNew', function(req, res, next) {
	//console.log(req.body)
	  Books.create(req.body).then(function(insertedBook){
	  	res.redirect('/all_books');
	  }).catch(function(err){
	  	if(err.name=== 'SequelizeValidationError' ){
	  		console.log(req.body)
	  		res.render('new_book', {

	  			book: req.body,
	  			errors: err.errors
	  		})
	  	}else{
	  		throw err;
	  	}
	  }).catch(function (err) {
	  console.log(err.message)
	});
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//  ADDS NEW ITEMS TO DATABASES    LOANS, BOOKS, AND Patrons /////////////////////////////////////////////////////////////////////////////////////////////////////////




//  Add a new loan to the database


router.post('/loansNew', function(req, res, next) {
	//console.log(req.body)
  Loans.create(req.body).then(function(insertedLoan){
  	console.log(insertedLoan.dataValues)
  	//console.log('It is inserted');
  	res.redirect('/all_loans');
  }).catch(function(err){
	  	if(err.name=== 'SequelizeValidationError' ){
	  		console.log(req.body)
	  		res.sendStatus(500);
	  	}else{
	  		throw err;
	  	}
	  }).catch(function (err) {
	  console.log(err.message)
	});
});


// Add a new patron to the database 

router.post('/patronsNew', function(req, res, next) {
	//console.log(req.body)
  Patrons.create(req.body).then(function(insertedPatron){
  	//console.log(insertedPatron.dataValues)
  	//console.log('It is inserted')
  	res.redirect('/all_patrons');
  }).catch(function(err){
  	console.log(req.body)
	  	if(err.name=== 'SequelizeValidationError' ){
	  		res.render('new_patron', {
	  			patron: req.body,
	  			errors: err.errors
	  		})
	  		
	  	}else{
	  		throw err;
	  	}
	  }).catch(function (err) {
	  console.log(err.message)
	});
});


module.exports = router;


const express = require('express')
const mongoose = require('mongoose')
const expressLayouts = require("express-ejs-layouts")
const flash = require("connect-flash");
const session = require("express-session");   // req.flash requires express-sessions
const methodOverride = require('method-override')

const addComplaints = require('./routes/addComplaints')
const editComplaints = require('./routes/editComplaints')
// const allRoutes = require('./routes/')

////////////////////  MongoDB Connection ////////////////////////
mongoose.connect('mongodb://localhost:27017/ImageUploadDB', {useNewUrlParser: true, useUnifiedTopology: true}, (err) =>{
    if (!err) {
       console.log("MongoDB connection success"); 
    }else{
        console.log("Error in DB Connection: " + err);
    }
});
//////////////////////////////////////////////////////////////////


const app = express()

app.use(express.static(__dirname + '/public/'))


////// EJS  SETUP  ///////
app.use(expressLayouts);
app.set('view engine', 'ejs');
//////////////////////////


//////////// Bodyparser middleware //////////////
// app.use(express.json());    
app.use(express.urlencoded({ extended: true }));  
/////////////////////////////////////////////////

//////////// method Override middleware //////////////
app.use(methodOverride('_method'))   // to override post method in forms to delete
/////////////////////////////////////////////////


///// EXPRESS-SESSION middleware ////
app.use(session({
    secret: 'secret',   // can be anything
    resave: true,
    saveUninitialized: true
}))
///////////////////////////////////////////////


//// FLASH middleware ////
app.use(flash());
//////////////////////////


/////////////// setting Global Variables ///////////////////
// req.flash requires sessions to use
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');  // success_msg is the variable name
    res.locals.error_msg = req.flash('error_msg'); 
    next();
});
///////////////////////////////////////////////////////////



app.use('/', addComplaints)
app.use('/edit', editComplaints)
//app.use(allRoutes)



//////////////////// Server start //////////////////
const PORT = process.env.PORT || 6001
app.listen(PORT, () => { 
    console.log(`server started on port ${PORT}`); 
});
/////////////////////////////////////////////////////



/*
tech  = tech.toLowerCase().replace(/, /g, ',')  // g for globally
// replace (, ) with just(,) globally 
// how to remove spaces after each comma when listing with commas

*/
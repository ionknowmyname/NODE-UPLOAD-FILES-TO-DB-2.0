const express = require("express")
const router = express.Router()
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const Complaint = require('../Models/Complaint')
const { upload } = require('../uploadMulter')


 
///////////////////////// TESTING //////////////////////////////////

//#region TESTING For iteration
router.get('/complaints/test', (req, res) => {  // testing how it appears

    Complaint.find((err, docs) => {
        if(!err){
            //console.log(docs);
            res.render('testing', { list: docs });   
        }else{
            console.log("Error in retrieving Images from DB: " + err);
        }
    });
})    
//#endregion


//#region FORMER COMPLAINTS VIEW WITH IMAGES
router.get('/complaints/former', (req, res) => { 

    Complaint.find((err, docs) => {
        if(!err){
            //console.log(docs);
            res.render('images', { list: docs });   
        }else{
            console.log("Error in retrieving Images from DB: " + err);
        }
    });
}) 
//#endregion   

///////////////////////////////////////////////////////////////////



///////////////////////// CREATE //////////////////////////////////

//#region CREATE COMPLAINT
router.get('/complaints/new', (req, res) => { res.render('registerComplaints') })    // ejs

router.post('/complaints/new', upload.single('filename'), (req, res) => {  // where pic is name from file input type in html form
   
    console.log(req.body);
    console.log(req.file);

    const { designation, name, staffID, email, phone, summary } = req.body 
    //const fileName = req.file.filename    
    let errors = [];

    if (!designation || !name || !staffID || !email || !summary) {
        errors.push({ msg: 'Please enter all required fields' });
    }
    if (req.file == undefined){  // no file uploaded
        errors.push({ msg: 'Error: No file selected!' });
    } 
    if (errors.length > 0) {
        //console.log(errors)
        res.render('registerComplaints', { errors, name, staffID, email, phone, summary });  
    }else{

        let complaint = new Complaint({
            designation: req.body.designation,
            name: name,
            staffID: staffID,
            email: email,
            phone: phone,
            summary: summary,
            fileName: req.file.filename  // req.file.fileName, fileName is from multer
        }) 
        complaint.save()
        .then(complaint => {
            console.log('Sucessfully submitted complaint')
            req.flash('success_msg', 'Sucessfully submitted complaint'); 
            /* req.flash not showing yet coz of we not using res.redirect, which displays
            the flash on the redirected page. req.render just renders the page bt can pass
            parameters */

            /* after, I will switch to res.redirect so I can show req.flash of sucessfullly submitting,
            dont really need to show uploaded images on the same page, just redirect to Complaints
            route where search can be done */
            
            res.render('registerComplaints', {   
                message: req.flash('success_msg'),  // not working
                file: `/uploads/${req.file.filename}`     
            })
        })
        .catch(err => { console.log(err) }) 
    }
})
//#endregion

////////////////////////////////////////////////////////////////////////////////////////////




///////////////////////// READ //////////////////////////////////

//#region SHOW ALL COMPLAINTS
router.get('/complaints', (req, res) => { 

    Complaint.find((err, docs) => {
        if(!err){
            //console.log(docs);
            res.render('allComplaints', { list: docs });   
        }else{
            console.log("Error in retrieving Images from DB: " + err);
        }
    });
}) 
//#endregion

////////////////////////////////////////////////////////////////////////




///////////////////////// SEARCH //////////////////////////////////

//#region SEARCH IN ALL COMPLAINTS
router.get('/complaints/search', (req, res) => { 
    let { searchItem } = req.query       //  searchItem is also name of search input in form
    // const searchItem  = req.query.searchItem
    // searchItem = searchItem.toLowerCase()

    /* Complaint.findAll({ where: { name: { [Op.like]: '%' + searchItem + '%' } } })  // '%' means search item can be before/after something else
    .then(complaint => { res.render('allComplaints', { list: complaint }) })
    .catch(err => { console.log(err) }); */
   
    // OR

    Complaint.find({ where: { name: { [Op.like]: searchItem } } }).exec((err, docs) => {  
        // '%' + searchItem + '%'
        if (!err) {
            console.log(docs);
            console.log(searchItem); 
            res.render('allComplaints', { list: docs }) 
        }else{
            console.log(err);
        }
    })
})
//#endregion

////////////////////////////////////////////////////////////////////////


/* router.use((req, res, next) =>{
    console.log(req.method, req.url);

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4201');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-Width,content-type');

    next();
}) */




module.exports = router
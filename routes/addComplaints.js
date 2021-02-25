const express = require("express")
const router = express.Router()

const Complaint = require('../Models/Complaint')
const { upload } = require('../uploadMulter')



router.get('/complaints/new', (req, res) => { res.render('registerComplaints') })    // ejs

// rendering ejs of complaints
router.get('/complaints', (req, res) => { 

    Complaint.find((err, docs) => {
        if(!err){
            //console.log(docs);
            res.render('images', { list: docs });   
        }else{
            console.log("Error in retrieving Images from DB: " + err);
        }
    });
})    



router.post('/complaints/new', upload.single('fileName'), (req, res) => {  // where pic is name from file input type in html form
   
    console.log(req.body);
    console.log(req.file);

    const { name, staffID, email, phone, summary } = req.body 
    //const fileName = req.file.filename    
    let errors = [];

    if (!name || !staffID || !email || !summary) {
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
            name: req.body.name,
            staffID: req.body.staffID,
            email: req.body.email,
            phone: req.body.phone,
            summary: req.body.summary,
            fileName: req.file.filename  
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

router.post('/complaints', (req, res) => { 
    // handles searching on db
   
    
})



module.exports = router
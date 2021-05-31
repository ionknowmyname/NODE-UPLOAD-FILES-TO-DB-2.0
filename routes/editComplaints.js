const express = require("express")
const router = express.Router()

const Complaint = require('../Models/Complaint')
const { upload } = require('../uploadMulter')




////////////// UPDATE COMPLAINTS /////////////////////////

//#region EDIT COMPLAINTS
router.get('/complaints/edit/:id', (req, res) => { 
    Complaint.findById({_id: req.params.id}, (err, docs) => {
        if(!err){
            res.render('editComplaints', { list: docs });    // edit.ejs        
        }
    });  
}) 

// used put before
router.patch('/complaints/edit/:id', upload.single('fileName'), (req, res) => {   
    const id = req.params.id;
    // var fileName

    console.log(req.body);
    console.log(req.file);


    const { name, staffID, email, phone, summary } = req.body 
    const fileName = req.file.filename    
    
    if (req.file == undefined){  // no file uploaded
        //errors.push({ msg: 'Error: No file selected!' });
        // replace this error with something to retain the former fileName in DB

        // req.file.filename = what's already in DB

        
    }

   /*  if (errors.length > 0) {
        //console.log(errors)
        res.render('editComplaints', { list: req.body }, { errors, name, staffID, email, phone, summary });  
    }else{ */
        /* Complaint.findById({ _id: id }).exec((err, docs) => {
            if(!err) {
                
                console.log('found ID in DB');
                console.log(docs.fileName);
                //req.file.fileName = docs.fileName;
                //const fileName = req.file.fileName
                fileName= docs.fileName
            }else{
                console.log(err);
            }
        }) */
        //var fileName= docs.fileName
        
        Complaint.findByIdAndUpdate({_id: req.params.id}, { name, staffID, email, phone, summary, fileName }, { new: true }, (err, docs) => {     
            // { omitUndefined: true},
            // { name, staffID, email, phone, summary }
            // {new: true}; returns the new updated doc
            // returnOriginal: false;  same as {new: true}
            // { omitUndefined: true}  // for req.file that's undefined, so it wont update it to DB
          
            let errors = [];

            if (!name || !staffID || !email || !summary) {
                errors.push({ msg: 'Please enter all required fields' });
            }
            if (errors.length > 0) {
                console.log(errors)
                res.render('editComplaints', { list: docs }, { errors, name, staffID, email, phone, summary });  
            }

            if(!err){
                console.log("Updated Successfully");
                console.log(docs);                 // log updated data
                res.redirect('/complaints');      // complaints get route      
            }else{
                console.log("Error in updating Employee: " + err);
            }
        });  
       

        /* Complaint.findById({ _id: id }).exec((err, docs) => {
            if(err) {
                console.log('no user');
            }else{
                console.log('found ID in DB');
                console.log(req.body);
                //console.log(docs);
                docs.updateOne({ name: name, staffID: staffID, email: email, phone: phone, summary: summary }), (err, success) => {   // req.body
                    console.log('entered here');
                    if (err) {
                        console.log(err);
                        
                    }else{
                        // res.send(200).json({})
                        console.log('Updated Successfully');
                        console.log(success);   // updated 
                    }
                }
            }
        }) */
    // }
})
//#endregion

///////////////////////////////////////////////////////////////




////////////// DELETE COMPLAINTS /////////////////////////

//#region 
router.delete('/complaints/delete/:id', (req, res) => {  
    //console.log(req);
    // console.log(req.params.id);
    Complaint.findByIdAndRemove(req.params.id, { useFindAndModify: false }, (err, docs) => {
        if(!err){
            res.redirect('/complaints');       // employees GET route  
            // or res.render to show successfully deleted message
            console.log(docs);   // deleted entry
        }else{
            console.log("Error in Employee deletion: " + err);
        }
    });  
})
//#endregion

/////////////////////////////////////////////////////////////




module.exports = router
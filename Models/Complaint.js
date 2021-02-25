const mongoose = require('mongoose')
const Schema  = mongoose.Schema

   
const complaintSchema  = new Schema({
    designation: { type: String },
    name: { type: String },
    staffID: { type: String },
    email: { type: String },
    phone: { type: String },
    summary: { type: String },
    fileName: { type: String }
}, { timestamps: true })



const Complaint = mongoose.model("Complaint", complaintSchema)
module.exports = Complaint
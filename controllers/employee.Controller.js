const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Employee = mongoose.model('employee');
mongoose.set('useFindAndModify', false);
router.get('/',(req,res)=>{
    // res.json('sample text');
    res.render("employee/addOrEdit",{
        viewTitle:"Insert Employee"
    })
});

router.post('/employee',(req,res)=>{
    // console.log('hi');
    // console.log(req.body);
    if(req.body._id=='')
        insertRecord(req,res);
    else{
        updateRecord(req,res);
    }
});

function insertRecord(req,res){
    var employee = new Employee();
    employee.fullName = req.body.fullName;
    employee.email = req.body.email;
    employee.mobile = req.body.mobile;
    employee.city = req.body.city;
    employee.save((err,doc)=>{
        if(!err)
            res.redirect('employee/list');
        else{
            if(err.name == "ValidationError"){
                handleValidationError(err,req.body);
                res.render("employee/addOrEdit",{
                    viewTitle:"Insert Employee",
                    employee : req.body
                })
            }
            else
                console.log("Error during record insertion : " + err);
        }
    });
}

function updateRecord(req, res){
    Employee.findOneAndUpdate({_id:req.body._id}, req.body,{new:true},(err,doc)=>{
        if(!err){
            res.redirect('employee/list');
        }
        else{
            // console.log("What happens!!!");
            if(err.name=='ValidationError'){
                handleValidationError(err,req.body);
                res.render("employee/addOrEdit",{
                    viewTitle:'Update Employee',
                    employee: req.body
                });
            }
            else{
                console.log('Error during record update : ' + err);
            }
        }
    });
}

router.get('/employee/list',(req,res)=>{
    // res.json('from list');
    Employee.find().lean().exec((err,docs)=>{
        if(!err){
            // console.log(docs);
            res.render("employee/list",{
                list : docs
            });
        }
        else{
            console.log("Error in retrieving employee list : " + err);
        }
    })
});

function handleValidationError(err,body){
    for (field in err.errors){
        switch(err.errors[field].path){
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }

    }
}

router.get('/employee/:id',(req,res)=>{
    // Employee.findById(req.params.id, (err,doc)=>{
    Employee.findById(req.params.id).lean().exec((err,doc)=>{
        if(!err){
            // console.log(doc)
            // doc = JSON.stringify(doc);
            res.render("employee/addOrEdit",{
                viewTitle:"Update Employee",
                employee: doc
            });
        }
    })
});

router.get('/employee/delete/:id',(req,res)=>{
    Employee.findByIdAndRemove(req.params.id).lean().exec((err,doc)=>{
        if(!err){
            res.redirect('/employee/list');
        }
        else{
            console.log('Error in employee delete : ' + err);
        }
    })
})


module.exports = router;
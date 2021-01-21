var express = require('express');
const { findOne } = require('../modules/user');
var router = express.Router();
const { body, validationResult } = require('express-validator');
const pass_cat_model = require('../modules/pass_cat');
const userModule = require('../modules/user');
const jwt = require('jsonwebtoken');
const all_catagory = pass_cat_model.find({});
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}
const bcrypt = require('bcrypt');

function checkLoginUser(req, res, next){
  const userToken = localStorage.getItem('userToken');
  try {
    var decoded = jwt.verify(userToken, 'loginToken');
  } catch(err) {
    res.redirect('/')
  }
  next();
}
function checkEmail(req, res, next){
  const email = req.body.email;
  const checkexistsemail = userModule.findOne({email:email});
  checkexistsemail.exec((err,data)=>{
    if(err) throw err;
    if(data){
      return res.render('signup', { title: 'Password Managment System', msg: 'User Already Exists..!!!' });
    }
    next();
  });
}
  function checkUsername(req, res, next){
    const username = req.body.uname;
    const checkexistsuser = userModule.findOne({username:username});
    checkexistsuser.exec((err,data)=>{
      if(err) throw err;
      if(data){
        return res.render('signup', { title: 'Password Managment System', msg: 'Username Already Exists..!!!' });
      }
      next();
    });
}
/* GET home page. */
router.get('/', function(req, res, next) {
  const loginUser = localStorage.getItem('loginUser');
  if(loginUser){
    res.redirect('./dashboard')
  }else{
    res.render('index', { title: 'Password Managment System',msg:''});
  }
});
router.post('/', function(req, res, next) {
  const username = req.body.uname;
  const password = req.body.password;
  const checkUser = userModule.findOne({username:username});
  checkUser.exec((err,data)=>{
    if(err) throw err;
    const getUserID = data._id;
    const getPassword = data.password;
    if(bcrypt.compareSync(password,getPassword)){
      const token = jwt.sign({userID:getUserID},'loginToken');
      localStorage.setItem('userToken', token);
      localStorage.setItem('loginUser', username)
      res.redirect('/dashboard');
    }else{
      res.render('index', { title: 'Password Managment System', msg:'Username Or Password is Incorrected' });
    }
    
  });
  
});
router.get('/dashboard', checkLoginUser , function(req, res, next) {
  const loginUser = localStorage.getItem('loginUser');
  res.render('dashboard', { title: 'Password Managment System', loginUser:loginUser ,msg:'' });
});
router.get('/signup',function(req, res, next) {
  const loginUser = localStorage.getItem('loginUser');
  if(loginUser){
    res.redirect('./dashboard')
  }else{
    res.render('index', { title: 'Password Managment System',msg:''});
  }
});
router.post('/signup',checkEmail,checkUsername, checkLoginUser, function(req, res, next) {
  const username = req.body.uname;
  const email = req.body.email;
  const password = req.body.password;
  const confpassword = req.body.confpassword;
  if(password!=confpassword){
    return res.render('signup', { title: 'Password Managment System', msg: 'Password Does not Match..!!!' });
  }else{
    const password = bcrypt.hashSync(req.body.password,10)
    const userDetails = new userModule({
      username:username,
      email:email,
      password:password
    });
    userDetails.save((err,data)=>{
      if(err) throw err;
      res.render('signup', { title: 'Password Managment System', msg: 'User Register Sucessfully..!!!' });
    });
  }
});
router.get('/passwordCategory', checkLoginUser , function(req, res, next) {
  const loginUser = localStorage.getItem('loginUser');
  all_catagory.exec(function(err,data){
    if(err) throw err;
    res.render('password_category', { title: 'Password Managment System', loginUser:loginUser, records:data });
  });
});
router.get('/add_new_category', checkLoginUser,  function(req, res, next) {
  const loginUser = localStorage.getItem('loginUser');
  res.render('addNewCategory', { title: 'Password Managment System', loginUser:loginUser,errors:'', success:'' });
});
router.post('/add_new_category', checkLoginUser ,[body('add_category','Please Enter Category Name').isLength({min:3})],function(req, res, next) {
  const loginUser = localStorage.getItem('loginUser');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render('addNewCategory', { title: 'Password Managment System', loginUser:loginUser, errors:errors.mapped(),success:'' });
  }else{
    const passcatname = req.body.add_category;
    const passDetails = new pass_cat_model({
      password_category: passcatname
    });
    passDetails.save(function(err,data){
      if(err) throw err;
      res.render('addNewCategory', { title: 'Password Managment System', loginUser:loginUser, errors:'', success:'Password Category Insert Sucessfully..!!!' });
    });
  }
  
});
router.get('/passwordDetails', checkLoginUser, function(req, res, next) {
  const loginUser = localStorage.getItem('loginUser');
  res.render('passwordDetails', { title: 'Password Managment System', loginUser:loginUser });
});
router.get('/add_new_password', checkLoginUser,  function(req, res, next) {
  const loginUser = localStorage.getItem('loginUser');
  res.render('addNewPassword', { title: 'Password Managment System', loginUser:loginUser });
});
router.get('/logout',checkLoginUser, function(req, res, next) {
  localStorage.removeItem('userToken');
  localStorage.removeItem('loginUser');
  res.redirect('/')
});

module.exports = router;
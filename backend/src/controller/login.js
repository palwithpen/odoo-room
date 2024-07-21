const express = require('express')
const { API_RESPONSE } = require('../utils/common')
const router = express.Router()
const db = require('../config/db')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * login
 * get all rooms
 * get details by rooms
 * book room
 */

router.post("/",async (req,res,next)=>{
    const { email, password } = req.body;
  try {
    const user = await db.user.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json(API_RESPONSE(400,"INVALID_CREDS"));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json(API_RESPONSE(400,"INVALID_CREDS"));
    }

    const token = jwt.sign({ userId: user.userId }, secretKey, { expiresIn: '1h' });

    res.status(200).json(API_RESPONSE(200,"SUCCESS",token));
  } catch (error) {
    res.status(500).json(API_RESPONSE(500,"EXCEPTION_OCCURRED",error));
  }   
})

const secretKey = 'my-safe-word'; 

router.post("/create", async (req,res,next)=>{
    const { userId, email, password } = req.body;
  try {
    const existingUser = await db.user.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json(API_RESPONSE(400,"USER_ALREADY_EXIST"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({ userId, email, password: hashedPassword });

    return res.status(201).json(API_RESPONSE(201,"USER_ADDED_SUCCESSFULLY"));
  } catch (error) {
    console.log(error)
    return res.status(500).json(API_RESPONSE(500,"EXCEPTION_OCCURRED",error));
}})



module.exports= {login_router:router}
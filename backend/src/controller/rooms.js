const express = require('express')
const { API_RESPONSE } = require('../utils/common')
const room = require('../model/room')
const db = require('../config/db')
const { where } = require('sequelize')
const { authenticateToken } = require('../middleware/authMiddleware')
const router = express.Router()

/**
 * login
 * get all rooms
 * get details by rooms
 * book room
 */

router.get("/:id", authenticateToken ,async (req, res, next) => {
    const { params } = req;
    let result;
  
    try {
      if (params.id === 'all') {
        const rooms = await db.room.findAll();
        result = rooms.map(room => room.dataValues);
      } else {
        const room = await db.room.findOne({ where: { roomId: params.id } });
        result = room ? room.dataValues : null;
      }
  
      if (result) {
        return res.json(API_RESPONSE(200, "SUCCESS", result));
      } else {
        return res.json(API_RESPONSE(404, "NO_ROOMS_FOUND", null));
      }
    } catch (error) {
      console.error(error);
      return res.json(API_RESPONSE(500, "INTERNAL_SERVER_ERROR", null));
    }
  });
  

router.post('/:id', authenticateToken ,async (req, res, next) => {
    const { body, params } = req;
    const { book_slot, booking_date } = body;
  
    if (!book_slot || !booking_date) {
      return res.json(API_RESPONSE(400, "BAD_REQUEST", null));
    }
  
    try {
      const room = await db.room.findOne({ where: { roomId: params.id } });
  
      if (!room) {
        return res.json(API_RESPONSE(400, "NO_ROOM_AVAILABLE", null));
      }
  
      const bookingSlots = room.bookingSlots || [];
      const formattedDate = booking_date; 
  
      let dateEntry = bookingSlots.find(slot => Object.keys(slot)[0] === formattedDate);
  
      if (dateEntry) {
        const existingSlots = dateEntry[formattedDate];
        if (existingSlots.includes(book_slot)) {
          return res.json(API_RESPONSE(200, "SLOT_OCCUPIED", null));
        }
        existingSlots.push(book_slot);
      } else {
        const newEntry = { [formattedDate]: [book_slot] };
        bookingSlots.push(newEntry);
      }
  
      await db.room.update(
        { bookingSlots },
        { where: { roomId: params.id } }
      );
  
      return res.json(API_RESPONSE(200, "SLOT_ADDED", null));
    } catch (error) {
      console.error(error);
      return res.json(API_RESPONSE(500, "INTERNAL_SERVER_ERROR", null));
    }
  });
  

module.exports= {room_router:router}
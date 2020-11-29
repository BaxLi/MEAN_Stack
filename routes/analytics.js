const express=require('express')
const passport=require('passport')

const controller=require('../controllers/analytics')
const router=express.Router()

//http://localhost:5000/api/analytics
router.get('/overview', passport.authenticate('jwt', {session:false}),controller.overview)
router.get('/analytics', passport.authenticate('jwt', {session:false}),controller.analytics) 

module.exports = router

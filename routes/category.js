const express=require('express')
const passport=require('passport')

const upload =require('../middleware/upload')
const controller=require('../controllers/category')
const router=express.Router()

//http://localhost:5000/api/category
router.get('/',passport.authenticate('jwt', {session:false}), controller.getAllCategories)
router.get('/:id',passport.authenticate('jwt', {session:false}),controller.getCategoryById) 
router.delete('/:id',passport.authenticate('jwt', {session:false}),controller.removeCategory) 
router.post('/',passport.authenticate('jwt', {session:false}), upload.single('image'), controller.createCategory) 
router.patch('/:id',passport.authenticate('jwt', {session:false}),upload.single('image'), controller.updateCategory) 

module.exports = router

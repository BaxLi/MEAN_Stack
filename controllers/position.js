const Position = require('../models/Position')
const errorhandler=require('../utils/errorhandler')

module.exports.getByCategoryId = async function(req, res){
    try
    {
        const positions=await Position.find(
            {
                category:req.params.categoryId,
                user:req.user.id
            }
        )
            res.status( 200 ).json( positions )
    } catch ( err )
    {
        errorhandler(res,null,err)
    }
}
module.exports.create = async function(req, res){
console.log("🚀 ~ file: position.js ~ line 20 ~ module.exports.create=function ~ req",
 req.body)
    
    try
    {
        const position= await new Position({
            name: req.body.name,
            cost:req.body.cost,
            category:req.body.category,
            user:req.user.id
        })
        try {
            position.save() 
        } catch (err) {
            errorhandler(res,null,err)
        }        
        res.status( 201 ).json(position )
    } catch ( err )
    {
        errorhandler(res,null,err)
    }
}
module.exports.remove = async function(req, res){
    try
    {
        await Position.remove({_id:req.params.id})
        res.status( 200 ).json( { message: "position deleted successfully" } )
    } catch ( err )
    {
        errorhandler(res,null,err)
    }
}
module.exports.update = async function(req, res){
    try
    {
        const position=await Position.findByIdAndUpdate(
        {_id:req.params.id}, 
        {$set:req.body},
        {new:true}
        )
        res.status( 200 ).json(position)
    } catch ( err )
    {
        errorhandler(res,null,err)
    }
}

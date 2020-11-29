const Category = require( '../models/Category' )
const Position = require( '../models/Position' )
const errorHandler = require( '../utils/errorhandler' )
const { update } = require( './position' )

module.exports.getAllCategories = async function ( req, res )
{
    try
    {
        const result = await Category.find( { user: req.user.id } )
        res.status( 200 ).json( result )

    } catch ( err )
    {
        errorHandler( res, null, { messge: "Can't fetch all categories ... DB connection lost ? " } )
    }
}
module.exports.getCategoryById = async function ( req, res )
{
    try
    {
        const result = await Category.findById( req.params.id )
        res.status( 200 ).json( result )
    } catch ( err )
    {
        errorHandler( res, null, { messge: "Can't fetch category by ID ... DB connection lost ? " } )
    }
}
module.exports.createCategory = async function ( req, res )
{
    try
    {
        const newItem = new Category( {
            user: req.user.id,
            name: req.body.name,
            imageSrc: req.file ? req.file.path : ''
        } )
        await newItem.save()
        res.status( 200 ).json( { message: "NEW category saved successfuly", result: newItem } )
    } catch ( err )
    {
        errHandler( res, null, { messge: "Can't save new category ... DB connection lost ? " } )
    }
}
module.exports.updateCategory = async function ( req, res )
{
    const updated = {
        name: req.body.name
    }
    if ( req.file ) { updated.imageSrc = req.file.path }
    try
    {
        const result = await Category.findOneAndUpdate(
            { _db: req.params.id },
            { $set: updated },
            { new: true }
        )
        res.status( 200 ).json( { message: "category updated successfuly", result: result } )
    } catch ( err )
    {
        errorHandler( res, null, { messge: "Can't update category by ID ... DB connection lost ? " } )
    }
}
module.exports.removeCategory = async function ( req, res )
{
    try
    {
        await Category.deleteOne( { _id: req.params.id } )
        try
        {
            await Position.deleteMany( { category: req.params.id } )
        } catch ( err )
        {
            console.log( "🚀 ~ file: category.js ~ line 75 ~ err", err )
        }

        res.status( 200 ).json( { message: "remove category successfuly" } )
    } catch ( err )
    {
        errorHandler( res, null, { messge: "Can't remove category by ID ... DB connection lost ? " } )
    }
}
const Order = require( '../models/Order' )
const errorHandler = require( '../utils/errorhandler' )

// template /api/order?offset=2&limit=5
module.exports.getAllOrders = async function ( req, res )
{
    try
    {
        const query = { "user": req.user.id, }

        if ( req.query.start )
        {
            query.date = { $gte: req.query.start }
        }
        if ( req.query.end )
        {
            query.date = { ...query.date, $lte: req.query.end }
        }

        req.query.number ? query.order = +req.query.number : 2

        const orders = await Order.find( query )
            .sort( { date: -1 } )
            .skip( parseInt( req.query.offset, 10 ) )
            .limit( parseInt( req.query.limit, 10 ) )

        res.status( 200 ).json( orders )
    } catch ( err )
    {
        errorHandler( err, null, { message: "error getting orders" } )
    }
}

module.exports.createOrder = async function ( req, res )
{
    try
    {
        let maxOrderNr = 0
        const lastOrder = await Order.find( { user: req.user.id } )
        if ( lastOrder )
        { maxOrderNr = lastOrder.length }
        const order = await new Order( {
            order: maxOrderNr + 1,
            list: req.body.list,
            user: req.user.id
        } )
        await order.save()
        res.status( 201 ).json( order )
    } catch ( err )
    {
        errorHandler( err, null, { message: "error creating order" } )
    }
}
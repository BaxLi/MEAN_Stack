const bcrypt = require( 'bcryptjs' )
const jwt = require( 'jsonwebtoken')

const User = require( '../models/User' )
const keys=require('../config/keys')
const errhandler = require( '../utils/errorhandler')

module.exports.login = async function ( req, res )
{
    const candidate = await User.findOne( { email: req.body.email } )
    if ( !candidate) 
    {
        res.status( 404 ).json( {
            message: "missed user registration",
        } )
    } else {
        const passwordResult=bcrypt.compareSync( req.body.password, candidate.password)
        if (!!passwordResult) {
            const token=jwt.sign({
                email: candidate.email,
                userId: candidate._id,
            }, keys.jwt,{expiresIn:60*60})
            res.status( 200 ).json( {
                message: "successfuly logged in ", 
                token: `Bearer ${token}`,
            } )
        } 
        else {
           errhandler(res,401,{message: "wrong password "})
        }
    }
}

module.exports.register = async function ( req, res )
{
    let candidate = ''
    console.log( "req.body", req.body )

    try
    {
        candidate = await User.findOne( { email: req.body.email } )
        if ( candidate === null ) 
        {
            const salt = bcrypt.genSaltSync( 10 )
            const user = new User( {
                email: req.body.email,
                password: bcrypt.hashSync( req.body.password, salt )
            } )

            await user.save()

            if ( await User.findOne( { email: req.body.email } ) !== null )
            { res.status( 201 ).json( { message: `New user ${ req.body.email } created`, user: user } ) }
            else { throw new Error( "creation verification error !~!!" ) }
        }
        else 
        {
            console.log( "ERROR user created - already exist ?" )
            errhandler(res, 409,{ message: `new user: ${ req.body.email } registration error, such email already registered ?` } )
        }

    } catch ( err )
    {
        console.log( "DB find error", err )
        res.status( 400 ).json( { message: `MongoDB Error - ${ err }` } )
    }
}
const JWTStartegy = require( 'passport-jwt' ).Strategy
const extractJWT = require( 'passport-jwt' ).ExtractJwt
const mongoose = require( 'mongoose' )
const User = require('../models/User') //mongoose.model( 'users' )
const keys = require( '../config/keys' )

const options = {
    jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: keys.secretKey
}

module.exports = function ( passport )
{
    passport.use(
        new JWTStartegy( options, async ( payload, done ) =>
        {
            try {
                const user = await User.findById( payload.userId ).select ('email id')
    
                if (user) {
                    done(null, user)
                } else {
                    done(null, false)
                }
            } catch (err) {
                console.log("passport err! - > ", err)     
            }

        } )
    )
}

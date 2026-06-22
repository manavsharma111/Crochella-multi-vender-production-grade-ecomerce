const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/User')
const dotenv = require('dotenv')
dotenv.config()


// Google login ke liye
passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:process.env.GOOGLE_CALLBACK_URL,
    scope: ['profile', 'email']
},
    async(accessToken,refreshToken,profile,done) => {
        try{
            let user = await User.findOne({email:profile.emails[0].value})
            if(user){
                done(null,user)
            }
            else{
                user = new User({
                    name:profile.displayName,
                    email:profile.emails[0].value,
                    googleId:profile.id,
                    profileImage:profile.photos[0].value
                })
                await user.save()
                done(null,user)
            }
        }
        catch(error){
            console.error(error)
            done(error,null)
        }
    })

)


passport.serializeUser((user,done) => {
    done(null,user.id)
})

passport.deserializeUser(async(id,done) => {
    try{
        const user = await User.findById(id)
        done(null,user)
    }
    catch(error){
        console.error(error)
        done(error,null)
    }
})

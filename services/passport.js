const passport = require('passport')
const mongoose = require('mongoose')

const GoogleStrategy = require('passport-google-oauth20').Strategy
const keys = require('../config/keys')
const User = mongoose.model('users')

passport.serializeUser((user, done)=> {
    done(null, user.id)
})

passport.use(
    new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done)=>{

        User.findOne({
            googleId: profile.id
        }).then((user)=>{
            if (user) {
                done(null, user)
            } else {
                new User({
                    googleId:profile.id
                })
                .save()
                .then(user => done(null, user))
            }
        })
    })
)

const express = require("express");
const session = require("express-session");
const passport = require("passport");
const google = express.Router();
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
require("dotenv").config();
const UserModel = require("../models/UserModel");

google.use(
  session({
    secret: process.env.GOOGLE_CLIENT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

google.use(passport.initialize());
google.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await UserModel.findOne({ email: profile._json.email });

        if (!user) {
          const { _json: profileData } = profile;
          const userToSave = new UserModel({
            name: profileData.given_name,
            surname: profileData.family_name,
            email: profileData.email,
            password: "123456789",
          });
          user = await userToSave.save();
        }
        done(null, user);
      } catch (error) {
        console.log(error);
        done(error, null);
      }
    }
  )
);

google.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

google.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const user = req.user;
    const tokenPayload = {
      name: user.name,
      surname: user.surname,
      email: user.email,
      _id: user._id,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET);
    const redirectUrl = `${
      process.env.FRONTEND_URL
    }/success?token=${encodeURIComponent(token)}`;
    res.redirect(redirectUrl);
  }
);

google.get("/logout", (req, res) => {
  req.logout((error) => {
    if (error) {
      console.log("Error logging out:", error);
      return res.redirect("/");
    }
    req.session.destroy((error) => {
      if (error) {
        console.log("Errore durante la distruzione della sessione:", error);
        return res.redirect("/");
      }
      res.clearCookie("connect.sid");
      res.redirect(`${process.env.FRONTEND_URL}/login`);
    });
  });
});

module.exports = google;

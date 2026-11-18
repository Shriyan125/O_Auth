require("dotenv").config();

const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();
const port = 3003;

const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

if (!clientID || !clientSecret) {
  throw new Error("Missing CLIENT_ID or CLIENT_SECRET in .env");
}

app.use(passport.initialize());

passport.use(
  new GoogleStrategy(
    {
      clientID,
      clientSecret,
      callbackURL: "http://localhost:3003/callback",
    },
    (accessToken, refreshToken, profile, next) => {
      console.log(accessToken, profile);
      next(null, profile);
    },
  ),
);

app.get("/", (req, res) => {
  res.send(`<a href="/login">Login with google</a>`);
});

app.get("/login", passport.authenticate("google", { scope: ["profile"] }));

app.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: "/failure",
    session: false,
  }),
  (req, res) => {
    console.log(req.user);
    res.send(`Hi ${req.user.displayName}`);
  },
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
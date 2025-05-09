const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { getDB } = require("./db/mongoClient");

const JWT_SECRET = "supersecretkey";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
  passReqToCallback: true, // ✅ This line is the fix
};

passport.use(
  new JwtStrategy(opts, async (req, jwt_payload, done) => {
    const db = getDB();
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req); // ✅ now req exists

    const revoked = await db.collection("revoked_tokens").findOne({ token });
    if (revoked) return done(null, false);

    const admin = await db
      .collection("admins")
      .findOne({ username: jwt_payload.username });
    if (admin) return done(null, admin);
    else return done(null, false);
  })
);

module.exports = passport;

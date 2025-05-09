const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { getDB } = require("./db/mongoClient");

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JSON WEB TOKEN is missing");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
  passReqToCallback: true,
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
    return admin ? done(null, admin) : done(null, false);
  })
);

module.exports = passport;

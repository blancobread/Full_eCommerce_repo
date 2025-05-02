const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { getDB } = require('./db/mongoClient');

const JWT_SECRET = "supersecretkey";

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    const db = getDB();
    const admin = await db.collection('admins').findOne({ username: jwt_payload.username });

    if (admin) {
        return done(null, admin);
    } else {
        return done(null, false);
    }
}));

module.exports = passport;
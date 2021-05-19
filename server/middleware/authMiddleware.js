module.exports = {
    usersOnly: (req, res, next) => {
        req.session.user ? next() : res.status(401).send('Please log in')
    },

    adminsOnly: (req, res, next) => {
        if (req.session.user.isAdmin === false || req.session.user.isAdmin === null){
            return res.status(403).send('You are not an admin')
        }
        next()
    }
}
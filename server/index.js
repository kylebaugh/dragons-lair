require('dotenv').config()
const express = require('express')
const session = require('express-session')
const massive = require('massive')
const authCtrl = require('./controllers/authController')
const treasureCtrl = require('./controllers/treasureController')
const auth = require('./middleware/authMiddleware')

const PORT = 4000

const app = express()
app.use(express.json())


const {CONNECTION_STRING, SESSION_SECRET} = process.env

massive({
        connectionString: CONNECTION_STRING,
        ssl: {rejectUnauthorized: false}
    })
        .then(db =>{
            app.set('db', db)
            console.log('db connected')
        });

app.use(
    session({
        resave: true,
        saveUninitialized: false,
        secret: SESSION_SECRET
}))


//ENDPOINTS

app.post('/auth/register', authCtrl.register)
app.post('/auth/login', authCtrl.login)
app.get('/auth/logout', authCtrl.logout)

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure)
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure)
app.get('/api/treasure/all',  auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure)



//LISTEN

app.listen(PORT, () => console.log(`Server is running on ${PORT}.`))

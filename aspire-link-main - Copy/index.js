// Declaring Existing Modules
const express = require('express')
const { Server } = require('socket.io')
const path = require('path')
const ejs = require('ejs')
const { fileURLToPath } = require('url')
const mongoose = require('mongoose')
const User = require('./schema/user')
const Room = require('./schema/room')
const AvailRoom = require('./schema/availableRoom')
const Report = require('./schema/reports')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 3500
const ADMIN
// Mongo DB URI
const uri = "mongodb+srv://nihad4394:sYqQ2yjwB23R98sn@cluster0.h1sgj5g.mongodb.net/aspirelink"

// Connecting Database with mongoose driver
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// Declaration of Database
const db = mongoose.connection

// Checking of any error in Database
db.on('error', (error) => console.error(error))

// Once db connection is open send terminal log
db.once('open', () => console.log('Connected to Database'))

// express app declaration
const app = express()

// Seting of ejs view engine
app.set('view engine', 'ejs')

// Using body parser to parse data from client side (Frontend) to server side (Backend)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

// Setting of using static folder route as public
app.use(express.static(path.join(__dirname, "public")))

// Using of cookie parser to parse cookies from client side (Frontend)
app.use(cookieParser())

// Declaration of express server and the port server which the access is on
const expressServer = app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})

// State  of User jonined in room
const UsersState = {
    users: [],
    setUsers: function (newUsersArray) {
        this.users = newUsersArray
    }
}


// Socket io Declaration with cors in case of future update
const io = new Server(expressServer, {
    cors: {
        origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:5500", "http://127.0.0.1:5500"]
    }
})


// socketio on connection to the socket
io.on('connection', socket => {


    // send logs of user connected to socket
    console.log(`User ${socket.id} connected`)

    // Upon connection this sends to only user
    socket.emit('message', buildMsg(ADMIN, "Welcome to  Aspire Link!"))


    socket.on('enterRoom', async({ name, room }) => {

        // leave previous room 
        const prevRoom = getUser(socket.id)?.room

        if (prevRoom) {
            socket.leave(prevRoom)
            io.to(prevRoom).emit('message', buildMsg(ADMIN, `${name} has left the room`))
        }

        const user = activateUser(socket.id, name, room)

        // Cannot update previous room users list until after the state update in activate user 
        if (prevRoom) {
            io.to(prevRoom).emit('userList', {
                users: getUsersInRoom(prevRoom)
            })
        }

        // join room 


      

        socket.join(user.room)

        // To user who joined 


        let roomData = await Room.find({roomId: user.room}).exec()

        console.log(roomData)
        
        socket.emit('message', buildMsg(ADMIN, `You have joined the ${roomData[0].roomtype} chat room`))

        // To everyone else 
        socket.broadcast.to(user.room).emit('message', buildMsg(ADMIN, `${user.name} has joined the room`))

        // Update user list for room 
        io.to(user.room).emit('userList', {
            users: getUsersInRoom(user.room)
        })

        // Update rooms list for everyone 
        io.emit('roomList', {
            rooms: getAllActiveRooms()
        })
    })

    // When user disconnects - to all others 
    socket.on('disconnect', () => {
        const user = getUser(socket.id)
        userLeavesApp(socket.id)

        if (user) {
            io.to(user.room).emit('message', buildMsg(ADMIN, `${user.name} has left the room`))

            io.to(user.room).emit('userList', {
                users: getUsersInRoom(user.room)
            })

            io.emit('roomList', {
                rooms: getAllActiveRooms()
            })
        }

        console.log(`User ${socket.id} disconnected`)
    })

    // Listening for a message event 
    socket.on('message', ({ name, text }) => {
        const room = getUser(socket.id)?.room
        if (room) {
            io.to(room).emit('message', buildMsg(name, text))
        }
    })

    // Listen for activity 
    socket.on('activity', (name) => {
        const room = getUser(socket.id)?.room
        if (room) {
            socket.broadcast.to(room).emit('activity', name)
        }
    })
})

function buildMsg(name, text) {
    return {
        name,
        text,
        time: new Intl.DateTimeFormat('default', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        }).format(new Date())
    }
}

// User functions 
function activateUser(id, name, room) {
    const user = { id, name, room }
    UsersState.setUsers([
        ...UsersState.users.filter(user => user.id !== id),
        user
    ])
    return user
}

function userLeavesApp(id) {
    UsersState.setUsers(
        UsersState.users.filter(user => user.id !== id)
    )
}

function getUser(id) {
    return UsersState.users.find(user => user.id === id)
}

function getUsersInRoom(room) {
    return UsersState.users.filter(user => user.room === room)
}

function getAllActiveRooms() {
    return Array.from(new Set(UsersState.users.map(user => user.room)))
}

// Sends index(main) page to server after passing through a middleware(isAuthenticated)
app.get('/',isAuthenticated, (req, res) => {
    res.render('index')
}
)

// Checks middleware then redirects to login page
app.get('/login',isAuthenticated, (req, res) => {
    res.redirect('/')
}
)


// Sends a post data from client side to server and then authenticates and sets cookies
app.post('/login', (req, res) => {
    console.log(req.body)

    User.find({username: req.body.uname}).then(data=>{
        if(data.length>0){
            if(data[0].password === req.body.password){
                res.cookie('username', req.body.uname)
                res.cookie('password', req.body.password)
                res.redirect('/')
            }else{
                res.render('login')
            }
        }
        else{
            res.redirect('/register')
        }
    })  

}
)

// Checks middleware then sends register page
app.get('/register',isAuthenticated, (req, res) => {
    res.redirect('/')
}
)


// Middlewware declaration
function isAuthenticated(req,res,next){
    
// if loop to check if username and pass exist otherwise sends else
    if(req.cookies.username && req.cookies.password){
        //checks data from database from User schema
        User.find({username: req.cookies.username}).then(data=>{
            //checks pass from db and input database
         if(data.length>0){
            if(data[0].password === req.cookies.password){
                console.log('authenticated')
    //   checks if profile data exist(role)
                if(data[0].role){
                    next()
                }
                else{
                    res.render('role')
                }
                
                
                
            }else{
                //if data is wrong resets the cookies saved
                res.cookie('username', '', {maxAge: 0})
                res.cookie('password', '', {maxAge: 0})

                // checks tp return login or signup
                if(req.originalUrl === '/login'){
                    res.render('login')
                }
                else{
                    res.render('signup')
                }

                
            }
         }
         else{
            res.cookie('username', '', {maxAge: 0})
                res.cookie('password', '', {maxAge: 0})
                if(req.originalUrl === '/login'){
                    res.render('login')
                }
                else{
                    res.render('signup')
                }
         }
        })  

    }else{
                res.cookie('username', '', {maxAge: 0})
                res.cookie('password', '', {maxAge: 0})
                if(req.originalUrl === '/login'){
                    res.render('login')
                }
                else{
                    res.render('signup')
                }
    }

}

// render role page

app.get('/role', (req, res) => {
    res.render('role')
}
)

// Update the role(Profile) of the user (One time)

app.post('/role', (req, res) => {
    console.log(req.body)
    let updateUser = User.updateMany({username: req.cookies.username}, {
        role: req.body.role,
        fname: req.body.fullName,
        subject: req.body.subject,
        qualification: req.body.qualification,
        reason: req.body.reason
    }).then(()=>{
        res.redirect('/')
    })

})


// Register the user and save to database then send back cookies
app.post('/register', (req, res) => {
    console.log(req.body)

    const user = new User({
        username: req.body.uname,
        email: req.body.email,
        password: req.body.password,
    })

    user.save()
        .then(() => {
            res.cookie('username', req.body.uname)
            res.cookie('password', req.body.password)
            res.redirect('/login')
        })
        .catch((err) => {
            console.log(err)
        })

}
)



// post request to join room
app.post('/joinRoom',isAuthenticated, (req, res) => {
    let searchRoom = Room.find({roomtype: req.body.search}).then((data)=>{
        console.log(data)
        res.cookie('roomId', data[0].roomId)
        res.cookie('roomType', data[0].roomtype)
        res.render('roomRev')
    }
    )
})

// search feature in main page for searching rooms
app.post('/getRoom', async (req, res) => {
    let payload = req.body.payload.trim();
    let searchRoom = await Room.find({roomtype:{$regex: new RegExp('^' + payload + '.*', 'i')}}).exec();

    let search = searchRoom.slice(0, 10);

   console.log(search.length)

   if(search.length > 0){
    res.send({
        payload: search
    });
    }
    else{
        let allRoom = await Room.find().exec();
        res.send({
            payload: allRoom
        });
    }
    
})   

// create room post requests for admin
app.post('/createRoom', (req, res) => {
   
    let createRoom = new Room({
        roomId: req.body.roomId,
        roomtype: req.body.roomType,
        roomcapacity: req.body.roomcapacity
    })
    createRoom.save().then(()=>{
        res.send('room added')
    }
    )
})


// admin athentication
app.get('/admin',adminAuthenticated, (req, res) => {
    res.render('admin')
}
)

// admin login post request
app.post('/admin', (req, res) => {

    console.log(req.body)

    if(req.body.uname == 'nihad' && req.body.password =='admin'){
        res.cookie('adminUsername', req.body.uname)
        res.cookie('adminPassword', req.body.password)
        res.render('admin')
    }
    else{
        res.cookie('adminUsername', '', {maxAge: 0})
        res.cookie('adminPassword', '', {maxAge: 0})
        res.render('adminLogin')

    }

}
)

// check if admin already authenticated if true sets cookies else resets them
function adminAuthenticated(req,res,next){
    
    if(req.cookies.adminUsername && req.cookies.adminPassword){
        if(req.cookies.adminUsername === 'nihad' && req.cookies.adminPassword === 'admin'){

            next()
        }else{

            res.cookie('adminUsername', '', {maxAge: 0})
            res.cookie('adminPassword', '', {maxAge: 0})
            res.render('adminLogin')
        }
    }else{
        res.cookie('adminUsername', '', {maxAge: 0})
            res.cookie('adminPassword', '', {maxAge: 0})
        res.render('adminLogin')
    }

}


// search all mentor in db and send to admin
app.get('/allMentors', (req, res) => {
    User.find({role: 'mentor'}).then(data=>{
        res.send(data)
    })
}
)

// search all student in db and send to admin
app.get('/allStudents', (req, res) => {
    User.find({role: 'student'}).then(data=>{
        res.send(data)
    })
}
)

// searches all reports in db and send to admin
app.get('/allReports', (req, res) => {


    Report.find().then(data=>{

        console.log(data)
        res.send(data)
    })
}
)

// allows users to report another user
app.post('/reportUser', (req, res) => {
    console.log(req.body)

    const report = new Report({
        user: req.body.user,
        reason: req.body.reason
    })

    report.save().then(()=>{
        res.send('reported')
    })
}
)

// delete the reported user in admin
app.post('/removeReport', (req, res) => {
    console.log(req.body)

    Report.deleteMany({ user: req.body.user }).then(data=>{
        console.log('deleted')
        User.deleteMany({ username: req.body.user }).then(data=>{
            console.log('deleted')
            res.send(data)
        })
    })
}
)

// delete any user in admin
app.post('/removeUser', (req, res) => {
    console.log(req.body)

    User.deleteMany({ username: req.body.username }).then(data=>{
        console.log('deleted')
        res.send(data)
    })
}
)


app.post('/addRoom', (req, res) => {
    const room = new Room({
        roomId: req.body.roomId,
        roomtype: req.body.roomType,
        roomcapacity: req.body.roomcapacity
    })

    room.save().then(()=>{
        res.redirect('/admin')
    })
}
)

app.get('*',(req,res)=>{
    res.redirect('/')
} )
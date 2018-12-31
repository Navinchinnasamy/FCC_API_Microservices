const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const exercises = require("./exerciseTracker.js");
const createNewUser = exercises.createNewUser;
const createNewExercise = exercises.createNewExercise;
const findExcistingUser = exercises.findExcistingUser;
const getExercisesForUser = exercises.getExercisesForUser;

/* Adding new User */
app.post("/api/exercise/new-user", function(req, res){
  // Create new user
  let newUser = {
    "userName": req.body.username
  };
  findExcistingUser(newUser, function(err, data){
    if(err){
      res.send(err.errors.userName.message);
    }
    if(data){
      res.send("Username "+data.userName+" already taken, try something else.");
    } else {
      createNewUser(newUser, function(err, data){
        if(err){
          res.send(err.errors.userName.message);
        }
        res.json(data);
      });
    }
  });
});

/* Adding Exercise for User using User Id */
app.post("/api/exercise/add", function(req, res){
  let exercise = {
    userId: req.body.userId,
    description: req.body.description,
    duration: req.body.duration,
    exerciseDate: req.body.date
  };
  findExcistingUser({ _id: exercise.userId }, function(err, data){
    if(err){
      console.log(err);
      res.send("Please enter a valid User ID");
    }
    if(data){
      createNewExercise(exercise, function(err, data){
        if(err){
          var errMsg = '';
          if (err) {
            for (var field in err.errors) {
              errMsg += err.errors[field].message+"<br/>";
            }
          }
          res.send(errMsg);
        }
        res.json(data);
      });
    } else {
      res.send("Please enter a valid User ID.");
    }
  });
  
});

/* Ger exercise log for a specific user */
app.get("/api/exercise/log", function(req, res){
  getExercisesForUser(req.query, function(err, excsData){
    if(err){
      console.log(err);
    }
    if(excsData){
      let ret = {
        _id: req.query.userId
      }
      findExcistingUser(ret, function(err, userData){
        ret.username = userData.userName;
        ret.count = excsData.length;
        ret.log = excsData;
        res.json(ret);
      });
    } else {
      res.send("No exercise found");
    }
  });
});


// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

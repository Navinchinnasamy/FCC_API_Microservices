const mongo = require('mongodb');
const mongoose = require('mongoose');
const shortid = require('shortid');

mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track' );
const Schema = mongoose.Schema;

const userSchema = Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  userName: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const exerciseSchema = Schema({
  userId: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, Number, required: true },
  exerciseDate: { type: String, Date, required: true },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const userModel = mongoose.model("ExerciseUser", userSchema);
const exerciseModel = mongoose.model("ExerciseEntries", exerciseSchema);

let createNewUser = function(data, done){
  let newUser = new userModel(data);
  newUser.save(function(err, data){
    if(err){
      done(err);
    }
    done(null, data);
  });
};

let createNewExercise = function(data, done){
  let newExercise = new exerciseModel(data);
  newExercise.save(function(err, data){
    if(err){
      done(err);
    }
    done(null, data);
  });
};

let findExcistingUser = function(data, done){
  userModel.findOne(data, function(err, user){
    if(err){
      done(err);
    }
    done(null, user);
  });
};

let getExercisesForUser = function(data, done){
  let search = {
    userId: data.userId
  };
  if(data.from && data.to){
    search.exerciseDate = {
      $gte: Date(data.from),
      $lt: Date(data.to)
    };
  } else if(data.from){
    search.exerciseDate = {
      $gte: Date(data.from)
    };
  } else if(data.to){
    search.exerciseDate = {
      $lt: Date(data.to)
    };
  }
  if(data.limit){
    exerciseModel.find(search).limit(data.limit).exec(done);
  } else {
    exerciseModel.find(search).exec(done);
  }
};


exports.createNewUser = createNewUser;
exports.createNewExercise = createNewExercise;
exports.findExcistingUser = findExcistingUser;
exports.getExercisesForUser = getExercisesForUser;
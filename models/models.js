var mongoose = require("mongoose");
//mongoose.set('debug', true);

var PersonSchema = new mongoose.Schema({
  name: String,
  //foo: {type:String, default:"bar"},
  things: [{type: mongoose.Schema.ObjectId,ref: "Thing"}],
  numberOfThings: {type: Number,default: 0},
  favoritePlaces: [{type: mongoose.Schema.ObjectId, ref: "Place"}],
  numberOfFavoritePlaces: {type: Number, default: 0}
});
PersonSchema.statics.getOneByName = function(name, cb) {
  this.findOne({name: name}).populate("things").exec(cb);   //.populate("favoritePlaces")?
};
PersonSchema.statics.getOneById = function(id, cb) {
  this.findOne({_id: id}, cb);
};
PersonSchema.statics.getAll = function(cb) {
  this.find({}).sort("name").exec(cb);
};
PersonSchema.statics.acquire = function(personId, thingId, cb) {
  Thing.findById(thingId, function(err, _thing) { 
    if (_thing.numberInStock <= 0) {
      return cb({message: "NONE_IN_STOCK"});
    }
    var qry = {_id: personId};
    var update = {
      $push: {things: thingId},
      $inc: {numberOfThings: 1}
    };
    Person.update(qry, update, function(err) {
      var query = {_id: thingId};
      var update = {
        $inc: {numberOwned: 1, numberInStock: -1}
      }
      Thing.update(query, update, function() {
        cb();
      });
    });
  });
};
PersonSchema.statics.returnThing = function(personId, thingId, cb) {
  this.getOneById(personId, function(err, _person) {
    var index = _person.things.indexOf(thingId);
    if (index == -1)
      return cb({message: "USER_DOES_NOT_OWN"}, null);
    _person.things.splice(index, 1);
    _person.numberOwned = _person.numberOwned + 1;
    _person.save(function(err) {
      var query = {_id: thingId};
      var update = {
        $inc: {numberOwned: -1, numberInStock: 1}
      };
      Thing.update(query, update, function() {
        cb();
      });
    });
  });
};
PersonSchema.statics.addPlace = function(personId, placeId, cb) {
  Place.getOneById(placeId, function(err, _place) {
    var place = _place;
    Person.getOneById(personId, function(err, _person) {
      var person = _person;
      if (person.favoritePlaces.indexOf(place)!=-1) {
        return cb({message: "PLACE_ALREADY_FAVORITED"});
      }
      var whereid= {_id:personId};
      var fields = {
        $push: {favoritePlaces: place},
        $inc: {numberOfFavoritePlaces:1}
      };
      Person.update(whereid,fields, function(err) {
        var whereid= {_id:placeId};
        var fields = { $inc: {numberOfTimesFavorited:1} };
        Place.update(whereid, fields, function(err) {
          cb();
        });
      });
    });
  });
}
PersonSchema.statics.removePlace = function(personId, placeId, cb) {
  Person.getOneById(personId, function(err, _person) {
    var person = _person;
    var index = person.favoritePlaces.indexOf(placeId); 
    if (index!=-1) {
      person.favoritePlaces.splice(index,1);
      person.numberOfFavoritePlaces--;
      person.save(function(err, person, rows) {
        var whereid = {_id:placeId};
        var fields = {$inc: {numberOfTimesFavorited: -1}}
        Place.update(whereid, fields, function() {
          cb();
        });
      });
    } else {cb();}
  });
}
PersonSchema.statics.findAllWhoFavoritedPlace = function(placeId, cb) {
  // this.find({favoritePlaces: {$in: placeId}}).sort("name").exec(cb);  
  // this.find({}).where(function() {
  //   return (this.favoritePlaces.indexOf(placeId)!=-1) ? true:false;
  // }).sort("name").exec(cb);  
  //this.$where(this.favoritePlaces.indexOf(placeId)!=-1).sort("name").exec(cb);  
  this.find({favoritePlaces: placeId}).sort("name").exec(cb);  //oh, it was easy :P
  //this.find({}).sort("name").exec(cb);  
}
var Person = mongoose.model("Person", PersonSchema);





var ThingSchema = new mongoose.Schema({
  name: String,
  numberOwned: {type: Number, default: 0},
  numberInStock: Number
});
ThingSchema.statics.getOneByName = function(name, cb) {
  this.findOne({name: name}, cb);
};
ThingSchema.statics.getOneById = function(id, cb) {
  this.findById(id, cb);
};
ThingSchema.statics.getAll = function(cb) {
  this.find({}).sort("name").exec(cb);
};
var Thing = mongoose.model("Thing", ThingSchema);




var PlaceSchema = new mongoose.Schema({
  name: String,
  numberOfTimesFavorited: {type: Number, default: 0},
});
PlaceSchema.statics.getOneByName = function(name, cb) {
  this.findOne({name: name}, cb);
};
PlaceSchema.statics.getOneById = function(id, cb) {
  this.findById(id, cb);
};
PlaceSchema.statics.getAll = function(cb) {
  this.find({}).sort("name").exec(cb);
};
PlaceSchema.statics.getAllFavoritedPlaces = function(cb) {
  this.find({ numberOfTimesFavorited: {$gt:0} }).sort("name").exec(cb);
}
PlaceSchema.statics.getAllUnFavoritedPlaces = function(cb) {
  this.find({ numberOfTimesFavorited: {$lt:1} }).sort("name").exec(cb);
}
var Place = mongoose.model("Place", PlaceSchema);




function seed(cb) {
  var people = [
    {name: "Moe"}, 
    {name: "Larry"}, 
    {name: "Curly"}
  ];
  var things = [
    {name: "Rock", numberInStock: 10},
    {name: "Paper",numberInStock: 10}, 
    {name: "Scissors",numberInStock: 10}
  ];
  var places = [
    {name:"New York", numberOfTimesFavorited:0},
    {name:"London", numberOfTimesFavorited:0},
    {name:"Paris", numberOfTimesFavorited:0}
  ];
  Person.remove({}, function() {
    Person.create(people, function(err, moe, larry, curly) {
      Thing.remove({}, function() {
        Thing.create(things, function(err, rock, paper, scissors) {
          Place.remove({}, function() {
            Place.create(places, function(err, ny, london, paris) {
              cb(err, moe,larry,curly, rock,paper,scissors, ny,london,paris);
            });
          });
        });
      });
    });
  });
}

module.exports = {
  seed: seed,
  Person: Person,
  Thing: Thing,
  Place: Place
};
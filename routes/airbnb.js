var express = require('express');
var mongoClient = require('./../mongo/config')
var mongoQueries = require('./../mongo/queries')
var router = express.Router();


// localhost:3000/airbnb
router.get('/', (req, res) => {
  res.render('airbnb', {title:'AirBnb', mongoHost:mongoClient.options.srvHost});
});

/* GET users listing. 
  localhost:3000/airbnb/send
*/


router.get('/find-one', async (req,res)=>{

  console.log(req.query)


  let criteria = 
    {   bedrooms:{$gte:  parseInt(req.query.bedrooms)}, 
        number_of_reviews:{$gte: parseInt(req.query.number_of_reviews)}, 
        "address.country" : req.query.countries 
      }

  if (req.query.amenities)
    criteria ["amenities"] = {$all : req.query.amenities}

  let listing = await mongoQueries.findListing(criteria);
  res.render("listing", {listing})
  //res.send(listing)
})

router.get ("/find-many", (req,res)=>{

  let criteria =
  {
    bedrooms: { $gte: parseInt(req.query.bedrooms) },
    number_of_reviews: { $gte: parseInt(req.query.number_of_reviews)},
    //numListings : parseInt(req.query.numListings),
    "address.country" : req.query.countries,
      
  }
  let projection = {}

  mongoQueries.findListings(res,criteria,projection,parseInt(req.query.numListings))


})

router.get("/view-one/:id", async (req,res)=>{

    let criteria = 
    {
      _id: req.params.id
    }


    let listing = await mongoQueries.findListing(criteria);
    res.render("listing", {listing})
})






module.exports = router;

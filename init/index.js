const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main().then(()=>{
    console.log("Connected Succsesfully");
})
.catch((err)=>{
    console.log(err);
})

async function init(){
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner: '66588b81b682537b8235720f',geometry: {
        type: 'Point',
        coordinates: [ 74.0541108203647, 15.3255560468503 ]
      }
    }));
    await Listing.insertMany(initData.data);
    console.log("Data save succsesfully");
}

init();
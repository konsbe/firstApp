const mongoose = require('mongoose')

const Kitesurf = require('../models/kitesurf')

mongoose.connect('mongodb://localhost:27017/kiteEquip', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const kitep = [
    {
        name: 'RRD Kite',
        price: 250,
        category: 'kitsurf',
        subcategory: 'kite',
        size: '9',
        company: "RRD",
        description: '9m kite'

    },
    {
        name: 'SlingShot bar',
        price: 120,
        category: 'kitesurf',
        subcategory: 'bar',
        size: '40',
        company: 'slingshot',
        description: '4th line'
    },
    {
        name: 'Mystic dirty Habbits',
        price: 200,
        category: 'kitesurf',
        subcategory: 'harness',
        size: 'MD',
        company: "Mystic",
        description: 'MD Harness chillfull'
    },
    {
        name: 'Airush',
        price: 200,
        category: 'kitesurf',
        subcategory: 'board',
        size: '9',
        company: 'Airush',
        description: 'carbon freestyle'
    }
]

const seedDB = async () => {
    await Kitesurf.deleteMany({});

    for (let i of kitep) {
        const gear = new Kitesurf({
            name: `${i.name}`,
            image: `${i.image}`,
            price:`${i.price}`,
            category:`${i.category}`,
            subcategory:`${i.subcategory}`,
            size:`${i.size}`,
            company:`${i.company}`,
            description:`${i.description}`
        })
        await gear.save();
    }


    // await c.save();
}

seedDB().then(() => {
    mongoose.connection.close();
});







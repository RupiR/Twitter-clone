const express = require('express');
const cors = require('cors');
const monk = require('monk');
const Filter = require('bad-words');
const rateLimit = require('express-rate-limit');


const app = express();

const db = monk('localhost/woofer');
const woof = db.get('woof');
const filter = new Filter();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Woof! 🐕'
    });
});

app.get('/woof', (req, res) => {
    woof
        .find()
        .then(woof => {
            res.json(woof);
        })
});

function isValidWoof(woof) {
    return woof.name && woof.name.toString().trim() !== '' &&
        woof.content && woof.content.toString().trim() !== '';
}

app.use(rateLimit({
    windowMs: 30 * 1000, //30 SECONDS
    max: 1 // limit each IP to 1 request per windowMs
}));

app.post('/woof', (req, res) => {
    if (isValidWoof(req.body)) {
        // insert into db... 
        const woof = {
            name: filter.clean(req.body.name.toString()),
            content: filter.clean(req.body.content.toString()),
            created: new Date(),
        };

        woof
            .insert(woof)
            .then(createdWoof => {
                res.json(createdWoof);
            });
    } else {
        res.status(422);
        res.json({
            message: 'Hey! Name and Content are required'
        })
    }
});

app.listen(5000, () => {
    console.log('Listening on http://localhost:5000');
})
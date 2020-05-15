const express = require('express');
const cors = require('cors');
const monk = require('monk');

const app = express();

const db = monk('localhost/woofer');
const woof = db.get('woof');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Woof! 🐕'
    });
});

function isValidWoof(woof) {
    return woof.name && woof.name.toString().trim() !== '' &&
        woof.content && woof.content.toString().trim() !== '';
}

app.post('/woof', (req, res) => {
    if (isValidWoof(req.body)) {
        // insert into db... 
        const woof = {
            name: req.body.name.toString(),
            content: req.body.content.toString(),
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
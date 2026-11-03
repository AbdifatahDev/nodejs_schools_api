
const express = require('express');
const multer = require('multer');
const functions = require('./controllers/schools_api');


const app = express();


const upload = multer();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/', upload.none(), async (req, res) => {

    const requestType = req.method;

    switch (requestType) {

        case 'POST': {

            const action = req.body.action;

            if (typeof functions[action] === 'function') {
                return functions[action](req, res);
            }

            return res.json({
                status: false,
                message: 'Invalid action'
            });
        }

        case 'GET':
            return functions.showInstructions(req, res);

        case 'DELETE':
            return res.send(requestType);

        default:
            return res.send(requestType);
    }

});

app.listen(3000, () => {
    console.log('API running on port 3000');
});

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const multer = require('multer');
const { queryaction } = require('./helper/query');
const getquery = require('./config/query.json')
 
const app = express();
app.use(express.json());    
app.use(cors());

app.get('/getquery', async(req, res) => {
    return res.send({
        "query" : getquery.query
    });
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      req.filename = uniqueSuffix + '-' + file.originalname;
      cb(null, uniqueSuffix + '-' + file.originalname )
    }
})
  
const upload = multer({ 
    storage: storage, 
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "application/json" || file.mimetype == "text/plain") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .json format allowed!'));
        }
    }
}).single('file');

app.post('/upload', async(req, res) => {

    upload(req, res, function (err) {
        if(!req.file){
            return res.status(400).send({ "msg": "no data provide" });
        }
        
        if (err instanceof multer.MulterError) {
          return res.status(503).send({ "msg": "service unavailable" });
        } else if (err) {
          return res.status(400).send({ "msg": "wrong file extension" });
        }
        return res.send({ "filename" : req.filename });
    })
})

app.post('/action', async(req, res) => {

    const { filename, query, for_whom, limit } = req.body;

    if(filename === ""){
        return res.status(400).send({ "msg": "select appropriate condition" });
    }

    const readStream = fs.createReadStream('./uploads/' + filename, 'utf-8');

    let result = '';
    readStream.on('data', (chunk) => {
        result = queryaction(JSON.parse(chunk), query, for_whom, limit);
    });
    
    readStream.on('end', () => {
        if(result == '')
            return res.status(400).send({ "result" : "no match found"})
        return res.send(result);
    });
})

app.listen(5000, () => {
    console.log('server up');
})
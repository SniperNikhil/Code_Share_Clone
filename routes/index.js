var express = require('express');
const path = require("path");
const fs = require("fs");
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/:params', function (req, res, next) {
    // Access the parameter using req.params
    const paramValue = req.params.params;
    const filePath = path.join(__dirname,"..", 'public', 'codefiles', paramValue);
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            // Handle error if the file does not exist or cannot be read
            // console.error(err);
            return res.status(404).render('error', { message: 'File not found.' });
        }
        res.cookie("filename", paramValue, { maxAge: 36000000, path: '/' });
        // Use the paramValue as needed, for example, passing it to the view
        res.render('index', {
            param: data // Sending the file content to the view
        });
    });
});


module.exports = router;

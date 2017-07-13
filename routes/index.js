var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/', function(req, res){
	console.log('POST req received');

	var text = req.body.text,
        numOfChar = text.length,
        chars = new Array(numOfChar), 
        charGroup, 
        i,
        offsetWidth = 0;
console.log('1');
    for(i=0; i<numOfChar; i++){
        chars[i] = new fabric.Text(text[i], {
            fontSize: 50,
            left: offsetWidth,
            fontFamily: req.body.fontFamily
        });
        offsetWidth += chars[i].width;
    }
    fixedWidth = offsetWidth;
console.log('2');
    charGroup = new fabric.Group(chars, {
        top: 50,
        left:50
    });
console.log('3');
	res.send(charGroup.toJSON());
	console.log('data sent')
});

module.exports = router;

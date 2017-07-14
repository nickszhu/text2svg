var express = require('express');
var fs= require('fs');
var router = express.Router();
var fabric = require('fabric').fabric;
var Canvas = require('canvas');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/', function(req, res){
	
    var text = req.body.text,
        numOfChar = text.length,
        chars = new Array(numOfChar), 
        charGroup, 
        i,
        offsetWidth = 0,
        fontFamily = req.body.fontFamily,
        path = '/Users/ShihangZhu/text2svg/public/stylesheets/fonts/'+fontFamily+'.ttf';


    fs.exists(path, function(exists) { 
        console.log(exists ? "路径存在" : "路径不存在");  
    });
    
    if(fontFamily !== "Songti SC"  ){
        console.log('12345')
        // Canvas.registerFont(path, {family: fontFamily});
        console.log('font loaded successfully');
    }

    var canvas = new Canvas(200, 200)
    var ctx = canvas.getContext('2d')

    // Write "Awesome!"
    // ctx.font = '30px ' + fontFamily
    ctx.rotate(0.1)
    ctx.fillText('Awesome!', 50, 100)

    console.log(ctx, '77777777')

    // var canvas = fabric.createCanvasForNode(500, 300);


//     for(i=0; i<numOfChar; i++){
//         chars[i] = new fabric.Text(text[i], {
//             fontSize: 50,
//             left: offsetWidth,
//             fontFamily: fontFamily
//         });
//         offsetWidth += chars[i].width;
//     }
// console.log('1');
//     charGroup = new fabric.Group(chars, {
//         top: 50,
//         left:50
//     });
// console.log('2', canvas.add);
//     canvas.add(charGroup);
// console.log('3');
    res.send(ctx);
console.log('4');
});

module.exports = router;

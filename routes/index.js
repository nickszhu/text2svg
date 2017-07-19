var express = require('express');
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
        path = '/Users/ShihangZhu/text2svg/public/stylesheets/fonts/'+fontFamily+'.ttf',
        hasShadow = (req.body.hasShadow == "true") ? 'rgba(0,0,0,0.3) 5px 5px 5px' : '',
        isBold = (req.body.isBold == "true") ? 'bold' : 'normal' ,
        color = req.body.color,
        curvature = req.body.curvature,
        fontSize = req.body.fontSize;
  
    if(fontFamily !== "Songti SC"  ){
        Canvas.registerFont(path, {family: fontFamily});
    }

    if(curvature == 0){
        
        charGroup = new fabric.Text(text,{
            fontSize: fontSize,
            fontFamily: fontFamily,
            shadow: hasShadow,
            fontWeight: isBold,
            fill: color
        })
    }
    else{
        for(i=0; i<numOfChar; i++){
            chars[i] = new fabric.Text(text[i], {
                fontSize: fontSize,
                left: offsetWidth,
                fontFamily: fontFamily,
                shadow: hasShadow,
                fontWeight: isBold,
                fill: color
            });
            offsetWidth += chars[i].width;  
        }    
        
        
        var obj = new fabric.Group(chars,{left: 0,top: 20}),
            delta = (180 / Math.PI),
            newChars = new Array(obj.size()),
            arcLength = offsetWidth,
            minRadius = (arcLength / Math.PI)/2,
            radius = this.value==0 ? null : minRadius/curvature + obj.item(0).getLineHeight(),
            centerX = obj.oCoords.mb.x,
            centerY = obj.oCoords.mb.y + radius,
            center = new fabric.Point(centerX,centerY),
            bottomCenter = obj.oCoords.mb,
            offsetTheta =  - (arcLength/radius)/2,
            i, newCharGroup, theta ;

        function rotateByPoint(obj,center,radians){
            var leftTop = new fabric.Point(obj.left, obj.top);
            leftTop.subtractEquals(center);
            var v = fabric.util.rotateVector(leftTop, radians);
            var newLeftTop = new fabric.Point(v.x, v.y).addEquals(center);
            obj.setPositionByOrigin(newLeftTop,'left','top');
            obj.angle += radians * delta;
        }
 
        for (i=0; i<obj.size(); i++) {
            newChars[i] = obj.item(i).clone();
            newChars[i].angle = 0;
            newChars[i].setPositionByOrigin(bottomCenter,'bottom','center');
            theta = newChars[i].getWidth() / radius;

            offsetTheta += theta/2;
            rotateByPoint(newChars[i],center,offsetTheta);
            offsetTheta += theta/2;
        }
 
        charGroup = new fabric.Group(newChars, {
          left: 0,
          top: 20
        });     
    }
  
    res.send(charGroup.toDataURL());
});

module.exports = router;

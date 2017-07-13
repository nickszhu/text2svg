(function(){
    var canvas = this.__canvas = new fabric.Canvas('canvasCtn');
    fabric.Object.prototype.transparentCorners = false;
    var getById = function(id){return document.getElementById(id)};
    var fixedWidth;

    getById('create-text').onclick = function(){
        var text = getById("text").value.trim(),
            numOfChar = text.length,
            chars = new Array(numOfChar), 
            charGroup, 
            i,
            offsetWidth = 0;

        for(i=0; i<numOfChar; i++){
            chars[i] = new fabric.Text(text[i], {
                fontSize: 50,
                left: offsetWidth,
                fill: getById('select-color').value,
                fontFamily: getById("select-font").value
            });
            offsetWidth += chars[i].width;
        }
        fixedWidth = offsetWidth;
        charGroup = new fabric.Group(chars, {
            top: 50,
            left:50
        });

        canvas.add(charGroup);
        canvas.setActiveObject(canvas.item(0));
    };

    getById('add-pattern').onchange = function() {
        if(typeof FileReader == 'undefined'){  
            alert("<p>你的浏览器不支持FileReader接口！</p>");  
            return false;
        }  
        
        var obj = canvas.getActiveObject();
        if (!obj) return

            var file = this.files[0]; 
        if(!/image\/\w+/.test(file.type)){  
            alert("IMAGE file required!");  
            return false;  
        }  
        
        var reader = new FileReader();  
        reader.readAsDataURL(file);  
        reader.onload = function(e){  
            fabric.util.loadImage(this.result, function(img) {
                obj.setFill(new fabric.Pattern({
                    source: img,
                    repeat: 'repeat',
                    offsetX: 300,
                    offsetY: 200
                })) ;
                canvas.renderAll(); 
            })
        }  

        
    };

    getById('add-shadow').onclick = function() {
        var obj = canvas.getActiveObject();
        if (obj) {

            var fontWeight= this.value;
            obj.forEachObject(function(obj,i,arr){
                if(arr[i].shadow){
                    arr[i].setShadow('');
                }else{
                    arr[i].setShadow('rgba(0,0,0,0.3) 5px 5px 5px');
                }
            },obj);
            canvas.renderAll();
        }

    };

    getById('create-img').onclick = function() {
        // html2canvas(getById('canvasCtn'), {
        //     onrendered: function(canvas) {
        //         document.body.appendChild(canvas);
        //     }
        // })

        var obj = canvas.getActiveObject();
        var svgString = obj.toSVG();
        getById('img-ctn').innerHTML = svgString;

         // svgString = '<svg' + svgString.split('<svg')[1];
         // console.log(svgString);
         //            var svg = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
         //            var DOMURL = window.URL || window.webkitURL || window;
         //            var url = DOMURL.createObjectURL(svg);
         //            image.src= url;
     }

     getById('select-color').onchange = function() {
        var obj = canvas.getActiveObject();
        if (obj) {
            obj.setFill(this.value);
            canvas.renderAll();
        }
    };

    getById('select-font').onchange = function() {
        var obj = canvas.getActiveObject();

        if (obj) {var fontFamily = this.value;
            obj.forEachObject(function(obj,i,arr){
                arr[i].setFontFamily(fontFamily);
            },obj);
            canvas.renderAll();
        }
    };


    getById('select-fontsize').onclick = function() {
        var obj = canvas.getActiveObject();
        if (obj) {
            obj.forEachObject(function(obj,i,arr){
                arr[i].setFontWeight( (arr[i].fontWeight == 'normal') ? 'bold' : 'normal' );
            },obj);
            canvas.renderAll();
        }    
    };

    getById('select-curvature').onchange = function(){
        var obj = canvas.getActiveObject();
        if (obj == null) {return}
            var delta = (180 / Math.PI),
        newChars = new Array(obj.size()),
        arcLength = fixedWidth,
        minRadius = (arcLength / Math.PI)/2,
        radius = this.value==0 ? null : minRadius/this.value + obj.item(0).getLineHeight(),
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

        newCharGroup = new fabric.Group(newChars, {
          left: 100,
          top: 100
      });

        canvas.add(newCharGroup);
        canvas.renderAll();

    }


    document.onkeydown = function(event){
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if(e && e.keyCode==8){ 
            var obj = canvas.getActiveObject();
            canvas.remove(obj);
            canvas.renderAll();
        }
    }; 


    $("#test").click(function(){
        $.post("/",
        {
        text: $("#text").val(),
        fontFamily: $("#select-font").val()
        },
        function(data,status){
            if (status == 'success'){
                alert(data);
            }
            
        });
    });


})();
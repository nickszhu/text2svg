(function(){
    var canvas = new fabric.Canvas('canvasCtn');
    fabric.Object.prototype.transparentCorners = false;
    var hasShadow = false,
        isBold = false ;

    function sendPOSTrequest(){
        $.post("/",
        {
        text: $("#text").val(),
        fontFamily: $("#select-font").val(),
        hasShadow: hasShadow,
        color: $("#select-color").val(),
        isBold: isBold,
        curvature: $('#select-curvature').val(),
        fontSize: $('#select-fontSize').val()
        },
        function(data,status){
            if (status == 'success'){
                canvas.clear();
                fabric.Image.fromURL(data,function(img) {
                    canvas.add(img).renderAll();
                    canvas.setActiveObject(canvas.item(0));
                });
            }  
        });
    }

    $('#add-pattern').change(function() {
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
                    repeat: 'repeat'
                })) ;
                canvas.renderAll(); 
            })
        }      
    });

    $('#add-shadow').click(function() {
        hasShadow = (hasShadow)? false : true;
        sendPOSTrequest();
    });

    $('#create-img').click(function() {
        var obj = canvas.getActiveObject();
        var urlString = obj.toDataURL();
        window.open(urlString);
     });

     $('#select-color').change(function() {
        sendPOSTrequest();
    });

    $('#select-font').change(function() {
        sendPOSTrequest();
    });

    $('#select-fontsize').click (function() {
        isBold = (isBold)? false : true;
        sendPOSTrequest();   
    });

    $('#select-curvature').change(function(){
        sendPOSTrequest();
    });

    $('#select-fontSize').change(function(){
        sendPOSTrequest();
    });

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
                console.log(data);
            }
            canvas.loadFromJSON(data,canvas.renderAll.bind(canvas));
            fixedWidth = canvas.getActiveObject().width;
        });
    });
})();
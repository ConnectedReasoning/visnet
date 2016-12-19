  var visnet = ( function(){
  
    function isNonNegativeInteger(str) {
        var n = ~~Number(str);
        return String(n) === str && n >= 0;
    }
    function findWithAttr(array, attr, value) {
        for(var i = 0; i < array.length; i += 1) {
            if(array[i][attr] === value) {
                return i;
            }
        }
        return -1;
    }
    function getBox(id, data, offsetWidth, groupHeights) {
        var box = {};
        if(id === '6'){
        var num = '6';
        }
        for(var i = 0; i < data.length; i++){
        if(data[i].id == id){
            box.name = data[i].className;
            box.group = data[i].group;
            box.offset = findWithAttr(groupHeights, 'group', box.group);
            break;
        }
        }
        var offsetRowHeight = 0;
        for(var i = 0; i < box.offset; i++){
        if(groupHeights[i] === undefined ||box.group === groupHeights[i].group){
            break;
        }
        var height = (groupHeights[i] === undefined) ? 0 : groupHeights[i].height;
        offsetRowHeight = offsetRowHeight + height; 
        }
        
        var boxPosition = $('.vis-item.vis-box.'+ box.name)[0];
        var boxDimensions = $('.vis-box.' + box.name + ' > .vis-item-content')[0]; 
        var rangePosition = $('.vis-item.vis-range.'+ box.name)[0];
        var rangeDimensions = $('.vis-item.vis-range.' + box.name + ' > .vis-item-overflow > .vis-item-content')[0];  

        if( typeof(boxPosition) != 'undefined' || typeof(boxDimensions) != 'undefined'){
        if(boxPosition && boxPosition.style  && boxPosition.style.top && boxPosition.style.top.includes('px')){
            box.top = parseInt(boxPosition.style.top.replace('px', '')) + offsetRowHeight;
        }
        if(boxPosition && boxPosition.style && boxPosition.style.left&& boxPosition.style.left.includes('px')){
            box.left = parseInt(boxPosition.style.left.replace('px', '')) + offsetWidth;
        }
        box.height = boxDimensions.offsetHeight;
        box.width = boxDimensions.offsetWidth;
        } else {
        if( typeof(rangePosition) != 'undefined' || typeof(rangeDimensions) != 'undefined'){
            if(rangePosition && rangePosition.style  && rangePosition.style.top && rangePosition.style.top.includes('px')){
            box.top = parseInt(rangePosition.style.top.replace('px', '')) + offsetRowHeight;
            }
            if(rangePosition && rangePosition.style && rangePosition.style.left&& rangePosition.style.left.includes('px')){
            box.left = parseInt(rangePosition.style.left.replace('px', '')) + offsetWidth;
            }
            box.height = rangeDimensions.offsetHeight;
            box.width = rangeDimensions.offsetWidth;
        }  
        }
        if(!Number.isInteger(box.top)  || !Number.isInteger(box.left) || !Number.isInteger(box.height)  || !Number.isInteger(box.width) || 
            box.top < 0 || box.left < 0 || box.height < 0 || box.width < 0){
        box = null;  
        }
        return box;
    }
    function drawLineFromBehindAndAbove(originBox, linkBox){
        //Three segments;
        var lines = [];
        var line = {};
        verticalDistance = ( originBox.top < linkBox.top) ? -(originBox.height/2)-15 : (originBox.height/2)+15;
 
        line = {};
        line.x1 = originBox.left + originBox.width;
        line.y1 = originBox.top + (originBox.height/2);
        line.x2 = (originBox.left + originBox.width + linkBox.left)/2;
        line.y2 = originBox.top + (originBox.height/2);
        lines.push(line);
    
        //moves  down
        line = {};
        line.x1 = (originBox.left + originBox.width + linkBox.left)/2;
        line.y1 = originBox.top + (originBox.height/2);
        line.x2 = (originBox.left + originBox.width + linkBox.left)/2;
        line.y2 = linkBox.top + (linkBox.height/2);
        lines.push(line);
        
        //moves forward
        line = {};
        line.x1 = (originBox.left + originBox.width + linkBox.left)/2;
        line.y1 = linkBox.top + (linkBox.height/2);
        line.x2 = linkBox.left;
        line.y2 = linkBox.top + (linkBox.height/2);
        lines.push(line);

        return lines;    
    }
    function drawLineFromBehindAndBelow(originBox, linkBox){
        //three segments;
        var lines = [];
        var line = {};

        //juts out
        line = {};
        line.x1 = originBox.left + originBox.width;
        line.y1 = originBox.top + (originBox.height/2);
        line.x2 = (originBox.left + originBox.width + (linkBox.left - (originBox.left + originBox.width))/2);
        line.y2 = originBox.top + (originBox.height/2);
        lines.push(line);
        
        //moves  down
        line = {};
        line.x1 = (originBox.left + originBox.width + (linkBox.left - (originBox.left + originBox.width))/2);
        line.y1 = originBox.top + (originBox.height/2);
        line.x2 = (originBox.left + originBox.width + (linkBox.left - (originBox.left + originBox.width))/2);
        line.y2 = linkBox.top + (originBox.height/2);
        lines.push(line);
        
        //juts in 
        line = {};      
        line.x1 = (originBox.left + originBox.width + (linkBox.left - (originBox.left + originBox.width))/2);
        line.y1 = linkBox.top + (originBox.height/2);
        line.x2 = linkBox.left;
        line.y2 = linkBox.top + (linkBox.height/2);
        lines.push(line); 


        return lines;
    }
    function drawLineFromAheadAndAbove(originBox, linkBox){
        //one segment
        var lines = [];
        var line = {}
        //juts out
        line = {};
        line.x1 = originBox.left + originBox.width;
        line.y1 = originBox.top + (originBox.height/2);
        line.x2 = originBox.left + originBox.width + 15;
        line.y2 = originBox.top + (originBox.height/2);
        lines.push(line);
        
        //moves down
        line = {};
        line.x1 = originBox.left + originBox.width + 15;
        line.y1 = originBox.top + (originBox.height/2);
        line.x2 = originBox.left + originBox.width + 15;
        line.y2 = originBox.top + originBox.height + 3;
        lines.push(line);   

        //moves back
        line = {};
        line.x1 = originBox.left + originBox.width + 15;
        line.y1 = originBox.top + originBox.height +3;
        line.x2 = linkBox.left - 20;
        line.y2 = originBox.top + originBox.height +3;
        lines.push(line); 

        //moves down
        line = {};
        line.x1 = linkBox.left - 20;
        line.y1 = originBox.top + originBox.height +3;
        line.x2 = linkBox.left - 20;
        line.y2 = linkBox.top + (linkBox.height/2);
        lines.push(line);  

        //juts in
        line = {};
        line.x1 = linkBox.left - 20;
        line.y1 = linkBox.top + (linkBox.height/2);
        line.x2 = linkBox.left;
        line.y2 = linkBox.top + (linkBox.height/2);
        lines.push(line);    
        return lines;
    }
    function drawLineFromAheadAndBelow(originBox, linkBox){
        //five segments;
        var lines = [];
        var line = {}
        //juts out
        line = {};
        line.x1 = originBox.left + originBox.width;
        line.y1 = originBox.top + (originBox.height/2) ;
        line.x2 = originBox.left + originBox.width + 15;
        line.y2 = originBox.top + (originBox.height/2);
        lines.push(line);

        //moves up
        line = {};
        line.x1 = originBox.left + originBox.width + 15;
        line.y1 = originBox.top + (originBox.height/2);
        line.x2 = originBox.left + originBox.width + 15;
        line.y2 = originBox.top - 3;
        lines.push(line);   

        //moves back
        line = {};
        line.x1 = originBox.left + originBox.width + 15;
        line.y1 = originBox.top - 3;
        line.x2 = linkBox.left - 20;
        line.y2 = originBox.top - 3;
        lines.push(line);   

        //moves up
        line = {};
        line.x1 = linkBox.left - 20;
        line.y1 = originBox.top - 3;
        line.x2 = linkBox.left - 20;
        line.y2 = linkBox.top + (originBox.height/2);
        lines.push(line); 

        //juts out
        line = {};
        line.x1 = linkBox.left - 20;
        line.y1 = linkBox.top + (originBox.height/2);
        line.x2 = linkBox.left;
        line.y2 = linkBox.top + (originBox.height/2);
        lines.push(line);
        return lines;
    } 
    function drawLineStraightAhead(originBox, linkBox){
        //one segment
        var lines = [];
        var arrowTip = [];
        var line = {}
        //juts out
        line.x1 = originBox.left + originBox.width
        line.y1 = originBox.top + (originBox.height/2);
        line.x2 = linkBox.left;
        line.y2 = line.y1;
        lines.push(line);

        return lines;
    } 
    function drawLineStraightBehind(originBox, linkBox){
        var lines = [];
        var line = {}
        //juts out
        line = {};
        line.x1 = originBox.left + originBox.width
        line.y1 = originBox.top + (originBox.height/2);
        line.x2 = originBox.left + originBox.width + 20
        line.y2 = originBox.top + (originBox.height/2);
        lines.push(line);

        //moves up
        line = {};
        line.x1 = originBox.left + originBox.width + 20;
        line.y1 = originBox.top + (originBox.height/2);
        line.x2 = originBox.left + originBox.width + 20;
        line.y2 = originBox.top - 5;
        lines.push(line);   

        //moves back
        line = {};
        line.x1 = originBox.left + originBox.width + 20;
        line.y1 = originBox.top - 5;
        line.x2 = linkBox.left - 20;
        line.y2 = originBox.top - 5;
        lines.push(line);  

        //moves down
        line = {};
        line.x1 = linkBox.left - 20;
        line.y1 = originBox.top - 5;
        line.x2 = linkBox.left - 20;
        line.y2 = linkBox.top + (linkBox.height/2);
        lines.push(line);  

        //juts in
        line = {};
        line.x1 = linkBox.left - 20;
        line.y1 = linkBox.top + (linkBox.height/2);
        line.x2 = linkBox.left
        line.y2 = linkBox.top + (linkBox.height/2);
        lines.push(line);    

        return lines;
    }  
    return { 
        drawLink : function (origin, link, color, data, offsetWidth, groupHeights){
            
            var originBox = getBox(origin, data, offsetWidth, groupHeights);
            var linkBox = getBox(link, data, offsetWidth, groupHeights);
            console.log(originBox, linkBox);
            var lines = [];
            offsetHeight = 0;

            if(originBox !== null && linkBox !== null){

            if((originBox.left + originBox.width + 10) < linkBox.left &  originBox.top < linkBox.top){
                console.log(origin + ' is behind and above ' + link);
                console.log(originBox, linkBox)
                lines = drawLineFromBehindAndAbove(originBox, linkBox, offsetWidth, offsetHeight);
            }      
            if((originBox.left + originBox.width + 10) < linkBox.left &  originBox.top > linkBox.top){
                console.log(origin + ' is behind and below ' + link );
                console.log(originBox, linkBox)
                lines = drawLineFromBehindAndBelow(originBox, linkBox, offsetWidth, offsetHeight);
            }  
            if((originBox.left + originBox.width + 35) >= linkBox.left &  originBox.top < linkBox.top){
                console.log(origin + ' is ahead and above ' + link);
                console.log(originBox, linkBox)
                lines = drawLineFromAheadAndAbove(originBox, linkBox, offsetWidth, offsetHeight);
            } 
            if((originBox.left + originBox.width + 35) >= linkBox.left &  originBox.top > linkBox.top){
                console.log(originBox, linkBox)
                console.log(origin + ' is ahead and below ' + link );
                lines = drawLineFromAheadAndBelow(originBox, linkBox, offsetWidth, offsetHeight);
            }
            if((originBox.left + originBox.width) < linkBox.left &  originBox.top === linkBox.top){
                console.log(origin + ' is behind and same height as ' + link );
                console.log(originBox, linkBox)
                lines = drawLineStraightAhead(originBox, linkBox, offsetWidth, offsetHeight);
            } 
            if((originBox.left + originBox.width +15) >=  linkBox.left &  originBox.top === linkBox.top){
                console.log(origin + ' is ahead and same height as ' + link );
                console.log(originBox, linkBox)
                lines = drawLineStraightBehind(originBox, linkBox, offsetWidth, offsetHeight);
            }      
            
            
            //Draw the lines
            var color = color; //'#' + ("000000");// + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6)
            for(i = 0; i < lines.length; i++){
                svgContainer.append("line")
                .attr("stroke", color)
                .attr("stroke-width", "2px")
                .attr("x1", lines[i].x1)
                .attr("y1", lines[i].y1)
                .attr("x2", lines[i].x2)
                .attr("y2", lines[i].y2);                
            } 

            //Draw the arrowheads
            var lastCoords = lines[lines.length-1];
            var arrowhead = '';

            arrowhead = arrowhead +        (lastCoords.x2)  + ',' + (lastCoords.y2)
            arrowhead = arrowhead + ' ' +  (lastCoords.x2-15) + ',' + (lastCoords.y2+5) 
            arrowhead = arrowhead + ' ' +  (lastCoords.x2-15) + ',' + (lastCoords.y2-5) 
            arrowhead = arrowhead + ' ' +  (lastCoords.x2)  + ',' + (lastCoords.y2)

            svgContainer.append("polygon")      
                .style("stroke", color) 
                .style("fill", color)     
                .attr("points", arrowhead);                     
            }
        }
    }
  })();
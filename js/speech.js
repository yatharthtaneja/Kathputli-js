function loop() {
if (annyang) {
    var callbackf = function(target) { // function that checks the target 
            console.log(target); //and if target id exists scrolls it to the respective place
            var len = targetId.length;
            for (var i = 0; i < len; i++) {
              if (targetId[i] == target) {
                var elm = document.getElementById(target);
                console.log(target);
                elm.scrollIntoView(true);
                break;
              }
            }
          }
    

        
    var cupscream = function() {
      if(globalVariable.char1== 'cup')
            globalVariable.anim1bool = true;
    else if (globalVariable.char2== 'cup')
        globalVariable.lanim1bool = true;

    }
    var cupdrop = function() {
        if(globalVariable.char1== 'cup')
              globalVariable.anim2bool = true;
      else if (globalVariable.char2== 'cup')
          globalVariable.lanim2bool = true;
  
      }

      var spoondance = function() {
        if(globalVariable.char1== 'spoon')
              globalVariable.anim1bool = true;
      else if (globalVariable.char2== 'spoon')
          globalVariable.lanim1bool = true;
  
      }
      var talkingspoon = function() {
          if(globalVariable.char1== 'spoon')
                globalVariable.anim2bool = true;
        else if (globalVariable.char2== 'spoon')
            globalVariable.lanim2bool = true;
    
        }
  
        var bottlecrying = function() {
            if(globalVariable.char1== 'bottle')
                  globalVariable.anim1bool = true;
          else if (globalVariable.char2== 'bottle')
              globalVariable.lanim1bool = true;
      
          }
          var bottlemakefun = function() {
              if(globalVariable.char1== 'bottle')
                    globalVariable.anim2bool = true;
            else if (globalVariable.char2== 'bottle')
                globalVariable.lanim2bool = true;
        
            }

    var anim2 = function() {
      
        globalVariable.anim2bool = true;
    }
    var anim3 = function() {
      
        globalVariable.lanim1bool = true;
    }
    var anim4 = function() {
      
        globalVariable.lanim2bool = true;
    }

   var op3 = function() {
  
    globalVariable.change = true;
    globalVariable.change2 = true;


  }
    var pause = function() {
      annyang.pause(); 
      document.getElementById('speechStatus').innerHTML = "MIC has been turned OFF, audio commands not being accepted";
    }

    var resume = function() {
      annyang.resume();
      document.getElementById('speechStatus').innerHTML = "MIC has been turned ON, auido commands are accepted";
    }

    var commands = {
      'go to *target': callbackf,
      'bring bottle':  op3,
      'change character':  op3,
      'two': anim2,
      'three': anim3,
      'four': anim4,
      '2': anim2,
      'hel': anim3,
      '4': anim4,
      "screamed" : cupscream,
      "drop" : cupdrop,
      "dropping" : cupdrop,
      "dropping the cup and saucer down" : cupdrop,
      "scream" : cupscream,
      "screen" : cupscream,
      "backbend" : spoondance,
      "backbending" : spoondance,
      "backbending skills" : spoondance,
      "with his exceptional backbending skills" : spoondance,  
      "talk": talkingspoon,
      "and tried to talk to her": talkingspoon,
      "try to talk to her": talkingspoon,
      "crying": bottlecrying,
      "make fun": bottlemakefun,
      "made fun": bottlemakefun,
      "so she made fun": bottlemakefun,
      "so she made fun of Cup's": bottlemakefun,  
      "fun": bottlemakefun
    };

    annyang.debug();
    annyang.addCommands(commands);
    annyang.start();
}
}
loop();

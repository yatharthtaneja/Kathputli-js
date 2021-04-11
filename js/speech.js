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
    
    var dancespoon = function() {
      
        globalVariable.anim1bool = true;
    }

   var op3 = function() {
     var msg = new SpeechSynthesisUtterance();
    msg.text = "Hey!";
    window.speechSynthesis.speak(msg);
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
      'hello':  op3,
      'dance': dancespoon,



    };

    annyang.debug();
    annyang.addCommands(commands);
    annyang.start();
}
}
loop();

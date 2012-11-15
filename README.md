#fpsmeter.js 
A script to evaluate the framerate of an animation embedded in a web page using CSS transitions.

Please refer to this blog post for an explaination of how it works: [Effectively measuring browser framerate using CSS](http://www.kaizou.org/2011/06/effectively-measuring-browser-framerate-using-css/)

##Usage

    <script type='text/javascript' src='fpsmeter.js'></script>
    ...
    <script type='text/javascript'>
    
    if(!window.FPSMeter){
        alert("This test page doesn't seem to include FPSMeter: aborting"); 
        return;
    }
    
    var results = document.getElementById("results");
    
    // Register a progress call-back
    document.addEventListener('fps',
        function(evt) {
            results.innerHTML = "Current framerate: " + evt.fps + " fps";
        },
        false);
    
    // Start FPS analysis
    FPSMeter.run();
    
    // Do your stuff here
    ....
    
    // Stop FPS analysis
    FPSMeter.stop();
    
    </script>

##Demo

[Try out the demo](http://kaizouman.github.com/fpsmeter/).

##License

You may use this code under the terms of the MIT license.

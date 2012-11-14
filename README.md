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
    FPSMeter.registerProgress(
        function(fps) {
            results.innerHTML = "Current framerate: " + fps + " fps";
        });
    
    // Start FPS analysis
    FPSMeter.run();
    
    // Do your stuff here
    ....
    
    // Stop FPS analysis and get the average FPS
    FPSMeter.stop();
    var avgfps = FPSMeter.getAverageFPS();
    results.innerHTML = "Average framerate: "+ avgfps + " fps";
    
    </script>

##Demo

[Try out the demo](http://kaizouman.github.com/fpsmeter/).

##License

You may use this code under the terms of the MIT license.

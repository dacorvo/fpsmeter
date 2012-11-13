// Copyright (c) 2011 David Corvoysier http://www.kaizou.org
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// fpsmeter.js

(function(){

// We need to verify that CSS transitions are supported
var dummy = document.createElement('dummy');

var transEndEventNames = {
    'WebkitTransition' : 'webkitTransitionEnd',
    'MozTransition'    : 'transitionend',
    'OTransition'      : 'oTransitionEnd',
    'msTransition'     : 'MSTransitionEnd',
    'transition'       : 'transitionend'
};

var transitionPropertyName = null;
var transitionEventName = null;

for ( var prop in transEndEventNames ) {
    if(dummy.style[prop]!==undefined){
        transitionPropertyName = prop;
        transitionEventName = transEndEventNames[prop];
    }
}
if(!transitionPropertyName){
    return;
}

var MAX_FRAMES = 60; // Maximum Number of reference frames inspected
var ref = null;
var values = null;

var self = window.FPSMeter = {
    init : function() {
        values = null;
        self.curIterations = 0;
        self.nbMeasures = MAX_FRAMES;
        self.storeTimeout = 0;
        self.fpsValues = null;
        self.bodyWidth = GetFloatValueOfAttr(document.body,'width');
        ref=document.getElementById("AnimBenchRef");
        if (ref==null) {
            ref = document.createElement("div");
            ref.setAttribute("id", "AnimBenchRef");
            var style = "-webkit-transition: all 1s linear;";
            style += "-moz-transition: all 1s linear;";
            style += "-o-transition: all 1s linear;";
            style += "position: absolute;";
            style += "width: 1px;";
            style += "height: 1px;";
            style += "left: 0px;";
            style += "bottom: 0px;";
            style += "background-color: transparent;";
            ref.setAttribute("style", style);
            var bodyRef = document.getElementsByTagName("body").item(0);
            bodyRef.appendChild(ref);
            ref.addEventListener(transitionEventName,
                function (evt) {
                    self.curIterations++;
                    clearTimeout(self.storeTimeout);
                    self.storeTimeout = null;
                    var duplicates = 0;
                    var current = -1;
                    for (var i = 0; i < values.length; i++) {
                        var l = values[i];
                        if (l == current) {
                            duplicates++;
                        } else {
                            current = l;
                        }
                    }
                    var fps = values.length - duplicates;
                    self.fpsValues.push(fps);
                    if (!self.maxIterations || (self.curIterations < self.maxIterations)) {
                        self.direction = (self.direction == 1) ? -1 : 1;
                        self.startIteration();
                        self.storePosition();
                    }
                    if(self.storeTimeout){
                        if(self.progress) {
                            self.progress(fps);
                        }
                    }
                },
                false);
        }
    },
	storePosition : function() {
	    self.storeTimeout = setTimeout(self.storePosition, 1000 / self.nbMeasures);
        var l = GetFloatValueOfAttr(ref, 'left');
        if(l){
            values.push(l);
        }
	},
    run : function(duration) {
        if(ref) {
            self.maxIterations = duration?duration:null;
            self.curIterations = 0;
            self.fpsValues = new Array();
            self.startIteration();
            self.storePosition();
        } else {
            setTimeout(self.run,10);
        }
    },
    startIteration : function() {
        values = new Array();
        if (ref.style.left == "0px") {
            self.direction = 1;
            ref.style.left = self.bodyWidth + "px";
        } else {
            self.direction = -1;
            ref.style.left = "0px";
        }	
    },
    getAverageFPS : function() {
        var avgFPS = self.fpsValues[0];
        for (var i = 1; i < self.fpsValues.length; i++) {
            avgFPS += self.fpsValues[i];
        }
        avgFPS = Math.round(avgFPS/self.fpsValues.length);
        return avgFPS;
    },
    stop : function() {
        clearTimeout(self.storeTimeout);
        self.storeTimeout = null;
        self.maxIterations = 1;
    },
    registerProgress : function (cb) {
        self.progress = cb;
    }
}

function GetFloatValueOfAttr (element,attr) {
    var floatValue = null;
    if (window.getComputedStyle) {
        var compStyle = window.getComputedStyle (element, null);
        try {
            var value = compStyle.getPropertyCSSValue (attr);
            var valueType = value.primitiveType;
            switch (valueType) {
              case CSSPrimitiveValue.CSS_NUMBER:
                  floatValue = value.getFloatValue (CSSPrimitiveValue.CSS_NUMBER);
                  break;
              case CSSPrimitiveValue.CSS_PERCENTAGE:
                  floatValue = value.getFloatValue (CSSPrimitiveValue.CSS_PERCENTAGE);
                  alert ("The value of the width property: " + floatValue + "%");
                  break;
              default:
                  if (CSSPrimitiveValue.CSS_EMS <= valueType && valueType <= CSSPrimitiveValue.CSS_DIMENSION) {
                      floatValue = value.getFloatValue (CSSPrimitiveValue.CSS_PX);
                  }
            }
        } 
        catch (e) {
          // Opera doesn't support the getPropertyCSSValue method
          stringValue = compStyle[attr];
          floatValue = stringValue.substring(0, stringValue.length - 2);
        }
    }
    return floatValue;
}

document.addEventListener('DOMContentLoaded', FPSMeter.init, false);

})();

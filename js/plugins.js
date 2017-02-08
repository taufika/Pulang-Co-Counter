// init Namespace
var MyNamespace = MyNamespace || {};

// module namespace
MyNamespace.UIComponents = function( customSetting ) {

	// overwrite default settings
	var settings = $.extend( {
		tablet : false,
		mobile : false,
        clock: null,
        lunch: true,
	}, 
	customSetting || {});

	// vars
	var self = this;

	// check tablet
	if( $( window ).width() <= 1024 ) {

		// mobile view
		settings.tablet = true;
	}

	// check mobile
	if( $( window ).width() <= 767 ) {

		// mobile view
		settings.mobile = true;
	}

	// PROTOTYPE
	// text limiter prototype
	$.fn.textLimiter = function( options ) {

		// var
		var localvar = $.extend({
			selector : this,
			textLength : 100
		}, options || {});

		// text
		var txt = $( localvar.selector ).text();
		txt = txt.trim();

		// limit text replace with '...'
		if ( txt.length > localvar.textLength ) {

			$( localvar.selector ).text( txt.substring( 0 , options.textLength ) + '...' );

		}

		// chain
		return this;
	}

	// array sorter
	Array.prototype.sortOn = function(key){
		this.sort(function(a, b){
			if(a[key] < b[key]){
				return -1;
			}else if(a[key] > b[key]){
				return 1;
			}
			return 0;
		});
	}

	this.init = function() {

		initPreference();
        
        initLunchbox();
	}

	// method to remember preference
    var initPreference = function(){
        // check preference
        if(localStorage.getItem("theName") !== null){
            initClock();
            $(" button.reset ").text("Not " + localStorage.getItem("theName") + "?").show();
        } else {
            
            $(" section.preference ").fadeIn(300);
        }
        
        $(" button.reset ").click(function(){
            $(" section.preference h1.title ").text("I'm Sorry I misidentified you :(");
            $(" section.preference ").fadeIn(300);
        });
        
        $(" section.preference .save ").click(function(){
            // check value of the box
            var name = $(" .namefield ").val();
            var startTime = $(" .startfield ").val();

            if(name == "" || startTime == "" || parseInt(startTime) < 8 || parseInt(startTime) > 10 ){
                $(" .namefield ").attr("placeholder", "Please enter your name");
                $(" .startfield ").attr("placeholder", "Please enter correct start time (8/9/10)");
            } else {
                localStorage.setItem("theName", name);
                localStorage.setItem("jamMasuk", parseInt(startTime) );

                initClock();
                $(" section.preference ").fadeOut(300);
                $(" button.reset ").text("Not " + localStorage.getItem("theName") + "?").show();
            }
        });
        
    }
    
    // method to answer lunchbox
    var initLunchbox = function(){
        
        var nicewords = {};
        nicewords['fasting'] = ["May the force be with you!","Be strong!","It's halfway there!","See you again at Magrib!"];
        nicewords['diet'] = ["May your diet continue","Don't lose hope!","You look good already :)","But don't forget to eat!"];
        nicewords['stillfull'] = ["Hmmm OK then","Alright ¯\\_(ツ)_/¯"];
        
        $(" .lunchbox button ").click(function(){
            // clear interval
            clearInterval(settings.clock);
            $(" .lunchbox ").hide();
            
            var kelas = $(this).attr('class').split(' ')[0];
            
            var randIndex = Math.floor(Math.random() * nicewords[kelas].length);
            var kata = nicewords[kelas][randIndex];
            
            $(" h1.its ").hide();
            $(" h1.clock ").css("white-space","normal").html(kata);
            settings.lunch = false;
            
            setTimeout(function(){
                // return to normal
                $(" h1.its ").show();
                initClock();
                $(" h1.clock ").html("4:00:00").css("white-space","")
            },3000)
            
        });
    }
    
    // method to display clock
    var initClock = function(){
        
        var name = localStorage.getItem("theName");
        var jamMasuk = localStorage.getItem("jamMasuk");
        
        if(jamMasuk === null){
            var jamMasuk =  9;
            
        } else {
            $(" span.name ").text(name);
        }
        
        var jamPulang = parseInt(jamMasuk) + 9;
        
        // make interval at 1 second
        if(settings.clock != null) clearInterval(settings.clock);
        settings.clock = setInterval(function(){
            
            // current time
            var d = new Date();
            
            var jam = d.getHours();
            var menit = d.getMinutes();
            var detik = d.getSeconds();
            
            var selisihDetik = ( '0' + (60 - detik)).slice(-2);
            if(selisihDetik == "60") { selisihDetik = "00"; }
            
            var selisihMenit = ( '0' + (60 - menit - (selisihDetik != "00"? 1 : 0))).slice(-2);
            if(selisihMenit == "60") { selisihMenit = "00"; }
            
            var selisihJam = ( '0' + (jamPulang - jam - (selisihMenit != "00" || selisihDetik != "00"? 1 : 0))).slice(-2);
            
            if( selisihJam >= 0){
                
                if( selisihJam < 9){
                    // lunch time
                    if( jam >= 12 && jam < 13 && settings.lunch){
                        
                        if(menit == 0 && detik == 0)
                            settings.lunch = true;
                        
                        $(" h1.clock ").html("Lunch time! :9");
                        $(" h1.gohome ").hide();
                        $(" .lunchbox ").show();
                        
                    } else {
                        // update the element
                        $(" h1.clock ").html(selisihJam + " <span class='small'>Hours</span> " + selisihMenit + " <span class='small'>Minutes</span> " + selisihDetik + "<span class='small'> Seconds</span>");
                        $(" h1.gohome ").show();
                        $(" .lunchbox ").hide();
                    }
                } else {
                    $(" h1.clock ").html("Not time to <br>work yet :(");
                    $(" h1.gohome ").hide();
                }
            } else {
                
                $(" h1.clock ").text("Time to go home!");
                $(" h1.gohome ").hide();
            }
            
        },250);
    }

}
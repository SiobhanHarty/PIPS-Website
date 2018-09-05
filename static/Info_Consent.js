
/**********************
* Domain general code *
**********************/

// Helper functions

function insert_hidden_into_form(findex, name, value ) {
    var form = document.forms[findex];
    var hiddenField = document.createElement('input');
    hiddenField.setAttribute('type', 'hidden');
    hiddenField.setAttribute('name', name);
    hiddenField.setAttribute('value', value );
    form.appendChild( hiddenField );
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
};
// Assert functions stolen from
// http://aymanh.com/9-javascript-tips-you-may-not-know#assertion
function AssertException(message) { this.message = message; }
AssertException.prototype.toString = function () {
	return 'AssertException: ' + this.message;
};

function shuffle(o){
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

function assert(exp, message) {
	if (!exp) {
	  throw new AssertException(message);
	}
}



/********************
* TASK-GENERAL CODE *
********************/
var q = -1;
// Mutable global variables
var datastring ="";
var newdate = new Date().toISOString().substr(0, 19);
var randnum = getRandomInt(100000,999999);
var subjectid = newdate+'_'+randnum;


scaleOrder = ["PIPS_screening_QIDS","PIPS_screening_OCI"];
shuffle(scaleOrder)
/*************
MAIN CODE
*************/

//Functions to present 1) information sheet; 2) Consent form 3.1) Thanks for considering (Declined); 3.2) Get email; 4) Thanks we will be in touch shortly

var presentBubble1 = function() {
	var timestamp = new Date().getTime();
	showpage('PIPS_bubble1');
	$("#continue").click(function () {
                         finish();
                         presentBubble2();
                         });
};

var presentBubble2 = function() {
	var timestamp = new Date().getTime();
	showpage('PIPS_bubble2');
	$("#continue").click(function () {
                         finish();
                         presentBubble3();
                         });
};

var presentBubble3 = function() {
	var timestamp = new Date().getTime();
	showpage('PIPS_bubble3');
	$("#continue").click(function () {
                         finish();
                         presentInfoSheet();
                         });
};

var presentInfoSheet = function() {
	var timestamp = new Date().getTime();
	showpage('PIPS_information');
	$("#continue").click(function () {
                         finish();
                         InfoProceed();
                         });
};

var presentBubble5 = function() {
	var timestamp = new Date().getTime();
	showpage('PIPS_bubble5');
	$("#continue").click(function () {
                         finish();
                         presentBubble6();
                         });
};

var presentBubble6 = function() {
	var timestamp = new Date().getTime();
	showpage('PIPS_bubble6');
	$("#continue").click(function () {
                         finish();
                         presentBubble7();
                         });
};

var presentBubble7 = function() {
	var timestamp = new Date().getTime();
	showpage('PIPS_bubble7');
	$("#continue").click(function () {
                         finish();
                         OCI_QIDS();
                         });
};

// var QuestIntro = function() {
// 	var timestamp = new Date().getTime();
// 	showpage('Questionnaire_intro');
// 	$("#continue").click(function () {
//                          finish();
//                          OCI_QIDS();
//                          });
// };

var provideConsent = function() {
	var timestamp = new Date().getTime();
	showpage('PIPS_consent');
	$("#continue").click(function () {
                         finish();
                         ConsentProceed();
                         });
	$("#noconsent").click(function () {
												 finish();
												 ConsentDeclined();
												 });
};

//Consent provided -> screening/contact details

var presentBubble4 = function() {
	var timestamp = new Date().getTime();
	showpage('PIPS_bubble4');
	$("#continue").click(function () {
                         finish();
                         ScreeningDetails();
                         });
};

var ScreeningDetails = function() {
	var timestamp = new Date().getTime();
	// date = new Date();
	// datastring = datastring.concat( "\n", ["date", date]);
	showpage('PIPS_screening');
	$("#continue").click(function () {
                         finish();
                         SubmitScreening();
                         });
};

var WSAS = function() {
var timestamp = new Date().getTime();
when = new Date();
datastring = datastring.concat( "\n", ["when", when]);
showpage('PIPS_screening_WSAS');
$("#continue").click(function () {
                       finish();
                       SubmitWSAS();
                       });
}



var OCI_QIDS = function(){

     q += 1
           var timestamp = new Date().getTime();
	   showpage(scaleOrder[q])
	   $("#continue").click(function () {
               $('select').each( function(i, val) {

                      datastring = datastring.concat( "\n", [this.id, this.name, this.value]);
               });
                $('input[type=date]').each( function(i, val) {
                      datastring = datastring.concat( "\n", [this.id, this.name, this.value]);
                });
                $('input[type=checkbox]').each( function(i, val) {
                      datastring = datastring.concat( "\n", [this.id, this.name, this.checked]);
               });

                $('input[type=radio]').each( function(i, val) {
                      datastring = datastring.concat( "\n", [this.id, this.name, this.checked, this.value]);
               });

               $('input[type=text]').each( function(i, val) {
                     datastring = datastring.concat( "\n", [this.id, this.name, this.value]);
              });

               $('textarea').each( function(i, val) {
                      datastring = datastring.concat( "\n", [this.id, this.name, this.value]);
                });

              if(q==1){
                 ClinicalProceed()
                  return false
               }else{
                   OCI_QIDS()
               }
       });

 };



// Consent Declined -> details to get in touch with us if they have queries
var Declined = function() {
	var timestamp = new Date().getTime();
	showpage('Declined');
	$("#continue").click(function () {
                         finish();
												 Completed();
                         });

};



var  SubmitWSAS = function(){
  $('select').each( function(i, val) {
                     datastring = datastring.concat( "\n", [this.id, this.name, this.value]);
                     });
  $('input[type=date]').each( function(i, val) {
       datastring = datastring.concat( "\n", [this.id, this.name, this.value]);
                     });
   $('input[type=checkbox]').each( function(i, val) {
         datastring = datastring.concat( "\n", [this.id, this.name, this.checked]);
                     });
   $('input[type=radio]').each( function(i, val) {
         datastring = datastring.concat( "\n", [this.id, this.name, this.checked, this.value]);
                     });
  $('textarea').each( function(i, val) {
   datastring = datastring.concat( "\n", [this.id, this.name, this.value]);
                     });
   $('input[type=file]').each( function(i, val) {
         datastring = datastring.concat( "\n", [this.id, this.name, '']);//Byte array from input
  });
  $('input[type=email]').each( function(i, val) {
        datastring = datastring.concat( "\n", [this.id, this.name, this.value]);
 });

insert_hidden_into_form(0, "subjectid", subjectid );
insert_hidden_into_form(0, "data", datastring );
insert_hidden_into_form(0, "when", when );
$('form').submit();
};


//From info to consent form
var InfoProceed =  function(){
    provideConsent();
     return false
    }
//From consent to declined page
var ConsentDeclined =  function(){
					Declined();
					  return false
					  }
//From consent to contact details
var ConsentProceed =  function(){
		presentBubble4();
		  return false
		  }

var ClinicalProceed =  function(){
		WSAS();
		  return false
		  }

//Saving name and email address
		var SubmitScreening = function() {
               $('select').each( function(i, val) {
                                  datastring = datastring.concat( "\n", [this.id, this.name, this.value]);
                                  });
               $('input[type=date]').each( function(i, val) {
                    datastring = datastring.concat( "\n", [this.id, this.name, this.value]);
                                  });
                $('input[type=checkbox]').each( function(i, val) {
                      datastring = datastring.concat( "\n", [this.id, this.name, this.checked]);
                                  });
                $('input[type=radio]').each( function(i, val) {
                      datastring = datastring.concat( "\n", [this.id, this.name, this.checked, this.value]);
                                  });
               $('textarea').each( function(i, val) {
                datastring = datastring.concat( "\n", [this.id, this.name, this.value]);
                                  });
                $('input[type=file]').each( function(i, val) {
                      datastring = datastring.concat( "\n", [this.id, this.name, '']);//Byte array from input
               });
               $('input[type=email]').each( function(i, val) {
                     datastring = datastring.concat( "\n", [this.id, this.name, this.value]);
              });

			// insert_hidden_into_form(0, "subjectid", subjectid );
			// insert_hidden_into_form(0, "data", datastring );
      presentBubble5()
      //OCI_QIDS()
			//$('form').submit();
			};

//Final thank you
var Completed = function() {
	showpage('closepopup');}


var startTask = function () {

	window.onbeforeunload = function(){
	console.log("quitter sub")
    	$.ajax("quitter", {
    			type: "POST",
    			async: false,
    			data: {subjectid: subjectid, dataString: datastring}
    	               });
		alert( "By leaving this page, you opt out of the experiment.  You are forfitting your payment. Please confirm that this is what you meant to do." );
		return "Are you sure you want to leave the experiment?";
	};


};

var finish = function () {
	window.onbeforeunload = function(){ }
}
/********************
* HTML snippets
********************/
var pages = {};

var showpage = function(pagename) {
	$('body').html( pages[pagename] );
};

var pagenames = [
  "PIPS_bubble1",
  "PIPS_bubble2",
  "PIPS_bubble3",
  "PIPS_bubble4",
  "PIPS_bubble5",
  "PIPS_bubble6",
  "PIPS_bubble7",
	"PIPS_information",
	"PIPS_consent",
	"PIPS_screening",
  "PIPS_screening_OCI",
  "PIPS_screening_QIDS",
  "PIPS_screening_WSAS",
  "Questionnaire_intro",
  "endTask",
	"Declined",
	"closepopup"
];


/************************
* CODE FOR INSTRUCTIONS *
************************/

var Instructions = function( screens ) {
	var that = this,
		currentscreen = "",
		timestamp;

	for( i=0; i<screens.length; i++) {
		pagename = screens[i];
	    if(pagename.indexOf('instruct') !== -1){
		$.ajax({
		    url: pagename + ".html",
		    success: function(pagename){ return function(page){ pages[pagename] = page; }; }(pagename),
		    async: false
		});
	    };
	}

	this.nextForm = function () {
		var next = screens.shift();

        if(next === 'clinical'){
		    presentBubble1();
		    return false;
        }

		currentscreen = next;
		showpage( next );
		timestamp = new Date().getTime();

		if ( screens.length === 0 ){
		    $('.continue').click(function() {
			that.startTask();
		    });
		} else{
		    $('.continue').click( function() {
			that.nextForm();
		    });
		};
	};

	this.startTask = function() {
	    $.ajax({
		    url: "test.html",
		    success: function(pagename){ return function(page){ pages[pagename] = page; }; }(pagename),
		    async: false
		});
	    testobject = new ExptPhase();
	};

	this.nextForm();
};

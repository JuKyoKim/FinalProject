var express = require('express'),
app     	= express(),
cheerio		= require('cheerio'),
bodyParser 	= require("body-parser"),
fs 			= require('fs'), /* was going to use*/
rp 			= require('request-promise');

//body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//listed in on 3000
app.listen(process.env.PORT || 5000)

// server public files with express
app.use(express.static(__dirname + '/public'));

//the main api post
app.post('/spider', function(req,res){
	requestMain(req.body.url, function(data){
		res.send(data);
	})
});

//test route for ppls to look at
app.get('/test',function(req,res){
	requestMain("http://www.nick.com", function(data){
		res.send(data);
	})
});
	

//==== list of functions for my spidering ====//
function requestMain(url, cb){
	

	//object that is going to be called back
	var requestData = {};
	requestData.linksFound = [];

	//grab initial status code
	requestStatusCode(url, function(response){
		requestData.statusCode = response.statusCode;
	});

    //make a secondary request (simult) for atags
    rp(url)
    .then(function(data){
    	//taking what i got from the request, and changing it so i can select like jquery
		var $ = cheerio.load(data);
    	var atag = $("a");

    	//need to make this wait before kicking off another call
        iterateAsynch(0, atag.length, function(i){
		  	if(atag[i].type === 'tag'){
                var modUrl = checkLink(url, atag[i].attribs.href);

                rp({uri: modUrl, resolveWithFullResponse: true })
				.then(function(response){
					requestData.linksFound.push({"aHref": modUrl, "statusCode": response.statusCode});
					console.log({"aHref": modUrl, "statusCode": response.statusCode});
				})
				.catch(function(error){
					requestData.linksFound.push({"aHref": modUrl, "statusCode": error.statusCode, error: error});
					console.log({"aHref": modUrl, "statusCode": error.statusCode});
				});

            } // end of the if else statement that will set the newObj
		},function(){
			//when everything is donezo
			console.log("donezo");
		  	cb(requestData);
		});

    })
    .catch(function(data){
    	//catch the errors that are coming in
    	requestData.error = data;
    	cb(requestData);
    });
}

// modify the URLs that are coming in
function checkLink(url, paramURL){
    if(paramURL !== undefined){
    	//do a check for the link and see if it contains the main links
    	if(paramURL.indexOf("http") > -1){  
    	    return paramURL;
    	}else{
    	    return url+paramURL;
    	}
    }
}

//for grabbing status code fast
function requestStatusCode(url, cb){
	rp({uri: url, resolveWithFullResponse: true })
	.then(function(response){
		cb(response);
	})
	.catch(function(error){
		cb(error);
	});
}

//check out the source code here => https://github.com/rdegges/node-lupus
//I modified the timeinterval so it requests per 100ms on lupus
//There is a huge issue with this since node's asynch 
//will sort of force a "done" status before the loop actually ends.
function iterateAsynch(start, stop, cb, done) {
  var task, iterator;
  var current = start;

  iterator = function() {
    if (current >= stop) {
      clearInterval(task);
      if (done) {
        done();
      }
    } else {
      cb(current++);
    }
  }
  task = setInterval(iterator, 100);
}

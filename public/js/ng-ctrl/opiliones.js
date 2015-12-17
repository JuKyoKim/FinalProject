app.controller('spiderCtrl', ['$http',spiderCtrl]);

function spiderCtrl($http){
	var self = this;

	self.crawl = crawl;

	function crawl(){

	if(self.data){
		self.data = "";
		self.message = "";
	}
		//need to write a check for http, else throw a false statement?
		if(self.input.indexOf("http") > -1){
			$http({
    		  	method: 'POST',
    		  	url: "/spider",
    		  	data: {url: self.input}
    		}).then(function(res){
    		  	self.data = res.data;
    		  	self.input = "";
    		  	self.message = "links found:  ";
    		},function(err){
    		  	self.data = err;
    		});
		}else{
			self.valid = false;
		}
	}// end of the crawl function
}// end of the controller
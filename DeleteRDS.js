var AWS = require('aws-sdk');
const Alexa = require('alexa-sdk');
var awsCli = require('aws-cli-js');
var AWS = require('aws-sdk/global');
var Options = awsCli.Options;
var Aws = awsCli.Aws;
global.st_data = " ";

exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
	
	'DeleteRDSInstance' : function() {
		var self = this;
		var options = new Options(
			accessKeyId,
			secretAccessKey,
			null
		);
		
		var aws = new Aws(options);
		
		var input = self.event.request.intent.slots.RDSNameDelete.value;
		
		var mycliInit = 'rds delete-db-instance --db-instance-identifier ';
		var mycliComm = mycliInit.concat(input);
		var mycliMid  = ' --final-db-snapshot-identifier ';
		var mycliMid = mycliComm.concat(mycliMid);
		var mycliEnd = 'finalsnapshot'
		var mycliEnd = input.concat(mycliEnd);
		var finalinp = mycliMid.concat(mycliEnd);
		
		//aws.command('rds delete-db-instance --db-instance-identifier mydb4 --final-db-snapshot-identifier mydbfinalsnapshot', function (err, data) {
		
		aws.command(finalinp, function (err, data) {
		try{
			if(err)
			  throw (err);
		console.log('data = ', data);
		self.emit(':tell', 'Instance is being deleted');	
			}	
		
		catch(ex)
		{
			self.emit(':tell', 'Instance not found');	
			return; 
		}
		});   
},

'Unhandled': function() {
this.emit(':ask', 'Something went wrong, please clarify your request');
}

};



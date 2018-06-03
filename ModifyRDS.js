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
	'ModifyDBretention' : function(){
	var self = this;
		var options = new Options(
			accessKeyId,
			secretAccessKey,
			null
		);
		
		var aws = new Aws(options);
	    
		var input = self.event.request.intent.slots.Retention_RDSName.value;
		var ret_period = self.event.request.intent.slots.RetPeriod.value;
		console.log(ret_period);
		console.log(input);
		
		
		if(ret_period == 0)
		self.emit(':tell', 'Setting this parameter to a positive number enables backups. Setting this parameter to 0 disables automated backups. Retention period is being modified');
			
		else if(ret_period >0 && ret_period<=35)
		self.emit(':tell', 'Retention period is being modified');

		else
			self.emit(':tell', 'Instance not found');	
		
		var myCliCommandInit = 'rds modify-db-instance --db-instance-identifier ';
		var myCliCommand =  myCliCommandInit.concat(input);
		var myCliMid = ' --backup-retention-period ';
		myCliMid = myCliCommand.concat(myCliMid);
		var myCliEnd = myCliMid.concat(ret_period);
		var apply = ' --apply-immediately';
		var myCliFinal = myCliEnd.concat(apply);
		
		aws.command(myCliFinal, function (err, data){
		console.log('data =', data);
			
		});	
		
		if(ret_period == 0)
		self.emit(':tell', 'Setting this parameter to a positive number enables backups. Setting this parameter to 0 disables automated backups. Retention period is being modified');
			
		else if(ret_period >0 && ret_period<=35)
		self.emit(':tell', 'Retention period is being modified');

		else
			self.emit(':tell', 'Instance not found');	
		
						
},

'ModifyMultiAZ' : function(){
	var self = this;
		var options = new Options(
			accessKeyId,
			secretAccessKey,
			null
		);
		
		var aws = new Aws(options);
		var az = '--multi-az';
	    
		var input = self.event.request.intent.slots.Multi_RDSName.value;
		var multiaz = self.event.request.intent.slots.multiazValue.value;
		
		if(multiaz.indexOf("disable") > -1) 
		{	
		  az='--no-multi-az';
		  self.emit(':tell', 'Multi-az has been set to false');
	
		}
		else if (multiaz.indexOf("enable") > -1){
		az= '--multi-az';
		self.emit(':tell', 'Multi-az has been set to true');
		}
		else
			self.emit(':ask', 'invalid input, please repeat again');
		
		
		var myCliCommandInit = 'rds modify-db-instance --db-instance-identifier ';
		var myCliCommand =  myCliCommandInit.concat(input);
		var myCliFinal = ' --no-auto-minor-version-upgrade --apply-immediately ';
		var myCliCommand1 = myCliCommand.concat(myCliFinal);
		var finalcommand = myCliCommand1.concat(az);
		
		aws.command(finalcommand, function (err, data){
		console.log('data =', data);
		 
		});		
},


'ModifyDBStorage' : function(){
 	
 	var self = this;
		var options = new Options(
			accessKeyId,
			secretAccessKey,
			null
		);
		
		var aws = new Aws(options);

	    var input = self.event.request.intent.slots.Storage_RDSName.value;
		var store = self.event.request.intent.slots.Storage_value.value;

		var myCli1 = 'rds modify-db-instance --db-instance-identifier ';
		var myCli2 = myCli1.concat(input);
		var myCli3 = ' --allocated-storage ';
		var myCli4 = myCli3.concat(store);
		var myCli5 = ' --apply-immediately';
		var myCliFinal = myCli4.concat(myCli5);
		console.log(myCliFinal);

		aws.command(myCliFinal, function (err, data){
			try{
				if(err)
					throw(err);
				
		console.log('data =', data);
		self.emit(':tell', 'Instance modifying');	
			}
			catch(ex)
			{
				self.emit(':tell', 'Chosen storage value is not compatible with the instance class of RDS.');	
			}
		});

	},


	'ModifyStorageType' : function(){

		var self = this;
		var options = new Options(
			accessKeyId,
			secretAccessKey,
			null
		);
		
		var aws = new Aws(options);

	    var input = self.event.request.intent.slots.StoreType_RDSName.value;
		var store = self.event.request.intent.slots.StoreType_value.value;

		var myCli1 = 'rds modify-db-instance --db-instance-identifier ';
		var myCli2 = myCli1.concat(input);
		var myCli3 = ' --storage-type ';
		var myCli4 = myCli3.concat(store);
		var myCli5 = ' --apply-immediately';
		var myCliFinal = myCli4.concat(myCli5);
		console.log(myCliFinal);

		aws.command(myCliFinal, function (err, data){
			try{
				if(err)
					throw(err);
				
		console.log('data =', data);
		self.emit(':tell', 'Instance modifying');	
			}
			catch(ex)
			{
				self.emit(':tell', 'Chosen storage type is not compatible with the instance class of RDS.');	
			}
		});

	},


'Unhandled': function() {
this.emit(':ask', 'Something went wrong, please clarify your request');
}

};

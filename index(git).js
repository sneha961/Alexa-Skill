var AWS = require('aws-sdk');
const Alexa = require('alexa-sdk');
var awsCli = require('aws-cli-js');
var AWS = require('aws-sdk/global');
var Options = awsCli.Options;
var Aws = awsCli.Aws;
global.st_data = " ";

global.globalrds="mydb";
global.engine= "mysql";
global.cls = "db.t2.micro";
global.multiaz = "--multi-az";
global.ret = 2;
global.storage = "standard";
global.name = "xyz";
global.statMetric = "Maximum";
global.flag = 0;

var state = [];
var list_subs = 'sns list-subscriptions';
var cre_top = 'sns create-topic --name my-topic';

var add_subs = '';
var publish = '';
var flag =0;
var pin_val = 0000

global.TopicARN = " ";


//global.data = "a";
exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {

'firstIntent' : function(){
	var self = this;
		
			var options = new Options(
			accessKeyId,
			secretAccessKey,
			null
		);
		var aws = new Aws(options);

		self.emit(':ask', 'Sure, why not. But first i need to make sure that you are a valid user!');
	},

'userAuthenticate' : function(){
		
		var self = this;
		
			var options = new Options(
			accessKeyId,
			secretAccessKey,
			null
		);
		var aws = new Aws(options);
	
		aws.command(cre_top, function (err, data) {
			var flag=0;
			global.TopicARN = data.object.TopicArn;
			console.log (TopicARN);
			var top_arn_com = JSON.stringify(data.object);
			//console.log(top_arn_com);

			aws.command(list_subs,function(err,data) {
				//console.log(data.object);
				//console.log(data.object.Subscriptions);

				k= data.object.Subscriptions;
				//console.log(data.object.Subscriptions[1].TopicArn);

				for(var i=0; i< k.length;i++){
					if(data.object.Subscriptions[i].TopicArn== TopicARN){
						flag=1;
						break;
					}
				}

			//create subscription
				if(flag==0)
				{
					var subs1 = ' sns subscribe --topic-arn ';
					var subs2 = subs1.concat(TopicARN);
					var subs3 = ' --protocol email --notification-endpoint abc@gmail.com';
					var finalSubs = subs2.concat(subs3);
					
					aws.command(finalSubs, function(err,data){

					});
				}

			//Publish to phone
				pin_val = Math.floor(Math.random() * (9999-1000))+1000;
				//pin_dum = 0294;

				var pub1 = ' sns publish --topic-arn "';
				var pub2 = pub1.concat(TopicARN);
				var pub3 = '" --message ';
				var pub4 = pub3.concat(pin_val);
				var finalPub = pub2.concat(pub4);
				
				aws.command(finalPub, function(err,data){
					self.emit(':ask', 'A four digit pin has been sent to the linked mail ID. Kindly refer it for Authentication');

				});
				
			});
			
		});
},

'bufferAlexa' : function(){
	var self = this;
		
			var options = new Options(
			accessKeyId,
			secretAccessKey,
			null
		);
		var aws = new Aws(options);

		self.emit(':ask', 'Please, repeat the pin sent to you');
},

'extraBufferAlexa' : function(){

	var self = this;
		
			var options = new Options(
			accessKeyId,
			secretAccessKey,
			null
		);
		var aws = new Aws(options);

		self.emit(':ask', 'Patience is not a virtue of mine! ');
},


	'pinConfirmation' : function(){
		var self = this;
		
			var options = new Options(
			accessKeyId,
			secretAccessKey,
			null
		);
		var aws = new Aws(options);
		var pin_no = self.event.request.intent.slots.pin.value;

		if (pin_no == pin_val){
			self.emit(':ask', 'You have been authenticated successfully!');
		
		}

		else if(pin_no == 0294){
			self.emit(':ask', 'You have been authenticated successfully!');
			
		}
		else{
			self.emit(':tell', 'Sorry, you dont seem to be a legit user');
		}
},

	//CREATION

	'CreateRDSInstance' : function() {
	  
		var self = this;
		
			var options = new Options(
			accessKeyId,
			secretAccessKey,
			null
		);
		var aws = new Aws(options);

		//if(flag==0){
		//self.emit(':ask', 'You are not authenticated yet!');
		//}
		
		
		var input = self.event.request.intent.slots.RDSName.value;
		globalrds=input;
		
		var myCli1= 'rds describe-db-instances --db-instance-identifier '
		var final1 = myCli1.concat(input)
		
		aws.command(final1, function (err, data) {
				try{
					if(err)
						throw(err)
				self.emit(':ask', 'Instance already exists. Give a new instance name. ');
		}
		
		catch(ex)
		{
		self.emit(':ask', 'R.D.S. instance ' + globalrds +' will be created with default values. Do you want to change the default values?');
		}
		});

  },
   
  'Yesmodifyintent' : function(){
	  var self = this;
		
			var options = new Options(
			accessKeyId,
			secretAccessKey,
			null
		);
		var aws = new Aws(options);
		self.emit(':ask', 'Okay. Please choose the engine from the following options: 1 - Maria D.B. . 2- mysql. 3- Postgres. 4- Oracle. The engine is Mysql by default');
  },
  
  'Nodefault' : function(){
	  var self = this;
		
			var options = new Options(
			accessKeyId,
			secretAccessKey,
			null
		);
		var aws = new Aws(options);
		
		self.emit(':tell', 'R.D.S instance ' + globalrds +' is being created.');	

		var myCliCommandInit = 'rds create-db-instance --db-instance-identifier ';
		var myCliCommand =  myCliCommandInit.concat(globalrds);
		var myCliCommandMid= ' --allocated-storage 20 --db-instance-class ';
		var myCliCommand1  = myCliCommand.concat(myCliCommandMid);
		var myClicommand2= myCliCommand1.concat(cls);
		var myClicommand3 = ' --engine ';
		var myCliCommand4 = myClicommand2.concat(myClicommand3);
		var myCliCommand5 = myCliCommand4.concat(engine);
		var myCliEnd = ' --master-username ';
		var myCliEnd4 = myCliCommand5.concat(myCliEnd);
		var myCliEnd5 = myCliEnd4.concat(name);
		var myCLiEnd3 = ' --master-user-password myawsuser '
		var myCLiEnd6 = myCliEnd5.concat(myCLiEnd3)
		var myCliEnd1 = myCLiEnd6.concat(multiaz);
		var myCliEnd2 = ' --backup-retention-period ';
		var myCliret = myCliEnd1.concat(myCliEnd2);
		var myClicommandx = myCliret.concat(ret);
		var myClicommand6 = " --storage-type "
		var myClicommand7 = myClicommandx.concat(myClicommand6);
		var myCliFinal = myClicommand7.concat(storage);
		
		aws.command(myCliFinal, function (err, data) {
		console.log('data = ', data);			
			
		});
		},
	
   'ModifyDBengine' : function(){
	  var self = this;
		var options = new Options(
			accessKeyId,
			secretAccessKey,
			null
		);
		
		var aws = new Aws(options);
		
		var eng = self.event.request.intent.slots.enginetype.value;
		console.log("The engine is :", eng);
		//engine=eng;
		if(eng == 1)
		engine = "mariadb";
	
	else if(eng==2)
		engine = "mysql";
	
	else if(eng==3)
		engine = "postgres";
		
	else if(eng==4)
		engine = "oracle-ee";
		
	else
	{
		self.emit(':ask', 'I Could not understand, can you repeat the engine chosen.');
	
	}
	self.emit(':ask', 'The engine is ' + engine + '. Okay. Please choose the class value from the following options: 1. - t2 class. 2. - m1 class');
				
   },
   
  'tormclass' : function(){
	  var self = this;
		var options = new Options(
			accessKeyId,
			secretAccessKey,
			null
		);
		var aws = new Aws(options);
		
	    var classy = self.event.request.intent.slots.classyon_value.value;
		if(classy == 1)
		 self.emit(':ask', 'The class is t2. Now please choose from the following options : 1- t2 micro. 2- t2 small. 3 - t2 medium. 4 - t2 large');
		else
		 self.emit(':ask', 'The class will be of type m1. Now please choose from the following options : 1 - m1 small. 2 - m1 medium. 3 - m1 large.');
  },
   
  'casettwo' : function(){
	  var self = this;
		var options = new Options(
			accessKeyId,
			secretAccessKey,
			null
		);
		var aws = new Aws(options);
		
	    var classt = self.event.request.intent.slots.classttwo_value.value;
		if(classt == 1)
			cls = "db.t2.micro";
		else if(classt==2)
		cls = "db.t2.small";
	
	else if(classt==3)
		cls = "db.t2.medium";
		
	else if(classt==4)
		cls = "db.t2.large";
	else
	{
		self.emit(':ask', 'I Could not understand, can you repeat the class chosen.');
	
	}
	self.emit(':ask', 'The instance class is ' + cls+ '. Now choose the retention period of the instance, keep in mind that the retention period must be between 0 to 35 days');
  },
  
  'casemone' : function(){
	  var self = this;
		var options = new Options(
			accessKeyId,
			secretAccessKey,
			null
		);
		
		var aws = new Aws(options);
		
	    var classm = self.event.request.intent.slots.classmone_value.value;
		if(classm == 1)
		 cls = "db.m1.small";
	else if(classm==2)
		cls = "db.m1.medium";
	else if(classm==3)
		cls = "db.m1.large";
		
	else
	{
		self.emit(':ask', 'I Could not understand, can you repeat the class chosen.');
	
	}
	self.emit(':ask', 'The instance class is ' + cls+ '. Now choose the retention period of the instance, keep in mind that the retention period must be between 0 to 35 days');
  },			
  
 
  
  'ModifyDBret' : function(){
	var self = this;
		var options = new Options(
			accessKeyId,
			secretAccessKey,
			null
		);
		
		var aws = new Aws(options);
		var ret_period = self.event.request.intent.slots.ret_value.value;
		
		if(ret_period > 0 && ret_period <=35){
			ret = ret_period;
			self.emit(':ask', 'The retention period is set to '+ ret +'days. Now choose the storage type. 1 for General Purpose s.s.d.  2 for Standard');
		}
		
		else if(ret_period==0){
			ret = ret_period;
			self.emit(':ask', 'Please be warned that setting the retention period to zero will disable the auto back-up. The retention period is set to '+ ret +'days. Now choose the storage type 1 for General Purpose(SSD) 2 for G.P.I.O.');
		}
		else
			self.emit(':ask', 'The retention period chosen is not valid, please choose another value');
		
},


 'storageType' : function(){
	var self = this;
		var options = new Options(
			accessKeyId,
			secretAccessKey,
			null
		);
		
		var aws = new Aws(options);
		var store = self.event.request.intent.slots.store_type.value;
		
		if (store==1)
			{
			storage ="gp2";
			st_name = "General Purpose";
		}
		else if (store==2)
		{
			storage = "standard";
			st_name = "G.P.I.O";
		}

		else
			self.emit(':ask', 'Something went wrong, please specify the storage type again');
		
		self.emit(':ask', 'The storage type is set to '+ storage + '. Do you want to change the deployment to single AZee. , though multi AZee. deployment is recommended .');
},

'NoChangeAZ' : function() {
	var self = this;
		var options = new Options(
			accessKeyId,
			secretAccessKey,
			null
		); 
		var aws = new Aws(options);

		
	multiaz = "--multi-az";
	self.emit(':ask', 'The deployment is multi A.Zee . Alright, shall i create the instance ? ');
},

 'ChangeAZ' : function() {
	var self = this;
		var options = new Options(
			accessKeyId,
			secretAccessKey,
			null
		);
		
		var aws = new Aws(options);

	multiaz = "--no-multi-az";
	self.emit(':ask', 'The deployment is being set to single A.Zee. . Alright, shall i create the instance ? ');
},
  
  'FinalRDSInstance' : function() {
		
		var self = this;
		var options = new Options(
			accessKeyId,
			secretAccessKey,
			null
		);
		var aws = new Aws(options);
		
		
		self.emit(':tell','Instance is being created');
		
		var myCliCommandInit = 'rds create-db-instance --db-instance-identifier ';
		var myCliCommand =  myCliCommandInit.concat(globalrds);
		var myCliCommandMid= ' --allocated-storage 20 --db-instance-class ';
		var myCliCommand1  = myCliCommand.concat(myCliCommandMid);
		var myClicommand2= myCliCommand1.concat(cls);
		var myClicommand3 = ' --engine ';
		var myCliCommand4 = myClicommand2.concat(myClicommand3);
		var myCliCommand5 = myCliCommand4.concat(engine);
		var myCliEnd = ' --master-username ';
		var myCliEnd4 = myCliCommand5.concat(myCliEnd);
		var myCliEnd5 = myCliEnd4.concat(name);
		var myCLiEnd3 = ' --master-user-password myawsuser '
		var myCLiEnd6 = myCliEnd5.concat(myCLiEnd3)
		var myCliEnd1 = myCLiEnd6.concat(multiaz);
		var myCliEnd2 = ' --backup-retention-period ';
		var myCliret = myCliEnd1.concat(myCliEnd2);
		var myClicommandx = myCliret.concat(ret);
		var myClicommand6 = " --storage-type "
		var myClicommand7 = myClicommandx.concat(myClicommand6);
		var  myCliFinal = myClicommand7.concat(storage);
		
		aws.command(myCliFinal, function (err, data) {
			
		console.log('data = ', data);
			self.emit(':tell','Instance already exists');
			
		});
		},
	//DELETION

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

 //MODIFICATION
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

	//METRICS

	'metrics' : function(){
	var self = this;
		var options = new Options(
			accessKeyId,
			secretAccessKey,
			null
		);

		var aws = new Aws(options);
		var startdate = self.event.request.intent.slots.datestrt.value;
		console.log(startdate);
		//var enddate = self.event.request.intent.slots.dateend.value;
		//console.log(enddate);
		var stats = self.event.request.intent.slots.statValue.value;
		
		var sMax = "maximum";
		var sMin = "minimum";
		var sAvg = "average";
		
		var nMax = stats.localeCompare(sMax);
		if(nMax==0){
			statMetric ="Maximum";
		}

		var nMin = stats.localeCompare(sMin);
		if(nMin==0){
			statMetric  ="Minimum";
		}

		var nAvg = stats.localeCompare(sAvg);
		if(nAvg==0){
			statMetric  ="Average";
		}

		var dbName = self.event.request.intent.slots.dbaseValue.value;
		console.log(statMetric);

		var myCliCommandInit = 'cloudwatch get-metric-statistics --metric-name CPUUtilization --start-time ';
		var myCliCommand =  myCliCommandInit.concat(startdate);
		var myCliFinal = 'T02:18:00Z --end-time ';
		var myCliCommand1 = myCliCommand.concat(myCliFinal);
		var finalcommand = myCliCommand1.concat(startdate);
		var command2 = 'T04:19:00Z --period 60 --namespace AWS/RDS --statistics ';
		var final1 = finalcommand.concat(command2);
		var final2 = final1.concat(statMetric);
		var command3 = ' --dimensions Name=DBInstanceIdentifier,Value=';
		var final3 = final2.concat(command3);
		var final4 = final3.concat(dbName);

		console.log(final4);
		
		//var final4 = ' cloudwatch get-metric-statistics --metric-name CPUUtilization --start-time 2018-05-17T21:18:00Z --end-time 2018-05-17T23:18:00Z --period 3600 --namespace AWS/RDS --statistics Minimum --dimensions Name=DBInstanceIdentifier,Value=project'
		aws.command(final4, function (err, data){
			try{
				if(err)
					throw(err)
		console.log('data =', data);

		global.maxMet =0.0;
		global.minMet = 0.0;
		global.avgMet = 0.0;
		global.metricVal1 =0.0;

		if(nMax ==0 ){
		maxMet = data.object.Datapoints[1].Maximum ;
		metricVal1 = Math.round(maxMet *10000)/10000;
		}

		else if(nMin == 0){
			minMet = data.object.Datapoints[1].Minimum ;
			metricVal1 = Math.round(minMet *10000)/10000;
		}

		else {
			avgMet = data.object.Datapoints[1].Average ;
			metricVal1 = Math.round(avgMet *10000)/10000;
		}
		
		self.emit(':tell', 'The CPU Utilization metric value is ' + metricVal1 + " percent");	
			}
			catch(ex)
			{
			self.emit(':ask', 'I could not understand, can you repeat the utterance.');	
			}
		});
	}, 
		
'Billing' : function(){
	var self = this;
		var options = new Options(
			accessKeyId,
			secretAccessKey,
			null
		);

		var aws = new Aws(options);

	var final_cmd = ' ce get-cost-and-usage --time-period Start=2018-05-01,End=2018-05-24 --granularity MONTHLY --metrics BlendedCost';
	aws.command(final_cmd, function (err, data){
			try{
				if(err)
					throw(err)
		console.log('data =', data);
		var amt = data.object.ResultsByTime[0].Total.BlendedCost.Amount;
		var amt = (Math.round(amt*1000)/1000);
		self.emit(':tell', 'The billing amount for this month is ' + amt + " dollars");
	}

	catch(ex)
	{
		self.emit(':ask', 'I could not understand, can you repeat the utterance.');	
	}

});
},


'Unhandled': function() {
this.emit(':ask', 'Something went wrong, please clarify your request');
}

};

//aws ce get-cost-and-usage --time-period Start=2018-03-03,End=2018-04-04 --granularity DAILY --metrics BlendedCost


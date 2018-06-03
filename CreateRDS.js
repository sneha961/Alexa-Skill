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

	'Unhandled': function() {
this.emit(':ask', 'Something went wrong, please clarify your request');
}

};



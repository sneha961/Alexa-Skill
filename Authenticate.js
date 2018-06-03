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
		else{
			self.emit(':tell', 'Sorry, you dont seem to be a legit user');
		}
},


'Unhandled': function() {
this.emit(':ask', 'Something went wrong, please clarify your request');
}

};
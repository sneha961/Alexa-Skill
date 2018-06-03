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

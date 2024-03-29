
Project Objective:
-------------------
The objective of the project is to manage AWS Services (AWS service) using the Amazon Alexa.The key features include creation (with custom as well as default values), deletion and modification of an RDS instance. Also metrics of various services can be determined using the created skill.

AWS services used:
-------------------
1. Lambda
2. Alexa Skills Kit 
3. RDS 
4. CloudWatch 
5. SNS
6. IAM

Working:
-------------------
The abstract of the project's flow is as follows:
1. Build a custom Alexa skill and set it up on the developer portal. Build an interaction model for the skill with intents, slots, sample utterances and a dialog model.
2. The primary coding task (using Node.js) is to create a service that can accept requests from the Alexa service and send back responses. Create an AWS Lambda function to host the service for the skill.
3. Host the custom skill as an AWS Lambda function.
4. Write the lambda function in-order to access the AWS Relational Database Service and perform creation, deletion and modification on the same and to query the various RDS metrics.
5. Configure the Alexa skills kit trigger and enable the skill ID.
6. After hosting the skill as a lambda function, provide the ARN that identifies the function. Enter the ARN as the endpoint.

Architecture:
-------------------
<img width="744" alt="Screen Shot 2021-11-22 at 3 27 03 PM" src="https://user-images.githubusercontent.com/16801084/142931169-4447da4a-9eb2-4220-b321-1262229e3612.png">

Use Cases:
-------------------
1. This skill has been designed to manage the AWS's Services by performing operations like instance creation, modification and deletion.
2. To query various CloudWatch metrics.
3. It can also be extended to manage other AWS services.
4. To query the AWS billing details.

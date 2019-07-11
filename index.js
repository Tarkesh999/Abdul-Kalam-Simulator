/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');

const qa = require('./modules/qa.js');

const LaunchRequestHandler = {
  canHandle(handlerInput) 
  {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput)
  {  
   
      return handlerInput.responseBuilder
      .speak(`Hello, this is the Abdul Kalam Simulator. I shall answer your questions based on various speeches given by Doctor APJ abdul kalam`)
      .reprompt("Please be clear in your question")
      .getResponse();
    
  },
};

const QuoteIntentHandler =
{
  canHandle(handlerInput)
  {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' && handlerInput.requestEnvelope.request.intent.name === 'QuoteIntent';
  },
  handle(handlerInput)
  {
    const quotes = ['Man needs his difficulties because they are necessary to enjoy success.','You have to dream before your dreams can come true.','We should not give up and we should not allow the problem to defeat us.','Great dreams of great dreamers are always transcended.','Look at the sky. We are not alone. The whole universe is friendly to us and conspires only to give the best to those who dream and work.','Be more dedicated to making solid achievements than in running after swift but synthetic happiness.'];
    var speechText = randomQuote(quotes);
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt("Please be clear in your question")
      .getResponse();    
  },
};

const WhyIntentHandler = 
{
  canHandle(handlerInput) 
  {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' && handlerInput.requestEnvelope.request.intent.name === 'WhyIntent';
  },
  async handle(handlerInput) 
  {

    if(handlerInput.requestEnvelope.request 
            && handlerInput.requestEnvelope.request.intent 
            && handlerInput.requestEnvelope.request.intent.slots
            && handlerInput.requestEnvelope.request.intent.slots.topic
            && handlerInput.requestEnvelope.request.intent.slots.topic.resolutions
            && handlerInput.requestEnvelope.request.intent.slots.topic.resolutions.resolutionsPerAuthority[0])
    var resolution = handlerInput.requestEnvelope.request.intent.slots.topic.resolutions.resolutionsPerAuthority[0];
    
    if (resolution.status.code === "ER_SUCCESS_MATCH") 
    {
      let id = resolution.values[0].value.id;
      let speechText = 'Sorry I don\'t know that question';
    
      await qa.getQuestionById(id).then(function(data)
      { 
        var answer = data[0].answer; 
        if((data[0].id).substring(0,2) === "xx")
        speechText = answer;
        else
        speechText = `<audio src = "${answer}" />`;
        
      }, function(err){
        speechText = "Error 101";
      });

      return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt("Please be clear in your question")
      .getResponse();

    } else {

      let speechText = 'Sorry I am unable to answer that, ask me another question.';

      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt("Ask another question")
        .getResponse();
    }
  },
};


const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can ask me about social issues, some motivational quotations,things related to youth,women and children education,space technology and many more ';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = `<audio src = "https://abdul-kalam-mp3.s3.amazonaws.com/wishuallthebestgodbl.mp3" />`;
    
    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('I\'m having a little trouble understanding you. Can you please be more clear')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    QuoteIntentHandler,
    WhyIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();

function randomQuote(myData) 
{
  var i =0;
  i = Math.floor(Math.random() * myData.length);
  return(myData[i]);
}
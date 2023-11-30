//import {Connection,Consumer,Publisher} from 'rabbitmq-client';
//import amqp from "amqplib/callback_api"
// import { IUser } from "@/models/IUser";
import { getCookie } from "cookies-next";
import  { MqttClient } from "mqtt"
import * as mqtt from "mqtt";
import path from "path";
export type OnMessageCallbak = (msg:Buffer,packet:any)=>void;
interface TopicCB{
  topic:string;
  onMessageCB: OnMessageCallbak;
};
export class MqttConnector{

  
  static myConnection:MqttConnector;
  public static topicHash:string;
   private _connection?:MqttClient;
   private subscriptionList?:TopicCB[]=[];
   private onMessageReceive:mqtt.OnMessageCallback = (topic:string,msg:Buffer,packet:any):void=>{
    //console.log("Internally Received", topic,msg);
    let subscription=this.subscriptionList?.find((top)=>{if(top.topic===topic) return top;});
    if(subscription){
      subscription.onMessageCB(msg,packet)
      return
    }
    console.log("Could not find CB for topic", topic);

   };
   options:mqtt.IClientOptions;

   constructor(url:string='ws://localhost:8080/mqtt',opt:mqtt.IClientOptions={hostname:'localhost',port:9001,path:'/mqtt',clean:true,clientId:'mqtt-asad',protocol:'ws'}){
    this.options = opt;
    this._connection= mqtt.connect(url);
    this._connection.on("connect", () => {
      console.log("Successfully Connected to MQTT");
    });
    this._connection.on("error",(err)=>{
      console.log("MQTT Conn Error ", err)
      this._connection?.end();
    });
    this._connection?.on("message",this.onMessageReceive);

}
  static getConnection(){
    if(!this.topicHash){
      this.topicHash = Math.random().toString(36).slice(-5) + (+new Date).toString(36).slice(-5);
    }
    if(!this.myConnection){
      this.myConnection = new MqttConnector();
      
    }
    return this.myConnection
    
  }

  closeConnection = ():void=>{
    if(this._connection)
      this._connection.end();
  }
  
    subscribeTopic=(topic:string, onMessageCB:(msg:Buffer,packet:any)=>void):void=>{
    if(this._connection)
    {
      
      if(this.subscriptionList)
      if((this.subscriptionList.findIndex((top)=>{top.topic===topic})>0)){
        console.log("Topic Already Subscribed");
        return
      }

      this._connection.subscribe(topic, (err:any)=>{
        if(!err){
          console.log("Subscribed to", topic);
          this.subscriptionList?.push({topic,onMessageCB});
        }
        else{
          console.log("Did not Subscribe to", topic);
        }
        //console.log("Subs List",this.subscriptionList)
      });
    }
  }

  unSubscribeTopic= (topic:string):void=>{
    if(this._connection)
    {
      this._connection.unsubscribe(topic)
      console.log("UnSubscribed from", topic);
      this.subscriptionList= this.subscriptionList?.filter((top:TopicCB)=>top.topic!==topic);
    }
  }
  
  publishMessage = (topic:string, msg:string):void=>{
    if(this._connection)
      this._connection.publish(topic, msg);
  }
  public static getMultiverseSendTopicString= (hash?:string):string=>{
    var topicString= "";
    const userObj:any = getCookie('user');
    let user = null;
    if (userObj) user = JSON.parse(userObj);
    if(hash!== undefined){
      topicString= user?._id + "/" + hash + "/toMultiverse"
    }
    else{
      topicString= user?._id + "/" + this.topicHash + "/toMultiverse"
    }
    
    return topicString;
  }
  public static getMultiverseRecTopicString= (hash?:string):string=>{
    var topicString= "";
    const userObj: any = getCookie('user');
    let user = null;
    if (userObj) user = JSON.parse(userObj);
    if(hash!== undefined)
    {
      topicString= user._id + "/" + hash + "/fromMultiverse"
    }
    else
    {
    topicString= user._id + "/" + this.topicHash + "/fromMultiverse"
    }
    
    return topicString;
  }


}


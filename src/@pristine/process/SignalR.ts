import {Injectable} from '@angular/core';
import {HubConnection, HubConnectionBuilder, LogLevel} from "@microsoft/signalr";
import {receiverData, ReceiveResponseMessageModel} from "../../app/modal/SignalRModel";

@Injectable({
  providedIn: 'root'
})
export class SignalR {
  private hubConnection: HubConnection;

  constructor() {

  }

  // start the connection for whole app
  public startConnection = (emailid: string, url: string) => {
    if(this.hubConnection==null && this.hubConnection==undefined){
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(url + '?email=' + emailid).withAutomaticReconnect().configureLogging(LogLevel.Information).build();

    // web  start connection
    this.hubConnection
      .start()
      .then(() => {
        //console.log('Connection started');
        this.receiveDataFromServerListener();
      }, error => {
        console.log(error);
      })
      .catch(err => {
        console.log('Error while starting connection: ' + err)
      });
    // call this method when  web shoket going to close connection
    this.hubConnection.onclose(error => {
      console.log(error);
    });
    }
  };
  public receiveDataFromServerListener = () => {
    this.hubConnection.on('notification', (data: ReceiveResponseMessageModel) => {
      receiverData.next(data);
      //console.log(data);
    });
    this.hubConnection.on('logoutAllDevices', (data: ReceiveResponseMessageModel) => {
      receiverData.next(data);
      //console.log(data);
    });
  };


  public stopSignalRConnection=()=>{
    this.hubConnection.stop();
  }
}

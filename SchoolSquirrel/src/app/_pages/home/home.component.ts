import { Component } from "@angular/core";
import { AuthenticationService } from "../../_services/authentication.service";

const JitsiMeetJS = (require as any)("@lyno/lib-jitsi-meet");

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"],
})
export class HomeComponent {
    constructor(public authenticationService: AuthenticationService) {
        this.jitsi = JitsiMeetJS;
        console.log(JitsiMeetJS);
    }
    title = "jitsi-meet-angular";
  private jitsi: any;
  private connection: any;
  private room: any;

  private initOptions = {
      disableAudioLevels: true,
  }

  private confOptions = {
      openBridgeChannel: true,
  }

  private options = {
      hosts: {
          domain: "beta.meet.jit.si",

          muc: "conference.beta.meet.jit.si", // FIXME: use XEP-0030
          focus: "focus.beta.meet.jit.si",
      },
      /*disableSimulcast: false,
      enableRemb: false,
      enableTcc: true,
      resolution: 720,
      constraints: {
          video: {
              aspectRatio: 16 / 9,
              height: {
                  ideal: 720,
                  max: 720,
                  min: 180,
              },
              width: {
                  ideal: 1280,
                  max: 1280,
                  min: 320,
              },
          },
      },
      externalConnectUrl: "//beta.meet.jit.si/http-pre-bind",
      p2pStunServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
      ],
      enableP2P: true, // flag to control P2P connections
      p2p: {
          enabled: true,
          preferH264: true,
          disableH264: true,
          useStunTurn: true, // use XEP-0215 to fetch STUN and TURN server for the P2P connection
          stunServers: [
              { urls: "stun:stun.l.google.com:19302" },
              { urls: "stun:stun1.l.google.com:19302" },
              { urls: "stun:stun2.l.google.com:19302" },
          ],
      },
      useStunTurn: true, // use XEP-0215 to fetch STUN and TURN server for the JVB connection
      useIPv6: false, // ipv6 support. use at your own risk
      useNicks: false,
      bosh: "https://beta.meet.jit.si/http-bind", // FIXME: use xep-0156 for that
      openBridgeChannel: "websocket", // One of true, 'datachannel', or 'websocket'
      channelLastN: -1, // The default value of the channel attribute last-n.
      minHDHeight: 540,
      startBitrate: "800",
      useRtcpMux: true,
      useBundle: true,
      disableSuspendVideo: true,
      stereo: false,
      forceJVB121Ratio: -1,
      enableTalkWhileMuted: true,
      enableClosePage: true,*/

  };

  private createConnection(options): any {
      return new this.jitsi.JitsiConnection(null, null, options);
  }

  private setConnectionListeners(connection: any): void {
      connection.addEventListener(this.jitsi.events.connection.CONNECTION_ESTABLISHED, this.onConnectionSuccess);
      connection.addEventListener(this.jitsi.events.connection.CONNECTION_FAILED, this.onConnectionFailed);
      connection.addEventListener(this.jitsi.events.connection.CONNECTION_DISCONNECTED, this.disconnect);
      connection.connect();
      console.log(connection, "connection");
  }

  private createRoom(connection: any, options: any) : void {
      this.room = connection.initJitsiConference("hgjfjgzjrtreseedfsadas", options);
  }

  private setRoomListeners(room: any): void {
      room.on(this.jitsi.events.conference.TRACK_ADDED, this.onRemoteTrack);
      room.on(this.jitsi.events.conference.CONFERENCE_JOINED, this.onConferenceJoined);
  }

  private onConnectionSuccess(): void {
      console.log("onConnectionSuccess");
  }

  private onConnectionFailed(): void {
      console.log("onConnectionFailed");
  }

  private disconnect(): void {
      console.log("disconnecting?");
  }

  private onRemoteTrack(): void {
      console.log("onRemoteTrack");
  }

  private onConferenceJoined(): void {
      console.log("onConferenceJoined");
  }

  ngOnInit() {
      this.jitsi.init(this.initOptions);
      this.connection = this.createConnection(this.options);
      this.setConnectionListeners(this.connection);
      this.createRoom(this.connection, this.confOptions);
      this.setRoomListeners(this.room);
      this.room.join();
  }
}

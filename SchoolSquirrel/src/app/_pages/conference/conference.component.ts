/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
import { Component } from "@angular/core";
import { ConfigService } from "../../_services/config.service";

declare const JitsiMeetJS: any;
declare const $: any;

@Component({
    selector: "app-conference",
    templateUrl: "./conference.component.html",
    styleUrls: ["./conference.component.scss"],
})
export class ConferenceComponent {
    confOptions: { openBridgeChannel: boolean; };
    connection: any;
    isJoined: boolean;
    room: any;
    localTracks: any[] = [];
    remoteTracks: any = [];
    isVideo = true;
    initOptions: { disableAudioLevels: boolean; };
    constructor(private configService: ConfigService) {}
    public async ngOnInit(): Promise<void> {
        await this.loadScript("https://code.jquery.com/jquery-3.5.1.min.js");
        this.loadScript(`https://${this.configService.config.jitsiMeetUrl}/libs/lib-jitsi-meet.min.js`).then(() => {
            const options = {
                hosts: {
                    domain: this.configService.config.jitsiMeetUrl,
                    muc: this.configService.config.jitsiMeetUrl,
                },
                bosh: `https://${this.configService.config.jitsiMeetUrl}/http-bind`,
                clientNode: "http://jitsi.org/jitsimeet",
            };

            this.confOptions = {
                openBridgeChannel: true,
            };

            this.connection = null;
            this.isJoined = false;
            this.room = null;

            this.localTracks = [];
            this.remoteTracks = {};

            $(window).bind("beforeunload", this.unload);
            $(window).bind("unload", this.unload);

            // JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
            this.initOptions = {
                disableAudioLevels: true,
            };

            JitsiMeetJS.init(this.initOptions);

            this.connection = new JitsiMeetJS.JitsiConnection(null, null, options);

            this.connection.addEventListener(
                JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
                this.onConnectionSuccess,
            );
            this.connection.addEventListener(
                JitsiMeetJS.events.connection.CONNECTION_FAILED,
                this.onConnectionFailed,
            );
            this.connection.addEventListener(
                JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
                this.disconnect,
            );

            JitsiMeetJS.mediaDevices.addEventListener(
                JitsiMeetJS.events.mediaDevices.DEVICE_LIST_CHANGED,
                this.onDeviceListChanged,
            );

            this.connection.connect();

            JitsiMeetJS.createLocalTracks({ devices: ["audio", "video"] })
                .then((t) => {
                    this.onLocalTracks(t);
                })
                .catch((error) => {
                    throw error;
                });

            if (JitsiMeetJS.mediaDevices.isDeviceChangeAvailable("output")) {
                JitsiMeetJS.mediaDevices.enumerateDevices((devices) => {
                    const audioOutputDevices = devices.filter((d) => d.kind === "audiooutput");

                    if (audioOutputDevices.length > 1) {
                        $("#audioOutputSelect").html(
                            audioOutputDevices
                                .map(
                                    (d) => `<option value="${d.deviceId}">${d.label}</option>`,
                                )
                                .join("\n"),
                        );

                        $("#audioOutputSelectWrapper").show();
                    }
                });
            }
        });
    }

    private async loadScript(url: string): Promise<void> {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.onload = () => resolve();
            script.src = url;
            document.head.appendChild(script);
        });
    }

    /**
     * Handles local tracks.
     * @param tracks Array with JitsiTrack objects
     */
    private onLocalTracks(tracks) {
        this.localTracks = tracks;
        for (let i = 0; i < this.localTracks.length; i++) {
            this.localTracks[i].addEventListener(
                JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED,
                (audioLevel) => console.log(`Audio Level local: ${audioLevel}`),
            );
            this.localTracks[i].addEventListener(
                JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
                () => console.log("local track muted"),
            );
            this.localTracks[i].addEventListener(
                JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
                () => console.log("local track stoped"),
            );
            this.localTracks[i].addEventListener(
                JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
                (deviceId) => console.log(
                    `track audio output device was changed to ${deviceId}`,
                ),
            );
            if (this.localTracks[i].getType() === "video") {
                $("#videos").append(`<video autoplay='1' id='localVideo${i}' />`);
                this.localTracks[i].attach($(`#localVideo${i}`)[0]);
            } else {
                $("#videos").append(
                    `<audio autoplay='1' muted='true' id='localAudio${i}' />`,
                );
                this.localTracks[i].attach($(`#localAudio${i}`)[0]);
            }
            if (this.isJoined) {
                this.room.addTrack(this.localTracks[i]);
            }
        }
    }

    /**
     * Handles remote tracks
     * @param track JitsiTrack object
     */
    private onRemoteTrack(track) {
        if (track.isLocal()) {
            return;
        }
        const participant = track.getParticipantId();

        if (!this.remoteTracks[participant]) {
            this.remoteTracks[participant] = [];
        }
        const idx = this.remoteTracks[participant].push(track);

        track.addEventListener(
            JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED,
            (audioLevel) => console.log(`Audio Level remote: ${audioLevel}`),
        );
        track.addEventListener(
            JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
            () => console.log("remote track muted"),
        );
        track.addEventListener(
            JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
            () => console.log("remote track stoped"),
        );
        track.addEventListener(JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
            (deviceId) => console.log(
                `track audio output device was changed to ${deviceId}`,
            ));
        const id = participant + track.getType() + idx;

        if (track.getType() === "video") {
            $("#videos").append(
                `<video autoplay='1' id='${participant}video${idx}' />`,
            );
        } else {
            $("#videos").append(
                `<audio autoplay='1' id='${participant}audio${idx}' />`,
            );
        }
        track.attach($(`#${id}`)[0]);
    }

    /**
     * That private is executed when the conference is joined
     */
    private onConferenceJoined() {
        console.log("conference joined!");
        this.isJoined = true;
        for (let i = 0; i < this.localTracks.length; i++) {
            this.room.addTrack(this.localTracks[i]);
        }
    }

    /**
     *
     * @param id
     */
    private onUserLeft(id) {
        console.log("user left");
        if (!this.remoteTracks[id]) {
            return;
        }
        const tracks = this.remoteTracks[id];

        for (let i = 0; i < tracks.length; i++) {
            tracks[i].detach($(`#${id}${tracks[i].getType()}`));
        }
    }

    /**
     * That private is called when connection is established successfully
     */
    private onConnectionSuccess() {
        this.room = this.connection.initJitsiConference("conference", this.confOptions);
        this.room.on(JitsiMeetJS.events.conference.TRACK_ADDED, this.onRemoteTrack);
        this.room.on(JitsiMeetJS.events.conference.TRACK_REMOVED, (track) => {
            console.log(`track removed!!!${track}`);
        });
        this.room.on(
            JitsiMeetJS.events.conference.CONFERENCE_JOINED,
            this.onConferenceJoined,
        );
        this.room.on(JitsiMeetJS.events.conference.USER_JOINED, (id) => {
            console.log("user join");
            this.remoteTracks[id] = [];
        });
        this.room.on(JitsiMeetJS.events.conference.USER_LEFT, this.onUserLeft);
        this.room.on(JitsiMeetJS.events.conference.TRACK_MUTE_CHANGED, (track) => {
            console.log(`${track.getType()} - ${track.isMuted()}`);
        });
        this.room.on(
            JitsiMeetJS.events.conference.DISPLAY_NAME_CHANGED,
            (userID, displayName) => console.log(`${userID} - ${displayName}`),
        );
        this.room.on(
            JitsiMeetJS.events.conference.TRACK_AUDIO_LEVEL_CHANGED,
            (userID, audioLevel) => console.log(`${userID} - ${audioLevel}`),
        );
        this.room.on(
            JitsiMeetJS.events.conference.PHONE_NUMBER_CHANGED,
            () => console.log(`${this.room.getPhoneNumber()} - ${this.room.getPhonePin()}`),
        );
        this.room.join();
    }

    /**
     * This private is called when the connection fail.
     */
    private onConnectionFailed() {
        console.error("Connection Failed!");
    }

    /**
     * This private is called when the connection fail.
     */
    private onDeviceListChanged(devices) {
        console.info("current devices", devices);
    }

    /**
     * This private is called when we disconnect.
     */
    private disconnect() {
        console.log("disconnect!");
        this.connection.removeEventListener(
            JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
            this.onConnectionSuccess,
        );
        this.connection.removeEventListener(
            JitsiMeetJS.events.connection.CONNECTION_FAILED,
            this.onConnectionFailed,
        );
        this.connection.removeEventListener(
            JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
            this.disconnect,
        );
    }

    /**
     *
     */
    public unload(): void {
        for (let i = 0; i < this.localTracks?.length; i++) {
            this.localTracks[i].dispose();
        }
        this.room?.leave();
        this.connection?.disconnect();
    }

    /**
     *
     */
    public switchVideo(): void { // eslint-disable-line no-unused-vars
        this.isVideo = !this.isVideo;
        if (this.localTracks[1]) {
            this.localTracks[1].dispose();
            this.localTracks.pop();
        }
        JitsiMeetJS.createLocalTracks({
            devices: [this.isVideo ? "video" : "desktop"],
        })
            .then((tracks) => {
                this.localTracks.push(tracks[0]);
                this.localTracks[1].addEventListener(
                    JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
                    () => console.log("local track muted"),
                );
                this.localTracks[1].addEventListener(
                    JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
                    () => console.log("local track stoped"),
                );
                this.localTracks[1].attach($("#localVideo1")[0]);
                this.room.addTrack(this.localTracks[1]);
            })
            .catch((error) => console.log(error));
    }

    /**
     *
     * @param selected
     */
    public changeAudioOutput(selected): void { // eslint-disable-line no-unused-vars
        JitsiMeetJS.mediaDevices.setAudioOutputDevice(selected.value);
    }
}

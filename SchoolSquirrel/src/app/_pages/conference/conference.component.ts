/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
import { Component } from "@angular/core";
import { ConfigService } from "../../_services/config.service";

@Component({
    selector: "app-conference",
    templateUrl: "./conference.component.html",
    styleUrls: ["./conference.component.scss"],
})
export class ConferenceComponent {
    constructor(private configService: ConfigService) {}
    public ngOnInit(): void {
        this.loadScript(`https://${this.configService.config.jitsiMeetUrl}/external_api.js`).then(() => {
            // eslint-disable-next-line no-new
            new JitsiMeetExternalAPI(this.configService.config.jitsiMeetUrl as string, {
                roomName: "testroom",
                userInfo: {
                    username: "admin",
                },
                parentNode: document.querySelector("#meet"),
                interfaceConfigOverwrite: {
                    HIDE_INVITE_MORE_HEADER: true,
                    SHOW_JITSI_WATERMARK: false,
                    SHOW_BRAND_WATERMARK: false,
                    SHOW_WATERMARK_FOR_GUESTS: false,
                    SHOW_POWERED_BY: false,
                    TOOLBAR_BUTTONS: ["microphone", "camera", "desktop", "fullscreen",
                        "fodeviceselection", "hangup", "raisehand",
                        "videoquality", "filmstrip", "shortcuts",
                        "tileview", "download", "help",
                    ],
                },
            });
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
}

/**
 * Originally created by @Akumzy
 * https://gist.github.com/Akumzy/2a762eebf8d2c3605a489a66fd0ad488
 */

declare class JitsiMeetExternalAPI {
    constructor(
    domain: string,
    options: {
      /** The name of the room to join. */
      roomName: string
      /** Width of the iframe. Check parseSizeParam for format details */
      width?: string | number
      /** Height of the iframe. Check parseSizeParam for format details. */
      height?: string | number
      /** The node that will contain the  iframe. */
      parentNode?: HTMLElement
      /** Object containing configuration options defined in config.js to be overridden. */
      configOverwrite?: Record<string, unknown>
      /** Object containing  configuration options defined in interface_config.js to be overridden. */
        interfaceConfigOverwrite?: Partial<{
            PP_NAME: string,
            AUDIO_LEVEL_PRIMARY_COLOR: string,
            AUDIO_LEVEL_SECONDARY_COLOR: string,

            /**
             * A UX mode where the last screen share participant is automatically
             * pinned. Valid values are the string "remote-only" so remote participants
             * get pinned but not local, otherwise any truthy value for all participants,
             * and any falsy value to disable the feature.
             *
             * Note: this mode is experimental and subject to breakage.
             */
            AUTO_PIN_LATEST_SCREEN_SHARE: string,
            BRAND_WATERMARK_LINK: string,

            /**
             *  A html text to be shown to guests on the close page, false disables it
             */
            CLOSE_PAGE_GUEST_HINT: boolean,
            /**
             * Whether the connection indicator icon should hide itself based on
             * connection strength. If boolean, the connection indicator will remain
             * displayed while the participant has a weak connection and will hide
             * itself after the CONNECTION_INDICATOR_HIDE_TIMEOUT when the connection is
             * strong.
             *
             * @type {boolean}
             */
            CONNECTION_INDICATOR_AUTO_HIDE_ENABLED: boolean,

            /**
             * How long the connection indicator should remain displayed before hiding.
             * Used in conjunction with CONNECTION_INDICATOR_AUTOHIDE_ENABLED.
             *
             * @type {number}
             */
            CONNECTION_INDICATOR_AUTO_HIDE_TIMEOUT: number,

            /**
             * If boolean, hides the connection indicators completely.
             *
             * @type {boolean}
             */
            CONNECTION_INDICATOR_DISABLED: boolean,

            DEFAULT_BACKGROUND: string,
            DEFAULT_LOCAL_DISPLAY_NAME: string,
            DEFAULT_LOGO_URL: string,
            DEFAULT_REMOTE_DISPLAY_NAME: string,
            DEFAULT_WELCOME_PAGE_LOGO_URL: string,

            DISABLE_DOMINANT_SPEAKER_INDICATOR: boolean,

            DISABLE_FOCUS_INDICATOR: boolean,

            /**
             * If boolean, notifications regarding joining/leaving are no longer displayed.
             */
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: boolean,

            /**
             * If boolean, presence status: busy, calling, connected etc. is not displayed.
             */
            DISABLE_PRESENCE_STATUS: boolean,

            /**
             * Whether the ringing sound in the call/ring overlay is disabled. If
             * {@code undefined}, defaults to {@code false}.
             *
             * @type {boolean}
             */
            DISABLE_RINGING: boolean,

            /**
             * Whether the speech to text transcription subtitles panel is disabled.
             * If {@code undefined}, defaults to {@code false}.
             *
             * @type {boolean}
             */
            DISABLE_TRANSCRIPTION_SUBTITLES: boolean,

            /**
             * Whether or not the blurred video background for large video should be
             * displayed on browsers that can support it.
             */
            DISABLE_VIDEO_BACKGROUND: boolean,

            DISPLAY_WELCOME_PAGE_CONTENT: boolean,
            DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT: boolean,

            ENABLE_DIAL_OUT: boolean,

            ENABLE_FEEDBACK_ANIMATION: boolean, // Enables feedback star animation.

            FILM_STRIP_MAX_HEIGHT: number,

            /**
             * Whether to only show the filmstrip (and hide the toolbar).
             */
            filmStripOnly: boolean,

            GENERATE_ROOMNAMES_ON_WELCOME_PAGE: boolean,

            /**
             * Hide the logo on the deep linking pages.
             */
            HIDE_DEEP_LINKING_LOGO: boolean,

            /**
             * Hide the invite prompt in the header when alone in the meeting.
             */
            HIDE_INVITE_MORE_HEADER: boolean,

            INITIAL_TOOLBAR_TIMEOUT: number,
            JITSI_WATERMARK_LINK: string,

            LANG_DETECTION: boolean, // Allow i18n to detect the system language
            LIVE_STREAMING_HELP_LINK: string, // Documentation reference for the live streaming feature.
            LOCAL_THUMBNAIL_RATIO: number, // 16:9

            /**
             * Maximum coefficient of the ratio of the large video to the visible area
             * after the large video is scaled to fit the window.
             *
             * @type {number}
             */
            MAXIMUM_ZOOMING_COEFFICIENT: number,

            /**
             * Whether the mobile app Jitsi Meet is to be promoted to participants
             * attempting to join a conference in a mobile Web browser. If
             * {@code undefined}, defaults to {@code true}.
             *
             * @type {boolean}
             */
            MOBILE_APP_PROMO: boolean,

            NATIVE_APP_NAME: string,

            // Names of browsers which should show a warning stating the current browser
            // has a suboptimal experience. Browsers which are not listed as optimal or
            // unsupported are considered suboptimal. Valid values are:
            // chrome, chromium, edge, electron, firefox, nwjs, opera, safari
            OPTIMAL_BROWSERS: string[],

            POLICY_LOGO: string,
            PROVIDER_NAME: string,

            /**
             * If boolean, will display recent list
             *
             * @type {boolean}
             */
            RECENT_LIST_ENABLED: boolean,
            REMOTE_THUMBNAIL_RATIO: 1, // 1:1

            SETTINGS_SECTIONS: string[],
            SHOW_BRAND_WATERMARK: boolean,

            /**
            * Decides whether the chrome extension banner should be rendered on the landing page and during the meeting.
            * If this is set to boolean, the banner will not be rendered at all. If set to boolean, the check for extension(s)
            * being already installed is done before rendering.
            */
            SHOW_CHROME_EXTENSION_BANNER: boolean,

            SHOW_DEEP_LINKING_IMAGE: boolean,
            SHOW_JITSI_WATERMARK: boolean,
            SHOW_POWERED_BY: boolean,
            SHOW_PROMOTIONAL_CLOSE_PAGE: boolean,
            SHOW_WATERMARK_FOR_GUESTS: boolean, // if watermark is disabled by default, it can be shown only for guests

            /*
             * If indicated some of the error dialogs may point to the support URL for
             * help.
             */
            SUPPORT_URL: string,

            TOOLBAR_ALWAYS_VISIBLE: boolean,

            /**
             * The name of the toolbar buttons to display in the toolbar, including the
             * "More actions" menu. If present, the button will display. Exceptions are
             * "livestreaming" and "recording" which also require being a moderator and
             * some values in config.js to be enabled. Also, the "profile" button will
             * not display for users with a JWT.
             * Notes:
             * - it's impossible to choose which buttons go in the "More actions" menu
             * - it's impossible to control the placement of buttons
             * - 'desktop' controls the "Share your screen" button
             */
            TOOLBAR_BUTTONS: ("microphone"| "camera"| "closedcaptions"| "desktop"| "embedmeeting"| "fullscreen" |
            "fodeviceselection"| "hangup"| "profile"| "chat"| "recording" |
            "livestreaming"| "etherpad"| "sharedvideo"| "settings"| "raisehand" |
            "videoquality"| "filmstrip"| "invite"| "feedback"| "stats"| "shortcuts"|
            "tileview"| "videobackgroundblur"| "download"| "help"| "mute-everyone"| "security")[],

            TOOLBAR_TIMEOUT: number,

            // Browsers, in addition to those which do not fully support WebRTC, that
            // are not supported and should show the unsupported browser page.
            UNSUPPORTED_BROWSERS: string[],

            /**
             * Whether to show thumbnails in filmstrip as a column instead of as a row.
             */
            VERTICAL_FILMSTRIP: boolean,

            // Determines how the video would fit the screen. 'both' would fit the whole
            // screen, 'height' would fit the original video height to the height of the
            // screen, 'width' would fit the original video width to the width of the
            // screen respecting ratio.
            VIDEO_LAYOUT_FIT: string,

            /**
             * If boolean, hides the video quality label indicating the resolution status
             * of the current large video.
             *
             * @type {boolean}
             */
            VIDEO_QUALITY_LABEL_DISABLED: boolean,

            /**
             * When enabled, the kick participant button will not be presented for users without a JWT
             */
            // HIDE_KICK_BUTTON_FOR_GUESTS: boolean,

            /**
             * How many columns the tile view can expand to. The respected range is
             * between 1 and 5.
             */
            // TILE_VIEW_MAX_COLUMNS: 5,

            /**
             * Specify custom URL for downloading android mobile app.
             */
            // MOBILE_DOWNLOAD_LINK_ANDROID: 'https://play.google.com/store/apps/details?id=org.jitsi.meet',

            /**
             * Specify URL for downloading ios mobile app.
             */
            // MOBILE_DOWNLOAD_LINK_IOS: 'https://itunes.apple.com/us/app/jitsi-meet/id1165103905',

            /**
             * Specify Firebase dynamic link properties for the mobile apps.
             */
            // MOBILE_DYNAMIC_LINK: {
            //    APN: 'org.jitsi.meet',
            //    APP_CODE: 'w2atb',
            //    CUSTOM_DOMAIN: undefined,
            //    IBI: 'com.atlassian.JitsiMeet.ios',
            //    ISI: '1165103905'
            // },

            /**
             * Specify mobile app scheme for opening the app from the mobile browser.
             */
            // APP_SCHEME: 'org.jitsi.meet',

            /**
             * Specify the Android app package name.
             */
            // ANDROID_APP_PACKAGE: 'org.jitsi.meet',

            /**
             * Override the behavior of some notifications to remain displayed until
             * explicitly dismissed through a user action. The value is how long, in
             * milliseconds, those notifications should remain displayed.
             */
            // ENFORCE_NOTIFICATION_AUTO_DISMISS_TIMEOUT: 15000,

            // List of undocumented settings
            /**
             INDICATOR_FONT_SIZES
             PHONE_NUMBER_REGEX
            */
      }>
      /** If the value is true https won't be used. */
      noSSL?: boolean
      /** The JWT token if needed by jitsi-meet for authentication. */
      jwt?: string
      /** The onload function that will listen for iframe onload event. */
      onload?: () => void
      /** Array of objects containing information about new participants that will be invited in the call. */
      invitees?: Array<Record<string, unknown>>
      /** Array of objects containing information about the initial devices that will be used in the call. */
      devices?: Array<Record<string, unknown>>
      /** Object containing information about the participant opening the meeting. */
      userInfo: Record<string, unknown>
    },
  )
  /**
   * Creates the iframe element.
   *
   * @param {number|string} height - The height of the iframe. Check
   * parseSizeParam for format details.
   * @param {number|string} width - The with of the iframe. Check
   * parseSizeParam for format details.
   * @param {Function} onload - The function that will listen
   * for onload event.
   * @returns {void}
   *
   * @private
   */
    private _createIFrame (height: number | string, width: number | string, onload: () => void): void

    /**
   * Returns arrays with the all resources for the always on top feature.
   *
   * @returns {Array<string>}
   */
    private _getAlwaysOnTopResources (): Array<string>

    /**
   * Returns the id of the on stage participant.
   *
   * @returns {string} - The id of the on stage participant.
   */
    private _getOnStageParticipant (): string

    /**
   * Getter for the large video element in Jitsi Meet.
   *
   * @returns {HTMLElement|undefined} - The large video.
   */
    private _getLargeVideo (): HTMLElement | undefined

    /**
   * Getter for participant specific video element in Jitsi Meet.
   *
   * @param {string|undefined} participantId - Id of participant to return the video for.
   *
   * @returns {HTMLElement|undefined} - The requested video. Will return the local video
   * by default if participantId is undefined.
   */
    private _getParticipantVideo (participantId: string | undefined): HTMLElement | undefined

    /**
     * Sets the size of the iframe element.
     *
     * @param {number|string} height - The height of the iframe.
     * @param {number|string} width - The with of the iframe.

     */
    private _setSize (height: number | string, width: number | string): void

    /**
     * Setups listeners that are used internally for JitsiMeetExternalAPI.
     *

     */
    private _setupListeners (): void
    /**
    * Returns the formatted display name of a participant.
    *
    * @param {string} participantId - The id of the participant.
    * @returns {string} The formatted display name.
    */
    private _getFormattedDisplayName (participantId: string): string
    /**
   * Adds event listener to Meet Jitsi.
   *
   * @param {string} event - The name of the event.
   * @param {Function} listener - The listener.
   * @returns {void}
   *
   * @deprecated
   * NOTE: This method is not removed for backward comatability purposes.
   */
    addEventListener (event: string, listener: () => void): void
    /**
   * Adds event listeners to Meet Jitsi.
   *
   * @param {Object} listeners - The object key should be the name of
   * the event and value - the listener.
   * Currently we support the following
   * events:
   * {@code incomingMessage} - receives event notifications about incoming
   * messages. The listener will receive object with the following structure:
   * {{
   *  'from': from,//JID of the user that sent the message
   *  'nick': nick,//the nickname of the user that sent the message
   *  'message': txt//the text of the message
   * }}
   * {@code outgoingMessage} - receives event notifications about outgoing
   * messages. The listener will receive object with the following structure:
   * {{
   *  'message': txt//the text of the message
   * }}
   * {@code displayNameChanged} - receives event notifications about display
   * name change. The listener will receive object with the following
   * structure:
   * {{
   * jid: jid,//the JID of the participant that changed his display name
   * displayname: displayName //the new display name
   * }}
   * {@code participantJoined} - receives event notifications about new
   * participant.
   * The listener will receive object with the following structure:
   * {{
   * jid: jid //the jid of the participant
   * }}
   * {@code participantLeft} - receives event notifications about the
   * participant that left the room.
   * The listener will receive object with the following structure:
   * {{
   * jid: jid //the jid of the participant
   * }}
   * {@code videoConferenceJoined} - receives event notifications about the
   * local user has successfully joined the video conference.
   * The listener will receive object with the following structure:
   * {{
   * roomName: room //the room name of the conference
   * }}
   * {@code videoConferenceLeft} - receives event notifications about the
   * local user has left the video conference.
   * The listener will receive object with the following structure:
   * {{
   * roomName: room //the room name of the conference
   * }}
   * {@code screenSharingStatusChanged} - receives event notifications about
   * turning on/off the local user screen sharing.
   * The listener will receive object with the following structure:
   * {{
   * on: on //whether screen sharing is on
   * }}
   * {@code dominantSpeakerChanged} - receives event notifications about
   * change in the dominant speaker.
   * The listener will receive object with the following structure:
   * {{
   * id: participantId //participantId of the new dominant speaker
   * }}
   *
   * {@code suspendDetected} - receives event notifications about detecting suspend event in host computer.
   * {@code readyToClose} - all hangup operations are completed and Jitsi Meet
   * is ready to be disposed.
   * @returns {void}
   *
   * @deprecated
   * NOTE: This method is not removed for backward comatability purposes.
   */
    addEventListeners (listeners: Record<string, unknown>): void
    /**
   * Removes the listeners and removes the Jitsi Meet frame.
   *
   * @returns {void}
   */
    dispose (): void

    /**
   * Executes command. The available commands are:
   * {@code displayName} - Sets the display name of the local participant to
   * the value passed in the arguments array.
   * {@code subject} - Sets the subject of the conference, the value passed
   * in the arguments array. Note: Available only for moderator.
   *
   * {@code toggleAudio} - Mutes / unmutes audio with no arguments.
   * {@code toggleVideo} - Mutes / unmutes video with no arguments.
   * {@code toggleFilmStrip} - Hides / shows the filmstrip with no arguments.
   *
   * If the command doesn't require any arguments the parameter should be set
   * to empty array or it may be omitted.
   *
   * @param {string} name - The name of the command.
   * @returns {void}
   */
    executeCommand (name: string, ...args): void
    /**
   * Executes commands. The available commands are:
   * {@code displayName} - Sets the display name of the local participant to
   * the value passed in the arguments array.
   * {@code toggleAudio} - Mutes / unmutes audio. No arguments.
   * {@code toggleVideo} - Mutes / unmutes video. No arguments.
   * {@code toggleFilmStrip} - Hides / shows the filmstrip. No arguments.
   * {@code toggleChat} - Hides / shows chat. No arguments.
   * {@code toggleShareScreen} - Starts / stops screen sharing. No arguments.
   *
   * @param {Object} commandList - The object with commands to be executed.
   * The keys of the object are the commands that will be executed and the
   * values are the arguments for the command.
   * @returns {void}
   */
    executeCommands (commandList: Record<string, unknown>): void

    /**
   * Returns Promise that resolves with a list of available devices.
   *
   * @returns {Promise}
   */
    getAvailableDevices (): Promise<any>
    /**
   * Returns Promise that resolves with current selected devices.
   *
   * @returns {Promise}
   */
    getCurrentDevices (): Promise<any>
    /**
   * Check if the audio is available.
   *
   * @returns {Promise} - Resolves with true if the audio available, with
   * false if not and rejects on failure.
   */
    isAudioAvailable (): Promise<boolean>

    /**
   * Returns Promise that resolves with true if the device change is available
   * and with false if not.
   *
   * @param {string} [deviceType] - Values - 'output', 'input' or undefined.
   * Default - 'input'.
   * @returns {Promise}
   */
    isDeviceChangeAvailable (deviceType: "output" | "input" | undefined): Promise<boolean>
    /**
   * Returns Promise that resolves with true if the device list is available
   * and with false if not.
   *
   */
    isDeviceListAvailable (): Promise<boolean>
    /**
   * Returns Promise that resolves with true if multiple audio input is supported
   * and with false if not.
   */
    isMultipleAudioInputSupported (): Promise<boolean>
    /**
   * Invite people to the call.
   *
   * @param {Array<Object>} invitees - The invitees.
   * @returns {Promise} - Resolves on success and rejects on failure.
   */
    invite (invitees: Array<Record<string, unknown>>): Promise<any>

    /**
   * Returns the audio mute status.
   *
   * @returns {Promise} - Resolves with the audio mute status and rejects on
   * failure.
   */
    isAudioMuted (): Promise<any>

    /**
   * Returns the avatar URL of a participant.
   *
   * @param {string} participantId - The id of the participant.
   * @returns {string} The avatar URL.
   */
    getAvatarURL (participantId: string): string
    /**
   * Returns the display name of a participant.
   *
   * @param {string} participantId - The id of the participant.
   * @returns {string} The display name.
   */
    getDisplayName (participantId: string): string
    /**
   * Returns the email of a participant.
   *
   * @param {string} participantId - The id of the participant.
   * @returns {string} The email.
   */
    getEmail (participantId: string): string

    /**
   * Returns the iframe that loads Jitsi Meet.
   *
   * @returns {HTMLElement} The iframe.
   */
    getIFrame (): HTMLElement
    /**
   * Returns the number of participants in the conference. The local
   * participant is included.
   *
   * @returns {number} The number of participants in the conference.
   */
    getNumberOfParticipants (): number

    /**
   * Check if the video is available.
   *
   * @returns {Promise} - Resolves with true if the video available, with
   * false if not and rejects on failure.
   */
    isVideoAvailable (): Promise<any>

    /**
   * Returns the audio mute status.
   *
   * @returns {Promise} - Resolves with the audio mute status and rejects on
   * failure.
   */
    isVideoMuted (): Promise<any>

    /**
   * Removes event listener.
   *
   * @param {string} event - The name of the event.
   * @returns {void}
   *
   * @deprecated
   * NOTE: This method is not removed for backward comatability purposes.
   */
    removeEventListener (event: string): void
    /**
   * Removes event listeners.
   *
   * @param {Array<string>} eventList - Array with the names of the events.
   * @returns {void}
   *
   * @deprecated
   * NOTE: This method is not removed for backward comatability purposes.
   */
    removeEventListeners (eventList: Array<string>): void
    /**
   * Passes an event along to the local conference participant to establish
   * or update a direct peer connection. This is currently used for developing
   * wireless screensharing with room integration and it is advised against to
   * use as its api may change.
   *
   * @param {Object} event - An object with information to pass along.
   * @param {Object} event.data - The payload of the event.
   * @param {string} event.from - The jid of the sender of the event. Needed
   * when a reply is to be sent regarding the event.
   * @returns {void}
   */
    sendProxyConnectionEvent (event: { data: Record<string, unknown>; from: string }): void

    /**
   * Sets the audio input device to the one with the label or id that is
   * passed.
   *
   * @param {string} label - The label of the new device.
   * @param {string} deviceId - The id of the new device.
   * @returns {Promise}
   */
    setAudioInputDevice (label: string, deviceId: string): Promise<any>
    /**
   * Sets the audio output device to the one with the label or id that is
   * passed.
   *
   * @param {string} label - The label of the new device.
   * @param {string} deviceId - The id of the new device.
   * @returns {Promise}
   */
    setAudioOutputDevice (label: string, deviceId: string): Promise<any>
    /**
   * Sets the video input device to the one with the label or id that is
   * passed.
   *
   * @param {string} label - The label of the new device.
   * @param {string} deviceId - The id of the new device.
   * @returns {Promise}
   */
    setVideoInputDevice (label: string, deviceId: string): Promise<any>
}

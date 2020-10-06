import { Component } from "@angular/core";
import { AuthenticationService } from "../../_services/authentication.service";
import { NavbarActionItem } from "../../_models/NavbarActionItem";

declare const JitsiMeetExternalAPI: any;

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"],
})
export class HomeComponent {
    public actionItems: NavbarActionItem[] = [
        {
            android: {
                icon: "ic_settings",
                position: "popup",
            },
            ios: {
                position: "right",
                icon: "0",
            },
            text: "Einstellungen",
            id: "settings",
        },
        {
            android: {
                icon: "stat_sys_certificate_info",
                position: "popup",
            },
            ios: {
                position: "right",
                icon: "0",
            },
            text: "Info",
            id: "info",
        },
    ];
    constructor(
        public authenticationService: AuthenticationService,
    ) { }

    public ngOnInit(): void {
        const interfaceConfig = {
            APP_NAME: "Jitsi Meet",
            AUDIO_LEVEL_PRIMARY_COLOR: "rgba(255,255,255,0.4)",
            AUDIO_LEVEL_SECONDARY_COLOR: "rgba(255,255,255,0.2)",

            /**
     * A UX mode where the last screen share participant is automatically
     * pinned. Valid values are the string "remote-only" so remote participants
     * get pinned but not local, otherwise any truthy value for all participants,
     * and any falsy value to disable the feature.
     *
     * Note: this mode is experimental and subject to breakage.
     */
            AUTO_PIN_LATEST_SCREEN_SHARE: "remote-only",
            BRAND_WATERMARK_LINK: "",

            CLOSE_PAGE_GUEST_HINT: false,
            // A html text to be shown to guests on the close page, false disables it
            /**
     * Whether the connection indicator icon should hide itself based on
     * connection strength. If true, the connection indicator will remain
     * displayed while the participant has a weak connection and will hide
     * itself after the CONNECTION_INDICATOR_HIDE_TIMEOUT when the connection is
     * strong.
     *
     * @type {boolean}
     */
            CONNECTION_INDICATOR_AUTO_HIDE_ENABLED: true,

            /**
     * How long the connection indicator should remain displayed before hiding.
     * Used in conjunction with CONNECTION_INDICATOR_AUTOHIDE_ENABLED.
     *
     * @type {number}
     */
            CONNECTION_INDICATOR_AUTO_HIDE_TIMEOUT: 5000,

            /**
     * If true, hides the connection indicators completely.
     *
     * @type {boolean}
     */
            CONNECTION_INDICATOR_DISABLED: false,

            DEFAULT_BACKGROUND: "#474747",
            DEFAULT_LOCAL_DISPLAY_NAME: "me",
            DEFAULT_LOGO_URL: "images/watermark.png",
            DEFAULT_REMOTE_DISPLAY_NAME: "Fellow Jitster",
            DEFAULT_WELCOME_PAGE_LOGO_URL: "images/watermark.png",

            DISABLE_DOMINANT_SPEAKER_INDICATOR: false,

            DISABLE_FOCUS_INDICATOR: false,

            /**
     * If true, notifications regarding joining/leaving are no longer displayed.
     */
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,

            /**
     * If true, presence status: busy, calling, connected etc. is not displayed.
     */
            DISABLE_PRESENCE_STATUS: false,

            /**
     * Whether the ringing sound in the call/ring overlay is disabled. If
     * {@code undefined}, defaults to {@code false}.
     *
     * @type {boolean}
     */
            DISABLE_RINGING: false,

            /**
     * Whether the speech to text transcription subtitles panel is disabled.
     * If {@code undefined}, defaults to {@code false}.
     *
     * @type {boolean}
     */
            DISABLE_TRANSCRIPTION_SUBTITLES: false,

            /**
     * Whether or not the blurred video background for large video should be
     * displayed on browsers that can support it.
     */
            DISABLE_VIDEO_BACKGROUND: false,

            DISPLAY_WELCOME_PAGE_CONTENT: true,
            DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT: false,

            ENABLE_DIAL_OUT: true,

            ENABLE_FEEDBACK_ANIMATION: false, // Enables feedback star animation.

            FILM_STRIP_MAX_HEIGHT: 120,

            /**
     * Whether to only show the filmstrip (and hide the toolbar).
     */
            filmStripOnly: false,

            GENERATE_ROOMNAMES_ON_WELCOME_PAGE: true,

            /**
     * Hide the logo on the deep linking pages.
     */
            HIDE_DEEP_LINKING_LOGO: false,

            /**
     * Hide the invite prompt in the header when alone in the meeting.
     */
            HIDE_INVITE_MORE_HEADER: false,

            INITIAL_TOOLBAR_TIMEOUT: 20000,
            JITSI_WATERMARK_LINK: "https://jitsi.org",

            LANG_DETECTION: true, // Allow i18n to detect the system language
            LIVE_STREAMING_HELP_LINK: "https://jitsi.org/live", // Documentation reference for the live streaming feature.
            LOCAL_THUMBNAIL_RATIO: 16 / 9, // 16:9

            /**
     * Maximum coefficient of the ratio of the large video to the visible area
     * after the large video is scaled to fit the window.
     *
     * @type {number}
     */
            MAXIMUM_ZOOMING_COEFFICIENT: 1.3,

            /**
     * Whether the mobile app Jitsi Meet is to be promoted to participants
     * attempting to join a conference in a mobile Web browser. If
     * {@code undefined}, defaults to {@code true}.
     *
     * @type {boolean}
     */
            MOBILE_APP_PROMO: true,

            NATIVE_APP_NAME: "Jitsi Meet",

            // Names of browsers which should show a warning stating the current browser
            // has a suboptimal experience. Browsers which are not listed as optimal or
            // unsupported are considered suboptimal. Valid values are:
            // chrome, chromium, edge, electron, firefox, nwjs, opera, safari
            OPTIMAL_BROWSERS: ["chrome", "chromium", "firefox", "nwjs", "electron", "safari"],

            POLICY_LOGO: null,
            PROVIDER_NAME: "Jitsi",

            /**
     * If true, will display recent list
     *
     * @type {boolean}
     */
            RECENT_LIST_ENABLED: true,
            REMOTE_THUMBNAIL_RATIO: 1, // 1:1

            SETTINGS_SECTIONS: ["devices", "language", "moderator", "profile", "calendar"],
            SHOW_BRAND_WATERMARK: false,

            /**
    * Decides whether the chrome extension banner
    * should be rendered on the landing page and during the meeting.
    * If this is set to false, the banner wil
    *  not be rendered at all. If set to true, the check for extension(s)
    * being already installed is done before rendering.
    */
            SHOW_CHROME_EXTENSION_BANNER: false,

            SHOW_DEEP_LINKING_IMAGE: false,
            SHOW_JITSI_WATERMARK: false,
            SHOW_POWERED_BY: false,
            SHOW_PROMOTIONAL_CLOSE_PAGE: false,
            SHOW_WATERMARK_FOR_GUESTS: false,

            /*
     * If indicated some of the error dialogs may point to the support URL for
     * help.
     */
            SUPPORT_URL: "https://community.jitsi.org/",

            TOOLBAR_ALWAYS_VISIBLE: false,

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
            TOOLBAR_BUTTONS: [
                "microphone", "camera", "desktop", "fullscreen",
                "fodeviceselection", "hangup",
                "sharedvideo", "settings", "raisehand",
                "videoquality", "filmstrip",
                "tileview", "videobackgroundblur", "mute-everyone",
            ],

            TOOLBAR_TIMEOUT: 4000,

            // Browsers, in addition to those which do not fully support WebRTC, that
            // are not supported and should show the unsupported browser page.
            UNSUPPORTED_BROWSERS: [],

            /**
     * Whether to show thumbnails in filmstrip as a column instead of as a row.
     */
            VERTICAL_FILMSTRIP: true,

            // Determines how the video would fit the screen. 'both' would fit the whole
            // screen, 'height' would fit the original video height to the height of the
            // screen, 'width' would fit the original video width to the width of the
            // screen respecting ratio.
            VIDEO_LAYOUT_FIT: "both",

            /**
     * If true, hides the video quality label indicating the resolution status
     * of the current large video.
     *
     * @type {boolean}
     */
            VIDEO_QUALITY_LABEL_DISABLED: false,

            /**
     * When enabled, the kick participant button will not be presented for users without a JWT
     */
            // HIDE_KICK_BUTTON_FOR_GUESTS: false,

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

            // Allow all above example options to include a trailing comma and
            // prevent fear when commenting out the last value.
            // eslint-disable-next-line sort-keys
            makeJsonParserHappy: "even if last key had a trailing comma",
        };
        this.loadScript("https://meet.jit.si/external_api.js").then(() => {
            const domain = "meet.jit.si";
            const options = {
                roomName: "asfasdfasdfasdfasdfasdfsd",
                width: 700,
                height: 700,
                parentNode: document.querySelector("#meet"),
                userInfo: {
                    email: "email@jitsiexamplemail.com",
                    displayName: "John Doe",
                },
                interfaceConfigOverwrite: interfaceConfig,
                configOverwrite: {
                    prejoinPageEnabled: false,
                    defaultLanguage: "de",
                },
            };
            const api = new JitsiMeetExternalAPI(domain, options);
        });
    }

    private loadScript(src: string) {
        console.log("loaded");
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.src = src;
            script.onload = () => {
                resolve();
            };
            script.onerror = (error: any) => reject(error);
            document.getElementsByTagName("head")[0].appendChild(script);
        });
    }
}

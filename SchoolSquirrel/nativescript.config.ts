import { NativeScriptConfig } from "@nativescript/core";

export default {
    id: "com.schoolsquirrel.SchoolSquirrel",
    appResourcesPath: "App_Resources",
    android: {
        v8Flags: "--expose_gc",
        markingMode: "none",
    },
    appPath: "src",
    nsext: ".tns",
    webext: "",
    shared: true,
    useLegacyWorkflow: false,
} as NativeScriptConfig;

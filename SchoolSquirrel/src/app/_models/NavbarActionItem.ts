export type NavbarActionItem = {
    id: string;
    text?: string;
    ios: {
        icon: string;
        position: "left" | "right";
    },
    android: {
        icon: string;
        position: "actionBar" | "popup" | "actionBarIfRoom";
    }
}
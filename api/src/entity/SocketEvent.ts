export enum SocketEvent {
    USER_ONLINE_STATUS = "USER_ONLINE_STATUS",
    USER_TYPING_STATUS = "USER_TYPING_STATUS",
    ACTIVE_CHAT = "ACTIVE_CHAT"
}

export interface USER_ONLINE_STATUS_PAYLOAD {
    userId: string;
    online: boolean;
}

export interface USER_TYPING_STATUS_PAYLOAD {
    username: string,
    typing: boolean,
}

export interface ACTIVE_CHAT_PAYLOAD {
    chatId: string | null;
}

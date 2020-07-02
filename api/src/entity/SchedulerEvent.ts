export interface SchedulerEvent {
    Id: number;
    Subject: string;
    Description: string;
    Location: string;
    StartTime: Date;
    EndTime: Date;
    IsAllDay: boolean;
    StartTimezone: string;
    EndTimezone: string;
    RecurrenceRule: string;
}
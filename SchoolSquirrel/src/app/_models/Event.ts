
/*    +-----------------------------------------------------------------------+    */
/*    |    Do not edit this file directly.                                    |    */
/*    |    It was copied by redundancyJS.                                     |    */
/*    |    To modify it, first edit the source file (see redundancy.json).    |    */
/*    |    Then, run "npx redundancyjs" in the terminal.                      |    */
/*    +-----------------------------------------------------------------------+    */

/* do not edit */ 
/* do not edit */ import { SchedulerEvent } from "./SchedulerEvent";
/* do not edit */ import { User } from "./User";
/* do not edit */ import { EventCategory } from "./EventCategory";
/* do not edit */ 
/* do not edit */ 
/* do not edit */ export class Event implements SchedulerEvent {
/* do not edit */     
/* do not edit */     public Id: string;
/* do not edit */ 
/* do not edit */     
/* do not edit */     public Subject: string;
/* do not edit */ 
/* do not edit */     
/* do not edit */     public Description: string;
/* do not edit */ 
/* do not edit */     
/* do not edit */     public Location: string;
/* do not edit */ 
/* do not edit */     
/* do not edit */     public StartTime: Date;
/* do not edit */ 
/* do not edit */     
/* do not edit */     public EndTime: Date;
/* do not edit */ 
/* do not edit */     
/* do not edit */     public IsAllDay: boolean;
/* do not edit */ 
/* do not edit */     
/* do not edit */     public StartTimezone: string;
/* do not edit */ 
/* do not edit */     
/* do not edit */     public EndTimezone: string;
/* do not edit */ 
/* do not edit */     
/* do not edit */     public RecurrenceRule: string;
/* do not edit */ 
/* do not edit */     
/* do not edit */     public user: User;
/* do not edit */ 
/* do not edit */     public Category: EventCategory;
/* do not edit */ }
/* do not edit */
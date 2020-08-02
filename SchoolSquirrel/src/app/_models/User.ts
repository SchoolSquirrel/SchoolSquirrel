
/*    +-----------------------------------------------------------------------+    */
/*    |    Do not edit this file directly.                                    |    */
/*    |    It was copied by redundancyJS.                                     |    */
/*    |    To modify it, first edit the source file (see redundancy.json).    |    */
/*    |    Then, run "npx redundancyjs" in the terminal.                      |    */
/*    +-----------------------------------------------------------------------+    */

/* do not edit */ 
/* do not edit */ 
/* do not edit */ import { Grade } from "./Grade";
/* do not edit */ import { Course } from "./Course";
/* do not edit */ import { Chat } from "./Chat";
/* do not edit */ import { Message } from "./Message";
/* do not edit */ import { Event } from "./Event";
/* do not edit */ import { Assignment } from "./Assignment";
/* do not edit */ 
/* do not edit */ 
/* do not edit */ 
/* do not edit */ export class User {
/* do not edit */     
/* do not edit */     public id: number;
/* do not edit */ 
/* do not edit */     
/* do not edit */     public name: string;
/* do not edit */ 
/* do not edit */     
/* do not edit */     public role: "student" | "teacher" | "admin";
/* do not edit */ 
/* do not edit */     
/* do not edit */     public password: string;
/* do not edit */ 
/* do not edit */     
/* do not edit */     public passwordResetToken: string;
/* do not edit */ 
/* do not edit */     
/* do not edit */     
/* do not edit */     public createdAt: Date;
/* do not edit */ 
/* do not edit */     
/* do not edit */     
/* do not edit */     public updatedAt: Date;
/* do not edit */ 
/* do not edit */     
/* do not edit */     public grade: Grade;
/* do not edit */ 
/* do not edit */     
/* do not edit */     public courses: Course[];
/* do not edit */ 
/* do not edit */     
/* do not edit */     public coursesTeaching: Course[];
/* do not edit */ 
/* do not edit */     
/* do not edit */     public chats: Chat[];
/* do not edit */ 
/* do not edit */     
/* do not edit */     public messages: Message[];
/* do not edit */ 
/* do not edit */     
/* do not edit */     public events: Event[];
/* do not edit */ 
/* do not edit */     
/* do not edit */     
/* do not edit */     public assignmentDraft: Assignment;
/* do not edit */ 
/* do not edit */ 
/* do not edit */     public jwtToken?: string;
/* do not edit */ 
/* do not edit */     
/* do not edit */ 
/* do not edit */     
/* do not edit */ }
/* do not edit */
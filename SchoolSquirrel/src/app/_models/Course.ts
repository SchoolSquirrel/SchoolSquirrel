
/*    +-----------------------------------------------------------------------+    */
/*    |    Do not edit this file directly.                                    |    */
/*    |    It was copied by redundancyJS.                                     |    */
/*    |    To modify it, first edit the source file (see redundancy.json).    |    */
/*    |    Then, run "npx redundancyjs" in the terminal.                      |    */
/*    +-----------------------------------------------------------------------+    */

/* do not edit */
/* do not edit */ import { User } from "./User";
/* do not edit */ import { Assignment } from "./Assignment";
/* do not edit */ import { Message } from "./Message";
/* do not edit */
/* do not edit */
/* do not edit */ export class Course {
/* do not edit */     
/* do not edit */     public id: string;
/* do not edit */
/* do not edit */     
/* do not edit */     public name: string;
/* do not edit */
/* do not edit */     
/* do not edit */     public description: string;
/* do not edit */
/* do not edit */     
/* do not edit */     
/* do not edit */     public students: User[];
/* do not edit */
/* do not edit */     
/* do not edit */     
/* do not edit */     public teachers: User[];
/* do not edit */
/* do not edit */     
/* do not edit */     public assignments: Assignment[];
/* do not edit */
/* do not edit */     
/* do not edit */     public messages: Message[];
/* do not edit */ }
/* do not edit */
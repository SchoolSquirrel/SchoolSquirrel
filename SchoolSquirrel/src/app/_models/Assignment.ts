
/*    +-----------------------------------------------------------------------+    */
/*    |    Do not edit this file directly.                                    |    */
/*    |    It was copied by redundancyJS.                                     |    */
/*    |    To modify it, first edit the source file (see redundancy.json).    |    */
/*    |    Then, run "npx redundancyjs" in the terminal.                      |    */
/*    +-----------------------------------------------------------------------+    */

/* do not edit */ 
/* do not edit */ import { Course } from "./Course";
/* do not edit */ import { User } from "./User";
/* do not edit */ import { AssignmentSubmission } from "./AssignmentSubmission";
/* do not edit */ 
/* do not edit */ 
/* do not edit */ export class Assignment {
/* do not edit */   
/* do not edit */   public id: number;
/* do not edit */ 
/* do not edit */   
/* do not edit */   public title: string;
/* do not edit */ 
/* do not edit */   
/* do not edit */   public content: string;
/* do not edit */ 
/* do not edit */   
/* do not edit */   public due: Date;
/* do not edit */ 
/* do not edit */   
/* do not edit */   public course: Course;
/* do not edit */ 
/* do not edit */   
/* do not edit */   public draftUser: User;
/* do not edit */ 
/* do not edit */   
/* do not edit */   public userSubmissions: AssignmentSubmission[];
/* do not edit */ 
/* do not edit */   public submissionsMissing?: User[];
/* do not edit */ 
/* do not edit */   public materials?: any[];
/* do not edit */   public worksheets?: any[];
/* do not edit */   public submissions?: any[];
/* do not edit */ 
/* do not edit */   public submitted?: Date;
/* do not edit */ 
/* do not edit */   public returned?: Date;
/* do not edit */   public feedback?: string;
/* do not edit */ }
/* do not edit */
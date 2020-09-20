import { Injectable } from "@angular/core";
import { zxcvbn } from "zxcvbn3";

console.log(zxcvbn);

@Injectable()
export class PasswordStrengthMeterService {
    private options = {
        language: "de",
        keyboard_layouts: {
            german: {
                layout: "^° 1! 2\" 3§ 4$ 5% 6& 7/ 8( 9) 0= ß? ´`\n qQ wW eE rR tT zZ uU iI oO pP üÜ +*\n  aA sS dD fF gG hH jJ kK lL öÖ äÄ #'\n   yY xX cC vV bB nN mM ,; .: -_",
                slanted: true,
            },
        },
    }
    /**
   *  this will return the password strength score in number
   *  0 - too guessable
   *  1 - very guessable
   *  2 - somewhat guessable
   *  3 - safely unguessable
   *  4 - very unguessable
   *
   *  @param password - Password
   */
    score(password: string): number {
        const result = zxcvbn(password, this.options);
        return result.score;
    }

    /**
   * this will return the password strength score with feedback messages
   * return type { score: number; feedback: { suggestions: string[]; warning: string } }
   *
   * @param password - Password
   */
    scoreWithFeedback(password: string):
    { score: number; feedback: { suggestions: string[]; warning: string } } {
        const result = zxcvbn(password, this.options);
        return { score: result.score, feedback: result.feedback };
    }
}

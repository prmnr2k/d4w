import { Directive, forwardRef, Input } from "@angular/core";
import { NG_VALIDATORS, Validator, FormGroup } from "@angular/forms";

@Directive({
    selector: '[validateEqual][ngModelGroup]',
    providers: [
      {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => PasswordValidationDirective),
        multi: true
      }
    ]
  })
  export class PasswordValidationDirective implements Validator {
    @Input('password') public password: string;
    @Input('confirmation') public confirmation: string;
  
    public validate(fg: FormGroup): { [key: string]: any } {
        
      const fieldOne = fg.value[this.password];
      
      const fieldTwo = fg.value[this.confirmation];

  
      if (!fieldOne || !fieldTwo || fieldOne === fieldTwo ) {
        return null;
      }
  
      return {valueEquals: false};
  
    }
  }
/*import { Directive, forwardRef, Input } from "@angular/core";
import { NG_VALIDATORS, Validator, FormGroup } from "@angular/forms";

@Directive({
    selector: '[validateTime][ngModelGroup]',
    providers: [
      {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => timeValidationDirective),
        multi: true
      }
    ]
  })
  export class timeValidationDirective implements Validator {
    @Input('fromTime') public fromTime: string;
    @Input('confirmationn') public confirmationn: string;
  

    
    public validate(fg: FormGroup): { [key: string]: any } {

        console.log(fg);
       
      const fieldOne = fg.value[this.fromTime];
        console.log(fieldOne);
      
      const fieldTwo = fg.value[this.confirmationn];



  
     /* if (!fieldOne || !fieldTwo || fieldOne === fieldTwo ) {
        return null;
      }
 
      return {valueEquals: false};
  
    }
  } */
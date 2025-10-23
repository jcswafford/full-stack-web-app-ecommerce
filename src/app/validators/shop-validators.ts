import { FormControl, ValidationErrors } from "@angular/forms";

export class ShopValidators {

    static notOnlyWhitespace(control: FormControl): ValidationErrors {

        // check if string only contains whitespace
        if ((control.value != null) && (control.value.trim().length === 0)) {

            // invalid, return error object
            return { 'notOnlyWhiteSpace': true };

        }

        else {
            //valid, return null
            return null;
        }
    }

    static luhnCheck(control: FormControl): ValidationErrors | null {
        let value = control.value;
        if (value && typeof value === 'string') {
            let sum = 0;
            let shouldDouble = false;
        
            for (let i = value.length - 1; i >= 0; --i) {
                let digit = parseInt(value.charAt(i), 10);
        
                if (shouldDouble) {
                    if ((digit *= 2) > 9) digit -= 9;
                }
        
                sum += digit;
                shouldDouble = !shouldDouble;
            }
        
            if (sum % 10 !== 0) {
                return { luhnCheck: true };
            }
        }
    
        return null;
    }

}

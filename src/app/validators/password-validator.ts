import { FormGroup, ValidatorFn } from '@angular/forms';
import _ from 'lodash';

export function PasswordValidator(
  username: string,
  password: string,
  pattern: string
): ValidatorFn {
  return (formGroup: FormGroup) => {
    let usernameControl = formGroup.controls[username];
    let passwordControl = formGroup.controls[password];

    if (
      passwordControl.value !== '' &&
      passwordControl.value !== null &&
      passwordControl.value !== undefined
    ) {
      if (
        _.includes(
          _.toLower(passwordControl.value),
          _.toLower(usernameControl.value)
        )
      ) {
        passwordControl.setErrors({ username: true });
      } else {
        if (passwordControl.hasError('username')) {
          passwordControl.setErrors(null);
        }
      }
    }
    return null;
  };
}

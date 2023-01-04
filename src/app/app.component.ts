import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordValidator } from './validators/password-validator';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  passwordForm: FormGroup;
  apiResponse: any;
  primaryPasswordComplexity: any;
  regEx: string;
  validations: string[] = [];
  isValid: boolean = null;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.apiResponse = this.getAPIResponse();
    this.primaryPasswordComplexity = this.apiResponse.primaryPasswordComplexity;
    this.setRegExAndValidations();

    this.passwordForm = this.formBuilder.group(
      {
        username: [''],
        password: ['', [Validators.required, Validators.pattern(this.regEx)]],
      },
      {
        validator: PasswordValidator('username', 'password', this.regEx),
      }
    );
  }

  setRegExAndValidations() {
    this.regEx = '^';

    // Uppercase
    if (this.primaryPasswordComplexity.requireUppers) {
      this.regEx += `(?=.*?[A-Z])`;
      this.validations.push('Password must contain a uppercase letter');
    }

    // Lowercase
    if (this.primaryPasswordComplexity.requireLowers) {
      this.regEx += `(?=.*?[a-z])`;
      this.validations.push('Password must contain a lowercase letter');
    }

    // Number
    if (this.primaryPasswordComplexity.requireDigits) {
      this.regEx += `(?=.*?[0-9])`;
      this.validations.push('Password must contain a number');
    }

    // Special character
    if (this.primaryPasswordComplexity.requireSpecials) {
      // Acceptable by RegEx : !@#$%&*()-_?.,<>(){}[]`~|=+:;'"
      this.regEx += `(?=.*?[#!?@$%&*-_+])`;
      this.validations.push('Password must contain a special character');
    }

    // Don't allow Username
    if (this.primaryPasswordComplexity.isNotUsername) {
      // Can't handle with RegEx, handled with Custom PasswordValidator
      this.validations.push('Password must not contain username');
    }

    // Previous passwords
    if (this.primaryPasswordComplexity.checkPreviousPasswords > 0) {
      this.primaryPasswordComplexity.checkPreviousPasswords === 1
        ? this.validations.push(`Cannot reuse current password`)
        : this.validations.push(
            `Cannot reuse any of the previous ${this.primaryPasswordComplexity.checkPreviousPasswords} passwords`
          );
    }

    // Repeated characters
    if (this.primaryPasswordComplexity.maxRepeatedChars > 0) {
      this.validations.push(
        `You may not have more than ${this.primaryPasswordComplexity.maxRepeatedChars} repeating characters`
      );

      let chars: string =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz#!?@$%&*-_+';
      for (let c of chars) {
        this.regEx += `(?!.*[${c}]{${
          this.primaryPasswordComplexity.maxRepeatedChars + 1
        }})`;
      }
    }

    // Password Length
    this.regEx += `.{${this.primaryPasswordComplexity.minLen},}$`;
    this.validations.push(
      `Password must contain at least ${this.primaryPasswordComplexity.minLen} characters`
    );
  }

  getAPIResponse() {
    return {
      primaryPasswordComplexity: {
        // version: 2,
        minLen: 8, // Range: 0-9999
        // minTypes: 0,
        requireLowers: true,
        requireUppers: true,
        requireDigits: true,
        requireSpecials: true,
        isNotUsername: true,
        // enabled: true,
        // isAlternate: false,
        maxRepeatedChars: 0, // Range: 2-9999
        checkPreviousPasswords: 0, // Range: 1-10
        // minPasswordChangeInterval: 0, // Range: 0-9999 hours (stored in seconds)
        // maxPasswordChangeInterval: 0,
        // maxSequentialFailedLogins: 10,
        // loginAutolockTimeout: 10,
        // temporaryPasswordLife: 0,
        // disableAdminPasswordExpiry: false,
        // defaultMaxSequentialFailedLogins: 10,
        // defaultLoginAutolockTimeout: 10,
      },
      // alternatePasswordComplexity: {
      //   version: 0,
      //   minLen: 10,
      //   minTypes: 0,
      //   requireLowers: true,
      //   requireUppers: true,
      //   requireDigits: true,
      //   requireSpecials: false,
      //   isNotUsername: true,
      //   enabled: false,
      //   isAlternate: true,
      //   maxRepeatedChars: 0,
      //   checkPreviousPasswords: 1,
      //   minPasswordChangeInterval: 0,
      //   maxPasswordChangeInterval: 0,
      //   maxSequentialFailedLogins: 10,
      //   loginAutolockTimeout: 10,
      //   temporaryPasswordLife: 0,
      //   disableAdminPasswordExpiry: false,
      //   defaultMaxSequentialFailedLogins: 10,
      //   defaultLoginAutolockTimeout: 10,
      // },
    };
  }
}

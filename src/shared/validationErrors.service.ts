import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidationErrorsService {
  private validation = { errors: {} };

  public addError(property: string, constraints: string): void {
    this.validation.errors[property] = constraints;
  }

  public getErrors() {
    return this.validation;
  }
}

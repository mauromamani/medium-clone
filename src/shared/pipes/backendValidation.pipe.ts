import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  ValidationError,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class BackendValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const object = plainToClass(metadata.metatype, value);
    const errors = await validate(object);

    if (!errors.length) {
      return value;
    }

    throw new HttpException(
      { errors: this.formatErrors(errors) },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }

  private formatErrors(errors: ValidationError[]): any {
    return errors.reduce((acc, error) => {
      acc[error.property] = Object.values(error.constraints);
      return acc;
    }, {});
  }
}

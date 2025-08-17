import { z } from 'zod';
import { VERIFICATION_CODE_LENGTH } from './constants';

export const validationCodeSchema = z.string().regex(new RegExp(`^\\d{${VERIFICATION_CODE_LENGTH}}$`));

export const apiValidationCodeSchema = z.object({
  code: validationCodeSchema,
});

import { ValidationError } from 'yup';

import { Toast } from '../hooks/toast';

export default (yupError: ValidationError): Array<Omit<Toast, 'id'>> =>
  yupError.inner.map(error => ({
    title: 'Validation error',
    description: error.message,
    type: 'error',
  }));

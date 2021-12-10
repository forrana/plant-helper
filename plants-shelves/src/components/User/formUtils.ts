import { Error, FormErrors } from "./models";

const getFormFieldErrors = (field: string, errors: FormErrors): Array<Error> => {
    let result: Array<Error> = [];
    if(errors[field]) {
      result = [...result, ...errors[field]];
    }
    if(errors['nonFieldErrors']) {
      result = [...result, ...errors['nonFieldErrors']];
    }
    return result;
  }

const isFieldHasErrors = (field: string, errors: FormErrors): boolean => getFormFieldErrors(field, errors).length > 0;

export { getFormFieldErrors, isFieldHasErrors }
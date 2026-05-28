export const required = (value: unknown): string | undefined => {
  if (value === null || value === undefined || value === '') {
    return 'This field is required';
  }
  return undefined;
};

export const email = (value: string): string | undefined => {
  if (!value) return undefined;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return 'Please enter a valid email address';
  }
  return undefined;
};

export const minLength = (min: number) => (value: string): string | undefined => {
  if (!value) return undefined;
  if (value.length < min) {
    return `Must be at least ${min} characters`;
  }
  return undefined;
};

export const maxLength = (max: number) => (value: string): string | undefined => {
  if (!value) return undefined;
  if (value.length > max) {
    return `Must be no more than ${max} characters`;
  }
  return undefined;
};

export const pattern = (regex: RegExp, message: string) => (value: string): string | undefined => {
  if (!value) return undefined;
  if (!regex.test(value)) {
    return message;
  }
  return undefined;
};

export const min = (minimum: number) => (value: number): string | undefined => {
  if (value === null || value === undefined) return undefined;
  if (value < minimum) {
    return `Must be at least ${minimum}`;
  }
  return undefined;
};

export const max = (maximum: number) => (value: number): string | undefined => {
  if (value === null || value === undefined) return undefined;
  if (value > maximum) {
    return `Must be no more than ${maximum}`;
  }
  return undefined;
};

export const phone = (value: string): string | undefined => {
  if (!value) return undefined;
  const phoneRegex = /^[\d\s\-+()]{10,}$/;
  if (!phoneRegex.test(value)) {
    return 'Please enter a valid phone number';
  }
  return undefined;
};

export const postalCode = (value: string): string | undefined => {
  if (!value) return undefined;
  const postalRegex = /^[A-Za-z0-9\s\-]{3,10}$/;
  if (!postalRegex.test(value)) {
    return 'Please enter a valid postal code';
  }
  return undefined;
};

export const password = (value: string): string | undefined => {
  if (!value) return undefined;
  if (value.length < 8) {
    return 'Password must be at least 8 characters';
  }
  return undefined;
};

export const passwordMatch = (otherValue: string) => (value: string): string | undefined => {
  if (!value) return undefined;
  if (value !== otherValue) {
    return 'Passwords do not match';
  }
  return undefined;
};

export const compose = (...validators: ((value: unknown) => string | undefined)[]) => {
  return (value: unknown): string | undefined => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) return error;
    }
    return undefined;
  };
};

export const validateForm = <T extends Record<string, unknown>>(
  values: T,
  rules: Partial<Record<keyof T, ((value: unknown) => string | undefined)[]>>
): Partial<Record<keyof T, string>> => {
  const errors: Partial<Record<keyof T, string>> = {};

  for (const field in rules) {
    const fieldRules = rules[field];
    if (fieldRules) {
      for (const rule of fieldRules) {
        const error = rule(values[field]);
        if (error) {
          errors[field] = error;
          break;
        }
      }
    }
  }

  return errors;
};

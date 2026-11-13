import { useState } from "react";

export type Violation<T> = Partial<Record<keyof T, string>>;

export const useForm = <T>(
  initialValues: T,
  validate: (values: T) => Violation<T>,
  onSubmit: (values: T) => void,
) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Violation<T>>({});

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setValues((prevValues) => ({ ...prevValues, [name]: value }));
    // Digitar apaga só o erro deste campo; a validação completa roda no envio.
    setErrors((prevErrors) => {
      const copyErrors = { ...prevErrors };
      delete copyErrors[name as keyof T];

      return copyErrors;
    });
  };

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const foundErrors = validate(values);
    setErrors({ ...foundErrors });

    if (Object.keys(foundErrors).length !== 0) {
      return;
    }

    onSubmit(values);
  };

  return { values, errors, handleChange, handleSubmit };
};

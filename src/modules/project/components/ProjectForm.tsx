import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  LinkButton,
  useForm,
} from "@/shared";
import type { ProjectValues } from "../types";
import { validateProject } from "../utils/validateProject";

const LABEL_CLASSES = "text-sm font-medium text-gray-700";

const ERROR_CLASSES = "text-sm text-red-700";

const fieldClasses = (hasError: boolean) => {
  const stateClasses = hasError
    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500";

  return `w-full rounded-md border px-3 py-1.5 text-sm text-gray-900 focus:ring-1 focus:outline-none ${stateClasses}`;
};

interface Props {
  title: string;
  initialValues: ProjectValues;
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: (values: ProjectValues) => void;
  cancelTo: string;
}

export function ProjectForm({
  title,
  initialValues,
  submitLabel,
  isSubmitting,
  onSubmit,
  cancelTo,
}: Props) {
  const { values, errors, handleChange, handleSubmit } = useForm(
    initialValues,
    (values) => validateProject(values, initialValues),
    onSubmit,
  );

  return (
    <Card>
      <CardHeader>
        <h3>{title}</h3>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardBody>
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className={LABEL_CLASSES} htmlFor="projectName">
                Nome do Projeto:
              </label>
              <input
                className={fieldClasses(!!errors.name)}
                id="projectName"
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <span className={ERROR_CLASSES}>{errors.name}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className={LABEL_CLASSES} htmlFor="projectDescription">
                Descrição:
              </label>
              <textarea
                className={`${fieldClasses(!!errors.description)} resize-y`}
                id="projectDescription"
                name="description"
                rows={4}
                value={values.description}
                onChange={handleChange}
                aria-invalid={!!errors.description}
              />
              {errors.description && (
                <span className={ERROR_CLASSES}>{errors.description}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className={LABEL_CLASSES} htmlFor="projectMaxRoles">
                Máximo de cargos:
              </label>
              <input
                className={`${fieldClasses(!!errors.maxRoles)} max-w-40`}
                id="projectMaxRoles"
                type="number"
                name="maxRoles"
                value={values.maxRoles}
                onChange={handleChange}
                aria-invalid={!!errors.maxRoles}
              />
              {errors.maxRoles && (
                <span className={ERROR_CLASSES}>{errors.maxRoles}</span>
              )}
            </div>
          </div>
        </CardBody>

        <CardFooter>
          <LinkButton to={cancelTo}>Cancelar</LinkButton>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {submitLabel}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

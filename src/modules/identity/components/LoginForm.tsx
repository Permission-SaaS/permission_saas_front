import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  FIELD_ERROR_CLASSES,
  FIELD_LABEL_CLASSES,
  fieldClasses,
  type Violation,
} from "@/shared";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loggedIn } from "../store/authSlice";
import type { LoginValues, User } from "../types";
import { validateLogin } from "../utils/validateLogin";

const DEMO_USER: User = {
  name: "Usuário Demo",
  email: "demo@example.com",
};

const DEMO_USER_PASSWORD = "demo@123";

const isDemoUser = (values: LoginValues) => {
  return (
    values.email.trim().toLowerCase() === DEMO_USER.email &&
    values.password === DEMO_USER_PASSWORD
  );
};

export function LoginForm() {
  const dispatch = useDispatch();

  const [errors, setErrors] = useState<Violation<LoginValues>>({});
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const values: LoginValues = {
      email: String(data.get("email") ?? ""),
      password: String(data.get("password") ?? ""),
    };

    const foundErrors = validateLogin(values);
    setErrors(foundErrors);
    setLoginError(null);

    if (Object.keys(foundErrors).length !== 0) {
      return;
    }

    if (!isDemoUser(values)) {
      setLoginError("E-mail ou senha inválidos.");
      return;
    }

    dispatch(loggedIn({ name: DEMO_USER.name, email: DEMO_USER.email }));
  };

  return (
    <Card>
      <CardHeader>
        <h3>Entrar</h3>
      </CardHeader>
      <form onSubmit={handleSubmit} noValidate>
        <CardBody>
          <div className="space-y-4">
            <p className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800">
              Login de demonstração: <strong>{DEMO_USER.email}</strong> e a
              senha <strong>{DEMO_USER_PASSWORD}</strong>.
            </p>

            <div className="flex flex-col gap-1">
              <label className={FIELD_LABEL_CLASSES} htmlFor="loginEmail">
                E-mail:
              </label>
              <input
                className={fieldClasses(!!errors.email)}
                id="loginEmail"
                type="email"
                name="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <span className={FIELD_ERROR_CLASSES}>{errors.email}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className={FIELD_LABEL_CLASSES} htmlFor="loginPassword">
                Senha:
              </label>
              <input
                className={fieldClasses(!!errors.password)}
                id="loginPassword"
                type="password"
                name="password"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
              />
              {errors.password && (
                <span className={FIELD_ERROR_CLASSES}>{errors.password}</span>
              )}
            </div>

            {loginError && (
              <p
                className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                role="alert"
              >
                {loginError}
              </p>
            )}
          </div>
        </CardBody>

        <CardFooter>
          <Button variant="primary" type="submit">
            Entrar
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

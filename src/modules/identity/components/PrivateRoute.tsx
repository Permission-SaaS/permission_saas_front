import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router";
import { selectIsLoggedIn } from "../store/authSlice";

export function PrivateRoute() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const location = useLocation();

  // Sem sessão, vai para o login e anota a página pedida, para o LoginPage voltar a ela.
  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={location.pathname} />;
  }

  return <Outlet />;
}

import { authSlice } from "@/modules/identity";
import { configureStore } from "@reduxjs/toolkit";

const SESSION_KEY = "permission-saas:session";

type Session = ReturnType<typeof authSlice.getInitialState>;

const loadSession = (): Session | undefined => {
  try {
    const saved = localStorage.getItem(SESSION_KEY);

    return saved === null ? undefined : (JSON.parse(saved) as Session);
  } catch {
    return undefined;
  }
};

const saveSession = (session: Session) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const store = configureStore({
  reducer: {
    [authSlice.reducerPath]: authSlice.reducer,
  },
  preloadedState: {
    [authSlice.reducerPath]: loadSession() ?? authSlice.getInitialState(),
  },
});

let previousSession = store.getState()[authSlice.reducerPath];

store.subscribe(() => {
  const session = store.getState()[authSlice.reducerPath];

  if (session === previousSession) {
    return;
  }

  previousSession = session;
  saveSession(session);
});

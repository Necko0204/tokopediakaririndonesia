import { useEffect, useState } from "react";
import AdminPage from "./pages/AdminPage";
import CustomerPage from "./pages/CustomerPage";
import RegisterPage from "./pages/RegisterPage";
import { AppStoreProvider } from "./store/AppStore";

export type Navigate = (path: string) => void;

function App() {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate: Navigate = (nextPath) => {
    window.history.pushState(null, "", nextPath);
    setPath(window.location.pathname);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AppStoreProvider>
      {path.startsWith("/admin") ? <AdminPage navigate={navigate} /> : path.startsWith("/register") ? <RegisterPage navigate={navigate} /> : <CustomerPage navigate={navigate} />}
    </AppStoreProvider>
  );
}

export default App;

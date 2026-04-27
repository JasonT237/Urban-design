import AppRouter from "./routes/AppRouter";
import { ApartmentsProvider } from "./context/ApartmentsContext";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <ApartmentsProvider>
        <AppRouter />
      </ApartmentsProvider>
    </AuthProvider>
  );
}

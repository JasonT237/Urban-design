import AppRouter from "./routes/AppRouter";
import { ApartmentsProvider } from "./context/ApartmentsContext";

export default function App() {
  return (
    <ApartmentsProvider>
      <AppRouter />
    </ApartmentsProvider>
  );
}

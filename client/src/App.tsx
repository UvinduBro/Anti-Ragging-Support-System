import { Switch, Route } from "wouter";
import Layout from "./components/Layout";
import Home from "./pages/home";
import ReportForm from "./pages/ReportForm";
import Awareness from "./pages/Awareness";
import LegalResources from "./pages/LegalResources";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Statistics from "./pages/Statistics";
import Incidents from "./pages/Incidents";
import NotFound from "@/pages/not-found";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeFirebase } from "./lib/firebase";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false);

  useEffect(() => {
    // Initialize Firebase
    initializeFirebase();
    setIsFirebaseInitialized(true);
    
    // Check auth state
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  if (!isFirebaseInitialized) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/report" component={ReportForm} />
        <Route path="/awareness" component={Awareness} />
        <Route path="/legal" component={LegalResources} />
        <Route path="/statistics" component={Statistics} />
        <Route path="/incidents" component={Incidents} />
        <Route path="/admin">
          {isLoggedIn ? <AdminDashboard /> : <AdminLogin />}
        </Route>
        <Route path="/admin/dashboard">
          {isLoggedIn ? <AdminDashboard /> : <AdminLogin />}
        </Route>
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

export default App;

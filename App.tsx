import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./src/lib/firebase";

import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen";

type Screen = "login" | "register" | "home";

export default function App() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [screen, setScreen] = useState<Screen>("login");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      const email = u?.email ?? null;
      const uid = u?.uid ?? null;
      setUserEmail(email);
      setUserId(uid);
      if (email) {
        setScreen("home");
      } else {
        setScreen("login");
      }
    });
    return unsub;
  }, []);

  if (screen === "home") {
    return <HomeScreen userId={userId} />;
  }

  if (screen === "register") {
    return <RegisterScreen onNavigateLogin={() => setScreen("login")} />;
  }

  return <LoginScreen onNavigateRegister={() => setScreen("register")} />;
}
import { useState } from "react";
import {
  Alert, Platform, Text, TextInput,
  View, KeyboardAvoidingView, Pressable, ScrollView, Image,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";

const accent = "#E8450A";

type Props = { onNavigateRegister: () => void };

export default function LoginScreen({ onNavigateRegister }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      const logged = await signInWithEmailAndPassword(auth, email.trim(), password);
      Alert.alert("Login Ok", logged.user.email ?? "");
    } catch (error) {
      Alert.alert("Erro", "Email ou senha inválidos.");
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff", marginTop: 25 }}
      behavior={Platform.select({ ios: "padding", android: "height" })}
    >
      <ScrollView contentContainerStyle={{ padding: 24, gap: 16 }}>

        <Image
          source={require("../assets/image1.png")}
          style={{ width: "100%", height: 200, borderRadius: 12, marginBottom: 8 }}
          resizeMode="contain"
        />

        <Text style={{ fontSize: 24, fontWeight: "800", color: "#1a1a1a" }}>Login</Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#aaa"
          style={{ borderWidth: 1.5, borderColor: "#ddd", borderRadius: 10, padding: 13, fontSize: 15 }}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Senha"
          secureTextEntry
          placeholderTextColor="#aaa"
          style={{ borderWidth: 1.5, borderColor: "#ddd", borderRadius: 10, padding: 13, fontSize: 15 }}
        />

        <Pressable
          onPress={handleLogin}
          style={{ backgroundColor: accent, borderRadius: 10, padding: 15, alignItems: "center" }}
        >
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>Entrar</Text>
        </Pressable>

        <Pressable onPress={onNavigateRegister} style={{ padding: 8 }}>
          <Text style={{ textAlign: "center", color: "#666" }}>
            Não tem conta? <Text style={{ fontWeight: "700", color: accent }}>Criar conta</Text>
          </Text>
        </Pressable>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
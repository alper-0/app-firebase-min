import { useState } from "react";
import {
  Alert, Platform,
  Text, TextInput,
  View, KeyboardAvoidingView,
  Pressable, ScrollView,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";

type Props = {
  onNavigateRegister: () => void;
};

export default function LoginScreen({ onNavigateRegister }: Props) {
  const [email, setEmail] = useState("fjsilva@sp.senac.br");
  const [password, setPassword] = useState("a1b2c3");

  async function handleLogin() {
    try {
      console.log("Login --> ", email.trim());
      const logged = await signInWithEmailAndPassword(auth, email.trim(), password);
      console.log("LOGIN OK uid: ", logged.user.uid);
      Alert.alert("Login Ok", logged.user.email ?? "");
    } catch (error) {
      console.log("Login failed ", error);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, marginTop: 25 }}
      behavior={Platform.select({ ios: "padding", android: "height" })}
    >
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: "700" }}>Login</Text>
        <View style={{ padding: 12, borderWidth: 1, borderRadius: 12, gap: 10, marginTop: 5 }}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="email"
            autoCapitalize="none"
            style={{ borderWidth: 1, borderRadius: 10, padding: 10 }}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="senha"
            secureTextEntry
            style={{ borderWidth: 1, borderRadius: 10, padding: 10 }}
          />
          <Pressable
            onPress={handleLogin}
            style={{ padding: 10, borderWidth: 1, borderRadius: 10 }}
          >
            <Text>Login</Text>
          </Pressable>
          <Pressable
            onPress={onNavigateRegister}
            style={{ padding: 10, borderRadius: 10 }}
          >
            <Text style={{ textAlign: "center" }}>
              Não tem conta? <Text style={{ fontWeight: "700" }}>Criar conta</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

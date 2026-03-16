import { useState } from "react";
import {
  Alert, Platform,
  Text, TextInput,
  View, KeyboardAvoidingView,
  Pressable, ScrollView,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";

type Props = {
  onNavigateLogin: () => void;
};

export default function RegisterScreen({ onNavigateLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister() {
    try {
      console.log("Register -> ", email.trim());
      const create = await createUserWithEmailAndPassword(auth, email.trim(), password);
      console.log("Register Ok uid: ", create.user.uid);
      Alert.alert("Conta criada com sucesso", create.user.email ?? "");
    } catch (error) {
      console.log("Register failed ", error);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, marginTop: 25 }}
      behavior={Platform.select({ ios: "padding", android: "height" })}
    >
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: "700" }}>Criar conta</Text>
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
            onPress={handleRegister}
            style={{ padding: 10, borderWidth: 1, borderRadius: 10 }}
          >
            <Text>Criar conta</Text>
          </Pressable>
          <Pressable
            onPress={onNavigateLogin}
            style={{ padding: 10, borderRadius: 10 }}
          >
            <Text style={{ textAlign: "center" }}>
              Já tem conta? <Text style={{ fontWeight: "700" }}>Fazer login</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

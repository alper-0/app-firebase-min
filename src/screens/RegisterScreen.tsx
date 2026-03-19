import { useState } from "react";
import {
  Alert, Platform, Text, TextInput,
  View, KeyboardAvoidingView, Pressable, ScrollView,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";

const accent = "#E8450A";

type Props = { onNavigateLogin: () => void };

export default function RegisterScreen({ onNavigateLogin }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleRegister() {
    if (!name.trim()) { Alert.alert("Erro", "Informe seu nome."); return; }
    if (password !== confirmPassword) { Alert.alert("Erro", "As senhas não coincidem."); return; }
    if (password.length < 6) { Alert.alert("Erro", "Senha precisa ter 6+ caracteres."); return; }
    try {
      const create = await createUserWithEmailAndPassword(auth, email.trim(), password);
      Alert.alert("Conta criada!", create.user.email ?? "");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar a conta.");
    }
  }

  const input = { borderWidth: 1.5, borderColor: "#ddd", borderRadius: 10, padding: 13, fontSize: 15 };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff", marginTop: 25 }}
      behavior={Platform.select({ ios: "padding", android: "height" })}
    >
      <ScrollView contentContainerStyle={{ padding: 24, gap: 16 }}>

        {/* Placeholder image */}
        <View style={{
          width: "100%", height: 180, backgroundColor: "#f0f0f0",
          borderRadius: 12, marginBottom: 8,
          alignItems: "center", justifyContent: "center",
        }}>
          <Text style={{ color: "#aaa", fontSize: 14 }}>Imagem aqui</Text>
        </View>

        <Text style={{ fontSize: 24, fontWeight: "800", color: "#1a1a1a" }}>Criar conta</Text>

        <TextInput value={name} onChangeText={setName} placeholder="Nome" placeholderTextColor="#aaa" style={input} />
        <TextInput value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" keyboardType="email-address" placeholderTextColor="#aaa" style={input} />
        <TextInput value={password} onChangeText={setPassword} placeholder="Senha" secureTextEntry placeholderTextColor="#aaa" style={input} />
        <TextInput value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Confirmar senha" secureTextEntry placeholderTextColor="#aaa" style={input} />

        <Pressable
          onPress={handleRegister}
          style={{ backgroundColor: accent, borderRadius: 10, padding: 15, alignItems: "center" }}
        >
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>Criar conta</Text>
        </Pressable>

        <Pressable onPress={onNavigateLogin} style={{ padding: 8 }}>
          <Text style={{ textAlign: "center", color: "#666" }}>
            Já tem conta? <Text style={{ fontWeight: "700", color: accent }}>Fazer login</Text>
          </Text>
        </Pressable>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
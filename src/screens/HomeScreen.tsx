import { useState } from "react";
import {
  Alert, Platform,
  Text, TextInput,
  View, KeyboardAvoidingView,
  Pressable, ScrollView,
} from "react-native";
import { signOut } from "firebase/auth";
import {
  addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";

type Note = { id: string; text: string };

type Props = {
  userEmail: string | null;
};

export default function HomeScreen({ userEmail }: Props) {
  const [noteText, setNoteText] = useState("Primeira anotação");
  const [notes, setNotes] = useState<Note[]>([]);

  async function handleLogout() {
    try {
      console.log("LOGOUT !!!");
      await signOut(auth);
      console.log("LOGOUT OK");
      Alert.alert("Logout Ok!");
    } catch (error) {
      console.log("Logout failed ", error);
    }
  }

  async function AddNote() {
    try {
      console.log("ADD Note --> ", noteText);
      const docRef = await addDoc(collection(db, "notes"), {
        text: noteText,
        createdAt: serverTimestamp(),
        user: userEmail ?? null,
      });
      console.log("ADD NOTE OK id: ", docRef.id);
      setNoteText("");
      await refreshNotes();
    } catch (error) {
      console.log("addNote failed ", error);
    }
  }

  async function refreshNotes() {
    try {
      console.log("REFRESH NOTES !!!");
      const response = query(
        collection(db, "notes"),
        orderBy("createdAt", "desc"),
        limit(10)
      );
      const snap = await getDocs(response);
      console.log("NOTES count: ", snap.size);
      setNotes(snap.docs.map((n) => ({ id: n.id, text: String(n.data().text ?? "") })));
    } catch (error) {
      console.log("refreshNotes failed ", error);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, marginTop: 25 }}
      behavior={Platform.select({ ios: "padding", android: "height" })}
    >
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: "700" }}>
          Expo/React + Firebase (mínimo)
        </Text>

        {/* Header with user info and logout */}
        <View style={{ padding: 12, borderWidth: 1, borderRadius: 12, gap: 10, marginTop: 5 }}>
          <Text style={{ fontSize: 16, fontWeight: "600" }}>Auth</Text>
          <Text>Usuário logado: {userEmail ?? "nenhum"}</Text>
          <Pressable
            onPress={handleLogout}
            style={{ padding: 10, borderWidth: 1, borderRadius: 10, alignSelf: "flex-start" }}
          >
            <Text>Logout</Text>
          </Pressable>
        </View>

        {/* Firestore notes section */}
        <View style={{ padding: 12, borderWidth: 1, borderRadius: 12, gap: 10, marginTop: 5 }}>
          <Text style={{ fontSize: 16, fontWeight: "600" }}>Firestore</Text>
          <TextInput
            value={noteText}
            onChangeText={setNoteText}
            placeholder="Texto da anotação"
            style={{ borderWidth: 1, borderRadius: 10, padding: 10 }}
          />
          <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
            <Pressable
              onPress={AddNote}
              style={{ padding: 10, borderWidth: 1, borderRadius: 10 }}
            >
              <Text>Salvar nota</Text>
            </Pressable>
            <Pressable
              onPress={refreshNotes}
              style={{ padding: 10, borderWidth: 1, borderRadius: 10 }}
            >
              <Text>Recarregar</Text>
            </Pressable>
          </View>
          <View>
            {notes.map((n) => (
              <Text key={n.id}>- {n.text}</Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

import { useState, useEffect } from "react";
import {
  Alert, Platform, Text, TextInput,
  View, KeyboardAvoidingView, Pressable, ScrollView,
} from "react-native";
import { signOut } from "firebase/auth";
import {
  collection, addDoc, deleteDoc, doc,
  query, orderBy, onSnapshot, serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";

const accent = "#E8450A";

type Note = { id: string; text: string };
type Props = { userId: string | null };

export default function HomeScreen({ userId }: Props) {
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, "users", userId, "notes"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setNotes(
        snapshot.docs.map((d) => ({ id: d.id, text: d.data().text as string }))
      );
    });

    return unsub;
  }, [userId]);

  async function handleLogout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.log("Logout failed", error);
    }
  }

  async function addNote() {
    if (!noteText.trim() || !userId) return;
    try {
      await addDoc(collection(db, "users", userId, "notes"), {
        text: noteText.trim(),
        createdAt: serverTimestamp(),
      });
      setNoteText("");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a nota.");
    }
  }

  async function deleteNote(noteId: string) {
    if (!userId) return;
    try {
      await deleteDoc(doc(db, "users", userId, "notes", noteId));
    } catch (error) {
      Alert.alert("Erro", "Não foi possível excluir a nota.");
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff", marginTop: 25 }}
      behavior={Platform.select({ ios: "padding", android: "height" })}
    >
      <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }}>

        {/* Header */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 20, fontWeight: "800", color: "#1a1a1a" }}>Notas</Text>
          <Pressable
            onPress={handleLogout}
            style={{ backgroundColor: accent, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>Sair</Text>
          </Pressable>
        </View>

        {/* Input */}
        <TextInput
          value={noteText}
          onChangeText={setNoteText}
          placeholder="Nova nota..."
          placeholderTextColor="#aaa"
          multiline
          style={{
            borderWidth: 1.5, borderColor: "#ddd", borderRadius: 10,
            padding: 12, fontSize: 14, minHeight: 80, textAlignVertical: "top",
          }}
        />
        <Pressable
          onPress={addNote}
          style={{ backgroundColor: accent, borderRadius: 10, padding: 13, alignItems: "center" }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>Adicionar</Text>
        </Pressable>

        {/* Notes */}
        {notes.map((n) => (
          <View key={n.id} style={{
            flexDirection: "row", alignItems: "flex-start",
            borderLeftWidth: 3, borderLeftColor: accent,
            backgroundColor: "#fafafa", borderRadius: 8, padding: 12, gap: 8,
          }}>
            <Text style={{ flex: 1, fontSize: 14, color: "#1a1a1a" }}>{n.text}</Text>
            <Pressable onPress={() => deleteNote(n.id)}>
              <Text style={{ color: "#aaa", fontSize: 18, lineHeight: 20 }}>×</Text>
            </Pressable>
          </View>
        ))}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

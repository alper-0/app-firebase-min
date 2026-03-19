import { useState } from "react";
import {
  Alert, Platform, Text, TextInput,
  View, KeyboardAvoidingView, Pressable, ScrollView,
} from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

const accent = "#E8450A";

type Note = { id: string; text: string };
type Props = { userEmail: string | null };

export default function HomeScreen({ userEmail }: Props) {
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);

  async function handleLogout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.log("Logout failed", error);
    }
  }

  function addNote() {
    if (!noteText.trim()) return;
    setNotes((prev) => [{ id: Date.now().toString(), text: noteText.trim() }, ...prev]);
    setNoteText("");
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
            borderLeftWidth: 3, borderLeftColor: accent,
            backgroundColor: "#fafafa", borderRadius: 8, padding: 12,
          }}>
            <Text style={{ fontSize: 14, color: "#1a1a1a" }}>{n.text}</Text>
          </View>
        ))}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
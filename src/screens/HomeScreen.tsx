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

type Phone = { id: string; brand: string; model: string; price: string; seller: string };
type Props = { userId: string | null };

export default function HomeScreen({ userId }: Props) {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");
  const [seller, setSeller] = useState("");
  const [phones, setPhones] = useState<Phone[]>([]);

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, "users", userId, "phones"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setPhones(
        snapshot.docs.map((d) => ({
          id: d.id,
          brand: d.data().brand as string,
          model: d.data().model as string,
          price: d.data().price as string,
          seller: d.data().seller as string,
        }))
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

  async function registerPhone() {
    if (!brand.trim() || !model.trim() || !price.trim() || !seller.trim() || !userId) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    try {
      await addDoc(collection(db, "users", userId, "phones"), {
        brand: brand.trim(),
        model: model.trim(),
        price: price.trim(),
        seller: seller.trim(),
        createdAt: serverTimestamp(),
      });
      setBrand("");
      setModel("");
      setPrice("");
      setSeller("");
    } catch (error) {
      Alert.alert("Error", "Could not register phone.");
    }
  }

  async function deletePhone(phoneId: string) {
    if (!userId) return;
    try {
      await deleteDoc(doc(db, "users", userId, "phones", phoneId));
    } catch (error) {
      Alert.alert("Error", "Could not delete phone.");
    }
  }

  const inputStyle = {
    borderWidth: 1.5, borderColor: "#ddd", borderRadius: 10,
    padding: 12, fontSize: 14, backgroundColor: "#fff",
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff", marginTop: 25 }}
      behavior={Platform.select({ ios: "padding", android: "height" })}
    >
      <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }}>

        {/* Header */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 20, fontWeight: "800", color: "#1a1a1a" }}>Phone Registry</Text>
          <Pressable
            onPress={handleLogout}
            style={{ backgroundColor: accent, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>Logout</Text>
          </Pressable>
        </View>

        {/* Form */}
        <Text style={{ fontSize: 13, fontWeight: "700", color: "#555", marginBottom: -6 }}>REGISTER A PHONE</Text>

        <TextInput
          value={brand}
          onChangeText={setBrand}
          placeholder="Brand (e.g. Apple, Samsung)"
          placeholderTextColor="#aaa"
          style={inputStyle}
        />
        <TextInput
          value={model}
          onChangeText={setModel}
          placeholder="Model (e.g. iPhone 15, Galaxy S24)"
          placeholderTextColor="#aaa"
          style={inputStyle}
        />
        <TextInput
          value={price}
          onChangeText={setPrice}
          placeholder="Price (e.g. $799)"
          placeholderTextColor="#aaa"
          keyboardType="decimal-pad"
          style={inputStyle}
        />
        <TextInput
          value={seller}
          onChangeText={setSeller}
          placeholder="Seller name"
          placeholderTextColor="#aaa"
          style={inputStyle}
        />

        <Pressable
          onPress={registerPhone}
          style={{ backgroundColor: accent, borderRadius: 10, padding: 13, alignItems: "center" }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>Register Phone</Text>
        </Pressable>

        {/* Phone list */}
        {phones.length > 0 && (
          <Text style={{ fontSize: 13, fontWeight: "700", color: "#555", marginTop: 6 }}>REGISTERED PHONES</Text>
        )}

        {phones.map((p) => (
          <View key={p.id} style={{
            flexDirection: "row", alignItems: "flex-start",
            borderLeftWidth: 3, borderLeftColor: accent,
            backgroundColor: "#fafafa", borderRadius: 8, padding: 12, gap: 8,
          }}>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={{ fontSize: 15, fontWeight: "700", color: "#1a1a1a" }}>{p.brand} {p.model}</Text>
              <Text style={{ fontSize: 13, color: "#555" }}>Price: {p.price}</Text>
              <Text style={{ fontSize: 13, color: "#888" }}>Seller: {p.seller}</Text>
            </View>
            <Pressable onPress={() => deletePhone(p.id)}>
              <Text style={{ color: "#aaa", fontSize: 18, lineHeight: 20 }}>×</Text>
            </Pressable>
          </View>
        ))}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

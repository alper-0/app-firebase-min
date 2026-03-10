import { useState, useEffect } from "react";
import { 
  Alert, Platform,
  Text, TextInput, 
  View, KeyboardAvoidingView,
  Pressable,
  ScrollView,
 } from 'react-native';

import { auth, db} from "./src/lib/firebase";
import { 
  onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut
} from "firebase/auth";

import { 
  addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp 
} from "firebase/firestore";

type Note = {id: string, text: string};

export default function App() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Auth form
  const [email, setEmail] = useState("fjsilva@sp.senac.br");
  const [password, setPassword]= useState("a1b2c3");

  // DB Firestore 
  const [noteText, setNoteText] = useState("Primeira anotação");
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect( () =>{
    const unsub = onAuthStateChanged(auth, (u) => {
      setUserEmail(u?.email ?? null);
    });
    return unsub;
  },[])

  async function handleRegister(){
    try {
      console.log("Register -> ", email.trim());
      const create = await createUserWithEmailAndPassword(auth, email.trim(), password);
      console.log("Register Ok uid: ", create.user.uid);
      Alert.alert("Conta criada com sucesso", create.user.email ?? "");
    } catch (error) {
      console.log("Register failed", error);      
    }
  }

  return (
    <KeyboardAvoidingView
    style={{ flex:1, marginTop:25}}
    behavior={Platform.select({ios:"padding", android:"height"})}
    >
      <ScrollView contentContainerStyle={{padding:16, gap:16}}>
        <Text style={{fontSize:22, fontWeight:"700"}}
        >Expo/React + Firebase(mínimo)</Text>
        <View 
        style={{padding:12, borderWidth:1, borderRadius:12, 
        gap:10, marginTop:5}}>
          <Text style={{fontSize:16, fontWeight:"600"}}
          >Auth</Text>
          <Text>Usuário logado: {userEmail ?? "nenhum"}</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="email"
            autoCapitalize="none"
            style={{borderWidth:1, borderRadius:10, padding:10}}
          ></TextInput>
          <TextInput 
            value={password}
            onChangeText={setPassword}
            placeholder="senha"
            secureTextEntry
            style={{borderWidth:1, borderRadius:10, padding:10}}
          ></TextInput>
          <View style={{flexDirection:"row", gap: 10, flexWrap: "wrap"}}>
            <Pressable onPress={handleRegister}
            style={{padding:10, borderWidth:1, borderRadius:10 }}>
              <Text>Criar conta</Text>
            </Pressable>
            <Pressable style={{padding:10, borderWidth:1, borderRadius:10 }}>
              <Text>Login</Text>
            </Pressable>
            <Pressable style={{padding:10, borderWidth:1, borderRadius:10 }}>
              <Text>Logout</Text>
            </Pressable>
          </View>
        </View>
        <View style={{padding:12, borderWidth:1, borderRadius:12, 
          gap:10, marginTop:5}}>
          <Text style={{fontSize:16, fontWeight: "600"}}
          >Firestore</Text>
          <TextInput
            value={noteText}
            onChangeText={setNoteText}
            placeholder="Texto da anotação"
            style={{borderWidth:1, borderRadius:10, padding:10}}
          ></TextInput>
          <View style={{flexDirection:"row", gap:10, flexWrap:"wrap"}}>
            <Pressable style={{padding:10, borderWidth:1, borderRadius:10 }}
            ><Text>Salvar nota</Text></Pressable>
            <Pressable style={{padding:10, borderWidth:1, borderRadius:10 }}
            ><Text>Recarregar</Text></Pressable>
          </View>
          <View>
            {notes.map(n => (
              <Text key={n.id}>- {n.text}</Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


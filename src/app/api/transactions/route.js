import { db } from "../../../lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  Timestamp,
  doc
} from "firebase/firestore";

// 🔹 Add a transaction
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      card_id,
      user_id,
      transaction_name,
      status,
      amount,
    } = body;

    if (!card_id || !user_id || !transaction_name || amount == null) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    const transRef = collection(db, "transactions");

    const docRef = await addDoc(transRef, {
      card_id,
      user_id,
      transaction_name,
      status: !!status,
      amount,
      created_at: Timestamp.now(),
    });

    await updateDoc(doc(db, "transactions", docRef.id), {
      transaction_id: docRef.id,
    });

    return new Response(JSON.stringify({ success: true, id: docRef.id }), {
      status: 201,
    });
  } catch (err) {
    console.error("POST /api/transactions error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

// 🔹 Get all transactions for a user or card
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");
    const card_id = searchParams.get("card_id");

    if (!user_id && !card_id) {
      return new Response(JSON.stringify({ error: "Missing user_id or card_id" }), {
        status: 400,
      });
    }

    const transRef = collection(db, "transactions");

    const q = card_id
      ? query(transRef, where("card_id", "==", card_id))
      : query(transRef, where("user_id", "==", user_id));

    const snapshot = await getDocs(q);

    const transactions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return new Response(JSON.stringify(transactions), { status: 200 });
  } catch (err) {
    console.error("GET /api/transactions error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

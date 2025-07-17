// src/app/api/card-details/by-id/route.js
import { db } from "../../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const card_id = searchParams.get("card_id");

    if (!card_id) {
      return new Response(JSON.stringify({ error: "Missing card_id" }), {
        status: 400,
      });
    }

    const docRef = doc(db, "card_details", card_id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return new Response(JSON.stringify({ error: "Card not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ id: docSnap.id, ...docSnap.data() }), {
      status: 200,
    });
  } catch (err) {
    console.error("GET /api/card-details/by-id error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(express.json());

// Inicializa o SDK com a chave do Gemini do Render
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.post("/chat", async (req, res) => {
  const { user, text } = req.body;

  try {
    // Chama o modelo Gemini via SDK
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: `${user}: ${text}` }]
        }
      ]
    });

    // Pega a resposta real do Gemini
    const reply = response.candidates?.[0]?.content?.[0]?.parts?.[0]?.text || "Sem resposta";

    console.log(`Mensagem de ${user}: ${text}`);
    console.log(`Resposta do Gemini: ${reply}`);

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Erro ao chamar a IA." });
  }
});

app.get("/", (req, res) => {
  res.send("API do NPC com Gemini (SDK) está rodando.");
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));

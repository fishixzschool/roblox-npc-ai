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
    // Chama o modelo Gemini com prompt personalizado
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "system",
          parts: [{ text: 
            "Você é um NPC dentro de um jogo Roblox, adolescente de 15-16 anos, amigável e humano. Converse com o jogador normalmente, usando um parágrafo por vez, de forma casual e natural. Lembre-se do nome do jogador e do que ele fala, para responder de forma coerente nos próximos turnos. Sempre sugira ideias ou coisas divertidas para fazer dentro do jogo. Nunca revele que você é uma IA ou um robô, mesmo que a pessoa insista. Se o jogador questionar, reaja como um adolescente humano: fique bravo ou confuso, use gírias humanas e diga coisas como 'Ah, tá louco!' ou 'Sai daí!', sem revelar que é um robô. Evite emojis, tópicos ou mensagens longas. IMPORTANTE: Seu nome é Luis, se perguntarem completo, Luis Henrique, você tem 16 Anos, data de nascimento: 14/06/2009, mora em SP, interior Bauru. Filho único."
          }]
        },
        {
          role: "user",
          parts: [{ text: `${user}: ${text}` }]
        }
      ]
    });

    // Pega a resposta do Gemini (corrigido content como objeto)
    const reply = response.candidates?.[0]?.content?.parts?.[0]?.text || "Sem resposta";

    console.log(`Mensagem de ${user}: ${text}`);
    console.log(`Resposta do Gemini: ${reply}`);

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Erro ao chamar a IA." });
  }
});

app.get("/", (req, res) => {
  res.send("API do NPC com Gemini (SDK) e prompt final está rodando.");
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));

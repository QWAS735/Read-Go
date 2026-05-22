import { useState, useRef, useEffect } from "react";
import "./ChatPage.css";

const SUGGESTIONS = [
  "Family-friendly beaches in Europe",
  "Warm destinations in winter under $1000",
  "Child-friendly cities in Germany",
  "Romantic getaways with mountains",
  "Adventure travel in South America",
];

function Message({ msg }) {
  return (
    <div className={`chat-message chat-message--${msg.role}`}>
      <div className="chat-message__bubble">
        {msg.content}
        {msg.streaming && <span className="chat-message__cursor" />}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text) {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput("");

    const newHistory = [
      ...messages.filter(m => !m.streaming),
      { role: "user", content: userText },
    ];
    setMessages([...newHistory, { role: "assistant", content: "", streaming: true }]);
    setLoading(true);

    const apiMessages = newHistory.map(m => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6);
          if (payload === "[DONE]") break;
          try {
            const { text, error } = JSON.parse(payload);
            if (error) throw new Error(error);
            if (text) {
              assistantText += text;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: assistantText,
                  streaming: true,
                };
                return updated;
              });
            }
          } catch {
            // skip malformed chunks
          }
        }
      }

      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: assistantText, streaming: false };
        return updated;
      });
    } catch {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
          streaming: false,
        };
        return updated;
      });
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const isEmpty = messages.length === 0;

  return (
    <main className="chat-page">
      <div className="chat-page__inner">
        <div className="chat-page__header">
          <h1 className="chat-page__title">Travel Recommender</h1>
          <p className="chat-page__subtitle">
            Tell me your travel preferences and I'll find the perfect destination for you.
          </p>
        </div>

        {isEmpty && (
          <div className="chat-suggestions">
            {SUGGESTIONS.map(s => (
              <button key={s} className="chat-suggestion-pill" onClick={() => sendMessage(s)}>
                {s}
              </button>
            ))}
          </div>
        )}

        {!isEmpty && (
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <Message key={i} msg={msg} />
            ))}
            <div ref={bottomRef} />
          </div>
        )}

        <div className="chat-input-row">
          <textarea
            ref={inputRef}
            className="chat-input"
            placeholder="Describe your ideal trip… (e.g. warm, child-friendly, in Europe)"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            disabled={loading}
          />
          <button
            className="chat-send-btn"
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
          >
            {loading ? "…" : "Send"}
          </button>
        </div>
      </div>
    </main>
  );
}

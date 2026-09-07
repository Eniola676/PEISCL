import { FormEvent, useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "./ui/button";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I can help you find the right PEISCL course. What are you hoping to learn?",
};

const SUGGESTIONS = [
  "Which course suits a total beginner?",
  "What do you teach about cybersecurity?",
  "Where are your campuses?",
];

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isSending]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    const next = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(next);
    setInput("");
    setError("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // The greeting is ours, not part of the real conversation.
        body: JSON.stringify({ messages: next.filter((m) => m !== GREETING) }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data?.reply) {
        throw new Error(data?.error || "Chat is unavailable");
      }

      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch (err) {
      console.error("Chat error:", err);
      setError(
        err instanceof Error && err.message !== "Chat is unavailable"
          ? err.message
          : "I couldn't reply just now. Try again, or reach us on WhatsApp at 08097545740."
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close course assistant" : "Open course assistant"}
        className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-purple-600 text-white shadow-xl flex items-center justify-center hover:bg-purple-700 transition-all hover:-translate-y-0.5"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Course assistant"
          className="fixed bottom-24 right-5 z-40 w-[calc(100vw-2.5rem)] sm:w-96 max-h-[70vh] flex flex-col bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden animate-slide-up"
        >
          <div className="px-5 py-4 border-b border-gray-200">
            <div className="font-semibold text-gray-900">Course assistant</div>
            <div className="text-sm text-gray-500">
              Free to ask — answers come from our course catalogue.
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  message.role === "user"
                    ? "ml-auto bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {message.content}
              </div>
            ))}

            {isSending && (
              <div className="bg-gray-100 text-gray-500 rounded-2xl px-4 py-2.5 text-sm w-fit">
                Typing…
              </div>
            )}

            {messages.length === 1 && !isSending && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => void send(suggestion)}
                    className="text-xs text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-full px-3 py-1.5 transition-colors text-left"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about our courses…"
              maxLength={1500}
              aria-label="Message"
              className="flex-1 min-w-0 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all"
            />
            <Button
              type="submit"
              size="icon"
              disabled={isSending || !input.trim()}
              aria-label="Send message"
              className="flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
};

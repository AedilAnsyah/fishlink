"use client";

import React, { useState } from "react";
import { MessageSquare, Send, Bot, User, CheckCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
}

export function LiveChatSim() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "bot",
      text: "Halo! Selamat datang di Layanan Pelanggan Fishlink. Ada yang bisa kami bantu terkait pasokan hasil laut, traceability, atau pendaftaran mitra?",
      timestamp: "Baru saja",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // Simulate CS bot response
    setTimeout(() => {
      let botReply = "Terima kasih telah menghubungi kami. Tim Layanan Pelanggan Fishlink akan segera menindaklanjuti pesan Anda. Untuk respon instan via WhatsApp, Anda juga dapat menghubungi 0812-3456-7890.";
      
      const lower = userMsg.text.toLowerCase();
      if (lower.includes("daftar") || lower.includes("mitra") || lower.includes("nelayan")) {
        botReply = "Untuk pendaftaran mitra nelayan/petambak, Anda bisa membuka halaman /daftar-supplier. Pendaftaran gratis & siap dibantu tim kami di dermaga!";
      } else if (lower.includes("harga") || lower.includes("katalog") || lower.includes("beli")) {
        botReply = "Katalog harga ikan harian bersertifikat cold-chain dapat diakses setelah masuk sebagai akun pembeli (buyer).";
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: botReply,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-2xl border border-ink-200 shadow-sm overflow-hidden flex flex-col h-[460px]">
      {/* Chat Header */}
      <div className="bg-ocean-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-sky-400 text-ink-900 flex items-center justify-center font-bold relative">
            <Bot className="w-5 h-5" />
            <span className="w-2.5 h-2.5 bg-success-600 border-2 border-ocean-900 rounded-full absolute bottom-0 right-0" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">Live Chat CS Fishlink</h4>
            <p className="text-[11px] text-sky-200">Online • Respon Cepat (Simulasi MVP)</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() =>
            setMessages([
              {
                id: "1",
                sender: "bot",
                text: "Halo! Selamat datang di Layanan Pelanggan Fishlink. Ada yang bisa kami bantu terkait pasokan hasil laut atau pendaftaran mitra?",
                timestamp: "Baru saja",
              },
            ])
          }
          className="text-sky-200 hover:text-white p-1 text-xs flex items-center gap-1"
          title="Reset Chat"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-off-white">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                msg.sender === "user"
                  ? "bg-ocean-900 text-white rounded-br-none"
                  : "bg-white text-ink-900 border border-ink-200 rounded-bl-none shadow-xs"
              }`}
            >
              {msg.text}
            </div>
            <span className="text-[10px] text-ink-400 mt-1 px-1 flex items-center gap-1">
              {msg.timestamp}
              {msg.sender === "user" && <CheckCheck className="w-3 h-3 text-sky-400" />}
            </span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-ink-400 italic bg-white px-3 py-2 rounded-xl border border-ink-200 w-fit">
            <Bot className="w-4 h-4 text-ocean-900 animate-bounce" />
            CS Fishlink sedang mengetik balasan...
          </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-ink-200 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ketik pertanyaan Anda di sini..."
          className="flex-1 px-3.5 h-11 rounded-[10px] border border-ink-200 bg-white text-ink-900 text-sm focus:border-ocean-900 outline-none"
        />
        <Button
          type="submit"
          disabled={!inputText.trim()}
          className="h-11 px-4 bg-ocean-900 hover:bg-ocean-700 text-white font-bold shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}

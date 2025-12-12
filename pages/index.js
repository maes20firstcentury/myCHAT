import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [chatMessages, setChatMessages] = useState([]);
  const [isDark, setIsDark] = useState(false);

  // Load Clerk dynamically
  useEffect(() => {
    async function initClerk() {
      const res = await fetch("/api/clerk-key");
      const data = await res.json();

      const clerkLoader = await import("/clerk-loader.js");
      await clerkLoader.loadClerk(data.key);

      const btn = document.getElementById("signup-btn");
      if (btn) {
        btn.addEventListener("click", () => {
          window.Clerk.openSignUp();
        });
      }
    }

    initClerk();
  }, []);

  async function getAIResponse(userMessage) {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await response.json();
    return data.reply;
  }

  function ChatMessage({ message, sender }) {
    return (
      <div className={sender === "user" ? "chat-message-user" : "chat-message-robot"}>
        {sender === "robot" && <img src="/robot.png" className="profile" alt="bot" />}
        <div className="chat-message-text">{message}</div>
        {sender === "user" && <img src="/user.png" className="profile" alt="user" />}
      </div>
    );
  }

  function ChatMessages({ chatMessages }) {
    const bottomRef = useRef(null);

    useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    return (
      <div className="messages-container">
        {chatMessages.map((msg) => (
          <ChatMessage key={msg.id} {...msg} />
        ))}
        <div ref={bottomRef} />
      </div>
    );
  }

  function Chatinput() {
    const [inputText, setInputText] = useState("");

    async function sendMessage() {
      if (!inputText.trim()) return;

      const newChat = [
        ...chatMessages,
        { message: inputText, sender: "user", id: crypto.randomUUID() },
      ];
      setChatMessages(newChat);
      const userMessage = inputText;
      setInputText("");

      const aiResponse = await getAIResponse(userMessage);

      setChatMessages([
        ...newChat,
        { message: aiResponse, sender: "robot", id: crypto.randomUUID() },
      ]);
    }

    return (
      <div className="flex-input">
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Send a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="input-field"
          />
          <button onClick={sendMessage} className="send-button">
            Send
          </button>
        </div>
        <p className="copyright">&copy; Mersen from codeOrbit 2025</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        :root {
          --primary-color: rgb(25, 135, 84);
          --user-msg-bg: #e0f7ea;
          --bot-msg-bg: #f1f0f0;
          --body-bg: #ffffff;
          --text-color: #333;
          --font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }
        html.dark {
          --body-bg: #111;
          --text-color: #eee;
          --user-msg-bg: #0f4030;
          --bot-msg-bg: #222;
          --primary-color: rgb(0, 190, 120);
        }
        body {
          margin: 0;
          padding: 0;
          font-family: var(--font-family);
          background-color: var(--body-bg);
          color: var(--text-color);
        }
        .mode-toggle {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border-bottom: 1px solid #444;
        }
        .signup-btn {
          margin-left: auto;
          padding: 8px 16px;
          border-radius: 10px;
          background: var(--primary-color);
          color: white;
          border: none;
        }
        .app-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 10px;
          padding-bottom: 80px;
        }
        .messages-container {
          flex: 1;
        }
        .chat-message-user,
        .chat-message-robot {
          display: flex;
          margin: 8px 0;
        }
        .chat-message-user {
          justify-content: flex-end;
        }
        .chat-message-text {
          padding: 12px 16px;
          max-width: 80%;
          border-radius: 15px;
        }
        .chat-message-user .chat-message-text {
          background-color: var(--user-msg-bg);
          border-top-right-radius: 0;
        }
        .chat-message-robot .chat-message-text {
          background-color: var(--bot-msg-bg);
          border-top-left-radius: 0;
        }
        .profile {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          margin: 0 6px;
        }
        .telegram-link img {
          width: 32px;
          height: 32px;
        }
        .flex-input {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          background: var(--body-bg);
          border-top: 1px solid #444;
          padding: 10px;
        }
        .input-wrapper {
          max-width: 600px;
          margin: 0 auto;
          display: flex;
        }
        .input-field {
          flex: 1;
          padding: 12px 15px;
          border-radius: 20px;
          border: 1px solid #555;
          background: var(--bot-msg-bg);
        }
        .send-button {
          margin-left: 8px;
          padding: 12px 20px;
          background: var(--primary-color);
          border-radius: 20px;
          color: white;
          border: none;
        }
      `}</style>

      <div className="app-container">
        <div className="mode-toggle">
          <input
            type="checkbox"
            checked={isDark}
            onChange={() => {
              setIsDark(!isDark);
              document.documentElement.classList.toggle("dark");
            }}
          />

          <span>🌙</span>

          <img
            src={isDark ? "/mersen-logo-white.png" : "/mersen-logo-dark.png"}
            width="200"
            alt="logo"
          />

          <a href="https://t.me/Mersenchat" target="_blank" className="telegram-link">
            <img src="/telegram-icon.png" />
          </a>

          <button id="signup-btn" className="signup-btn">
            Sign Up
          </button>
        </div>

        <ChatMessages chatMessages={chatMessages} />
        <Chatinput />
      </div>
    </>
  );
}

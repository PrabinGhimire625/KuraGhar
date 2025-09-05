import { useState, useEffect, useMemo } from "react";
import { io } from "socket.io-client";

function Landing() {
  const socket = useMemo(
    () =>
      io("http://localhost:3000", {
        withCredentials: true,
      }),
    []
  );

  const [messages, setMessages] = useState([]);
  const [socketId, setSocketId] = useState("");
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [roomName, setRoomName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || !room.trim()) return;
    socket.emit("message", { message, room });
    setMessage("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
    });

    socket.on("receive-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("connect");
      socket.off("receive-message");
    };
  }, [socket]);

  const joinRoomHandler = (e) => {
    e.preventDefault();
    if (!roomName.trim()) return;
    socket.emit("join-room", roomName);
    setRoom(roomName); // auto set room
    setRoomName("");
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 sm:p-6 lg:p-8">
      {/* Socket ID */}
      <p className="text-gray-600 text-sm mb-4 text-center">
        Connected Socket ID: <span className="font-medium">{socketId}</span>
      </p>

      {/* Join Room */}
      <form
        onSubmit={joinRoomHandler}
        className="flex flex-col sm:flex-row items-center gap-2 mb-6"
      >
        <input
          type="text"
          placeholder="Enter room name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
          Join
        </button>
      </form>

      {/* Send Message */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-2 mb-6"
      >
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
          Send
        </button>
      </form>

      {/* Messages */}
      <div className="flex flex-col gap-2 max-h-96 overflow-y-auto border-t border-gray-200 pt-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className="bg-gray-100 p-2 rounded-lg break-words shadow-sm"
          >
            {m}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Landing;

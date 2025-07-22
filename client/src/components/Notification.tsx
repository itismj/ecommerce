"use client";

interface NotificationProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export default function Notification({
  message,
  type,
  onClose,
}: NotificationProps) {
  if (!message) return null;

  const baseClasses = "p-4 rounded-md text-white fixed top-5 right-5 z-50";
  const typeClasses = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 font-bold">
        X
      </button>
    </div>
  );
}

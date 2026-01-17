// Sistema de notificaciones temporal usando alerts con emojis
export const addToast = ({
  title,
  description,
  color,
}: {
  title: string;
  description?: string;
  color: "success" | "danger" | "warning" | "primary" | "default" | "secondary";
}) => {
  const emoji =
    color === "success"
      ? "✅"
      : color === "danger"
      ? "❌"
      : color === "warning"
      ? "⚠️"
      : "ℹ️";

  const message = description ? `${title}\n${description}` : title;
  alert(`${emoji} ${message}`);
};

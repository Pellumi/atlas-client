export const toastStyles = {
  success: {
    style: {
      background: "#5CDBD31A", // Lively Green
      color: "#262626", // Dark Charcoal
      border: "1.2px solid #36CFC9", //
      boxShadow: "0 4px 8px #F0F0F0",
      borderRadius: "8px",
      padding: "6px 12px",
    },
  },
  error: {
    style: {
      background: "#D8373A1A", // softWhite
      color: "#262626", // darkCharcoal
      border: "1.2px solid #FF4D4F", // brightRedHover
      boxShadow: "0 4px 8px #F0F0F0",
      borderRadius: "8px",
      padding: "6px 12px",
    },
  },
  warning: {
    position: "bottom-left",
    style: {
      background: "#E6AC001A", // Energetic Yellow
      color: "#262626", // Dark Charcoal
      border: "1.2px solid #FFC53D", // brightRedHover
      boxShadow: "0 4px 8px #F0F0F0",
      borderRadius: "8px",
      padding: "6px 12px",
    },
  },
  info: {
    position: "bottom-left",
    icon: "ℹ️",
    style: {
      background: "#0073E61A", // Vivid Blue
      color: "#262626", // Soft White
      border: "1.2px solid #0073E6", // brightRedHover
      boxShadow: "0 4px 8px #F0F0F0",
      borderRadius: "8px",
      padding: "6px 12px",
    },
  },
};

export const CustomToast = ({ title, message }) => (
  <div className="flex flex-col">
    <strong className="mb-1">{title}</strong>
    <p className="text-sm">{message}</p>
  </div>
);

import PropTypes from "prop-types";
import { cloneElement } from "react";

export const Dialog = ({
  open,
  onOpenChange,
  maxWidth = "448px",
  height = "max-content",
  children,
}) => {
  return open ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 !m-0">
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-full relative"
        style={{ maxWidth, height }}
      >
        {children}
        <button
          className="absolute top-6 right-6 text-[24px] text-gray-500 hover:text-gray-800 flex items-center justify-start"
          onClick={() => onOpenChange(false)}
        >
          ×
        </button>
      </div>
    </div>
  ) : null;
};

Dialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export const DialogTrigger = ({ children, onClick }) => {
  return cloneElement(children, {
    onClick: () => onClick(true),
  });
};

DialogTrigger.propTypes = {
  children: PropTypes.element.isRequired,
  onClick: PropTypes.func.isRequired,
};

export const DialogContent = ({ children, className }) => (
  <div className={`dialog-content ${className}`}>{children}</div>
);

DialogContent.propTypes = {
  children: PropTypes.node.isRequired,
};

export const DialogHeader = ({ children }) => (
  <div className="dialog-header mb-4">{children}</div>
);

DialogHeader.propTypes = {
  children: PropTypes.node.isRequired,
};

export const DialogTitle = ({ children }) => (
  <h2 className="text-xl font-semibold">{children}</h2>
);

DialogTitle.propTypes = {
  children: PropTypes.string.isRequired,
};

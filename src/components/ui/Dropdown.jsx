// import React from "react";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";

export function DropdownMenu({ children }) {
  return <div className="relative">{children}</div>;
}

DropdownMenu.propTypes = {
  children: PropTypes.node.isRequired,
};

export function DropdownMenuTrigger({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-start p-2 hover:bg-neutral-mediumGray text-left rounded-full bg-transparent"
    >
      {children}
    </button>
  );
}

DropdownMenuTrigger.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};

export function DropdownMenuContent({
  children,
  open,
  setOpen,
  className,
  align = "start",
}) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpen]);

  return open ? (
    <div
      ref={ref}
      className={`absolute bg-white border border-gray-200 rounded-md shadow-lg mt-2 w-56 z-[9] ${className}`}
      style={{ right: align === "start" ? 0 : "auto" }}
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
    >
      {children}
    </div>
  ) : null;
}

DropdownMenuContent.propTypes = {
  children: PropTypes.node.isRequired,
  open: PropTypes.bool.isRequired,
  className: PropTypes.string,
  align: PropTypes.oneOf(["start", "end"]),
};

export function DropdownMenuLabel({ children }) {
  return (
    <div className="px-4 py-2 text-sm font-semibold text-gray-700">
      {children}
    </div>
  );
}

DropdownMenuLabel.propTypes = {
  children: PropTypes.node.isRequired,
};

export function DropdownMenuSeparator() {
  return <div className="border-t border-gray-200 my-1" />;
}

export function DropdownMenuItem({ children, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center w-full text-sm text-gray-700 hover:bg-gray-100 rounded-md"
      role="menuitem"
    >
      {children}
    </div>
  );
}

DropdownMenuItem.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};


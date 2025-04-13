// import React from "react";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";

export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white shadow-cardShadow rounded-lg  p-4 ${className}`}>
      {children}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export function CardHeader({ children, className = "" }) {
  return <div className={`mb-4 border-b pb-2 ${className}`}>{children}</div>;
}

CardHeader.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export function CardTitle({ children, className = "" }) {
  return (
    <h2
      className={`text-xl font-header font-medium text-neutral-darkCharcoal ${className}`}
    >
      {children}
    </h2>
  );
}

CardTitle.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export function CardDescription({ children, className = "" }) {
  return <p className={`text-sm text-gray-600 ${className}`}>{children}</p>;
}

CardDescription.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export function CardContent({ children, className = "" }) {
  return <div className={`${className}`}>{children}</div>;
}

CardContent.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export function CardTab({ children, className = "" }) {
  return (
    <div className={`w-full flex items-center justify-between ${className}`}>
      {children}
    </div>
  );
}

export function CardDisabledSpan({ children, className = "" }) {
  return <span className={`text-sm opacity-80 ${className}`}>{children}</span>;
}

export function CardFormattedText({ text }) {
  return (
    <div className="prose">
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  );
}
export function CardFooter({ children, className = "" }) {
  return (
    <div className={`border-t border-gray-200 p-4 flex ${className}`}>
      {children}
    </div>
  );
}

CardFooter.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

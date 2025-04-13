// import React from "react";
import PropTypes from "prop-types";
import { Spinner } from "./Loader";
import { Link } from "react-router-dom";

export const PrimaryButton = ({
  type = "button",
  className = "",
  children,
  onClick,
  ...props
}) => (
  <button
    type={type}
    className={`px-6 py-3 bg-primary-vividBlue text-white text-base font-semibold rounded hover:bg-primary-vividBlueHover h-[42px] flex items-center justify-center relative ${className}`}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

PrimaryButton.propTypes = {
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};

export const ClearButton = ({
  type = "button",
  className = "",
  children,
  onClick,
  ...props
}) => (
  <button
    type={type}
    className={`px-6 py-3 bg-transparent text-base font-semibold rounded hover:text-primary-vividBlueHover border border-neutral-mediumGray hover:border-primary-vividBlue h-[42px] flex items-center justify-center relative ${className}`}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

ClearButton.propTypes = {
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};

// export const CustomButton = ({
//   type = "button",
//   variant = "default",
//   size = "base",
//   onClick,
//   children,
//   className = "",
// }) => {
//   const baseStyles =
//     "flex items-center justify-center rounded-md transition-all font-medium";

//   const variantStyles = {
//     default: "bg-primary-vividBlue text-white hover:bg-primary-vividBlueHover",
//     outline:
//       "border border-neutral-mediumGray text-neutral-darkCharcoal hover:bg-neutral-placeholderBg",
//     icon: "rounded-full border border-neutral-mediumGray hover:bg-neutral-lightGray",
//   };

//   const sizeStyles = {
//     sm: "px-3 py-1.5",
//     base: "px-4 py-2 text-sm",
//     icon: "p-2",
//     large: "px-6 py-3 text-base",
//   };

//   return (
//     <button
//       type={type}
//       onClick={onClick}
//       className={`${baseStyles} ${
//         variantStyles[variant] || variantStyles.default
//       } ${sizeStyles[size] || sizeStyles.base} ${className}`}
//     >
//       {children}
//     </button>
//   );
// };

export const CustomButton = ({
  as = "button",
  to = "#",
  type = "button",
  variant = "dafault",
  size = "base",
  onClick,
  children,
  className = "",
  loading = false,
  ...props
}) => {
  const baseStyles =
    "flex items-center justify-center rounded-md transition-all font-medium relative h-[36px]";

  const variantStyles = {
    default: "bg-primary-vividBlue text-white hover:bg-primary-vividBlueHover",
    ghost:
      "bg-neutral-ghost text-text-ghost hover:bg-neutral-lightGray ",
    clear:
      "bg-transparent text-primary-vividBlue border border-primary-vividBlue hover:border-primary-vividBlue hover:text-neutral-softWhite hover:bg-primary-vividBlue",
    outline:
      "border border-neutral-mediumGray text-neutral-darkCharcoal hover:bg-neutral-placeholderBg",
    danger: "bg-primary-brightRed text-white hover:bg-primary-brightRedHover",
    icon: "rounded-full border border-neutral-lightGray hover:bg-neutral-lightGray",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5",
    base: "px-4 py-2 text-sm",
    icon: "p-2",
    lg: "px-6 py-3 text-base",
  };

  const classes = `${baseStyles} ${
    variantStyles[variant] || variantStyles.default
  } ${sizeStyles[size] || sizeStyles.base} ${className}`;

  if (as === "link") {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} {...props}>
      {loading ? <Spinner /> : children}
    </button>
  );
};

CustomButton.propTypes = {
  as: PropTypes.oneOf(["button", "link"]),
  to: PropTypes.string,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  variant: PropTypes.oneOf(["default", "ghost", "clear", "danger", "icon"]),
  size: PropTypes.oneOf(["sm", "base", "icon", "lg", "full"]),
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  loading: PropTypes.bool,
};

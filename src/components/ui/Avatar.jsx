import PropTypes from "prop-types";

export function Avatar({ children, className }) {
  return (
    <div className={`relative inline-block rounded-full ${className}`}>
      {children}
    </div>
  );
}

Avatar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

Avatar.defaultProps = {
  className: "",
};

export function AvatarImage({ src, alt }) {
  return (
    <img src={src} alt={alt} className="rounded-full w-8 h-8 object-cover" />
  );
}

AvatarImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
};

AvatarImage.defaultProps = {
  alt: "Avatar",
};

export function AvatarFallback({ children }) {
  return (
    <div className="flex items-center justify-center w-9 h-9 text-white bg-primary-vividBlue rounded-full">
      {children}
    </div>
  );
}

AvatarFallback.propTypes = {
  children: PropTypes.node.isRequired,
};

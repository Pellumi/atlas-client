import PropTypes from "prop-types";
import { Children, cloneElement, useState } from "react";

export const Tabs = ({ defaultValue, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="w-full">
      {Children.map(children, (child) => {
        return cloneElement(child, {
          activeTab,
          handleTabChange,
        });
      })}
    </div>
  );
};

Tabs.propTypes = {
  defaultValue: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export const TabList = ({ activeTab, handleTabChange, children, className, secClassName }) => {
  return (
    <div className={`my-2 ${className}`}>
      <div className={`w-full flex bg-primary-vividBlueBg p-1 rounded-md ${secClassName}`}>
        {Children.map(children, (child) => {
          return cloneElement(child, {
            activeTab,
            handleTabChange,
          });
        })}
      </div>
    </div>
  );
};

TabList.propTypes = {
  activeTab: PropTypes.string.isRequired,
  handleTabChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export const TabContent = ({ value, activeTab, children, className }) => {
  if (activeTab !== value) return null;

  return <div className={className}>{children}</div>;
};

TabContent.propTypes = {
  value: PropTypes.string.isRequired,
  activeTab: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export const Tab = ({ value, activeTab, handleTabChange, children }) => {
  return (
    <button
      className={`py-2 px-4 text-sm font-medium text-gray-600 hover:text-blue-500 transition-colors duration-200 ${
        activeTab === value ? "border-b-2 border-blue-500 text-blue-500" : ""
      }`}
      onClick={() => handleTabChange(value)}
    >
      {children}
    </button>
  );
};

Tab.propTypes = {
  value: PropTypes.string.isRequired,
  activeTab: PropTypes.string.isRequired,
  handleTabChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export const TabTrigger = ({ value, activeTab, handleTabChange, children }) => {
  const handleClick = () => {
    handleTabChange(value);
  };

  return (
    <button
      className={`flex-1 rounded-[4px] text-sm font-medium transition-colors duration-200 ${
        activeTab === value ? "bg-neutral-softWhite shadow-sm" : ""
      }`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

TabTrigger.propTypes = {
  value: PropTypes.string.isRequired,
  activeTab: PropTypes.string.isRequired,
  handleTabChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

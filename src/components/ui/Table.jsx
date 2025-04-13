// import React from 'react'
import PropTypes from "prop-types";

export const Table = ({ children, maxHeight = "380px" }) => {
  return (
    <div className="overflow-auto rounded-lg" style={{ maxHeight }}>
      <table className="w-full table-auto bg-white rounded-lg">
        {children}
      </table>
    </div>
  );
};

Table.propTypes = {
  children: PropTypes.node.isRequired,
  maxHeight: PropTypes.string,
};

export const TableHeader = ({ children }) => {
  return (
    <thead className="bg-white sticky top-0 z-10 border-b">{children}</thead>
  );
};

TableHeader.propTypes = {
  children: PropTypes.node.isRequired,
};

export const TableRow = ({ children, onClick, className }) => {
  return (
    <tr onClick={onClick} className={`even:bg-gray-50 odd:bg-white hover:bg-gray-100 ${className}`}>
      {children}
    </tr>
  );
};

TableRow.propTypes = {
  children: PropTypes.node.isRequired,
};

export const TableHead = ({ children, className="" }) => {
  return (
    <th className={`text-left bg-primary-vividBlueBg p-4 px-2 font-semibold max-w-[400px] truncate ${className}`}>
      {children}
    </th>
  );
};

TableHead.propTypes = {
  children: PropTypes.node.isRequired,
};

export const TableBody = ({ children }) => {
  return (
    <tbody className={`divide-y divide-gray-200 overflow-y-auto`}>
      {children}
    </tbody>
  );
};

TableBody.propTypes = {
  children: PropTypes.node.isRequired,
};

export const TableCell = ({ children, className = "" }) => {
  return <td className={`p-2 flex-none text-sm font-semibold ${className}`}>{children}</td>;
};

TableCell.propTypes = {
  children: PropTypes.node.isRequired,
};

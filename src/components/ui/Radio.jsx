import { useState } from "react"

export function RadioGroup({ value, onChange, options, name }) {
  return (
    <div className="flex space-x-4">
      {options.map((option) => (
        <RadioGroupItem
          key={option.value}
          value={option.value}
          label={option.label}
          checked={value === option.value}
          onChange={() => onChange(option.value)}
          name={name}
        />
      ))}
    </div>
  )
}

export function RadioGroupItem({ value, label, checked, onChange, name }) {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="hidden"
      />
      <div
        className={`w-4 h-4 border-2 rounded-full flex items-center justify-center transition-all ${
          checked ? "border-blue-600 bg-blue-600" : "border-gray-400"
        }`}
      >
        {checked && <div className="w-2 h-2 bg-white rounded-full" />}
      </div>
      <span>{label}</span>
    </label>
  )
}

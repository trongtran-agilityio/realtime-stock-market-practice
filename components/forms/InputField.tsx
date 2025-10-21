import React from 'react'
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * Input Field Component
 * Reusable form input with label and error handling
 * 
 * @param name - Input field identifier
 * @param label - Display label
 * @param placeholder - Input placeholder text
 * @param type - Input type (text, email, password, etc.)
 * @param register - React Hook Form register function
 * @param error - Error object from form validation
 * @param validation - Validation rules
 * @param disabled - Disable input state
 * @param value - Controlled input value
 */

const InputField = ({ name, label, placeholder, type = "text", register, error, validation, disabled, value }: FormInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="form-label">{label}</Label>
      <Input
        type={type}
        id={name}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        className={cn('form-input', { 'opacity-50 cursor-not-allowed': disabled })}
        {...register(name, validation)}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  )
}
export default InputField;

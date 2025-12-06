import { useTheme } from '../contexts/ThemeContext';

interface FormInputProps {
  label: string;
  type?: 'text' | 'number';
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  helperText?: string;
}

export default function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  helperText
}: FormInputProps) {
  const { theme } = useTheme();
  const isNumeric = type === 'number';

  return (
    <div className="mb-5">
      <label className={`block text-xs uppercase tracking-widest font-semibold mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-roi-text-secondary'}`}>
        {label}
      </label>
      <input
        type="text"
        inputMode={isNumeric ? 'decimal' : 'text'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="glass-input w-full px-5 py-3.5 text-base font-medium [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      {helperText && (
        <p className={`text-xs mt-2 leading-relaxed ${theme === 'dark' ? 'text-gray-500' : 'text-roi-text-tertiary'}`}>{helperText}</p>
      )}
    </div>
  );
}

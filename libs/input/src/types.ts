export interface InputProps {
  disabled?: boolean;
  error?: string;
  label: string;
  helper?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  testId?: string;
  value: string;
}

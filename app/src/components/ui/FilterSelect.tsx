import type { ReactNode } from 'react';

import { Select } from '@/components/ui/Select';

type Option = {
  label: string;
  value: string;
};

type FilterSelectProps = {
  label: string;
  value: string;
  options: Option[];
  placeholder?: string;
  icon?: ReactNode;
  onChange: (value: string) => void;
};

export function FilterSelect({
  label,
  value,
  options,
  placeholder,
  icon,
  onChange
}: FilterSelectProps) {
  return (
    <Select
      label={label}
      hideLabel
      value={value}
      icon={icon}
      onChange={(event) => onChange(event.target.value)}
    >
      <option value="">{placeholder ?? `All ${label}`}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  );
}

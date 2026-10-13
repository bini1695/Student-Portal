interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className, ...props }: Props) {
  return (
    <div>
      {label && <label className="label">{label}</label>}
      <input className={`input ${className || ''}`} {...props} />
    </div>
  );
}
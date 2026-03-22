type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ className = '', ...props }: InputProps) => {
  return (
    <input
      {...props}
      className={`w-full px-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 ${className}`}
    />
  );
};

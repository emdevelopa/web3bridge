type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
};

export const Button = ({ children, onClick, disabled, variant = 'primary', className = '', type = 'button' }: ButtonProps) => {
  const baseStyles = "relative inline-flex items-center justify-center px-6 py-2.5 font-medium tracking-wide transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 focus:ring-blue-500",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-100 shadow-lg shadow-slate-900/20 focus:ring-slate-700",
    outline: "bg-transparent border border-slate-700 hover:bg-slate-800/50 text-slate-300 focus:ring-slate-700",
    danger: "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20 focus:ring-red-500",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

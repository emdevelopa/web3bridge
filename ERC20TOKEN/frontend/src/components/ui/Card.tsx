type CardProps = { 
  children: React.ReactNode;
  className?: string;
};

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`glass-card p-6 rounded-2xl w-full max-w-md transition-all duration-300 hover:border-slate-700/50 ${className}`}>
      {children}
    </div>
  );
};

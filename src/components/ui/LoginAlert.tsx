interface AlertProps {
    children: React.ReactNode; // children 추가
    variant?: 'default' | 'destructive';
    className?: string;
  }
  
  export const Alert: React.FC<AlertProps> = ({ children, variant = 'default', className }) => {
    const baseClass = 'p-4 rounded-md flex items-center space-x-2';
    const variants = {
      default: 'bg-gray-100 text-gray-800',
      destructive: 'bg-red-100 text-red-800 border border-red-200',
    };
  
    return (
      <div className={`${baseClass} ${variants[variant]} ${className}`}>
        {children}
      </div>
    );
  };
  
  interface AlertDescriptionProps {
    children: React.ReactNode; // children 추가
    className?: string;
  }
  
  export const AlertDescription: React.FC<AlertDescriptionProps> = ({ children, className }) => {
    return <div className={`text-sm ${className}`}>{children}</div>;
  };
  
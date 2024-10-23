const Alert = ({ className, children, variant = "default" }) => {
  const variantClasses = {
    default: "bg-background text-foreground",
    destructive: "bg-red-100 text-red-600 border-red-600/20"
  };

  return (
    <div
      role="alert"
      className={`relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground ${variantClasses[variant]} ${className}`}
    >
      {children}
    </div>
  );
};

const AlertDescription = ({ className, children }) => {
  return (
    <div className={`text-sm [&_p]:leading-relaxed ${className}`}>
      {children}
    </div>
  );
};

export { Alert, AlertDescription };


interface SimpleLoaderProps {
  size?: "sm" | "md" | "lg";
  message?: string;
}

const Loader: React.FC<SimpleLoaderProps> = ({ size = "md", message }) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-4">
      {/* Spinning Icon */}
      <div
        className={`${sizeClasses[size]} flex animate-spin items-center justify-center rounded-full border-2 border-b-0 border-t-0 border-primary`}
      ></div>

      {/* Optional Message */}
      {message && (
        <p className="animate-pulse text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  );
};

export default Loader;

const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={`container wrapper ${className}`}>{children}</div>;
};

export default Container;

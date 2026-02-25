interface HomeLayoutProps {
  children: React.ReactNode;
}

export const HomeLayout = ({ children }: HomeLayoutProps) => {
  return <div className="min-h-screen bg-background">{children}</div>;
};

import { ReactNode } from 'react';
import { Header } from './Header';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="border-t bg-muted/30 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          IIC Support Board — Indian Institute of Technology Madras
        </div>
      </footer>
    </div>
  );
}

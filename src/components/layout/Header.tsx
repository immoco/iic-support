import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Shield, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function Header() {
  const { user, role, signOut } = useAuth();
  const location = useLocation();

  const isAdmin = role === 'admin';

  const navItems = isAdmin
    ? [
        { href: '/admin', label: 'Dashboard' },
        { href: '/admin/announcements', label: 'Announcements' },
        { href: '/admin/faqs', label: 'FAQs' },
        { href: '/admin/users', label: 'Users' },
      ]
    : [
        { href: '/dashboard', label: 'My Requests' },
        { href: '/new-request', label: 'New Request' },
        { href: '/library', label: 'Resolved Library' },
      ];

  return (
    <header className="bg-header text-header-foreground border-b border-border/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to={isAdmin ? '/admin' : '/dashboard'} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-header-foreground/10 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-serif font-bold">IIC Support Board</h1>
              <p className="text-xs text-header-foreground/70">IIC Training Support</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  location.pathname === item.href
                    ? 'bg-header-foreground/15 text-header-foreground'
                    : 'text-header-foreground/80 hover:bg-header-foreground/10 hover:text-header-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-header-foreground/70" />
              <span className="text-header-foreground/90 max-w-[200px] truncate">
                {user?.email}
              </span>
              {isAdmin && (
                <span className="px-2 py-0.5 text-xs bg-accent text-accent-foreground rounded-full font-medium">
                  Admin
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="text-header-foreground/80 hover:text-header-foreground hover:bg-header-foreground/10"
            >
              <LogOut className="w-4 h-4" />
              <span className="ml-2 hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Mobile nav */}
        <nav className="md:hidden flex items-center gap-1 pb-3 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap',
                location.pathname === item.href
                  ? 'bg-header-foreground/15 text-header-foreground'
                  : 'text-header-foreground/80 hover:bg-header-foreground/10'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

import { Link, useLocation } from 'wouter';
import { Home, Search, Bookmark, LayoutGrid, User } from 'lucide-react';

export default function MobileNav() {
  const [location] = useLocation();
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
      <div className="flex justify-around">
        <Link href="/" className={`flex flex-col items-center py-2 ${location === '/' ? 'text-blue-600' : 'text-gray-500'}`}>
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link href="/search" className={`flex flex-col items-center py-2 ${location === '/search' ? 'text-blue-600' : 'text-gray-500'}`}>
          <Search className="h-5 w-5" />
          <span className="text-xs mt-1">Search</span>
        </Link>
        <Link href="/saved" className={`flex flex-col items-center py-2 ${location === '/saved' ? 'text-blue-600' : 'text-gray-500'}`}>
          <Bookmark className="h-5 w-5" />
          <span className="text-xs mt-1">Saved</span>
        </Link>
        <Link href="/categories" className={`flex flex-col items-center py-2 ${location === '/categories' ? 'text-blue-600' : 'text-gray-500'}`}>
          <LayoutGrid className="h-5 w-5" />
          <span className="text-xs mt-1">Categories</span>
        </Link>
        <Link href="/profile" className={`flex flex-col items-center py-2 ${location === '/profile' ? 'text-blue-600' : 'text-gray-500'}`}>
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </nav>
  );
}

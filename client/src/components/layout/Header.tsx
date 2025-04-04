import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useCategories } from '@/hooks/useArticles';
import { 
  NewspaperIcon, 
  Search, 
  User, 
  Menu 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Sheet, SheetTrigger, SheetContent, SheetClose } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

export default function Header() {
  const [location, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: categories, isLoading } = useCategories();
  const { toast } = useToast();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  const handleSubscribe = () => {
    toast({
      title: "Subscribe",
      description: "Subscription functionality would be implemented in a real application",
    });
  };
  
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top bar with logo and search */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <NewspaperIcon className="text-blue-600 h-8 w-8 mr-2" />
            <h1 className="text-2xl font-bold font-serif text-gray-900">NewsPortal</h1>
          </Link>
        </div>
        
        {/* Search form */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <form onSubmit={handleSearch} className="relative w-full">
            <Input
              type="text"
              placeholder="Search news..."
              className="w-full py-2 pl-4 pr-10 rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit"
              variant="ghost"
              size="icon"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
        
        {/* User actions */}
        <div className="flex items-center space-x-4">
          <Link href="/search">
            <Button variant="ghost" size="icon" className="md:hidden text-gray-500">
              <Search className="h-5 w-5" />
            </Button>
          </Link>
          <Button 
            onClick={handleSubscribe}
            className="hidden md:block"
          >
            Subscribe
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500">
            <User className="h-5 w-5" />
          </Button>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-gray-500">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="py-4">
                <Link href="/" className="flex items-center">
                  <NewspaperIcon className="text-blue-600 h-6 w-6 mr-2" />
                  <h2 className="text-xl font-bold font-serif text-gray-900">NewsPortal</h2>
                </Link>
                <Separator className="my-4" />
                <nav className="flex flex-col space-y-2">
                  <SheetClose asChild>
                    <Link href="/" className="px-2 py-1.5 rounded hover:bg-gray-100">Home</Link>
                  </SheetClose>
                  {categories?.map(category => (
                    <SheetClose key={category.id} asChild>
                      <Link 
                        href={`/category/${category.slug}`}
                        className="px-2 py-1.5 rounded hover:bg-gray-100"
                      >
                        {category.name}
                      </Link>
                    </SheetClose>
                  ))}
                  <Separator className="my-2" />
                  <SheetClose asChild>
                    <Link href="/search" className="px-2 py-1.5 rounded hover:bg-gray-100">Search</Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button onClick={handleSubscribe} className="mt-2">Subscribe</Button>
                  </SheetClose>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Main navigation */}
      <nav className="bg-white border-t border-gray-200 hidden md:block">
        <div className="container mx-auto px-4">
          <ul className="flex overflow-x-auto py-3 space-x-6 text-sm font-semibold text-gray-500">
            <li>
              <Link 
                href="/"
                className={location === '/' ? "text-blue-600 border-b-2 border-blue-600 pb-2" : "hover:text-blue-600 transition"}
              >
                Home
              </Link>
            </li>
            {categories?.map(category => (
              <li key={category.id}>
                <Link 
                  href={`/category/${category.slug}`}
                  className={
                    location === `/category/${category.slug}` 
                      ? "text-blue-600 border-b-2 border-blue-600 pb-2" 
                      : "hover:text-blue-600 transition"
                  }
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}

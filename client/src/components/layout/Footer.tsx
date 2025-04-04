import { Link } from 'wouter';
import { useCategories } from '@/hooks/useArticles';
import { 
  NewspaperIcon, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Linkedin 
} from 'lucide-react';

export default function Footer() {
  const { data: categories } = useCategories();
  
  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <NewspaperIcon className="text-blue-600 h-8 w-8 mr-2" />
              <h2 className="text-2xl font-bold font-serif">NewsPortal</h2>
            </div>
            <p className="text-gray-400 mb-4">Your trusted source for breaking news, in-depth analysis, and timely updates from around the world.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-600 transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories?.slice(0, 7).map(category => (
                <li key={category.id}>
                  <Link href={`/category/${category.slug}`} className="text-gray-400 hover:text-blue-600 transition">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-blue-600 transition">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-600 transition">Meet the Team</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-600 transition">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-600 transition">Advertise</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-600 transition">Contact Us</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-blue-600 transition">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-600 transition">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-600 transition">Community Guidelines</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-600 transition">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-600 transition">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6 text-sm text-gray-400">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>© {new Date().getFullYear()} NewsPortal. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <a href="#" className="hover:text-blue-600 transition">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600 transition">Terms of Use</a>
              <a href="#" className="hover:text-blue-600 transition">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

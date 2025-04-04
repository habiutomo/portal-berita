import { useState } from 'react';
import { Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategories } from '@/hooks/useArticles';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('all');
  const { data: categories } = useCategories();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Subscription successful!",
      description: `You've been subscribed to receive ${category === 'all' ? 'all categories' : category} news updates.`,
    });
    setEmail('');
  };

  return (
    <section className="bg-blue-600 bg-opacity-10 rounded-lg p-6 mb-8">
      <div className="text-center mb-4">
        <Mail className="mx-auto text-blue-600 h-6 w-6 mb-3" />
        <h2 className="text-xl font-bold font-serif mb-2">Stay Updated</h2>
        <p className="text-gray-600 text-sm">Get the latest news delivered to your inbox daily.</p>
      </div>
      
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div>
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map(cat => (
                <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Button type="submit" className="w-full">
            Subscribe Now
          </Button>
        </div>
        <p className="text-xs text-gray-500 text-center">
          By subscribing, you agree to our <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
        </p>
      </form>
    </section>
  );
}

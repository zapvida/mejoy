import { premiumStories } from '@/content/mejoy-premium';
import { StoryScreen } from '@/screens/story-screen';

export default function ProductScannerRoute() {
  return <StoryScreen story={premiumStories['product-scanner']} />;
}

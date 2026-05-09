import { premiumStories } from '@/content/mejoy-premium';
import { StoryScreen } from '@/screens/story-screen';

export default function OrderStatusRoute() {
  return <StoryScreen story={premiumStories['order-status']} />;
}

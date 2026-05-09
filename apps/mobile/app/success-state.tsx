import { premiumStories } from '@/content/mejoy-premium';
import { StoryScreen } from '@/screens/story-screen';

export default function SuccessStateRoute() {
  return <StoryScreen story={premiumStories['success-state']} />;
}

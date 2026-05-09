import { premiumStories } from '@/content/mejoy-premium';
import { StoryScreen } from '@/screens/story-screen';

export default function CheckupResultRoute() {
  return <StoryScreen story={premiumStories['checkup-result']} />;
}

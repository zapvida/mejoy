import { premiumStories } from '@/content/mejoy-premium';
import { StoryScreen } from '@/screens/story-screen';

export default function MindSleepRoute() {
  return <StoryScreen story={premiumStories['mind-sleep']} />;
}

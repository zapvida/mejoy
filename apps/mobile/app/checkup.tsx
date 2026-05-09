import { premiumStories } from '@/content/mejoy-premium';
import { StoryScreen } from '@/screens/story-screen';

export default function CheckupRoute() {
  return <StoryScreen story={premiumStories.checkup} />;
}

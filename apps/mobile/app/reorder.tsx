import { premiumStories } from '@/content/mejoy-premium';
import { StoryScreen } from '@/screens/story-screen';

export default function ReorderRoute() {
  return <StoryScreen story={premiumStories.reorder} />;
}

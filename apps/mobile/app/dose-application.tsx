import { premiumStories } from '@/content/mejoy-premium';
import { StoryScreen } from '@/screens/story-screen';

export default function DoseApplicationRoute() {
  return <StoryScreen story={premiumStories['dose-application']} />;
}

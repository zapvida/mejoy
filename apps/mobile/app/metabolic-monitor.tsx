import { premiumStories } from '@/content/mejoy-premium';
import { StoryScreen } from '@/screens/story-screen';

export default function MetabolicMonitorRoute() {
  return <StoryScreen story={premiumStories['metabolic-monitor']} />;
}

import { premiumStories } from '@/content/mejoy-premium';
import { StoryScreen } from '@/screens/story-screen';

export default function ScanResultRoute() {
  return <StoryScreen story={premiumStories['scan-result']} />;
}

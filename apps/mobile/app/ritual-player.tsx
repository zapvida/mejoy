import { premiumStories } from '@/content/mejoy-premium';
import { StoryScreen } from '@/screens/story-screen';

export default function RitualPlayerRoute() {
  return <StoryScreen story={premiumStories['ritual-player']} />;
}

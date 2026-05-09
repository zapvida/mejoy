import { premiumStories } from '@/content/mejoy-premium';
import { StoryScreen } from '@/screens/story-screen';

export default function IntegrationsRoute() {
  return <StoryScreen story={premiumStories.integrations} />;
}

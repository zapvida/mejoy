import { premiumStories } from '@/content/mejoy-premium';
import { StoryScreen } from '@/screens/story-screen';

export default function PrescriptionsRoute() {
  return <StoryScreen story={premiumStories.prescriptions} />;
}

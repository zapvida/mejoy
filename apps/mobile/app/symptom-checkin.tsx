import { premiumStories } from '@/content/mejoy-premium';
import { StoryScreen } from '@/screens/story-screen';

export default function SymptomCheckinRoute() {
  return <StoryScreen story={premiumStories['symptom-checkin']} />;
}

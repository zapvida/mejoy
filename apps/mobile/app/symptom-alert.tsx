import { premiumStories } from '@/content/mejoy-premium';
import { StoryScreen } from '@/screens/story-screen';

export default function SymptomAlertRoute() {
  return <StoryScreen story={premiumStories['symptom-alert']} />;
}

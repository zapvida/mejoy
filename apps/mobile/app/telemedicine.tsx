import { premiumStories } from '@/content/mejoy-premium';
import { StoryScreen } from '@/screens/story-screen';

export default function TelemedicineRoute() {
  return <StoryScreen story={premiumStories.telemedicine} />;
}

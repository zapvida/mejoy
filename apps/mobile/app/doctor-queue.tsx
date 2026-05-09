import { premiumStories } from '@/content/mejoy-premium';
import { StoryScreen } from '@/screens/story-screen';

export default function DoctorQueueRoute() {
  return <StoryScreen story={premiumStories['doctor-queue']} />;
}

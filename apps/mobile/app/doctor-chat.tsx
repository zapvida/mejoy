import { premiumStories } from '@/content/mejoy-premium';
import { StoryScreen } from '@/screens/story-screen';

export default function DoctorChatRoute() {
  return <StoryScreen story={premiumStories['doctor-chat']} />;
}

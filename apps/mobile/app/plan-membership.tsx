import { premiumStories } from '@/content/mejoy-premium';
import { StoryScreen } from '@/screens/story-screen';

export default function PlanMembershipRoute() {
  return <StoryScreen story={premiumStories['plan-membership']} />;
}

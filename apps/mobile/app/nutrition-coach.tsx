import { premiumStories } from '@/content/mejoy-premium';
import { StoryScreen } from '@/screens/story-screen';

export default function NutritionCoachRoute() {
  return <StoryScreen story={premiumStories['nutrition-coach']} />;
}

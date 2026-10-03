/**
 * Screen manifest for the FR-POST module — Lahiru.
 *
 * This is the ONLY file you edit to add a screen. RootNavigator collects every
 * module's manifest automatically, so four people can add screens in parallel
 * without ever touching the same file.
 *
 * Every screen draws its own header (the shared ScreenHeader, or the form's own top
 * bar, per the prototype), so the navigator's native header is off on all of them —
 * otherwise each screen would show two.
 */
import PostingListScreen from './PostingListScreen.js';
import PostingCreateScreen from './PostingCreateScreen.js';
import PostingReviewScreen from './PostingReviewScreen.js';
import PostingSuccessScreen from './PostingSuccessScreen.js';
import PostingDetailScreen from './PostingDetailScreen.js';
import PostingEditScreen from './PostingEditScreen.js';

export default [
  { name: 'PostingList', component: PostingListScreen, options: { headerShown: false } },
  { name: 'PostingCreate', component: PostingCreateScreen, options: { headerShown: false } },
  { name: 'PostingReview', component: PostingReviewScreen, options: { headerShown: false } },
  // The confirmation is final: no swiping back to a review that has already been posted.
  {
    name: 'PostingSuccess',
    component: PostingSuccessScreen,
    options: { headerShown: false, gestureEnabled: false },
  },
  { name: 'PostingDetail', component: PostingDetailScreen, options: { headerShown: false } },
  { name: 'PostingEdit', component: PostingEditScreen, options: { headerShown: false } },
];

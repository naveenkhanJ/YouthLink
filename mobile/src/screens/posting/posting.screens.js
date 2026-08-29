/**
 * Screen manifest for the FR-POST module — Lahiru.
 *
 * This is the ONLY file you edit to add a screen. RootNavigator collects every
 * module's manifest automatically, so four people can add screens in parallel
 * without ever touching the same file.
 */
import PostingListScreen from './PostingListScreen.js';
import PostingCreateScreen from './PostingCreateScreen.js';
import PostingReviewScreen from './PostingReviewScreen.js';
import PostingSuccessScreen from './PostingSuccessScreen.js';
import PostingDetailScreen from './PostingDetailScreen.js';

export default [
  {
    name: 'PostingList',
    component: PostingListScreen,
    options: { title: 'My Postings' },
  },
  {
    name: 'PostingCreate',
    component: PostingCreateScreen,
    options: { title: 'Create Gig Posting' },
  },
  {
    name: 'PostingReview',
    component: PostingReviewScreen,
    options: { title: 'Review Gig Posting' },
  },
  {
    name: 'PostingSuccess',
    component: PostingSuccessScreen,
    options: { title: 'Posting Published', headerShown: false },
  },
  {
    name: 'PostingDetail',
    component: PostingDetailScreen,
    options: { title: 'Gig Details' },
  },
];

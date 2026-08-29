/**
 * Screen manifest for the FR-POST module — Lahiru.
 *
 * This is the ONLY file you edit to add a screen. RootNavigator collects every
 * module's manifest automatically, so four people can add screens in parallel
 * without ever touching the same file.
 *
 * Each entry:
 *   name      Unique across the whole app. Prefix with the module to guarantee
 *             that — e.g. "PostingRegister", not "Register".
 *   component The screen component itself.
 *   options   Optional react-navigation screen options, e.g. { title: "..." }.
 */
import CreatePostingScreen from "./CreatePostingScreen";
import MyPostingsScreen from "./MyPostingsScreen";
import PostingDetailScreen from "./PostingDetailScreen";

export default [
  {
    name: "PostingMine",
    component: MyPostingsScreen,
    options: { title: "My postings" },
  },
  {
    name: "PostingCreate",
    component: CreatePostingScreen,
    options: { title: "Post a gig" },
  },
  {
    name: "PostingDetail",
    component: PostingDetailScreen,
    options: { title: "Posting" },
  },
];

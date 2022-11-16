<script lang="ts">import { track } from 'san-webkit/lib/analytics';
import CreationInfo from 'san-webkit/lib/ui/CreationInfo/svelte';
import { newVotes } from 'san-webkit/lib/ui/CreationInfo/VoteButton.svelte';
import { CreationType } from 'san-webkit/lib/ui/Profile/types';
import { Event } from './../../lib/analytics';
import { selectedLayout } from './../../lib/stores/layout';
import { currentUser } from './../../lib/stores/user';
import { SidewidgetType, getSidewidget } from './../../lib/stores/widgets';
import LayoutInfo from './../../lib/Layouts/LayoutInfo.svelte';
import { queryLayoutVotes } from './../../lib/api/layouts/votes';
import { queryLayoutCommentsCount, subscribeLayoutCommentsCountCache } from './../../lib/api/layouts/comments';
const Sidewidget = getSidewidget();
let votes = newVotes();
let commentsCount = 0;
let unsubscribe;

$: layout = $selectedLayout;

$: ({
  id,
  title,
  user
} = layout || {});

$: isAuthor = $currentUser && layout && +layout.user.id === +$currentUser.id;

$: if (process.browser && id) {
  getVotes(id);
  getCommentsCount(id);
}

const setCount = count => commentsCount = count;

function getCommentsCount(id) {
  queryLayoutCommentsCount(id).then(setCount);
  unsubscribe === null || unsubscribe === void 0 ? void 0 : unsubscribe();
  unsubscribe = subscribeLayoutCommentsCountCache(id, setCount);
}

const setVotes = data => votes = data;

function getVotes(id) {
  votes = newVotes();
  queryLayoutVotes(id).then(setVotes);
}

function onVote() {
  track.event(Event.LikeLayout, {
    id
  });
}

function onEditClick() {
  if (!$currentUser) return;
  const handler = layout ? isAuthor ? window.onLayoutEdit : window.saveAsNewLayout : window.saveLayout;
  return handler === null || handler === void 0 ? void 0 : handler();
}</script>

<CreationInfo
  type={CreationType.Layout}
  {id}
  {title}
  {user}
  {votes}
  source="charts"
  currentUser={$currentUser}
  editLabel={isAuthor ? 'Edit layout' : 'Save as'}
  comments={{
    count: commentsCount,
    active: $Sidewidget === SidewidgetType.LAYOUT_COMMENTS,
    onClick: () => Sidewidget.set(SidewidgetType.LAYOUT_COMMENTS),
  }}
  {onEditClick}
  {onVote}
>
  <svelte:fragment slot="info">
    <LayoutInfo {layout} />
  </svelte:fragment>
</CreationInfo>

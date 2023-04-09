<script context="module">import { dialogs } from 'san-webkit/lib/ui/Dialog';
import ShortcutsDialog from './Dialog.svelte';
export const showShortcutsDialog = () => dialogs.showOnce(ShortcutsDialog);</script>

<script>import { track } from 'san-webkit/lib/analytics';
import Dialog from 'san-webkit/lib/ui/Dialog';
import { CMD } from 'san-webkit/lib/utils/os';
import { Event } from './../analytics';
import Section from './Section.svelte';
track.event(Event.Shortcuts);

function newShortcut(keys, description) {
  return {
    keys,
    description
  };
}

const GENERAL = [newShortcut(['/'], 'Focus search bar'), newShortcut(['Esc'], 'Close a dialog'), newShortcut(['Shift', '?'], 'Open shortcuts info'), newShortcut([CMD, 'Z'], 'Undo action'), newShortcut([CMD, 'Shift', 'Z'], 'Redo action')];
const MAPVIEW = [newShortcut([CMD, 'M'], 'Open Mapview'), newShortcut(['Esc'], 'Close Mapview'), newShortcut([CMD, 'Click'], 'Keep the applied metrics to the chart')];
const SIDEBAR = [// newShortcut([CMD, '\\'], 'Collapse the sidebar'),
newShortcut([CMD, 'Click'], 'Add a metric to the first chart'), newShortcut([CMD, 'Shift', 'Click'], 'Create a new chart with a metric')];
const CHARTS = [newShortcut(['L'], 'Start drawing'), newShortcut(['Shift'], 'Show difference between two range points'), newShortcut([CMD, 'Click'], 'Supply Distribution - deselect other holders'), newShortcut([CMD, 'L'], 'Open Chart layout explorer'), newShortcut([CMD, 'S'], 'Save Chart layout')];</script>

<Dialog {...$$props} title="Keyboard shortcuts" class="shortcuts-dialog">
  <div class="dialog-body">
    <div class="row">
      <div class="column">
        <Section title="General" shortcuts={GENERAL} class="mrg-l mrg--b" />
      </div>
      <div class="column right">
        <Section title="Charts" shortcuts={CHARTS} class="mrg-xs mrg--b" />
      </div>
    </div>
    <div class="row">
      <div class="column">
        <Section title="Sidebar" shortcuts={SIDEBAR} />
      </div>
      <div class="column fluid right">
        <Section title="Mapview" shortcuts={MAPVIEW} />
      </div>
    </div>
  </div>
</Dialog>

<style>
  .right {
    margin-left: 80px;
  }
</style>

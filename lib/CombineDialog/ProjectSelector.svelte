<script>import VirtualList from 'san-webkit/lib/ui/VirtualList/index.svelte';
import Svg from 'san-webkit/lib/ui/Svg/svelte';
import Tooltip from 'san-webkit/lib/ui/Tooltip/svelte';
import { studio } from './../stores/studio';
import { queryAllProjects } from './../api/project';
import Search from './../Sidebar/Search.svelte';
import Project from './Project.svelte';
let className = '';
export { className as class };
export let project;
let items = [];
let searchTerm = '';
let isOpened;
$: filteredItems = searchTerm ? items.filter(projectsFilter) : items;
queryAllProjects().then((projects) => (items = projects));
function projectsFilter({ name, ticker }) {
    return name.toLowerCase().includes(searchTerm) || ticker.toLowerCase().includes(searchTerm);
}
function onProjectSelect(newProject) {
    isOpened = false;
    project = newProject && newProject.slug !== $studio.slug ? newProject : undefined;
}
</script>

<Tooltip on="click" duration={0} class="tooltip-rQ4m04" bind:isOpened>
  <div slot="trigger" class="project border row v-center btn {className}">
    <Project project={project || $studio} />
    <Svg id="arrow" w="8" h="5" class="mrg-a mrg--l arrow-TCykxs" />
  </div>

  <svelte:fragment slot="tooltip">
    <Search class="mrg-s mrg--b" autofocus placeholder="Search assets" bind:searchTerm />

    <VirtualList
      itemHeight={32}
      renderAmount={20}
      maxFluidHeight={335}
      items={filteredItems}
      let:item
    >
      <button class="row v-center btn-ghost" on:click={() => onProjectSelect(item)}>
        <Project project={item} />
      </button>
    </VirtualList>
  </svelte:fragment>
</Tooltip>

<style>
  .project {
    min-height: 32px;
    padding: 5px 7px;
    --fill: var(--waterloo);
    --fill-hover: var(--green);
  }

  :global(.arrow-TCykxs) {
    transform: rotate(180deg);
  }

  :global(.tooltip-rQ4m04) {
    margin-top: -2px;
    width: 239px;
    padding: 8px;
  }
</style>

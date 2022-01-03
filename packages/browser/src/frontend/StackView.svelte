<script lang='ts'>
  import type { NavigatorStack } from './interfaces/Stack'
  import TabsView from './TabsView.svelte'
  import NavigationView from './NavigationView.svelte'

  export let stack: NavigatorStack
</script>

<section>
  <TabsView horizontal slot='a' bind:uuids={stack.navigatorUUIDs}></TabsView>
  <NavigationView slot='b' bind:stack={stack}></NavigationView>
</section>

<style>
  section {
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
  }
</style>
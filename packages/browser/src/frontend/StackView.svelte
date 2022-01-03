<script lang='ts'>
  import type { NavigatorStack } from './interfaces/Stack'
  import TabsView from './TabsView.svelte'
  import SplitView from './SplitView.svelte'
  import NavigationView from './NavigationView.svelte'

  export let stack: NavigatorStack
</script>

<main>
  {#if stack.navigatorUUIDs.length > 1}
    <SplitView type='horizontal' pos={25}>
      <TabsView slot='a' bind:uuids={stack.navigatorUUIDs}></TabsView>
      <NavigationView slot='b'></NavigationView>
    </SplitView>
  {:else}
    <NavigationView slot='b'></NavigationView>
  {/if}
</main>

<style>
</style>
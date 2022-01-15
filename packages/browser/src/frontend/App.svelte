<script lang='ts'>
  import Menu from './Menu.svelte'
  import TabsView from './TabsView.svelte'
  import { stackStore } from './stores/stacks'
  import { navigatorStore } from './stores/navigators'
  import { mkNavigator } from './interfaces/Navigator'
  import { mkNavigatorStack } from './interfaces/Stack'
  import StackContainerView from './StackContainerView.svelte'
  import SplitView from './SplitView.svelte'

  navigatorStore.set([])

  let ns = [
    mkNavigator(),
  ]

  for (let n of ns) {
    navigatorStore.add(n)
  }

  let stack = mkNavigatorStack($navigatorStore.map(v=>v.uuid))

  stackStore.set(stack)

</script>

<main>
  <Menu></Menu>
  <SplitView type='horizontal' pos={25}>
    <TabsView slot='a' stack={$stackStore} removeOnDrag={false} addOnDrop={false}></TabsView>
    <StackContainerView slot='b' stack={$stackStore}></StackContainerView>
  </SplitView>
</main>

<style>
  main {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    overflow: hidden;
  }
</style>
<script lang='ts'>
  import Menu from './Menu.svelte'
  import TabsView from './TabsView.svelte'
  import { stackStore } from './stores/stacks'
  import { navigatorStore } from './stores/navigators'
  import { mkNavigator } from './interfaces/Navigator'
  import { mkNavigatorStack } from './interfaces/Stack'
  import StackContainerView from './StackContainerView.svelte'
import SplitView from './SplitView.svelte'

  navigatorStore.set([
    mkNavigator(),
    mkNavigator(),
    mkNavigator(),
    mkNavigator(),
    mkNavigator(),
    mkNavigator(),
  ])
  $navigatorStore[0].history.push({
    location: 'https://kettek.net',
    title: 'kettek',
    favicon: '',
  })

  $navigatorStore[4].history.push({
    location: 'https://kettek.net',
    title: 'kettek',
    favicon: '',
  })


  let stack = mkNavigatorStack($navigatorStore.filter((_,index)=>index<3).map(v=>v.uuid))
  let substack = mkNavigatorStack($navigatorStore.filter((_,index)=>index>=3).map(v=>v.uuid))
  stack.stack = substack

  stackStore.set(stack)

</script>

<main>
  <Menu></Menu>
  <SplitView type='horizontal' pos={25}>
    <TabsView slot='a' uuids={$navigatorStore.map(v=>v.uuid)}></TabsView>
    <StackContainerView slot='b' stack={$stackStore}></StackContainerView>
  </SplitView>
</main>

<style>
  main {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
  }
</style>
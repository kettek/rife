<script lang='ts'>
  import Menu from './Menu.svelte'
  import { stackStore } from './stores/stacks'
  import { navigatorStore } from './stores/navigators'
  import { mkNavigator } from './interfaces/Navigator'
  import { mkNavigatorStack } from './interfaces/Stack'
  import StackContainerView from './StackContainerView.svelte'

  navigatorStore.set([
    mkNavigator(),
    mkNavigator(),
    mkNavigator(),
    mkNavigator(),
    mkNavigator(),
    mkNavigator(),
  ])

  let stack = mkNavigatorStack($navigatorStore.filter((_,index)=>index<3).map(v=>v.uuid))
  let substack = mkNavigatorStack([])
  let substack2 = mkNavigatorStack($navigatorStore.filter((_,index)=>index>=3).map(v=>v.uuid))
  stack.stack = substack
  substack.stackDir = 'horizontal'
  substack.stack = substack2

  stackStore.set(stack)

</script>

<main>
  <Menu></Menu>
  <StackContainerView stack={$stackStore}></StackContainerView>
</main>

<style>
  main {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
  }
</style>
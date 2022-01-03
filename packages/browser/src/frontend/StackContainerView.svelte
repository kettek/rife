<script lang='ts'>
  import StackView from './StackView.svelte'

  import type { NavigatorStack } from './interfaces/Stack'
  import SplitView from './SplitView.svelte'


  export let stack: NavigatorStack
</script>

{#if !stack.stack}
  <StackView stack={stack}></StackView>
{:else}
  <SplitView type={stack.stackDir} pos={stack.stackPos}>
    <StackView slot='a' stack={stack}></StackView>
    <svelte:self stack={stack.stack} slot='b'/>
  </SplitView>
{/if}

<style>
</style>
<script lang='ts'>
  import BrowserView from "./BrowserView.svelte"
import SplitView from "./SplitView.svelte"

  export let tabs: any[] = [{}, {}]
  export let title: string = ''

  let focusedTabId: string = ''
  //$: focusedTab 

</script>

<main>
  {#if tabs.length <= 1}
    <BrowserView uuid='test'></BrowserView>
  {:else}
    <SplitView type='horizontal' pos={25}>
      <nav slot='a'>
        {#each tabs as tab}
          <button>
            {tab}
          </button>
        {/each}
      </nav>
      <BrowserView slot='b' uuid='test'></BrowserView>
    </SplitView>
  {/if}
</main>

<style>
  main {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
  }
  nav {
    display: flex;
    flex-direction: column;
  }
</style>
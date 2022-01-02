<script lang='ts'>
  import Browser from "./Browser.svelte"
  import Menu from "./Menu.svelte"
  import { tabsStore } from "./stores/tabs"

</script>

<main>
  <Menu></Menu>
  <Browser tabs={$tabsStore}></Browser>
</main>

<style>
  main {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
  }
</style>
<main>
  <nav>
    <button>left</button>
    <button>right</button>
    <button>reload</button>
    <input type='search' placeholder='https://...'/>
  </nav>
  <article>
    Current View Here
  </article>
</main>

<style>
  nav {
    display: grid;
    grid-template-columns: auto auto auto minmax(0, 1fr);
  }
</style>
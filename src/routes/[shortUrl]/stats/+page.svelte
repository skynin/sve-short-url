<script lang="ts">
	import { invalidate } from '$app/navigation';
  import type {AnswerStatType} from './+page.server'
	export let data: AnswerStatType;

  async function refresh() {
    invalidate('app:stats').catch(err => console.log(err))
  }  
</script>

<h2>Short url statistics</h2>
<p>Short url: {data.shortURL}</p>

{#if data.message }
  <p class="error-message">{data.message}</p>
{:else}
  <p>Full url: {data.fullURL}</p>
{/if}

<table>
  <thead>
    <tr>
      <th>time</th>
      <th>userAgent</th>
      <th>geoIP</th>
      <th>sourceIP</th>
      <th>host</th>      
    </tr>
  </thead>
  <tbody>
{#each data.records as record}
    <tr>
      <td>{record.time}</td>
      <td>{record.userAgent}</td>
      <td>{record.geoIP}</td>
      <td>{record.sourceIP}</td>
      <td>{record.host}</td>
    </tr>
{/each}
  </tbody>
</table>
<button on:click={() => refresh()}>Refresh</button>

<style>
  @import '../../../pages.css';
</style>
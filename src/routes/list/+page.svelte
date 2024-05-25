<h2>LIST</h2>

<script lang="ts">
  import type {PageData} from'./$types'
  import { invalidate } from '$app/navigation';
	export let data: PageData;

  async function deleteRow(hashKeyToBeDeleted: string) {
    data.list = data.list.filter(row => row.hashURL != hashKeyToBeDeleted)

    fetch('/list/' + hashKeyToBeDeleted, {
      method: 'DELETE'
    }).catch(err => console.log(err))
    //.then(res => res.json()).then(json => console.log(json)).catch(err => console.log(err))
		/*const json = await res.json()
		result = JSON.stringify(json)*/
  }

  async function refresh() {
    invalidate('app:list').catch(err => console.log(err))
    //.then(() => console.log('Refreshed list', data)).catch(err => console.log(err))
  }

</script>

<!-- pre>{JSON.stringify(data, null, 2)}</pre -->

{#if !data.success }
  <p class="error">{data.message}</p>
{/if}

<table>
  <thead>
    <tr>
      <th>HASH</th>
      <th>shortURL</th>
      <th>fullURL</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
{#each data.list as item}
    <tr>
      <td>{item.hashURL}</td>
      <td>{item.shortURL}</td>
      <td>{item.fullURL}</td>
      <td><button on:click={() => deleteRow(item.hashURL)}>X</button></td>
    </tr>
{/each}
  </tbody>
</table>
<button on:click={() => refresh()}>Refresh</button>

<style>
	.error {
		color: red;
		margin-top: -20px;
	}
</style>
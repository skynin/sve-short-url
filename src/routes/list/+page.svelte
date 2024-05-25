<h2>LIST</h2>

<script lang="ts">
  import type {PageData} from'./$types'
  import { invalidate } from '$app/navigation';
	export let data: PageData;

  async function deleteRow(hashKeyToBeDeleted: string) {
    async function thenUpdate(res: Response) {      
      const deleteAnswer = (await res.json()) as ({success: boolean, message: string})
      if (deleteAnswer.success) {
        data.list = data.list.filter(row => row.hashURL != hashKeyToBeDeleted)    
      }
      else {
        console.error(deleteAnswer.message)}
      return deleteAnswer
    }

    fetch('/list/' + hashKeyToBeDeleted, {
      method: 'DELETE'
    }).then(thenUpdate).catch(err => console.log(err))
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
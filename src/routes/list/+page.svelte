<h2>LIST</h2>

<script lang="ts">
  import type {PageData} from'./$types'
  import { invalidate } from '$app/navigation';
	export let data: PageData;

  async function deleteRow(event: Event, hashKeyToBeDeleted: string) {

    const stateButton = (state: boolean) => (event.target as HTMLButtonElement).disabled = state

    stateButton(true)

    const thenUpdate = async (res: Response) => {      
      const deleteAnswer = (await res.json()) as ({success: boolean, message: string})
      if (deleteAnswer.success) {
        data.list = data.list.filter(row => row.hashURL != hashKeyToBeDeleted)    
      }
      else {
        console.error(deleteAnswer.message)
      }

      stateButton(false)

      return deleteAnswer
    }

    fetch('/list/' + hashKeyToBeDeleted, {
      method: 'DELETE'
    }).then(thenUpdate).catch(err => console.log(err))
  }

  async function refresh() {
    invalidate('app:list').catch(err => console.log(err))
  }

</script>

{#if !data.success }
  <p class="error-message">{data.message}</p>
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
      <td><button on:click={(event) => deleteRow(event, item.hashURL)}>X</button></td>
    </tr>
{/each}
  </tbody>
</table>
<button on:click={() => refresh()}>Refresh</button>

<style>
  @import '../../pages.css';
</style>
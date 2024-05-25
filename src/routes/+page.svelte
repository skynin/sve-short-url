<script lang="ts">
	import { enhance } from '$app/forms';
	import { trimFirstSymbol } from '$lib';
	import { errorMessageInvalidURL, validateURLs, type UrlNames, type ErrUrls } from '$lib/validation';
	import type { SubmitFunction } from '@sveltejs/kit';

	//export var form: ActionData;

  var OKmessage = ''

	var validateErrors = {
		fullURL: false,
		shortURL: false,
    error: errorMessageInvalidURL
	};

	function updateValidate(urls: ErrUrls[] | undefined) {
		if (urls) {
			urls.forEach((urlResult) => {
				if (urlResult.isValid) return

				validateErrors[urlResult.urlName] = true
			})
		} else {
      validateErrors.fullURL = false
      validateErrors.shortURL = false
		}

		validateErrors = validateErrors;
	}

	const clearValidate = (event: KeyboardEvent) => {
		if (event.currentTarget instanceof HTMLInputElement) {
      OKmessage = ''
			const urlName = event.currentTarget.name as unknown as UrlNames;
			if (validateErrors[urlName] === false) return;

			validateErrors[urlName] = false;
			validateErrors = validateErrors;
		}
	};

	let saving = false;

	const submitDefault: SubmitFunction = async ({ formData, cancel }) => {
    saving = true
    updateValidate(undefined)
    OKmessage = ''
  
    // validate URLs
    function isCorrectURLs() {
      const fullURL = trimFirstSymbol(formData.get('fullURL') as string)
      const shortURL = trimFirstSymbol(formData.get('shortURL') as string)
      const arrChecks = validateURLs(fullURL, shortURL, 'invalids')

      if (arrChecks.length) {
        saving = false
        updateValidate(arrChecks)
        
        return false
      }

      return true
    }
    if (!isCorrectURLs()) {
      cancel()      
    }

		return async ({ result, update }) => {
			saving = false

			// console.log('result', result)

			if (result.type === 'failure') {
        validateErrors.error = result?.data?.error || errorMessageInvalidURL
				updateValidate(result?.data?.errUrls)    
				return
			}
      if (result.type === 'success') {
        OKmessage = result.data?.message || ''
      }			

			update()
		}
	};
</script>

<h2>Setting new short URL</h2>
<p>Set matching between full URL and short URL</p>

<form method="POST" use:enhance={submitDefault}>
	<!-- form method="POST" -->
	<input
		disabled={saving}
    aria-invalid={validateErrors.fullURL}
		type="text"
		name="fullURL"
		placeholder="full URL"
		aria-label="full URL"
		on:keydown={clearValidate}
		required
	/>
	{#if validateErrors.fullURL}
		<small class="error">{validateErrors.error}</small >
	{/if}
	<input
		disabled={saving}
    aria-invalid={validateErrors.shortURL}
		type="text"
		name="shortURL"
		placeholder="short URL"
		aria-label="short URL"
		on:keydown={clearValidate}
		required
	/>
	{#if validateErrors.shortURL}
		<small class="error">{validateErrors.error}</small >
	{/if}
	<button type="submit" disabled={saving}>{saving ? '... saving ...' : 'Save matching'}</button>
  {#if OKmessage !== ''}
  <div class="message">{@html OKmessage}</div>
  {/if}
</form>
<a href="/list">List of short URLs</a>

<style>
	.error {
		color: red;
		margin-top: -20px;
	}
  .message {
    background-color: lightgreen;
    padding: 5px;
  }
</style>

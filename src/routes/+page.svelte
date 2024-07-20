<script lang="ts">
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import { base } from '$app/paths';

	let selectedLanguage: string = '';
	let srtFile: File | null = null;
    let translatedText: string | null = null;

	const languages = [
		{ value: 'en-US', label: '영어(미국)' },
		{ value: 'ko', label: '한국어' }
	];

	const handleFilesSelect = async (event: Event) => {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			srtFile = target.files[0];
			if (srtFile) {
				console.log('선택된 파일:', srtFile.name);
				console.log('파일 사이즈', srtFile.size, 'bytes');
				const text = await srtFile.text();
				const lines = text.split('\n\n').length;
				console.log('라인 수:', lines);
				console.log('파일 내용:', text);
			}
		}
	};

	async function processFile(event: Event) {
        event.preventDefault(); // 기본 폼 제출 동작 방지

		if (srtFile && selectedLanguage) {
			const formData = new FormData();
			formData.append('file', srtFile);
			formData.append('language', selectedLanguage);

			try {
				const response = await fetch(`${base}/api/translate`, {
					method: 'POST',
					body: formData
				});
				if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = `translated-${srtFile.name}`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);


                    const text = await blob.text();
                    translatedText = text;
					console.log('번역 결과:', translatedText);

				} else {
					console.error('번역 요청 실패:', response.statusText);
				}
			} catch (error) {
				console.error('오류 발생:', error);
			}
		}
	}

	function parseSRT() {}
</script>

<div class="container mx-auto max-w-4xl p-8">
	<h1 class="h1 mb-4">AI로 .SRT 자막 번역</h1>

	<form class="card space-y-4 p-4" on:submit={processFile}>
		<div class="grid grid-cols-2 gap-4">
			<div class="file-input-wrapper">
				<FileDropzone name="file" accept=".srt" multiple={false} on:change={handleFilesSelect}>
					<svelte:fragment slot="lead">
						{#if srtFile}
							<img
								class="h-11"
								src="https://www.svgrepo.com/show/485545/upload-cicle.svg"
								alt="file upload icon"
								width="512"
								height="512"
							/>
						{:else}
							<img
								class="h-11"
								src="https://www.svgrepo.com/show/485545/upload-cicle.svg"
								alt="file upload icon"
								width="512"
								height="512"
							/>
						{/if}
					</svelte:fragment>

					<svelte:fragment slot="message">
						{#if srtFile}
							<p class="text-gray-500">선택된 파일: {srtFile.name}</p>
						{:else}
							<p class="text-gray-500">파일을 업로드하거나 여기로 드래그하세요.</p>
						{/if}
					</svelte:fragment>
					<svelte:fragment slot="meta">
						{#if srtFile}
							<!-- <p class="text-gray-500">라인 수: {srtFile.text().split('\n\n').length}</p> -->
							<p class="text-gray-500">파일 크기: {srtFile.size}</p>
						{:else}
							<p class="text-gray-500">.srt 파일을 업로드하세요.</p>
						{/if}
					</svelte:fragment>
				</FileDropzone>
			</div>

			<select
				id="language"
				bind:value={selectedLanguage}
				size="3"
				name="language"
				class="select"
				required
			>
				{#each languages as lang}
					<option value={lang.value}>{lang.label}</option>
				{/each}
			</select>
		</div>
		<button
			type="submit"
			class="btn-primary variant-filled btn"
			disabled={!srtFile || !selectedLanguage}>번역하기</button
		>
	</form>

    {#if translatedText}
        <div class="card p-4 mt-4">
            <h2 class="h2">번역 결과</h2>
            <p>{translatedText}</p>
        </div>
    {/if}
</div>

<style>
	.file-input-wrapper {
		border: 2px dashed var(--color-primary-500);
		padding: 1rem;
		text-align: center;
		cursor: pointer;
	}
</style>

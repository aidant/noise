<script lang="ts">
  import { colors } from '$lib/actions/colors'
  import { status$ } from '$lib/bluos'
  import { writable } from 'svelte/store'
  import '../app.css'

  const palette = writable({ primary: '#000000', dark: false })

  const dateFormatter = new Intl.DateTimeFormat(navigator.language, {
    minute: '2-digit',
    second: '2-digit',
  })

  const formatTime = (seconds: number) => seconds && dateFormatter.format(new Date(seconds * 1000))

  $: status = $status$
  $: {
    if ($palette.dark) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
  }
</script>

<main
  class="flex h-full flex-col justify-around dark:text-white"
  style="background-color: {$palette.primary};"
>
  <div class="flex flex-row justify-around">
    <img crossorigin="anonymous" use:colors="{{ colors: palette }}" alt="" src={status?.playback?.image} class="h-auto w-2/6" />

    <div class="flex flex-col justify-center font-serif text-7xl">
      <h1>{status?.playback?.song}</h1>
      <h2>on {status?.playback?.album}</h2>
      <h3>by {status?.playback?.artist}</h3>
    </div>
  </div>

  <div class="flex flex-row justify-between w-10/12 mx-auto items-center gap-2">
    {formatTime(status?.playback?.progress * status?.playback?.duration)}
    <progress
      class="h-1 w-full overflow-hidden bg-black [&::-webkit-progress-bar]:bg-black [&::-webkit-progress-value]:bg-white [&::-moz-progress-bar]:bg-white darkbg-white dark:[&::-webkit-progress-bar]:bg-white dark:[&::-webkit-progress-value]:bg-black dark:[&::-moz-progress-bar]:bg-black"
      value={status?.playback?.progress || 0}
      max="1"
    />
    {formatTime(status?.playback?.duration)}
  </div>
</main>

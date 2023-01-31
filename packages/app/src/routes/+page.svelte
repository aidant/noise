<script lang="ts">
  import '../app.css'
  import { status$ } from '$lib/bluos'

  const dateFormatter = new Intl.DateTimeFormat(navigator.language, {
    minute: '2-digit',
    second: '2-digit',
  })

  const formatTime = (seconds: number) => seconds && dateFormatter.format(new Date(seconds * 1000))

  $: status = $status$
</script>

<main class="flex h-full flex-col justify-around">
  <div class="flex flex-row justify-around">
    <img alt="" src={status?.playback?.image} class="h-auto w-2/6" />

    <div class="flex flex-col justify-center">
      <h1>{status?.playback?.song}</h1>
      <h2>on {status?.playback?.album}</h2>
      <h3>by {status?.playback?.artist}</h3>
    </div>
  </div>

  <div class="flex flex-row justify-between w-10/12 mx-auto items-center gap-2">
    {formatTime(status?.playback?.progress * status?.playback?.duration)}
    <progress
      class="h-1 w-full overflow-hidden bg-slate-100 [&::-webkit-progress-bar]:bg-slate-100 [&::-webkit-progress-value]:bg-emerald-500 [&::-moz-progress-bar]:bg-emerald-500"
      value={status?.playback?.progress || 0}
      max="1"
    />
    {formatTime(status?.playback?.duration)}
  </div>
</main>

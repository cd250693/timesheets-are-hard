<script lang="ts">
    // @ts-ignore
    import { JsonView } from '@zerodevx/svelte-json-view';
    import DateInput from '../components/DateInput.svelte';
    import Entry from '../components/Entry.svelte';
    import { currentDate, timeEntries } from '../stores';

    function addTestEntry() {
        // get a random time in 24 hour time, but only by 15 min increments
        const randomHour = Math.round(Math.random() * 24)
            .toString()
            .padStart(2, '0');
        const randomMinute = (Math.round(Math.random() * 4) * 15).toString().padStart(2, '0');
        timeEntries.addEntry('Test', `${randomHour}:${randomMinute}`);
    }

</script>

<h1>Timesheeting is hard...</h1>
<div>
    <DateInput bind:dateValue={$currentDate} />
    <button on:click={timeEntries.resetToTestData}>Reset</button>
    <button on:click={addTestEntry}>Add test entry</button>
</div>
<section>
    {#each $timeEntries as entry (entry.id)}
        <Entry {entry} />
    {/each}
</section>

<code><JsonView json={$timeEntries} /></code>

<style>
    /* global styling */
    :global(html) {
        min-height: 100%;
    }
    :global(body) {
        color: #222;
        background: #fff;
        font: 100% system-ui;
        margin: 0 10%;
    }

    @media (prefers-color-scheme: dark) {
        :global(body) {
            background-image: linear-gradient(
                0deg,
                hsl(202deg 100% 14%) 0%,
                hsl(198deg 100% 17%) 20%,
                hsl(193deg 100% 19%) 40%,
                hsl(189deg 100% 21%) 59%,
                hsl(183deg 100% 22%) 79%,
                hsl(177deg 100% 24%) 100%
            );
            background-attachment: fixed;
            color: #d7d7d7;
        }
    }
</style>

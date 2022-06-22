<script lang="ts">
    import { slide } from 'svelte/transition';
    import type { TimeEntry } from '../stores';
    import { timeEntries } from '../stores';
    import Svg from './SVG.svelte';

    export let entry: TimeEntry;
    let editing = false;

    function focus(el: HTMLElement) {
        el.focus();
    }

    function handleSave() {
        timeEntries.updateEntry(entry.id, { label: entry.label, startTime: entry.startTime });
        editing = false;
    }

    function handleDelete() {
        timeEntries.removeEntry(entry.id);
        editing = false;
    }
</script>

<div class="row" transition:slide>
    <label>
        <input
            type="checkbox"
            bind:checked={entry.done}
            on:input={(e) => timeEntries.updateEntry(entry.id, { done: e.currentTarget.checked })}
        />
        <span class="data">
            {#if editing}
                <form on:submit={handleSave}>
                    <input bind:value={entry.startTime} use:focus />:
                    <input bind:value={entry.label} />
                </form>
            {:else}
                {entry.startTime}: {entry.label}
            {/if}
        </span>
    </label>
    <span>
        {#if editing}
            <span class="icon" on:click={handleSave}><Svg type="save" /></span>
        {:else}
            <span class="icon" on:click={() => (editing = true)}><Svg type="edit" /></span>
        {/if}
        <span class="icon" on:click={handleDelete}><Svg type="delete" /></span>
    </span>
</div>

<style>
    div.row {
        display: flex;
        width: 80%;
        max-width: 500px;
        justify-content: space-between;
    }
    div.row:hover {
            background: rgba(0, 0, 0, 0.25);
    }
    form {
        display: inline-flex;
    }
    span.icon {
        position: relative;
        display: inline-block;
        box-sizing: border-box;
    }
</style>

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

    function startEdit() {
        editing = true;
    }

    function handleSave() {
        timeEntries.updateEntry(entry.id, { label: entry.label, startTime: entry.startTime });
        editing = false;
    }

    function handleFocusOut(event: FocusEvent) {
        debugger();
    }

    function handleDelete() {
        timeEntries.removeEntry(entry.id);
        editing = false;
    }
</script>

<div class="row" transition:slide>
    <span>
        <input
            type="checkbox"
            bind:checked={entry.done}
            on:input={(e) => timeEntries.updateEntry(entry.id, { done: e.currentTarget.checked })}
        />
        <span class="data">
            {#if editing}
                <form on:submit={handleSave} on:focusout={handleFocusOut}>
                    <input type="time" bind:value={entry.startTime} use:focus />
                    <input bind:value={entry.label} size="15" />
                </form>
            {:else}
                <span on:dblclick={startEdit}>{entry.startTime} - {entry.label}</span>
            {/if}
        </span>
    </span>
    <span>
        {#if editing}
            <span class="icon" on:click={handleSave}><Svg type="save" /></span>
        {:else}
            <span class="icon" on:click={startEdit}><Svg type="edit" /></span>
        {/if}
        <span class="icon" on:click={handleDelete}><Svg type="close" /></span>
    </span>
</div>

<style>
    div.row {
        display: flex;
        max-width: 500px;
        justify-content: space-between;
        padding-top: 5px;
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
    .data input {
        width: fit-content;
    }
    .data input[type='time'] {
        margin-right: 5px;
    }
</style>

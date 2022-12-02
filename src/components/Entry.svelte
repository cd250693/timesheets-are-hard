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
        timeEntries.updateEntry(entry.id, { text: entry.text, startTime: entry.startTime });
        editing = false;
    }

    function handleFocusOut(event: FocusEvent) {
        // save the form if we are no longer focusing on an element within this form
        const form = document.forms.namedItem(`entry-${entry.id}`);
        if (form && !form.contains(event.relatedTarget as Node)) {
            form.requestSubmit();
        }
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
                <form
                    name="entry-{entry.id}"
                    on:submit|preventDefault={handleSave}
                    on:focusout|preventDefault={handleFocusOut}
                >
                    <input required type="time" step="900" bind:value={entry.startTime} use:focus />
                    <input required bind:value={entry.text} size="15" />
                </form>
            {:else}
                <span on:click={startEdit}
                    >{entry.startTime} - <span class="tag">{entry.tag || ''}</span>
                    {entry.label}</span
                >
            {/if}
        </span>
    </span>
    <span>
        <span class="icon" on:click={handleDelete}><Svg type="close" /></span>
    </span>
</div>

<style>
    div.row {
        display: flex;
        max-width: 500px;
        justify-content: space-between;
        padding-top: 5px;
        transition: background 0.1s;
    }
    div.row:hover {
        background: rgba(0, 0, 0, 0.25);
    }
    div.row:hover span.icon {
        opacity: 1;
    }
    form {
        display: inline-flex;
    }
    span.icon {
        position: relative;
        display: inline-block;
        box-sizing: border-box;
        opacity: 0;
        transition: opacity 0.1s;
    }
    .data input {
        width: fit-content;
    }
    .data input[type='time'] {
        margin-right: 5px;
    }
    .tag {
        color: rgb(246, 251, 56);
    }
</style>

<script lang="ts">
    // @ts-ignore
    import { JsonView } from '@zerodevx/svelte-json-view';
    // default height to set at
    export let height = 150;
    const initalHeight = height;
    // keep track of the height of the window
    let windowHeight: number;
    // tracking or the
    let codeHeight: number;
    const codePadding = 10;
    // data to show
    export let data: any;

    // functionality to allow expanding/contracting the code
    let resizing = false;
    let start: number;
    let initial: number;

    function autoResize() {
        let maxHeight = windowHeight - 50;
        if (height === codeHeight + codePadding || height === maxHeight) {
            // already showing all the code or at max height, instead revert to initialHeight
            height = initalHeight;
        } else {
            // show the full code (or try to), with a padding to ensure the bottom isn't cut off
            let newHeight = Math.max(initalHeight, codeHeight + codePadding);
            height = Math.min(newHeight, windowHeight - 50);
        }
    }

    function resize(event: MouseEvent) {
        if (!resizing) return;

        if (resizing) {
            let maxHeight = windowHeight - 50;
            let delta = start - event.pageY;
            height = Math.min(initial + delta, maxHeight);
        }
    }

    function startResize(event: MouseEvent) {
        resizing = true;
        start = event.pageY;
        initial = height;
    }

    function stopResize() {
        resizing = false;
    }
</script>

<svelte:window on:mouseup={stopResize} on:mousemove={resize} bind:innerHeight={windowHeight} />

<div class="debug-code" style="height: {height}px">
    <div class="resize-handle" on:mousedown={startResize} on:dblclick={autoResize} />
    <div class="data" bind:clientHeight={codeHeight}><JsonView json={data} /></div>
</div>

<style>
    .debug-code {
        left: 0;
        bottom: 0;
        position: fixed;
        width: 100%;
        overflow: auto;
        background: #00000054;
    }

    div.data {
        font-family: monospace;
        /* set css variables */
        --nodeColor: #d7d7d7;
    }

    .resize-handle {
        background: #00000054;
        min-height: 20px;
        cursor: ns-resize;
        position: fixed;
        min-width: 100%;
        margin-top: -20px;
    }
    .resize-handle:hover {
        background: #a1a1a154;
    }
</style>

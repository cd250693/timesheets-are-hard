<script lang="ts">
    // @ts-ignore
    import { JsonView } from '@zerodevx/svelte-json-view';
    // default height to set at
    export let height = 150;
    const initalHeight = height;
    // data to show
    export let data: any;

    // functionality to allow expanding/contracting the code
    let expanding = false;
    let start: number;
    let initial: number;

    function resetHeight() {
        height = initalHeight;
    }

    function expand(event: MouseEvent) {
        if (!expanding) return;

        if (expanding) {
            console.log('expanding up', event);
            let delta = start - event.pageY;
            height = initial + delta;
        }
    }

    function startExpand(event: MouseEvent) {
        expanding = true;
        console.log(event);
        start = event.pageY;
        initial = height;
    }

    function stopExpand() {
        expanding = false;
    }
</script>

<svelte:window on:mouseup={stopExpand} on:mousemove={expand} />

<div class="debug-code" style="height: {height}px">
    <div class="resize-handle" on:mousedown={startExpand} on:dblclick={resetHeight}/>
    <code><JsonView json={data} /></code>
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

    code {
        overflow: auto;
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

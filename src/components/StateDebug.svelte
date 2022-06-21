<script lang="ts">
    // @ts-ignore
    import { JsonView } from '@zerodevx/svelte-json-view';
    // default height to set at
    export let height = 150;
    const initalHeight = height;
    // data to show
    export let data: any;

    // functionality to allow expanding/contracting the code
    let expanding: string | null = null;
    let start: number;
    let initial: number;

    function resetHeight() {
        height = initalHeight;
    }

    function expand(event: MouseEvent) {
        if (!expanding) return;

        if (expanding === 'up') {
            console.log('expanding up', event);
            let delta = start - event.pageY;
            height = initial + delta;
        } else if (expanding === 'down') {
            // pass
        }
    }

    function startExpand(type: typeof expanding, event: MouseEvent) {
        expanding = type;
        console.log(event);
        start = event.pageY;
        initial = height;
    }

    function stopExpand() {
        expanding = null;
    }
</script>

<svelte:window on:mouseup={stopExpand} on:mousemove={expand} />

<div class="debug-code" style="height: {height}px">
    <div class="resize-handle" on:mousedown={startExpand.bind(this, 'up')} on:dblclick={resetHeight}/>
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
        padding: 10px;
        overflow: auto;
    }

    .resize-handle {
        background-color: rgb(245, 255, 192);
        min-height: 5px;
        cursor: ns-resize;
        position: fixed;
        min-width: 100%;
        margin-top: -5px;
    }
</style>

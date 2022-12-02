<script lang="ts">
    const now = new Date();

    let dateString: string;
    let month = '' + (now.getMonth() + 1);
    let day = '' + now.getDate();
    let year = now.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    dateString = [year, month, day].join('-');

    export let dateValue: Date = new Date(dateString);
    $: dateValue = new Date(dateString);
</script>

<label>
    <input type="date" bind:value={dateString} />
</label>

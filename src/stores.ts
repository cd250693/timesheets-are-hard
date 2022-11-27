import { browser } from '$app/env';
import { get, writable } from "svelte/store";


export const currentDate = writable(new Date());

export type TimeEntry = {
    id: number,
    label: string,
    startTime: string,
    done: boolean
}


function createTimeEntries() {
    // store that handles the logic for keeping track of all the delicious time entries
    const { subscribe, set, update } = writable<TimeEntry[]>([]);

    /**
     * Sorts the given list of TimeEntry by the startTime
     * @param entries List of entries to sort
     */
    function sort_entries(entries: TimeEntry[]): TimeEntry[] {
        return entries.sort((a, b) => {
            let aTime = a.startTime.split(":", 2)
            let bTime = b.startTime.split(":", 2)

            let diff: number = Number(aTime[0]) - Number(bTime[0])

            // if they are the same hour, set the diff to the minutes
            if (diff === 0) {
                diff = Number(aTime[1]) - Number(bTime[1])
            }
            return diff
        })
    }

    /**
     * Adds a new entry to the existing list of entries
     * @param label the label of the entry
     * @param startTime the time it starts
     * @param done whether the entry is done or not
     */
    function addEntry(label: string, startTime: string, done = false) {
        console.log("adding entry")
        update(entries => {
            let newId = 0;
            entries.forEach(item => newId = Math.max(newId, item.id));
            newId += 1;
            const newEntry = { id: newId, label, startTime, done }
            entries.push(newEntry);
            return sort_entries(entries);
        })
        save()
    }

    function updateEntry(id: number, data: { label?: string, startTime?: string, done?: boolean }) {
        console.log(`update entry ${id}`, data);
        update(entries => {
            const updateIndex = entries.findIndex(e => e.id === id)
            // will return -1 if it doesn't find the value
            if (updateIndex > -1) {
                const entry = entries[updateIndex]
                entry.label = data.label !== undefined ? data.label : entry.label;
                entry.startTime = data.startTime !== undefined ? data.startTime : entry.startTime;
                entry.done = data.done !== undefined ? data.done : entry.done;
                entries[updateIndex] = entry
            }

            console.log(entries)
            return sort_entries(entries)
        })
        save()
    }

    function removeEntry(id: number) {
        console.log(`remove entry ${id}`)
        update(entries => {
            return entries.filter(e => e.id !== id);
        })
        save()
    }

    function _get_storage_key() {
        const value = get(currentDate);
        const [day, year] = [value.getDate(), value.getFullYear()];
        let month = value.getMonth();
        month += 1; // month is zero indexed...

        return ["time-entries", year, month, day].join("-");
    }

    // Saves the data to local storage
    function save() {
        if (browser) {
            const value = get(timeEntries)
            console.log(`saving ${value.length} entries`);
            localStorage.setItem(_get_storage_key(), JSON.stringify(value))
        } else {
            console.error("not running in browser, save unavailable");
        }
    }

    // loads data from local storage
    function load() {
        console.log("loading...")
        if (browser) {
            const value = localStorage.getItem(_get_storage_key());
            if (value) {
                const entries = JSON.parse(value);
                set(entries);
                console.log(`loaded ${entries.length} entries`);
            } else {
                console.log("no entries found");
                set([])
            }
        } else {
            console.error("not running in browser, load unavailable");
        }
    }

    function resetToTestData() {
        console.log("clearing and resetting to test data")
        set([]);
        const defaultEntries = [
            { label: 'Coding some things', startTime: '09:00', done: false },
            { label: 'stuff', startTime: '12:00', done: true },
            { label: 'meetings', startTime: '14:00', done: false },
            { label: 'stuff', startTime: '15:30', done: true }
        ];
        console.log("populating with default data", defaultEntries)
        defaultEntries.forEach((item) => {
            addEntry(item.label, item.startTime, item.done)
        })
    }

    // load from the local storage
    load()
    // subscribe the load function to any changes to the date
    currentDate.subscribe(load)

    return {
        subscribe,
        addEntry,
        updateEntry,
        removeEntry,
        resetToTestData,
    }
}

export const timeEntries = createTimeEntries();

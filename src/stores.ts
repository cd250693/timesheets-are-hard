import { browser } from '$app/environment';
import { get, writable } from 'svelte/store';

export const currentDate = writable(new Date());

export type TimeEntry = {
    id: number; // unique id for the entry
    text: string; // the raw text of this time entry
    tag?: string; // the extracted tag of this time entry
    label: string; // the remaining label for this entry
    startTime: string; // the time this entry starts
    done: boolean; // whether this entry has been completed or not
};

function createTimeEntries() {
    // store that handles the logic for keeping track of all the delicious time entries
    const { subscribe, set, update } = writable<TimeEntry[]>([]);

    /**
     * Sorts the given list of TimeEntry by the startTime
     * @param entries List of entries to sort
     */
    function sort_entries(entries: TimeEntry[]): TimeEntry[] {
        return entries.sort((a, b) => {
            const aTime = a.startTime.split(':', 2);
            const bTime = b.startTime.split(':', 2);

            let diff: number = Number(aTime[0]) - Number(bTime[0]);

            // if they are the same hour, set the diff to the minutes
            if (diff === 0) {
                diff = Number(aTime[1]) - Number(bTime[1]);
            }
            return diff;
        });
    }

    /**
     * Extract any tag and a label from a raw string
     */
    function process_text(text: string): { tag?: string; label: string } {
        let tag, label;

        if (text.startsWith('#')) {
            const index = text.indexOf(' ');
            if (index > -1) {
                tag = text.substring(0, index);
                label = text.substring(index + 1);
            } else {
                tag = text;
                label = '';
            }
        } else {
            label = text;
        }

        return { tag, label };
    }

    /**
     * Adds a new entry to the existing list of entries
     * @param text the full text of the entry. Will extract a tag if first word is #
     * @param startTime the time it starts
     * @param done whether the entry is done or not
     */
    function addEntry(text: string, startTime: string, done = false) {
        console.log('adding entry');
        update((entries) => {
            let newId = 0;
            entries.forEach((item) => (newId = Math.max(newId, item.id)));
            newId += 1;
            const newEntry = { id: newId, text, startTime, done, ...process_text(text) };
            entries.push(newEntry);
            return sort_entries(entries);
        });
        save();
    }

    function updateEntry(id: number, data: { text?: string; startTime?: string; done?: boolean }) {
        console.log(`update entry ${id}`, data);
        update((entries) => {
            const updateIndex = entries.findIndex((e) => e.id === id);
            // will return -1 if it doesn't find the value
            if (updateIndex > -1) {
                const entry = entries[updateIndex];

                if (data.text !== undefined) {
                    entry.text = data.text;
                    const processed = process_text(data.text);
                    entry.tag = processed.tag;
                    entry.label = processed.label;
                }
                entry.startTime = data.startTime !== undefined ? data.startTime : entry.startTime;
                entry.done = data.done !== undefined ? data.done : entry.done;
                entries[updateIndex] = entry;
            }

            console.log(entries);
            return sort_entries(entries);
        });
        save();
    }

    function removeEntry(id: number) {
        console.log(`remove entry ${id}`);
        update((entries) => {
            return entries.filter((e) => e.id !== id);
        });
        save();
    }

    function _get_storage_key() {
        const value = get(currentDate);
        const [day, year] = [value.getDate(), value.getFullYear()];
        let month = value.getMonth();
        month += 1; // month is zero indexed...

        return ['time-entries', year, month, day].join('-');
    }

    // Saves the data to local storage
    function save() {
        if (browser) {
            const entries = get(timeEntries);
            console.log(`saving ${entries.length} entries`);
            const value: { startTime: string; text: string; done: boolean }[] = [];
            entries.forEach((entry) => {
                value.push({
                    startTime: entry.startTime,
                    text: entry.text,
                    done: entry.done
                });
            });
            localStorage.setItem(_get_storage_key(), JSON.stringify(value));
        } else {
            console.error('not running in browser, save unavailable');
        }
    }

    // loads data from local storage
    function load() {
        console.log('loading...');
        if (browser) {
            const value = localStorage.getItem(_get_storage_key());
            if (value) {
                const entries: TimeEntry[] = [];
                const data = JSON.parse(value);
                if (Array.isArray(data)) {
                    data.forEach((entry, index) => {
                        entries.push({
                            id: index,
                            text: entry.text.toString(),
                            startTime: entry.startTime.toString(),
                            done: entry.done,
                            ...process_text(entry.text)
                        });
                    });
                }
                set(entries);
                console.log(`loaded ${entries.length} entries`);
            } else {
                console.log('no entries found');
                set([]);
            }
        } else {
            console.error('not running in browser, load unavailable');
        }
    }

    function resetToTestData() {
        console.log('clearing and resetting to test data');
        set([]);
        const defaultEntries = [
            { text: '#tag Coding some things', startTime: '09:00', done: false },
            { text: '#stuff', startTime: '12:00', done: true },
            { text: 'meetings', startTime: '14:00', done: false },
            { text: 'stuff', startTime: '15:30', done: true }
        ];
        console.log('populating with default data', defaultEntries);
        defaultEntries.forEach((item) => {
            addEntry(item.text, item.startTime, item.done);
        });
    }

    // load from the local storage
    load();
    // subscribe the load function to any changes to the date
    currentDate.subscribe(load);

    return {
        subscribe,
        addEntry,
        updateEntry,
        removeEntry,
        resetToTestData
    };
}

export const timeEntries = createTimeEntries();

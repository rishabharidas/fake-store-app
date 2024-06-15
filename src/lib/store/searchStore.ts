import { writable } from 'svelte/store';

export const searchStore = writable({
    searchValue: '',
    searchItems: () => {} // Placeholder for the search function
});

// Update the store to include the actual search function
export function setSearchFunction(fn) {
    searchStore.update(store => ({
        ...store,
        searchItems: fn
    }));
}
export interface LibraryList {
  name: string;
  slugs: string[];
  isPrivate: boolean;
}

const DEFAULT_LISTS = [{ name: 'Reading list', slugs: [], isPrivate: true }];

export function getLibraryLists(): LibraryList[] {
  if (typeof window === 'undefined') return DEFAULT_LISTS;
  
  const saved = localStorage.getItem('library_lists');
  if (saved) {
    try {
      return JSON.parse(saved) as LibraryList[];
    } catch {
      return DEFAULT_LISTS;
    }
  }

  // Fallback / migration from legacy single list
  const legacySaved = localStorage.getItem('bookmarked_posts');
  let legacySlugs: string[] = [];
  if (legacySaved) {
    try {
      legacySlugs = JSON.parse(legacySaved) as string[];
    } catch {
      legacySlugs = [];
    }
  }

  const initialLists = [
    { name: 'Reading list', slugs: legacySlugs, isPrivate: true },
  ];
  localStorage.setItem('library_lists', JSON.stringify(initialLists));
  return initialLists;
}

export function saveLibraryLists(lists: LibraryList[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('library_lists', JSON.stringify(lists));
  
  // Also keep legacy key synced for compatibility
  const readingList = lists.find((l) => l.name === 'Reading list');
  if (readingList) {
    localStorage.setItem('bookmarked_posts', JSON.stringify(readingList.slugs));
  }

  window.dispatchEvent(new Event('bookmarks-updated'));
}

export function togglePostInList(listName: string, slug: string): boolean {
  const lists = getLibraryLists();
  let isAdded = false;
  const updated = lists.map((list) => {
    if (list.name === listName) {
      const exists = list.slugs.includes(slug);
      if (exists) {
        list.slugs = list.slugs.filter((s) => s !== slug);
        isAdded = false;
      } else {
        list.slugs.push(slug);
        isAdded = true;
      }
    }
    return list;
  });
  saveLibraryLists(updated);
  return isAdded;
}

export function createNewList(name: string, isPrivate = false): LibraryList[] {
  const lists = getLibraryLists();
  if (lists.some((l) => l.name.toLowerCase() === name.toLowerCase())) {
    return lists; // list already exists
  }
  const newList: LibraryList = { name, slugs: [], isPrivate };
  const updated = [...lists, newList];
  saveLibraryLists(updated);
  return updated;
}

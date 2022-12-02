function deepCopyArray<Type>(value: Type[]) {
    const copy: Type[] = [];

    value.forEach((item) => {
        copy.push({ ...item });
    });

    return copy;
}

import { wordList } from './wordlist';

function getRandomWords(numWords: number): string[] {
    const words = [];
    for (let i = 0; i < numWords; i++) {
        words.push(wordList[Math.floor(Math.random() * wordList.length)]);
    }
    return words;
}

export { deepCopyArray, getRandomWords };

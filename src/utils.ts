function deepCopyArray<Type>(value: Type[]) {
    const copy: Type[] = [];

    value.forEach((item) => {
        copy.push({ ...item });
    });

    return copy;
}

export { deepCopyArray };

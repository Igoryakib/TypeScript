const saveData = (key: string, data: number[]): void => {
    localStorage.setItem(key, JSON.stringify(data));
};

const getData = (key: string): number[] => {
    const arrayId = JSON.parse(localStorage.getItem(key) as string);
    return arrayId.map((item: string) => +item);
};

export {saveData, getData};
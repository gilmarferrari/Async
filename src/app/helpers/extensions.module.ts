export module Extensions {
    
    export function distinct<T, K>(list: T[], getKey: (item: T) => K) {
        return list.map(getKey).filter((value, index, self) => self.indexOf(value) === index && ![null, undefined].includes(value));
    }
}
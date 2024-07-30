export function sortNumerically(arr: any[], prop = 'id') {
    arr.sort((a, b) => { return parseInt(a[prop]) - parseInt(b[prop]) })
}
export function sortAlphabetically(arr: any[], prop: keyof typeof arr) {
    arr.sort((a: any, b: any) => a[prop].localeCompare(b[prop]))
}
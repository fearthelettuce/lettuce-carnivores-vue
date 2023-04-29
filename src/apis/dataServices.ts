import mockPlantData from './mockPlantData.json'


export function getSearchResults() {
    let results
    try {
        const data = JSON.parse(JSON.stringify(mockPlantData))
        results = data;
    } catch (error) {
        console.log(error)
        return
    }

    return results
}
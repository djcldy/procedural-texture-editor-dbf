import { presets } from './facade/presets.js';







function assignRandomFacades(specimen){

    specimen.facades = []

    Object.values(presets).forEach(category => {
        Object.values(category).forEach(o => {
            specimen.facades = [].push(ParseRequest(JSON.stringify(o)))
        })

    })


    return specimen

}





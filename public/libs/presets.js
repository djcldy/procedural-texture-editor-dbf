let obj = {


    'residential': {},
    'office': {},
    'institutional': {},
    'recreational': {},
    'commercial': {},
    'industrial': {},

}


obj['office']['90'] = {

    "name": "office-90%",
    "cellWidth": 1.875,
    "moduleWidth": 7.5,
    "horizontalGrid": "[0, 0.25, 0.5, 0.75, 1]",
    "bumpMap": "[0, 0, 100, 150, 200]",
    "alphaMap": "[155, 255, 255, 255]",
    "rules": [
        "CurtainWall('#b8d7e1')",
        "MullionVertical({ color: 'white', width: 2, start: 0, end: 1 })",
        "MullionHorizontal({ color: 'white', width: 2, start: 0, end: 1 })",
        "MullionHorizontal({ color: 'white', width: 4, start: 0.1, end: 0.9 })",
    ]
}

obj['office']['80'] = {

    "name": "office-80%",
    "cellWidth": 1.5,
    "moduleWidth": 6,
    "horizontalGrid": "[0, 0.2, 1]",
    "bumpMap": "[0, 0, 50, 50]",
    "alphaMap": "[155, 255, 255, 255, 255]",
    "rules": [
        "CurtainWall('#b8d7e1')",
        "Replace({ type: 'row', elements: [0], component: 'white' })",
        "drawVerticals",
        "drawHorizontals"
    ]
}

obj['office']['60'] = {

    "name": "office-60%",
    "cellWidth": 3,
    "moduleWidth": 6,
    "horizontalGrid": "[0, 0.2, 1]",
    "bumpMap": "[0, 0, 50, 50]",
    "alphaMap": "[155, 255, 255, 255, 255]",
    "rules": [
        "CurtainWall('#b8d7e1')",
        "Replace({ type: 'row', elements: [0], component: 'silver' })",
        "MullionVertical({ color: 'grey', width: 20, start: 0.2, end: 1 })",
        "drawVerticals",
        "drawHorizontals"
    ]
}

obj['office']['50'] = {

    "name": "office-50%",
    "cellWidth": 1.5,
    "moduleWidth": 6,
    "horizontalGrid": "[0, 0.2, 1]",
    "bumpMap": "[0, 0, 50, 50]",
    "alphaMap": "[155, 255, 255, 255, 255]",
    "rules": [
        "CurtainWall('#b8d7e1')",
        "Replace({ type: 'row', elements: [0], component: 'silver' })",
        "MullionVertical({ color: 'grey', width: 20, start: 0.2, end: 1 })",
        "drawVerticals",
        "drawHorizontals"
    ]
}


obj['office']['30'] = {

    "name": "office-30%",
    "cellWidth": 1,
    "moduleWidth": 8,
    "horizontalGrid": " [0, 0.25, 0.5, 0.75, 1]",
    "bumpMap": "[0, 0, 100, 100]",
    "alphaMap": "[200, 255, 255, 255]",
    "rules": [
        "CurtainWall('#b8d7e1')",
        "Replace({ type: 'checkers_a', elements: [0, 2], component: 'split' }, ['white', 'grey'])",
        "Replace({ type: 'checkers_b', elements: [1, 3], component: 'split' }, ['#b8d7e1', 'grey'])",
        "drawVerticals",
        "drawHorizontals",
    ]
}


obj['office']['20'] = {

    "name": "office-20%",
    "cellWidth": 1,
    "moduleWidth": 8,
    "horizontalGrid": " [0, 1]",
    "bumpMap": "[0, 100]",
    "alphaMap": "[200, 255]",
    "rules": [
        "CurtainWall('grey')",
        "drawVerticals",
        "drawHorizontals",
    ]
}


// 



obj['residential']['90'] = {

    "name": "residential-90%",
    "cellWidth": 1.5,
    "moduleWidth": 7.5,
    "horizontalGrid": " [0, 0.2, 0.8, 1]",
    "bumpMap": "[0, 0, 100, 150, 200]",
    "alphaMap": "[155, 255, 255, 255]",
    "rules": [
        "CurtainWall('#eaf7fe')",
        "MullionVertical({ color: '#5b5d58', width: 1, start: 0.2, end: 0.8 })",
        "Replace({ type: 'row', elements: [0, 2], component: '#c5c5c5' })",
        "Frame({ color: '#5b5d58', width: 4, x1: 0, y1: 0.2, x2: 1, y2: 0.8 })",
        "Horizontal({ color: '#5b5d58', width: 6, t: 0.8 })"
    ]
}

obj['residential']['80'] = {

    "name": "residential-80%",
    "cellWidth": 3,
    "moduleWidth": 9,
    "horizontalGrid": " [0, 1]",
    "bumpMap": "[0, 0, 100, 150, 200]",
    "alphaMap": "[255, 155, 155]",
    "rules": [
        "Background('grey')",
        "PunchWindow({ color: '#5b5d58', top: 0.2, bottom: 0.2, left: 0.2, right: 0.2 })",
        "PunchMullion({ color: 'black', width: 2, subDiv: 4, top: 0.2, bottom: 0.2, left: 0.2, right: 0.2 })"
    ]
}


obj['residential']['60'] = {

    "name": "residential-60%",
    "cellWidth": 3,
    "moduleWidth": 9,
    "horizontalGrid": " [0, 1]",
    "bumpMap": "[0, 0, 100, 150, 200]",
    "alphaMap": "[255, 155, 155]",
    "rules": [
        "Background('white')",
        "PunchWindow({ color: '#5b5d58', top: 0.2, bottom: 0.2, left: 0.25, right: 0.25 })",
        "PunchMullion({ color: 'black', width: 2, subDiv: 3, top: 0.2, bottom: 0.2, left: 0.25, right: 0.25 })"
    ]
}
obj['residential']['50'] = {

    "name": "residential-50%",
    "cellWidth": 3,
    "moduleWidth": 9,
    "horizontalGrid": " [0, 1]",
    "bumpMap": "[0, 0, 100, 150, 200]",
    "alphaMap": "[255, 155, 155]",
    "rules": [
        "Background('white')",
        "PunchWindow({ color: '#5b5d58', top: 0.2, bottom: 0.2, left: 0.3, right: 0.3  })",
        "PunchMullion({ color: 'black', width: 2, subDiv: 3, top: 0.2, bottom: 0.2, left: 0.3, right: 0.3 })"
    ]
}

obj['residential']['30'] = {

    "name": "residential-30%",
    "cellWidth": 3,
    "moduleWidth": 9,
    "horizontalGrid": " [0, 1]",
    "bumpMap": "[0, 0, 100, 150, 200]",
    "alphaMap": "[255, 155, 155]",
    "rules": [
        "Background('white')",
        "PunchWindow({ color: '#5b5d58', top: 0.2, bottom: 0.3, left: 0.35, right: 0.35, repeat: true })",
        "PunchMullion({ color: 'black', width: 2, subDiv: 3, top: 0.2, bottom: 0.3, left: 0.35, right: 0.35, repeat: true })"
    ]
}
obj['residential']['20'] = {

    "name": "residential-20%",
    "cellWidth": 3,
    "moduleWidth": 9,
    "horizontalGrid": " [0, 1]",
    "bumpMap": "[100, 100, 0, 0, 50, 50]",
    "alphaMap": "[255, 155, 155, 255,255]",
    "rules": [
        "Background('silver')",
        "PunchWindow({ color: '#5b5d58', top: 0.2, bottom: 0.3, left: 0.2, right: 0.6, repeat: true })",
        "PunchWindow({ color: '#5b5d58', top: 0.2, bottom: 0.3, left: 0.6, right: 0.2, repeat: true })",
        "PunchMullion({ color: 'black', width: 2, subDiv: 1, top: 0.2, bottom: 0.3, left: 0.2, right: 0.6, repeat: true })",
        "PunchMullion({ color: 'black', width: 2, subDiv: 1, top: 0.2, bottom: 0.3, left: 0.6, right: 0.2, repeat: true })"
    ]
}

// 
obj['industrial']['90'] = {

    "name": "industrial-90%",
    "cellWidth": 1.5,
    "moduleWidth": 7.5,
    "horizontalGrid": "[0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75]",
    "bumpMap": "[255, 0, 100, 255, 255, 255]",
    "alphaMap": "[255, 125, 255, 255, 255]",
    "rules": [
    "Background('grey')",
    "StripWindow({ color: '#eaf7fe', x1: 0.02, y1: 0.15, x2: 0.98, y2: 0.75 })",
    "StripMullion({ color: '#5b5d58', width: 2, x1: 0.02, y1: 0.15, x2: 0.98, y2: 0.75, subDiv: 7 })",
    "Frame({ color: '#5b5d58', width: 4, x1: 0.02, y1: 0.15, x2: 0.98, y2: 0.75 })",
    "MullionHorizontal({ color: '#5b5d58', width: 2, start: 0.02, end: 0.98 })",
    ]

}

obj['industrial']['80'] = {

    "name": "industrial-80%",
    "cellWidth": 0.5,
    "moduleWidth": 4,
    "horizontalGrid": " [0, 0.1,0.3,0.5,0.7,0.9, 1]",
    "bumpMap": "[0, 0, 100, 150, 200]",
    "alphaMap": "[255, 255, 100, 255]",
    "rules": [
        "CurtainWall('grey')",
        "MullionVertical({ color: 'black', width: 2, start: 0, end: 1 })",
        "PunchWindow({ color: '#5b5d58', top: 0.2, bottom: 0.3, left: 0.25, right: 0.25, repeat: false })",
        "PunchMullion({ color: 'black', width: 2, subDiv: 2, top: 0.2, bottom: 0.3, left: 0.25, right: 0.25, repeat: false  })"

    ]
}

obj['industrial']['60'] = {

    "name": "industrial-60%",
    "cellWidth": 1.5,
    "moduleWidth": 7.5,
    "horizontalGrid": " [0, 0.2, 0.8, 1]",
    "bumpMap": "[0, 0, 100, 150, 200]",
    "alphaMap": "[155, 255, 255, 255]",
    "rules": [
        "CurtainWall('#eaf7fe')",
        "MullionVertical({ color: '#5b5d58', width: 1, start: 0.2, end: 0.8 })",
        "Replace({ type: 'row', elements: [0, 2], component: '#c5c5c5' })",
        "Frame({ color: '#5b5d58', width: 4, x1: 0, y1: 0.2, x2: 1, y2: 0.8 })",
        "Horizontal({ color: '#5b5d58', width: 6, t: 0.8 })"
    ]
}

obj['industrial']['50'] = {

    "name": "industrial-50%",
    "cellWidth": 1.5,
    "moduleWidth": 7.5,
    "horizontalGrid": " [0, 0.2, 0.8, 1]",
    "bumpMap": "[0, 0, 100, 150, 200]",
    "alphaMap": "[155, 255, 255, 255]",
    "rules": [
        "CurtainWall('#eaf7fe')",
        "MullionVertical({ color: '#5b5d58', width: 1, start: 0.2, end: 0.8 })",
        "Replace({ type: 'row', elements: [0, 2], component: '#c5c5c5' })",
        "Frame({ color: '#5b5d58', width: 4, x1: 0, y1: 0.2, x2: 1, y2: 0.8 })",
        "Horizontal({ color: '#5b5d58', width: 6, t: 0.8 })"
    ]
}

obj['industrial']['30'] = {

    "name": "industrial-30%",
    "cellWidth": 1.5,
    "moduleWidth": 7.5,
    "horizontalGrid": " [0, 0.2, 0.8, 1]",
    "bumpMap": "[0, 0, 100, 150, 200]",
    "alphaMap": "[155, 255, 255, 255]",
    "rules": [
        "CurtainWall('#eaf7fe')",
        "MullionVertical({ color: '#5b5d58', width: 1, start: 0.2, end: 0.8 })",
        "Replace({ type: 'row', elements: [0, 2], component: '#c5c5c5' })",
        "Frame({ color: '#5b5d58', width: 4, x1: 0, y1: 0.2, x2: 1, y2: 0.8 })",
        "Horizontal({ color: '#5b5d58', width: 6, t: 0.8 })"
    ]
}

obj['industrial']['20'] = {

    "name": "industrial-20%",
    "cellWidth": 1.5,
    "moduleWidth": 7.5,
    "horizontalGrid": " [0, 0.2, 0.8, 1]",
    "bumpMap": "[0, 0, 100, 150, 200]",
    "alphaMap": "[155, 255, 255, 255]",
    "rules": [
        "CurtainWall('#eaf7fe')",
        "MullionVertical({ color: '#5b5d58', width: 1, start: 0.2, end: 0.8 })",
        "Replace({ type: 'row', elements: [0, 2], component: '#c5c5c5' })",
        "Frame({ color: '#5b5d58', width: 4, x1: 0, y1: 0.2, x2: 1, y2: 0.8 })",
        "Horizontal({ color: '#5b5d58', width: 6, t: 0.8 })"
    ]
}






const presets = obj


export { presets }
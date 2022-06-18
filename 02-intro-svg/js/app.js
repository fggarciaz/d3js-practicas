const graf = d3.select('#graf')
const colorSelect = d3.select('#colorSelect')

const anchoTotal = +graf.style('width').slice(0, -2)
const altoTotal = anchoTotal * 9 / 16

const svg = graf.append('svg')
    .attr('width', anchoTotal)
    .attr('height', altoTotal)
    .attr('class', 'graf')

let colores = [
    { nombre: 'Rojo', valor: '#f00'},
    { nombre: 'Verde', valor: '#0f0'},
    { nombre: 'Azul', valor: '#00f'},
    { nombre: 'Amarillo', valor: '#ff0'},
]

colorSelect
    .selectAll('option')
    .data(colores)
    .enter()
    .append('option')
    .attr('value', d => d.valor)
    .text(d => d.nombre )

let cx = anchoTotal / 2
let cy = altoTotal / 2
let r = 75
let color = '#f00'

const c = svg.append('circle')
    .attr('cx', anchoTotal / 2)
    .attr('cy', altoTotal / 2)
    .attr('r', r)
    .attr('fill', color)

const modi = (delta) => {
    const {x, y} = delta
    cx += x ?? 0
    cy += y ?? 0

    color = c ? colorSelect.node().value : color    

    c.transition().duration(1000)
        .attr('cx', cx).attr('cy', cy).attr('fill', color)
}
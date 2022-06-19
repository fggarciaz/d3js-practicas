const graf = d3.select("#graf")

const anchoTotal = +graf.style('width').slice(0, -2);
const altoTotal = (anchoTotal * 9) / 16

const margins = {
    top: 20,
    right: 28,
    bottom: 75,
    left: 100
}

const ancho = anchoTotal - margins.left - margins.right;
const alto = altoTotal - margins.top - margins.bottom;

const svg = graf.append('svg')
    .attr('width', anchoTotal)
    .attr('height', altoTotal)
    .attr('class', 'graf')

const layer = svg.append('g')
    .attr('transform', `translate(${margins.left}, ${margins.top})`)

layer.append('rect')
    .attr('width', ancho)
    .attr('height', alto)
    .attr('fill', 'white')

const g = svg.append('g')
    .attr('transform', `translate(${margins.left}, ${margins.top})`)


const load = async () => {
    data = await d3.csv('barras.csv', d3.autoType)
    console.log(data);

    const rect = g.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', (d, i) => 75 * i)
        .attr('y', 0)
        .attr('width', 50)
        .attr('height', (d) => d.clientes)
        .attr('fill', '#ffb703')

}

load()
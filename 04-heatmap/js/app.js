const draw = async (el, col = 10, escala = 'linear') => {
    // Selección
    const graf = d3.select(el)

    // Dimensiones
    const ancho = +graf.style('width').slice(0, -2);
    const box = (ancho - 10) / col
    const alto = box * (100 / col) + 10

    


    // Area para el dibujo
    const svg = graf
        .append('svg')
        .attr('class', 'graf')
        .attr('width', ancho)
        .attr('height', alto)

    // Carga de datos
    const dataset = await d3.csv('data.csv', d3.autoType)

    // Ordenar
    dataset.sort( (a, b) => a.altura - b.altura )

    let color

    //Escalador
    switch (escala) {
        case 'linear':
            color = d3
                .scaleLinear()
                .domain(d3.extent(dataset, d => d.altura))
                .range(['#ddddff', '#1111ff'])
            break;
        case 'quantize':
            color = d3
                .scaleQuantize()
                .domain(d3.extent(dataset, d => d.altura))
                .range(['yellow', 'orange', 'brown'])
            break;
        case 'threshold':
            color = d3
                .scaleThreshold()
                .domain([1.5, 1.7, 1.8])
                .range(['yellow', 'gold', 'orange', 'brown'])
            break;
        default:
            break;
    }

    

    // Dibujo de cuadros
    svg
        .append('g')
        .attr('transform', 'translate(5, 5)')
        .selectAll('rect')
        .data(dataset)
        .join('rect')
        .attr('x', (d, i) => box * (i % col) )
        .attr('y', (d, i) => box * Math.floor(i / col) )
        .attr('width', box - 5)
        .attr('height', box - 5)
        .attr('fill', (d) => color(d.altura))
        .attr('stroke', '#777777')
    
    // Dibujo de textos
    svg
        .append('g')
        .attr('transform', 'translate(5, 5)')
        .selectAll('text')
        .data(dataset)
        .join('text')
        .attr('x', (d, i) => box * (i % col) + box / 2)
        .attr('y', (d, i) => box * Math.floor(i / col) + box / 2 )
        .text((d) => d.altura)
        .attr('text-anchor', 'middle')
               
    
}

draw('#hm1', 10, escala='linear')
draw('#hm2', 10, escala='quantize')
draw('#hm3', 10, escala='threshold')
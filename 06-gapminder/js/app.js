const draw = async (el = '#graf') => {
    // Selección de  gráfica
    const graf = d3.select("#graf")
    const play = d3.select('#play')
    const iconPlay = d3.select('#iconPlay')
    const selCont = d3.select('#continent')

    // Carga dell dataset
    let dataset = await d3.csv('gapminder.csv', d3.autoType)
    dataset = dataset.filter(d => d.income > 0 && d.life_exp > 0)
    console.log(dataset);
    
    // Dimensiones
    const anchoTotal = +graf.style('width').slice(0, -2);
    const altoTotal = anchoTotal * 0.5
    
    const margins = { top:20, right:20, bottom:75, left:100 }

    const alto = altoTotal - margins.top - margins.bottom
    const ancho = anchoTotal - margins.right - margins.left

    // Accessors
    const xAccessor = (d) => d.income
    const yAccessor = (d) => d.life_exp
    const rAccessor = (d) => d.population
    
    // Continentes
    continents = Array.from(new Set(dataset.map(d => d.continent)))
    selCont
        .selectAll('option')
        .data(['todos', ...continents])
        .join('option')
        .attr('value', d => d)
        .text(d => d)


    // Escaladores
    const color = d3
        .scaleOrdinal()
        .domain(continents)
        .range(['#00d5e9', '#7feb00', '#ffe700', '#ff5872'])
    
    
    const x = d3
        .scaleLog()
        .domain(d3.extent(dataset, xAccessor))
        .range([0, ancho])
    const y = d3
        .scaleLinear()
        .domain(d3.extent(dataset, yAccessor))
        .range([alto, 0])
    const r = d3
        .scaleLinear()
        .domain(d3.extent(dataset, rAccessor))
        .range([25, 25000])
        .nice()

    // Espacio de gráfica
    const svg = graf
        .append('svg')
        .classed('graf', true)
        .attr('width', anchoTotal)
        .attr('height', altoTotal)
    
    svg
        .append('g')
        .append('rect')
        .attr('transform', `translate(${margins.left}, ${margins.top})`)
        .attr('width', ancho)
        .attr('height', alto)
        .attr('class', 'backdrop')

    const clip = svg
        .append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr('width', ancho)
        .attr('height', alto)
        

    const chart = svg
        .append('g')
        .attr('transform', `translate(${margins.left}, ${margins.top})`)
    
    // Variables
    let yearMin = d3.min(dataset, d => d.year)
    let yearMax = d3.max(dataset, d => d.year)
    let year = Math.floor((yearMax - yearMin)/2) + yearMin
    let yearInterval
    let running = false
    let filtroContinente = 'todos'

    
    const yearLayer = chart
        .append('g')
        .append('text')
        .attr('x', ancho / 2)
        .attr('y', alto / 2)
        .classed('year', true)
        .text(year)
    
    const step = (year) => {
        let newDataset = dataset.filter(d => d.year == year)

        if (filtroContinente != 'todos') {
            newDataset = newDataset.filter( d => d.continent == filtroContinente)
        }
        
        // Dibujar los puntos
        const circles = chart
            .selectAll('circle')
            .data(newDataset)
            .join('circle')
            .attr('cx', (d) => x(xAccessor(d)))
            .attr('cy', (d) => y(yAccessor(d)))
            .attr('r', (d) => Math.sqrt( r(rAccessor(d) / Math.PI)))
            .attr('fill', (d) => color(d.continent))
            .attr('stroke', 'gray')
            .attr('opacity', 0.7)
            .attr('clip-path', 'url(#clip)')

        yearLayer.text(year)
    }
    step(year)

    d3.select('#ant').on('click', () => {
        year--
        year = year < yearMin ? yearMin : year
        step(year)
    })
    d3.select('#sig').on('click', () => {
        year++
        year = year > yearMax ? yearMax : year
        step(year)
    })
    play.on('click', () => {
        if(running) {
            clearInterval(yearInterval)
            play
                .classed('btn-success', true)
                .classed('btn-danger', false)
            iconPlay
                .attr('class', 'fa-solid fa-play')
                
        } else {
            yearInterval = setInterval(() => {
                year++
                year = year > yearMax ? yearMin : year
                step(year)
            }, 500)
            play
                .classed('btn-success', false)
                .classed('btn-danger', true)
            iconPlay
                .attr('class', 'fa-solid fa-pause')
        }
        running = !running
    })
    
    selCont.on('change', () => {
        filtroContinente = selCont.node().value
        step(year)
    })
    
    // Ejes
    const xAxis = d3
        .axisBottom(x)
        .ticks(3)
        .tickFormat((d) => d.toLocaleString())
        
    const yAxis = d3.axisLeft(y)

    const xAxisGroup = chart
        .append('g')
        .attr('transform', `translate(0, ${alto})`)
        .call(xAxis)
        .classed('axis', true)
        
    const yAxisGroup = chart.append('g').call(yAxis).classed('axis', true)

    xAxisGroup
        .append("text")
        .attr("x", ancho / 2)
        .attr("y", margins.bottom - 10)
        .attr("fill", "black")
        .text("Ingreso Per Cápita")
        
    yAxisGroup
        .append("text")
        .attr("x", -alto / 2)
        .attr("y", -margins.left + 30)
        .attr("fill", "black")
        .style("text-anchor", "middle")
        .style("transform", "rotate(270deg)")
        .text("Expectativa de Vida")

}

draw()
const registros = d3.select('#registros')

const load = async () => {
    const data = await d3.json("https://randomuser.me/api?results=10")
    //console.log(data);

    /* data.results.forEach(r => {
        console.log(r.name.title, r.name.first, r.name.last);
    }); */

    const rows = registros.selectAll('tr').data(data.results)
    rows.enter().append('tr').html(r => `
    <tr>
        <td><img src="${r.picture.medium}" class="rounded-circle"></td>
        <td><h3>${r.name.title} ${r.name.first} ${r.name.last}</h3>
        <p>${r.location.street.number} ${r.location.street.name}</br>
        ${r.location.city} - ${r.location.country}</p></td>
    </tr> 
    `
    )
}

load()

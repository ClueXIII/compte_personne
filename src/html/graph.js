async function get_Data() {
  try {
    const response = await fetch( // on récupère les salles en utilisant l'api
      `http://localhost:500/apiv1/salle`
    );
    responses = await response.json()
    salle = responses.salle
    let result = []; // on initialise le tableau qui contiendra les données
    for (let i = 0; i < salle.length; i++) { // on parcourt les salles
      let salleinfo = await fetch(
        `http://localhost:500/apiv1/nbrPersonne/` + salle[i].salle // on récupère les données de la salle
      );
      data = await salleinfo.json()
      result.push({ // on ajoute les données de la salle dans le tableau
        label: salle[i].salle, // on ajoute le nom de la salle
        data: await data.stats.map(row => row.nbr_personnes), // on ajoute les données de la salle
        borderColor :'rgb(255,255,255)', // on ajoute la couleur de la courbe
        tension: 0.1, // on ajoute la tension de la courbe
      })
    }
    return result
  } catch (error) {
    console.error(error);
  }
}
async function get_Hours() {
  try {
    let salleinfo = await fetch(
      `http://localhost:500/apiv1/nbrPersonne/C0_21`
    );
    data = await salleinfo.json()
    return data.stats.map(row => row.hour)
  }
  catch (error) {
    console.error(error);
  }
}

async function build_chart(){

  const data = await get_Data()
  const players = await document.getElementById("hours_affluence");
  const nbr_personne_Chart = await new Chart(players,{
    type:"line",
    options: {
      elements: {
        point:{
          radius: 0,
        }
      },
      plugins: {
        legend: {
          labels: {
            font: {
              size: 12,
            }
          }
        }
      },
      scales: {
        y: {
          ticks: { color: 'rgb(255,255,255)'},
          beginAtZero: true,
          grid : {
            color : 'rgb(187,187,187)'
          }
        },
        x: {
          ticks: { color: 'rgb(255,255,255)'},
          grid : {
            color : 'rgb(199,199,199)',
          }
        }
      },

      animation: true,
    },
    data:{
      labels: await get_Hours(),
      datasets:await get_Data()
    }
  })
}
build_chart()

async function get_Data() {
  try {
    const response = await fetch(
      `http://localhost:500/apiv1/salle`
    );
    responses = await response.json()
    salle = responses.salle
    let result = [];
    for (let i = 0; i < salle.length; i++) {
      let salleinfo = await fetch(
        `http://localhost:500/apiv1/nbrPersonne/` + salle[i].salle
      );
      data = await salleinfo.json()
      result.push({
        label: salle[i].salle,
        data: await data.data.map(row => row.nbr_personnes),
        tension: 0.1,
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
    return data.data.map(row => row.hour)
  }
  catch (error) {
    console.error(error);
  }
}

async function build_chart_player_online(){

  const data = await get_Data()
  const players = await document.getElementById("hours_affluence");
  const nbr_personne_Chart = await new Chart(players,{
    type:"line",
    options: {
      elements: {
        point:{
          radius: 0
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
          ticks: { color: 'rgb(184,184,189)'},
          beginAtZero: true,
          grid : {
            color : 'rgb(63,63,65)'
          }
        },
        x: {
          ticks: { color: 'rgb(184,184,189)'},
          grid : {
            color : 'rgb(52,52,54)',

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
build_chart_player_online()

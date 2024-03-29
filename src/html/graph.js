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
        borderColor : await salle[i].couleur, // on ajoute la couleur de la courbe
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

async function printcapacite(){
  const response = await fetch( // on récupère les salles en utilisant l'api
    `http://localhost:500/apiv1/salle`
  );
  responses = await response.json()
  salle = responses.salle
  for (let i = 0; i < salle.length; i++) { // on parcourt les salles
    name = salle[i].salle;
    capa = salle[i].capacite;
    let data = await fetch(
      `http://localhost:500/apiv1/nbrPersonne/` + salle[i].salle // on récupère les données de la salle
    );
    salleinfo = await data.json();
    let lastStat = salleinfo.stats.pop(); // extrait le dernier élément de la propriété "stats"
    let lastNbrPersonnes = lastStat.nbr_personnes; // accède à la propriété "nbr_personnes" de l'élément extrait
    const capaciteDiv = document.getElementById("capa"); //
    const pElement = document.createElement("p");
    pElement.innerText = name + " : " + lastNbrPersonnes + "/" + capa  ;
    pElement.className = "capacite";
    const progressBar = document.createElement("div"); // créer une div pour la barre de progression
    progressBar.className = "progressBar";
    if (lastNbrPersonnes == capa) { // si la salle est pleine
      progressBar.style.width = (lastNbrPersonnes / capa) * 90 + "%"; // remplir la barre
      progressBar.backgroundColor = "rgb(255,255,255)";
    } else if (lastNbrPersonnes < capa) { //
      progressBar.style.width = (lastNbrPersonnes / capa) * 90 + "%"; // remplir la barre proportionnellement au nombre de personnes présentes
      progressBar.backgroundColor = "rgb(255,255,255)";
    } else if (lastNbrPersonnes > capa) {
      progressBar.style.backgroundColor = "rgb(255,0,0)";
      progressBar.style.width = "90%";
    }
    const subcapadiv = document.createElement("div");
    subcapadiv.className = "subcapadiv";
    capaciteDiv.appendChild(subcapadiv); // ajouter la div parent à la div "capa"
    subcapadiv.appendChild(pElement); // ajouter la barre de progression à la div parent
    subcapadiv.appendChild(progressBar); // ajouter la barre de progression à la div parent
  }
}
printcapacite()
build_chart()

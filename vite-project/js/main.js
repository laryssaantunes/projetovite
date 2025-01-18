let posicaoInicial; 
const capturarlocalizacao = document.getElementById('localizacao');
const latitude = document.getElementById('latitude');
const longitude = document.getElementById('longitude');
let mapa;
let marcador;

const sucesso = (posicao) => {
  posicaoInicial = posicao;

  latitude.innerHTML = posicaoInicial.coords.latitude;
  longitude.innerHTML = posicaoInicial.coords.longitude;

  const latLng = { lat: posicaoInicial.coords.latitude, lng: posicaoInicial.coords.longitude };
  
  if (!mapa) {
    mapa = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: latLng,
    });

    marcador = new google.maps.Marker({
      position: latLng,
      map: mapa,
      title: "Aqui estou!",
    });
  } else {
    mapa.setCenter(latLng);
    marcador.setPosition(latLng);
  }
};

const erro = (error) => {
  let errorMessage;
  switch(error.code){
    case 0:
      errorMessage = "Erro desconhecido";
      break;
    case 1:
      errorMessage = "Permissão negada!";
      break;
    case 2:
      errorMessage = "Captura de posição indisponível!";
      break;
    case 3:
      errorMessage = "Tempo de solicitação excedido!";
      break;
  }
  console.log('Ocorreu um erro:' + errorMessage);
};

capturarlocalizacao.addEventListener('click', () => {
  navigator.geolocation.getCurrentPosition(sucesso, erro);
});

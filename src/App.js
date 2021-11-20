import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Form, FloatingLabel, Alert } from 'react-bootstrap';



function App() {
  const [umidadeAtual, setUmidadeAtual] = useState([]);
  const [rangeDadosHistorico, setRangeDadosHistorico] = useState(30);
  const [tipoGrafico, setTipoGrafico] = useState('line');
  const [widthScreen, setWidthScreen] = useState();
  const [heightScreen, setHeightScreen] = useState();

  function setResponsiveScreen() {
    if (window.innerWidth > 800) {
      setWidthScreen(900)
      setHeightScreen(400)
    } else if (window.innerWidth < 800) {
      setWidthScreen(350)
      setHeightScreen(260)
    }
  }

  useEffect(() => {
    window.addEventListener('resize', function () {
      setResponsiveScreen();
    })
    setResponsiveScreen();
  }, [])

  useEffect(() => {
    axios.get('https://api.thingspeak.com/channels/1577427/fields/1.json?results=2')
      .then((response) => {
        setUmidadeAtual(response.data.feeds);
      });
  }, [umidadeAtual])

  return (
    <div className="App">
      <h1>Monitoramento da umidade do solo</h1>
      <iframe title="Umidade solo" width={widthScreen} height={heightScreen} style={{ border: '1px solid #cccccc' }} src={`https://thingspeak.com/channels/1577427/charts/1?title=Umidade%20X%20Data&xaxis=Data&yaxis=Umidade&width=${widthScreen}&height=${heightScreen}&bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=${rangeDadosHistorico}&type=${tipoGrafico}&update=15%22%3E`}> </iframe>
      <div className="row justify-content-center">
        <div className="mt-2 col-md-2 col-sm-4">
          <FloatingLabel label="Tipo de gráfico">
            <Form.Select value={tipoGrafico} onChange={(e) => setTipoGrafico(e.target.value)}>
              <option value="line">Linha</option>
              <option value="bar">Barra</option>
              <option value="column">Coluna</option>
              <option value="spline">Spline</option>
              <option value="step">Step</option>
            </Form.Select>
          </FloatingLabel>
        </div>
        <div className="mt-2 col-md-2 col-sm-4">
          <FloatingLabel label="Quantidade de dados">
            <Form.Select value={rangeDadosHistorico} onChange={(e) => setRangeDadosHistorico(e.target.value)} name="grafico" id="grafico">
              <option value={30}>30</option>
              <option value={60}>60</option>
              <option value={120}>120</option>
              <option value={300}>300</option>
              <option value={1000}>1000</option>
              <option value={1000000}>Todos</option>
            </Form.Select>
          </FloatingLabel>

        </div>
        <Alert className="mt-2 col-9" variant={umidadeAtual[1]?.field1 > 60 ? 'primary' : 'warning' }>
          Umidade atual do solo: {umidadeAtual[1]?.field1}%
        </Alert>
      </div>
    </div>
  );
}

export default App;

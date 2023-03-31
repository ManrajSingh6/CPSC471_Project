import { useState } from "react";

function App() {

  const [responseBody, setResponseBody] = useState('Button not clicked yet');

  async function testConnection(ev){
    ev.preventDefault();
    const response = await fetch ('http://localhost:5000/');
    if (response.ok){
      response.json().then(res => {
        console.log(JSON.stringify(res));
        setResponseBody(JSON.stringify(res));
      });
    }
  }

  return (
    <div>
      <h1>{responseBody}</h1>
      <button style={{marginTop: "10px"}} onClick={testConnection}>Test Connection</button>
      <button style={{marginLeft: "10px"}} onClick={(ev) => {ev.preventDefault(); setResponseBody('Reset Clicked')}}>Reset</button>
    </div>
  );
}

export default App;

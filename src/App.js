import React, {useState} from 'react';
import './App.css';

function App() {
  const[response,setResponse] = useState([]);
  const[sites,setSites] = useState("https://www.claro.com.br/");
  const[scripts,setScripts] = useState();

  const search = () => {
    const arrSites = sites.split(",");
    const arrScripts = scripts.split(",");
    setResponse([]);

    arrSites.forEach(site => {
      fetch(site.trim())
        .then(data => {
          
          var text = data.text();
          var textPromise = Promise.resolve(text);
          textPromise.then(html => {

            setResponse([...response , {
              site:site,
              matchScripts:arrScripts.map( script => {
                return {
                  script:script,
                  status:html.indexOf(script.trim())<0?false:true
                }
              })
            }])

          })
      }).catch(function(error) {
        console.log(error);
        setResponse([...response , {
          site:site,
          matchScripts:[],
          error:"bloqueio de cors ou dominio inválido"
        }])
      });;
    });

  }

  

  return (
    <div className="App">
      <header className="App-header">
        <div className="container">
          <label>Coloque os dominios a serem escaneados separados por virgula</label>
          <textarea placeholder="https://www.google.com, https://www.facebook.com.br, ..." cols="100" rows="10" value={sites} onChange={e => setSites(e.target.value)}/>
          
          <label>Quais scripts ou css devem ser procurados?</label>
          <input type="text" value={scripts} onChange={e => setScripts(e.target.value)}/>
          
          <button onClick={search}>Buscar</button>

          <div>
            {
              response.map((obj,id) => {
                return (
                  <ul id={id}>
                    <li className="title">{obj.site}</li>
                    {
                      obj.error && <li>{obj.error}</li>
                    }
                    {
                      obj.matchScripts.map(
                      (objScripts,id) => <li id={id}>{objScripts.script+":"} <strong className={"_"+objScripts.status}>{objScripts.status?"tem":"Não tem"}</strong></li>
                      )
                    }
                  </ul>
                )
              })
            }
          </div>

        </div>
        
      </header>
    </div>
  );
}

export default App;

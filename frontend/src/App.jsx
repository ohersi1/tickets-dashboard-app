import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tickets, setTickets] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3000/api/tickets")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setTickets(data.results);
      })
      .catch(err => console.error(err));
  }, []);
  return (
    <div>
      <h1>Tickets Dashboard</h1>
      {console.log("tickets state:", tickets)}
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket.id}>{ticket.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

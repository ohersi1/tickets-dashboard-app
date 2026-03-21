import { useEffect, useState } from "react";
import "./App.css";
import { use } from "react";

function App() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/tickets")
      .then((res) => res.json())
      .then((data) => {
        setTickets(data.results);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading tickets...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div>
      <h1>Tickets Dashboard</h1>
      <input type="text" placeholder="Search tickets..." value={searchValue} onChange={e => setSearchValue(e.target.value)}/>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.title}</td>
              <td>{ticket.priority}</td>
              <td>{ticket.status}</td>
              <td>{new Date(ticket.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

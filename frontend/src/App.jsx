import { useEffect, useState } from "react";
import "./App.css";
import { useCallback } from "react";

function App() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [statusValue, setStatusValue] = useState("");
  const [priorityValue, setPriorityValue] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedStatus, setAppliedStatus] = useState("");
  const [appliedPriority, setAppliedPriority] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps

  const fetchTickets = useCallback(() => {
    setLoading(true);
    setError(null);

    fetch(`http://localhost:3000/api/tickets?page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        setTickets(data.results);
        setTotalPages(data.totalPages);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [page]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleSearch = () => {
    setAppliedSearch(searchValue);
    setAppliedStatus(statusValue);
    setAppliedPriority(priorityValue);
    setPage(1);
    setLoading(true);
    setError(null);
    let fetchQuery = "http://localhost:3000/api/tickets?";
    let query = [];

    if (searchValue) {
      query.push(`search=${encodeURIComponent(searchValue.trim())}`);
    }
    if (statusValue) {
      query.push(`status=${encodeURIComponent(statusValue)}`);
    }
    if (priorityValue) {
      query.push(`priority=${encodeURIComponent(priorityValue)}`);
    }
    if (query.length === 0) {
      fetchTickets();
      return;
    }
    fetchQuery += query.join("&");
    console.log(fetchQuery);
    fetch(fetchQuery)
      .then((res) => res.json())
      .then((data) => {
        setTickets(data.results);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const handleReset = () => {
    setSearchValue("");
    setStatusValue("");
    setPriorityValue("");
    setError(null);

    fetchTickets();
  };

  return (
    <div>
      <h1>Tickets Dashboard</h1>
      {error && <p>Error: {error}</p>}
      <input
        type="text"
        placeholder="Search tickets..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <button onClick={handleReset}>Reset</button>
      <label htmlFor="status"> Status </label>
      <select
        name="status"
        id="status"
        value={statusValue}
        onChange={(e) => setStatusValue(e.target.value)}
      >
        <option value="">ALL</option>
        <option value="OPEN">OPEN</option>
        <option value="IN_PROGRESS">IN_PROGRESS</option>
        <option value="RESOLVED">RESOLVED</option>
      </select>
      <label htmlFor="priority"> Priority </label>
      <select
        name="priority"
        id="priority"
        value={priorityValue}
        onChange={(e) => setPriorityValue(e.target.value)}
      >
        <option value="">ALL</option>
        <option value="LOW">LOW</option>
        <option value="MEDIUM">MEDIUM</option>
        <option value="HIGH">HIGH</option>
      </select>
      {loading ? (
        <p>Loading tickets...</p>
      ) : (
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
            {tickets.length === 0 ? (
              <tr><td colSpan={4}>No tickets found!</td></tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.title}</td>
                  <td>{ticket.priority}</td>
                  <td>{ticket.status}</td>
                  <td>{new Date(ticket.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
      <button onClick={() => setPage(prevState => prevState === 1 ? 1 : prevState - 1)} disabled={page === 1}>Prev</button> Page {page} of {totalPages} <button onClick={() => setPage(prevState => prevState === totalPages ? totalPages : prevState + 1)} disabled={page === totalPages}>Next</button>
    </div>
  );
}

export default App;

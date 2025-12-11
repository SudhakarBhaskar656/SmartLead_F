import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [input, setInput] = useState("");
  const [leads, setLeads] = useState([]);
  const [filter, setFilter] = useState("All");

  const fetchLeads = async () => {
    try {
      const res = await axios.get("https://smartlead.onrender.com/api/leads");
      setLeads(res.data);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const submitNames = async () => {
    try {
      await axios.post("https://smartlead.onrender.com/api/process", { names: input });
      fetchLeads(); 
    } catch (err) {
      console.log("Submit error:", err);
    }
  };

  return (
    <div className="container">
      <h1>Smart Lead Dashboard</h1>

      <textarea
        placeholder="Enter names: Peter, Aditi, Ravi"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <br /><br />
      <button onClick={submitNames}>Submit</button>

      <br /><br />

      <select onChange={(e) => setFilter(e.target.value)}>
        <option value="All">All</option>
        <option value="Verified">Verified</option>
        <option value="To Check">To Check</option>
      </select>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Country</th>
            <th>Probability</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {leads
            .filter((l) => filter === "All" || l.status === filter)
            .map((lead) => (
              <tr key={lead._id}>
                <td>{lead.name}</td>
                <td>{lead.country}</td>
                <td>{(lead.probability * 100).toFixed(1)}%</td>

                {/* Add dynamic status color class */}
                <td className={`status-${lead.status.replace(" ", "")}`}>
                  {lead.status}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

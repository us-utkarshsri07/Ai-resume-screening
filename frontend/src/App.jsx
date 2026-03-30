import { useState } from "react";
import axios from "axios";

function App() {
  const [jobDesc, setJobDesc] = useState("");
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    console.log("FILES:", files);
    const formData = new FormData();
    formData.append("job_desc", jobDesc);

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/rank",
        formData
      );
      setResults(res.data.ranking);
    } catch (err) {
      console.error(err);
    }
    // finally {
      setLoading(false);
    // }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>AI Resume Screening</h1>

      <textarea
        placeholder="Enter Job Description"
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
        rows={4}
        cols={50}
      />

      <br /><br />

      <input
        type="file"
        multiple
        onChange={(e) => setFiles(Array.from(e.target.files))}
      />

      <br /><br />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Processing..." : "Analyze"}
      </button>

      <h2>Results</h2>

    <ul>
      {results.map((r, index) => (
        <li key={index}>
          Rank {r.rank} | {r.name} | Score: {r.score.toFixed(3)} <br />
          Skills: {r.skills.join(", ")}
          </li>
        ))}
    </ul>
    </div>
  );
}

export default App;
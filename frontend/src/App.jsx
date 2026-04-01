import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [jobDesc, setJobDesc] = useState("");
  const [jobSkills, setJobSkills] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);

  const [shortlisted, setShortlisted] = useState([]);
  const [rejected, setRejected] = useState([]);

  const [title, setTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newSkills, setNewSkills] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/jobs");
      setJobs(res.data.jobs);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file, file.name);
    });

    formData.append("job_desc", jobDesc);
    formData.append("job_skills", jobSkills);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/rank",
        formData
      );
      setResults(res.data.ranking_candidates || []);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const handleCreateJob = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", newDesc);
      formData.append("skills", newSkills);

      await axios.post("http://127.0.0.1:8000/jobs", formData);

      fetchJobs();

      setTitle("");
      setNewDesc("");
      setNewSkills("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleShortlist = (candidate) => {
    if (!shortlisted.find(c => c.name === candidate.name)) {
      setShortlisted([...shortlisted, candidate]);
    }
  };

  const handleReject = (candidate) => {
    if (!rejected.find(c => c.name === candidate.name)) {
      setRejected([...rejected, candidate]);
    }
  };

  // ==== AI EXPLANATION ====
  const getExplanation = (r) => {
    if (r.score >= 0.6) {
      return "Strong match: candidate aligns well with required skills and job context.";
    }
    if (r.score >= 0.4) {
      return "Moderate match: partial skill alignment, may require upskilling.";
    }
    return "Weak match: lacks key skills or relevant experience.";
  };

  // ==== STYLES ====

  const card = {
    border: "1px solid #30363d",
    padding: "25px",
    borderRadius: "12px",
    marginBottom: "25px",
    background: "linear-gradient(145deg, #0a0a0a, #111827)",
    boxShadow: "0 8px 30px rgba(0,0,0,0.8)"
  };

  const inputFull = {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    background: "#0d1117",
    border: "1px solid #30363d",
    color: "#e6edf3",
    borderRadius: "8px"
  };

  const btnPrimary = {
    padding: "10px 18px",
    background: "linear-gradient(45deg, #4CAF50, #2e7d32)",
    border: "none",
    color: "white",
    cursor: "pointer",
    borderRadius: "6px"
  };

  const btnSmall = {
    margin: "2px",
    padding: "6px 10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    background: "#222",
    color: "#ddd"
  };

  const table = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px"
  };

  const getScoreColor = (score) => {
    if (score >= 0.6) return "#4CAF50";
    if (score >= 0.4) return "#FFC107";
    return "#F44336";
  };

  // ================= UI =================

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0f1c, #000000)",
      padding: "30px",
      fontFamily: "Arial",
      color: "#ddd"
    }}>

      <div style={{ maxWidth: "900px", margin: "auto" }}>

        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
          AI-Powered Resume Screening
        
        </h1>

        {/* CREATE JOB */}
        <div style={card}>
          <h3>Create Job</h3>

          <input
            placeholder="Job Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputFull}
          />

          <textarea
            placeholder="Job Description"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            rows={3}
            style={inputFull}
          />

          <input
            placeholder="Skills (comma separated)"
            value={newSkills}
            onChange={(e) => setNewSkills(e.target.value)}
            style={inputFull}
          />

          <button onClick={handleCreateJob} style={btnPrimary}>
            Add Job
          </button>
        </div>

        {/* SELECT JOB */}
        <div style={card}>
          <h3>Select Job</h3>

          <select
            style={inputFull}
            onChange={(e) => {
              const job = jobs.find(j => j.id === Number(e.target.value));
              setSelectedJob(job);

              if (job) {
                setJobDesc(job.description);
                setJobSkills(job.skills.join(", "));
              }
            }}
          >
            <option value="">Select Job</option>
            {jobs.map(job => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>

          <textarea
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            rows={3}
            style={inputFull}
          />

          <input
            value={jobSkills}
            onChange={(e) => setJobSkills(e.target.value)}
            style={inputFull}
          />
        </div>

        {/* UPLOAD */}
        <div style={card}>
          <h3>Upload Resumes</h3>

          <input
            type="file"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files))}
          />

          <br /><br />

          <button
            onClick={handleSubmit}
            disabled={loading || files.length === 0}
            style={btnPrimary}
          >
            {loading ? "Processing..." : "Analyze"}
          </button>
        </div>

        {/* RESULTS */}
        <h2>Results</h2>

        {loading && <p>Processing resumes...</p>}

        {!loading && results.length === 0 && (
          <p>No results yet.</p>
        )}

        {results.length > 0 && (
          <table style={table}>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Score</th>
                <th>Skill %</th>
                <th>Semantic %</th>
                <th>Missing</th>
                <th>Explanation</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {results.map((r, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor: getScoreColor(r.score) + "20"
                  }}
                >
                  <td>{r.rank}</td>
                  <td>{r.name}</td>

                  <td style={{
                    color: getScoreColor(r.score),
                    fontWeight: "bold"
                  }}>
                    {r.score.toFixed(3)}
                  </td>

                  <td>{(r.skill_score * 100).toFixed(1)}%</td>
                  <td>{(r.semantic_score * 100).toFixed(1)}%</td>

                  <td>
                    {r.missing_skills?.length
                      ? r.missing_skills.join(", ")
                      : "None"}
                  </td>

                  <td style={{ fontSize: "12px", color: "#aaa" }}>
                    {getExplanation(r)}
                  </td>

                  <td>
                    <button onClick={() => handleShortlist(r)} style={btnSmall}>✔</button>
                    <button onClick={() => handleReject(r)} style={btnSmall}>✖</button>
                    <button onClick={() =>
                      window.open(`http://127.0.0.1:8000/resumes/${r.name}`)
                    } style={btnSmall}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* SHORTLIST */}
        {shortlisted.length > 0 && (
          <>
            <h3>Shortlisted</h3>
            <ul>
              {shortlisted.map((c, i) => (
                <li key={i}>{c.name}</li>
              ))}
            </ul>
          </>
        )}

        {/* REJECTED */}
        {rejected.length > 0 && (
          <>
            <h3>Rejected</h3>
            <ul>
              {rejected.map((c, i) => (
                <li key={i}>{c.name}</li>
              ))}
            </ul>
          </>
        )}

      </div>
    </div>
  );
}

export default App;

//Final score =0.5 * skill_score + 0.5 * semantic_score
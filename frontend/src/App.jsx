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

  //  JOB HANDLER
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

  return (
  <div style={{
  padding: "30px",
  maxWidth: "900px",
  margin: "auto",
  fontFamily: "Arial"
}}>
      <h1>AI Resume Screening</h1>

      {/* =*/}
      {/*  JOB UI */}
      {/* = */}
      <h3>Create Job</h3>

      <input
        placeholder="Job Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder="Job Description"
        value={newDesc}
        onChange={(e) => setNewDesc(e.target.value)}
        rows={3}
        cols={40}
      />

      <br /><br />

      <input
        placeholder="Skills (comma separated)"
        value={newSkills}
        onChange={(e) => setNewSkills(e.target.value)}
      />

      <br /><br />

      <button onClick={handleCreateJob}>
        Add Job
      </button>

      <hr />

      {/* */}
      {/* JOB SELECTION */}
      {/* */}
      <select
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

      <br /><br />

      <textarea
        placeholder="Job Description"
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
        rows={4}
        cols={50}
      />

      <br /><br />

      <input
        placeholder="Skills (comma separated)"
        value={jobSkills}
        onChange={(e) => setJobSkills(e.target.value)}
      />

      <br /><br />

      {/* File Upload */}
      <input
        type="file"
        multiple
        onChange={(e) => setFiles(Array.from(e.target.files))}
      />

      <br /><br />

      <button
        onClick={handleSubmit}
        disabled={
          loading ||
          files.length === 0 ||
          !jobDesc ||
          !jobSkills
        }
      >
        {loading ? "Processing..." : "Analyze"}
      </button>

      <h2>Results</h2>

      {loading && <p>Processing resumes...</p>}

      {!loading && results.length === 0 && (
        <p>No results yet. Upload resumes and analyze.</p>
      )}

      {/*  */}
      {/* HR DASHBOARD */}
      {/*  */}
      {results.length > 0 && (
        <table border="1" cellPadding="10" style={{ marginTop: "20px", width: "100%" }}>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Score</th>
              <th>Skill %</th>
              <th>Semantic %</th>
              <th>Missing Skills</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {results.map((r, index) => (
              <tr key={index}>
                <td>{r.rank}</td>
                <td>{r.name}</td>
                <td>{r.score.toFixed(3)}</td>
                <td>{(r.skill_score * 100).toFixed(1)}%</td>
                <td>{(r.semantic_score * 100).toFixed(1)}%</td>
                <td>
                  {r.missing_skills?.length > 0
                    ? r.missing_skills.join(", ")
                    : "None"}
                </td>

                <td>
                  <button onClick={() => handleShortlist(r)}>Shortlist</button>
                  <button onClick={() => handleReject(r)}>Reject</button>
                  <button onClick={() =>
                    window.open(`http://127.0.0.1:8000/resumes/${r.name}`)
                  }>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* SHORTLISTED */}
      {shortlisted.length > 0 && (
        <>
          <h3>Shortlisted Candidates</h3>
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
          <h3>Rejected Candidates</h3>
          <ul>
            {rejected.map((c, i) => (
              <li key={i}>{c.name}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
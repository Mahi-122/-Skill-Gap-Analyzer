
import { useState } from "react";
import "./App.css";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [skills, setSkills] = useState("");
  const [targetCareer, setTargetCareer] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");

  const [analysisResult, setAnalysisResult] = useState(null);
  const [message, setMessage] = useState("");

  // Career-wise required skills
  const careerSkills = {
    "AI/ML Engineer": [
      "Python",
      "Machine Learning",
      "Deep Learning",
      "NumPy",
      "Pandas",
      "SQL",
      "Statistics",
      "TensorFlow",
      "PyTorch",
      "Data Structures"
    ],

    "Software Developer": [
      "Programming",
      "Data Structures",
      "Algorithms",
      "OOP",
      "Git",
      "SQL",
      "Problem Solving",
      "APIs",
      "Testing",
      "System Design"
    ],

    "Data Scientist": [
      "Python",
      "Statistics",
      "Machine Learning",
      "NumPy",
      "Pandas",
      "SQL",
      "Data Visualization",
      "Matplotlib",
      "Scikit-learn",
      "Data Analysis"
    ],

    "Web Developer": [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Node.js",
      "Git",
      "APIs",
      "SQL",
      "Responsive Design",
      "Testing"
    ],

    "Data Analyst": [
      "SQL",
      "Excel",
      "Python",
      "Statistics",
      "Data Analysis",
      "Power BI",
      "Tableau",
      "Data Visualization",
      "Pandas",
      "Communication"
    ]
  };

  // Analyze skills
  const analyzeSkills = () => {
    if (!skills || !targetCareer || !experienceLevel) {
      setMessage("Please fill all fields before analyzing.");
      return;
    }

    const userSkills = skills
      .split(",")
      .map((skill) => skill.trim().toLowerCase())
      .filter((skill) => skill !== "");

    const requiredSkills =
      careerSkills[targetCareer] || [
        "Programming",
        "Problem Solving",
        "Communication",
        "Technical Knowledge",
        "Projects"
      ];

    const alreadyHave = [];
    const missingSkills = [];

    requiredSkills.forEach((skill) => {
      const skillLower = skill.toLowerCase();

      const found = userSkills.some(
        (userSkill) =>
          userSkill === skillLower ||
          userSkill.includes(skillLower) ||
          skillLower.includes(userSkill)
      );

      if (found) {
        alreadyHave.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });

    setAnalysisResult({
      requiredSkills,
      alreadyHave,
      missingSkills
    });

    setMessage("");
    setShowAnalysis(false);
    setShowResult(true);
  };

  // Register / Login
  const handleSubmit = async () => {
    setMessage(isLogin ? "Logging in..." : "Registering...");

    try {
      const endpoint = isLogin
        ? "http://localhost:8080/api/users/login"
        : "http://localhost:8080/api/users/register";

      const body = isLogin
        ? {
            email,
            password,
          }
        : {
            name,
            email,
            password,
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      if (response.ok) {

        // LOGIN SUCCESS
        if (isLogin) {
          setLoggedIn(true);
          setName(data.name);
          setMessage("");
        }

        // REGISTRATION SUCCESS
        else {
          setLoggedIn(true);
          setName(data.name);
          setMessage("");
        }

      } else {
        setMessage(
          typeof data === "string"
            ? data
            : "Something went wrong."
        );
      }

    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setMessage("");
    setName("");
    setEmail("");
    setPassword("");
  };

  // =========================
  // SKILL GAP RESULTS
  // =========================
  if (loggedIn && showResult && analysisResult) {
    const totalSkills = analysisResult.requiredSkills.length;
    const completedSkills = analysisResult.alreadyHave.length;

    const percentage =
      totalSkills === 0
        ? 0
        : Math.round((completedSkills / totalSkills) * 100);

    return (
      <div className="app">
        <div className="dashboard">

          <h1>Skill Gap Results</h1>

          <p className="dashboard-subtitle">
            Here is your personalized skill analysis.
          </p>

          <div className="dashboard-card">

            <h2>Career Goal</h2>

            <p>
              <strong>Target Career:</strong> {targetCareer}
            </p>

            <p>
              <strong>Experience Level:</strong>{" "}
              {experienceLevel}
            </p>

            <p>
              <strong>Skill Match:</strong>{" "}
              {percentage}%
            </p>

          </div>

          <div className="dashboard-card">

            <h2>Skills You Already Have</h2>

            {analysisResult.alreadyHave.length > 0 ? (
              <ul className="skill-list">
                {analysisResult.alreadyHave.map((skill) => (
                  <li key={skill}>
                    ✅ {skill}
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                No matching required skills found yet.
              </p>
            )}

          </div>

          <div className="dashboard-card">

            <h2>Skills You Need to Improve</h2>

            {analysisResult.missingSkills.length > 0 ? (
              <ul className="skill-list">
                {analysisResult.missingSkills.map((skill) => (
                  <li key={skill}>
                    📌 {skill}
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                🎉 Excellent! You have all the required skills
                for this career.
              </p>
            )}

          </div>

          <div className="dashboard-card">

            <h2>Recommended Learning Path</h2>

            {analysisResult.missingSkills.length > 0 ? (
              <div>
                <p>
                  Focus on these skills first:
                </p>

                <ol className="skill-list">
                  {analysisResult.missingSkills
                    .slice(0, 5)
                    .map((skill) => (
                      <li key={skill}>
                        Learn {skill}
                      </li>
                    ))}
                </ol>

                <p>
                  After improving these skills, build
                  practical projects related to your target
                  career.
                </p>
              </div>
            ) : (
              <p>
                You are ready to focus on advanced projects
                and interview preparation.
              </p>
            )}

          </div>

          <button
            onClick={() => {
              setShowResult(false);
              setShowAnalysis(true);
            }}
          >
            Edit Analysis
          </button>

          <button
            className="back-button"
            onClick={() => {
              setShowResult(false);
              setShowAnalysis(false);
              setAnalysisResult(null);
            }}
          >
            Back to Dashboard
          </button>

        </div>
      </div>
    );
  }

  // =========================
  // SKILL ANALYSIS PAGE
  // =========================
  if (loggedIn && showAnalysis) {
    return (
      <div className="app">
        <div className="dashboard">

          <h1>Skill Analysis</h1>

          <p className="dashboard-subtitle">
            Tell us about your current skills and career goal.
          </p>

          <div className="dashboard-card">

            <h2>Current Skills</h2>

            <input
              type="text"
              placeholder="Example: Python, Java, SQL, React"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />

            <h2>Target Career</h2>

            <select
              value={targetCareer}
              onChange={(e) => setTargetCareer(e.target.value)}
            >
              <option value="">
                Select your target career
              </option>

              <option value="AI/ML Engineer">
                AI/ML Engineer
              </option>

              <option value="Software Developer">
                Software Developer
              </option>

              <option value="Data Scientist">
                Data Scientist
              </option>

              <option value="Web Developer">
                Web Developer
              </option>

              <option value="Data Analyst">
                Data Analyst
              </option>
            </select>

            <h2>Experience Level</h2>

            <select
              value={experienceLevel}
              onChange={(e) =>
                setExperienceLevel(e.target.value)
              }
            >
              <option value="">
                Select your experience level
              </option>

              <option value="Beginner">
                Beginner
              </option>

              <option value="Intermediate">
                Intermediate
              </option>

              <option value="Advanced">
                Advanced
              </option>
            </select>

            <button onClick={analyzeSkills}>
              Analyze Skill Gap
            </button>

            <button
              className="back-button"
              onClick={() => {
                setShowAnalysis(false);
                setMessage("");
              }}
            >
              Back to Dashboard
            </button>

            <p className="message">
              {message}
            </p>

          </div>

        </div>
      </div>
    );
  }

  // =========================
  // DASHBOARD
  // =========================
  if (loggedIn) {
    return (
      <div className="app">
        <div className="dashboard">

          <h1>Welcome, {name} 👋</h1>

          <p className="dashboard-subtitle">
            Skill Gap Analyzer Dashboard
          </p>

          <div className="dashboard-card">

            <h2>Analyze Your Skills</h2>

            <p>
              Discover your current skills, identify skill
              gaps, and find the right learning path for
              your career.
            </p>

            <button
              onClick={() => {
                setShowAnalysis(true);
                setMessage("");
              }}
            >
              Start Skill Analysis
            </button>

          </div>

          <div className="dashboard-card">

            <h2>My Profile</h2>

            <p>
              <strong>Email:</strong> {email}
            </p>

            <button
              onClick={() => {
                setLoggedIn(false);
                setShowAnalysis(false);
                setShowResult(false);
                setAnalysisResult(null);
                setIsLogin(true);
                setMessage("");
                setPassword("");
              }}
            >
              Logout
            </button>

          </div>

        </div>
      </div>
    );
  }

  // =========================
  // LOGIN / REGISTER
  // =========================
  return (
    <div className="app">
      <div className="card">

        <h1>Skill Gap Analyzer</h1>

        <p className="subtitle">
          {isLogin
            ? "Login to continue your skill analysis"
            : "Create your account to analyze your skills"}
        </p>

        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleSubmit}>
          {isLogin ? "Login" : "Register"}
        </button>

        <p className="message">
          {message}
        </p>

        <div className="switch">

          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            type="button"
            className="switch-button"
            onClick={switchMode}
          >
            {isLogin ? "Register" : "Login"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default App;

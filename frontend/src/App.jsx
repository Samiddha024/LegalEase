import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { getDatabase, ref, set } from 'firebase/database';
// import { app } from './firebase';
import LandingPage from './Components/LandingPage';
import Auth from './Components/Auth';
import Dashboard from './Components/Dashboard';
import Summarizer from './Components/Summarizer';
import Drafter from './Components/Drafter';
import Chatbot from './Components/Chatbot';
import About from './Components/About';
import DocumnetQnA from './Components/DocumnetQnA';


// const db = getDatabase(app);

export default function App() {
  // const putData = () => {
  //   set(ref(db, 'users/Samiddha'), { 
  //     name: 'Samiddha', 
  //     email: 'john.doe@example.com', 
  //     age: 19 
  //   });
  // };

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Auth islogin={true} />} />
          <Route path="/signup" element={<Auth islogin={false} />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/summarizer" element={<Summarizer />} />
          <Route path="/drafter" element={<Drafter />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/documentQ&A" element={<DocumnetQnA/>} />
        </Routes>

        {/* Place the button inside the Router */}
        {/* <button onClick={putData}>Put Data</button> */}
      </div>

   
    </Router>
  );
}

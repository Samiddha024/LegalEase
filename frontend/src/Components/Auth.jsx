import { useState,useEffect } from 'react';
import { FileText, Mail, Lock, User } from 'lucide-react';
//import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
//import { app } from '../firebase'; // Make sure firebase is configured properly
import { useFirebase } from '../Context/firebase.jsx';
import { useNavigate } from 'react-router-dom';
//const auth = getAuth(app);


export default function Auth({ islogin }) {
  const [isLogin, setIsLogin] = useState(islogin);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null); // To handle errors
  const firebase=useFirebase();
  const navigate=useNavigate();

  // Function to create a user
  // const createUser = async (event) => {
  //   event.preventDefault(); // Prevent form submission
  //   setError(null); // Clear previous errors

  //   if (password.length < 6) {
  //     setError('Password must be at least 6 characters long.');
  //     return;
  //   }

  //   try {
  //     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  //     alert('Successfully created account for ' + userCredential.user.email);
  //   } catch (err) {
  //     setError(err.message); // Handle Firebase errors
  //   }
  // };

  // // Function to Sign In 
  // const SignIn = async (event) => {
    // event.preventDefault(); // Prevent form submission
    // setError(null); // Clear previous errors
    // try {
    //   const user = await signInWithEmailAndPassword(auth, email, password);
    //   alert('Successfully signed in ' + user.user.email);
    // } catch (err) {
    //   setError(err.message); // Handle Firebase errors
    // }
  // };
useEffect(() => {
  const checkAuthState = async () => {
    const user = await firebase.getCurrentUser(); // Assuming `getCurrentUser` is implemented in your firebase context
    if (user) {
      navigate('/dashboard'); // Redirect to the dashboard if logged in
    }
    
  };
  checkAuthState();
}, [firebase, navigate]);
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <FileText className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? 'Sign in to your account' : 'Create a new account'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={async (e) => {
  e.preventDefault(); // Prevent form submission
  try {
    if (isLogin) {
      await firebase.loginUserWithEmailAndPassword(email, password);
      alert('Successfully signed in!');
      navigate('/dashboard');
      // Handle successful login
    } else {
      await firebase.signupUserWithEmailAndPassword(email, password);
      alert('Successfully Account Created !');
      navigate('/dashboard');
      // Handle successful signup
    }
  } catch (err) {
    setError(err.message); // Set the error state to display the error
  }
}}
>
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="John Doe"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="you@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </div>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>} {/* Show error message */}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLogin ? 'Sign in' : 'Sign up'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {isLogin ? 'New to LegalEase?' : 'Already have an account?'}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLogin ? 'Create a new account' : 'Sign in to your account'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

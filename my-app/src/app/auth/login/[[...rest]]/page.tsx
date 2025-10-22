import { SignIn, useAuth, useUser } from '@clerk/nextjs';

import './page.css'

export default function Page() {

  return (
    <div className="LoginComponent">
      <div className="LoginComponent-in">
        <div className="login-one">
          <div className="login-one-one">
            <h1>Welcome Back</h1>
            <p>Log in to your DevLink</p>
          </div>

          <div className="login-one-two">
            <SignIn 
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
                  card: 'shadow-lg',
                  headerTitle: 'text-2xl font-bold',
                  headerSubtitle: 'text-gray-600',
                }
              }}
              redirectUrl="/dashboard"
            />
          </div>
        </div>

        <div className="login-two">
          <img
            src="https://i.pinimg.com/1200x/ef/78/99/ef7899d792526a5d10f33c30ad250617.jpg"
            alt="Login Image"
            width={400}
            height={400}
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>
    </div>
  );
}

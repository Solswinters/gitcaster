export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-5xl w-full">
        <h1 className="text-6xl font-bold text-center mb-8">
          Welcome to <span className="text-blue-600">GitCaster</span>
        </h1>
        
        <p className="text-xl text-center text-gray-600 mb-12">
          Showcase your GitHub presence on the blockchain with Talent Protocol
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-3">🔐 Secure Auth</h3>
            <p className="text-gray-600">
              Sign in with Ethereum and connect your GitHub account securely
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-3">📊 Analytics</h3>
            <p className="text-gray-600">
              Track and visualize your GitHub contributions and impact
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-3">🌐 Blockchain</h3>
            <p className="text-gray-600">
              Integrate with Talent Protocol for builder credentials
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

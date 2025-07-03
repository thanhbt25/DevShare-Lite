export default function Footer() {
  return (
    <footer className="bg-indigo-900 text-white p-6 mt-6">
      <div className="flex justify-between">
        <div className="w-1/3">
          <h2 className="font-bold text-lg mb-2">💻 DevShare Lite</h2>
          <p className="text-sm">
            DevShare Lite is a lightweight online forum for developers to share
            knowledge, ask technical questions, and connect with others in the IT
            community.
          </p>
          <div className="flex gap-4 mt-2">
            <span>🐱</span>
            <span>📸</span>
            <span>🔗</span>
          </div>
        </div>

        <div>
          <h3 className="font-bold">SITE MAP</h3>
          <ul className="text-sm">
            <li>Home</li>
            <li>Your question</li>
            <li>Save</li>
            <li>Tags</li>
            <li>User</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold">LEGAL</h3>
          <ul className="text-sm">
            <li>Privacy policy</li>
            <li>Terms of service</li>
            <li>Cookie policy</li>
          </ul>
        </div>
      </div>

      <p className="text-center text-sm mt-4">
        © 2025 Thanh Bùi. Built with ❤️ and ☕.
      </p>
    </footer>
  );
}
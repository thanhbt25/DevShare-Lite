import { FaGithub, FaInstagram, FaLinkedin, FaFacebook } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-indigo-900 text-white p-6 mt-6 font-sans">
      <div className="flex flex-col md:flex-row justify-between gap-12 max-w-6xl mx-auto">
        {/* Logo + About */}
        <div className="flex-1 min-w-[320px]">
          <div className="flex items-center mb-2">
            <img
              src="/images/devshare-lite-logo-white.png"
              alt="DevShare Lite Logo"
              className="w-32 h-100 rectangle"
            />
          </div>
          <p className="text-sm max-w-2xl">
            DevShare Lite is a lightweight online forum for developers to share
            knowledge, ask technical questions, and connect with others in the
            IT community. Built with simplicity and collaboration in mind, our
            goal is to create a supportive space for learning and growing together.
          </p>
          <div className="flex gap-4 mt-3">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <FaGithub className="w-6 h-6" />
            </a>
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram className="w-6 h-6" />
            </a>
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebook className="w-6 h-6" />
            </a>
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* Site Map */}
        <div className="flex-1 min-w-[200px] ml-72">
          <h3 className="font-bold mb-2">SITE MAP</h3>
          <ul className="text-sm space-y-1">
            <li>Home</li>
            <li>Your question</li>
            <li>Save</li>
            <li>Tags</li>
            <li>User</li>
          </ul>
        </div>

        {/* Legal */}
        <div className="flex-1 min-w-[200px]">
          <h3 className="font-bold mb-2">LEGAL</h3>
          <ul className="text-sm space-y-1">
            <li>Privacy policy</li>
            <li>Terms of service</li>
            <li>Cookie policy</li>
          </ul>
        </div>
      </div>

      <p className="text-center text-sm mt-6">
        © 2025 Thanh Bùi. Built with{' '}
        <span className="text-pink-400">♥</span> and{' '}
        <span className="text-yellow-300">☕</span>.
      </p>
    </footer>
  );
}

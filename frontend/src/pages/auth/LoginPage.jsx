import { useState } from 'react';
import axiosClient from '../../api/axiosClient';

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setFormError('');
    setIsSubmitting(true);

    try {
      const response = await axiosClient.post('/login', { email, password });
      const { user, token } = response.data;

      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));

      onLoginSuccess?.(user);
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
        setFormError(err.response.data.message || 'Please check the fields below.');
      } else {
        setFormError('Something went wrong. Check that the backend server is running.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#EDEEF0]">
      {/* Left panel — brand + asset-tag signature */}
      <div className="relative md:w-1/2 bg-[#10182B] text-[#EDEEF0] flex flex-col justify-between px-8 py-10 md:px-14 md:py-14 overflow-hidden">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-[6px] bg-[#C99A4B] flex items-center justify-center">
            <span className="font-mono text-[13px] font-bold text-[#10182B]">A</span>
          </div>
          <span className="font-medium tracking-wide text-sm text-[#8891A3]">
            ASSET &amp; INVENTORY MANAGEMENT
          </span>
        </div>

        <div className="mt-16 md:mt-0">
          <h1 className="font-[Space_Grotesk] text-[clamp(2rem,4vw,3rem)] leading-[1.05] font-medium max-w-md">
            Know where every asset lives.
          </h1>
          <p className="mt-4 text-[#8891A3] max-w-sm text-[15px] leading-relaxed">
            From procurement to retirement — track assignments, condition,
            and history in one ledger.
          </p>
        </div>

        {/* Asset-tag ticket stub — the signature element */}
        <div className="mt-16 md:mt-0 self-start">
          <div className="relative bg-[#1B2540] border border-[#2A3547] rounded-[10px] px-5 py-4 w-64">
            <div className="flex justify-between items-start">
              <span className="text-[10px] tracking-[0.15em] text-[#8891A3] uppercase">
                Asset Tag
              </span>
              <span className="h-2 w-2 rounded-full bg-[#4B9E76]" aria-hidden="true" />
            </div>
            <div className="mt-3 font-mono text-[#C99A4B] text-lg tracking-wider">
              AST-000129
            </div>
            {/* barcode motif */}
            <div className="mt-3 flex items-end gap-[2px] h-6" aria-hidden="true">
              {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 2, 4].map((h, i) => (
                <span
                  key={i}
                  className="bg-[#8891A3]/60 w-[2px]"
                  style={{ height: `${h * 5}px` }}
                />
              ))}
            </div>
            {/* perforated tear edge */}
            <div
              className="absolute -bottom-[9px] left-0 right-0 h-[18px]"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 8px 0px, #EDEEF0 8px, transparent 8.5px)',
                backgroundSize: '16px 18px',
                backgroundRepeat: 'repeat-x',
              }}
              aria-hidden="true"
            />
          </div>
        </div>

        <p className="text-xs text-[#8891A3] mt-16 md:mt-0">
          Internal use only — company-issued accounts.
        </p>
      </div>

      {/* Right panel — sign in form */}
      <div className="md:w-1/2 flex items-center justify-center px-8 py-14 md:px-16">
        <div className="w-full max-w-sm">
          <h2 className="font-[Space_Grotesk] text-2xl font-medium text-[#10182B]">
            Sign in
          </h2>
          <p className="mt-2 text-[#5B6472] text-[15px]">
            Enter your company email and password to continue.
          </p>

          {formError && (
            <div
              role="alert"
              className="mt-6 rounded-[8px] border border-[#E4B8A0] bg-[#FBEDE6] px-4 py-3 text-sm text-[#8A3E1F]"
            >
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#10182B] mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-[8px] border border-[#D5D8DD] bg-white px-3.5 py-2.5 text-[15px] text-[#10182B] outline-none focus:border-[#C99A4B] focus:ring-2 focus:ring-[#C99A4B]/30 transition"
                placeholder="you@company.com"
              />
              {errors.email && (
                <p className="mt-1.5 text-sm text-[#B23B1E]">{errors.email[0]}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#10182B] mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-[8px] border border-[#D5D8DD] bg-white px-3.5 py-2.5 text-[15px] text-[#10182B] outline-none focus:border-[#C99A4B] focus:ring-2 focus:ring-[#C99A4B]/30 transition"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1.5 text-sm text-[#B23B1E]">{errors.password[0]}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-[8px] bg-[#10182B] text-[#EDEEF0] font-medium py-2.5 text-[15px] transition hover:bg-[#1B2540] disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#10182B]/40 focus:ring-offset-2"
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
import AuthPage from "./AuthPage";

/**
 * Keeps your existing /register route working.
 * Renders the combined AuthPage with the Sign Up panel active by default.
 */
export default function RegisterPage() {
  return <AuthPage initialMode="signup" />;
}

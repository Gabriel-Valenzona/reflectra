import AuthPage from "./AuthPage";

/**
 * Keeps your existing /login route working.
 * Renders the combined AuthPage with the Sign In panel active by default.
 */
export default function LoginPage() {
  return <AuthPage initialMode="signin" />;
}

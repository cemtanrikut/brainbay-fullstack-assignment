import "./styles.css";
import Hello from "./components/Hello.jsx";
import Layout from "./components/Layout.jsx";

export default function App() {
  return (
    <Layout>
      <Hello name="Cem" />
    </Layout>
  );
}
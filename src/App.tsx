import "./App.css";
import { dispatch, useSelector } from "./store";

function Count() {
	const c = useSelector((s) => s.count);
	return <div>{c}</div>;
}

function Inc() {
	return <button onClick={() => dispatch.inc(1)}>inc</button>;
}
function App() {
	return (
		<>
			<Count />
			<Inc />
		</>
	);
}

export default App;

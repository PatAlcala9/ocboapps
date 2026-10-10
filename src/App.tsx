import { Title } from '@solidjs/meta';
import { Loading } from 'solid-js';
import { Router } from './router';
import '../design/app.sass';

export default function App() {
  return (
    <Router>
      {(props) => (
        <>
          <Title>Dasig App</Title>
          <Loading fallback={<main class='page-loading'>Rending Page</main>}>{props.children}</Loading>
        </>
      )}
    </Router>
  );
}

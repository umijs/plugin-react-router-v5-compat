import React from 'react';
import { history, Link } from 'umi';

export default function Layout(props: any) {
  console.log('rerender layout', props);
  return (
    <div>
      <h2>global layout</h2>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/users">/users</Link>
        </li>
        <li>
          <Link to="/users/foo">/users/foo</Link>
        </li>
        <li>
          <Link to="/users/123">/users/$id</Link>
        </li>
        <li>
          <Link to="/about">/about</Link>
        </li>
        <li>
          <Link to="/class-component/123">/class-component</Link>
        </li>
      </ul>
      <button
        onClick={() => {
          history.push('/about');
        }}
      >
        go to /about
      </button>
      <button
        onClick={() => {
          history.replace('/about');
        }}
      >
        replace to /about
      </button>
      {props.children}
    </div>
  );
}

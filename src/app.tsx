import React from 'react';
import { ActionFunctionArgs, Link } from 'react-router-dom';
import {
  Await,
  createBrowserRouter,
  defer,
  Form,
  Outlet,
  RouterProvider,
  useLoaderData,
  useRouteError,
} from 'react-router-dom';

import { client, PostObj } from './data';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    loader: rootLoader,
    errorElement: <Error />,
    children: [
      {
        path: 'poster',
        element: <Poster />,
        errorElement: <Error />,
      },
      {
        path: 'postee',
        action: posteeAction,
        errorElement: <Error />,
      },
    ],
  },
]);

if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose());
}

export default function App() {
  return <RouterProvider router={router} />;
}

function Error() {
  const error = useRouteError() as object;
  const errorMessage: string =
    'statusText' in error
      ? (error.statusText as string)
      : 'message' in error
      ? (error.message as string)
      : 'Unknown error';
  return <div>Error: {errorMessage}</div>;
}

async function rootLoader() {
  return defer({ fact: client.getCatFact() });
}
function Root() {
  const data = useLoaderData() as { fact: string };

  return (
    <div>
      <React.Suspense fallback={<p>loading...</p>}>
        <Await
          resolve={data.fact}
          children={(fact: string) => (
            <>
              <nav>
                <ul>
                  <li>
                    <Link to="poster">Form</Link>
                  </li>
                </ul>
              </nav>
              <div>{fact}</div>
              <hr />
              <Outlet context={fact} />
            </>
          )}
        />
      </React.Suspense>
    </div>
  );
}
const postObj: PostObj = { some: 'value' };

function Poster() {
  return (
    <Form method="post" action="/postee">
      <input type="hidden" name="some" value={postObj.some} />
      <button>Post</button>
    </Form>
  );
}

async function posteeAction({ request }: ActionFunctionArgs) {
  if (request.method === 'POST') {
    const data = Object.fromEntries(await request.formData());
    const res = await client.failPOST(data as PostObj);

    if (res.status !== 200) throw res;
  }
}

import { environment } from '../../environments/environment';

import { JsonEditor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';
import React from 'react';
import _ from 'lodash';
import { useKAuth } from '../contexts/koivel-auth';

export function DevPage() {
  const searchEditor = React.useRef(null);
  const esSearchEditor = React.useRef(null);
  const esResultsEditor = React.useRef(null);
  const resultsEditor = React.useRef(null);

  const { accessTokenRef } = useKAuth();
  async function fireSearch() {
    const search = searchEditor.current.jsonEditor.get();
    _.set(search, 'options.debug', true);
    const response = await fetch(
      environment.koivelApiUrl + '/event-api/events/search',
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + accessTokenRef.current,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(search),
      }
    );
    const json = await response.json();
    esResultsEditor.current.jsonEditor.set(json.esResult);
    esSearchEditor.current.jsonEditor.set(json.esQuery);
    resultsEditor.current.jsonEditor.set(json.result);
  }

  return (
    <>
      <div className="grid grid-cols-2 p-4 gap-6 w-full h-5/6">
        <JsonEditor ref={searchEditor} mode="code" value={{}} />
        <JsonEditor ref={esSearchEditor} mode="code" value={{}} />
        <JsonEditor ref={esResultsEditor} mode="code" value={{}} />
        <JsonEditor ref={resultsEditor} mode="code" value={{}} />
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={fireSearch}
      >
        execute
      </button>
    </>
  );
}

export default DevPage;

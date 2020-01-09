/**
 * @flow
 * @relayHash 9a5ef2c638fb82654c0c28bac7b065a6
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type AppQueryVariables = {||};
export type AppQueryResponse = {|
  +getTempNow: ?$ReadOnlyArray<?{|
    +loc: ?string,
    +times: ?$ReadOnlyArray<?string>,
    +values: ?$ReadOnlyArray<?number>,
  |}>,
  +getTemp: ?$ReadOnlyArray<?{|
    +loc: ?string,
    +times: ?$ReadOnlyArray<?string>,
    +values: ?$ReadOnlyArray<?number>,
  |}>,
  +getHumid: ?$ReadOnlyArray<?{|
    +loc: ?string,
    +times: ?$ReadOnlyArray<?string>,
    +values: ?$ReadOnlyArray<?number>,
  |}>,
  +getLight: ?$ReadOnlyArray<?{|
    +loc: ?string,
    +times: ?$ReadOnlyArray<?string>,
    +values: ?$ReadOnlyArray<?number>,
  |}>,
|};
export type AppQuery = {|
  variables: AppQueryVariables,
  response: AppQueryResponse,
|};
*/


/*
query AppQuery {
  getTempNow {
    loc
    times
    values
  }
  getTemp {
    loc
    times
    values
  }
  getHumid {
    loc
    times
    values
  }
  getLight {
    loc
    times
    values
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "loc",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "times",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "values",
    "args": null,
    "storageKey": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "getTempNow",
    "storageKey": null,
    "args": null,
    "concreteType": "Ds",
    "plural": true,
    "selections": (v0/*: any*/)
  },
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "getTemp",
    "storageKey": null,
    "args": null,
    "concreteType": "Ds",
    "plural": true,
    "selections": (v0/*: any*/)
  },
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "getHumid",
    "storageKey": null,
    "args": null,
    "concreteType": "Ds",
    "plural": true,
    "selections": (v0/*: any*/)
  },
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "getLight",
    "storageKey": null,
    "args": null,
    "concreteType": "Ds",
    "plural": true,
    "selections": (v0/*: any*/)
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "AppQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "AppQuery",
    "argumentDefinitions": [],
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "query",
    "name": "AppQuery",
    "id": null,
    "text": "query AppQuery {\n  getTempNow {\n    loc\n    times\n    values\n  }\n  getTemp {\n    loc\n    times\n    values\n  }\n  getHumid {\n    loc\n    times\n    values\n  }\n  getLight {\n    loc\n    times\n    values\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'dbe3703babbedbfa1974838ab9c46d40';
module.exports = node;

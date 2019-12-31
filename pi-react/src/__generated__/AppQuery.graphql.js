/**
 * @flow
 * @relayHash 7b01e6275f11237dffa93dfca848186f
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type AppQueryVariables = {||};
export type AppQueryResponse = {|
  +getTemps: ?$ReadOnlyArray<?{|
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
  getTemps {
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
    "name": "getTemps",
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
    "text": "query AppQuery {\n  getTemps {\n    loc\n    times\n    values\n  }\n  getHumid {\n    loc\n    times\n    values\n  }\n  getLight {\n    loc\n    times\n    values\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '5c3fc84fc4b15b52dc23e8aa88d5cc8d';
module.exports = node;

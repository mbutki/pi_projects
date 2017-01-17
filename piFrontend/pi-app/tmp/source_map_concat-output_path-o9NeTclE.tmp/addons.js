define('ember-ajax/ajax-request', ['exports', 'ember', 'ember-ajax/mixins/ajax-request'], function (exports, _ember, _emberAjaxMixinsAjaxRequest) {
  'use strict';

  var EmberObject = _ember['default'].Object;

  exports['default'] = EmberObject.extend(_emberAjaxMixinsAjaxRequest['default']);
});
define('ember-ajax/errors', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  exports.AjaxError = AjaxError;
  exports.InvalidError = InvalidError;
  exports.UnauthorizedError = UnauthorizedError;
  exports.ForbiddenError = ForbiddenError;
  exports.BadRequestError = BadRequestError;
  exports.NotFoundError = NotFoundError;
  exports.TimeoutError = TimeoutError;
  exports.AbortError = AbortError;
  exports.ConflictError = ConflictError;
  exports.ServerError = ServerError;
  exports.isAjaxError = isAjaxError;
  exports.isUnauthorizedError = isUnauthorizedError;
  exports.isForbiddenError = isForbiddenError;
  exports.isInvalidError = isInvalidError;
  exports.isBadRequestError = isBadRequestError;
  exports.isNotFoundError = isNotFoundError;
  exports.isTimeoutError = isTimeoutError;
  exports.isAbortError = isAbortError;
  exports.isConflictError = isConflictError;
  exports.isServerError = isServerError;
  exports.isSuccess = isSuccess;

  var EmberError = _ember['default'].Error;

  /**
   * @class AjaxError
   * @private
   */

  function AjaxError(errors) {
    var message = arguments.length <= 1 || arguments[1] === undefined ? 'Ajax operation failed' : arguments[1];

    EmberError.call(this, message);

    this.errors = errors || [{
      title: 'Ajax Error',
      detail: message
    }];
  }

  AjaxError.prototype = Object.create(EmberError.prototype);

  /**
   * @class InvalidError
   * @public
   * @extends AjaxError
   */

  function InvalidError(errors) {
    AjaxError.call(this, errors, 'Request was rejected because it was invalid');
  }

  InvalidError.prototype = Object.create(AjaxError.prototype);

  /**
   * @class UnauthorizedError
   * @public
   * @extends AjaxError
   */

  function UnauthorizedError(errors) {
    AjaxError.call(this, errors, 'Ajax authorization failed');
  }

  UnauthorizedError.prototype = Object.create(AjaxError.prototype);

  /**
   * @class ForbiddenError
   * @public
   * @extends AjaxError
   */

  function ForbiddenError(errors) {
    AjaxError.call(this, errors, 'Request was rejected because user is not permitted to perform this operation.');
  }

  ForbiddenError.prototype = Object.create(AjaxError.prototype);

  /**
   * @class BadRequestError
   * @public
   * @extends AjaxError
   */

  function BadRequestError(errors) {
    AjaxError.call(this, errors, 'Request was formatted incorrectly.');
  }

  BadRequestError.prototype = Object.create(AjaxError.prototype);

  /**
   * @class NotFoundError
   * @public
   * @extends AjaxError
   */

  function NotFoundError(errors) {
    AjaxError.call(this, errors, 'Resource was not found.');
  }

  NotFoundError.prototype = Object.create(AjaxError.prototype);

  /**
   * @class TimeoutError
   * @public
   * @extends AjaxError
   */

  function TimeoutError() {
    AjaxError.call(this, null, 'The ajax operation timed out');
  }

  TimeoutError.prototype = Object.create(AjaxError.prototype);

  /**
   * @class AbortError
   * @public
   * @extends AjaxError
   */

  function AbortError() {
    AjaxError.call(this, null, 'The ajax operation was aborted');
  }

  AbortError.prototype = Object.create(AjaxError.prototype);

  /**
   * @class ConflictError
   * @public
   * @extends AjaxError
   */

  function ConflictError(errors) {
    AjaxError.call(this, errors, 'The ajax operation failed due to a conflict');
  }

  ConflictError.prototype = Object.create(AjaxError.prototype);

  /**
   * @class ServerError
   * @public
   * @extends AjaxError
   */

  function ServerError(errors) {
    AjaxError.call(this, errors, 'Request was rejected due to server error');
  }

  ServerError.prototype = Object.create(AjaxError.prototype);

  /**
   * Checks if the given error is or inherits from AjaxError
   *
   * @method isAjaxError
   * @public
   * @param  {Error} error
   * @return {Boolean}
   */

  function isAjaxError(error) {
    return error instanceof AjaxError;
  }

  /**
   * Checks if the given status code or AjaxError object represents an
   * unauthorized request error
   *
   * @method isUnauthorizedError
   * @public
   * @param  {Number | AjaxError} error
   * @return {Boolean}
   */

  function isUnauthorizedError(error) {
    if (isAjaxError(error)) {
      return error instanceof UnauthorizedError;
    } else {
      return error === 401;
    }
  }

  /**
   * Checks if the given status code or AjaxError object represents a forbidden
   * request error
   *
   * @method isForbiddenError
   * @public
   * @param  {Number | AjaxError} error
   * @return {Boolean}
   */

  function isForbiddenError(error) {
    if (isAjaxError(error)) {
      return error instanceof ForbiddenError;
    } else {
      return error === 403;
    }
  }

  /**
   * Checks if the given status code or AjaxError object represents an invalid
   * request error
   *
   * @method isInvalidError
   * @public
   * @param  {Number | AjaxError} error
   * @return {Boolean}
   */

  function isInvalidError(error) {
    if (isAjaxError(error)) {
      return error instanceof InvalidError;
    } else {
      return error === 422;
    }
  }

  /**
   * Checks if the given status code or AjaxError object represents a bad request
   * error
   *
   * @method isBadRequestError
   * @public
   * @param  {Number | AjaxError} error
   * @return {Boolean}
   */

  function isBadRequestError(error) {
    if (isAjaxError(error)) {
      return error instanceof BadRequestError;
    } else {
      return error === 400;
    }
  }

  /**
   * Checks if the given status code or AjaxError object represents a
   * "not found" error
   *
   * @method isNotFoundError
   * @public
   * @param  {Number | AjaxError} error
   * @return {Boolean}
   */

  function isNotFoundError(error) {
    if (isAjaxError(error)) {
      return error instanceof NotFoundError;
    } else {
      return error === 404;
    }
  }

  /**
   * Checks if the given status code or AjaxError object represents a
   * "timeout" error
   *
   * @method isTimeoutError
   * @public
   * @param  {AjaxError} error
   * @return {Boolean}
   */

  function isTimeoutError(error) {
    return error instanceof TimeoutError;
  }

  /**
   * Checks if the given status code or AjaxError object represents an
   * "abort" error
   *
   * @method isAbortError
   * @public
   * @param  {AjaxError} error
   * @return {Boolean}
   */

  function isAbortError(error) {
    return error instanceof AbortError;
  }

  /**
   * Checks if the given status code or AjaxError object represents a
   * conflict error
   *
   * @method isConflictError
   * @public
   * @param  {Number | AjaxError} error
   * @return {Boolean}
   */

  function isConflictError(error) {
    if (isAjaxError(error)) {
      return error instanceof ConflictError;
    } else {
      return error === 409;
    }
  }

  /**
   * Checks if the given status code or AjaxError object represents a server error
   *
   * @method isServerError
   * @public
   * @param  {Number | AjaxError} error
   * @return {Boolean}
   */

  function isServerError(error) {
    if (isAjaxError(error)) {
      return error instanceof ServerError;
    } else {
      return error >= 500 && error < 600;
    }
  }

  /**
   * Checks if the given status code represents a successful request
   *
   * @method isSuccess
   * @public
   * @param  {Number} status
   * @return {Boolean}
   */

  function isSuccess(status) {
    var s = parseInt(status, 10);
    return s >= 200 && s < 300 || s === 304;
  }
});
define('ember-ajax/index', ['exports', 'ember-ajax/request'], function (exports, _emberAjaxRequest) {
  'use strict';

  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberAjaxRequest['default'];
    }
  });
});
define('ember-ajax/mixins/ajax-request', ['exports', 'ember', 'ember-ajax/errors', 'ember-ajax/utils/parse-response-headers', 'ember-ajax/utils/get-header', 'ember-ajax/utils/url-helpers', 'ember-ajax/utils/ajax'], function (exports, _ember, _emberAjaxErrors, _emberAjaxUtilsParseResponseHeaders, _emberAjaxUtilsGetHeader, _emberAjaxUtilsUrlHelpers, _emberAjaxUtilsAjax) {
  'use strict';

  var $ = _ember['default'].$;
  var A = _ember['default'].A;
  var EmberError = _ember['default'].Error;
  var Logger = _ember['default'].Logger;
  var Mixin = _ember['default'].Mixin;
  var Promise = _ember['default'].RSVP.Promise;
  var Test = _ember['default'].Test;
  var get = _ember['default'].get;
  var isArray = _ember['default'].isArray;
  var isEmpty = _ember['default'].isEmpty;
  var isNone = _ember['default'].isNone;
  var merge = _ember['default'].merge;
  var run = _ember['default'].run;
  var runInDebug = _ember['default'].runInDebug;
  var testing = _ember['default'].testing;
  var warn = _ember['default'].warn;

  var JSONAPIContentType = /^application\/vnd\.api\+json/i;

  function isJSONAPIContentType(header) {
    if (isNone(header)) {
      return false;
    }
    return !!header.match(JSONAPIContentType);
  }

  function startsWithSlash(string) {
    return string.charAt(0) === '/';
  }

  function endsWithSlash(string) {
    return string.charAt(string.length - 1) === '/';
  }

  function stripSlashes(path) {
    // make sure path starts with `/`
    if (startsWithSlash(path)) {
      path = path.substring(1);
    }

    // remove end `/`
    if (endsWithSlash(path)) {
      path = path.slice(0, -1);
    }
    return path;
  }

  function isObject(object) {
    return typeof object === 'object';
  }

  function isString(object) {
    return typeof object === 'string';
  }

  var pendingRequestCount = 0;
  if (testing) {
    Test.registerWaiter(function () {
      return pendingRequestCount === 0;
    });
  }

  /**
   * AjaxRequest Mixin
   *
   * @public
   * @mixin
   */
  exports['default'] = Mixin.create({

    /**
     * The default value for the request `contentType`
     *
     * For now, defaults to the same value that jQuery would assign.  In the
     * future, the default value will be for JSON requests.
     * @property {string} contentType
     * @public
     * @default
     */
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',

    /**
     * Headers to include on the request
     *
     * Some APIs require HTTP headers, e.g. to provide an API key. Arbitrary
     * headers can be set as key/value pairs on the `RESTAdapter`'s `headers`
     * object and Ember Data will send them along with each ajax request.
     *
     * ```javascript
     * // app/services/ajax.js
     * import AjaxService from 'ember-ajax/services/ajax';
     *
     * export default AjaxService.extend({
     *   headers: {
     *     'API_KEY': 'secret key',
     *     'ANOTHER_HEADER': 'Some header value'
     *   }
     * });
     * ```
     *
     * `headers` can also be used as a computed property to support dynamic
     * headers.
     *
     * ```javascript
     * // app/services/ajax.js
     * import Ember from 'ember';
     * import AjaxService from 'ember-ajax/services/ajax';
     *
     * const {
     *   computed,
     *   get,
     *   inject: { service }
     * } = Ember;
     *
     * export default AjaxService.extend({
     *   session: service(),
     *   headers: computed('session.authToken', function() {
     *     return {
     *       'API_KEY': get(this, 'session.authToken'),
     *       'ANOTHER_HEADER': 'Some header value'
     *     };
     *   })
     * });
     * ```
     *
     * In some cases, your dynamic headers may require data from some object
     * outside of Ember's observer system (for example `document.cookie`). You
     * can use the `volatile` function to set the property into a non-cached mode
     * causing the headers to be recomputed with every request.
     *
     * ```javascript
     * // app/services/ajax.js
     * import Ember from 'ember';
     * import AjaxService from 'ember-ajax/services/ajax';
     *
     * const {
     *   computed,
     *   get,
     *   inject: { service }
     * } = Ember;
     *
     * export default AjaxService.extend({
     *   session: service(),
     *   headers: computed('session.authToken', function() {
     *     return {
     *       'API_KEY': get(document.cookie.match(/apiKey\=([^;]*)/), '1'),
     *       'ANOTHER_HEADER': 'Some header value'
     *     };
     *   }).volatile()
     * });
     * ```
     *
     * @property {Object} headers
     * @public
     * @default
     */
    headers: {},

    /**
     * Make an AJAX request, ignoring the raw XHR object and dealing only with
     * the response
     *
     * @method request
     * @public
     * @param {string} url The url to make a request to
     * @param {Object} options The options for the request
     * @return {Promise} The result of the request
     */
    request: function request(url, options) {
      var _this = this;

      var hash = this.options(url, options);
      return new Promise(function (resolve, reject) {
        _this._makeRequest(hash).then(function (_ref) {
          var response = _ref.response;

          resolve(response);
        })['catch'](function (_ref2) {
          var response = _ref2.response;

          reject(response);
        });
      }, 'ember-ajax: ' + hash.type + ' ' + hash.url + ' response');
    },

    /**
     * Make an AJAX request, returning the raw XHR object along with the response
     *
     * @method raw
     * @public
     * @param {string} url The url to make a request to
     * @param {Object} options The options for the request
     * @return {Promise} The result of the request
     */
    raw: function raw(url, options) {
      var hash = this.options(url, options);
      return this._makeRequest(hash);
    },

    /**
     * Shared method to actually make an AJAX request
     *
     * @method _makeRequest
     * @private
     * @param {Object} hash The options for the request
     * @param {string} hash.url The URL to make the request to
     * @return {Promise} The result of the request
     */
    _makeRequest: function _makeRequest(hash) {
      var _this2 = this;

      var requestData = {
        type: hash.type,
        url: hash.url
      };

      if (isJSONAPIContentType((0, _emberAjaxUtilsGetHeader['default'])(hash.headers, 'Content-Type')) && requestData.type !== 'GET') {
        if (typeof hash.data === 'object') {
          hash.data = JSON.stringify(hash.data);
        }
      }

      return new Promise(function (resolve, reject) {
        hash.success = function (payload, textStatus, jqXHR) {
          var response = _this2.handleResponse(jqXHR.status, (0, _emberAjaxUtilsParseResponseHeaders['default'])(jqXHR.getAllResponseHeaders()), payload, requestData);

          pendingRequestCount = pendingRequestCount - 1;

          if ((0, _emberAjaxErrors.isAjaxError)(response)) {
            run.join(null, reject, { payload: payload, textStatus: textStatus, jqXHR: jqXHR, response: response });
          } else {
            run.join(null, resolve, { payload: payload, textStatus: textStatus, jqXHR: jqXHR, response: response });
          }
        };

        hash.error = function (jqXHR, textStatus, errorThrown) {
          runInDebug(function () {
            var message = 'The server returned an empty string for ' + requestData.type + ' ' + requestData.url + ', which cannot be parsed into a valid JSON. Return either null or {}.';
            var validJSONString = !(textStatus === 'parsererror' && jqXHR.responseText === '');
            warn(message, validJSONString, {
              id: 'ds.adapter.returned-empty-string-as-JSON'
            });
          });

          var payload = _this2.parseErrorResponse(jqXHR.responseText) || errorThrown;
          var response = undefined;

          if (errorThrown instanceof Error) {
            response = errorThrown;
          } else if (textStatus === 'timeout') {
            response = new _emberAjaxErrors.TimeoutError();
          } else if (textStatus === 'abort') {
            response = new _emberAjaxErrors.AbortError();
          } else {
            response = _this2.handleResponse(jqXHR.status, (0, _emberAjaxUtilsParseResponseHeaders['default'])(jqXHR.getAllResponseHeaders()), payload, requestData);
          }

          pendingRequestCount = pendingRequestCount - 1;

          run.join(null, reject, { payload: payload, textStatus: textStatus, jqXHR: jqXHR, errorThrown: errorThrown, response: response });
        };

        pendingRequestCount = pendingRequestCount + 1;

        (0, _emberAjaxUtilsAjax['default'])(hash);
      }, 'ember-ajax: ' + hash.type + ' ' + hash.url);
    },

    /**
     * calls `request()` but forces `options.type` to `POST`
     *
     * @method post
     * @public
     * @param {string} url The url to make a request to
     * @param {Object} options The options for the request
     * @return {Promise} The result of the request
     */
    post: function post(url, options) {
      return this.request(url, this._addTypeToOptionsFor(options, 'POST'));
    },

    /**
     * calls `request()` but forces `options.type` to `PUT`
     *
     * @method put
     * @public
     * @param {string} url The url to make a request to
     * @param {Object} options The options for the request
     * @return {Promise} The result of the request
     */
    put: function put(url, options) {
      return this.request(url, this._addTypeToOptionsFor(options, 'PUT'));
    },

    /**
     * calls `request()` but forces `options.type` to `PATCH`
     *
     * @method patch
     * @public
     * @param {string} url The url to make a request to
     * @param {Object} options The options for the request
     * @return {Promise} The result of the request
     */
    patch: function patch(url, options) {
      return this.request(url, this._addTypeToOptionsFor(options, 'PATCH'));
    },

    /**
     * calls `request()` but forces `options.type` to `DELETE`
     *
     * @method del
     * @public
     * @param {string} url The url to make a request to
     * @param {Object} options The options for the request
     * @return {Promise} The result of the request
     */
    del: function del(url, options) {
      return this.request(url, this._addTypeToOptionsFor(options, 'DELETE'));
    },

    /**
     * calls `request()` but forces `options.type` to `DELETE`
     *
     * Alias for `del()`
     *
     * @method delete
     * @public
     * @param {string} url The url to make a request to
     * @param {Object} options The options for the request
     * @return {Promise} The result of the request
     */
    'delete': function _delete() {
      return this.del.apply(this, arguments);
    },

    /**
     * Wrap the `.get` method so that we issue a warning if
     *
     * Since `.get` is both an AJAX pattern _and_ an Ember pattern, we want to try
     * to warn users when they try using `.get` to make a request
     *
     * @method get
     * @public
     */
    get: function get(url) {
      if (arguments.length > 1 || url.charAt(0) === '/') {
        throw new EmberError('It seems you tried to use `.get` to make a request! Use the `.request` method instead.');
      }
      return this._super.apply(this, arguments);
    },

    /**
     * Manipulates the options hash to include the HTTP method on the type key
     *
     * @method _addTypeToOptionsFor
     * @private
     * @param {Object} options The original request options
     * @param {string} method The method to enforce
     * @return {Object} The new options, with the method set
     */
    _addTypeToOptionsFor: function _addTypeToOptionsFor(options, method) {
      options = options || {};
      options.type = method;
      return options;
    },

    /**
     * Get the full "headers" hash, combining the service-defined headers with
     * the ones provided for the request
     *
     * @method _getFullHeadersHash
     * @private
     * @param {Object} headers
     * @return {Object}
     */
    _getFullHeadersHash: function _getFullHeadersHash(headers) {
      var classHeaders = get(this, 'headers');
      var _headers = merge({}, classHeaders);
      return merge(_headers, headers);
    },

    /**
     * @method options
     * @private
     * @param {string} url
     * @param {Object} options
     * @return {Object}
     */
    options: function options(url) {
      var _options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      _options.url = this._buildURL(url, _options);
      _options.type = _options.type || 'GET';
      _options.dataType = _options.dataType || 'json';
      _options.contentType = isEmpty(_options.contentType) ? get(this, 'contentType') : _options.contentType;

      if (this._shouldSendHeaders(_options)) {
        _options.headers = this._getFullHeadersHash(_options.headers);
      } else {
        _options.headers = _options.headers || {};
      }

      return _options;
    },

    /**
     * Build a URL for a request
     *
     * If the provided `url` is deemed to be a complete URL, it will be returned
     * directly.  If it is not complete, then the segment provided will be combined
     * with the `host` and `namespace` options of the request class to create the
     * full URL.
     *
     * @private
     * @param {string} url the url, or url segment, to request
     * @param {Object} [options={}] the options for the request being made
     * @param {string} [options.host] the host to use for this request
     * @returns {string} the URL to make a request to
     */
    _buildURL: function _buildURL(url) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var urlObject = new _emberAjaxUtilsUrlHelpers.RequestURL(url);

      // If the URL passed is not relative, return the whole URL
      if (urlObject.isComplete) {
        return urlObject.href;
      }

      var host = options.host || get(this, 'host');
      var namespace = options.namespace || get(this, 'namespace');
      if (namespace) {
        namespace = stripSlashes(namespace);
      }

      // If the URL has already been constructed (presumably, by Ember Data), then we should just leave it alone
      var hasNamespaceRegex = new RegExp('^(/)?' + namespace);
      if (hasNamespaceRegex.test(url)) {
        return url;
      }

      var fullUrl = '';
      // Add the host, if it exists
      if (host) {
        fullUrl += host;
      }
      // Add the namespace, if it exists
      if (namespace) {
        if (!endsWithSlash(fullUrl)) {
          fullUrl += '/';
        }
        fullUrl += namespace;
      }
      // Add the URL segment, if it exists
      if (url) {
        if (!startsWithSlash(url)) {
          fullUrl += '/';
        }
        fullUrl += url;
      }

      return fullUrl;
    },

    /**
     * Takes an ajax response, and returns the json payload or an error.
     *
     * By default this hook just returns the json payload passed to it.
     * You might want to override it in two cases:
     *
     * 1. Your API might return useful results in the response headers.
     *    Response headers are passed in as the second argument.
     *
     * 2. Your API might return errors as successful responses with status code
     *    200 and an Errors text or object.
     *
     * @method handleResponse
     * @private
     * @param  {Number} status
     * @param  {Object} headers
     * @param  {Object} payload
     * @param  {Object} requestData the original request information
     * @return {Object | AjaxError} response
     */
    handleResponse: function handleResponse(status, headers, payload, requestData) {
      payload = payload === null || payload === undefined ? {} : payload;
      var errors = this.normalizeErrorResponse(status, headers, payload);

      if (this.isSuccess(status, headers, payload)) {
        return payload;
      } else if (this.isUnauthorizedError(status, headers, payload)) {
        return new _emberAjaxErrors.UnauthorizedError(errors);
      } else if (this.isForbiddenError(status, headers, payload)) {
        return new _emberAjaxErrors.ForbiddenError(errors);
      } else if (this.isInvalidError(status, headers, payload)) {
        return new _emberAjaxErrors.InvalidError(errors);
      } else if (this.isBadRequestError(status, headers, payload)) {
        return new _emberAjaxErrors.BadRequestError(errors);
      } else if (this.isNotFoundError(status, headers, payload)) {
        return new _emberAjaxErrors.NotFoundError(errors);
      } else if (this.isAbortError(status, headers, payload)) {
        return new _emberAjaxErrors.AbortError(errors);
      } else if (this.isConflictError(status, headers, payload)) {
        return new _emberAjaxErrors.ConflictError(errors);
      } else if (this.isServerError(status, headers, payload)) {
        return new _emberAjaxErrors.ServerError(errors);
      }

      var detailedMessage = this.generateDetailedMessage(status, headers, payload, requestData);
      return new _emberAjaxErrors.AjaxError(errors, detailedMessage);
    },

    /**
     * Match the host to a provided array of strings or regexes that can match to a host
     *
     * @method matchHosts
     * @private
     * @param {string} host the host you are sending too
     * @param {RegExp | string} matcher a string or regex that you can match the host to.
     * @returns {Boolean} if the host passed the matcher
     */
    _matchHosts: function _matchHosts(host, matcher) {
      if (matcher.constructor === RegExp) {
        return matcher.test(host);
      } else if (typeof matcher === 'string') {
        return matcher === host;
      } else {
        Logger.warn('trustedHosts only handles strings or regexes.', matcher, 'is neither.');
        return false;
      }
    },

    /**
     * Determine whether the headers should be added for this request
     *
     * This hook is used to help prevent sending headers to every host, regardless
     * of the destination, since this could be a security issue if authentication
     * tokens are accidentally leaked to third parties.
     *
     * To avoid that problem, subclasses should utilize the `headers` computed
     * property to prevent authentication from being sent to third parties, or
     * implement this hook for more fine-grain control over when headers are sent.
     *
     * By default, the headers are sent if the host of the request matches the
     * `host` property designated on the class.
     *
     * @method _shouldSendHeaders
     * @private
     * @property {Object} hash request options hash
     * @returns {Boolean} whether or not headers should be sent
     */
    _shouldSendHeaders: function _shouldSendHeaders(_ref3) {
      var _this3 = this;

      var url = _ref3.url;
      var host = _ref3.host;

      url = url || '';
      host = host || get(this, 'host') || '';

      var urlObject = new _emberAjaxUtilsUrlHelpers.RequestURL(url);
      var trustedHosts = get(this, 'trustedHosts') || A();

      // Add headers on relative URLs
      if (!urlObject.isComplete) {
        return true;
      } else if (trustedHosts.find(function (matcher) {
        return _this3._matchHosts(urlObject.hostname, matcher);
      })) {
        return true;
      }

      // Add headers on matching host
      var hostObject = new _emberAjaxUtilsUrlHelpers.RequestURL(host);
      return urlObject.sameHost(hostObject);
    },

    /**
     * Generates a detailed ("friendly") error message, with plenty
     * of information for debugging (good luck!)
     *
     * @method generateDetailedMessage
     * @private
     * @param  {Number} status
     * @param  {Object} headers
     * @param  {Object} payload
     * @param  {Object} requestData the original request information
     * @return {Object} request information
     */
    generateDetailedMessage: function generateDetailedMessage(status, headers, payload, requestData) {
      var shortenedPayload = undefined;
      var payloadContentType = (0, _emberAjaxUtilsGetHeader['default'])(headers, 'Content-Type') || 'Empty Content-Type';

      if (payloadContentType.toLowerCase() === 'text/html' && payload.length > 250) {
        shortenedPayload = '[Omitted Lengthy HTML]';
      } else {
        shortenedPayload = JSON.stringify(payload);
      }

      var requestDescription = requestData.type + ' ' + requestData.url;
      var payloadDescription = 'Payload (' + payloadContentType + ')';

      return ['Ember AJAX Request ' + requestDescription + ' returned a ' + status, payloadDescription, shortenedPayload].join('\n');
    },

    /**
     * Default `handleResponse` implementation uses this hook to decide if the
     * response is a an authorized error.
     *
     * @method isUnauthorizedError
     * @private
     * @param {Number} status
     * @param {Object} headers
     * @param {Object} payload
     * @return {Boolean}
     */
    isUnauthorizedError: function isUnauthorizedError(status) {
      return (0, _emberAjaxErrors.isUnauthorizedError)(status);
    },

    /**
     * Default `handleResponse` implementation uses this hook to decide if the
     * response is a forbidden error.
     *
     * @method isForbiddenError
     * @private
     * @param {Number} status
     * @param {Object} headers
     * @param {Object} payload
     * @return {Boolean}
     */
    isForbiddenError: function isForbiddenError(status) {
      return (0, _emberAjaxErrors.isForbiddenError)(status);
    },

    /**
     * Default `handleResponse` implementation uses this hook to decide if the
     * response is a an invalid error.
     *
     * @method isInvalidError
     * @private
     * @param {Number} status
     * @param {Object} headers
     * @param {Object} payload
     * @return {Boolean}
     */
    isInvalidError: function isInvalidError(status) {
      return (0, _emberAjaxErrors.isInvalidError)(status);
    },

    /**
     * Default `handleResponse` implementation uses this hook to decide if the
     * response is a bad request error.
     *
     * @method isBadRequestError
     * @private
     * @param {Number} status
     * @param {Object} headers
     * @param {Object} payload
     * @return {Boolean}
     */
    isBadRequestError: function isBadRequestError(status) {
      return (0, _emberAjaxErrors.isBadRequestError)(status);
    },

    /**
     * Default `handleResponse` implementation uses this hook to decide if the
     * response is a "not found" error.
     *
     * @method isNotFoundError
     * @private
     * @param {Number} status
     * @param {Object} headers
     * @param {Object} payload
     * @return {Boolean}
     */
    isNotFoundError: function isNotFoundError(status) {
      return (0, _emberAjaxErrors.isNotFoundError)(status);
    },

    /**
     * Default `handleResponse` implementation uses this hook to decide if the
     * response is an "abort" error.
     *
     * @method isAbortError
     * @private
     * @param {Number} status
     * @param {Object} headers
     * @param {Object} payload
     * @return {Boolean}
     */
    isAbortError: function isAbortError(status) {
      return (0, _emberAjaxErrors.isAbortError)(status);
    },

    /**
     * Default `handleResponse` implementation uses this hook to decide if the
     * response is a "conflict" error.
     *
     * @method isConflictError
     * @private
     * @param {Number} status
     * @param {Object} headers
     * @param {Object} payload
     * @return {Boolean}
     */
    isConflictError: function isConflictError(status) {
      return (0, _emberAjaxErrors.isConflictError)(status);
    },

    /**
     * Default `handleResponse` implementation uses this hook to decide if the
     * response is a server error.
     *
     * @method isServerError
     * @private
     * @param {Number} status
     * @param {Object} headers
     * @param {Object} payload
     * @return {Boolean}
     */
    isServerError: function isServerError(status) {
      return (0, _emberAjaxErrors.isServerError)(status);
    },

    /**
     * Default `handleResponse` implementation uses this hook to decide if the
     * response is a success.
     *
     * @method isSuccess
     * @private
     * @param {Number} status
     * @param {Object} headers
     * @param {Object} payload
     * @return {Boolean}
     */
    isSuccess: function isSuccess(status) {
      return (0, _emberAjaxErrors.isSuccess)(status);
    },

    /**
     * @method parseErrorResponse
     * @private
     * @param {string} responseText
     * @return {Object}
     */
    parseErrorResponse: function parseErrorResponse(responseText) {
      try {
        return JSON.parse(responseText);
      } catch (e) {
        return responseText;
      }
    },

    /**
     * Normalize the error from the server into the same format
     *
     * The format we normalize to is based on the JSON API specification.  The
     * return value should be an array of objects that match the format they
     * describe. More details about the object format can be found
     * [here](http://jsonapi.org/format/#error-objects)
     *
     * The basics of the format are as follows:
     *
     * ```javascript
     * [
     *   {
     *     status: 'The status code for the error',
     *     title: 'The human-readable title of the error'
     *     detail: 'The human-readable details of the error'
     *   }
     * ]
     * ```
     *
     * In cases where the server returns an array, then there should be one item
     * in the array for each of the payload.  If your server returns a JSON API
     * formatted payload already, it will just be returned directly.
     *
     * If your server returns something other than a JSON API format, it's
     * suggested that you override this method to convert your own errors into the
     * one described above.
     *
     * @method normalizeErrorResponse
     * @private
     * @param  {Number} status
     * @param  {Object} headers
     * @param  {Object} payload
     * @return {Array} An array of JSON API-formatted error objects
     */
    normalizeErrorResponse: function normalizeErrorResponse(status, headers, payload) {
      if (isArray(payload.errors)) {
        return payload.errors.map(function (error) {
          if (isObject(error)) {
            var ret = merge({}, error);
            ret.status = '' + error.status;
            return ret;
          } else {
            return {
              status: '' + status,
              title: error
            };
          }
        });
      } else if (isArray(payload)) {
        return payload.map(function (error) {
          if (isObject(error)) {
            return {
              status: '' + status,
              title: error.title || 'The backend responded with an error',
              detail: error
            };
          } else {
            return {
              status: '' + status,
              title: '' + error
            };
          }
        });
      } else {
        if (isString(payload)) {
          return [{
            status: '' + status,
            title: payload
          }];
        } else {
          return [{
            status: '' + status,
            title: payload.title || 'The backend responded with an error',
            detail: payload
          }];
        }
      }
    }
  });
});
define('ember-ajax/mixins/ajax-support', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  var Mixin = _ember['default'].Mixin;
  var service = _ember['default'].inject.service;
  var alias = _ember['default'].computed.alias;

  exports['default'] = Mixin.create({

    /**
     * The AJAX service to send requests through
     *
     * @property {AjaxService} ajaxService
     * @public
     */
    ajaxService: service('ajax'),

    /**
     * @property {string} host
     * @public
     */
    host: alias('ajaxService.host'),

    /**
     * @property {string} namespace
     * @public
     */
    namespace: alias('ajaxService.namespace'),

    /**
     * @property {object} headers
     * @public
     */
    headers: alias('ajaxService.headers'),

    ajax: function ajax(url, type) {
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var augmentedOptions = this.ajaxOptions.apply(this, arguments);

      return this.get('ajaxService').request(url, augmentedOptions);
    }
  });
});
define('ember-ajax/raw', ['exports', 'ember-ajax/ajax-request'], function (exports, _emberAjaxAjaxRequest) {
  'use strict';

  exports['default'] = raw;

  /**
   * Same as `request` except it resolves an object with
   *
   *   {response, textStatus, jqXHR}
   *
   * Useful if you need access to the jqXHR object for headers, etc.
   *
   * @public
   */
  function raw() {
    var ajax = new _emberAjaxAjaxRequest['default']();
    return ajax.raw.apply(ajax, arguments);
  }
});
define('ember-ajax/request', ['exports', 'ember-ajax/ajax-request'], function (exports, _emberAjaxAjaxRequest) {
  'use strict';

  exports['default'] = request;

  /**
   * Helper function that allows you to use the default `ember-ajax` to make
   * requests without using the service.
   *
   * Note: Unlike `ic-ajax`'s `request` helper function, this will *not* return a
   * jqXHR object in the error handler.  If you need jqXHR, you can use the `raw`
   * function instead.
   *
   * @public
   */
  function request() {
    var ajax = new _emberAjaxAjaxRequest['default']();
    return ajax.request.apply(ajax, arguments);
  }
});
define('ember-ajax/services/ajax', ['exports', 'ember', 'ember-ajax/mixins/ajax-request'], function (exports, _ember, _emberAjaxMixinsAjaxRequest) {
  'use strict';

  var Service = _ember['default'].Service;

  exports['default'] = Service.extend(_emberAjaxMixinsAjaxRequest['default']);
});
define('ember-ajax/utils/ajax', ['exports', 'ember', 'ember-ajax/utils/is-fastboot'], function (exports, _ember, _emberAjaxUtilsIsFastboot) {
  /* global najax */
  'use strict';

  var $ = _ember['default'].$;

  exports['default'] = _emberAjaxUtilsIsFastboot['default'] ? najax : $.ajax;
});
define('ember-ajax/utils/get-header', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  exports['default'] = getHeader;

  var A = _ember['default'].A;
  var isNone = _ember['default'].isNone;

  /**
   * Do a case-insensitive lookup of an HTTP header
   *
   * @function getHeader
   * @private
   * @param {Object} headers
   * @param {string} name
   * @return {string}
   */
  function getHeader(headers, name) {
    if (isNone(headers) || isNone(name)) {
      return; // ask for nothing, get nothing.
    }

    var matchedKey = A(Object.keys(headers)).find(function (key) {
      return key.toLowerCase() === name.toLowerCase();
    });

    return headers[matchedKey];
  }
});
define('ember-ajax/utils/is-fastboot', ['exports'], function (exports) {
  /* global FastBoot */
  'use strict';

  var isFastBoot = typeof FastBoot !== 'undefined';
  exports['default'] = isFastBoot;
});
define('ember-ajax/utils/parse-response-headers', ['exports'], function (exports) {
  'use strict';

  exports['default'] = parseResponseHeaders;

  function _toArray(arr) {
    return Array.isArray(arr) ? arr : Array.from(arr);
  }

  var CLRF = '\r\n';
  function parseResponseHeaders(headersString) {
    var headers = {};

    if (!headersString) {
      return headers;
    }

    var headerPairs = headersString.split(CLRF);

    headerPairs.forEach(function (header) {
      var _header$split = header.split(':');

      var _header$split2 = _toArray(_header$split);

      var field = _header$split2[0];

      var value = _header$split2.slice(1);

      field = field.trim();
      value = value.join(':').trim();

      if (value) {
        headers[field] = value;
      }
    });

    return headers;
  }
});
define('ember-ajax/utils/url-helpers', ['exports', 'ember-ajax/utils/is-fastboot'], function (exports, _emberAjaxUtilsIsFastboot) {
  'use strict';

  var _createClass = (function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
      }
    }return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
  })();

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }

  /* global require, module, URL */

  var completeUrlRegex = /^(http|https)/;

  /*
   * Isomorphic URL parsing
   * Borrowed from
   * http://www.sitepoint.com/url-parsing-isomorphic-javascript/
   */
  var isNode = typeof module === 'object' && module.exports;
  var url = getUrlModule();

  /**
   * Get the node url module or an anchor element
   *
   * @function getUrlModule
   * @private
   * @return {Object|HTMLAnchorElement} Object to parse urls
   */
  function getUrlModule() {
    if (_emberAjaxUtilsIsFastboot['default']) {
      // ember-fastboot-server provides the node url module as URL global
      return URL;
    }

    if (isNode) {
      return require('url');
    }

    return document.createElement('a');
  }

  /**
   * Parse a URL string into an object that defines its structure
   *
   * The returned object will have the following properties:
   *
   *   href: the full URL
   *   protocol: the request protocol
   *   hostname: the target for the request
   *   port: the port for the request
   *   pathname: any URL after the host
   *   search: query parameters
   *   hash: the URL hash
   *
   * @function parseUrl
   * @private
   * @param {string} str The string to parse
   * @return {Object} URL structure
   */
  function parseUrl(str) {
    var fullObject = undefined;
    if (isNode || _emberAjaxUtilsIsFastboot['default']) {
      fullObject = url.parse(str);
    } else {
      url.href = str;
      fullObject = url;
    }
    var desiredProps = {};
    desiredProps.href = fullObject.href;
    desiredProps.protocol = fullObject.protocol;
    desiredProps.hostname = fullObject.hostname;
    desiredProps.port = fullObject.port;
    desiredProps.pathname = fullObject.pathname;
    desiredProps.search = fullObject.search;
    desiredProps.hash = fullObject.hash;
    return desiredProps;
  }

  /**
   * RequestURL
   *
   * Converts a URL string into an object for easy comparison to other URLs
   *
   * @public
   */

  var RequestURL = (function () {
    function RequestURL(url) {
      _classCallCheck(this, RequestURL);

      this.url = url;
    }

    _createClass(RequestURL, [{
      key: 'sameHost',
      value: function sameHost(other) {
        var _this = this;

        return ['protocol', 'hostname', 'port'].reduce(function (previous, prop) {
          return previous && _this[prop] === other[prop];
        }, true);
      }
    }, {
      key: 'url',
      get: function get() {
        return this._url;
      },
      set: function set(value) {
        this._url = value;

        var explodedUrl = parseUrl(value);
        for (var prop in explodedUrl) {
          if (({}).hasOwnProperty.call(explodedUrl, prop)) {
            this[prop] = explodedUrl[prop];
          }
        }

        return this._url;
      }
    }, {
      key: 'isComplete',
      get: function get() {
        return this.url.match(completeUrlRegex);
      }
    }]);

    return RequestURL;
  })();

  exports.RequestURL = RequestURL;
});
define('ember-charts/components/bubble-chart', ['exports', 'ember', 'ember-charts/components/chart-component', 'ember-charts/mixins/floating-tooltip'], function (exports, _ember, _emberChartsComponentsChartComponent, _emberChartsMixinsFloatingTooltip) {
  'use strict';

  exports['default'] = _emberChartsComponentsChartComponent['default'].extend(_emberChartsMixinsFloatingTooltip['default'], {
    classNames: ['chart-bubble'],

    // ----------------------------------------------------------------------------
    // Bubble Chart Options
    // ----------------------------------------------------------------------------
    // used when setting up force and
    // moving around nodes
    // TODO(tony) camel case
    layoutGravity: -0.01,
    damper: 0.1,

    // Charge function that is called for each node.
    // Charge is proportional to the diameter of the
    // circle (which is stored in the radius attribute
    // of the circle's associated data.
    // This is done to allow for accurate collision
    // detection with nodes of different sizes.
    // Charge is negative because we want nodes to
    // repel.
    // Dividing by 8 scales down the charge to be
    // appropriate for the visualization dimensions.
    charge: _ember['default'].computed(function () {
      return function (d) {
        return -Math.pow(d.radius, 2.0) / 8;
      };
    }),

    // Getters for formatting human-readable labels from provided data
    formatLabel: d3.format(',.2f'),

    // ----------------------------------------------------------------------------
    // Tooltip Configuration
    // ----------------------------------------------------------------------------

    showDetails: _ember['default'].computed('isInteractive', function () {
      if (this.get('isInteractive')) {
        return _ember['default'].K;
      }

      return function (data, i, element) {
        // Do hover detail style stuff here
        d3.select(element).classed('hovered', true);

        // Show tooltip
        var formatLabel = this.get('formatLabel');
        var content = $('<span>');
        content.append($('<span class="tip-label">').text(data.label));
        content.append($('<span class="name">').text(this.get('tooltipValueDisplayName') + ': '));
        content.append($('<span class="value">').text(formatLabel(data.value)));
        return this.showTooltip(content.html(), d3.event);
      };
    }),

    hideDetails: _ember['default'].computed('isInteractive', function () {
      if (this.get('isInteractive')) {
        return _ember['default'].K;
      }

      return function (data, i, element) {
        // Undo hover style stuff
        d3.select(element).classed('hovered', false);
        // Hide Tooltip
        return this.hideTooltip();
      };
    }),

    // ----------------------------------------------------------------------------
    // Data
    // ----------------------------------------------------------------------------

    renderVars: ['selectedSeedColor'],

    // Sqrt scaling between data and radius
    radiusScale: _ember['default'].computed('data', 'width', 'height', function () {
      // use the max total_amount in the data as the max in the scale's domain
      var maxAmount = d3.max(this.get('data'), function (d) {
        return d.value;
      });
      var maxRadius = d3.min([this.get('width'), this.get('height')]) / 7;
      // TODO(tony): get rid of hard coded values
      return d3.scale.pow().exponent(0.5).domain([0, maxAmount]).range([2, maxRadius]);
    }),

    nodeData: _ember['default'].computed('radiusScale', function () {
      var _this = this;

      var data = this.get('data');
      if (_ember['default'].isEmpty(data)) {
        return [];
      }

      var radiusScale = this.get('radiusScale');
      var nodes = data.map(function (d) {
        return {
          radius: radiusScale(d.value),
          value: d.value,
          label: d.label,
          id: d.label,
          x: Math.random() * _this.get('width') / 2,
          y: Math.random() * _this.get('height') / 2
        };
      });

      nodes.sort(function (a, b) {
        return b.value - a.value;
      });
      return nodes;
    }),

    finishedData: _ember['default'].computed.alias('nodeData'),

    numColorSeries: _ember['default'].computed.alias('finishedData.length'),

    drawChart: function drawChart() {
      return this.updateVis();
    },

    updateVis: function updateVis() {
      var _this2 = this;

      var vis = this.get('viewport');
      var nodes = this.get('nodeData');
      var showDetails = this.get('showDetails');
      var hideDetails = this.get('hideDetails');
      var fill_color = this.get('getSeriesColor');

      var circles = vis.selectAll("circle").data(nodes, function (d) {
        return d.id;
      });

      circles.enter().append("circle")
      // radius will be set to 0 initially.
      // see transition below
      .attr("r", 0).attr("id", function (d) {
        return "bubble_" + d.id;
      }).on("mouseover", function (d, i) {
        return showDetails(d, i, this);
      }).on("mouseout", function (d, i) {
        return hideDetails(d, i, this);
      });

      // Fancy transition to make bubbles appear, ending with the
      // correct radius
      circles.transition().duration(2000).attr("r", function (d) {
        return d.radius;
      });

      circles.attr("fill", fill_color).attr("stroke-width", 2).attr("stroke", function (d, i) {
        return d3.rgb(fill_color(d, i)).darker();
      });

      circles.exit().remove();

      // Moves all circles towards the @center
      // of the visualization
      var move_towards_center = function move_towards_center(alpha) {
        var center = {
          x: _this2.get('width') / 2,
          y: _this2.get('height') / 2
        };
        return function (d) {
          d.x = d.x + (center.x - d.x) * (_this2.get('damper') + 0.02) * alpha;
          d.y = d.y + (center.y - d.y) * (_this2.get('damper') + 0.02) * alpha;
        };
      };

      // Start the forces
      var force = d3.layout.force().nodes(nodes).size([this.get('width'), this.get('height')]);

      // Display all
      force.gravity(this.get('layoutGravity')).charge(this.get('charge')).friction(0.9).on("tick", function (e) {
        circles.each(move_towards_center(e.alpha)).attr("cx", function (d) {
          return d.x;
        }).attr("cy", function (d) {
          return d.y;
        });
      });
      force.start();

      return vis.selectAll(".years").remove();
    }
  });
});
define('ember-charts/components/chart-component', ['exports', 'ember', 'ember-charts/mixins/resize-handler', 'ember-charts/mixins/colorable'], function (exports, _ember, _emberChartsMixinsResizeHandler, _emberChartsMixinsColorable) {
  'use strict';

  var ChartComponent = _ember['default'].Component.extend(_emberChartsMixinsColorable['default'], _emberChartsMixinsResizeHandler['default'], {
    layoutName: 'components/chart-component',
    classNames: ['chart-frame', 'scroll-y'],
    isInteractive: true,

    // ----------------------------------------------------------------------------
    // Layout
    // ----------------------------------------------------------------------------

    // Margin between viewport and svg boundary
    horizontalMargin: 30,
    verticalMargin: 30,

    /**
     * Optional property to set specific left margin
     * @type {Number}
     */
    horizontalMarginLeft: null,

    /**
     * Optional property to set specific right margin
     * @type {Number}
     */
    horizontalMarginRight: null,

    /**
     * An array of the values in the data that is passed into the chart
     * @type {Array.<Number>}
     */
    allFinishedDataValues: _ember['default'].computed('finishedData.@each.value', function () {
      return this.get('finishedData').map(function (d) {
        return d.value;
      });
    }),

    /**
     * The minimum value of the data in the chart
     * @type {Number}
     */
    minValue: _ember['default'].computed('allFinishedDataValues.[]', function () {
      return d3.min(this.get('allFinishedDataValues'));
    }),

    /**
     * The maximum value of the data in the chart
     * @type {Number}
     */
    maxValue: _ember['default'].computed('allFinishedDataValues.[]', function () {
      return d3.max(this.get('allFinishedDataValues'));
    }),

    /**
     * An array of the values which are at least 0
     * @type {Array<Number>}
     */
    positiveValues: _ember['default'].computed('allFinishedDataValues.[]', function () {
      return this.get('allFinishedDataValues').filter(function (val) {
        return val >= 0;
      });
    }),

    /**
     * An array of the values which are less than 0
     * @type {Array<Number>}
     */
    negativeValues: _ember['default'].computed('allFinishedDataValues.[]', function () {
      return this.get('allFinishedDataValues').filter(function (val) {
        return val < 0;
      });
    }),

    /**
     * Whether or not the data contains negative values.
     * @type {Boolean}
     */
    hasNegativeValues: _ember['default'].computed.lt('minValue', 0),

    /**
     * Whether or not the data contains positive values.
     * @type {Boolean}
     */
    hasPositiveValues: _ember['default'].computed.gt('maxValue', 0),

    /**
     * Whether or not the data contains only positive values.
     * @type {Boolean}
     */
    hasAllNegativeValues: _ember['default'].computed.lte('maxValue', 0),

    /**
     * Whether or not the data contains only negative values.
     * @type {Boolean}
     */
    hasAllPositiveValues: _ember['default'].computed.gte('minValue', 0),

    /**
     * Either a passed in value from `horizontalMarginRight`
     * or the default value from `horizontalMargin`
     * @type {Number}
     */
    marginRight: _ember['default'].computed('horizontalMarginRight', 'horizontalMargin', function () {
      var horizontalMarginRight = this.get('horizontalMarginRight');
      if (_ember['default'].isNone(horizontalMarginRight)) {
        return this.get('horizontalMargin');
      } else {
        return horizontalMarginRight;
      }
    }),

    /**
     * Either a passed in value from `horizontalMarginLeft`
     * or the default value from `horizontalMargin`
     * @type {Number}
     */
    marginLeft: _ember['default'].computed('horizontalMarginLeft', 'horizontalMargin', function () {
      var horizontalMarginLeft = this.get('horizontalMarginLeft');
      if (_ember['default'].isNone(horizontalMarginLeft)) {
        return this.get('horizontalMargin');
      } else {
        return horizontalMarginLeft;
      }
    }),

    marginTop: _ember['default'].computed.alias('verticalMargin'),
    marginBottom: _ember['default'].computed.alias('verticalMargin'),

    // TODO: Rename outer to SVG?
    defaultOuterHeight: 500,
    defaultOuterWidth: 700,
    outerHeight: _ember['default'].computed.alias('defaultOuterHeight'),
    outerWidth: _ember['default'].computed.alias('defaultOuterWidth'),

    width: _ember['default'].computed('outerWidth', 'marginLeft', 'marginRight', function () {
      return this.get('outerWidth') - this.get('marginLeft') - this.get('marginRight');
    }),

    height: _ember['default'].computed('outerHeight', 'marginBottom', 'marginTop', function () {
      return Math.max(1, this.get('outerHeight') - this.get('marginBottom') - this.get('marginTop'));
    }),

    // Hierarchy of chart view is:
    // 1 Outside most element is div.chart-frame
    // 2 Next element is svg
    // 3 Finally, g.chart-viewport
    $viewport: _ember['default'].computed(function () {
      return this.$('.chart-viewport')[0];
    }),

    viewport: _ember['default'].computed(function () {
      return d3.select(this.get('$viewport'));
    }),

    // Transform the view commonly displaced by the margin
    transformViewport: _ember['default'].computed('marginLeft', 'marginTop', function () {
      var left = this.get('marginLeft');
      var top = this.get('marginTop');
      return 'translate(' + left + ',' + top + ')';
    }),

    // ----------------------------------------------------------------------------
    // Labels
    // ----------------------------------------------------------------------------
    // Padding between label and zeroline, or label and graphic
    labelPadding: 10,

    // Padding allocated for axes on left of graph
    labelWidth: 30,
    labelHeight: 15,

    labelWidthOffset: _ember['default'].computed('labelWidth', 'labelPadding', function () {
      return this.get('labelWidth') + this.get('labelPadding');
    }),

    labelHeightOffset: _ember['default'].computed('labelHeight', 'labelPadding', function () {
      return this.get('labelHeight') + this.get('labelPadding');
    }),

    // ----------------------------------------------------------------------------
    // Graphic/NonGraphic Layout
    // I.e., some charts will care about the dimensions of the actual chart graphic
    // space vs. other drawing space, e.g., axes, labels, legends.
    // TODO(tony): Consider this being a mixin for axes/legends and it just happens
    // to be a redundant mixin. This is a problem though because we would not want
    // to override things like graphicTop, we instead would want the changes to be
    // cumulative.
    // ----------------------------------------------------------------------------
    graphicTop: 0,
    graphicLeft: 0,
    graphicWidth: _ember['default'].computed.alias('width'),
    graphicHeight: _ember['default'].computed.alias('height'),

    graphicBottom: _ember['default'].computed('graphicTop', 'graphicHeight', function () {
      return this.get('graphicTop') + this.get('graphicHeight');
    }),

    graphicRight: _ember['default'].computed('graphicLeft', 'graphicWidth', function () {
      return this.get('graphicLeft') + this.get('graphicWidth');
    }),

    // ----------------------------------------------------------------------------
    // Data
    // ----------------------------------------------------------------------------

    hasNoData: _ember['default'].computed('finishedData', function () {
      return _ember['default'].isEmpty(this.get('finishedData'));
    }),

    // ----------------------------------------------------------------------------
    // Drawing Functions
    // ----------------------------------------------------------------------------

    // Observe important variables and trigger chart redraw when they change
    concatenatedProperties: ['renderVars'],

    // Every chart will trigger a redraw when these variables change, through the
    // magic of concatenatedProperties any class that overrides the variable
    // renderVars will actually just be appending names to the list
    renderVars: ['finishedData', 'width', 'height', 'margin', 'isInteractive'],

    init: function init() {
      var _this = this;

      this._super();
      _.uniq(this.get('renderVars')).forEach(function (renderVar) {
        _this.addObserver(renderVar, _this.drawOnce);
        // This is just to ensure that observers added above fire even
        // if that renderVar is not consumed elsewhere.
        _this.get(renderVar);
      });
    },

    willDestroyElement: function willDestroyElement() {
      var _this2 = this;

      _.uniq(this.get('renderVars')).forEach(function (renderVar) {
        _this2.removeObserver(renderVar, _this2, _this2.drawOnce);
      });
      this._super();
    },

    didInsertElement: function didInsertElement() {
      this._super();
      this._updateDimensions();
      this.drawOnce();
    },

    drawOnce: function drawOnce() {
      _ember['default'].run.once(this, this.get('draw'));
    },

    onResizeEnd: function onResizeEnd() {
      this._updateDimensions();
    },

    // Wrap the chart in a container div that is the same size
    _updateDimensions: function _updateDimensions() {
      this.set('defaultOuterHeight', this.$().height());
      this.set('defaultOuterWidth', this.$().width());
    },

    clearChart: function clearChart() {
      this.$('.chart-viewport').children().remove();
    },

    // Remove previous drawing
    draw: function draw() {
      if ((this._state || this.state) !== "inDOM") {
        return;
      }

      if (this.get('hasNoData')) {
        return this.clearChart();
      } else {
        return this.drawChart();
      }
    }
  });

  exports['default'] = ChartComponent;
});
define('ember-charts/components/horizontal-bar-chart', ['exports', 'ember', 'ember-charts/components/chart-component', 'ember-charts/mixins/formattable', 'ember-charts/mixins/floating-tooltip', 'ember-charts/mixins/sortable-chart', 'ember-charts/utils/label-trimmer', 'ember-charts/mixins/axis-titles'], function (exports, _ember, _emberChartsComponentsChartComponent, _emberChartsMixinsFormattable, _emberChartsMixinsFloatingTooltip, _emberChartsMixinsSortableChart, _emberChartsUtilsLabelTrimmer, _emberChartsMixinsAxisTitles) {
  'use strict';

  var HorizontalBarChartComponent = _emberChartsComponentsChartComponent['default'].extend(_emberChartsMixinsFloatingTooltip['default'], _emberChartsMixinsFormattable['default'], _emberChartsMixinsSortableChart['default'], _emberChartsMixinsAxisTitles['default'], {
    classNames: ['chart-horizontal-bar'],

    // ----------------------------------------------------------------------------
    // Horizontal Bar Chart Options
    // ----------------------------------------------------------------------------

    // Minimum height of the whole chart, including padding
    defaultOuterHeight: 500,

    // Space between label and zeroline (overrides ChartView)
    // Also used to pad labels against the edges of the viewport
    labelPadding: 20,

    // Space between adjacent bars, as fraction of padded bar size
    barPadding: 0.2,

    // Constraints on size of each bar
    maxBarThickness: 60,
    minBarThickness: 20,

    /*
     * The maximum width of grouping labels. The text of the label will be
     * trimmed if it exceeds this width. This max won't be enforced if it is
     * null or undefined
     * @type {Number}
     */
    maxLabelWidth: null,

    // ----------------------------------------------------------------------------
    // Data
    // ----------------------------------------------------------------------------
    finishedData: _ember['default'].computed.alias('sortedData'),

    // ----------------------------------------------------------------------------
    // Layout
    // ----------------------------------------------------------------------------

    /**
     * Overrides values in addon/mixins/axis-titles.js
     * Location of axis title should track the actual axis
     *   - If there are both positive and negative values
     *   - Since the chart axis will be close to center
     * @override
     */
    xAxisPositionX: _ember['default'].computed('graphicWidth', 'xTitleHorizontalOffset', function () {
      var position = this.get('graphicWidth') / 2;
      if (!_ember['default'].isNone(this.get('xTitleHorizontalOffset'))) {
        position += this.get('xTitleHorizontalOffset');
      }
      return position;
    }),

    /**
     * X Axis Titles needs extra padding, else will intersect with the lowest bar
     * @override
     */
    xAxisPositionY: _ember['default'].computed('graphicBottom', 'xTitleVerticalOffset', function () {
      return this.get('graphicBottom') + this.get('xTitleVerticalOffset');
    }),

    /**
     * @override
     */
    yAxisPositionY: _ember['default'].computed('labelWidthOffset', 'yAxisTitleHeightOffset', function () {
      return -(this.get('labelWidthOffset') + this.get('yAxisTitleHeightOffset'));
    }),

    minOuterHeight: _ember['default'].computed('numBars', 'minBarThickness', 'marginTop', 'marginBottom', function () {
      var minBarThickness = this.get('minBarThickness');
      // If minBarThickness is null or undefined, do not enforce minOuterHeight.
      if (_ember['default'].isNone(minBarThickness)) {
        return null;
      } else {
        var minBarSpace = this.get('numBars') * minBarThickness;
        return minBarSpace + this.get('marginTop') + this.get('marginBottom');
      }
    }),

    maxOuterHeight: _ember['default'].computed('numBars', 'maxBarThickness', 'marginTop', 'marginBottom', function () {
      var maxBarThickness = this.get('maxBarThickness');
      // If maxBarThickness is null or undefined, do not enforce maxOuterHeight.
      if (_ember['default'].isNone(maxBarThickness)) {
        return null;
      } else {
        var maxBarSpace = this.get('numBars') * maxBarThickness;
        return maxBarSpace + this.get('marginTop') + this.get('marginBottom');
      }
    }),

    // override the default outerHeight, so the graph scrolls
    outerHeight: _ember['default'].computed('minOuterHeight', 'maxOuterHeight', 'defaultOuterHeight', function () {
      // Note: d3.max and d3.min ignore null/undefined values
      var maxMinDefault = d3.max([this.get('defaultOuterHeight'), this.get('minOuterHeight')]);
      return d3.min([maxMinDefault, this.get('maxOuterHeight')]);
    }),

    marginTop: _ember['default'].computed.alias('labelPadding'),

    /**
     * The margin at the bottom depends on the label and title padding and height.
     * @override
     * @type {Number}
     */
    marginBottom: _ember['default'].computed('labelPadding', 'xTitleVerticalOffset', 'hasXAxisTitle', function () {
      if (this.get('hasXAxisTitle')) {
        return this.get('labelPadding') + this.get('xTitleVerticalOffset');
      }

      return this.get('labelPadding');
    }),

    marginLeft: _ember['default'].computed.alias('horizontalMarginLeft'),

    // ----------------------------------------------------------------------------
    // Graphics Properties
    // ----------------------------------------------------------------------------

    numBars: _ember['default'].computed.alias('finishedData.length'),

    // Range of values used to size the graph, within which bars will be drawn
    xDomain: _ember['default'].computed('minValue', 'maxValue', function () {
      var minValue = this.get('minValue');
      var maxValue = this.get('maxValue');
      if (this.get('hasNegativeValues')) {
        if (this.get('hasPositiveValues')) {
          // Mix of positive and negative values
          return [minValue, maxValue];
        } else {
          // Only negative values domain
          return [minValue, 0];
        }
      } else {
        // Only positive values domain
        return [0, maxValue];
      }
    }),

    /*
     * Returns a function which scales a value in the data to a horizontal position
     * @private
     * @param {Number} width The width of the chart to use for scaling
     * @return {Function}
     */
    _xScaleForWidth: function _xScaleForWidth(width) {
      return d3.scale.linear().domain(this.get('xDomain')).range([0, width]);
    },

    // Scale to map value to horizontal length of bar
    xScale: _ember['default'].computed('width', 'xDomain', function () {
      return this._xScaleForWidth(this.get('width'));
    }),

    // Scale to map bar index to its horizontal position
    yScale: _ember['default'].computed('height', 'barPadding', function () {
      // Evenly split up height for bars with space between bars
      return d3.scale.ordinal().domain(d3.range(this.get('numBars'))).rangeRoundBands([0, this.get('height')], this.get('barPadding'));
    }),

    // Space in pixels allocated to each bar + padding
    barThickness: _ember['default'].computed('yScale', function () {
      return this.get('yScale').rangeBand();
    }),

    // ----------------------------------------------------------------------------
    // Tooltip Configuration
    // ----------------------------------------------------------------------------

    showDetails: _ember['default'].computed('isInteractive', function () {
      var _this = this;

      if (!this.get('isInteractive')) {
        return _ember['default'].K;
      }

      return function (data, i, element) {
        // Do hover detail style stuff here
        d3.select(element).classed('hovered', true);

        // Show tooltip
        var formatLabel = _this.get('formatLabelFunction');
        var content = $('<span>');
        content.append($('<span class="tip-label">').text(data.label));
        content.append($('<span class="name">').text(_this.get('tooltipValueDisplayName') + ': '));
        content.append($('<span class="value">').text(formatLabel(data.value)));
        return _this.showTooltip(content.html(), d3.event);
      };
    }),

    hideDetails: _ember['default'].computed('isInteractive', function () {
      var _this2 = this;

      if (!this.get('isInteractive')) {
        return _ember['default'].K;
      }

      return function (data, i, element) {
        // Undo hover style stuff
        d3.select(element).classed('hovered', false);
        // Hide Tooltip
        return _this2.hideTooltip();
      };
    }),

    // ----------------------------------------------------------------------------
    // Styles
    // ----------------------------------------------------------------------------

    groupAttrs: _ember['default'].computed('xScale', 'yScale', function () {
      var xScale = this.get('xScale');
      var yScale = this.get('yScale');
      return {
        transform: function transform(d, i) {
          var value = Math.min(0, d.value);
          return 'translate(' + xScale(value) + ', ' + yScale(i) + ')';
        }
      };
    }),

    barAttrs: _ember['default'].computed('xScale', 'mostTintedColor', 'leastTintedColor', 'barThickness', function () {
      var _this3 = this;

      var xScale = this.get('xScale');
      return {
        width: function width(d) {
          return _this3._computeBarWidth(d.value, xScale);
        },
        height: this.get('barThickness'),
        'stroke-width': 0,
        style: function style(d) {
          if (d.color) {
            return 'fill:' + d.color;
          }
          var color = d.value < 0 ? _this3.get('mostTintedColor') : _this3.get('leastTintedColor');
          return 'fill:' + color;
        }
      };
    }),

    /*
     * Determines whether Value Labels should go on the left side of the Y-Axis
     * Returns true if data is negative, or data is 0 and all other data is negative
     * @private
     * @param {Object}
     * @return {Boolean}
     */
    _isValueLabelLeft: function _isValueLabelLeft(d) {
      if (d.value < 0) {
        return true;
      }

      if (d.value === 0 && this.get('hasAllNegativeValues')) {
        return true;
      }

      return false;
    },

    valueLabelAttrs: _ember['default'].computed('xScale', 'barThickness', 'labelPadding', function () {
      var _this4 = this;

      var xScale = this.get('xScale');
      // Anchor the label 'labelPadding' away from the zero line
      // How to anchor the text depends on the direction of the bar

      return {
        x: function x(d) {
          if (_this4._isValueLabelLeft(d)) {
            return -_this4.get('labelPadding');
          } else {
            return xScale(d.value) - xScale(0) + _this4.get('labelPadding');
          }
        },
        y: this.get('barThickness') / 2,
        dy: '.35em',
        'text-anchor': function textAnchor(d) {
          return _this4._isValueLabelLeft(d) ? 'end' : 'start';
        },
        'stroke-width': 0
      };
    }),

    groupLabelAttrs: _ember['default'].computed('xScale', 'barThickness', 'labelPadding', function () {
      var _this5 = this;

      var xScale = this.get('xScale');

      // Anchor the label 'labelPadding' away from the zero line
      // How to anchor the text depends on the direction of the bar
      return {
        x: function x(d) {
          if (_this5._isValueLabelLeft(d)) {
            return xScale(0) - xScale(d.value) + _this5.get('labelPadding');
          } else {
            return -_this5.get('labelPadding');
          }
        },
        y: this.get('barThickness') / 2,
        dy: '.35em',
        'text-anchor': function textAnchor(d) {
          return _this5._isValueLabelLeft(d) ? 'start' : 'end';
        },
        'stroke-width': 0
      };
    }),

    axisAttrs: _ember['default'].computed('xScale', 'height', function () {
      var xScale = this.get('xScale');

      // Thickness, counts the padding allocated to each bar as well
      return {
        x1: xScale(0),
        x2: xScale(0),
        y1: 0,
        y2: this.get('height')
      };
    }),

    // ----------------------------------------------------------------------------
    // Selections
    // ----------------------------------------------------------------------------

    groups: _ember['default'].computed(function () {
      return this.get('viewport').selectAll('.bar').data(this.get('finishedData'));
    }).volatile(),

    yAxis: _ember['default'].computed(function () {
      var yAxis = this.get('viewport').select('.y.axis line');
      if (yAxis.empty()) {
        return this.get('viewport').insert('g', ':first-child').attr('class', 'y axis').append('line');
      } else {
        return yAxis;
      }
    }).volatile(),

    // ----------------------------------------------------------------------------
    // Drawing Functions
    // ----------------------------------------------------------------------------

    didInsertElement: function didInsertElement() {
      var _this6 = this;

      this._super.apply(this, arguments);
      // TODO (philn): This `Ember.run.next` was added to fix a bug where
      // a horizontal bar chart was rendered incorrectly the first time, but
      // correctly on subsequent renders. Still not entirely clear why that is.
      this._scheduledRedraw = _ember['default'].run.next(function () {
        _this6._updateDimensions();
        _this6.drawOnce();
      });
    },

    /*
     * Tear down the scheduled redraw timer
     * @override
     */
    willDestroyElement: function willDestroyElement() {
      this._super.apply(this, arguments);
      _ember['default'].run.cancel(this._scheduledRedraw);
    },

    /**
     * Store the timer information from scheduling the chart's redraw
     */
    _scheduledRedraw: null,

    renderVars: ['barThickness', 'yScale', 'colorRange', 'xValueDisplayName', 'yValueDisplayName', 'hasAxisTitles', 'hasXAxisTitle', 'hasYAxisTitle', 'xTitleHorizontalOffset', 'yTitleVerticalOffset', 'xTitleVerticalOffset', 'maxLabelWidth'],

    drawChart: function drawChart() {
      this.updateData();
      this.updateAxes();
      this.updateGraphic();
      this.updateAxisTitles();
    },

    updateData: function updateData() {
      var groups = this.get('groups');
      var showDetails = this.get('showDetails');
      var hideDetails = this.get('hideDetails');

      var entering = groups.enter().append('g').attr('class', 'bar').on('mouseover', function (d, i) {
        return showDetails(d, i, this);
      }).on('mouseout', function (d, i) {
        return hideDetails(d, i, this);
      });
      entering.append('rect');
      entering.append('text').attr('class', 'value');
      entering.append('text').attr('class', 'group');

      return groups.exit().remove();
    },

    updateAxes: function updateAxes() {
      return this.get('yAxis').attr(this.get('axisAttrs'));
    },

    /**
     * Given the list of elements for the group labels and value labels,
     * determine the width of the largest label on either side of the chart.
     * @private
     * @param {Array.<SVGTextElement>} groupLabelElements The text elements
     *  representing the group labels for the chart
     * @param {Array.<SVGTextElement>} valueLabelElements The text elements
     *  representing the value labels for the chart
     * @return {Object.<String, Number>}
     */
    _computeLabelWidths: function _computeLabelWidths(groupLabelElements, valueLabelElements) {
      var maxValueLabelWidth = this._maxWidthOfElements(valueLabelElements);
      var maxGroupLabelWidth = this._maxWidthOfElements(groupLabelElements);
      var maxLabelWidth = this.get('maxLabelWidth');

      // If all values are positive, the grouping labels are on the left and the
      // value labels are on the right
      if (this.get('hasAllPositiveValues')) {
        return {
          left: d3.min([maxGroupLabelWidth, maxLabelWidth]),
          right: maxValueLabelWidth
        };
        // If all values are negative, the value labels are on the left and the
        // grouping labels are on the right
      } else if (this.get('hasAllNegativeValues')) {
          return {
            left: maxValueLabelWidth,
            right: d3.min([maxGroupLabelWidth, maxLabelWidth])
          };
        } else {
          return this._computeMixedLabelWidths(groupLabelElements, valueLabelElements);
        }
    },

    /*
     * Determine the label widths on either side of a chart which contains a mix of positive
     * and negative values
     * @private
     * @param {Array.<SVGTextElement>} groupLabelElements The text elements
     *  representing the group labels for the chart
     * @param {Array.<SVGTextElement>} valueLabelElements The text elements
     *  representing the value labels for the chart
     * @return {Object.<String, Number>}
     */
    _computeMixedLabelWidths: function _computeMixedLabelWidths(groupLabelElements, valueLabelElements) {
      var _this7 = this;

      var minValue = this.get('minValue');
      var maxValue = this.get('maxValue');
      var maxLabelWidth = this.get('maxLabelWidth');

      // The grouping labels for positive values appear on the left side of the chart axis, and
      // vice-versa for negative values and right labels
      var leftGroupingLabels = this.get('positiveValues').map(function (val) {
        return _this7._getElementForValue(groupLabelElements, val);
      });
      var rightGroupingLabels = this.get('negativeValues').map(function (val) {
        return _this7._getElementForValue(groupLabelElements, val);
      });
      var maxLeftGroupingLabelWidth = d3.min([maxLabelWidth, this._maxWidthOfElements(leftGroupingLabels)]);
      var maxRightGroupingLabelWidth = d3.min([maxLabelWidth, this._maxWidthOfElements(rightGroupingLabels)]);

      // The value label that is furthest to the left is the one representing the minimum
      // value in the chart, and vice-versa for the right side and maximum value
      var leftMostValueLabelWidth = this._getElementWidthForValue(valueLabelElements, minValue);
      var rightMostValueLabelWidth = this._getElementWidthForValue(valueLabelElements, maxValue);

      var padding = 2 * this.get('labelPadding') + this.get('yAxisTitleHeightOffset');
      var outerWidth = this.get('outerWidth');
      var width = outerWidth - leftMostValueLabelWidth - rightMostValueLabelWidth - padding;
      var xScale = this._xScaleForWidth(width);

      var maxNegativeBarWidth = this._computeBarWidth(minValue, xScale);
      var maxPositiveBarWidth = this._computeBarWidth(maxValue, xScale);

      var leftWidth, rightWidth;
      // If the sum of the widths of the longest bar in a direction and its value label is larger
      // than the longest grouping label on the same side of the chart, then the relevant width on
      // that side is the width of the value label
      if (maxNegativeBarWidth + leftMostValueLabelWidth > maxLeftGroupingLabelWidth) {
        leftWidth = leftMostValueLabelWidth;
        // In the case where the left grouping label is wider than the sum of the largest left bar
        // and its value label, the goal is to find the distance between the left edge of the chart
        // and the end of the left bar.
      } else {
          // We can no longer use `maxNegativeBarWidth` from above, because it was computed with the
          // assumption that the value labels made up the outer margins of the chart, which is not
          // true in this case.
          // The amount of space to the left of the axis is fixed at the width of the grouping label.
          // The amount of space to the right of most positive bar is fixed at the width of the
          // value label for that bar. Knowing this, we can compute the width of the positive bar.
          var realPositiveBarWidth = outerWidth - maxLeftGroupingLabelWidth - rightMostValueLabelWidth - padding;
          // From the positive bar width, we can compute the negative bar width
          var realNegativeBarWidth = this._getMostNegativeBarWidth(realPositiveBarWidth);
          leftWidth = maxLeftGroupingLabelWidth - realNegativeBarWidth;
        }

      // This is the inverse of the logic above used for leftWidth
      if (maxPositiveBarWidth + rightMostValueLabelWidth > maxRightGroupingLabelWidth) {
        rightWidth = rightMostValueLabelWidth;
      } else {
        var realNegativeBarWidth = outerWidth - maxRightGroupingLabelWidth - leftMostValueLabelWidth - padding;
        var realPositiveBarWidth = this._getMostPositiveBarWidth(realNegativeBarWidth);
        rightWidth = maxRightGroupingLabelWidth - realPositiveBarWidth;
      }

      return {
        left: leftWidth,
        right: rightWidth
      };
    },

    /*
     * Compute the width of a bar in the chart, given its value and a scaling function
     * @see _xScaleForWidth
     * @private
     * @param {Number} value The value to compute the bar width for
     * @param {Function} scaleFunction The function that scales values to the width of the chart
     * @return {Number}
     */
    _computeBarWidth: function _computeBarWidth(value, scaleFunction) {
      return Math.abs(scaleFunction(value) - scaleFunction(0));
    },

    /*
     * For charts with a mix of positive and negative values, given the width of
     * the most positive bar, get the width of the most negative bar. The ratio
     * of the widths of the two bars is the same as the ratio between the min and
     * max values
     * @private
     * @param {Number} mostPositiveBarWidth
     * @return {Number}
     */
    _getMostNegativeBarWidth: function _getMostNegativeBarWidth(mostPositiveBarWidth) {
      var max = this.get('maxValue');
      var min = Math.abs(this.get('minValue'));
      return mostPositiveBarWidth * (min / max);
    },

    /*
     * For charts with a mix of positive and negative values, given the width of
     * the most negative bar, get the width of the most positive bar. The ratio
     * of the widths of the two bars is the same as the ratio between the max and
     * min values
     * @private
     * @param {Number} mostNegativeBarWidth
     * @return {Number}
     */
    _getMostPositiveBarWidth: function _getMostPositiveBarWidth(mostNegativeBarWidth) {
      var max = this.get('maxValue');
      var min = Math.abs(this.get('minValue'));
      return mostNegativeBarWidth * (max / min);
    },

    /**
     * Given an array of elements and a value, return the element in the array
     * at the same index as the value is in the list of all values
     * @private
     * @param {Array.<HTMLElement>} elements The elements to search in
     * @param {Number} value The value to search for
     * @return {HTMLElement}
     */
    _getElementForValue: function _getElementForValue(elements, value) {
      var index = this.get('allFinishedDataValues').indexOf(value);
      return elements[index];
    },

    /**
     * Given an array of SVG elements and a value, return the width of the element in the array
     * at the same index as the value is in the list of all values
     * @private
     * @param {Array.<SVGElement>} elements The elements to search in
     * @param {Number} value The value to search for
     * @return {Number}
     */
    _getElementWidthForValue: function _getElementWidthForValue(elements, value) {
      return this._getElementForValue(elements, value).getComputedTextLength();
    },

    /**
     * Given an array of SVG elements, return the largest computed length
     * @private
     * @param {Array.<SVGElement>} elements The array of elements
     * @return {Number}
     */
    _maxWidthOfElements: function _maxWidthOfElements(elements) {
      return d3.max(_.map(elements, function (element) {
        return element.getComputedTextLength();
      }));
    },

    updateGraphic: function updateGraphic() {
      var _this8 = this;

      var groups = this.get('groups').attr(this.get('groupAttrs'));

      groups.select('text.group').text(function (d) {
        return d.label;
      }).attr(this.get('groupLabelAttrs'));

      groups.select('rect').attr(this.get('barAttrs'));

      groups.select('text.value').text(function (d) {
        return _this8.get('formatLabelFunction')(d.value);
      }).attr(this.get('valueLabelAttrs'));

      var valueLabelElements = groups.select('text.value')[0];
      var groupLabelElements = groups.select('text.group')[0];
      var labelWidths = this._computeLabelWidths(groupLabelElements, valueLabelElements);
      // labelWidth is used for computations around the left margin, so set it
      // to the width of the left label
      this.set('labelWidth', labelWidths.left);

      // Add a few extra pixels of padding to ensure that labels don't clip off
      // the edge of the chart.  If the chart can be scrolled around we need a
      // little extra padding to deal with the scrollbars.
      var labelPadding = this.get('labelPadding');
      var axisTitleOffset = this.get('yAxisTitleHeightOffset');

      this.setProperties({
        horizontalMarginLeft: labelWidths.left + labelPadding + axisTitleOffset,
        horizontalMarginRight: labelWidths.right + labelPadding + (this.get('isInteractive') ? 15 : 0)
      });

      var maxLabelWidth = this.get('maxLabelWidth');
      if (!_ember['default'].isNone(maxLabelWidth)) {
        var labelTrimmer = _emberChartsUtilsLabelTrimmer['default'].create({
          getLabelSize: function getLabelSize() {
            return maxLabelWidth;
          },
          getLabelText: function getLabelText(d) {
            return d.label;
          }
        });

        groups.select('text.group').call(labelTrimmer.get('trim'));
      }
    }
  });

  exports['default'] = HorizontalBarChartComponent;
});
define('ember-charts/components/pie-chart', ['exports', 'ember', 'ember-charts/components/chart-component', 'ember-charts/mixins/formattable', 'ember-charts/mixins/floating-tooltip', 'ember-charts/mixins/sortable-chart', 'ember-charts/mixins/pie-legend', 'ember-charts/mixins/label-width', 'ember-charts/utils/label-trimmer'], function (exports, _ember, _emberChartsComponentsChartComponent, _emberChartsMixinsFormattable, _emberChartsMixinsFloatingTooltip, _emberChartsMixinsSortableChart, _emberChartsMixinsPieLegend, _emberChartsMixinsLabelWidth, _emberChartsUtilsLabelTrimmer) {
  'use strict';

  var PieChartComponent = _emberChartsComponentsChartComponent['default'].extend(_emberChartsMixinsFloatingTooltip['default'], _emberChartsMixinsFormattable['default'], _emberChartsMixinsSortableChart['default'], _emberChartsMixinsPieLegend['default'], _emberChartsMixinsLabelWidth['default'], {

    classNames: ['chart-pie'],
    // ----------------------------------------------------------------------------
    // Pie Chart Options
    // ----------------------------------------------------------------------------

    // The smallest slices will be combined into an "Other" slice until no slice is
    // smaller than minSlicePercent. "Other" is also guaranteed to be larger than
    // minSlicePercent.
    minSlicePercent: 5,

    // The maximum number of slices. If the number of slices is greater
    // than this then the smallest slices will be combined into an "other"
    // slice until there are at most maxNumberOfSlices.
    maxNumberOfSlices: 8,

    // Essentially we don't want a maximum pieRadius
    maxRadius: 2000,

    // top and bottom margin will never be smaller than this
    // you can use this to ensure that your labels don't get pushed off
    // the top / bottom when your labels are large or the chart is very small
    minimumTopBottomMargin: 0,

    // Allows the user to configure maximum number of decimal places in data labels
    maxDecimalPlace: 0,

    // When the Pie Chart has a high probability of having label intersections in
    // its default form, rotate the Pie by this amount so that the smallest slices
    // will start from the 2 o'clock to 4 o'clock positions.
    rotationOffset: 1 / 4 * Math.PI,

    // Allows the user to configure whether Rounded Zero Percent Slices should be
    // included inside of the Pie Chart. For example, if maxDecimalPlace = 0 and
    // there was a slice of 0.3%, that slice would be rounded down to 0%
    includeRoundedZeroPercentSlices: true,

    // ----------------------------------------------------------------------------
    // Data
    // ----------------------------------------------------------------------------

    // Data with invalid/negative values removed
    filteredData: _ember['default'].computed('data.[]', function () {
      var data;
      data = this.get('data');
      if (_ember['default'].isEmpty(data)) {
        return [];
      }
      return data.filter(function (child) {
        return child.value >= 0;
      });
    }),

    // Negative values that have been discarded from the data
    rejectedData: _ember['default'].computed('data.[]', function () {
      var data;
      data = this.get('data');
      if (_ember['default'].isEmpty(data)) {
        return [];
      }
      return data.filter(function (child) {
        return child.value < 0;
      });
    }),

    // Valid data points that have been sorted by selectedSortType
    sortedData: _ember['default'].computed('filteredData', 'sortKey', function () {
      var data = this.get('filteredData');
      var total = data.reduce(function (p, child) {
        return child.value + p;
      }, 0);
      if (total === 0) {
        return [];
      }

      data = data.map(function (d) {
        return {
          color: d.color,
          label: d.label,
          value: d.value,
          percent: 100.0 * d.value / total
        };
      });

      return _.sortBy(data, this.get('sortKey'));
    }),

    // This takes the sorted slices that have percents calculated and returns
    // sorted slices that obey the "other" slice aggregation rules
    //
    // When Other is the largest slice, Other is last and the data is sorted in order
    // When Other is not the largest slice, Other is the first and the data after it is sorted in order
    sortedDataWithOther: _ember['default'].computed('sortedData', 'maxNumberOfSlices', 'minSlicePercent', 'maxDecimalPlace', 'includeRoundedZeroPercentSlices', function () {
      var lastItem, overflowSlices, slicesLeft;

      var data = _.cloneDeep(this.get('sortedData')).reverse();
      var maxNumberOfSlices = this.get('maxNumberOfSlices');
      var minSlicePercent = this.get('minSlicePercent');
      var otherItems = [];
      var otherSlice = {
        label: 'Other',
        percent: 0.0,
        _otherItems: otherItems
      };

      // First make an other slice out of any slices below percent threshold
      // Find the first slice below
      var lowPercentIndex = _.indexOf(data, _.find(data, function (d) {
        return d.percent < minSlicePercent;
      }));

      // Guard against not finding any slices below the threshold
      if (lowPercentIndex < 0) {
        lowPercentIndex = data.length;
      } else {
        // Add low percent slices to other slice
        _.takeRight(data, data.length - lowPercentIndex).forEach(function (d) {
          otherItems.push(d);
          return otherSlice.percent += d.percent;
        });

        // Ensure Other slice is larger than minSlicePercent
        if (otherSlice.percent < minSlicePercent) {
          lastItem = data[lowPercentIndex - 1];
          if (lastItem.percent < minSlicePercent) {
            lowPercentIndex -= 1;
            otherItems.push(lastItem);
            otherSlice.percent += lastItem.percent;
          }
        }
      }

      // Reduce max number of slices that we can have if we now have an other slice
      if (otherSlice.percent > 0) {
        maxNumberOfSlices -= 1;
      }

      // Next, continue putting slices in other slice if there are too many
      // take instead of first see https://lodash.com/docs#take
      // drop instead of rest
      slicesLeft = _.take(data, lowPercentIndex);

      overflowSlices = _.drop(slicesLeft, maxNumberOfSlices);

      if (overflowSlices.length > 0) {
        overflowSlices.forEach(function (d) {
          otherItems.push(d);
          return otherSlice.percent += d.percent;
        });
        slicesLeft = _.take(slicesLeft, maxNumberOfSlices);
      }

      // Only push other slice if there is more than one other item
      if (otherItems.length === 1) {
        slicesLeft.push(otherItems[0]);
      } else if (otherSlice.percent > 0) {
        // When Other is the largest slice, add to the front of the list. Otherwise to the back
        //
        // Ensures that excessively large "Other" slices will be accounted during pie chart rotation.
        // This will prevent labels from intersecting when "Other" is extremely large
        if (otherSlice.percent > slicesLeft[0].percent) {
          slicesLeft.unshift(otherSlice);
        } else {
          slicesLeft.push(otherSlice);
        }
      }

      // Round all slices to the appropriate decimal place
      var maxDecimalPlace = this.get('maxDecimalPlace');
      var roundSlices = function roundSlices(sliceList) {
        sliceList.forEach(function (slice) {
          slice.percent = d3.round(1.0 * slice.percent, maxDecimalPlace);
        });
      };

      roundSlices(slicesLeft);
      roundSlices(otherItems);

      // Filter zero percent slices out of the pie chart after they have been rounded
      var filterRoundedZeroPercentSlices = function filterRoundedZeroPercentSlices(sliceList) {
        return sliceList.filter(function (slice) {
          return slice.percent !== 0;
        });
      };

      if (this.get('includeRoundedZeroPercentSlices') === false) {
        slicesLeft = filterRoundedZeroPercentSlices(slicesLeft);
      }

      return slicesLeft.reverse();
    }),

    otherData: _ember['default'].computed('sortedDataWithOther.[]', 'sortFunction', function () {
      var otherSlice = _.find(this.get('sortedDataWithOther'), function (d) {
        return d._otherItems;
      });

      var otherItems;
      if (otherSlice != null && otherSlice._otherItems != null) {
        otherItems = otherSlice._otherItems;
      } else {
        otherItems = [];
      }

      return _.sortBy(otherItems, this.get('sortFunction')).reverse();
    }),

    otherDataValue: _ember['default'].computed('otherData.[]', function () {
      var otherItems, value;
      value = 0;
      otherItems = this.get('otherData');
      if (otherItems != null) {
        _.each(otherItems, function (item) {
          return value += item.value;
        });
      }
      return value;
    }),

    finishedData: _ember['default'].computed.alias('sortedDataWithOther'),

    // ----------------------------------------------------------------------------
    // Layout
    // ----------------------------------------------------------------------------

    // TODO(tony): This should probably be merged with the API for controlling
    // a legend in general, very similar to that code

    // For the pie chart, horizontalMargin and verticalMargin are used to center
    // the graphic in the middle of the viewport
    horizontalMargin: _ember['default'].computed('labelPadding', 'labelWidth', function () {
      return this.get('labelPadding') + this.get('labelWidth');
    }),

    // Bottom margin is equal to the total amount of space the legend needs,
    // or 10% of the viewport if there is no legend
    _marginBottom: _ember['default'].computed('legendHeight', 'hasLegend', 'marginTop', function () {
      return this.get('hasLegend') ? this.get('legendHeight') : this.get('marginTop');
    }),

    marginBottom: _ember['default'].computed('_marginBottom', 'minimumTopBottomMargin', function () {
      return Math.max(this.get('_marginBottom'), this.get('minimumTopBottomMargin'));
    }),

    _marginTop: _ember['default'].computed('outerHeight', function () {
      return Math.max(1, this.get('outerHeight') * 0.1);
    }),

    marginTop: _ember['default'].computed('_marginTop', 'minimumTopBottomMargin', function () {
      return Math.max(this.get('_marginTop'), this.get('minimumTopBottomMargin'));
    }),

    // ----------------------------------------------------------------------------
    // Graphics Properties
    // ----------------------------------------------------------------------------

    numSlices: _ember['default'].computed.alias('finishedData.length'),

    // Normally, the pie chart should offset slices so that the largest slice
    // finishes at 12 o'clock
    //
    // However, always setting the largest slice at 12 o'clock can cause significant
    // difficulty while dealing with label intersections. This problem is exacerbated
    // when certain configurations of pie charts lead to a high density of
    // small slice labels at the 6 o'clock or 11:30 positions.
    //
    // Therefore, rotate the pie and concentrate all small slices at 8 to 10 o'clock
    // if there is a high density of small slices inside the pie. This will ensure
    // that there is plenty of space for labels
    startOffset: _ember['default'].computed('finishedData', 'sortKey', 'rotationOffset', function () {
      var detectDenseSmallSlices = function detectDenseSmallSlices(finishedData) {
        // This constant determines how many slices to use to calculate the
        // average small slice percentage. The smaller the constant, the more it
        // focuses on the smallest slices within the pie.
        //
        // Empirically, using a sample size of 2 works very well.
        var smallSliceSampleSize = 2;

        var sortedData = _.sortBy(finishedData, "percent");
        var startIndex = 0;
        var endIndex = Math.min(smallSliceSampleSize, sortedData.length);
        var largestSlicePercent = _.last(sortedData).percent;

        var averageSmallSlicesPercent = sortedData.slice(startIndex, endIndex).reduce(function (p, d) {
          return d.percent / (endIndex - startIndex) + p;
        }, 0);

        // When slices smaller than 2.75 percent are concentrated in any location,
        // there is a high probability of label intersections.
        //
        // However, empirical label intersect evidence has demonstrated that this
        // threshold must be increased to 5% when there are multiple small slices
        // from the 5 o'clock to 7 o'clock positions
        if (averageSmallSlicesPercent <= 2.75) {
          return true;
        } else if (averageSmallSlicesPercent <= 5 && 45 <= largestSlicePercent && largestSlicePercent <= 55) {
          return true;
        }
        return false;
      };

      var finishedData = this.get('finishedData');
      if (_ember['default'].isEmpty(finishedData)) {
        return 0;
      }

      // The sum is not necessarily 100% all of the time because of rounding
      //
      // For example, consider finishedData percentages (1.3%, 1.3%, 1.4%, 96%).
      // They will round to (1%, 1%, 1%, and 96%) when maxDecimalPlace = 0 by
      // default, which then sums to 99%.
      var sum = finishedData.reduce(function (p, d) {
        return d.percent + p;
      }, 0);

      if (detectDenseSmallSlices(finishedData)) {
        return this.get('rotationOffset');
      } else {
        return _.last(finishedData).percent / sum * 2 * Math.PI;
      }
    }),

    // Radius of the pie graphic, resized to fit the viewport.
    pieRadius: _ember['default'].computed('maxRadius', 'width', 'height', function () {
      return d3.min([this.get('maxRadius'), this.get('width') / 2, this.get('height') / 2]);
    }),

    // Radius at which labels will be positioned
    labelRadius: _ember['default'].computed('pieRadius', 'labelPadding', function () {
      return this.get('pieRadius') + this.get('labelPadding');
    }),

    // ----------------------------------------------------------------------------
    // Color Configuration
    // ----------------------------------------------------------------------------

    getSliceColor: _ember['default'].computed('numSlices', 'colorScale', function () {
      var _this = this;

      return function (d, i) {
        var index, numSlices;
        if (d.data && d.data.color) {
          return d.data.color;
        }
        numSlices = _this.get('numSlices');
        index = numSlices - i - 1;
        if (numSlices !== 1) {
          index = index / (numSlices - 1);
        }
        return _this.get('colorScale')(index);
      };
    }),

    // ----------------------------------------------------------------------------
    // Legend Configuration
    // ----------------------------------------------------------------------------

    legendItems: _ember['default'].computed('otherData', 'rejectedData', function () {
      return this.get('otherData').concat(this.get('rejectedData'));
    }),

    hasLegend: _ember['default'].computed('legendItems.length', 'showLegend', function () {
      return this.get('legendItems.length') > 0 && this.get('showLegend');
    }),

    // ----------------------------------------------------------------------------
    // Tooltip Configuration
    // ----------------------------------------------------------------------------

    showDetails: _ember['default'].computed('isInteractive', function () {
      var _this2 = this;

      if (!this.get('isInteractive')) {
        return _ember['default'].K;
      }
      return function (d, i, element) {
        var content, data, formatLabelFunction, value;
        d3.select(element).classed('hovered', true);
        data = d.data;
        if (data._otherItems) {
          value = _this2.get('otherDataValue');
        } else {
          value = data.value;
        }
        formatLabelFunction = _this2.get('formatLabelFunction');

        content = $('<span>');
        content.append($('<span class="tip-label">').text(data.label));
        content.append($('<span class="name">').text(_this2.get('tooltipValueDisplayName') + ': '));
        content.append($('<span class="value">').text(formatLabelFunction(value)));
        return _this2.showTooltip(content.html(), d3.event);
      };
    }),

    hideDetails: _ember['default'].computed('isInteractive', function () {
      var _this3 = this;

      if (!this.get('isInteractive')) {
        return _ember['default'].K;
      }

      return function (d, i, element) {
        d3.select(element).classed('hovered', false);
        var data = d.data;
        if (data._otherItems) {
          return _this3.get('viewport').select('.legend').classed('hovered', false);
        } else {
          return _this3.hideTooltip();
        }
      };
    }),

    // ----------------------------------------------------------------------------
    // Styles/Layout Functions
    // ----------------------------------------------------------------------------

    // SVG transform to center pie in the viewport
    transformViewport: _ember['default'].computed('marginLeft', 'marginTop', 'width', 'height', function () {
      var cx = this.get('marginLeft') + this.get('width') / 2;
      var cy = this.get('marginTop') + this.get('height') / 2;
      return "translate(" + cx + "," + cy + ")";
    }),

    // Arc drawing function for pie with specified pieRadius
    arc: _ember['default'].computed('pieRadius', function () {
      return d3.svg.arc().outerRadius(this.get('pieRadius')).innerRadius(0);
    }),

    // Pie layout function starting with the largest slice at zero degrees or
    // 12 oclock. Since the data is already sorted, this goes largest to smallest
    // counter clockwise
    pie: _ember['default'].computed('startOffset', function () {
      return d3.layout.pie().startAngle(this.get('startOffset')).endAngle(this.get('startOffset') + Math.PI * 2).sort(null).value(function (d) {
        return d.percent;
      });
    }),

    groupAttrs: _ember['default'].computed(function () {
      return {
        'class': function _class(d) {
          return d.data._otherItems ? 'arc other-slice' : 'arc';
        }
      };
    }),

    sliceAttrs: _ember['default'].computed('arc', 'getSliceColor', function () {
      return {
        d: this.get('arc'),
        fill: this.get('getSliceColor'),
        stroke: this.get('getSliceColor')
      };
    }),

    labelAttrs: _ember['default'].computed('arc', 'labelRadius', 'numSlices', 'mostTintedColor', function () {
      var mostTintedColor;
      var arc = this.get('arc');
      var labelRadius = this.get('labelRadius');
      // these are the label regions that are already filled
      var usedLabelPositions = {
        left: [],
        right: []
      };
      // assumes height of all the labels are the same
      var labelOverlap = function labelOverlap(side, ypos, height) {
        var positions = usedLabelPositions[side];
        return _.some(positions, function (pos) {
          return Math.abs(ypos - pos) < height;
        });
      };
      if (this.get('numSlices') > 1) {
        return {
          dy: '.35em',
          // Clear any special label styling that may have been set when only
          // displaying one data point on the chart
          style: null,
          'stroke-width': 0,
          // Anchor the text depending on whether the label is on the left or
          // right side of the pie, note that because of the angle offset we do
          // for the first pie slice we need to pay attention to the angle being
          // greater than 2*Math.PI
          'text-anchor': function textAnchor(d) {
            var angle = ((d.endAngle - d.startAngle) * 0.5 + d.startAngle) % (2 * Math.PI);
            return Math.PI < angle && angle < 2 * Math.PI ? 'end' : 'start';
          },

          // Position labels just outside of arc center outside of pie, making sure
          // not to create any two labels too close to each other. Since labels are
          // placed sequentially, we check the height where the last label was
          // placed,and if the new label overlaps the last, move the new label one
          // label's height away
          transform: function transform(d) {
            var x = arc.centroid(d)[0];
            var y = arc.centroid(d)[1];

            var f = function f(d) {
              return d / Math.sqrt(x * x + y * y) * labelRadius;
            };
            var labelXPos = f(x);
            var labelYPos = f(y);
            var labelHeight = this.getBBox().height;
            var side = labelXPos > 0 ? 'right' : 'left';

            // When labelYPos is adjusted to prevent label overlapping, this function
            // interpolates the updated labelXPos using the Pythagorean Theorem
            // so that the new label position will be realigned with the pie surface.
            //
            // This is extremely important. Only updating the labelYPos without
            // updating the corresponding labelXPos could accidentally place the label
            // in such a way that intersects with the pie itself!
            //
            // Note - There is an edge case for 12 o'clock and 6 o'clock
            // label overlaps when the updated labelYPos becomes larger than the
            // labelRadius. In this case, we set the labelXPos to 0 instead of
            // letting it be negative (which would incorrectly place the label
            // on the opposite side of the pie).
            var calculateXPos = function calculateXPos(labelYPos) {
              return Math.sqrt(Math.max(Math.pow(labelRadius, 2) - Math.pow(labelYPos, 2), 0));
            };

            if (labelOverlap(side, labelYPos, labelHeight)) {
              if (side === 'right') {
                labelYPos = _.max(usedLabelPositions[side]) + labelHeight;
                labelXPos = calculateXPos(labelYPos);
              } else {
                labelYPos = _.min(usedLabelPositions[side]) - labelHeight;
                labelXPos = -1 * calculateXPos(labelYPos);
              }
            }
            usedLabelPositions[side].push(labelYPos);
            return "translate(" + labelXPos + "," + labelYPos + ")";
          }
        };
      } else {
        // When there is only one label, position it in the middle of the chart.
        // This resolves a bug where rendering a chart with a single label multiple
        // times may cause the label to jitter, since lastXPos and lastYPos retain
        // their values from the last layout of the chart.
        mostTintedColor = this.get('mostTintedColor');
        return {
          dy: '.71em',
          'stroke-width': 0,
          'text-anchor': 'middle',
          transform: null,
          style: "fill:" + mostTintedColor + ";"
        };
      }
    }),

    // ----------------------------------------------------------------------------
    // Selections
    // ----------------------------------------------------------------------------

    groups: _ember['default'].computed(function () {
      var data = this.get('pie')(this.get('finishedData'));
      return this.get('viewport').selectAll('.arc').data(data);
    }).volatile(),

    // ----------------------------------------------------------------------------
    // Drawing Functions
    // ----------------------------------------------------------------------------

    renderVars: ['pieRadius', 'labelWidth', 'finishedData', 'startOffset'],

    drawChart: function drawChart() {
      this.updateData();
      this.updateGraphic();
      if (this.get('hasLegend')) {
        return this.drawLegend();
      } else {
        return this.clearLegend();
      }
    },

    updateData: function updateData() {
      var entering, groups, hideDetails, showDetails;
      groups = this.get('groups');
      showDetails = this.get('showDetails');
      hideDetails = this.get('hideDetails');
      entering = groups.enter().append('g').attr({
        "class": 'arc'
      }).on("mouseover", function (d, i) {
        return showDetails(d, i, this);
      }).on("mouseout", function (d, i) {
        return hideDetails(d, i, this);
      });
      entering.append('path').attr('class', 'slice');
      entering.append('text').attr('class', 'data');
      return groups.exit().remove();
    },

    updateGraphic: function updateGraphic() {
      var groups = this.get('groups').attr(this.get('groupAttrs'));
      groups.select('path').attr(this.get('sliceAttrs'));

      var maxLabelWidth = this.get('outerWidth') / 2 - this.get('labelPadding');
      var labelTrimmer = _emberChartsUtilsLabelTrimmer['default'].create({
        // override from LabelTrimmer
        reservedCharLength: 4,
        getLabelSize: function getLabelSize(d, selection) {
          // To calculate the label size, we need to identify the horizontal position `xPos` of the current label from the center.
          // Subtracting `xPos` from `maxLabelWidth` will provide the maximum space available for the label.

          // First select the text element from `selection` that is being currently trimmed.
          var text = selection.filter(function (data) {
            return data === d;
          });
          // Then calculate horizontal translation (0,0 is at the center of the pie) of the text element by:
          // a) Read the current transform of the element via text.attr("transform"). The transform has been applied by `this.get('labelAttrs')`.
          // b) parse the transform string to return instance of d3.transform()
          // c) from transform object, read translate[0] property for horizontal translation
          var xPos = d3.transform(text.attr("transform")).translate[0];
          return maxLabelWidth - Math.abs(xPos);
        },
        getLabelText: function getLabelText(d) {
          return d.data.label;
        }
      });

      return groups.select('text.data').text(function (d) {
        return d.data.label;
      }).attr(this.get('labelAttrs')).call(labelTrimmer.get('trim')).text(function (d) {
        return "" + this.textContent + ", " + d.data.percent + "%";
      });
    }
  });

  exports['default'] = PieChartComponent;
});
define('ember-charts/components/scatter-chart', ['exports', 'ember', 'ember-charts/components/chart-component', 'ember-charts/mixins/legend', 'ember-charts/mixins/floating-tooltip', 'ember-charts/mixins/axes', 'ember-charts/mixins/no-margin-chart', 'ember-charts/mixins/axis-titles', 'ember-charts/utils/group-by'], function (exports, _ember, _emberChartsComponentsChartComponent, _emberChartsMixinsLegend, _emberChartsMixinsFloatingTooltip, _emberChartsMixinsAxes, _emberChartsMixinsNoMarginChart, _emberChartsMixinsAxisTitles, _emberChartsUtilsGroupBy) {
  'use strict';

  var ScatterChartComponent = _emberChartsComponentsChartComponent['default'].extend(_emberChartsMixinsLegend['default'], _emberChartsMixinsFloatingTooltip['default'], _emberChartsMixinsAxes['default'], _emberChartsMixinsNoMarginChart['default'], _emberChartsMixinsAxisTitles['default'], {

    classNames: ['chart-scatter'],

    // ----------------------------------------------------------------------------
    // Scatter Plot Options
    // ----------------------------------------------------------------------------

    // Getters for formatting human-readable labels from provided data
    formatXValue: d3.format(',.2f'),
    formatYValue: d3.format(',.2f'),

    // Size of each icon on the scatter plot
    dotRadius: 7,

    dotShapeArea: _ember['default'].computed('dotRadius', function () {
      return Math.pow(this.get('dotRadius'), 2);
    }),

    // Amount to pad the extent of input data so that all displayed points fit
    // neatly within the viewport, as a proportion of the x- and y-range
    graphPadding: 0.05,

    // Increase the amount of space between ticks for scatter, basically if we are
    // too aggressive with the tick spacing 1) labels are more likely to be
    // squished together and 2) it is hard for the "nice"ing of the ticks, i.e.,
    // trying to end on actual tick intervals. It would be good to force ticks to
    // end where we want them, but reading the d3.js literature it was not clear
    // how to easily do that.
    tickSpacing: 80,

    // NoMarginChartMixin makes right margin 0 but we need that room because the
    // last label of the axis is commonly too large
    marginRight: _ember['default'].computed.alias('horizontalMargin'),

    /**
     * A flag to indicate if the chart view should have left & right margin based
     * on maximum & minimum X values. If this is set to false, the left & right
     * sides of the chart will not have extra padding column.
     * @type {Boolean}
    **/
    hasXDomainPadding: true,

    /**
     * A flag to indicate if the chart view should have top & bottom margin based
     * on maximum & minimum Y values. If this is set to false, the top & bottom
     * sides of the chart will not have extra padding column.
     * @type {Boolean}
    **/
    hasYDomainPadding: true,

    // ----------------------------------------------------------------------------
    // Data
    // ----------------------------------------------------------------------------

    isShowingTotal: false,
    totalPointData: null,

    // Data with invalid/negative values removed
    filteredData: _ember['default'].computed('data.@each', function () {
      var data;
      data = this.get('data');
      if (_ember['default'].isEmpty(data)) {
        return [];
      }
      return data.filter(function (d) {
        return d.xValue != null && d.yValue != null && isFinite(d.xValue) && isFinite(d.yValue);
      });
    }),

    // Aggregate the raw data by group, into separate lists of data points
    groupedData: _ember['default'].computed('filteredData.@each', function () {
      var _this = this;

      var data = this.get('filteredData');
      if (_ember['default'].isEmpty(data)) {
        return [];
      }

      var groupedData = (0, _emberChartsUtilsGroupBy.groupBy)(data, function (d) {
        return d.group || _this.get('ungroupedSeriesName');
      });

      this.set('groupNames', _.keys(groupedData));
      return _.values(groupedData);
    }),

    groupNames: [],

    numGroups: _ember['default'].computed.alias('groupedData.length'),

    isGrouped: _ember['default'].computed('numGroups', function () {
      return this.get('numGroups') > 1;
    }),

    finishedData: _ember['default'].computed.alias('groupedData'),

    // ----------------------------------------------------------------------------
    // Layout
    // ----------------------------------------------------------------------------

    // Chart Graphic Dimensions
    graphicTop: _ember['default'].computed.alias('axisTitleHeight'),
    graphicLeft: _ember['default'].computed.alias('labelWidthOffset'),

    graphicHeight: _ember['default'].computed('height', 'legendHeight', 'legendChartPadding', function () {
      var legendSize = this.get('legendHeight') + this.get('legendChartPadding') + (this.get('marginBottom') || 0);
      return this.get('height') - legendSize;
    }),

    graphicWidth: _ember['default'].computed('width', 'labelWidthOffset', function () {
      return this.get('width') - this.get('labelWidthOffset');
    }),

    // ----------------------------------------------------------------------------
    // Ticks and Scales
    // ----------------------------------------------------------------------------

    xDomain: _ember['default'].computed('filteredData.@each', 'isShowingTotal', 'totalPointData', function () {
      var totalData = this.get('isShowingTotal') ? [this.get('totalPointData')] : [];
      var _ref = d3.extent(totalData.concat(this.get('filteredData')), function (d) {
        return d.xValue;
      });
      var xMin = _ref[0];
      var xMax = _ref[1];
      if (xMin === xMax && xMax === 0) {
        return [-1, 1];
      } else if (xMin === xMax) {
        return [xMin * (1 - this.get('graphPadding')), xMin * (1 + this.get('graphPadding'))];
      } else {
        return [xMin, xMax];
      }
    }),

    yDomain: _ember['default'].computed('filteredData.@each', 'isShowingTotal', 'totalPointData', 'graphPadding', function () {
      var totalData = this.get('isShowingTotal') ? [this.get('totalPointData')] : [];
      var _ref = d3.extent(totalData.concat(this.get('filteredData')), function (d) {
        return d.yValue;
      });
      var yMin = _ref[0];
      var yMax = _ref[1];

      if (yMin === yMax && yMax === 0) {
        return [-1, 1];
      } else if (yMin === yMax) {
        return [yMin * (1 - this.get('graphPadding')), yMin * (1 + this.get('graphPadding'))];
      } else {
        return [yMin, yMax];
      }
    }),

    // The X axis scale spans the range of Y values plus any graphPadding
    xScale: _ember['default'].computed('xDomain', 'graphPadding', 'graphicLeft', 'graphicWidth', 'numXTicks', function () {
      var xDomain = this.get('xDomain');
      var graphicLeft = this.get('graphicLeft');
      var graphicWidth = this.get('graphicWidth');
      var padding = 0;
      if (this.get('hasXDomainPadding')) {
        padding = (xDomain[1] - xDomain[0]) * this.get('graphPadding');
      }

      return d3.scale.linear().domain([xDomain[0] - padding, xDomain[1] + padding]).range([graphicLeft, graphicLeft + graphicWidth]).nice(this.get('numXTicks'));
    }),

    // The Y axis scale spans the range of Y values plus any graphPadding
    yScale: _ember['default'].computed('yDomain', 'graphPadding', 'graphicTop', 'graphicHeight', 'numYTicks', function () {
      var yDomain = this.get('yDomain');
      var graphicTop = this.get('graphicTop');
      var graphicHeight = this.get('graphicHeight');
      var padding = 0;
      if (this.get('hasYDomainPadding')) {
        padding = (yDomain[1] - yDomain[0]) * this.get('graphPadding');
      }

      return d3.scale.linear().domain([yDomain[0] - padding, yDomain[1] + padding]).range([graphicTop + graphicHeight, graphicTop]).nice(this.get('numYTicks'));
    }),

    // ----------------------------------------------------------------------------
    // Graphics Properties
    // ----------------------------------------------------------------------------

    // Scatterplots handle different groups by varying shape of dot first and then
    // vary color or tint of seed color.
    groupShapes: _ember['default'].computed(function () {
      return ['circle', 'square', 'triangle-up', 'cross', 'diamond'];
    }),

    numGroupShapes: _ember['default'].computed.alias('groupShapes.length'),

    // Fixed number of colors for scatter plots, total different dot types is
    // numGroupsShapes * numGroupColors
    numGroupColors: 2,

    maxNumGroups: _ember['default'].computed('numGroupColors', 'numGroupShapes', function () {
      return this.get('numGroupColors') * this.get('numGroupShapes');
    }),

    // Only display a different icon for each group if the number of groups is less
    // than or equal to the maximum number of groups
    displayGroups: _ember['default'].computed('isGrouped', 'numGroups', 'numGroupShapes', function () {
      return this.get('isGrouped') && this.get('numGroups') <= this.get('maxNumGroups');
    }),

    // Since we are only provided with the index of each dot within its <g>, we
    // decide the shape and color of the dot using the index of its group property
    getGroupShape: _ember['default'].computed(function () {
      var _this2 = this;

      return function (d, i) {
        i = _this2.get('groupNames').indexOf(d.group);
        if (!_this2.get('displayGroups')) {
          return 'circle';
        }
        return _this2.get('groupShapes')[i % _this2.get('numGroupShapes')];
      };
    }),

    getGroupColor: _ember['default'].computed(function () {
      var _this3 = this;

      return function (d, i) {
        // If there is an overriding color assigned to the group, we use that
        // color.
        if (!_ember['default'].isNone(d.color)) {
          return d.color;
        }
        var colorIndex = 0;
        if (_this3.get('displayGroups')) {
          i = _this3.get('groupNames').indexOf(d.group);
          colorIndex = Math.floor(i / _this3.get('numGroupShapes'));
        }
        return _this3.get('colorScale')(colorIndex / _this3.get('numGroupColors'));
      };
    }),

    // ----------------------------------------------------------------------------
    // Legend Configuration
    // ----------------------------------------------------------------------------

    hasLegend: _ember['default'].computed('isGrouped', 'showLegend', function () {
      return this.get('isGrouped') && this.get('showLegend');
    }),

    legendIconRadius: _ember['default'].computed.alias('dotRadius'),

    legendItems: _ember['default'].computed('hasNoData', 'groupedData', 'getGroupShape', 'getGroupColor', 'displayGroups', 'isShowingTotal', 'totalPointData', function () {

      if (this.get('hasNoData')) {
        return [];
      }
      var getGroupShape = this.get('getGroupShape');
      var getGroupColor = this.get('getGroupColor');
      var displayGroups = this.get('displayGroups');

      var legendData = this.get('groupedData').map(function (d, i) {
        var name = d[0].group;
        var value = d.length === 1 ? d[0] : null;
        // Get the color of the group. Because they are in the same group, they
        // should share the same color, so we only need to get the color of the
        // first object and pass to the function
        var color = getGroupColor(d[0], i);
        return {
          label: name,
          group: name,
          stroke: color,
          fill: displayGroups ? color : 'transparent',
          icon: getGroupShape,
          selector: ".group-" + i,
          xValue: value != null ? value.xValue : void 0,
          yValue: value != null ? value.yValue : void 0
        };
      });

      if (this.get('isShowingTotal')) {
        var point = this.get('totalPointData');
        legendData.unshift({
          label: point.group,
          group: point.group,
          stroke: getGroupColor,
          selector: '.totalgroup',
          xValue: point.xValue,
          yValue: point.yValue
        });
      }

      return legendData;
    }),

    // ----------------------------------------------------------------------------
    // Tooltip Configuration
    // ----------------------------------------------------------------------------

    xValueDisplayName: 'X Factor',
    yValueDisplayName: 'Y Factor',

    showDetails: _ember['default'].computed('isInteractive', function () {
      var _this4 = this;

      if (!this.get('isInteractive')) {
        return _ember['default'].K;
      }

      return function (data, i, element) {
        d3.select(element).classed('hovered', true);
        var formatXValue = _this4.get('formatXValue');
        var formatYValue = _this4.get('formatYValue');
        var xValueDisplayName = $('<span class="name" />').text(_this4.get('xValueDisplayName') + ': ');
        var yValueDisplayName = $('<span class="name" />').text(_this4.get('yValueDisplayName') + ': ');
        var xValue = $('<span class="value" />').text(formatXValue(data.xValue));
        var yValue = $('<span class="value" />').text(formatYValue(data.yValue));

        var content = $('<span />');
        content.append($('<span class="tip-label" />').text(data.group)).append(xValueDisplayName).append(xValue).append('<br />').append(yValueDisplayName).append(yValue);
        _this4.showTooltip(content.html(), d3.event);
      };
    }),

    hideDetails: _ember['default'].computed('isInteractive', function () {
      var _this5 = this;

      if (!this.get('isInteractive')) {
        return _ember['default'].K;
      }

      return function (data, i, element) {
        d3.select(element).classed('hovered', false);
        return _this5.hideTooltip();
      };
    }),

    // ----------------------------------------------------------------------------
    // Styles
    // ----------------------------------------------------------------------------

    groupAttrs: _ember['default'].computed(function () {
      return {
        "class": function _class(d, i) {
          return "group group-" + i;
        }
      };
    }),

    pointAttrs: _ember['default'].computed('dotShapeArea', 'getGroupShape', 'xScale', 'yScale', 'displayGroups', 'getGroupColor', function () {
      var _this6 = this;

      return {
        d: d3.svg.symbol().size(this.get('dotShapeArea')).type(this.get('getGroupShape')),
        fill: this.get('displayGroups') ? this.get('getGroupColor') : 'transparent',
        stroke: this.get('getGroupColor'),
        'stroke-width': 1.5,
        transform: function transform(d) {
          var dx = _this6.get('xScale')(d.xValue);
          var dy = _this6.get('yScale')(d.yValue);
          return "translate(" + dx + ", " + dy + ")";
        }
      };
    }),

    // ----------------------------------------------------------------------------
    // Selections
    // ----------------------------------------------------------------------------

    groups: _ember['default'].computed(function () {
      return this.get('viewport').selectAll('.group').data(this.get('finishedData'));
    }).volatile(),

    selectOrCreateAxis: function selectOrCreateAxis(selector) {
      var axis = this.get('viewport').select(selector);
      if (axis.empty()) {
        return this.get('viewport').insert('g', ':first-child');
      } else {
        return axis;
      }
    },

    xAxis: _ember['default'].computed(function () {
      return this.selectOrCreateAxis('.x.axis').attr('class', 'x axis');
    }).volatile(),

    yAxis: _ember['default'].computed(function () {
      return this.selectOrCreateAxis('.y.axis').attr('class', 'y axis');
    }).volatile(),

    // ----------------------------------------------------------------------------
    // Drawing Functions
    // ----------------------------------------------------------------------------

    renderVars: ['xScale', 'yScale', 'dotShapeArea', 'finishedData', 'xValueDisplayName', 'yValueDisplayName', 'hasAxisTitles', // backward compatibility support.
    'hasXAxisTitle', 'hasYAxisTitle', 'xTitleHorizontalOffset', 'yTitleVerticalOffset'],

    drawChart: function drawChart() {
      this.updateTotalPointData();
      this.updateData();
      this.updateAxes();
      this.updateGraphic();
      this.updateAxisTitles();
      if (this.get('hasLegend')) {
        return this.drawLegend();
      } else {
        return this.clearLegend();
      }
    },

    totalPointShape: _ember['default'].computed(function () {
      var _this7 = this;

      var dotShapeArea = this.get('dotShapeArea');

      return function (selection) {
        selection.append('path').attr({
          "class": 'totaldot',
          d: d3.svg.symbol().size(dotShapeArea).type('circle'),
          fill: _this7.get('getGroupColor')
        });

        return selection.append('path').attr({
          "class": 'totaloutline',
          d: d3.svg.symbol().size(dotShapeArea * 3).type('circle'),
          fill: 'transparent',
          stroke: _this7.get('getGroupColor'),
          'stroke-width': 2
        });
      };
    }),

    updateTotalPointData: function updateTotalPointData() {
      var totalData = this.get('isShowingTotal') ? [this.get('totalPointData')] : [];
      var totalPoint = this.get('viewport').selectAll('.totalgroup').data(totalData);
      totalPoint.exit().remove();

      return totalPoint.enter().append('g').attr('class', 'totalgroup').call(this.get('totalPointShape'));
    },

    updateData: function updateData() {
      var groups, points;
      groups = this.get('groups');
      groups.enter().append('g').attr('class', 'group').attr(this.get('groupAttrs'));
      groups.exit().remove();
      points = groups.selectAll('.dot').data(function (d) {
        return d;
      });
      points.enter().append('path').attr('class', 'dot');

      return points.exit().remove();
    },

    updateAxes: function updateAxes() {
      var xAxis = d3.svg.axis().scale(this.get('xScale')).orient('top').ticks(this.get('numXTicks')).tickSize(this.get('graphicHeight')).tickFormat(this.get('formatXValue'));
      var yAxis = d3.svg.axis().scale(this.get('yScale')).orient('right').ticks(this.get('numYTicks')).tickSize(this.get('graphicWidth')).tickFormat(this.get('formatYValue'));
      var graphicTop = this.get('graphicTop');
      var graphicHeight = this.get('graphicHeight');
      var gXAxis = this.get('xAxis').attr('transform', "translate(0," + (graphicTop + graphicHeight) + ")").call(xAxis);
      gXAxis.selectAll('g').filter(function (d) {
        return d !== 0;
      }).classed('major', false).classed('minor', true);

      var labelPadding = this.get('labelPadding');
      gXAxis.selectAll('text').style('text-anchor', 'middle').attr({
        y: function y() {
          return this.getBBox().height + labelPadding / 2;
        }
      });
      var gYAxis = this.get('yAxis');

      this.set('graphicLeft', this.maxLabelLength(gYAxis.selectAll('text')) + this.get('labelPadding'));
      var graphicLeft = this.get('graphicLeft');
      gYAxis.attr('transform', "translate(" + graphicLeft + ",0)").call(yAxis);

      gYAxis.selectAll('g').filter(function (d) {
        return d !== 0;
      }).classed('major', false).classed('minor', true);

      gYAxis.selectAll('text').style('text-anchor', 'end').attr({
        x: -this.get('labelPadding')
      });
    },

    updateGraphic: function updateGraphic() {
      var _this8 = this;

      var showDetails = this.get('showDetails');
      var hideDetails = this.get('hideDetails');

      this.get('groups').selectAll('.dot').attr(this.get('pointAttrs')).on("mouseover", function (d, i) {
        return showDetails(d, i, this);
      }).on("mouseout", function (d, i) {
        return hideDetails(d, i, this);
      });

      return this.get('viewport').select('.totalgroup').on("mouseover", function (d, i) {
        return showDetails(d, i, this);
      }).on("mouseout", function (d, i) {
        return hideDetails(d, i, this);
      }).attr({
        transform: function transform(d) {
          var dx, dy;
          dx = _this8.get('xScale')(d.xValue);
          dy = _this8.get('yScale')(d.yValue);
          return "translate(" + dx + ", " + dy + ")";
        }
      });
    }
  });

  exports['default'] = ScatterChartComponent;
});
define('ember-charts/components/stacked-vertical-bar-chart', ['exports', 'ember', 'ember-charts/components/chart-component', 'ember-charts/mixins/legend', 'ember-charts/mixins/floating-tooltip', 'ember-charts/mixins/axes', 'ember-charts/mixins/formattable', 'ember-charts/mixins/no-margin-chart', 'ember-charts/mixins/axis-titles', 'ember-charts/utils/label-trimmer'], function (exports, _ember, _emberChartsComponentsChartComponent, _emberChartsMixinsLegend, _emberChartsMixinsFloatingTooltip, _emberChartsMixinsAxes, _emberChartsMixinsFormattable, _emberChartsMixinsNoMarginChart, _emberChartsMixinsAxisTitles, _emberChartsUtilsLabelTrimmer) {
  'use strict';

  /**
   * Base class for stacked vertical bar chart components.
   *
   * Supersedes the deprecated functionality of VerticalBarChartComponent
   * with stackBars: true.
   * @class
   * @augments ChartComponent
   */
  var StackedVerticalBarChartComponent = _emberChartsComponentsChartComponent['default'].extend(_emberChartsMixinsLegend['default'], _emberChartsMixinsFloatingTooltip['default'], _emberChartsMixinsAxes['default'], _emberChartsMixinsFormattable['default'], _emberChartsMixinsNoMarginChart['default'], _emberChartsMixinsAxisTitles['default'], {

    classNames: ['chart-vertical-bar', 'chart-stacked-vertical-bar'],

    // ---------------------------------------------------------------------------
    // Stacked Vertical Bar Chart Options
    // ---------------------------------------------------------------------------

    /**
     * The smallest slices will be combined into an 'Other' slice until no slice
     * is smaller than minSlicePercent.
     * @type {number}
     */
    minSlicePercent: 2,

    /**
     * Data without a barLabel will be merged into a bar with this name
     * @type {string}
     */
    ungroupedSeriesName: 'Other',

    /**
     * The maximum number of slices. If the number of slices is greater
     * than this, the smallest slices will be combined into an 'Other' slice until
     * there are at most maxNumberOfSlices (including the 'Other' slice).
     * @type {number}
     */
    maxNumberOfSlices: 10,

    /**
     * If there are more slice labels than maxNumberOfSlices and/or if there are
     * slice types that do not meet the `minSlicePercent`, the smallest slices
     * will be aggregated into an 'Other' slice. This property defines the label
     * for this aggregate slice.
     * @type {string}
     */
    otherSliceLabel: 'Other',

    /**
     * Width of slice outline, in pixels
     * @type {number}
     */
    strokeWidth: 1,

    /**
     * Default space between bars, as a fraction of bar size. This can be
     * overridden to be any value between 0 and 1.
     * If not overridden, the default padding here is calculated as a function of
     * the number of bars in the chart. More bars results in a smaller padding
     * ratio, and vice versa. The range values (0.625, 0.125) result in padding
     * values that copies the default padding settings in unstacked
     * VerticalBarChartComponent, and were chosen to create a good default look
     * for any chart, regardless of how many bars it contains.
     *
     * NOTE:
     * If you DO NOT want the betweenBarPadding to dynamically change based
     * on number of slices, this should be overridden to some fixed number between
     * 0 and 1.
     *
     * If you DO want the betweenBarPadding to dynamically change but don't like
     * the default domain/range values set here, override this to adjust those
     * accordingly. View the following D3 documentation for more detail about
     * domain and range settings:
     * https://github.com/d3/d3-3.x-api-reference/blob/master/Ordinal-Scales.md#ordinal_domain
     * @type {number}
     */
    betweenBarPadding: _ember['default'].computed('barNames.length', function () {
      var scale = d3.scale.linear().domain([1, 8]).range([0.625, 0.125]).clamp(true);
      return scale(this.get('barNames.length'));
    }),

    /**
     * Space allocated for rotated labels on the bottom of the chart. If labels
     * are rotated, they will be extended beyond labelHeight up to maxLabelHeight
     * @type {number}
     */
    maxLabelHeight: 50,

    // ---------------------------------------------------------------------------
    // Data
    // ---------------------------------------------------------------------------

    /**
     * Input data mapped by sliceLabel.
     * Key: sliceLabel
     * Value: Array of slice objects (sliceLabel, barLabel, value)
     * @type {Object.<string, Array.<Object>>}
     */
    dataGroupedBySlice: _ember['default'].computed('data.[]', function () {
      return _.groupBy(this.get('data'), 'sliceLabel');
    }),

    /**
     * Input data mapped by barLabel. Any data without a barLabel will be
     * aggregated into the bar labelled by `ungroupedSeriesName`. This does not
     * account for the 'Other' slice computations, i.e. all slices are represented
     * here even if they do not meet the minSlicePercent criteria.
     * Key: barLabel
     * Value: Array of slice objects (sliceLabel, barLabel, value)
     * @type {Object.<string, Array.<Object>>}
     */
    dataGroupedByBar: _ember['default'].computed('ungroupedSeriesName', 'data.[]', function () {
      var ungroupedSeriesName = this.get('ungroupedSeriesName');
      return _.groupBy(this.get('data'), function (slice) {
        return slice.barLabel || ungroupedSeriesName;
      });
    }),

    /**
     * The gross value of the largest bar (ie, largest difference between top
     * and bottom of any bar in the chart).
     * Used to determine whether a given slice meets the minSlicePercent threshold
     * as a percentage of this largest bar.
     * @type {number}
     */
    largestGrossBarValue: _ember['default'].computed('dataGroupedByBar', function () {
      var grossBarValues = _.map(this.get('dataGroupedByBar'), function (barData) {
        return barData.reduce(function (sum, slice) {
          return sum + Math.abs(slice.value);
        }, 0);
      });
      return _.max(grossBarValues);
    }),

    /**
     * The label and largest slice data for each unique slice label.
     * Finds the largest slice (by absolute value) for each slice label and then
     * calculates the percentage of the largest gross value bar for these
     * largest slices. Used to determine which slices get aggregated into the
     * 'Other' slice in `nonOtherSliceTypes`.
     * @type {Array.<Object>}
     */
    largestSliceData: _ember['default'].computed('dataGroupedBySlice', 'largestGrossBarValue', function () {
      var dataGroupedBySlice, largestSlice, largestBarValue, largestSliceData;
      dataGroupedBySlice = this.get('dataGroupedBySlice');
      largestBarValue = this.get('largestGrossBarValue');
      largestSliceData = _.map(dataGroupedBySlice, function (slices, sliceLabel) {
        largestSlice = _.max(slices, function (slice) {
          return Math.abs(slice.value);
        });
        return {
          sliceLabel: sliceLabel,
          percentOfBar: Math.abs(largestSlice.value / largestBarValue * 100)
        };
      });
      return largestSliceData.filter(function (sliceData) {
        return !(isNaN(sliceData.percentOfBar) || sliceData.percentOfBar === 0);
      });
    }),

    /**
     * The sliceLabels that will be explicitly shown in the chart and not
     * aggregated into the 'Other' slice. The parameters for which slice labels
     * get bucket in 'Other' are `minSlicePercent` and `maxNumberOfSlices`.
     * @see minSlicePercent
     * @see maxNumberOfSlices
     * @type {Array.<string>}
     */
    nonOtherSliceTypes: _ember['default'].computed('minSlicePercent', 'maxNumberOfSlices', 'largestSliceData.[]', function () {
      var minSlicePercent, maxNumberOfSlices, largestSliceData, nonOtherSlices;
      minSlicePercent = this.get('minSlicePercent');
      largestSliceData = this.get('largestSliceData');

      // First, filter out any slice labels that do not meet the minSlicePercent
      // threshold. These slices are 'too thin' to show on their own, as they will
      // create too much noise in the stacked bar chart, so we lump them into
      // the one 'Other' slice.
      nonOtherSlices = _.filter(largestSliceData, function (sliceData) {
        return sliceData.percentOfBar >= minSlicePercent;
      });

      // Next, sort the remaining slices by size and take the biggest (N - 1)
      // slices, where N is the max number we can display (this saves one slice
      // for 'Other').
      maxNumberOfSlices = this.get('maxNumberOfSlices');
      nonOtherSlices = _.takeRight(_.sortBy(nonOtherSlices, 'percentOfBar'), maxNumberOfSlices - 1);

      // At this point, everything in `nonOtherSlices` meets both the thresholds
      // set by `minSlicePercent` and `maxNumberOfSlices` and deserves to be shown
      // on its own with its own legend items.
      if (largestSliceData.length - nonOtherSlices.length <= 1) {
        // If 0 or 1 slice labels were filtered out, we can just show all slice
        // labels explicitly. We only want the 'Other' slice if it has at least
        // 2 slice labels contained aggregated inside.
        return _.pluck(largestSliceData, 'sliceLabel');
      } else {
        // Otherwise, just return the slice labels that passed the filters.
        return _.pluck(nonOtherSlices, 'sliceLabel');
      }
    }),

    /**
     * The sliceLabels that will be aggregated into the 'Other' slice and not
     * explicitly shown in the legend.
     * @type {Array.<string>}
     */
    otherSliceTypes: _ember['default'].computed('largestSliceData.[]', 'nonOtherSliceTypes.[]', function () {
      var allSliceTypes = _.pluck(this.get('largestSliceData'), 'sliceLabel');
      return _.difference(allSliceTypes, this.get('nonOtherSliceTypes'));
    }),

    /**
     * Input data mapped by barLabel AFTER 'Other' slices have been calculated
     * and with slices sorted correctly for each bar. Bar sorting is handled by
     * `barNames`, but slice sorting is handled here.
     * Key: barLabel
     * Value: Array of [sorted] slice objects (sliceLabel, barLabel, value)
     * @type {Object.<string, Array.Object>>}
     */
    sortedData: _ember['default'].computed('dataGroupedByBar', 'otherSliceLabel', 'nonOtherSliceTypes.[]', 'sliceSortingFn', function () {
      var _this = this;

      var groupedData, nonOtherSliceTypes, otherSliceLabel;
      groupedData = this.get('dataGroupedByBar');
      nonOtherSliceTypes = this.get('nonOtherSliceTypes');
      otherSliceLabel = this.get('otherSliceLabel');
      return _.reduce(groupedData, function (result, barData, barLabel) {
        // Create an empty 'Other' slice. Go through every slice in each bar
        // and look for slices that need to be aggregated into 'Other', updating
        // the value of the otherSlice along the way.
        var newBarData, otherSlice;
        newBarData = [];
        otherSlice = { barLabel: barLabel,
          sliceLabel: otherSliceLabel,
          value: 0 };
        barData.forEach(function (slice) {
          if (nonOtherSliceTypes.indexOf(slice.sliceLabel) !== -1) {
            newBarData.push(slice);
          } else {
            otherSlice.value += slice.value;
          }
        });
        newBarData.sort(_this.get('sliceSortingFn'));
        if (otherSlice.value !== 0) {
          newBarData.push(otherSlice);
        }
        result[barLabel] = newBarData;
        return result;
      }, {});
    }),

    /**
     * Final data to be consumed by d3 and rendered into the chart.
     * Contains positioning information of slice above/below x-axis, labels,
     * and color.
     * @type {Array.<Object>}
     */
    finishedData: _ember['default'].computed('sortedData', function () {
      var posTop, negBottom, stackedSlices;
      return _.map(this.get('sortedData'), function (slices, barLabel) {
        // We need to track the top and bottom of the bar so we know where to
        // add any positive or negative slices, respectively.
        posTop = 0;
        negBottom = 0;
        stackedSlices = _.map(slices, function (slice) {
          var yMin, yMax;
          if (slice.value < 0) {
            yMax = negBottom;
            negBottom += slice.value;
            yMin = negBottom;
          } else {
            yMin = posTop;
            posTop += slice.value;
            yMax = posTop;
          }
          return {
            yMin: yMin,
            yMax: yMax,
            value: slice.value,
            barLabel: slice.barLabel,
            sliceLabel: slice.sliceLabel,
            color: slice.color
          };
        });

        return {
          barLabel: barLabel,
          slices: slices,
          stackedSlices: stackedSlices,
          max: posTop,
          min: negBottom
        };
      });
    }),

    // ---------------------------------------------------------------------------
    // Slice and Bar Sorting
    // ---------------------------------------------------------------------------

    /**
     * Key used to determine slice sorting order. Can be 'value', 'none', or
     * 'other'.
     * @see valueSliceSortingFn
     * @see originalOrderSliceSortingFn
     * @see customSliceSortingFn
     * @type {string}
     */
    sliceSortKey: 'value',

    /**
     * Slice order for when sliceSortKey is set to `value`
     * Starting with the largest net-value bar, sort slices in each bar by abs.
     * value, and add these to the slice order (from largest to smallest)
     * assuming they are not already in the order. Then repeat this process for
     * all bars to make sure all slices are listed in the order.
     * @see sliceSortKey
     * @see valueSliceSortingFn
     * @type {Array.<string>}
     */
    sliceOrderByValue: _ember['default'].computed('netBarValues.[]', 'dataGroupedByBar', 'otherSliceLabel', function () {
      var sortedBars, sliceOrder, slicesInBar, allSlicesByBar;
      allSlicesByBar = this.get('dataGroupedByBar');
      sortedBars = _.sortBy(this.get('netBarValues'), 'value').reverse();
      sliceOrder = [];
      sortedBars.forEach(function (bar) {
        slicesInBar = _.sortBy(allSlicesByBar[bar.barLabel], function (slice) {
          return -Math.abs(slice.value);
        });
        slicesInBar.forEach(function (slice) {
          if (sliceOrder.indexOf(slice.sliceLabel) === -1) {
            sliceOrder.push(slice.sliceLabel);
          }
        });
      });
      sliceOrder.push(this.get('otherSliceLabel'));
      return sliceOrder;
    }),

    /**
     * Comparison function for slices for when sliceSortKey is 'value'
     * @see sliceSortKey
     * @see sliceOrderByValue
     * @type {function}
     */
    valueSliceSortingFn: _ember['default'].computed('sliceOrderByValue.[]', function () {
      var _this2 = this;

      var sliceOrder = this.get('sliceOrderByValue');
      return function (slice1, slice2) {
        return _this2.defaultCompareFn(sliceOrder.indexOf(slice1.sliceLabel), sliceOrder.indexOf(slice2.sliceLabel));
      };
    }),

    /**
     * Comparison function for slices when sliceSortKey is 'custom'
     * Can override the custom sorting function to sort by any comparison
     * function. By default, this sorts slices alphabetically by sliceLabel.
     * @see sliceSortKey
     * @type {function}
     */
    customSliceSortingFn: _ember['default'].computed(function () {
      var _this3 = this;

      return function (slice1, slice2) {
        return _this3.defaultCompareFn(slice1.sliceLabel, slice2.sliceLabel);
      };
    }),

    /**
     * Comparison function for slices when sliceSortKey is 'none'
     * Sort each slice within its bar based on the order it is listed in the
     * original input data.
     * @see sliceSortKey
     * @type {function}
     */
    originalOrderSliceSortingFn: _ember['default'].computed('data.[]', function () {
      var _this4 = this;

      var data = this.get('data');
      return function (slice1, slice2) {
        return _this4.defaultCompareFn(data.indexOf(slice1), data.indexOf(slice2));
      };
    }),

    /**
     * The current slice sorting function, depending on what sliceSortKey is.
     * @type {function}
     */
    sliceSortingFn: _ember['default'].computed('valueSliceSortingFn', 'customSliceSortingFn', 'originalOrderSliceSortingFn', 'sliceSortKey', function () {
      var sliceSortKey = this.get('sliceSortKey');
      if (sliceSortKey === 'value') {
        return this.get('valueSliceSortingFn');
      } else if (sliceSortKey === 'custom') {
        return this.get('customSliceSortingFn');
      } else if (sliceSortKey === 'none' || _ember['default'].isNone(sliceSortKey)) {
        return this.get('originalOrderSliceSortingFn');
      } else {
        throw new Error("Invalid sliceSortKey");
      }
    }),

    /**
     * Key used to determine bar sorting order. Can be 'value', 'none', or
     * 'other'.
     * @see valueBarSortingFn
     * @see originalOrderBarSortingFn
     * @see customBarSortingFn
     * @type {string}
     */
    barSortKey: 'value',

    /**
     * Whether bars should be sorted by the `barSortKey` in ascending or
     * descending order.
     * @type {boolean}
     */
    barSortAscending: true,

    /**
     * Comparison function for when bar data when barSortKey is 'value'
     * Sort bars based on the net value of each bar.
     * @see barSortKey
     * @type {function}
     */
    valueBarSortingFn: _ember['default'].computed(function () {
      var _this5 = this;

      return function (barData1, barData2) {
        return _this5.defaultCompareFn(barData1.value, barData2.value);
      };
    }),

    /**
     * The original order that bar labels are listed from the input data.
     * We preserve this order so that bars can be sorted in the original input
     * order when `barSortKey` is set to 'none'.
     * @see originalOrderBarSortingFn
     * @type {Array.<String>}
     */
    originalBarOrder: _ember['default'].computed('data.[]', function () {
      var barOrder = [];
      this.get('data').forEach(function (datum) {
        if (barOrder.indexOf(datum.barLabel) === -1) {
          barOrder.push(datum.barLabel);
        }
      });
      return barOrder;
    }),

    /**
     * Comparison function for bar data when barSortKey is 'custom'
     * Can override the custom sorting function to sort by any comparison
     * function. By default, this sorts bars alphabetically by sliceLabel.
     * @see barSortKey
     * @type {function}
     */
    customBarSortingFn: _ember['default'].computed(function () {
      var _this6 = this;

      return function (barData1, barData2) {
        return _this6.defaultCompareFn(barData1.barLabel, barData2.barLabel);
      };
    }),

    /**
     * Comparison function for bar data when barSortKey is 'none'
     * Sort bars based on the order each barLabel appears in the original input
     * data.
     * @see originalBarOrder
     * @see barSortKey
     * @type {function}
     */
    originalOrderBarSortingFn: _ember['default'].computed('originalBarOrder.[]', function () {
      var _this7 = this;

      var originalOrder = this.get('originalBarOrder');
      return function (barData1, barData2) {
        return _this7.defaultCompareFn(originalOrder.indexOf(barData1.barLabel), originalOrder.indexOf(barData2.barLabel));
      };
    }),

    /**
     * The current bar sorting function, depending on what barSortKey is.
     * @type {function}
     */
    barSortingFn: _ember['default'].computed('valueBarSortingFn', 'customBarSortingFn', 'originalOrderBarSortingFn', 'barSortKey', function () {
      var barSortKey = this.get('barSortKey');
      if (barSortKey === 'value') {
        return this.get('valueBarSortingFn');
      } else if (barSortKey === 'custom') {
        return this.get('customBarSortingFn');
      } else if (barSortKey === 'none' || _ember['default'].isNone(barSortKey)) {
        return this.get('originalOrderBarSortingFn');
      } else {
        throw new Error("Invalid barSortKey");
      }
    }),

    /**
     * Array containing an object for each bar. These objects contain the barLabel
     * and net value for each bar. Used for bar sorting in `barNames`.
     * @type {Array.<Object>}
     */
    netBarValues: _ember['default'].computed('dataGroupedByBar', function () {
      var dataGroupedByBar = this.get('dataGroupedByBar');
      return _.map(dataGroupedByBar, function (barData, barLabel) {
        var barValue = barData.reduce(function (sum, slice) {
          return sum + slice.value;
        }, 0);
        return { barLabel: barLabel, value: barValue };
      });
    }),

    /**
     * Order in which bars should appear in the chart, by bar label. This list
     * is sorted using the appropriate barSortingFn.
     * @see barSortingFn
     * @type {Array.<string>}
     */
    barNames: _ember['default'].computed('netBarValues', 'barSortingFn', 'barSortAscending', function () {
      var sortedBars, sortedBarNames;
      sortedBars = this.get('netBarValues').sort(this.get('barSortingFn'));
      sortedBarNames = _.pluck(sortedBars, 'barLabel');
      if (!this.get('barSortAscending')) {
        sortedBarNames.reverse();
      }
      return sortedBarNames;
    }),

    /**
     * Explicitly written version of the default comparison function that is used
     * by Array#sort. Used by every slice and bar comparison functions that are
     * comparing specific parameters.
     * @function
     */
    defaultCompareFn: function defaultCompareFn(reference1, reference2) {
      if (reference1 < reference2) {
        return -1;
      } else if (reference1 > reference2) {
        return 1;
      } else {
        return 0;
      }
    },

    // ---------------------------------------------------------------------------
    // Layout
    // ---------------------------------------------------------------------------

    labelHeightOffset: _ember['default'].computed('_shouldRotateLabels', 'maxLabelHeight', 'labelHeight', 'labelPadding', function () {
      var labelSize;

      if (this.get('_shouldRotateLabels')) {
        labelSize = this.get('maxLabelHeight');
      } else {
        // Inherited from parent class ChartComponent
        labelSize = this.get('labelHeight');
      }
      return labelSize + this.get('labelPadding');
    }),

    // Chart Graphic Dimensions
    graphicLeft: _ember['default'].computed.alias('labelWidthOffset'),

    graphicWidth: _ember['default'].computed('width', 'labelWidthOffset', function () {
      return this.get('width') - this.get('labelWidthOffset');
    }),

    graphicHeight: _ember['default'].computed('height', 'legendHeight', 'legendChartPadding', function () {
      return this.get('height') - this.get('legendHeight') - this.get('legendChartPadding');
    }),

    // ---------------------------------------------------------------------------
    // Ticks and Scales
    // ---------------------------------------------------------------------------

    // Vertical position/length of each bar and its value
    yDomain: _ember['default'].computed('finishedData', function () {
      var finishedData = this.get('finishedData');

      var max = d3.max(finishedData, function (d) {
        return d.max;
      });

      var min = d3.min(finishedData, function (d) {
        return d.min;
      });

      // force one end of the range to include zero
      if (min > 0) {
        return [0, max];
      }
      if (max < 0) {
        return [min, 0];
      }
      if (min === 0 && max === 0) {
        return [0, 1];
      } else {
        return [min, max];
      }
    }),

    yScale: _ember['default'].computed('graphicTop', 'graphicHeight', 'yDomain', 'numYTicks', function () {
      return d3.scale.linear().domain(this.get('yDomain')).range([this.get('graphicTop') + this.get('graphicHeight'), this.get('graphicTop')]).nice(this.get('numYTicks'));
    }),

    /**
     * All slice labels to show in the chart legend. Includes 'Other' slice if the
     * 'Other' slice is present.
     * @type {Array.<string>}
     */
    allSliceLabels: _ember['default'].computed('nonOtherSliceTypes.[]', 'otherSliceTypes.[]', 'otherSliceLabel', function () {
      var result = _.clone(this.get('nonOtherSliceTypes'));
      if (this.get('otherSliceTypes').length > 0) {
        result.push(this.get('otherSliceLabel'));
      }
      return result;
    }),

    labelIDMapping: _ember['default'].computed('allSliceLabels.[]', function () {
      var allSliceLabels = this.get('allSliceLabels');
      return _.zipObject(allSliceLabels, _.range(allSliceLabels.length));
    }),

    // The space in pixels allocated to each bar
    barWidth: _ember['default'].computed('xBetweenBarScale', function () {
      return this.get('xBetweenBarScale').rangeBand();
    }),

    // The scale used to position each bar and label across the horizontal axis
    xBetweenBarScale: _ember['default'].computed('graphicWidth', 'barNames', 'betweenBarPadding', function () {
      var betweenBarPadding = this.get('betweenBarPadding');

      return d3.scale.ordinal().domain(this.get('barNames')).rangeRoundBands([0, this.get('graphicWidth')],
      // inner padding (between bars)
      betweenBarPadding,
      // outer padding (between outer bars and edge)
      betweenBarPadding);
    }),

    // Override axis mix-in min and max values to listen to the scale's domain
    minAxisValue: _ember['default'].computed('yScale', function () {
      var yScale = this.get('yScale');
      return yScale.domain()[0];
    }),

    maxAxisValue: _ember['default'].computed('yScale', function () {
      var yScale = this.get('yScale');
      return yScale.domain()[1];
    }),

    // ---------------------------------------------------------------------------
    // Color Configuration
    // ---------------------------------------------------------------------------

    /**
     * Total number of colors needed to display.
     * When calculating the default slice colors, D3 divides a color gradient up
     * using this number to create an 'even' distribution of colors.
     * @type {number}
     */
    numColorSeries: _ember['default'].computed.alias('allSliceLabels.length'),

    /**
     * Map between sliceLabels and default slice color.
     * These colors are calculated by D3 with `getSeriesColor`, which maps the
     * range of sliceLabels against a color gradient. In order to customize the
     * colors for each individual sliceLabel, this property can be overridden or
     * extended.
     * @type {Object.<string,string>}
     */
    sliceColors: _ember['default'].computed('allSliceLabels.[]', 'getSeriesColor', function () {
      var fnGetSeriesColor = this.get('getSeriesColor');
      var result = {};
      this.get('allSliceLabels').forEach(function (label, labelIndex) {
        result[label] = fnGetSeriesColor(label, labelIndex);
      });
      return result;
    }),

    /**
     * Function that returns the correct color for a given slice.
     * Used by D3 to dynamically set the color for each slice rect element in
     * `updateGraphic`.
     * @type {function}
     */
    fnGetSliceColor: _ember['default'].computed('sliceColors.[]', function () {
      var sliceColors = this.get('sliceColors');
      return function (d) {
        return sliceColors[d.sliceLabel];
      };
    }),

    // ---------------------------------------------------------------------------
    // Legend Configuration
    // ---------------------------------------------------------------------------

    hasLegend: true,

    legendItems: _ember['default'].computed('allSliceLabels.[]', 'sliceColors', 'labelIDMapping', function () {
      var _this8 = this;

      var sliceColors = this.get('sliceColors');
      return this.get('allSliceLabels').map(function (label) {
        var color = sliceColors[label];
        return {
          label: label,
          fill: color,
          stroke: color,
          icon: function icon() {
            return 'square';
          },
          selector: ".grouping-" + _this8.get('labelIDMapping')[label]
        };
      });
    }),

    // ---------------------------------------------------------------------------
    // Tooltip Configuration
    // ---------------------------------------------------------------------------

    showDetails: _ember['default'].computed('isInteractive', function () {
      var _this9 = this;

      if (!this.get('isInteractive')) {
        return _ember['default'].K;
      }

      return function (data, i, element) {
        // Specify whether we are on an individual bar or group
        var isGroup = _ember['default'].isArray(data.slices);

        // Do hover detail style stuff here
        element = isGroup ? element.parentNode.parentNode : element;
        d3.select(element).classed('hovered', true);

        // Show tooltip
        var content = $('<span />');
        if (data.barLabel) {
          content.append($('<span class="tip-label" />').text(data.barLabel));
        }

        var formatLabel = _this9.get('formatLabelFunction');
        var addValueLine = function addValueLine(d) {
          var label = $('<span class="name" />').text(d.sliceLabel + ": ");
          content.append(label);
          var value = $('<span class="value" />').text(formatLabel(d.value));
          content.append(value);
          content.append('<br />');
        };

        if (isGroup) {
          // Display all bar details if hovering over axis group label
          data.slices.forEach(addValueLine);
        } else {
          // Just hovering over single bar
          addValueLine(data);
        }
        return _this9.showTooltip(content.html(), d3.event);
      };
    }),

    hideDetails: _ember['default'].computed('isInteractive', function () {
      var _this10 = this;

      if (!this.get('isInteractive')) {
        return _ember['default'].K;
      }

      return function (data, i, element) {
        // if we exited the group label undo for the group
        if (_ember['default'].isArray(data.slices)) {
          element = element.parentNode.parentNode;
        }
        // Undo hover style stuff
        d3.select(element).classed('hovered', false);

        // Hide Tooltip
        return _this10.hideTooltip();
      };
    }),

    // ---------------------------------------------------------------------------
    // Styles
    // ---------------------------------------------------------------------------

    barAttrs: _ember['default'].computed('graphicLeft', 'graphicTop', 'xBetweenBarScale', function () {
      var _this11 = this;

      var xBetweenBarScale = this.get('xBetweenBarScale');

      return {
        transform: function transform(d) {
          var dx = _this11.get('graphicLeft');
          if (xBetweenBarScale(d.barLabel)) {
            dx += xBetweenBarScale(d.barLabel);
          }
          var dy = _this11.get('graphicTop');

          return "translate(" + dx + ", " + dy + ")";
        }
      };
    }),

    sliceAttrs: _ember['default'].computed('yScale', 'barWidth', 'labelIDMapping', 'strokeWidth', function () {
      var _this12 = this;

      var yScale, zeroDisplacement;
      zeroDisplacement = 1;
      yScale = this.get('yScale');
      return {
        "class": function _class(slice) {
          var id = _this12.get('labelIDMapping')[slice.sliceLabel];
          return "grouping-" + id;
        },
        'stroke-width': this.get('strokeWidth').toString() + 'px',
        width: function width() {
          return _this12.get('barWidth');
        },
        x: null,
        y: function y(slice) {
          return yScale(slice.yMax) + zeroDisplacement;
        },
        height: function height(slice) {
          return yScale(slice.yMin) - yScale(slice.yMax);
        }
      };
    }),

    labelAttrs: _ember['default'].computed('barWidth', 'graphicTop', 'graphicHeight', 'labelPadding', function () {
      var _this13 = this;

      return {
        'stroke-width': 0,
        transform: function transform() {
          var dx = _this13.get('barWidth') / 2;
          var dy = _this13.get('graphicTop') + _this13.get('graphicHeight') + _this13.get('labelPadding');
          return "translate(" + dx + ", " + dy + ")";
        }
      };
    }),

    // ---------------------------------------------------------------------------
    // Selections
    // ---------------------------------------------------------------------------

    bars: _ember['default'].computed(function () {
      return this.get('viewport').selectAll('.bars').data(this.get('finishedData'));
    }).volatile(),

    yAxis: _ember['default'].computed(function () {
      var yAxis = this.get('viewport').select('.y.axis');
      if (yAxis.empty()) {
        return this.get('viewport').insert('g', ':first-child').attr('class', 'y axis');
      } else {
        return yAxis;
      }
    }).volatile(),

    // ---------------------------------------------------------------------------
    // Label Layout
    // ---------------------------------------------------------------------------

    // Space available for labels that are horizontally displayed.
    maxLabelWidth: _ember['default'].computed.readOnly('barWidth'),

    _shouldRotateLabels: false,

    setRotateLabels: function setRotateLabels() {
      var labels, maxLabelWidth, rotateLabels;
      labels = this.get('bars').select('.groupLabel text');
      maxLabelWidth = this.get('maxLabelWidth');
      rotateLabels = false;
      if (this.get('rotatedLabelLength') > maxLabelWidth) {
        labels.each(function () {
          if (this.getBBox().width > maxLabelWidth) {
            rotateLabels = true;
            return;
          }
        });
      }
      return this.set('_shouldRotateLabels', rotateLabels);
    },

    // Calculate the number of degrees to rotate labels based on how widely labels
    // will be spaced, but never rotate the labels less than 20 degrees
    rotateLabelDegrees: _ember['default'].computed('labelHeight', 'maxLabelWidth', function () {
      var radians = Math.atan(this.get('labelHeight') / this.get('maxLabelWidth'));
      var degrees = radians * 180 / Math.PI;
      return Math.max(degrees, 20);
    }),

    rotatedLabelLength: _ember['default'].computed('maxLabelHeight', 'rotateLabelDegrees', function () {
      var rotateLabelRadians = Math.PI / 180 * this.get('rotateLabelDegrees');
      return Math.abs(this.get('maxLabelHeight') / Math.sin(rotateLabelRadians));
    }),

    // ---------------------------------------------------------------------------
    // Drawing Functions
    // ---------------------------------------------------------------------------

    renderVars: ['xBetweenBarScale', 'yScale', 'finishedData', 'getSeriesColor', 'xValueDisplayName', 'yValueDisplayName', 'hasAxisTitles', // backward compatibility support.
    'hasXAxisTitle', 'hasYAxisTitle', 'xTitleHorizontalOffset', 'yTitleVerticalOffset', 'strokeWidth'],

    drawChart: function drawChart() {
      this.updateData();
      this.updateLayout();
      this.updateAxes();
      this.updateGraphic();
      this.updateAxisTitles();
      if (this.get('hasLegend')) {
        return this.drawLegend();
      } else {
        return this.clearLegend();
      }
    },

    updateData: function updateData() {
      var bars = this.get('bars');
      var showDetails = this.get('showDetails');
      var hideDetails = this.get('hideDetails');

      var entering = bars.enter().append('g').attr('class', 'bars');
      entering.append('g').attr('class', 'groupLabel').append('text').on("mouseover", function (d, i) {
        return showDetails(d, i, this);
      }).on("mouseout", function (d, i) {
        return hideDetails(d, i, this);
      });
      bars.exit().remove();

      var subdata = function subdata(d) {
        return d.stackedSlices;
      };

      var slices = bars.selectAll('rect').data(subdata);
      slices.enter().append('rect').on("mouseover", function (d, i) {
        return showDetails(d, i, this);
      }).on("mouseout", function (d, i) {
        return hideDetails(d, i, this);
      });
      return slices.exit().remove();
    },

    updateLayout: function updateLayout() {
      var _this14 = this;

      var bars = this.get('bars');
      var labels = bars.select('.groupLabel text').attr('transform', null) // remove any previous rotation attrs
      .text(function (d) {
        return d.barLabel;
      });

      // If there is enough space horizontally, center labels underneath each
      // group. Otherwise, rotate each label and anchor it at the top of its
      // first character.
      this.setRotateLabels();
      var labelTrimmer;

      if (this.get('_shouldRotateLabels')) {
        var rotateLabelDegrees = this.get('rotateLabelDegrees');
        labelTrimmer = _emberChartsUtilsLabelTrimmer['default'].create({
          getLabelSize: function getLabelSize() {
            return _this14.get('rotatedLabelLength');
          },
          getLabelText: function getLabelText(d) {
            return d.barLabel;
          }
        });

        return labels.call(labelTrimmer.get('trim')).attr({
          'text-anchor': 'end',
          transform: "rotate(" + -rotateLabelDegrees + ")",
          dy: function dy() {
            return this.getBBox().height;
          }
        });
      } else {
        var maxLabelWidth = this.get('maxLabelWidth');
        labelTrimmer = _emberChartsUtilsLabelTrimmer['default'].create({
          getLabelSize: function getLabelSize() {
            return maxLabelWidth;
          },
          getLabelText: function getLabelText(d) {
            return d.barLabel != null ? d.barLabel : '';
          }
        });

        return labels.call(labelTrimmer.get('trim')).attr({
          'text-anchor': 'middle',
          dy: this.get('labelPadding')
        });
      }
    },

    updateAxes: function updateAxes() {
      //tickSize isn't doing anything here, it should take two arguments
      var yAxis = d3.svg.axis().scale(this.get('yScale')).orient('right').ticks(this.get('numYTicks')).tickSize(this.get('graphicWidth')).tickFormat(this.get('formatValueAxis'));

      var gYAxis = this.get('yAxis');

      // find the correct size of graphicLeft in order to fit the Labels perfectly
      this.set('graphicLeft', this.maxLabelLength(gYAxis.selectAll('text')) + this.get('labelPadding'));

      var graphicTop = this.get('graphicTop');
      var graphicLeft = this.get('graphicLeft');
      gYAxis.attr({
        transform: "translate(" + graphicLeft + ", " + graphicTop + ")"
      }).call(yAxis);

      gYAxis.selectAll('g').filter(function (d) {
        return d !== 0;
      }).classed('major', false).classed('minor', true);

      gYAxis.selectAll('text').style('text-anchor', 'end').attr({
        x: -this.get('labelPadding')
      });
    },

    updateGraphic: function updateGraphic() {
      var bars = this.get('bars');
      var sliceAttrs = this.get('sliceAttrs');

      bars.attr(this.get('barAttrs'));
      bars.selectAll('rect').attr(sliceAttrs).style('fill', this.get('fnGetSliceColor'));
      return bars.select('g.groupLabel').attr(this.get('labelAttrs'));
    }
  });

  exports['default'] = StackedVerticalBarChartComponent;
});
define('ember-charts/components/time-series-chart', ['exports', 'ember', 'ember-charts/components/chart-component', 'ember-charts/mixins/legend', 'ember-charts/mixins/time-series-labeler', 'ember-charts/mixins/floating-tooltip', 'ember-charts/mixins/has-time-series-rule', 'ember-charts/mixins/axes', 'ember-charts/mixins/formattable', 'ember-charts/mixins/no-margin-chart', 'ember-charts/mixins/axis-titles', 'ember-charts/utils/group-by'], function (exports, _ember, _emberChartsComponentsChartComponent, _emberChartsMixinsLegend, _emberChartsMixinsTimeSeriesLabeler, _emberChartsMixinsFloatingTooltip, _emberChartsMixinsHasTimeSeriesRule, _emberChartsMixinsAxes, _emberChartsMixinsFormattable, _emberChartsMixinsNoMarginChart, _emberChartsMixinsAxisTitles, _emberChartsUtilsGroupBy) {
  'use strict';

  var TimeSeriesChartComponent = _emberChartsComponentsChartComponent['default'].extend(_emberChartsMixinsLegend['default'], _emberChartsMixinsTimeSeriesLabeler['default'], _emberChartsMixinsFloatingTooltip['default'], _emberChartsMixinsHasTimeSeriesRule['default'], _emberChartsMixinsAxes['default'], _emberChartsMixinsFormattable['default'], _emberChartsMixinsNoMarginChart['default'], _emberChartsMixinsAxisTitles['default'], {

    classNames: ['chart-time-series'],

    // ----------------------------------------------------------------------------
    // API -- inputs
    //
    // lineData, barData:
    // Both data sets need to be in the following format:
    // [{label: ..., time: ..., value: ...}, {...}, ...]
    // Line data will be grouped by label, while bar data is grouped by
    // time and then label
    //
    // ----------------------------------------------------------------------------
    lineData: null,
    barData: null,

    // ----------------------------------------------------------------------------
    // Time Series Chart Options
    // ----------------------------------------------------------------------------

    // Getters for formatting human-readable labels from provided data
    formatTime: d3.time.format('%Y-%m-%d'),
    formatTimeLong: d3.time.format('%a %b %-d, %Y'),

    // Data without group will be merged into a group with this name
    ungroupedSeriesName: 'Other',

    // Use basis interpolation? Smooths lines but may prevent extrema from being
    // displayed
    interpolate: false,

    // Force the Y axis to start at zero, instead of the smallest Y value provided
    yAxisFromZero: false,

    // Space between bars, as fraction of total bar + padding space
    barPadding: 0,

    // Space between bar groups, as fraction of total bar + padding space
    barGroupPadding: 0.25,

    // Bar left offset, as fraction of width of bar
    barLeftOffset: 0.0,

    // Force X-Axis labels to print vertically
    xAxisVertLabels: false,

    // ----------------------------------------------------------------------------
    // Time Series Chart Constants
    // ----------------------------------------------------------------------------

    // The default maximum number of labels to use along the x axis for a dynamic
    // x axis.
    DEFAULT_MAX_NUMBER_OF_LABELS: 10,

    // ----------------------------------------------------------------------------
    // Overrides of ChartComponent methods
    // ----------------------------------------------------------------------------

    // Combine all data for testing purposes
    finishedData: _ember['default'].computed('_groupedLineData.@each.values', '_groupedBarData.@each', function () {
      return {
        lineData: this.get('_groupedLineData'),
        groupedBarData: this.get('_groupedBarData')
      };
    }),

    hasNoData: _ember['default'].computed('_hasBarData', '_hasLineData', function () {
      return !this.get('_hasBarData') && !this.get('_hasLineData');
    }),

    // ----------------------------------------------------------------------------
    // Overrides of Legend methods
    // ----------------------------------------------------------------------------

    // ----------------------------------------------------------------------------
    // Data
    // ----------------------------------------------------------------------------

    _getLabelOrDefault: function _getLabelOrDefault(datum) {
      return datum.label && datum.label.toString() || this.get('ungroupedSeriesName');
    },

    // Puts lineData in a new format.
    // Resulting format is [{group: ..., values: ...}] where values are the
    // lineData values for that group.
    _groupedLineData: _ember['default'].computed('lineData.@each', 'ungroupedSeriesName', function () {
      var _this = this;

      var lineData = this.get('lineData');
      if (_ember['default'].isEmpty(lineData)) {
        return [];
      }

      var groups = (0, _emberChartsUtilsGroupBy.groupBy)(lineData, function (datum) {
        return _this._getLabelOrDefault(datum);
      });

      return _.map(groups, function (values, groupName) {
        return {
          group: groupName,
          values: values
        };
      });
    }),

    // puts barData in a new format.
    // Resulting format: [[{group: ..., time: ..., value: ..., label:
    // ...}, ...], [...]] where each internal array is an array of hashes
    // at the same time
    _groupedBarData: _ember['default'].computed('barData.@each', 'ungroupedSeriesName', 'barLeftOffset', function () {
      var _this2 = this;

      var barData = this.get('barData');
      if (_ember['default'].isEmpty(barData)) {
        return [];
      }

      // returns map from time to array of bar hashes
      var barTimes = (0, _emberChartsUtilsGroupBy.groupBy)(barData, function (d) {
        return d.time.getTime();
      });

      return _.map(barTimes, function (groups) {
        return _.map(groups, function (g) {
          var label = _this2._getLabelOrDefault(g);
          var labelTime = g.time;
          var drawTime = _this2._transformCenter(g.time);
          return {
            group: label,
            time: drawTime,
            value: g.value,
            label: label,
            labelTime: labelTime
          };
        });
      });
    }),

    // Transforms the center of the bar graph for the drawing based on the
    // specified barLeftOffset
    _transformCenter: function _transformCenter(time) {
      // Transform Center is designed to offset Bar graphs against the labels on
      // the x axis.  That offset is based on the time unit selected.  This means
      // that a graph might have a selectedInterval of Months, but that the bars
      // are based on Weeks.  So if you were to shift a bar 1/2 of an interval it
      // would move 15 days instead of 15 weeks.  The fix is to check to see if
      // the bars are of a different interval first, before defaulting to the
      // selectedInterval
      var interval = this.get('computedBarInterval') || this.get('selectedInterval');
      var delta = this._getTimeDeltaFromInterval(interval);
      var offset = this.get('barLeftOffset');
      if (offset !== 0) {
        time = this._padTimeWithIntervalMultiplier(time, delta, offset);
      }
      return time;
    },

    // Since selected interval and time delta don't use the same naming convention
    // this converts the selected interval to the time delta convention for the
    // padding functions.
    _getTimeDeltaFromInterval: function _getTimeDeltaFromInterval(interval) {
      switch (interval) {
        case 'years':
        case 'Y':
          return 'year';
        case 'quarters':
        case 'Q':
          return 'quarter';
        case 'months':
        case 'M':
          return 'month';
        case 'weeks':
        case 'W':
          return 'week';
        case 'seconds':
        case 'S':
          return 'second';
      }
    },

    // Given a time, returns the time plus half an interval
    _padTimeForward: function _padTimeForward(time, delta) {
      return this._padTimeWithIntervalMultiplier(time, delta, 0.5);
    },

    // Given a time, returns the time minus half an interval
    _padTimeBackward: function _padTimeBackward(time, delta) {
      return this._padTimeWithIntervalMultiplier(time, delta, -0.5);
    },

    // Because of the complexities of what will and won't work with this method,
    // it's not very safe to call. Instead, call _padTimeForward or
    // _padTimeBackward. This method exists to remove code duplication from those.
    _padTimeWithIntervalMultiplier: function _padTimeWithIntervalMultiplier(time, delta, multiplier) {
      if (time != null) {
        var intervalType = delta === 'quarter' ? 'month' : delta;
        var period = delta === 'quarter' ? 3 : 1;
        var offsetDelta = d3.time[intervalType].offset(time, period) - time.getTime();
        time = offsetDelta * multiplier + time.getTime();
      }
      return new Date(time);
    },

    // We'd like to have the option of turning our labels vertical when circumstances
    // require.  This function gets ALL the labels of the xAxis and rotates them.
    _rotateXAxisLabels: function _rotateXAxisLabels() {
      var gXAxis = this.get('xAxis');

      // If we have a legend it'll take care of the margin bottom adjustments,
      // else we need to give ourselves some more room for the labels.
      if (!this.get('hasLegend')) {
        this.set('marginBottom', 20);
      }

      gXAxis.selectAll('text').attr("y", 8).attr("x", -8).attr("dy", ".2em").attr("transform", "rotate(-60)").style("text-anchor", "end");

      // we also need to mod the legend top padding
      this.set('legendTopPadding', 30);
    },

    // Now that we can get our labels all turny, I actually need to straighten them
    // out if the feature is toggled
    _straightenXAxisLabels: function _straightenXAxisLabels() {
      var gXAxis = this.get('xAxis');
      // most of these values are static and come from various places, including
      // the bowels of D3
      gXAxis.selectAll('text').attr("y", 9).attr("x", 0).attr("dy", "0.71em").attr("transform", null).style("text-anchor", "middle");
    },

    _barGroups: _ember['default'].computed('barData.@each', 'ungroupedSeriesName', function () {
      var _this3 = this;

      var barData = this.get('barData');
      if (_ember['default'].isEmpty(barData)) {
        return [];
      }

      var barGroups = (0, _emberChartsUtilsGroupBy.groupBy)(barData, function (datum) {
        return _this3._getLabelOrDefault(datum);
      });
      return _.keys(barGroups);
    }),

    _hasLineData: _ember['default'].computed.notEmpty('lineData'),

    _hasBarData: _ember['default'].computed.notEmpty('barData'),

    // ----------------------------------------------------------------------------
    // Layout
    // ----------------------------------------------------------------------------

    // position of the left of the graphic -- we want to leave space for
    // labels
    graphicLeft: _ember['default'].computed.alias('labelWidthOffset'),

    // width of the graphic
    graphicWidth: _ember['default'].computed('width', 'graphicLeft', function () {
      return this.get('width') - this.get('graphicLeft');
    }),

    graphicHeight: _ember['default'].computed('height', 'legendHeight', 'legendChartPadding', 'marginBottom', function () {
      var legendSize = this.get('legendHeight') + this.get('legendChartPadding') + (this.get('marginBottom') || 0);
      return this.get('height') - legendSize;
    }),

    // ----------------------------------------------------------------------------
    // Grouped/Stacked Bar Scales
    // ----------------------------------------------------------------------------

    // Unit of time between bar samples
    timeDelta: _ember['default'].computed('_groupedBarData', function () {
      var groupedBarData = this.get('_groupedBarData');
      if (_ember['default'].isEmpty(groupedBarData) || groupedBarData.length < 2) {
        return 'month';
      }

      // difference in time between first bar data group and second bar
      // data group
      var firstBarTime = groupedBarData[0][0].time;
      var secondBarTime = groupedBarData[1][0].time;
      var oneDayInSeconds = 24 * 60 * 60 * 1000;
      var diffTimeDays = (secondBarTime - firstBarTime) / oneDayInSeconds;

      // Some fuzzy bar interval computation, I just picked 2 day buffer
      if (diffTimeDays > 351) {
        return 'year';
      } else if (diffTimeDays > 33) {
        return 'quarter';
      } else if (diffTimeDays > 9) {
        return 'month';
      } else if (diffTimeDays > 3) {
        return 'week';
      } else {
        return 'day';
      }
    }),

    // this method seems very flaky to me; making padding by changing domain
    // convention is to change range
    barDataExtent: _ember['default'].computed('timeDelta', '_groupedBarData.@each', function () {
      var timeDelta = this.get('timeDelta');
      var groupedBarData = this.get('_groupedBarData');
      if (_ember['default'].isEmpty(groupedBarData)) {
        return [new Date(), new Date()];
      }

      var first = _.first(groupedBarData);
      var last = _.last(groupedBarData);
      var startTime = new Date(first[0].time);
      var endTime = new Date(last[0].time);

      // Add the padding needed for the edges of the bar
      var paddedStart = this._padTimeBackward(startTime, timeDelta);
      var paddedEnd = this._padTimeForward(endTime, timeDelta);
      return [new Date(paddedStart), new Date(paddedEnd)];
    }),

    // The time range over which all bar groups are drawn
    xBetweenGroupDomain: _ember['default'].computed.alias('barDataExtent'),

    // The range of labels assigned within each group
    xWithinGroupDomain: _ember['default'].computed.alias('_barGroups'),

    // The space (in pixels) allocated to each bar, including padding
    barWidth: _ember['default'].computed('xGroupScale', function () {
      return this.get('xGroupScale').rangeBand();
    }),

    paddedGroupWidth: _ember['default'].computed('timeDelta', 'xTimeScale', 'xBetweenGroupDomain', function () {
      var timeDelta = this.get('timeDelta');
      var scale = this.get('xTimeScale');
      var t1 = this.get('xBetweenGroupDomain')[0];
      var t2 = timeDelta === 'quarter' ? d3.time['month'].offset(t1, 3) : d3.time[timeDelta].offset(t1, 1);
      return scale(t2) - scale(t1);
    }),
    // ----------------------------------------------------------------------------
    // Line Drawing Scales
    // ----------------------------------------------------------------------------

    lineSeriesNames: _ember['default'].computed('_groupedLineData', function () {
      var data = this.get('_groupedLineData');
      if (_ember['default'].isEmpty(data)) {
        return [];
      }
      return data.map(function (d) {
        return d.group;
      });
    }),

    lineDataExtent: _ember['default'].computed('_groupedLineData.@each.values', function () {
      var data = this.get('_groupedLineData');
      if (_ember['default'].isEmpty(data)) {
        return [new Date(), new Date()];
      }

      var extents = _.map(data, 'values').map(function (series) {
        return d3.extent(series.map(function (d) {
          return d.time;
        }));
      });

      return [d3.min(extents, function (e) {
        return e[0];
      }), d3.max(extents, function (e) {
        return e[1];
      })];
    }),

    // The set of all time series
    xBetweenSeriesDomain: _ember['default'].computed.alias('lineSeriesNames'),

    // The range of all time series
    xWithinSeriesDomain: _ember['default'].computed.alias('lineDataExtent'),

    // ----------------------------------------------------------------------------
    // Ticks and Scales
    // ----------------------------------------------------------------------------

    // If there is a dynamic x axis, then assume the value that it is given,
    // and if it is not a dynamic x axis, set it to the number of x axis ticks.
    //
    // For a dynamic x axis, let the max number of labels be the minimum of
    // the number of x ticks and the assigned value. This is to prevent
    // the assigned value from being so large that labels flood the x axis.
    maxNumberOfLabels: _ember['default'].computed('numXTicks', 'dynamicXAxis', 'maxNumberOfRotatedLabels', 'xAxisVertLabels', function (key, value) {
      var allowableTicks = this.get('numXTicks');
      if (this.get('xAxisVertLabels')) {
        allowableTicks = this.get('maxNumberOfRotatedLabels');
      }

      if (this.get('dynamicXAxis')) {
        if (isNaN(value)) {
          value = this.get('DEFAULT_MAX_NUMBER_OF_LABELS');
        }
        return Math.min(value, allowableTicks);
      } else {
        return allowableTicks;
      }
    }),

    // The footprint of a label rotated at -60 transform
    maxNumberOfRotatedLabels: _ember['default'].computed('_innerTickSpacingX', 'graphicWidth', 'numXTicks', function () {
      var radianVal = 30 * (Math.PI / 180);
      var tickSpacing = Math.sin(radianVal) * this.get('_innerTickSpacingX');
      var numOfTicks = Math.floor(this.get('graphicWidth') / tickSpacing);

      return Math.max(numOfTicks, this.get('numXTicks'));
    }),

    // Create a domain that spans the larger range of bar or line data
    xDomain: _ember['default'].computed('xBetweenGroupDomain', 'xWithinSeriesDomain', '_hasBarData', '_hasLineData', 'maxNumberOfLabels', function () {
      if (!this.get('_hasBarData')) {
        return this.get('xWithinSeriesDomain');
      }
      if (!this.get('_hasLineData')) {
        return this.get('xBetweenGroupDomain');
      }
      var minOfGroups = this.get('xBetweenGroupDomain')[0];
      var maxOfGroups = this.get('xBetweenGroupDomain')[1];
      var minOfSeries = this.get('xWithinSeriesDomain')[0];
      var maxOfSeries = this.get('xWithinSeriesDomain')[1];

      return [Math.min(minOfGroups, minOfSeries), Math.max(maxOfGroups, maxOfSeries)];
    }),

    // Largest and smallest values in line and bar data
    // Use raw bar data instead of doubly grouped hashes in groupedBarData
    yDomain: _ember['default'].computed('_groupedLineData', '_groupedBarData', '_hasBarData', '_hasLineData', 'yAxisFromZero', function () {

      var lineData = this.get('_groupedLineData');
      var groupData = this.get('_groupedBarData');

      var maxOfSeries = d3.max(lineData, function (d) {
        return d3.max(d.values, function (dd) {
          return dd.value;
        });
      });

      var minOfSeries = d3.min(lineData, function (d) {
        return d3.min(d.values, function (dd) {
          return dd.value;
        });
      });

      var maxOfGroups = d3.max(groupData, function (d) {
        return d3.max(d, function (dd) {
          return dd.value;
        });
      });

      var minOfGroups = d3.min(groupData, function (d) {
        return d3.min(d, function (dd) {
          return dd.value;
        });
      });

      var hasBarData = this.get('_hasBarData');
      var hasLineData = this.get('_hasLineData');

      // Find the extent of whatever data is drawn on the graph,
      // e.g. max of only line data, or max of line
      var min, max;
      if (!hasBarData) {
        min = minOfSeries;
        max = maxOfSeries;
      } else if (!hasLineData) {
        min = minOfGroups;
        max = maxOfGroups;
      } else {
        min = Math.min(minOfGroups, minOfSeries);
        max = Math.max(maxOfGroups, maxOfSeries);
      }

      // Ensure the extent contains zero if that is desired. If all values in
      // the y-domain are equal, assign it a range so data can be displayed
      if (this.get('yAxisFromZero') || min === max) {
        if (max < 0) {
          return [min, 0];
        }
        if (min > 0) {
          return [0, max];
        }
        if (min === max && max === 0) {
          return [-1, 1];
        }
      }

      return [min, max];
    }),

    yRange: _ember['default'].computed('graphicTop', 'graphicHeight', function () {
      return [this.get('graphicTop') + this.get('graphicHeight'), this.get('graphicTop')];
    }),

    yScale: _ember['default'].computed('yDomain', 'yRange', 'numYTicks', function () {
      return d3.scale.linear().domain(this.get('yDomain')).range(this.get('yRange')).nice(this.get('numYTicks'));
    }),

    xRange: _ember['default'].computed('graphicLeft', 'graphicWidth', function () {
      return [this.get('graphicLeft'), this.get('graphicLeft') + this.get('graphicWidth')];
    }),

    xTimeScale: _ember['default'].computed('xDomain', 'xRange', function () {
      return d3.time.scale().domain(this.get('xDomain')).range(this.get('xRange'));
    }),

    xGroupScale: _ember['default'].computed('xWithinGroupDomain', 'paddedGroupWidth', 'barPadding', 'barGroupPadding', function () {
      return d3.scale.ordinal().domain(this.get('xWithinGroupDomain')).rangeRoundBands([0, this.get('paddedGroupWidth')], this.get('barPadding') / 2, this.get('barGroupPadding') / 2);
    }),

    // Override axis mix-in min and max values to listen to the scale's domain
    minAxisValue: _ember['default'].computed('yScale', function () {
      var yScale = this.get('yScale');
      return yScale.domain()[0];
    }),

    maxAxisValue: _ember['default'].computed('yScale', function () {
      var yScale = this.get('yScale');
      return yScale.domain()[1];
    }),

    // ----------------------------------------------------------------------------
    // Tooltip Configuration
    // ----------------------------------------------------------------------------

    showDetails: _ember['default'].computed('isInteractive', function () {
      var _this4 = this;

      if (!this.get('isInteractive')) {
        return _ember['default'].K;
      }

      return function (data, i, element) {
        d3.select(element).classed('hovered', true);

        var time = data.labelTime != null ? data.labelTime : data.time;
        var content = $('<span>');
        content.append($("<span class=\"tip-label\">").text(_this4.get('formatTime')(time)));
        _this4.showTooltip(content.html(), d3.event);

        var formatLabelFunction = _this4.get('formatLabelFunction');

        var addValueLine = function addValueLine(d) {
          var name = $('<span class="name" />').text(d.group + ': ');
          var value = $('<span class="value" />').text(formatLabelFunction(d.value));
          content.append(name);
          content.append(value);
          content.append('<br />');
        };

        if (_ember['default'].isArray(data.values)) {
          data.values.forEach(addValueLine);
        } else {
          addValueLine(data);
        }

        return _this4.showTooltip(content.html(), d3.event);
      };
    }),

    hideDetails: _ember['default'].computed('isInteractive', function () {
      var _this5 = this;

      if (!this.get('isInteractive')) {
        return _ember['default'].K;
      }

      return function (data, i, element) {
        d3.select(element).classed('hovered', false);
        return _this5.hideTooltip();
      };
    }),

    // ----------------------------------------------------------------------------
    // Styles
    // ----------------------------------------------------------------------------

    // Number of pixels to shift graphics away from origin line
    zeroDisplacement: 1,

    groupAttrs: _ember['default'].computed('paddedGroupWidth', function () {
      var _this6 = this;

      return {
        transform: function transform() {
          return "translate(" + -_this6.get('paddedGroupWidth') / 2 + ",0)";
        }
      };
    }),

    groupedBarAttrs: _ember['default'].computed('xTimeScale', 'xGroupScale', 'barWidth', 'yScale', 'zeroDisplacement', 'barLeftOffset', function () {

      var xTimeScale = this.get('xTimeScale');
      var xGroupScale = this.get('xGroupScale');
      var yScale = this.get('yScale');
      var zeroDisplacement = this.get('zeroDisplacement');

      return {
        'class': function _class(d, i) {
          return "grouping-" + i;
        },

        'stroke-width': 0,
        width: this.get('barWidth'),
        x: function x(d) {
          return xGroupScale(d.label) + xTimeScale(d.time);
        },

        y: function y(d) {
          return d.value > 0 ? yScale(d.value) : yScale(0) + zeroDisplacement;
        },

        height: function height(d) {
          // prevent zero-height bars from causing errors because of zeroDisplacement
          var zeroLine = Math.max(0, yScale.domain()[0]);
          return Math.max(0, Math.abs(yScale(zeroLine) - yScale(d.value)) - zeroDisplacement);
        }
      };
    }),

    line: _ember['default'].computed('xTimeScale', 'yScale', 'interpolate', function () {
      var _this7 = this;

      return d3.svg.line().x(function (d) {
        return _this7.get('xTimeScale')(d.time);
      }).y(function (d) {
        return _this7.get('yScale')(d.value);
      }).interpolate(this.get('interpolate') ? 'basis' : 'linear');
    }),

    // Line styles. Implements Craig's design spec, which ensures that out of the
    // first six lines, there are always two distinguishing styles between every
    // pair of lines.
    // 1st line: ~2px, base color, solid
    // 2nd line: ~1px, 66% tinted, solid
    // 3rd line: ~2px, base color, dotted
    // 4th line: ~1px, 66% tinted, dotted
    // 5th line: ~3px, 33% tinted, solid
    // 6th line: ~3px, 33% tinted, dotted
    lineColorFn: _ember['default'].computed(function () {
      var _this8 = this;

      return function (d, i) {
        var ii;
        switch (i) {
          case 0:
            ii = 0;
            break;
          case 1:
            ii = 2;
            break;
          case 2:
            ii = 0;
            break;
          case 3:
            ii = 2;
            break;
          case 4:
            ii = 0;
            break;
          case 5:
            ii = 1;
            break;
          default:
            ii = i;
        }
        return _this8.get('getSeriesColor')(d, ii);
      };
    }),

    lineAttrs: _ember['default'].computed('line', 'getSeriesColor', function () {
      var _this9 = this;

      return {
        'class': function _class(d, i) {
          return "line series-" + i;
        },
        d: function d(_d) {
          return _this9.get('line')(_d.values);
        },
        stroke: this.get('lineColorFn'),
        'stroke-width': function strokeWidth(d, i) {
          switch (i) {
            case 0:
              return 2;
            case 1:
              return 1.5;
            case 2:
              return 2;
            case 3:
              return 1.5;
            case 4:
              return 2.5;
            case 5:
              return 2.5;
            default:
              return 2;
          }
        },

        'stroke-dasharray': function strokeDasharray(d, i) {
          switch (i) {
            case 2:
            case 3:
            case 5:
              return '2,2';
            default:
              return '';
          }
        }
      };
    }),

    // ----------------------------------------------------------------------------
    // Color Configuration
    // ----------------------------------------------------------------------------

    numLines: _ember['default'].computed.alias('xBetweenSeriesDomain.length'),
    numBarsPerGroup: _ember['default'].computed.alias('xWithinGroupDomain.length'),

    numColorSeries: 6, // Ember.computed.alias 'numLines'
    numSecondaryColorSeries: _ember['default'].computed.alias('numBarsPerGroup'),

    // Use primary colors for bars if there are no lines

    secondaryMinimumTint: _ember['default'].computed('numLines', function () {
      return this.get('numLines') === 0 ? 0.0 : 0.4;
    }),

    secondaryMaximumTint: _ember['default'].computed('numLines', function () {
      return this.get('numLines') === 0 ? 0.8 : 0.85;
    }),

    // ----------------------------------------------------------------------------
    // Legend Configuration
    // ----------------------------------------------------------------------------

    hasLegend: _ember['default'].computed('legendItems.length', 'showLegend', function () {
      return this.get('legendItems.length') > 1 && this.get('showLegend');
    }),

    legendItems: _ember['default'].computed('xBetweenSeriesDomain', 'xWithinGroupDomain', 'getSeriesColor', 'getSecondarySeriesColor', function () {
      var _this10 = this;

      // getSeriesColor = this.get('getSeriesColor');
      // lineAttrs = this.get('lineAttrs');

      var result = this.get('xBetweenSeriesDomain').map(function (d, i) {
        // Line legend items
        var res = {
          label: d,
          stroke: _this10.get('lineAttrs')['stroke'](d, i),
          width: _this10.get('lineAttrs')['stroke-width'](d, i),
          dotted: _this10.get('lineAttrs')['stroke-dasharray'](d, i),
          icon: function icon() {
            return 'line';
          },
          selector: ".series-" + i
        };
        return res;
      }).concat(this.get('xWithinGroupDomain').map(function (d, i) {
        // Bar legend items
        var color = _this10.get('getSecondarySeriesColor')(d, i);
        var res = {
          stroke: color,
          fill: color,
          label: d,
          icon: function icon() {
            return 'square';
          },
          selector: ".grouping-" + i
        };
        return res;
      }));
      return result;
    }),

    // ----------------------------------------------------------------------------
    // Selections
    // ----------------------------------------------------------------------------

    removeAllGroups: function removeAllGroups() {
      this.get('viewport').selectAll('.bars').remove();
    },

    groups: _ember['default'].computed(function () {
      return this.get('viewport').selectAll('.bars').data(this.get('_groupedBarData'));
    }).volatile(),

    removeAllSeries: function removeAllSeries() {
      this.get('viewport').selectAll('.series').remove();
    },

    series: _ember['default'].computed(function () {
      return this.get('viewport').selectAll('.series').data(this.get('_groupedLineData'));
    }).volatile(),

    xAxis: _ember['default'].computed(function () {
      var xAxis = this.get('viewport').select('.x.axis');
      if (xAxis.empty()) {
        return this.get('viewport').insert('g', ':first-child').attr('class', 'x axis');
      } else {
        return xAxis;
      }
    }).volatile(),

    yAxis: _ember['default'].computed(function () {
      var yAxis = this.get('viewport').select('.y.axis');
      if (yAxis.empty()) {
        return this.get('viewport').insert('g', ':first-child').attr('class', 'y axis');
      } else {
        return yAxis;
      }
    }).volatile(),

    // ----------------------------------------------------------------------------
    // Drawing Functions
    // ----------------------------------------------------------------------------

    renderVars: ['barLeftOffset', 'labelledTicks', 'xGroupScale', 'xTimeScale', 'yScale', 'xValueDisplayName', 'yValueDisplayName', 'hasAxisTitles', // backward compatibility support.
    'hasXAxisTitle', 'hasYAxisTitle', 'xTitleHorizontalOffset', 'yTitleVerticalOffset', 'xAxisVertLabels', 'maxNumberOfMinorTicks', 'graphicWidth'],

    drawChart: function drawChart() {
      this.updateBarData();
      this.updateLineData();
      this.updateLineMarkers();
      this.updateAxes();
      this.updateBarGraphic();
      this.updateLineGraphic();
      this.updateAxisTitles();
      if (this.get('hasLegend')) {
        this.drawLegend();
      } else {
        this.clearLegend();
      }
    },

    updateAxes: function updateAxes() {
      var xAxis = d3.svg.axis().scale(this.get('xTimeScale')).orient('bottom').tickValues(this.get('labelledTicks')).tickFormat(this.get('formattedTime')).tickSize(6, 3);

      var graphicTop = this.get('graphicTop');
      var graphicHeight = this.get('graphicHeight');
      var gXAxis = this.get('xAxis');

      // Put our x-axis in the right place
      gXAxis.attr({
        transform: "translate(0," + graphicTop + graphicHeight + ")"
      }).call(xAxis);

      // If we have minor ticks, this will select the applicable labels and alter
      // them
      this.filterMinorTicks();

      // Do we need to turn our axis labels?
      if (this.get('xAxisVertLabels')) {
        this._rotateXAxisLabels();
      } else {
        this._straightenXAxisLabels();
      }

      //tickSize draws the Y-axis allignment line across the whole of the graph.
      var yAxis = d3.svg.axis().scale(this.get('yScale')).orient('right').ticks(this.get('numYTicks')).tickSize(this.get('graphicWidth')).tickFormat(this.get('formatValueAxis'));

      var gYAxis = this.get('yAxis');

      // find the correct size of graphicLeft in order to fit the Labels perfectly
      this.set('graphicLeft', this.maxLabelLength(gYAxis.selectAll('text')) + this.get('labelPadding'));

      var graphicLeft = this.get('graphicLeft');
      gYAxis.attr('transform', "translate(" + graphicLeft + ",0)").call(yAxis);

      // Ensure ticks other than the zeroline are minor ticks
      gYAxis.selectAll('g').filter(function (d) {
        return d;
      }).classed('major', false).classed('minor', true);

      gYAxis.selectAll('text').style('text-anchor', 'end').attr({ x: -this.get('labelPadding') });
    },

    updateBarData: function updateBarData() {
      // Always remove the previous bars, this allows us to maintain the
      // rendering order of bars behind lines
      this.removeAllGroups();

      var groups = this.get('groups');
      var showDetails = this.get('showDetails');
      var hideDetails = this.get('hideDetails');

      // Ensure bars are always inserted behind lines
      groups.enter().insert('g', '.series').attr('class', 'bars');
      groups.exit().remove();

      var bars = groups.selectAll('rect').data(function (d) {
        return d;
      });
      bars.enter().append('rect').on("mouseover", function (d, i) {
        return showDetails(d, i, this);
      }).on("mouseout", function (d, i) {
        return hideDetails(d, i, this);
      });
      bars.exit().remove();
    },

    updateBarGraphic: function updateBarGraphic() {
      var groups = this.get('groups');
      groups.attr(this.get('groupAttrs'));
      groups.selectAll('rect').style('fill', this.get('getSecondarySeriesColor')).attr(this.get('groupedBarAttrs'));
    },

    updateLineData: function updateLineData() {
      // Always remove the previous lines, this allows us to maintain the
      // rendering order of bars behind lines
      this.removeAllSeries();

      var series = this.get('series');
      series.enter().append('g').attr('class', 'series').append('path').attr('class', 'line');
      series.exit().remove();
    },

    updateLineGraphic: function updateLineGraphic() {
      var series = this.get('series');
      var graphicTop = this.get('graphicTop');
      series.attr('transform', "translate(0, " + graphicTop + ")");
      return series.select('path.line').attr(this.get('lineAttrs'));
    }
  });

  exports['default'] = TimeSeriesChartComponent;
});
define('ember-charts/components/vertical-bar-chart', ['exports', 'ember', 'ember-charts/components/chart-component', 'ember-charts/mixins/legend', 'ember-charts/mixins/floating-tooltip', 'ember-charts/mixins/axes', 'ember-charts/mixins/formattable', 'ember-charts/mixins/sortable-chart', 'ember-charts/mixins/no-margin-chart', 'ember-charts/mixins/axis-titles', 'ember-charts/utils/group-by', 'ember-charts/utils/label-trimmer'], function (exports, _ember, _emberChartsComponentsChartComponent, _emberChartsMixinsLegend, _emberChartsMixinsFloatingTooltip, _emberChartsMixinsAxes, _emberChartsMixinsFormattable, _emberChartsMixinsSortableChart, _emberChartsMixinsNoMarginChart, _emberChartsMixinsAxisTitles, _emberChartsUtilsGroupBy, _emberChartsUtilsLabelTrimmer) {
  'use strict';

  var VerticalBarChartComponent = _emberChartsComponentsChartComponent['default'].extend(_emberChartsMixinsLegend['default'], _emberChartsMixinsFloatingTooltip['default'], _emberChartsMixinsAxes['default'], _emberChartsMixinsFormattable['default'], _emberChartsMixinsSortableChart['default'], _emberChartsMixinsNoMarginChart['default'], _emberChartsMixinsAxisTitles['default'], {

    classNames: ['chart-vertical-bar'],

    // ----------------------------------------------------------------------------
    // Vertical Bar Chart Options
    // ----------------------------------------------------------------------------

    // Data without group will be merged into a group with this name
    ungroupedSeriesName: 'Other',

    // If stackBars is yes then it stacks bars, otherwise it groups them
    // horizontally. Stacking discards negative data.
    // TODO(nick): make stacked bars deal gracefully with negative data
    stackBars: false,

    // Space between bars, as fraction of bar size
    withinGroupPadding: 0,

    // Space between bar groups, as fraction of group size
    betweenGroupPadding: _ember['default'].computed('numBars', function () {
      // Use padding to make sure bars have a maximum thickness.
      //
      // TODO(tony): Use exact padding + bar width calculation
      // We have some set amount of bewtween group padding we use depending
      // on the number of bars there are in the chart. Really, what we would want
      // to do is have the equation for bar width based on padding and use that
      // to set the padding exactly.
      var scale = d3.scale.linear().domain([1, 8]).range([1.25, 0.25]).clamp(true);
      return scale(this.get('numBars'));
    }),

    numBars: _ember['default'].computed('xBetweenGroupDomain', 'xWithinGroupDomain', function () {
      return this.get('xBetweenGroupDomain.length') * this.get('xWithinGroupDomain.length') || 0;
    }),

    // Space allocated for rotated labels on the bottom of the chart. If labels
    // are rotated, they will be extended beyond labelHeight up to maxLabelHeight
    maxLabelHeight: 50,

    // ----------------------------------------------------------------------------
    // Data
    // ----------------------------------------------------------------------------

    sortedData: _ember['default'].computed('data.[]', 'sortKey', 'sortAscending', 'stackBars', function () {
      var data, group, groupData, groupObj, groupedData, key, newData, sortAscending, sortedGroups, summedGroupValues, _i, _len;
      if (this.get('stackBars')) {
        data = this.get('data');
        groupedData = _.groupBy(data, function (d) {
          return d.group;
        });
        summedGroupValues = _ember['default'].A();

        var reduceByValue = function reduceByValue(previousValue, dataObject) {
          return previousValue + dataObject.value;
        };

        for (group in groupedData) {
          groupData = groupedData[group];
          if (group !== null) {
            summedGroupValues.pushObject({
              group: group,
              value: groupData.reduce(reduceByValue, 0)
            });
          }
        }
        key = this.get('sortKey');
        sortAscending = this.get('sortAscending');
        if (_ember['default'].isEmpty(summedGroupValues)) {
          return _ember['default'].A();
        } else if (key != null) {
          sortedGroups = summedGroupValues.sortBy(key);
          if (!sortAscending) {
            sortedGroups = sortedGroups.reverse();
          }
          newData = _ember['default'].A();
          for (_i = 0, _len = sortedGroups.length; _i < _len; _i++) {
            groupObj = sortedGroups[_i];
            newData.pushObjects(groupedData[groupObj.group]);
          }
          return newData;
        } else {
          return data;
        }
      } else {
        return this._super();
      }
    }),

    // Aggregates objects provided in `data` in a dictionary, keyed by group names
    groupedData: _ember['default'].computed('sortedData', 'stackBars', 'ungroupedSeriesName', function () {
      var _this = this;

      var data = this.get('sortedData');
      if (_ember['default'].isEmpty(data)) {
        // TODO(embooglement): this can't be `Ember.A()` because it needs to be an
        // actual empty array for tests to pass, and `Ember.NativeArray` adds
        // a bunch of stuff to the prototype that gets enumerated by `_.values`
        // in `individualBarLabels`
        return [];
      }
      data = (0, _emberChartsUtilsGroupBy.groupBy)(data, function (d) {
        return d.group || _this.get('ungroupedSeriesName');
      });

      // After grouping, the data points may be out of order, and therefore not properly
      // matched with their value and color. Here, we resort to ensure proper order.
      // This could potentially be addressed with a refactor where sorting happens after
      // grouping across the board.
      // TODO(ember-charts-lodash): Use _.mapValues instead of the each loop.
      _.each(_.keys(data), function (groupName) {
        data[groupName] = _.sortBy(data[groupName], 'label');
      });

      return data;
    }),

    groupNames: _ember['default'].computed('groupedData', function () {
      return _.keys(this.get('groupedData'));
    }),

    // We know the data is grouped because it has more than one label. If there
    // are no labels on the data then every data object will have
    // 'ungroupedSeriesName' as its group name and the number of group
    // labels will be 1. If we are passed ungrouped data we will display
    // each data object in its own group.
    isGrouped: _ember['default'].computed('groupNames.length', function () {
      var result = this.get('groupNames.length') > 1;
      return result;
    }),

    finishedData: _ember['default'].computed('groupedData', 'isGrouped', 'stackBars', 'sortedData', function () {
      var y0, stackedValues;
      if (this.get('isGrouped')) {
        if (_ember['default'].isEmpty(this.get('groupedData'))) {
          return _ember['default'].A();
        }

        return _.map(this.get('groupedData'), function (values, groupName) {
          y0 = 0;
          stackedValues = _.map(values, function (d) {
            return {
              y0: y0,
              y1: y0 += Math.max(d.value, 0),
              value: d.value,
              group: d.group,
              label: d.label,
              color: d.color
            };
          });

          return {
            group: groupName,
            values: values,
            stackedValues: stackedValues,
            totalValue: y0
          };
        });
      } else if (this.get('stackBars')) {
        if (_ember['default'].isEmpty(this.get('data'))) {
          return _ember['default'].A();
        }
        // If we do not have grouped data and are drawing stacked bars, keep the
        // data in one group so it gets stacked
        y0 = 0;
        stackedValues = _.map(this.get('data'), function (d) {
          return {
            y0: y0,
            y1: y0 += Math.max(d.value, 0),
            value: d.value,
            group: d.group,
            label: d.label,
            color: d.color
          };
        });

        return _ember['default'].A([{
          group: this.get('data.firstObject.group'),
          values: this.get('data'),
          stackedValues: stackedValues,
          totalValue: y0
        }]);
      } else {

        if (_ember['default'].isEmpty(this.get('data'))) {
          return _ember['default'].A();
        }
        // If we do NOT have grouped data and do not have stackBars turned on, split the
        // data up so it gets drawn in separate groups and labeled
        return _.map(this.get('sortedData'), function (d) {
          return {
            group: d.label,
            values: [d]
          };
        });
      }
      // TODO(tony): Need to have stacked bars as a dependency here and the
      // calculation be outside of this
    }),

    // ----------------------------------------------------------------------------
    // Layout
    // ----------------------------------------------------------------------------

    labelHeightOffset: _ember['default'].computed('_shouldRotateLabels', 'maxLabelHeight', 'labelHeight', 'labelPadding', function () {

      var labelSize = this.get('_shouldRotateLabels') ? this.get('maxLabelHeight') : this.get('labelHeight');
      return labelSize + this.get('labelPadding');
    }),

    // Chart Graphic Dimensions
    graphicLeft: _ember['default'].computed.alias('labelWidthOffset'),

    graphicWidth: _ember['default'].computed('width', 'labelWidthOffset', function () {
      return this.get('width') - this.get('labelWidthOffset');
    }),

    graphicHeight: _ember['default'].computed('height', 'legendHeight', 'legendChartPadding', function () {
      return this.get('height') - this.get('legendHeight') - this.get('legendChartPadding');
    }),

    // ----------------------------------------------------------------------------
    // Ticks and Scales
    // ----------------------------------------------------------------------------

    // Vertical position/length of each bar and its value
    yDomain: _ember['default'].computed('finishedData', 'stackBars', function () {
      var finishedData = this.get('finishedData');
      var minOfGroups = d3.min(finishedData, function (d) {
        return _.min(d.values.map(function (dd) {
          return dd.value;
        }));
      });

      var maxOfGroups = d3.max(finishedData, function (d) {
        return _.max(d.values.map(function (dd) {
          return dd.value;
        }));
      });

      var maxOfStacks = d3.max(finishedData, function (d) {
        return d.totalValue;
      });

      // minOfStacks is always zero since we do not compute negative stacks
      // TODO(nick): make stacked bars deal gracefully with negative data
      var minOfStacks = d3.min(finishedData, function () {
        return 0;
      });

      var min, max;
      if (this.get('stackBars')) {
        min = minOfStacks;
        max = maxOfStacks;
      } else {
        min = minOfGroups;
        max = maxOfGroups;
      }

      // force one end of the range to include zero
      if (min > 0) {
        return [0, max];
      }
      if (max < 0) {
        return [min, 0];
      }
      if (min === 0 && max === 0) {
        return [0, 1];
      } else {
        return [min, max];
      }
    }),

    yScale: _ember['default'].computed('graphicTop', 'graphicHeight', 'yDomain', 'numYTicks', function () {
      return d3.scale.linear().domain(this.get('yDomain')).range([this.get('graphicTop') + this.get('graphicHeight'), this.get('graphicTop')]).nice(this.get('numYTicks'));
    }),

    groupedIndividualBarLabels: _ember['default'].computed('groupedData.[]', function () {
      var groups = _.map(_.values(this.get('groupedData')), function (g) {
        return _.pluck(g, 'label');
      });
      return _.uniq(_.flatten(groups));
    }),

    ungroupedIndividualBarLabels: _ember['default'].computed('sortedData.@each.label', function () {
      return _.map(this.get('sortedData'), 'label');
    }),

    // The labels of the bars in the chart.
    //
    // When the bars in the chart are grouped, this CP returns the de-duplicated
    // set of labels that can appear within a single group,
    // in the order that they should appear in the group.
    // Per this.groupedData, this order is lexicographical by the label name,
    // regardless of this.sortKey. That is to ensure that the bar for
    // a given label is always in the same position within every group.
    // (See: https://github.com/Addepar/ember-charts/pull/81 )
    //
    // When the chart is not grouped, the labels are in the order that they
    // appear in the sorted bar data points, and are not de-duplicated.
    // (This is okay because whether or not the chart is grouped,
    // the client has the responsibility to make sure there are no dupe
    // (bar label, group label) pairs in the bar data.)
    //
    individualBarLabels: _ember['default'].computed('isGrouped', 'stackBars', 'groupedIndividualBarLabels', 'ungroupedIndividualBarLabels', function () {
      if (this.get('isGrouped') || this.get('stackBars')) {
        return this.get('groupedIndividualBarLabels');
      } else {
        return this.get('ungroupedIndividualBarLabels');
      }
    }),

    labelIDMapping: _ember['default'].computed('individualBarLabels.[]', function () {
      return this.get('individualBarLabels').reduce(function (previousValue, label, index) {
        previousValue[label] = index;
        return previousValue;
      }, {});
    }),

    // The range of labels assigned to each group
    xBetweenGroupDomain: _ember['default'].computed.alias('groupNames'),
    // xBetweenGroupDomain: [],

    // The range of labels assigned within each group
    xWithinGroupDomain: _ember['default'].computed.alias('individualBarLabels'),

    // The space in pixels allocated to each group
    groupWidth: _ember['default'].computed('xBetweenGroupScale', function () {
      return this.get('xBetweenGroupScale').rangeBand();
    }),

    // The space in pixels allocated to each bar
    barWidth: _ember['default'].computed('xWithinGroupScale', function () {
      return this.get('xWithinGroupScale').rangeBand();
    }),

    // The scale used to position bars within each group
    // If we do not have grouped data, use the withinGroupPadding around group
    // data since we will have constructed groups for each bar.
    xWithinGroupScale: _ember['default'].computed('isGrouped', 'stackBars', 'xWithinGroupDomain', 'groupWidth', 'withinGroupPadding', 'betweenGroupPadding', function () {

      if (this.get('isGrouped') || this.get('stackBars')) {
        return d3.scale.ordinal().domain(this.get('xWithinGroupDomain')).rangeRoundBands([0, this.get('groupWidth')], this.get('withinGroupPadding') / 2, 0);
      } else {
        return d3.scale.ordinal().domain(this.get('xWithinGroupDomain')).rangeRoundBands([0, this.get('groupWidth')], this.get('betweenGroupPadding') / 2, this.get('betweenGroupPadding') / 2);
      }
    }),

    // The scale used to position each group and label across the horizontal axis
    // If we do not have grouped data, do not add additional padding around groups
    // since this will only add whitespace to the left/right of the graph.
    xBetweenGroupScale: _ember['default'].computed('isGrouped', 'stackBars', 'graphicWidth', 'labelWidth', 'xBetweenGroupDomain', 'betweenGroupPadding', function () {

      // var labelWidth = this.get('labelWidth');
      var betweenGroupPadding;

      if (this.get('isGrouped') || this.get('stackBars')) {
        betweenGroupPadding = this.get('betweenGroupPadding');
      } else {
        betweenGroupPadding = 0;
      }

      return d3.scale.ordinal().domain(this.get('xBetweenGroupDomain')).rangeRoundBands([0, this.get('graphicWidth')], betweenGroupPadding / 2, betweenGroupPadding / 2);
    }),

    // Override axis mix-in min and max values to listen to the scale's domain
    minAxisValue: _ember['default'].computed('yScale', function () {
      var yScale = this.get('yScale');
      return yScale.domain()[0];
    }),

    maxAxisValue: _ember['default'].computed('yScale', function () {
      var yScale = this.get('yScale');
      return yScale.domain()[1];
    }),

    // ----------------------------------------------------------------------------
    // Color Configuration
    //
    // We cannot pass the mixed-in method this.getSeriesColor() directly to d3
    // as the callback to use to color the bars.
    // This is because for bar groups that do not have a meaningful
    // non-zero value for an individual bar, the client is free to not pass
    // a data point for that pair of (group, label) at all.
    //
    // In that case, when we use d3 to render bar groups with omitted bars,
    // using this.getSeriesColor() would tell d3 to use a color palette
    // with _more_ colors than bars in the bar group (since the number of colors
    // in the palette is this.numColorSeries).
    // Hence some bars would likely get a color that doesn't match the color
    // used for bars with the same label in other bar groups.
    //
    // So instead, we provide our own callback this.fnGetBarColor()
    // that looks at the bar label first and tries to look up the color
    // based on that. If that fails, then fnGetBarColor() defers to getSeriesColor().
    //
    // Note that we still use getSeriesColors() to initialize the mapping
    // from bar label to bar color, so it would be confusing if we tried to
    // override the property altogether.
    //
    // See bug #172 : https://github.com/Addepar/ember-charts/issues/172
    // ----------------------------------------------------------------------------

    numColorSeries: _ember['default'].computed.alias('individualBarLabels.length'),

    barColors: _ember['default'].computed('individualBarLabels.[]', 'getSeriesColor', function () {
      var fnGetSeriesColor = this.get('getSeriesColor');
      var result = {};
      this.get('individualBarLabels').forEach(function (label, labelIndex) {
        result[label] = fnGetSeriesColor(label, labelIndex);
      });
      return result;
    }),

    fnGetBarColor: _ember['default'].computed('barColors', function () {
      var barColors = this.get('barColors');
      return function (d) {
        if (!_ember['default'].isNone(d.color)) {
          return d.color;
        } else if (!_ember['default'].isNone(d.label)) {
          return barColors[d.label];
        } else {
          return barColors[d];
        }
      };
    }),

    // ----------------------------------------------------------------------------
    // Legend Configuration
    // ----------------------------------------------------------------------------

    hasLegend: _ember['default'].computed('stackBars', 'isGrouped', 'legendItems.length', 'showLegend', function () {
      return this.get('stackBars') || this.get('isGrouped') && this.get('legendItems.length') > 1 && this.get('showLegend');
    }),

    legendItems: _ember['default'].computed('individualBarLabels.[]', 'barColors', 'stackBars', 'labelIDMapping.[]', function () {
      var _this2 = this;

      var barColors = this.get('barColors');
      return this.get('individualBarLabels').map(function (label, i) {
        var color = barColors[label];
        if (_this2.get('stackBars')) {
          i = _this2.get('labelIDMapping')[label];
        }
        return {
          label: label,
          fill: color,
          stroke: color,
          icon: function icon() {
            return 'square';
          },
          selector: ".grouping-" + i
        };
      });
    }),

    // ----------------------------------------------------------------------------
    // Tooltip Configuration
    // ----------------------------------------------------------------------------

    showDetails: _ember['default'].computed('isInteractive', function () {
      var _this3 = this;

      if (!this.get('isInteractive')) {
        return _ember['default'].K;
      }

      return function (data, i, element) {
        // Specify whether we are on an individual bar or group
        var isGroup = _ember['default'].isArray(data.values);

        // Do hover detail style stuff here
        element = isGroup ? element.parentNode.parentNode : element;
        d3.select(element).classed('hovered', true);

        // Show tooltip
        var tipLabel = data.group ? $("<span class=\"tip-label\" />").text(data.group) : '';
        var content = $("<span />").append(tipLabel);

        var formatLabel = _this3.get('formatLabelFunction');
        var addValueLine = function addValueLine(d) {
          var label = $("<span class=\"name\" />").text(d.label + ": ");
          content.append(label);
          var value = $("<span class=\"value\">").text(formatLabel(d.value));
          content.append(value);
          content.append('<br />');
        };

        if (isGroup) {
          // Display all bar details if hovering over axis group label
          data.values.forEach(addValueLine);
        } else {
          // Just hovering over single bar
          addValueLine(data);
        }
        return _this3.showTooltip(content.html(), d3.event);
      };
    }),

    hideDetails: _ember['default'].computed('isInteractive', function () {
      var _this4 = this;

      if (!this.get('isInteractive')) {
        return _ember['default'].K;
      }

      return function (data, i, element) {
        // if we exited the group label undo for the group
        if (_ember['default'].isArray(data.values)) {
          element = element.parentNode.parentNode;
        }
        // Undo hover style stuff
        d3.select(element).classed('hovered', false);

        // Hide Tooltip
        return _this4.hideTooltip();
      };
    }),

    // ----------------------------------------------------------------------------
    // Styles
    // ----------------------------------------------------------------------------

    groupAttrs: _ember['default'].computed('graphicLeft', 'graphicTop', 'xBetweenGroupScale', function () {
      var _this5 = this;

      var xBetweenGroupScale = this.get('xBetweenGroupScale');

      return {
        transform: function transform(d) {
          var dx = xBetweenGroupScale(d.group) ? _this5.get('graphicLeft') + xBetweenGroupScale(d.group) : _this5.get('graphicLeft');
          var dy = _this5.get('graphicTop');

          return "translate(" + dx + ", " + dy + ")";
        }
      };
    }),

    commonBarAttrs: _ember['default'].computed('labelIDMapping.[]', function () {
      var _this6 = this;

      return {
        'class': function _class(d) {
          var id = _this6.get('labelIDMapping')[d.label];
          return "grouping-" + id;
        }
      };
    }),

    stackedBarAttrs: _ember['default'].computed('commonBarAttrs', 'yScale', 'groupWidth', function () {
      var _this7 = this;

      var zeroDisplacement = 1;
      var yScale = this.get('yScale');

      return _.assign({
        'stroke-width': 0,
        width: function width() {
          return _this7.get('groupWidth');
        },
        x: null,
        y: function y(barSection) {
          return yScale(barSection.y1) + zeroDisplacement;
        },
        height: function height(barSection) {
          return yScale(barSection.y0) - yScale(barSection.y1);
        }
      }, this.get('commonBarAttrs'));
    }),

    groupedBarAttrs: _ember['default'].computed('commonBarAttrs', 'yScale', 'barWidth', 'xWithinGroupScale', function () {
      var _this8 = this;

      var zeroDisplacement = 1;
      var yScale = this.get('yScale');

      return _.assign({
        'stroke-width': 0,
        width: function width() {
          return _this8.get('barWidth');
        },
        x: function x(d) {
          return _this8.get('xWithinGroupScale')(d.label);
        },
        height: function height(d) {
          return Math.max(0, Math.abs(yScale(d.value) - yScale(0)) - zeroDisplacement);
        },
        y: function y(d) {
          if (d.value > 0) {
            return yScale(d.value);
          } else {
            return yScale(0) + zeroDisplacement;
          }
        }
      }, this.get('commonBarAttrs'));
    }),

    labelAttrs: _ember['default'].computed('barWidth', 'isGrouped', 'stackBars', 'groupWidth', 'xWithinGroupScale', 'graphicTop', 'graphicHeight', 'labelPadding', function () {
      var _this9 = this;

      return {
        'stroke-width': 0,
        transform: function transform(d) {
          var dx = _this9.get('barWidth') / 2;
          if (_this9.get('isGrouped') || _this9.get('stackBars')) {
            dx += _this9.get('groupWidth') / 2 - _this9.get('barWidth') / 2;
          } else {
            dx += _this9.get('xWithinGroupScale')(d.group);
          }
          var dy = _this9.get('graphicTop') + _this9.get('graphicHeight') + _this9.get('labelPadding');
          return "translate(" + dx + ", " + dy + ")";
        }
      };
    }),

    // ----------------------------------------------------------------------------
    // Selections
    // ----------------------------------------------------------------------------

    groups: _ember['default'].computed(function () {
      return this.get('viewport').selectAll('.bars').data(this.get('finishedData'));
    }).volatile(),

    yAxis: _ember['default'].computed(function () {
      var yAxis = this.get('viewport').select('.y.axis');
      if (yAxis.empty()) {
        return this.get('viewport').insert('g', ':first-child').attr('class', 'y axis');
      } else {
        return yAxis;
      }
    }).volatile(),

    // ----------------------------------------------------------------------------
    // Label Layout
    // ----------------------------------------------------------------------------

    // Space available for labels that are horizontally displayed. This is either
    // the unpadded group width or bar width depending on whether data is grouped
    maxLabelWidth: _ember['default'].computed('isGrouped', 'stackBars', 'groupWidth', 'barWidth', function () {
      if (this.get('isGrouped') || this.get('stackBars')) {
        return this.get('groupWidth');
      } else {
        return this.get('barWidth');
      }
    }),

    _shouldRotateLabels: false,

    setRotateLabels: function setRotateLabels() {
      var labels, maxLabelWidth, rotateLabels;
      labels = this.get('groups').select('.groupLabel text');
      maxLabelWidth = this.get('maxLabelWidth');
      rotateLabels = false;
      if (this.get('rotatedLabelLength') > maxLabelWidth) {
        labels.each(function () {
          if (this.getBBox().width > maxLabelWidth) {
            return rotateLabels = true;
          }
        });
      }
      return this.set('_shouldRotateLabels', rotateLabels);
    },

    // Calculate the number of degrees to rotate labels based on how widely labels
    // will be spaced, but never rotate the labels less than 20 degrees
    rotateLabelDegrees: _ember['default'].computed('labelHeight', 'maxLabelWidth', function () {
      var radians = Math.atan(this.get('labelHeight') / this.get('maxLabelWidth'));
      var degrees = radians * 180 / Math.PI;
      return Math.max(degrees, 20);
    }),

    rotatedLabelLength: _ember['default'].computed('maxLabelHeight', 'rotateLabelDegrees', function () {
      var rotateLabelRadians = Math.PI / 180 * this.get('rotateLabelDegrees');
      return Math.abs(this.get('maxLabelHeight') / Math.sin(rotateLabelRadians));
    }),

    // ----------------------------------------------------------------------------
    // Drawing Functions
    // ----------------------------------------------------------------------------

    renderVars: ['xWithinGroupScale', 'xBetweenGroupScale', 'yScale', 'finishedData', 'getSeriesColor', 'xValueDisplayName', 'yValueDisplayName', 'hasAxisTitles', // backward compatibility support.
    'hasXAxisTitle', 'hasYAxisTitle', 'xTitleHorizontalOffset', 'yTitleVerticalOffset'],

    drawChart: function drawChart() {
      this.updateData();
      this.updateLayout();
      this.updateAxes();
      this.updateGraphic();
      this.updateAxisTitles();
      if (this.get('hasLegend')) {
        return this.drawLegend();
      } else {
        return this.clearLegend();
      }
    },

    updateData: function updateData() {
      var groups = this.get('groups');
      var showDetails = this.get('showDetails');
      var hideDetails = this.get('hideDetails');

      var entering = groups.enter().append('g').attr('class', 'bars');
      entering.append('g').attr('class', 'groupLabel').append('text').on("mouseover", function (d, i) {
        return showDetails(d, i, this);
      }).on("mouseout", function (d, i) {
        return hideDetails(d, i, this);
      });
      groups.exit().remove();

      var subdata;
      if (this.get('stackBars')) {
        subdata = function (d) {
          return d.stackedValues;
        };
      } else {
        subdata = function (d) {
          return d.values;
        };
      }

      var bars = groups.selectAll('rect').data(subdata);
      bars.enter().append('rect').on("mouseover", function (d, i) {
        return showDetails(d, i, this);
      }).on("mouseout", function (d, i) {
        return hideDetails(d, i, this);
      });
      return bars.exit().remove();
    },

    updateLayout: function updateLayout() {
      var _this10 = this;

      var groups = this.get('groups');
      var labels = groups.select('.groupLabel text').attr('transform', null) // remove any previous rotation attrs
      .text(function (d) {
        return d.group;
      });

      // If there is enough space horizontally, center labels underneath each
      // group. Otherwise, rotate each label and anchor it at the top of its
      // first character.
      this.setRotateLabels();
      var labelTrimmer;

      if (this.get('_shouldRotateLabels')) {
        var rotateLabelDegrees = this.get('rotateLabelDegrees');
        labelTrimmer = _emberChartsUtilsLabelTrimmer['default'].create({
          getLabelSize: function getLabelSize() {
            return _this10.get('rotatedLabelLength');
          },
          getLabelText: function getLabelText(d) {
            return d.group;
          }
        });

        return labels.call(labelTrimmer.get('trim')).attr({
          'text-anchor': 'end',
          transform: "rotate(" + -rotateLabelDegrees + ")",
          dy: function dy() {
            return this.getBBox().height;
          }
        });
      } else {
        var maxLabelWidth = this.get('maxLabelWidth');
        labelTrimmer = _emberChartsUtilsLabelTrimmer['default'].create({
          getLabelSize: function getLabelSize() {
            return maxLabelWidth;
          },
          getLabelText: function getLabelText(d) {
            return d.group != null ? d.group : '';
          }
        });

        return labels.call(labelTrimmer.get('trim')).attr({
          'text-anchor': 'middle',
          dy: this.get('labelPadding')
        });
      }
    },

    updateAxes: function updateAxes() {
      //tickSize isn't doing anything here, it should take two arguments
      var yAxis = d3.svg.axis().scale(this.get('yScale')).orient('right').ticks(this.get('numYTicks')).tickSize(this.get('graphicWidth')).tickFormat(this.get('formatValueAxis'));

      var gYAxis = this.get('yAxis');

      // find the correct size of graphicLeft in order to fit the Labels perfectly
      this.set('graphicLeft', this.maxLabelLength(gYAxis.selectAll('text')) + this.get('labelPadding'));

      var graphicTop = this.get('graphicTop');
      var graphicLeft = this.get('graphicLeft');
      gYAxis.attr({ transform: "translate(" + graphicLeft + ", " + graphicTop + ")" }).call(yAxis);

      gYAxis.selectAll('g').filter(function (d) {
        return d !== 0;
      }).classed('major', false).classed('minor', true);

      gYAxis.selectAll('text').style('text-anchor', 'end').attr({
        x: -this.get('labelPadding')
      });
    },

    updateGraphic: function updateGraphic() {
      var groups = this.get('groups');

      var barAttrs = this.get('stackBars') ? this.get('stackedBarAttrs') : this.get('groupedBarAttrs');

      groups.attr(this.get('groupAttrs'));
      groups.selectAll('rect').attr(barAttrs).style('fill', this.get('fnGetBarColor'));
      return groups.select('g.groupLabel').attr(this.get('labelAttrs'));
    }
  });

  exports['default'] = VerticalBarChartComponent;
});
define('ember-charts/mixins/axes', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  exports['default'] = _ember['default'].Mixin.create({

    // # ------------------------------------------------------------------------
    // # API -- Inputs
    // #
    // # graphicWidth (req.): The width of the graphic to be given axes
    // # graphicHeight (req.): The width of the graphic to be given axes
    // # minXTicks: The minimum number of ticks to appear on the X axis
    // # minYTicks: The minimum number of ticks to appear on the Y axis
    // # tickSpacing: Number of pixels between ticks on axes
    // # minAxisValue: The minimum value appearing on an axis using numeric values
    // # maxAxisValue: The maximum value appearing on an axis using numeric values
    // # ------------------------------------------------------------------------
    graphicWidth: null,
    graphicHeight: null,
    minXTicks: 3,
    minYTicks: 3,
    minAxisValue: 0,
    maxAxisValue: 0,

    /**
     * We used to have only one option to set tick spacing for both x and y axes.
     * We keep this attribute for backward compatibility.
     * @type {number}
     * @deprecated This will be deprecated in version 1.0.
     */
    tickSpacing: 50,

    /**
     * Tick spacing on X axis. Set this value if we want a different tickSpacing
     * for X axis other than the default one set in tickSpacing for both axes
     * @type {number}
     */
    tickSpacingX: null,

    /**
     * Tick spacing on Y axis. Set this value if we want a different tickSpacing
     * for Y axis other than the default one set in tickSpacing for both axes
     * @type {number}
     */
    tickSpacingY: null,

    /**
     * This will be used for all internal calculation of tick spacing on X axis.
     * We set higher priority if the specific tickSpacingX's value is set.
     * @type {number}
     * @private
     */
    _innerTickSpacingX: _ember['default'].computed('tickSpacingX', 'tickSpacing', function () {
      var tickSpacingX = this.get('tickSpacingX');
      if (_ember['default'].isNone(tickSpacingX)) {
        return this.get('tickSpacing');
      }
      return tickSpacingX;
    }),

    /**
     * This will be used for all internal calculation of tick spacing on Y axis.
     * We set higher priority if the specific tickSpacingY's value is set.
     * @type {number}
     * @private
     */
    _innerTickSpacingY: _ember['default'].computed('tickSpacingY', 'tickSpacing', function () {
      var tickSpacingY = this.get('tickSpacingY');
      if (_ember['default'].isNone(tickSpacingY)) {
        return this.get('tickSpacing');
      }
      return tickSpacingY;
    }),

    // # ------------------------------------------------------------------------
    // # API -- Outputs
    // #
    // # numXTicks: Number of ticks on the X axis
    // # numYTicks: Number of ticks on the Y axis
    // # formatValueAxis: Overridable formatter for numeric values along an axis
    // # ------------------------------------------------------------------------
    numXTicks: _ember['default'].computed('graphicWidth', '_innerTickSpacingX', 'minXTicks', function () {
      var tickSpacing = this.get('_innerTickSpacingX');
      var numOfTicks = Math.floor(this.get('graphicWidth') / tickSpacing);
      return Math.max(numOfTicks, this.get('minXTicks'));
    }),

    numYTicks: _ember['default'].computed('graphicHeight', '_innerTickSpacingY', 'minYTicks', function () {
      var tickSpacing = this.get('_innerTickSpacingY');
      var numOfTicks = Math.floor(this.get('graphicHeight') / tickSpacing);
      return Math.max(numOfTicks, this.get('minYTicks'));
    }),

    formatValueAxis: _ember['default'].computed('minAxisValue', 'maxAxisValue', function () {
      // # Base the format prefix on largest magnitude (e.g. if we cross from
      // # hundreds of thousands into millions, use millions)
      var absMinAxisValue = Math.abs(this.get('minAxisValue'));
      var absMaxAxisValue = Math.abs(this.get('maxAxisValue'));
      var magnitude = Math.max(absMinAxisValue, absMaxAxisValue);
      var prefix = d3.formatPrefix(magnitude);
      return function (value) {
        return "" + prefix.scale(value) + prefix.symbol;
      };
    })
  });
});
define('ember-charts/mixins/axis-titles', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  /**
   * Adds axis titles to a chart and sets left/bottom margins to allow space
   * for the axis titles
   * Axis titles are set through the `xValueDisplayName` and `yValueDisplayName`
   * Spacing on the left is managed through the `horizontalMarginLeft`
   * Spacing on the bottom is managed through `axisTitleHeight` and `labelPadding`
   *
   * @mixin
   */
  var AxisTitlesMixin = _ember['default'].Mixin.create({
    /**
     * Toggle axis X title on/off
     * @type {Boolean}
     */
    hasXAxisTitle: false,

    /**
     * Toggle axis Y title on/off
     * @type {Boolean}
     */
    hasYAxisTitle: false,

    /**
     * A deprecated property to support backward compatability.
     * TODO: Add ember deprecated helper function for this property.
     * @deprecated
     */
    hasAxisTitles: _ember['default'].computed('hasXAxisTitle', 'hasYAxisTitle', function (key, value) {
      if (arguments.length > 1) {
        // Setter case.
        this.set('hasXAxisTitle', value);
        this.set('hasYAxisTitle', value);
      }

      return this.get('hasXAxisTitle') || this.get('hasYAxisTitle');
    }),

    /**
     * Title for the x axis
     * @type {String}
     */
    xValueDisplayName: null,

    /**
     * Title for the y axis
     * @type {String}
     */
    yValueDisplayName: null,

    /**
     * A variable to allow user to config the amount of horizontal offset for x
     * axis title.
     * @type {Number}
     */
    xTitleHorizontalOffset: _ember['default'].computed('width', 'graphicWidth', function () {
      return -(this.get('width') - this.get('graphicWidth')) / 2;
    }),

    /**
     * A variable to allow user to config the amount of veritcal offset for x
     * axis title.
     * @type {Number}
     */
    xTitleVerticalOffset: 10,

    /**
     * A variable to allow user to config the amount of offset for y axis title.
     * @type {Number}
     */
    yTitleVerticalOffset: 0,

    /**
     * Computed title for the x axis, if the `hasXAxisTitle` boolean is false
     * `xAxisTitleDisplayValue` should be an empty string
     * @type {String}
     */
    xAxisTitleDisplayValue: _ember['default'].computed('hasXAxisTitle', 'xValueDisplayName', function () {
      return this.get('hasXAxisTitle') ? this.get('xValueDisplayName') : '';
    }),

    /**
     * Computed title for the x axis, if the `hasYAxisTitle` boolean is false
     * `yAxisTitleDisplayValue` should be an empty string
     * @type {String}
     */
    yAxisTitleDisplayValue: _ember['default'].computed('hasYAxisTitle', 'yValueDisplayName', function () {
      return this.get('hasYAxisTitle') ? this.get('yValueDisplayName') : '';
    }),

    /**
     * Default left margin, allows for enough space for the y axis label
     * @type {Number}
     */
    horizontalMarginLeft: 20,

    // Height of the text for the axis titles
    axisTitleHeight: 10,

    /**
     * If `hasYAxisTitle` is false there should be no margin on the left side,
     * while if true the left margin should be the value of `horizontalMarginLeft`
     * @type {Number}
     */
    marginLeft: _ember['default'].computed('hasYAxisTitle', 'horizontalMarginLeft', function () {
      return this.get('hasYAxisTitle') ? this.get('horizontalMarginLeft') : 0;
    }),

    // TODO(tony): Just use axisBottomOffset here
    legendChartPadding: _ember['default'].computed('labelHeightOffset', 'xAxisTitleHeightOffset', function () {
      return this.get('xAxisTitleHeightOffset') + this.get('labelHeightOffset');
    }),

    /**
     * Computed title height plus label padding or 0 if `hasXAxisTitle` is false
     * @type {Number}
     */
    xAxisTitleHeightOffset: _ember['default'].computed('hasXAxisTitle', 'axisTitleHeight', 'labelPadding', function () {
      if (this.get('hasXAxisTitle')) {
        return this.get('axisTitleHeight') + this.get('labelPadding');
      } else {
        return 0;
      }
    }),

    /**
     * The horizontal offset of the Y axis title, if there is a Y axis title
     * Computed based on the height of the axis title, plus 10 pixels of extra
     * margin
     * @type {Number}
     */
    yAxisTitleHeightOffset: _ember['default'].computed('hasYAxisTitle', 'axisTitleHeight', function () {
      if (this.get('hasYAxisTitle')) {
        return this.get('axisTitleHeight') + 10;
      } else {
        return 0;
      }
    }),

    /**
     * References and/or creates the d3 element for x axis title
     * @type {Object}
     */
    xAxisTitle: _ember['default'].computed(function () {
      return this.selectOrCreateAxisTitle('.x.axis-title').attr('class', 'x axis-title');
    }).volatile(),

    /**
     * References and/or creates the d3 element for y axis title
     * @type {Object}
     */
    yAxisTitle: _ember['default'].computed(function () {
      return this.selectOrCreateAxisTitle('.y.axis-title').attr('class', 'y axis-title');
    }).volatile(),

    /**
     * Position of x axis title on the x axis
     * @type {Number}
     */
    xAxisPositionX: _ember['default'].computed('graphicWidth', 'labelWidthOffset', 'xTitleHorizontalOffset', function () {
      var position = this.get('graphicWidth') / 2 + this.get('labelWidthOffset');
      if (!_ember['default'].isNone(this.get('xTitleHorizontalOffset'))) {
        position += this.get('xTitleHorizontalOffset');
      }
      return position;
    }),

    /**
     * Position of x axis title on the y axis. The y-coordinate of x Axis Title
     * depends on the y-coordinate of the bottom of the graph, label height &
     * padding and optional title offset. Caller can set `xTitleVerticalOffset`
     * to adjust the y-coordinate of the label on the graph.
     * @type {Number}
     */
    xAxisPositionY: _ember['default'].computed('graphicBottom', 'labelHeightOffset', 'labelPadding', 'xTitleVerticalOffset', function () {
      return this.get('graphicBottom') + this.get('labelHeightOffset') + this.get('labelPadding') + this.get('xTitleVerticalOffset');
    }),

    /**
     * Position of y axis title on the x axis
     * @type {Number}
     */
    yAxisPositionX: _ember['default'].computed('graphicHeight', 'yTitleVerticalOffset', function () {
      var position = -(this.get('graphicHeight') / 2);
      if (!_ember['default'].isNone(this.get('yTitleVerticalOffset'))) {
        position += this.get('yTitleVerticalOffset');
      }
      return position;
    }),

    /**
     * Position of y axis title on the y axis
     * @type {Number}
     */
    yAxisPositionY: -20,

    /**
     * X axis transform
     * @type {string}
     */
    xAxisTransform: "rotate(0)",
    /**
     * Y axis transform
     * @type {string}
     */
    yAxisTransform: "rotate(-90)",

    /**
     * If no axis title has been created for the selector create a new one
     * @param  {String} selector
     * @return {Object}
     */
    selectOrCreateAxisTitle: function selectOrCreateAxisTitle(selector) {
      var title = this.get('viewport').select(selector);
      if (title.empty()) {
        return this.get('viewport').append('text');
      } else {
        return title;
      }
    },

    /**
     * Update the x axis title and position
     */
    updateXAxisTitle: function updateXAxisTitle() {
      this.get('xAxisTitle').text(this.get('xAxisTitleDisplayValue')).style('text-anchor', 'middle').attr({
        x: this.get('xAxisPositionX'),
        y: this.get('xAxisPositionY')
      });
    },

    /**
     * Update the y axis title and position
     */
    updateYAxisTitle: function updateYAxisTitle() {
      this.get('yAxisTitle').text(this.get('yAxisTitleDisplayValue')).style('text-anchor', 'middle').attr({
        x: this.get('yAxisPositionX'),
        y: this.get('yAxisPositionY')
      }).attr("transform", this.get('yAxisTransform')).attr("dy", "1em");
    },

    /**
     * Updates axis titles
     */
    updateAxisTitles: function updateAxisTitles() {
      this.updateXAxisTitle();
      this.updateYAxisTitle();
    }

  });

  exports['default'] = AxisTitlesMixin;
});
define('ember-charts/mixins/colorable', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  exports['default'] = _ember['default'].Mixin.create({

    selectedSeedColor: 'rgb(65, 65, 65)',

    // Create two color ranges. The primary range is usually used for the main
    // graphic. The secondary range is lighter and used for layered graphics
    // underneath the main graphic.

    // Tint is the amount of white to mix the seed color with. 0.8 means 80% white
    tint: 0.8,
    minimumTint: 0,
    maximumTint: 0.66,
    colorScaleType: d3.scale.linear,

    // colorScale is the end of the color scale pipeline so we rerender on that
    renderVars: ['colorScale'],

    colorRange: _ember['default'].computed('selectedSeedColor', 'getColorRange', function () {
      var seedColor = this.get('selectedSeedColor');
      return this.get('getColorRange')(seedColor);
    }),

    getColorRange: _ember['default'].computed('minimumTint', 'maximumTint', function () {
      var _this = this;
      return function (seedColor) {
        var interpolate, maxTintRGB, minTintRGB;
        interpolate = d3.interpolateRgb(seedColor, 'rgb(255,255,255)');
        minTintRGB = interpolate(_this.get('minimumTint'));
        maxTintRGB = interpolate(_this.get('maximumTint'));
        return [d3.rgb(minTintRGB), d3.rgb(maxTintRGB)];
      };
    }),

    colorScale: _ember['default'].computed('selectedSeedColor', 'getColorScale', function () {
      var seedColor = this.get('selectedSeedColor');
      return this.get('getColorScale')(seedColor);
    }),

    getColorScale: _ember['default'].computed('getColorRange', 'colorScaleType', function () {
      var _this = this;
      return function (seedColor) {
        var colorRange = _this.get('getColorRange')(seedColor);
        return _this.get('colorScaleType')().range(colorRange);
      };
    }),

    secondaryMinimumTint: 0.4,
    secondaryMaximumTint: 0.85,
    secondaryColorScaleType: d3.scale.linear,

    secondaryColorRange: _ember['default'].computed('selectedSeedColor', 'secondaryMinimumTint', 'secondaryMaximumTint', function () {
      var seedColor = this.get('selectedSeedColor');
      var interpolate = d3.interpolateRgb(seedColor, 'rgb(255,255,255)');
      var minTintRGB = interpolate(this.get('secondaryMinimumTint'));
      var maxTintRGB = interpolate(this.get('secondaryMaximumTint'));

      return [d3.rgb(minTintRGB), d3.rgb(maxTintRGB)];
    }),

    secondaryColorScale: _ember['default'].computed('secondaryColorScaleType', 'secondaryColorRange', function () {
      return this.get('secondaryColorScaleType')().range(this.get('secondaryColorRange'));
    }),

    // ----------------------------------------------------------------------------
    // Output
    // ----------------------------------------------------------------------------

    // TODO: Shouldn't this already be part of the d3 color scale stuff?

    // Darkest color (seed color)
    leastTintedColor: _ember['default'].computed('colorRange.[]', function () {
      return this.get('colorRange')[0];
    }),

    // Lightest color (fully tinted color)
    mostTintedColor: _ember['default'].computed('colorRange.[]', function () {
      return this.get('colorRange')[1];
    }),

    numColorSeries: 1,

    getSeriesColor: _ember['default'].computed('numColorSeries', 'getColorRange', 'getColorScale', 'selectedSeedColor', function () {
      var numColorSeries = this.get('numColorSeries');
      var selectedSeedColor = this.get('selectedSeedColor');

      var _this = this;
      return function (d, i) {
        var seedColor = d.color || selectedSeedColor;
        var colorRange = _this.get('getColorRange')(seedColor);
        var colorScale = _this.get('getColorScale')(seedColor);
        if (numColorSeries === 1) {
          return colorRange[0];
        } else {
          return colorScale(i / (numColorSeries - 1));
        }
      };
    }),

    numSecondaryColorSeries: 1,

    getSecondarySeriesColor: _ember['default'].computed('numSecondaryColorSeries', 'secondaryColorRange', 'secondaryColorScale', function () {
      var numSecondaryColorSeries = this.get('numSecondaryColorSeries');

      var _this = this;
      return function (d, i) {
        if (numSecondaryColorSeries === 1) {
          return _this.get('secondaryColorRange')[0];
        } else {
          return _this.get('secondaryColorScale')(i / (numSecondaryColorSeries - 1));
        }
      };
    })
  });
});
define('ember-charts/mixins/floating-tooltip', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  exports['default'] = _ember['default'].Mixin.create({

    // # ----------------------------------------------------------------------------
    // # API -- inputs
    // #
    // # elementId: the id of the object we're attaching the tooltip to
    // # ----------------------------------------------------------------------------
    elementId: null,
    tooltipWidth: 40,
    tooltipValueDisplayName: 'Value',

    showTooltip: function showTooltip(content, event) {
      var $ttid = this._getTooltip();
      $ttid.html(content);
      $ttid.show();
      return this._updateTooltipPosition(event);
    },

    hideTooltip: function hideTooltip() {
      return this._getTooltip().hide();
    },

    // # ----------------------------------------------------------------------------
    // # Private Methods
    // # ----------------------------------------------------------------------------
    _tooltipId: _ember['default'].computed(function () {
      return this.get('elementId') + '_tooltip';
    }),

    _getTooltip: function _getTooltip() {
      return $("#" + this.get('_tooltipId'));
    },

    _updateTooltipPosition: function _updateTooltipPosition(event) {
      var $tooltip = this._getTooltip();
      // # Offset the tooltip away from the mouse position
      var xOffset = 10;
      var yOffset = 10;

      // # Get tooltip width/height
      var width = $tooltip.width();
      var height = $tooltip.height();

      // # Get top/left coordinates of scrolled window
      var windowScrollTop = $(window).scrollTop();
      var windowScrollLeft = $(window).scrollLeft();

      // # Get current X,Y position of cursor even if window is scrolled
      var curX = event.clientX + windowScrollLeft;
      var curY = event.clientY + windowScrollTop;

      var tooltipLeftOffset;
      if (curX - windowScrollLeft + xOffset * 2 + width > $(window).width()) {
        // # Not enough room to put tooltip to the right of the cursor
        tooltipLeftOffset = -(width + xOffset * 2);
      } else {
        // # Offset the tooltip to the right
        tooltipLeftOffset = xOffset;
      }

      var tooltipLeft = curX + tooltipLeftOffset;

      var tooltipTopOffset;
      if (curY - windowScrollTop + yOffset * 2 + height > $(window).height()) {
        // # Not enough room to put tooltip to the below the cursor
        tooltipTopOffset = -(height + yOffset * 2);
      } else {
        // # Offset the tooltip below the cursor
        tooltipTopOffset = yOffset;
      }

      var tooltipTop = curY + tooltipTopOffset;

      // # Tooltip must be a minimum offset away from the left/top position
      var minTooltipLeft = windowScrollLeft + xOffset;
      var minTooltipTop = windowScrollTop + yOffset;
      if (tooltipLeft < minTooltipLeft) {
        tooltipLeft = minTooltipLeft;
      }
      if (tooltipTop < windowScrollTop + yOffset) {
        tooltipTop = minTooltipTop;
      }

      // # Place tooltip
      return $tooltip.css('top', tooltipTop + 'px').css('left', tooltipLeft + 'px');
    },

    // # ----------------------------------------------------------------------------
    // # Internal
    // # ----------------------------------------------------------------------------

    didInsertElement: function didInsertElement() {
      this._super();
      $("body").append("<div class='chart-float-tooltip' id='" + this.get('_tooltipId') + "'></div>");
      return this.hideTooltip();
    },

    willDestroyElement: function willDestroyElement() {
      this._super();
      return this._getTooltip().remove();
    }
  });
});
define('ember-charts/mixins/formattable', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  exports['default'] = _ember['default'].Mixin.create({

    // # Getters for formatting human-readable labels from provided data
    formatLabelFunction: _ember['default'].computed('formatLabel', function () {
      return d3.format("," + this.get('formatLabel'));
    }),

    // # String that will be used to format label using d3.format function
    // # More info about d3.format: https://github.com/mbostock/d3/wiki/Formatting
    formatLabel: '.2f'
  });
});
define('ember-charts/mixins/has-time-series-rule', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  exports['default'] = _ember['default'].Mixin.create({

    // # ----------------------------------------------------------------------
    // # HasTimeSeriesRule -- Overview
    // # ----------------------------------------------------------------------
    // # Provides mouseover interaction for time series line chart. As user
    // # moves mouse to left and right, markers are placed on the line chart.

    // # ----------------------------------------------------------------------
    // # API -- Inputs
    // #
    // # $viewport: the viewport of the chart on which the time series rule
    // # will be displayed
    // # xRange: the range of positions of the chart in the x dimension
    // # yRange: the range of positions of the chart in the y dimension
    // # xTimeScale: a mapping from time to x position
    // # hasLineData: specifies if the mixing in class has line data
    // # showDetails: function to be called on mouseing over the line marker
    // # hideDetails: function to be called on mouseing out of the line marker
    // # lineColorFn: function which returns a line color, used for fill
    // # color of markers
    // # graphicHeight: height of graphic containing lines
    // # isInteractive: specifies whether the chart is interactive
    // # ----------------------------------------------------------------------
    xRange: null,
    yRange: null,
    xTimeScale: null,
    showDetails: null,
    hideDetails: null,
    lineColorFn: null,
    graphicHeight: null,

    // # ----------------------------------------------------------------------
    // # Drawing Functions
    // # ----------------------------------------------------------------------

    updateLineMarkers: function updateLineMarkers() {
      var lineMarkers = this._getLineMarkers();
      var showDetails = this.get('showDetails');
      var hideDetails = this.get('hideDetails');

      lineMarkers.enter().append('path').on("mouseover", function (d, i) {
        return showDetails(d, i, this);
      }).on("mouseout", function (d, i) {
        return hideDetails(d, i, this);
      }).attr({
        'class': 'line-marker',
        fill: this.get('lineColorFn'),
        d: d3.svg.symbol().size(50).type('circle')
      });

      lineMarkers.exit().remove();

      // # Update the line marker icons with the latest position data
      lineMarkers.attr({
        transform: function transform(d) {
          return "translate(" + d.x + "," + d.y + ")";
        }
      });

      lineMarkers.style({
        'stroke-width': function strokeWidth(d) {
          return d3.select(d.path).attr('stroke-width');
        }
      });
    },

    // # ----------------------------------------------------------------------
    // # Selections
    // # ----------------------------------------------------------------------

    // # Returns a selection containing the line markers, which binds the line
    // # marker data upon each update
    _getLineMarkers: function _getLineMarkers() {
      return this.get('viewport').selectAll('.line-marker').data(this._lineMarkerData());
    },

    // # ----------------------------------------------------------------------
    // # Event Bindings
    // # ----------------------------------------------------------------------

    // # Bind event handlers to the viewport to keep the position of line
    // # markers up to date. Responsibility for showing and hiding
    // # the lineMarkers is delegated to the chart.
    didInsertElement: function didInsertElement() {
      var _this = this;
      this._super();

      d3.select(this.$('svg')[0]).on('mousemove', function () {
        if (!_this.get('isInteractive')) {
          return;
        }
        // # Check if we are within the domain/range of the data
        if (_this._isEventWithinValidRange()) {
          _ember['default'].run(_this, _this.get('updateLineMarkers'));
        }
      });
    },

    // # ----------------------------------------------------------------------
    // # Private Methods -- Data
    // # ----------------------------------------------------------------------

    // # The amount of acceptable error in the x-position of the vertical line rule,
    // # in msec. This is necessary because bisection is used to find where to place
    // # the vertical rule in time domain. The default tolerance here is one hour
    _lineMarkerTolerance: 60 * 1000,

    // # The mouse position of an event with respect to the chart viewport
    _mousePosition: function _mousePosition() {
      if (!d3.event) {
        return null;
      }
      return d3.mouse(this.get('$viewport'));
    },

    // # if the mouse position is within the xRange and yRange of the
    // # implementing object
    _isEventWithinValidRange: function _isEventWithinValidRange() {
      var xRange = this.get('xRange');
      var yRange = this.get('yRange');
      var x = this._mousePosition()[0];
      var y = this._mousePosition()[1];

      var inX = d3.min(xRange) < x < d3.max(xRange);
      var inY = d3.min(yRange) < y < d3.max(yRange);
      return inX && inY;
    },

    // # To locate each marker for the given location of the rule on the x-axis
    _lineMarkerData: function _lineMarkerData() {
      var mousePosition = this._mousePosition();
      if (_ember['default'].isEmpty(mousePosition)) {
        return [];
      }

      var invXScale = this.get('xTimeScale').invert;
      var invYScale = this.get('yScale').invert;
      var lineMarkerTolerance = this.get('_lineMarkerTolerance');

      var timeX = invXScale(mousePosition[0]);

      var markerData = [];
      this.get('viewport').selectAll('path.line').each(function (d) {
        // # Before working on the line we need to check that we have the SVG Line
        // # and not any arbitrary node.  Note: you would think that 'path' would
        // # select for SVG
        if (this instanceof SVGPathElement) {
          // # Count up the number of bisections, stopping after bisecting
          // # maxIterations number of times. In case the bisection does not
          // # converge, stop after 25 iterations, which should be enough for any
          // # reasonable time range
          var iterations = 0;
          var maxIterations = 25;

          // # Perform a binary search along the length of each SVG path, calling
          // # getPointAtLength and testing where it falls relative to the position
          // # corresponding to the location of the rule
          var searchStart = 0;
          var searchEnd = this.getTotalLength();
          var searchLen = searchEnd / 2;

          var point = this.getPointAtLength(searchLen);
          while (Math.abs(timeX - invXScale(point.x)) > lineMarkerTolerance && maxIterations > ++iterations) {
            if (timeX < invXScale(point.x)) {
              searchEnd = searchLen;
            } else {
              searchStart = searchLen;
            }
            searchLen = (searchStart + searchEnd) / 2;
            point = this.getPointAtLength(searchLen);
          }

          // # Push location of the point, information that will be displayed on hover,
          // # and a reference to the line graphic that the point marks, on to a list
          // # which will be used to construct a d3 selection of each line marker
          return markerData.push({
            x: point.x,
            y: point.y,
            group: d.group,
            value: invYScale(point.y),
            time: invXScale(point.x),
            path: this
          });
        }
      });
      return markerData;
    }

  });
});
define('ember-charts/mixins/label-width', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  var LabelWidthMixin = _ember['default'].Mixin.create({

    // Override maximum width of labels to be a percentage of the total width
    labelWidth: _ember['default'].computed('outerWidth', 'labelWidthMultiplier', function () {
      return this.get('labelWidthMultiplier') * this.get('outerWidth');
    }),

    // The proportion of the chart's width that should be reserved for labels
    labelWidthMultiplier: 0.25
  });

  exports['default'] = LabelWidthMixin;
});
define('ember-charts/mixins/legend', ['exports', 'ember', 'ember-charts/utils/label-trimmer'], function (exports, _ember, _emberChartsUtilsLabelTrimmer) {
  'use strict';

  // Calculates maximum width of label in a row, before it gets truncated by label trimmer.
  // If labelWidth < average width per label (totalAvailableWidthForLabels/label count), then do not truncate
  // Else if labelWidth > average, then truncate it to average
  var calcMaxLabelWidth = function calcMaxLabelWidth(labelWidthsArray, totalAvailableWidthForLabels) {
    // Default the max label width to average width of an item
    var maxLabelWidth = totalAvailableWidthForLabels / labelWidthsArray.length;

    // Sort label widths to exclude all the short labels during iteration
    labelWidthsArray = _.sortBy(labelWidthsArray);
    for (var i = 0; i < labelWidthsArray.length; i++) {
      var curLabelWidth = labelWidthsArray[i];
      if (curLabelWidth < maxLabelWidth) {
        // If the label is shorter than the max labelWidth, then it shouldn't be truncated
        // and hence subtract short labels from remaining totalAvailableWidthForLabels.
        totalAvailableWidthForLabels -= curLabelWidth;
        // Distribute the remaining width equally in remaining labels and set that as max.
        var remainingLabelCount = labelWidthsArray.length - (i + 1);
        maxLabelWidth = totalAvailableWidthForLabels / remainingLabelCount;
      }
    }
    return maxLabelWidth;
  };

  // Select labels of current row (startIdx, endIdx) and truncate if greater than labelWidth
  var truncateLabels = function truncateLabels(labels, startIdx, endIdx, labelWidth) {
    var labelTrimmer = _emberChartsUtilsLabelTrimmer['default'].create({
      getLabelSize: function getLabelSize() {
        return labelWidth;
      }
    });
    // Select labels from current row and apply label trimmer
    labels.filter(function (data, idx) {
      return idx >= startIdx && idx < endIdx;
    }).call(labelTrimmer.get('trim'));
  };

  // Select legendItems of current row (startIdx, endIdx) and calculate total row width
  var calcLegendRowWidth = function calcLegendRowWidth(legendItems, startIdx, endIdx, legendLabelPadding) {
    var rowWidth = 0;
    legendItems.filter(function (data, idx) {
      return idx >= startIdx && idx < endIdx;
    }).each(function (val, col) {
      if (col === 0) {
        rowWidth = 0;
      } else {
        rowWidth += 2 * legendLabelPadding;
      }
      rowWidth += this.getBBox().width;
    });
    return rowWidth;
  };

  exports['default'] = _ember['default'].Mixin.create({

    // ----------------------------------------------------------------------------
    // Legend settings
    // ----------------------------------------------------------------------------

    // Padding between legend and chart
    legendTopPadding: 10,

    // Acceptable dimensions for each legend item
    legendItemHeight: 18,
    minLegendItemWidth: 120,
    maxLegendItemWidth: 160,

    // Radius of each legend icon
    legendIconRadius: 9,

    // Padding between each legend icon and padding
    legendLabelPadding: 10,

    // Toggle for whether or not to show the legend
    // if you want to override default legend behavior, override showLegend
    showLegend: true,

    // ----------------------------------------------------------------------------
    // Layout
    // ----------------------------------------------------------------------------

    // Outside bounds of legend
    legendWidth: _ember['default'].computed.alias('width'),

    legendHeight: _ember['default'].computed('numLegendRows', 'legendItemHeight', function () {
      return this.get('numLegendRows') * this.get('legendItemHeight');
    }),

    // Bottom margin is equal to the total amount of space the legend needs,
    _marginBottom: _ember['default'].computed('legendHeight', 'hasLegend', 'marginTop', function () {
      // If the legend is enabled then we need some extra breathing room
      return this.get('hasLegend') ? this.get('legendHeight') : this.get('marginBottom');
    }),

    marginBottom: _ember['default'].computed('_marginBottom', 'minimumTopBottomMargin', function () {
      return Math.max(this.get('_marginBottom'), this.get('minimumTopBottomMargin'));
    }),

    // Dynamically calculate the size of each legend item
    legendItemWidth: _ember['default'].computed('legendWidth', 'minLegendItemWidth', 'maxLegendItemWidth', 'legendItems.length', function () {

      var itemWidth = this.get('legendWidth') / this.get('legendItems.length');
      if (itemWidth < this.get('minLegendItemWidth')) {
        return this.get('minLegendItemWidth');
      } else if (itemWidth > this.get('maxLegendItemWidth')) {
        return this.get('maxLegendItemWidth');
      } else {
        return itemWidth;
      }
    }),

    // Dynamically calculate the number of legend items in each row.
    // This is only an approximate value to estimate the maximum required space for legends
    numLegendItemsPerRow: _ember['default'].computed('legendWidth', 'legendItemWidth', function () {
      // There's always at least 1 legend item per row
      return Math.max(Math.floor(this.get('legendWidth') / this.get('legendItemWidth')), 1);
    }),

    // Dynamically calculate the number of rows needed
    // This is only an approximate value to estimate the maximum required space for legends
    numLegendRows: _ember['default'].computed('legendItems.length', 'numLegendItemsPerRow', function () {
      return Math.ceil(this.get('legendItems.length') / this.get('numLegendItemsPerRow'));
    }),

    // Maximum width of each label before it gets truncated
    legendLabelWidth: _ember['default'].computed('legendItemWidth', 'legendIconRadius', 'legendLabelPadding', function () {
      return this.get('legendItemWidth') - this.get('legendIconRadius') - this.get('legendLabelPadding') * 2;
    }),

    // legendRowWidths is used to estimate how much to move the
    // labels to make them seem roughly centered
    // legendRowWidths is set every time legends are redrawn
    legendRowWidths: [],

    // numLegendItemsByRows is used to track how many legend rows will be added
    // and how many items are placed in each row
    numLegendItemsByRows: [],

    // ----------------------------------------------------------------------------
    // Styles
    // ----------------------------------------------------------------------------

    // Space between legend and chart (need to account for label size and perhaps
    // more). Charts will usually override this because there may be other things
    // below the chart graphic like an axis or labels or axis title.
    legendChartPadding: 0,

    // Center the legend beneath the chart. Since the legend is inside the chart
    // viewport, which has already been positioned with regards to margins,
    // only consider the height of the chart.
    legendAttrs: _ember['default'].computed('outerWidth', 'graphicBottom', 'legendTopPadding', 'legendChartPadding', function () {
      var dx, dy, offsetToLegend;
      dx = this.get('width') / 2;
      offsetToLegend = this.get('legendChartPadding') + this.get('legendTopPadding');
      dy = this.get('graphicBottom') + offsetToLegend;
      return {
        transform: "translate(" + dx + ", " + dy + ")"
      };
    }),

    // Place each legend item such that the legend rows appear centered to the graph.
    // Spacing between legend items must be constant and equal to 2*legendLabelPadding = 20px.
    legendItemAttrs: _ember['default'].computed('legendItemWidth', 'legendItemHeight', 'legendIconRadius', 'legendLabelPadding', 'legendRowWidths', 'numLegendItemsByRows', function () {

      var legendRowWidths = this.get('legendRowWidths');
      var legendItemWidth = this.get('legendItemWidth');
      var legendItemHeight = this.get('legendItemHeight');
      var legendLabelPadding = this.get('legendLabelPadding');
      var legendIconRadius = this.get('legendIconRadius');
      var numLegendItemsByRows = this.get('numLegendItemsByRows');

      // Track the space already alloted to a legend.
      // This is used to translate the next legend in the row.
      var usedWidth = 0;
      return {
        "class": 'legend-item',
        width: legendItemWidth,
        'stroke-width': 0,
        transform: function transform(d, col) {
          // Compute the assigned row and column for the current legend
          var row = 0;
          while (col >= numLegendItemsByRows[row]) {
            col -= numLegendItemsByRows[row];
            ++row;
          }

          // If first item in the row, set usedWidth as 0.
          if (col === 0) {
            usedWidth = 0;
          }
          // Shifting the legend by "width of current legend row"/2 to the left and adding the used space
          // Adding legend icon radius because center is off by that much in our legend layout
          var dx = -legendRowWidths[row] / 2 + usedWidth + legendIconRadius;
          var dy = row * legendItemHeight + legendItemHeight / 2;

          // Add 2*legendLabelPadding between items before putting the next legend
          usedWidth += this.getBBox().width + 2 * legendLabelPadding;
          return "translate(" + dx + ", " + dy + ")";
        }
      };
    }),

    legendIconAttrs: _ember['default'].computed('legendIconRadius', function () {
      var iconRadius = this.get('legendIconRadius');

      return {
        d: function d(_d, i) {
          if (_d.icon(_d) === 'line') {
            return "M " + -iconRadius + " 0 L " + iconRadius + " 0";
          } else {
            return d3.svg.symbol().type(_d.icon(_d, i)).size(Math.pow(iconRadius, 2))(_d, i);
          }
        },
        fill: function fill(d, i) {
          return _.isFunction(d.fill) ? d.fill(d, i) : d.fill;
        },
        stroke: function stroke(d, i) {
          return _.isFunction(d.stroke) ? d.stroke(d, i) : d.stroke;
        },
        'stroke-width': function strokeWidth(d) {
          if (!d.width) {
            return 1.5;
          }
          if (_.isFunction(d.width)) {
            return d.width(d);
          } else {
            return d.width;
          }
        },
        'stroke-dasharray': function strokeDasharray(d) {
          if (d.dotted) {
            return '2,2';
          }
        }
      };
    }),

    legendLabelAttrs: _ember['default'].computed('legendIconRadius', 'legendLabelPadding', function () {
      return {
        x: this.get('legendIconRadius') / 2 + this.get('legendLabelPadding'),
        y: '.35em'
      };
    }),

    // ----------------------------------------------------------------------------
    // Tooltip Configuration
    // ----------------------------------------------------------------------------

    showLegendDetails: _ember['default'].computed('isInteractive', function () {
      if (!this.get('isInteractive')) {
        return _ember['default'].K;
      }

      var _this = this;
      return function (data, i, element) {
        d3.select(element).classed('hovered', true);
        if (data.selector) {
          _this.get('viewport').selectAll(data.selector).classed('hovered', true);
        }

        var content = $("<span />");
        content.append($("<span class=\"tip-label\">").text(data.label));
        if (!_ember['default'].isNone(data.xValue)) {
          var formatXValue = _this.get('formatXValue');
          content.append($('<span class="name" />').text(_this.get('tooltipXValueDisplayName') + ': '));
          content.append($('<span class="value" />').text(formatXValue(data.xValue)));
          if (!_ember['default'].isNone(data.yValue)) {
            content.append('<br />');
          }
        }
        if (!_ember['default'].isNone(data.yValue)) {
          var formatYValue = _this.get('formatYValue');
          content.append($('<span class="name" />').text(_this.get('tooltipYValueDisplayName') + ': '));
          content.append($('<span class="value" />').text(formatYValue(data.yValue)));
        }

        _this.showTooltip(content.html(), d3.event);
      };
    }),

    hideLegendDetails: _ember['default'].computed('isInteractive', function () {
      if (!this.get('isInteractive')) {
        return _ember['default'].K;
      }

      var _this = this;
      return function (data, i, element) {
        d3.select(element).classed('hovered', false);
        if (data.selector) {
          _this.get('viewport').selectAll(data.selector).classed('hovered', false);
        }
        return _this.hideTooltip();
      };
    }),

    // ----------------------------------------------------------------------------
    // Drawing Functions
    // ----------------------------------------------------------------------------

    clearLegend: function clearLegend() {
      return this.get('viewport').select('.legend-container').remove();
    },

    legend: _ember['default'].computed(function () {
      var legend = this.get('viewport').select('.legend-container');
      if (legend.empty()) {
        return this.get('viewport').append('g').attr('class', 'legend-container');
      } else {
        return legend;
      }
    }).volatile(),

    // Create a list of all the legend Items, icon for each legend item and corresponding labels
    // Calculate the number of legend item rows and items in each. Each time width should be bounded by min and max legend item width.
    // Calculate the label width for each legend row that minimizes truncation.
    // And then apply legendItemAttrs to apply posisioning transforms.
    // Legend layout => A legend item consists of an Icon and a label. Icon is always positioned centered at 0px within item.
    // Line icon width is 2*legendIconRadius, where other shapes are usually legendIconRadius px in width.
    // Icon is followed by label that is positioned at (legendIconRadius/2 + legendLabelPadding) px. This adds some padding between icon and label.
    // Finally we add a padding of (2*legendLabelPadding) px before next label
    drawLegend: function drawLegend() {
      if (!this.get('showLegend')) {
        return;
      }
      this.clearLegend();
      var legend = this.get('legend');
      legend.attr(this.get('legendAttrs'));

      var showLegendDetails = this.get('showLegendDetails');
      var hideLegendDetails = this.get('hideLegendDetails');
      var legendItems = legend.selectAll('.legend-item').data(this.get('legendItems')).enter().append('g').on("mouseover", function (d, i) {
        return showLegendDetails(d, i, this);
      }).on("mouseout", function (d, i) {
        return hideLegendDetails(d, i, this);
      });
      var legendIconAttrs = this.get('legendIconAttrs');
      var isShowingTotal = this.get('isShowingTotal');
      var totalPointShape = this.get('totalPointShape');
      legendItems.each(function (d, i) {
        var sel = d3.select(this);
        if (i === 0 && isShowingTotal) {
          return sel.append('g').attr('class', 'icon').call(totalPointShape);
        } else {
          return sel.append('path').attr('class', 'icon').attr(legendIconAttrs);
        }
      });

      var legendLabelWidths = [];
      var labels = legendItems.append('text').style('text-anchor', 'start').text(function (d) {
        return d.label;
      }).attr(this.get('legendLabelAttrs')).each(function () {
        legendLabelWidths.push(this.getComputedTextLength());
      });

      var minLegendItemWidth = this.get('minLegendItemWidth');
      var maxLegendItemWidth = this.get('maxLegendItemWidth');
      var legendLabelPadding = this.get('legendLabelPadding');

      var numLegendItemsByRows = [0];
      var rowNum = 0;
      var legendWidth = this.get('legendWidth');
      var availableLegendWidth = legendWidth;

      // Calculate number of legend rows and number of items per row.
      legendItems.each(function () {
        // Calculate the current legend width with upper bound as maxLegendItemWidth
        var itemWidth = Math.min(this.getBBox().width, maxLegendItemWidth);
        // Remove padding space from available width if this is additional item in the row
        if (numLegendItemsByRows[rowNum] > 0) {
          availableLegendWidth -= 2 * legendLabelPadding;
        }

        // If available width is more than the minimum required width or the actual legend width, then add it to current row.
        if (availableLegendWidth >= minLegendItemWidth || availableLegendWidth >= itemWidth) {
          numLegendItemsByRows[rowNum]++;
        } else {
          ++rowNum;
          numLegendItemsByRows[rowNum] = 1;
          availableLegendWidth = legendWidth;
        }
        // Max width allotted for this legend must be minimum of availableLegendWidth or item width.
        availableLegendWidth -= Math.min(availableLegendWidth, itemWidth);
      });
      this.set('numLegendItemsByRows', numLegendItemsByRows);

      var startIdxCurrentRow = 0;
      var legendRowWidths = []; // Capture the width of each legend row
      var iconRadius = this.get('legendIconRadius');
      var iconToLabelPadding = iconRadius / 2 + legendLabelPadding;
      var legendItemPadding = 2 * legendLabelPadding;

      // Perform label truncation for legend items in each row.
      for (rowNum = 0; rowNum < numLegendItemsByRows.length; rowNum++) {
        var curRowItemCount = numLegendItemsByRows[rowNum];
        var totalAvailableWidthForLabels = legendWidth - // Total width of a legend row available in the chart
        curRowItemCount * (iconRadius + iconToLabelPadding) - // Subtract width of each icon and it's padding
        (curRowItemCount - 1) * legendItemPadding; // Subtract width of all padding between items

        // For current row, pick the label widths and caculate max allowed label width before truncation.
        var labelWidthsForCurRow = legendLabelWidths.splice(0, curRowItemCount);
        var maxLabelWidth = calcMaxLabelWidth(labelWidthsForCurRow, totalAvailableWidthForLabels);
        truncateLabels(labels, startIdxCurrentRow, startIdxCurrentRow + curRowItemCount, maxLabelWidth);

        // After label trimming, calculate the final width of the current legend row.
        // This will be used by legenItemAttrs transform method to position the row in the center.
        legendRowWidths[rowNum] = calcLegendRowWidth(legendItems, startIdxCurrentRow, startIdxCurrentRow + curRowItemCount, legendLabelPadding);
        startIdxCurrentRow += numLegendItemsByRows[rowNum];
      }
      this.set('legendRowWidths', legendRowWidths);

      // Assign the legend item attrs and apply transformation
      legendItems.attr(this.get('legendItemAttrs'));
      return this;
    }
  });
});
define('ember-charts/mixins/no-margin-chart', ['exports', 'ember'], function (exports, _ember) {
  // Remove all extra margins so that graph elements can line up with other
  // elements more easily
  'use strict';

  exports['default'] = _ember['default'].Mixin.create({
    marginRight: 0,

    // There should be no padding if there is no legend
    marginBottom: _ember['default'].computed('hasLegend', function () {
      return this.get('hasLegend') ? 30 : 0;
    }),

    // Gives the maximum of the lengths of the labels given in svgTextArray
    maxLabelLength: function maxLabelLength(svgTextArray) {
      var maxLabel = 0;
      svgTextArray.each(function () {
        // this.getComputedTextLength() gives the length in pixels of a text element
        if (this.getComputedTextLength() > maxLabel) {
          maxLabel = this.getComputedTextLength();
        }
      });
      return maxLabel;
    }
  });
});
define('ember-charts/mixins/pie-legend', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  var PieLegendMixin = _ember['default'].Mixin.create({

    // ----------------------------------------------------------------------------
    // Legend settings
    // ----------------------------------------------------------------------------

    // Padding at top and bottom of legend. Legend is positioned adjacent to the
    // bottom of the viewport, with legendVerticalPadding pixels separating top of
    // legend and chart graphic
    // TODO(tony): This should take into account the label heights of the pie to
    // guarrantee no intersection with them
    legendVerticalPadding: 30,

    // Padding on left and right of legend text is a percentage of total width
    legendHorizontalPadding: _ember['default'].computed('outerWidth', function () {
      return 0.2 * this.get('outerWidth');
    }),

    // Maximum height of the actual text in the legend
    maxLabelHeight: _ember['default'].computed('outerHeight', function () {
      return 0.05 * this.get('outerHeight');
    }),

    // Toggle for whether or not to show the legend
    // if you want to override default legend behavior, override showLegend
    showLegend: true,

    // ----------------------------------------------------------------------------
    // Layout
    // ----------------------------------------------------------------------------

    legendWidth: _ember['default'].computed('outerWidth', 'legendHorizontalPadding', function () {
      return this.get('outerWidth') - this.get('legendHorizontalPadding');
    }),

    // Height of max possible text height + padding. This is not the height of the
    // actual legend displayed just the total amount of room the legend might need
    legendHeight: _ember['default'].computed('maxLabelHeight', 'legendVerticalPadding', function () {
      return this.get('maxLabelHeight') + this.get('legendVerticalPadding') * 2;
    }),

    // ----------------------------------------------------------------------------
    // Styles
    // ----------------------------------------------------------------------------

    // Center the legend at the bottom of the chart drawing area. Since the legend
    // is inside the chart viewport, which has already been centered only consider
    // the height of the chart.

    legendAttrs: _ember['default'].computed('outerHeight', 'marginTop', 'marginBottom', function () {
      var dx = 0;
      // This will leave a bit of padding due to the fact that marginBottom is
      // larger than marginTop which centers the pie above the middle of the chart
      // Note(edward): The marginBottom is not larger than marginTop when there may
      // be labels at the top.
      // In the default case where marginTop is 0.3 * marginBottom, the below
      // evaluates to 0.
      var offsetToLegend = 0.15 * this.get('marginBottom') - this.get('marginTop') / 2;
      var dy = this.get('outerHeight') / 2 + offsetToLegend;

      return {
        transform: "translate(" + dx + ", " + dy + ")"
      };
    }),

    legendLabelAttrs: _ember['default'].computed(function () {
      return {
        style: "text-anchor:middle;",
        y: '-.35em'
      };
    }),

    // ----------------------------------------------------------------------------
    // Selections
    // ----------------------------------------------------------------------------

    legend: _ember['default'].computed(function () {
      var legend = this.get('viewport').select('.legend');
      if (legend.empty()) {
        return this.get('viewport').append('g').attr('class', 'legend');
      } else {
        return legend;
      }
    }).volatile(),

    // ----------------------------------------------------------------------------
    // Drawing Functions
    // ----------------------------------------------------------------------------

    clearLegend: function clearLegend() {
      return this.get('viewport').select('.legend .labels').remove();
    },

    drawLegend: function drawLegend() {
      var currentText, rowNode;
      if (!this.get('showLegend')) {
        return;
      }
      this.clearLegend();
      var legend = this.get('legend').attr(this.get('legendAttrs'));

      // Bind hover state to the legend
      var otherSlice = this.get('viewport').select('.other-slice');
      if (this.get('isInteractive') && !otherSlice.empty()) {
        legend.on('mouseover', function () {
          otherSlice.classed('hovered', true);
          return legend.classed('hovered', true);
        }).on('mouseout', function () {
          otherSlice.classed('hovered', false);
          return legend.classed('hovered', false);
        });
      }

      // Create text elements within .labels group for each row of labels
      var labels = legend.append('g').attr('class', 'labels');
      var labelStrings = this.get('legendItems').map(function (d) {
        if (d.percent != null) {
          return "" + d.label + " (" + d.percent + "%)";
        } else {
          return d.label;
        }
      });
      var row = labels.append('text').text("Other: " + labelStrings[0]).attr(this.get('legendLabelAttrs'));

      // Try adding each label. If that makes the current line too long,
      // remove it and insert the label on the next line in its own <text>
      // element, incrementing labelTop. Stop adding rows if that would
      // cause labelTop to exceed the space allocated for the legend.
      var labelTop = 0;

      var remainingLabelStrings = labelStrings.slice(1);
      for (var i = 0; i < remainingLabelStrings.length; i++) {
        var nextLabel = remainingLabelStrings[i];
        currentText = row.text();
        row.text("" + currentText + ", " + nextLabel);
        rowNode = row.node();
        if (rowNode.getBBox().width > this.get('legendWidth')) {
          if (labelTop + rowNode.getBBox().height > this.get('maxLabelHeight')) {
            row.text("" + currentText + ", ...");
            break;
          } else {
            row.text("" + currentText + ",");
            labelTop += rowNode.getBBox().height;
            row = labels.append('text').text(nextLabel).attr(this.get('legendLabelAttrs')).attr('dy', labelTop);
          }
        }
      }
      // Align the lowermost row of the block of labels against the bottom margin
      return labels.attr('transform', "translate(0, " + -labelTop + ")");
    }
  });

  exports['default'] = PieLegendMixin;
});
define('ember-charts/mixins/resize-handler', ['exports', 'ember'], function (exports, _ember) {
  // TODO(azirbel): This needs to be an external dependency.
  'use strict';

  exports['default'] = _ember['default'].Mixin.create({
    resizeEndDelay: 200,
    resizing: false,
    onResizeStart: _ember['default'].K,
    onResizeEnd: _ember['default'].K,
    onResize: _ember['default'].K,

    endResize: _ember['default'].computed(function () {
      return function (event) {
        if (this.isDestroyed) {
          return;
        }
        this.set('resizing', false);
        if (_.isFunction(this.onResizeEnd)) {
          this.onResizeEnd(event);
        }
      };
    }),

    handleWindowResize: function handleWindowResize(event) {
      if (typeof event.target.id !== "undefined" && event.target.id !== null && event.target.id !== this.elementId) {
        return;
      }
      if (!this.get('resizing')) {
        this.set('resizing', true);
        if (_.isFunction(this.onResizeStart)) {
          this.onResizeStart(event);
        }
      }
      if (_.isFunction(this.onResize)) {
        this.onResize(event);
      }
      return _ember['default'].run.debounce(this, this.get('endResize'), event, this.get('resizeEndDelay'));
    },

    didInsertElement: function didInsertElement() {
      this._super();
      return this._setupDocumentHandlers();
    },

    willDestroyElement: function willDestroyElement() {
      this._removeDocumentHandlers();
      return this._super();
    },

    _setupDocumentHandlers: function _setupDocumentHandlers() {
      if (this._resizeHandler) {
        return;
      }
      this._resizeHandler = _ember['default'].$.proxy(this.get('handleWindowResize'), this);
      return _ember['default'].$(window).on("resize." + this.elementId, this._resizeHandler);
    },

    _removeDocumentHandlers: function _removeDocumentHandlers() {
      _ember['default'].$(window).off("resize." + this.elementId, this._resizeHandler);
      return this._resizeHandler = null;
    }
  });
});
define('ember-charts/mixins/sortable-chart', ['exports', 'ember'], function (exports, _ember) {
  // # This allows chart data to be displayed in ascending or descending order as specified by
  // # the data points property sortKey. The order is determined by sortAscending.
  'use strict';

  exports['default'] = _ember['default'].Mixin.create({
    sortKey: 'value',
    sortAscending: true,

    sortedData: _ember['default'].computed('data.[]', 'sortKey', 'sortAscending', function () {
      var data = this.get('data');
      var key = this.get('sortKey');
      var sortAscending = this.get('sortAscending');

      if (_ember['default'].isEmpty(data)) {
        return [];
      } else if (key != null) {
        if (sortAscending) {
          return _.sortBy(data, key);
        } else {
          return _.sortBy(data, key).reverse();
        }
      } else {
        return data;
      }
    })
  });
});
define('ember-charts/mixins/time-series-labeler', ['exports', 'ember'], function (exports, _ember) {
  // Creates time series labels that are spaced reasonably.
  //  Provides this.formattedTime. Depends on this.xDomain and this.selectedInterval.
  'use strict';

  // The labeller type used to create the labels for each domain type
  // Note that quarters uses a month labeller to create the labels
  var domainTypeToLabellerType = {
    'S': 'seconds',
    'H': 'hours',
    'D': 'days',
    'W': 'weeks',
    'M': 'months',
    'Q': 'months',
    'Y': 'years'
  },

  // The lengthened representation for each domain type. This is different from
  // domainTypeToLabellerType
  domainTypeToLongDomainType = {
    'S': 'seconds',
    'H': 'hours',
    'D': 'days',
    'W': 'weeks',
    'M': 'months',
    'Q': 'quarters',
    'Y': 'years'
  },
      longDomainTypeToDomainType = {
    'seconds': 'S',
    'hours': 'H',
    'days': 'D',
    'weeks': 'W',
    'months': 'M',
    'quarters': 'Q',
    'years': 'Y'
  };

  // Creates time series labels that are spaced reasonably.
  // Provides @formattedTime.
  // Depends on @xDomain, @selectedInterval, and @tickFilter.
  exports['default'] = _ember['default'].Mixin.create({

    // When set to true, ticks are drawn in the middle of an interval. By default,
    // they are drawn at the start of an interval.
    centerAxisLabels: false,

    // Interval for ticks on time axis can be:
    // years, months, weeks, days
    // This is used only when a dynamic x axis is not used
    selectedInterval: 'M',
    // There are also cases where the selected interval is different from a
    // computed interval for the Aggregation of Bars.  If there is a delta then
    // this will be set and used for the bar offset.
    computedBarInterval: null,

    // [Dynamic X Axis] dynamically set the labelling of the x axis
    dynamicXAxis: false,

    // [Dynamic X Axis] a ratio specifying the point at which the time
    // specificity should be increased. The specificity ratio roughly
    // bounds the number of x axis labels:

    // [SPECIFICITY_RATIO*(MAX_LABELS) , MAX_LABELS]

    // Essentially, the higher the ratio (until a max of 1), the closer the
    // number of labels along the x axis is to the max number of labels
    SPECIFICITY_RATIO: 0.7,

    // [Dynamic X Axis] The two variables below are relevant only for a
    // dynamic x axis and refer to the minimum and maximum time specificity
    // for the x labels
    // For example, if one wants the specificity to range only from days to
    // quarters, the min and max specificities would be 'D' and 'Q' respectively
    // Allowable values are S, H, D, W, M, Q, Y
    minTimeSpecificity: 'S',
    maxTimeSpecificity: 'Y',

    // The domain type of the x axis (years, quarters, months...)
    // If the x axis is not dynamically labelled, then the domain type
    // is simply the selectedInterval
    MONTHS_IN_QUARTER: 3,
    xAxisTimeInterval: _ember['default'].computed('selectedInterval', 'dynamicXAxis', function (key, value) {
      var domain;
      if (this.get('dynamicXAxis')) {
        domain = value || 'M';
      } else {
        domain = this.get('selectedInterval');
      }
      // to maintain consistency, convert the domain type into its
      // single letter representation
      if (domain.length > 1) {
        return longDomainTypeToDomainType[domain];
      } else {
        return domain;
      }
    }),

    // The maximum number of labels which will appear on the x axis of the
    // chart. If there are more labels than this (e.g. if you are
    // charting 13 intervals or more) then the number of labels
    // is contracted to a lower value less than or equal to the
    // max number of labels

    // The caller of the time series chart should ideally set this to a value
    // proportional to the width of the graphical panel
    maxNumberOfLabels: 10,

    // The ordering of each time domain from most specific to least specific
    DOMAIN_ORDERING: ['S', 'H', 'D', 'W', 'M', 'Q', 'Y'],

    // D3 No longer handles "minor ticks" for the user, but has instead reverted
    // to a strategy of allowing the user to handle rendered ticks as they see
    // fit.
    // maxNumberOfMinorTicks sets a threshold that is useful when determining our
    // interval. This represents the number of ticks that could be drawn between
    // major ticks. For instance, we may 'allow' 2 minor ticks, but only need
    // to render a single minor tick between labels.
    //
    // minorTickInterval is the modulo for the items to be removed.  This number
    // will be between 1 and the maxNumberOfMinorTicks
    //
    // A maxNumberOfMinorTicks=0 and minorTickInterval=1 essentailly disables the
    // minor tick feature.
    maxNumberOfMinorTicks: 0,
    minorTickInterval: 1,

    filterMinorTicks: function filterMinorTicks() {
      var gXAxis = this.get('xAxis'),
          minorTickInterval = this.get('minorTickInterval'),
          labels,
          ticks,
          minorDates;
      // for the labels we need to reset all of the styles in case the graph updates
      // by being resized.
      gXAxis.selectAll('line').attr("y2", "6");
      gXAxis.selectAll('text').style("display", "block");

      // Need comparison data to do our tick label filtering
      minorDates = this.get('labelledTicks').map(function (item) {
        return new Date(item).getTime();
      }).filter(function (value, index) {
        return index % minorTickInterval !== 0;
      });

      // We have an issue where the nodes come back out of order.  This is a
      // side effect of redrawing the axis.  D3 don't give two [cares] about the
      // insertion order of nodes - they are simply translated into place.  This
      // occurs when the selection with the NEW data is made - the existing ones
      // updated - then the new ones appended on .enter(...)
      labels = gXAxis.selectAll('text').filter(function (value) {
        return minorDates.length > 0 && minorDates.indexOf(value.getTime()) !== -1;
      });
      ticks = gXAxis.selectAll('line').filter(function (value, index) {
        return index % minorTickInterval !== 0;
      });
      labels.style("display", "none");
      ticks.attr("y2", "12");
    },

    // A candidate set of ticks on which labels can appear.
    unfilteredLabelledTicks: _ember['default'].computed('xDomain', 'centerAxisLabels', 'xAxisTimeInterval', function () {
      var count, domain, interval, j, len, results, tick, ticks;
      domain = this.get('xDomain');
      ticks = this.get('tickLabelerFn')(domain[0], domain[1]);
      if (!this.get('centerAxisLabels')) {
        return ticks;
      } else {
        count = 1;
        interval = this.domainTypeToLongDomainTypeSingular(this.get('xAxisTimeInterval'));
        if (interval === 'quarter') {
          count = this.MONTHS_IN_QUARTER;
          interval = 'month';
        }
        results = [];
        for (j = 0, len = ticks.length; j < len; j++) {
          tick = ticks[j];
          results.push(this._advanceMiddle(tick, interval, count));
        }
        return results;
      }
    }),

    /**
     * A function that can be passed in if there's tick labels we specifically
     * wish to filter out (for example first label, last label, overflows, etc)
     *
     * NOTE: This function filters the ticks after they have been centered (when
     * specified), meaning that the functionality here is not trivially replicable
     * simply by modifying `this.filterLabels` in the `tickLabelerFn` implementation.
     *
     * @type {function}
     */
    tickFilter: _ember['default'].computed(function () {
      return function () {
        return true;
      };
    }),

    //  This is the set of ticks on which labels appear.
    labelledTicks: _ember['default'].computed('unfilteredLabelledTicks', 'tickFilter', function () {
      return this.get('unfilteredLabelledTicks').filter(this.get('tickFilter'));
    }),

    // We need a method to figure out the interval specifity
    intervalSpecificity: _ember['default'].computed('times', 'minTimeSpecificity', function () {
      var ind1, ind2, domainTypes, maxNumberOfLabels, i, len, timeBetween;

      // Now the real trick is if there is any allowance for minor ticks we should
      // consider inflating the max allowed ticks to see if we can fit in a more
      // specific domain.  Previous versions would increase the specifity one step
      // which would then be cut out in filtering.
      // A single minor tick alows us to double our capacity - 2 to triple
      maxNumberOfLabels = this.get('maxNumberOfLabels') * (this.get('maxNumberOfMinorTicks') + 1);

      // Find the segments that we'll test for (inclusive)
      ind1 = this.get('DOMAIN_ORDERING').indexOf(this.get('minTimeSpecificity'));
      ind2 = this.get('DOMAIN_ORDERING').indexOf(this.get('maxTimeSpecificity')) + 1;
      // Refers to the metrics used for the labelling
      if (ind2 < 0) {
        domainTypes = this.get('DOMAIN_ORDERING').slice(ind1);
      } else {
        domainTypes = this.get('DOMAIN_ORDERING').slice(ind1, ind2);
      }

      for (i = 0, len = domainTypes.length; i < len; i++) {
        timeBetween = this.get('times')[domainTypes[i]];
        if (timeBetween <= maxNumberOfLabels) {
          return domainTypes[i];
        }
      }
      return this.get('maxTimeSpecificity');
    }),

    times: _ember['default'].computed('xDomain', function () {
      var ret, domain, start, stop, types, len, i;

      ret = {};
      domain = this.get('xDomain');
      start = domain[0];
      stop = domain[1];
      types = this.get('DOMAIN_ORDERING');

      for (i = 0, len = types.length; i < len; i++) {
        ret[types[i]] = this.numTimeBetween(domainTypeToLongDomainType[types[i]], start, stop);
      }
      return ret;
    }),

    _advanceMiddle: function _advanceMiddle(time, interval, count) {
      return new Date(time = time.getTime() / 2 + d3.time[interval].offset(time, count) / 2);
    },

    // The amount of time between a start and a stop in the specified units
    // Note that the d3 time library was not used to calculate all of these times
    // in order to improve runtime. This comes at the expense of accuracy, but for
    // the applications of timeBetween, it is not too important
    numTimeBetween: function numTimeBetween(timeInterval, start, stop) {
      switch (timeInterval) {
        case 'seconds':
          return (stop - start) / 1000;
        case 'hours':
          return (stop - start) / 3600000;
        case 'days':
          return (stop - start) / 86400000;
        case 'weeks':
          return d3.time.weeks(start, stop).length;
        case 'months':
          return d3.time.months(start, stop).length;
        case 'quarters':
          return d3.time.months(start, stop).length / this.MONTHS_IN_QUARTER;
        case 'years':
          return d3.time.years(start, stop).length;
      }
    },

    domainTypeToLongDomainTypeSingular: function domainTypeToLongDomainTypeSingular(timeInterval) {
      var domainType = domainTypeToLongDomainType[timeInterval];
      return domainType.substring(0, domainType.length - 1);
    },

    // Dynamic x labelling tries to intelligently limit the number of labels
    // along the x axis to a specified limit. In order to do this, time
    // specificity is callibrated (e.g. for a range of 2 years, instead of having
    // the labels be in years, the specificity is increased to quarters)
    // If the minTimeSpecificity or maxTimeSpecificity are set, then the labels
    // are limited to fall between the time units between these bounds.
    dynamicXLabelling: function dynamicXLabelling(start, stop) {
      var timeUnit, candidateLabels;

      timeUnit = this.get('intervalSpecificity');
      this.set('xAxisTimeInterval', timeUnit);
      candidateLabels = d3.time[domainTypeToLabellerType[timeUnit]](start, stop);
      if (timeUnit === 'Q') {
        // Normalize quarters
        candidateLabels = this.filterLabelsForQuarters(candidateLabels);
      }
      return this.filterLabels(candidateLabels, timeUnit);
    },

    // So we need to filter and do a little math to see if we are going have any
    // minor ticks in our graph.  We'll be using the maxNumberOfMinorTicks as a
    // control to know if we're filtering or simply relegating the labels to a
    // mere tick.
    filterLabels: function filterLabels(labelCandidates, domain) {
      var maxNumberOfLabels, maxNumberOfMinorTicks, modulo, len;

      maxNumberOfLabels = this.get('maxNumberOfLabels');
      maxNumberOfMinorTicks = this.get('maxNumberOfMinorTicks');
      len = labelCandidates.length;

      if (len > maxNumberOfLabels && typeof this.customFilterLibrary[domain] === "function") {
        labelCandidates = this.customFilterLibrary[domain](maxNumberOfLabels, maxNumberOfMinorTicks, labelCandidates);
        len = labelCandidates.length;
      } else if (len > maxNumberOfLabels) {
        // This tells us how many times we can half the results until we're at or
        // below our maxNumberOfLabels threshold. Derived from:
        // len ∕ 2ⁿ ≤ maxNumberOfLabels
        // Math.log(x) / Math.LN2
        modulo = Math.ceil(Math.log(len / (maxNumberOfLabels * (maxNumberOfMinorTicks + 1))) / Math.LN2) + 1;
        labelCandidates = labelCandidates.filter(function (d, i) {
          return i % Math.pow(2, modulo) === 0;
        });
        len = labelCandidates.length;
      }

      // So now we figure out (if we have added space for) the number of minor
      // ticks that will be shown in the presentiation.
      if (maxNumberOfMinorTicks > 0) {
        this.set('minorTickInterval', Math.ceil(len / maxNumberOfLabels));
      }
      return labelCandidates;
    },

    filterLabelsForQuarters: function filterLabelsForQuarters(dates) {
      // Pretty simple; getMonth is a 0 based index of the month.  We do modulo
      // for the time being.
      return dates.filter(function (d) {
        return d.getMonth() % 3 === 0;
      });
    },

    // We have an option of suppling custom filters based on the date type.  This
    // way we can append any special behavior or pruning algorithm to Months that
    // wouldn't be applicable to Weeks
    customFilterLibrary: {},

    // Returns the function which returns the labelled intervals between
    // start and stop for the selected interval.
    tickLabelerFn: _ember['default'].computed('dynamicXAxis', 'maxNumberOfLabels', 'maxNumberOfMinorTicks', 'xAxisVertLabels', 'xAxisTimeInterval', 'SPECIFICITY_RATIO', 'minTimeSpecificity', 'maxTimeSpecificity', function () {
      if (this.get('dynamicXAxis')) {
        return _.bind(function (start, stop) {
          return this.dynamicXLabelling(start, stop);
        }, this);
      } else {
        return _.bind(function (start, stop) {
          var domain, candidateLabels;
          domain = this.get('xAxisTimeInterval');
          // So we're going to use the interval we defined as a the maxTimeSpecificity
          this.set('maxTimeSpecificity', domain);
          candidateLabels = d3.time[domainTypeToLabellerType[domain]](start, stop);
          if (domain === 'Q') {
            // Normalize quarters
            candidateLabels = this.filterLabelsForQuarters(candidateLabels);
          }
          return this.filterLabels(candidateLabels, domain);
        }, this);
      }
    }),

    quarterFormat: function quarterFormat(d) {
      var month, prefix, suffix;
      month = d.getMonth() % 12;
      prefix = "";
      if (month < 3) {
        prefix = 'Q1';
      } else if (month < 6) {
        prefix = 'Q2';
      } else if (month < 9) {
        prefix = 'Q3';
      } else {
        prefix = 'Q4';
      }
      suffix = d3.time.format('%Y')(d);
      return prefix + ' ' + suffix;
    },

    // See https://github.com/mbostock/d3/wiki/Time-Formatting
    formattedTime: _ember['default'].computed('xAxisTimeInterval', function () {
      switch (this.get('xAxisTimeInterval')) {
        case 'years':
        case 'Y':
          return d3.time.format('%Y');
        case 'quarters':
        case 'Q':
          return this.quarterFormat;
        case 'months':
        case 'M':
          return d3.time.format('%b \'%y');
        case 'weeks':
        case 'W':
          return d3.time.format('%-m/%-d/%y');
        case 'days':
        case 'D':
          return d3.time.format('%-m/%-d/%y');
        case 'hours':
        case 'H':
          return d3.time.format('%H:%M:%S');
        case 'seconds':
        case 'S':
          return d3.time.format('%H:%M:%S');
        default:
          return d3.time.format('%Y');
      }
    })
  });
});
define("ember-charts/utils/group-by", ["exports"], function (exports) {
	"use strict";

	exports.groupBy = groupBy;

	function groupBy(obj, getter) {
		var group, key, value;
		var result = {};
		for (var i = 0, len = obj.length; i < len; i++) {
			value = obj[i];
			key = getter(value, i);
			group = result[key] || (result[key] = []);
			group.push(value);
		}
		return result;
	}
});
define('ember-charts/utils/label-trimmer', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  exports['default'] = _ember['default'].Object.extend({

    // Reserved space for extra characters
    reservedCharLength: 0,

    getLabelSize: function getLabelSize() {
      return 100;
    },

    getLabelText: function getLabelText(d) {
      return d.label;
    },

    trim: _ember['default'].computed('getLabelSize', 'getLabelText', function () {

      var getLabelSize = this.get('getLabelSize');
      var getLabelText = this.get('getLabelText');
      var reservedCharLength = this.get('reservedCharLength');

      return function (selection) {

        return selection.text(function (d) {

          var bbW = this.getBBox().width;
          var label = getLabelText(d);
          if (!label) {
            return '';
          }
          var charWidth = bbW / label.length;
          var textLabelWidth = getLabelSize(d, selection) - reservedCharLength * charWidth;
          var numChars = Math.floor(textLabelWidth / charWidth);

          if (numChars - 3 <= 0) {
            return '...';
          } else if (bbW > textLabelWidth) {
            return label.slice(0, numChars - 3) + '...';
          } else {
            return label;
          }
        });
      };
    })
  });
});
define('ember-cli-app-version/initializer-factory', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  exports['default'] = initializerFactory;

  var classify = _ember['default'].String.classify;
  var libraries = _ember['default'].libraries;

  function initializerFactory(name, version) {
    var registered = false;

    return function () {
      if (!registered && name && version) {
        var appName = classify(name);
        libraries.register(appName, version);
        registered = true;
      }
    };
  }
});
define("ember-data/-private/adapters", ["exports", "ember-data/adapters/json-api", "ember-data/adapters/rest"], function (exports, _emberDataAdaptersJsonApi, _emberDataAdaptersRest) {
  /**
    @module ember-data
  */

  "use strict";

  exports.JSONAPIAdapter = _emberDataAdaptersJsonApi["default"];
  exports.RESTAdapter = _emberDataAdaptersRest["default"];
});
define('ember-data/-private/adapters/build-url-mixin', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  var get = _ember['default'].get;

  /**
  
    WARNING: This interface is likely to change in order to accomodate https://github.com/emberjs/rfcs/pull/4
  
    ## Using BuildURLMixin
  
    To use url building, include the mixin when extending an adapter, and call `buildURL` where needed.
    The default behaviour is designed for RESTAdapter.
  
    ### Example
  
    ```javascript
    export default DS.Adapter.extend(BuildURLMixin, {
      findRecord: function(store, type, id, snapshot) {
        var url = this.buildURL(type.modelName, id, snapshot, 'findRecord');
        return this.ajax(url, 'GET');
      }
    });
    ```
  
    ### Attributes
  
    The `host` and `namespace` attributes will be used if defined, and are optional.
  
    @class BuildURLMixin
    @namespace DS
  */
  exports['default'] = _ember['default'].Mixin.create({
    /**
      Builds a URL for a given type and optional ID.
       By default, it pluralizes the type's name (for example, 'post'
      becomes 'posts' and 'person' becomes 'people'). To override the
      pluralization see [pathForType](#method_pathForType).
       If an ID is specified, it adds the ID to the path generated
      for the type, separated by a `/`.
       When called by RESTAdapter.findMany() the `id` and `snapshot` parameters
      will be arrays of ids and snapshots.
       @method buildURL
      @param {String} modelName
      @param {(String|Array|Object)} id single id or array of ids or query
      @param {(DS.Snapshot|Array)} snapshot single snapshot or array of snapshots
      @param {String} requestType
      @param {Object} query object of query parameters to send for query requests.
      @return {String} url
    */
    buildURL: function buildURL(modelName, id, snapshot, requestType, query) {
      switch (requestType) {
        case 'findRecord':
          return this.urlForFindRecord(id, modelName, snapshot);
        case 'findAll':
          return this.urlForFindAll(modelName, snapshot);
        case 'query':
          return this.urlForQuery(query, modelName);
        case 'queryRecord':
          return this.urlForQueryRecord(query, modelName);
        case 'findMany':
          return this.urlForFindMany(id, modelName, snapshot);
        case 'findHasMany':
          return this.urlForFindHasMany(id, modelName, snapshot);
        case 'findBelongsTo':
          return this.urlForFindBelongsTo(id, modelName, snapshot);
        case 'createRecord':
          return this.urlForCreateRecord(modelName, snapshot);
        case 'updateRecord':
          return this.urlForUpdateRecord(id, modelName, snapshot);
        case 'deleteRecord':
          return this.urlForDeleteRecord(id, modelName, snapshot);
        default:
          return this._buildURL(modelName, id);
      }
    },

    /**
      @method _buildURL
      @private
      @param {String} modelName
      @param {String} id
      @return {String} url
    */
    _buildURL: function _buildURL(modelName, id) {
      var url = [];
      var host = get(this, 'host');
      var prefix = this.urlPrefix();
      var path;

      if (modelName) {
        path = this.pathForType(modelName);
        if (path) {
          url.push(path);
        }
      }

      if (id) {
        url.push(encodeURIComponent(id));
      }
      if (prefix) {
        url.unshift(prefix);
      }

      url = url.join('/');
      if (!host && url && url.charAt(0) !== '/') {
        url = '/' + url;
      }

      return url;
    },

    /**
     Builds a URL for a `store.findRecord(type, id)` call.
      Example:
      ```app/adapters/user.js
     import DS from 'ember-data';
      export default DS.JSONAPIAdapter.extend({
       urlForFindRecord(id, modelName, snapshot) {
         let baseUrl = this.buildURL();
         return `${baseUrl}/users/${snapshot.adapterOptions.user_id}/playlists/${id}`;
       }
     });
     ```
      @method urlForFindRecord
     @param {String} id
     @param {String} modelName
     @param {DS.Snapshot} snapshot
     @return {String} url
      */
    urlForFindRecord: function urlForFindRecord(id, modelName, snapshot) {
      return this._buildURL(modelName, id);
    },

    /**
     Builds a URL for a `store.findAll(type)` call.
      Example:
      ```app/adapters/comment.js
     import DS from 'ember-data';
      export default DS.JSONAPIAdapter.extend({
       urlForFindAll(id, modelName, snapshot) {
         return 'data/comments.json';
       }
     });
     ```
      @method urlForFindAll
     @param {String} modelName
     @param {DS.SnapshotRecordArray} snapshot
     @return {String} url
     */
    urlForFindAll: function urlForFindAll(modelName, snapshot) {
      return this._buildURL(modelName);
    },

    /**
     Builds a URL for a `store.query(type, query)` call.
      Example:
      ```app/adapters/application.js
     import DS from 'ember-data';
      export default DS.RESTAdapter.extend({
       host: 'https://api.github.com',
       urlForQuery (query, modelName) {
         switch(modelName) {
           case 'repo':
             return `https://api.github.com/orgs/${query.orgId}/repos`;
           default:
             return this._super(...arguments);
         }
       }
     });
     ```
      @method urlForQuery
     @param {Object} query
     @param {String} modelName
     @return {String} url
     */
    urlForQuery: function urlForQuery(query, modelName) {
      return this._buildURL(modelName);
    },

    /**
     Builds a URL for a `store.queryRecord(type, query)` call.
      Example:
      ```app/adapters/application.js
     import DS from 'ember-data';
      export default DS.RESTAdapter.extend({
       urlForQueryRecord({ slug }, modelName) {
         let baseUrl = this.buildURL();
         return `${baseUrl}/${encodeURIComponent(slug)}`;
       }
     });
     ```
      @method urlForQueryRecord
     @param {Object} query
     @param {String} modelName
     @return {String} url
     */
    urlForQueryRecord: function urlForQueryRecord(query, modelName) {
      return this._buildURL(modelName);
    },

    /**
     Builds a URL for coalesceing multiple `store.findRecord(type, id)
     records into 1 request when the adapter's `coalesceFindRequests`
     property is true.
      Example:
      ```app/adapters/application.js
     import DS from 'ember-data';
      export default DS.RESTAdapter.extend({
       urlForFindMany(ids, modelName) {
         let baseUrl = this.buildURL();
         return `${baseUrl}/coalesce`;
       }
     });
     ```
      @method urlForFindMany
     @param {Array} ids
     @param {String} modelName
     @param {Array} snapshots
     @return {String} url
     */
    urlForFindMany: function urlForFindMany(ids, modelName, snapshots) {
      return this._buildURL(modelName);
    },

    /**
     Builds a URL for fetching a async hasMany relationship when a url
     is not provided by the server.
      Example:
      ```app/adapters/application.js
     import DS from 'ember-data';
      export default DS.JSONAPIAdapter.extend({
       urlForFindHasMany(id, modelName, snapshot) {
         let baseUrl = this.buildURL(id, modelName);
         return `${baseUrl}/relationships`;
       }
     });
     ```
      @method urlForFindHasMany
     @param {String} id
     @param {String} modelName
     @param {DS.Snapshot} snapshot
     @return {String} url
     */
    urlForFindHasMany: function urlForFindHasMany(id, modelName, snapshot) {
      return this._buildURL(modelName, id);
    },

    /**
     Builds a URL for fetching a async belongsTo relationship when a url
     is not provided by the server.
      Example:
      ```app/adapters/application.js
     import DS from 'ember-data';
      export default DS.JSONAPIAdapter.extend({
       urlForFindBelongsTo(id, modelName, snapshot) {
         let baseUrl = this.buildURL(id, modelName);
         return `${baseUrl}/relationships`;
       }
     });
     ```
      @method urlForFindBelongsTo
     @param {String} id
     @param {String} modelName
     @param {DS.Snapshot} snapshot
     @return {String} url
     */
    urlForFindBelongsTo: function urlForFindBelongsTo(id, modelName, snapshot) {
      return this._buildURL(modelName, id);
    },

    /**
     Builds a URL for a `record.save()` call when the record was created
     locally using `store.createRecord()`.
      Example:
      ```app/adapters/application.js
     import DS from 'ember-data';
      export default DS.RESTAdapter.extend({
       urlForCreateRecord(modelName, snapshot) {
         return this._super(...arguments) + '/new';
       }
     });
     ```
      @method urlForCreateRecord
     @param {String} modelName
     @param {DS.Snapshot} snapshot
     @return {String} url
     */
    urlForCreateRecord: function urlForCreateRecord(modelName, snapshot) {
      return this._buildURL(modelName);
    },

    /**
     Builds a URL for a `record.save()` call when the record has been update locally.
      Example:
      ```app/adapters/application.js
     import DS from 'ember-data';
      export default DS.RESTAdapter.extend({
       urlForUpdateRecord(id, modelName, snapshot) {
         return `/${id}/feed?access_token=${snapshot.adapterOptions.token}`;
       }
     });
     ```
      @method urlForUpdateRecord
     @param {String} id
     @param {String} modelName
     @param {DS.Snapshot} snapshot
     @return {String} url
     */
    urlForUpdateRecord: function urlForUpdateRecord(id, modelName, snapshot) {
      return this._buildURL(modelName, id);
    },

    /**
     Builds a URL for a `record.save()` call when the record has been deleted locally.
      Example:
      ```app/adapters/application.js
     import DS from 'ember-data';
      export default DS.RESTAdapter.extend({
       urlForDeleteRecord(id, modelName, snapshot) {
         return this._super(...arguments) + '/destroy';
       }
     });
     ```
      * @method urlForDeleteRecord
     * @param {String} id
     * @param {String} modelName
     * @param {DS.Snapshot} snapshot
     * @return {String} url
     */
    urlForDeleteRecord: function urlForDeleteRecord(id, modelName, snapshot) {
      return this._buildURL(modelName, id);
    },

    /**
      @method urlPrefix
      @private
      @param {String} path
      @param {String} parentURL
      @return {String} urlPrefix
    */
    urlPrefix: function urlPrefix(path, parentURL) {
      var host = get(this, 'host');
      var namespace = get(this, 'namespace');

      if (!host || host === '/') {
        host = '';
      }

      if (path) {
        // Protocol relative url
        if (/^\/\//.test(path) || /http(s)?:\/\//.test(path)) {
          // Do nothing, the full host is already included.
          return path;

          // Absolute path
        } else if (path.charAt(0) === '/') {
            return '' + host + path;
            // Relative path
          } else {
              return parentURL + '/' + path;
            }
      }

      // No path provided
      var url = [];
      if (host) {
        url.push(host);
      }
      if (namespace) {
        url.push(namespace);
      }
      return url.join('/');
    },

    /**
      Determines the pathname for a given type.
       By default, it pluralizes the type's name (for example,
      'post' becomes 'posts' and 'person' becomes 'people').
       ### Pathname customization
       For example if you have an object LineItem with an
      endpoint of "/line_items/".
       ```app/adapters/application.js
      import DS from 'ember-data';
       export default DS.RESTAdapter.extend({
        pathForType: function(modelName) {
          var decamelized = Ember.String.decamelize(modelName);
          return Ember.String.pluralize(decamelized);
        }
      });
      ```
       @method pathForType
      @param {String} modelName
      @return {String} path
    **/
    pathForType: function pathForType(modelName) {
      var camelized = _ember['default'].String.camelize(modelName);
      return _ember['default'].String.pluralize(camelized);
    }
  });
});
define('ember-data/-private/core', ['exports', 'ember', 'ember-data/version'], function (exports, _ember, _emberDataVersion) {
  'use strict';

  /**
    @module ember-data
  */

  /**
    All Ember Data classes, methods and functions are defined inside of this namespace.
  
    @class DS
    @static
  */

  /**
    @property VERSION
    @type String
    @static
  */
  var DS = _ember['default'].Namespace.create({
    VERSION: _emberDataVersion['default'],
    name: "DS"
  });

  if (_ember['default'].libraries) {
    _ember['default'].libraries.registerCoreLibrary('Ember Data', DS.VERSION);
  }

  exports['default'] = DS;
});
define('ember-data/-private/debug', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  exports.assert = assert;
  exports.debug = debug;
  exports.deprecate = deprecate;
  exports.info = info;
  exports.runInDebug = runInDebug;
  exports.instrument = instrument;
  exports.warn = warn;
  exports.debugSeal = debugSeal;
  exports.assertPolymorphicType = assertPolymorphicType;

  function assert() {
    return _ember['default'].assert.apply(_ember['default'], arguments);
  }

  function debug() {
    return _ember['default'].debug.apply(_ember['default'], arguments);
  }

  function deprecate() {
    return _ember['default'].deprecate.apply(_ember['default'], arguments);
  }

  function info() {
    return _ember['default'].info.apply(_ember['default'], arguments);
  }

  function runInDebug() {
    return _ember['default'].runInDebug.apply(_ember['default'], arguments);
  }

  function instrument(method) {
    return method();
  }

  function warn() {
    return _ember['default'].warn.apply(_ember['default'], arguments);
  }

  function debugSeal() {
    return _ember['default'].debugSeal.apply(_ember['default'], arguments);
  }

  function checkPolymorphic(typeClass, addedRecord) {
    if (typeClass.__isMixin) {
      //TODO Need to do this in order to support mixins, should convert to public api
      //once it exists in Ember
      return typeClass.__mixin.detect(addedRecord.type.PrototypeMixin);
    }
    if (_ember['default'].MODEL_FACTORY_INJECTIONS) {
      typeClass = typeClass.superclass;
    }
    return typeClass.detect(addedRecord.type);
  }

  /*
    Assert that `addedRecord` has a valid type so it can be added to the
    relationship of the `record`.
  
    The assert basically checks if the `addedRecord` can be added to the
    relationship (specified via `relationshipMeta`) of the `record`.
  
    This utility should only be used internally, as both record parameters must
    be an InternalModel and the `relationshipMeta` needs to be the meta
    information about the relationship, retrieved via
    `record.relationshipFor(key)`.
  
    @method assertPolymorphicType
    @param {InternalModel} record
    @param {RelationshipMeta} relationshipMeta retrieved via
           `record.relationshipFor(key)`
    @param {InternalModel} addedRecord record which
           should be added/set for the relationship
  */

  function assertPolymorphicType(record, relationshipMeta, addedRecord) {
    var addedType = addedRecord.type.modelName;
    var recordType = record.type.modelName;
    var key = relationshipMeta.key;
    var typeClass = record.store.modelFor(relationshipMeta.type);

    var assertionMessage = 'You cannot add a record of type \'' + addedType + '\' to the \'' + recordType + '.' + key + '\' relationship (only \'' + typeClass.modelName + '\' allowed)';

    assert(assertionMessage, checkPolymorphic(typeClass, addedRecord));
  }
});
define('ember-data/-private/ext/date', ['exports', 'ember', 'ember-data/-private/debug'], function (exports, _ember, _emberDataPrivateDebug) {
  /**
    @module ember-data
  */

  'use strict';

  /**
     Date.parse with progressive enhancement for ISO 8601 <https://github.com/csnover/js-iso8601>
  
     © 2011 Colin Snover <http://zetafleet.com>
  
     Released under MIT license.
  
     @class Date
     @namespace Ember
     @static
     @deprecated
  */
  _ember['default'].Date = _ember['default'].Date || {};

  var origParse = Date.parse;
  var numericKeys = [1, 4, 5, 6, 7, 10, 11];

  var parseDate = function parseDate(date) {
    var timestamp, struct;
    var minutesOffset = 0;

    // ES5 §15.9.4.2 states that the string should attempt to be parsed as a Date Time String Format string
    // before falling back to any implementation-specific date parsing, so that’s what we do, even if native
    // implementations could be faster
    //              1 YYYY                2 MM       3 DD           4 HH    5 mm       6 ss        7 msec        8 Z 9 ±    10 tzHH    11 tzmm
    if (struct = /^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?:(\d{2}))?)?)?$/.exec(date)) {
      // avoid NaN timestamps caused by “undefined” values being passed to Date.UTC
      for (var i = 0, k; k = numericKeys[i]; ++i) {
        struct[k] = +struct[k] || 0;
      }

      // allow undefined days and months
      struct[2] = (+struct[2] || 1) - 1;
      struct[3] = +struct[3] || 1;

      if (struct[8] !== 'Z' && struct[9] !== undefined) {
        minutesOffset = struct[10] * 60 + struct[11];

        if (struct[9] === '+') {
          minutesOffset = 0 - minutesOffset;
        }
      }

      timestamp = Date.UTC(struct[1], struct[2], struct[3], struct[4], struct[5] + minutesOffset, struct[6], struct[7]);
    } else {
      timestamp = origParse ? origParse(date) : NaN;
    }

    return timestamp;
  };

  exports.parseDate = parseDate;

  _ember['default'].Date.parse = function (date) {
    // throw deprecation
    (0, _emberDataPrivateDebug.deprecate)('Ember.Date.parse is deprecated because Safari 5-, IE8-, and\n      Firefox 3.6- are no longer supported (see\n      https://github.com/csnover/js-iso8601 for the history of this issue).\n      Please use Date.parse instead', false, {
      id: 'ds.ember.date.parse-deprecate',
      until: '3.0.0'
    });

    return parseDate(date);
  };

  if (_ember['default'].EXTEND_PROTOTYPES === true || _ember['default'].EXTEND_PROTOTYPES.Date) {
    (0, _emberDataPrivateDebug.deprecate)('Overriding Date.parse with Ember.Date.parse is deprecated. Please set ENV.EmberENV.EXTEND_PROTOTYPES.Date to false in config/environment.js\n\n\n// config/environment.js\nENV = {\n  EmberENV: {\n    EXTEND_PROTOTYPES: {\n      Date: false,\n    }\n  }\n}\n', false, {
      id: 'ds.date.parse-deprecate',
      until: '3.0.0'
    });
    Date.parse = parseDate;
  }
});
define('ember-data/-private/features', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  exports['default'] = isEnabled;

  function isEnabled() {
    var _Ember$FEATURES;

    return (_Ember$FEATURES = _ember['default'].FEATURES).isEnabled.apply(_Ember$FEATURES, arguments);
  }
});
define('ember-data/-private/global', ['exports'], function (exports) {
  /* globals global, window, self */

  // originally from https://github.com/emberjs/ember.js/blob/c0bd26639f50efd6a03ee5b87035fd200e313b8e/packages/ember-environment/lib/global.js

  // from lodash to catch fake globals
  'use strict';

  function checkGlobal(value) {
    return value && value.Object === Object ? value : undefined;
  }

  // element ids can ruin global miss checks
  function checkElementIdShadowing(value) {
    return value && value.nodeType === undefined ? value : undefined;
  }

  // export real global
  exports['default'] = checkGlobal(checkElementIdShadowing(typeof global === 'object' && global)) || checkGlobal(typeof self === 'object' && self) || checkGlobal(typeof window === 'object' && window) || new Function('return this')();
  // eval outside of strict mode
});
define("ember-data/-private/initializers/data-adapter", ["exports", "ember-data/-private/system/debug/debug-adapter"], function (exports, _emberDataPrivateSystemDebugDebugAdapter) {
  "use strict";

  exports["default"] = initializeDebugAdapter;

  /*
    Configures a registry with injections on Ember applications
    for the Ember-Data store. Accepts an optional namespace argument.
  
    @method initializeDebugAdapter
    @param {Ember.Registry} registry
  */
  function initializeDebugAdapter(registry) {
    registry.register('data-adapter:main', _emberDataPrivateSystemDebugDebugAdapter["default"]);
  }
});
define('ember-data/-private/initializers/store-injections', ['exports'], function (exports) {
  'use strict';

  exports['default'] = initializeStoreInjections;

  /*
    Configures a registry with injections on Ember applications
    for the Ember-Data store. Accepts an optional namespace argument.
  
    @method initializeStoreInjections
    @param {Ember.Registry} registry
  */
  function initializeStoreInjections(registry) {
    // registry.injection for Ember < 2.1.0
    // application.inject for Ember 2.1.0+
    var inject = registry.inject || registry.injection;
    inject.call(registry, 'controller', 'store', 'service:store');
    inject.call(registry, 'route', 'store', 'service:store');
    inject.call(registry, 'data-adapter', 'store', 'service:store');
  }
});
define("ember-data/-private/initializers/store", ["exports", "ember-data/-private/system/store", "ember-data/-private/serializers", "ember-data/-private/adapters"], function (exports, _emberDataPrivateSystemStore, _emberDataPrivateSerializers, _emberDataPrivateAdapters) {
  "use strict";

  exports["default"] = initializeStore;

  function has(applicationOrRegistry, fullName) {
    if (applicationOrRegistry.has) {
      // < 2.1.0
      return applicationOrRegistry.has(fullName);
    } else {
      // 2.1.0+
      return applicationOrRegistry.hasRegistration(fullName);
    }
  }

  /*
    Configures a registry for use with an Ember-Data
    store. Accepts an optional namespace argument.
  
    @method initializeStore
    @param {Ember.Registry} registry
  */
  function initializeStore(registry) {
    // registry.optionsForType for Ember < 2.1.0
    // application.registerOptionsForType for Ember 2.1.0+
    var registerOptionsForType = registry.registerOptionsForType || registry.optionsForType;
    registerOptionsForType.call(registry, 'serializer', { singleton: false });
    registerOptionsForType.call(registry, 'adapter', { singleton: false });

    registry.register('serializer:-default', _emberDataPrivateSerializers.JSONSerializer);
    registry.register('serializer:-rest', _emberDataPrivateSerializers.RESTSerializer);
    registry.register('adapter:-rest', _emberDataPrivateAdapters.RESTAdapter);

    registry.register('adapter:-json-api', _emberDataPrivateAdapters.JSONAPIAdapter);
    registry.register('serializer:-json-api', _emberDataPrivateSerializers.JSONAPISerializer);

    if (!has(registry, 'service:store')) {
      registry.register('service:store', _emberDataPrivateSystemStore["default"]);
    }
  }
});
define('ember-data/-private/initializers/transforms', ['exports', 'ember-data/-private/transforms'], function (exports, _emberDataPrivateTransforms) {
  'use strict';

  exports['default'] = initializeTransforms;

  /*
    Configures a registry for use with Ember-Data
    transforms.
  
    @method initializeTransforms
    @param {Ember.Registry} registry
  */
  function initializeTransforms(registry) {
    registry.register('transform:boolean', _emberDataPrivateTransforms.BooleanTransform);
    registry.register('transform:date', _emberDataPrivateTransforms.DateTransform);
    registry.register('transform:number', _emberDataPrivateTransforms.NumberTransform);
    registry.register('transform:string', _emberDataPrivateTransforms.StringTransform);
  }
});
define('ember-data/-private/instance-initializers/initialize-store-service', ['exports'], function (exports) {
  'use strict';

  exports['default'] = initializeStoreService;

  /*
   Configures a registry for use with an Ember-Data
   store.
  
   @method initializeStoreService
   @param {Ember.ApplicationInstance} applicationOrRegistry
   */
  function initializeStoreService(application) {
    var container = application.lookup ? application : application.container;
    // Eagerly generate the store so defaultStore is populated.
    container.lookup('service:store');
  }
});
define("ember-data/-private/serializers", ["exports", "ember-data/serializers/json-api", "ember-data/serializers/json", "ember-data/serializers/rest"], function (exports, _emberDataSerializersJsonApi, _emberDataSerializersJson, _emberDataSerializersRest) {
  /**
    @module ember-data
  */

  "use strict";

  exports.JSONAPISerializer = _emberDataSerializersJsonApi["default"];
  exports.JSONSerializer = _emberDataSerializersJson["default"];
  exports.RESTSerializer = _emberDataSerializersRest["default"];
});
define("ember-data/-private/system/clone-null", ["exports", "ember-data/-private/system/empty-object"], function (exports, _emberDataPrivateSystemEmptyObject) {
  "use strict";

  exports["default"] = cloneNull;

  function cloneNull(source) {
    var clone = new _emberDataPrivateSystemEmptyObject["default"]();
    for (var key in source) {
      clone[key] = source[key];
    }
    return clone;
  }
});
define('ember-data/-private/system/coerce-id', ['exports'], function (exports) {
  'use strict';

  exports['default'] = coerceId;

  // Used by the store to normalize IDs entering the store.  Despite the fact
  // that developers may provide IDs as numbers (e.g., `store.findRecord('person', 1)`),
  // it is important that internally we use strings, since IDs may be serialized
  // and lose type information.  For example, Ember's router may put a record's
  // ID into the URL, and if we later try to deserialize that URL and find the
  // corresponding record, we will not know if it is a string or a number.

  function coerceId(id) {
    return id === null || id === undefined || id === '' ? null : id + '';
  }
});
define("ember-data/-private/system/debug", ["exports", "ember-data/-private/system/debug/debug-adapter"], function (exports, _emberDataPrivateSystemDebugDebugAdapter) {
  /**
    @module ember-data
  */

  "use strict";

  exports["default"] = _emberDataPrivateSystemDebugDebugAdapter["default"];
});
define('ember-data/-private/system/debug/debug-adapter', ['exports', 'ember', 'ember-data/model'], function (exports, _ember, _emberDataModel) {
  /**
    @module ember-data
  */
  'use strict';

  var get = _ember['default'].get;
  var capitalize = _ember['default'].String.capitalize;
  var underscore = _ember['default'].String.underscore;
  var assert = _ember['default'].assert;

  /*
    Extend `Ember.DataAdapter` with ED specific code.
  
    @class DebugAdapter
    @namespace DS
    @extends Ember.DataAdapter
    @private
  */
  exports['default'] = _ember['default'].DataAdapter.extend({
    getFilters: function getFilters() {
      return [{ name: 'isNew', desc: 'New' }, { name: 'isModified', desc: 'Modified' }, { name: 'isClean', desc: 'Clean' }];
    },

    detect: function detect(typeClass) {
      return typeClass !== _emberDataModel['default'] && _emberDataModel['default'].detect(typeClass);
    },

    columnsForType: function columnsForType(typeClass) {
      var columns = [{
        name: 'id',
        desc: 'Id'
      }];
      var count = 0;
      var self = this;
      get(typeClass, 'attributes').forEach(function (meta, name) {
        if (count++ > self.attributeLimit) {
          return false;
        }
        var desc = capitalize(underscore(name).replace('_', ' '));
        columns.push({ name: name, desc: desc });
      });
      return columns;
    },

    getRecords: function getRecords(modelClass, modelName) {
      if (arguments.length < 2) {
        // Legacy Ember.js < 1.13 support
        var containerKey = modelClass._debugContainerKey;
        if (containerKey) {
          var match = containerKey.match(/model:(.*)/);
          if (match) {
            modelName = match[1];
          }
        }
      }
      assert("Cannot find model name. Please upgrade to Ember.js >= 1.13 for Ember Inspector support", !!modelName);
      return this.get('store').peekAll(modelName);
    },

    getRecordColumnValues: function getRecordColumnValues(record) {
      var _this = this;

      var count = 0;
      var columnValues = { id: get(record, 'id') };

      record.eachAttribute(function (key) {
        if (count++ > _this.attributeLimit) {
          return false;
        }
        var value = get(record, key);
        columnValues[key] = value;
      });
      return columnValues;
    },

    getRecordKeywords: function getRecordKeywords(record) {
      var keywords = [];
      var keys = _ember['default'].A(['id']);
      record.eachAttribute(function (key) {
        return keys.push(key);
      });
      keys.forEach(function (key) {
        return keywords.push(get(record, key));
      });
      return keywords;
    },

    getRecordFilterValues: function getRecordFilterValues(record) {
      return {
        isNew: record.get('isNew'),
        isModified: record.get('hasDirtyAttributes') && !record.get('isNew'),
        isClean: !record.get('hasDirtyAttributes')
      };
    },

    getRecordColor: function getRecordColor(record) {
      var color = 'black';
      if (record.get('isNew')) {
        color = 'green';
      } else if (record.get('hasDirtyAttributes')) {
        color = 'blue';
      }
      return color;
    },

    observeRecord: function observeRecord(record, recordUpdated) {
      var releaseMethods = _ember['default'].A();
      var keysToObserve = _ember['default'].A(['id', 'isNew', 'hasDirtyAttributes']);

      record.eachAttribute(function (key) {
        return keysToObserve.push(key);
      });
      var adapter = this;

      keysToObserve.forEach(function (key) {
        var handler = function handler() {
          recordUpdated(adapter.wrapRecord(record));
        };
        _ember['default'].addObserver(record, key, handler);
        releaseMethods.push(function () {
          _ember['default'].removeObserver(record, key, handler);
        });
      });

      var release = function release() {
        releaseMethods.forEach(function (fn) {
          return fn();
        });
      };

      return release;
    }
  });
});
define('ember-data/-private/system/debug/debug-info', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  exports['default'] = _ember['default'].Mixin.create({

    /**
      Provides info about the model for debugging purposes
      by grouping the properties into more semantic groups.
       Meant to be used by debugging tools such as the Chrome Ember Extension.
       - Groups all attributes in "Attributes" group.
      - Groups all belongsTo relationships in "Belongs To" group.
      - Groups all hasMany relationships in "Has Many" group.
      - Groups all flags in "Flags" group.
      - Flags relationship CPs as expensive properties.
       @method _debugInfo
      @for DS.Model
      @private
    */
    _debugInfo: function _debugInfo() {
      var attributes = ['id'];
      var relationships = { belongsTo: [], hasMany: [] };
      var expensiveProperties = [];

      this.eachAttribute(function (name, meta) {
        return attributes.push(name);
      });

      this.eachRelationship(function (name, relationship) {
        relationships[relationship.kind].push(name);
        expensiveProperties.push(name);
      });

      var groups = [{
        name: 'Attributes',
        properties: attributes,
        expand: true
      }, {
        name: 'Belongs To',
        properties: relationships.belongsTo,
        expand: true
      }, {
        name: 'Has Many',
        properties: relationships.hasMany,
        expand: true
      }, {
        name: 'Flags',
        properties: ['isLoaded', 'hasDirtyAttributes', 'isSaving', 'isDeleted', 'isError', 'isNew', 'isValid']
      }];

      return {
        propertyInfo: {
          // include all other mixins / properties (not just the grouped ones)
          includeOtherProperties: true,
          groups: groups,
          // don't pre-calculate unless cached
          expensiveProperties: expensiveProperties
        }
      };
    }
  });
});
define("ember-data/-private/system/empty-object", ["exports"], function (exports) {
  "use strict";

  exports["default"] = EmptyObject;

  // This exists because `Object.create(null)` is absurdly slow compared
  // to `new EmptyObject()`. In either case, you want a null prototype
  // when you're treating the object instances as arbitrary dictionaries
  // and don't want your keys colliding with build-in methods on the
  // default object prototype.
  var proto = Object.create(null, {
    // without this, we will always still end up with (new
    // EmptyObject()).constructor === Object
    constructor: {
      value: undefined,
      enumerable: false,
      writable: true
    }
  });
  function EmptyObject() {}

  EmptyObject.prototype = proto;
});
define('ember-data/-private/system/is-array-like', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  exports['default'] = isArrayLike;

  /*
    We're using this to detect arrays and "array-like" objects.
  
    This is a copy of the `isArray` method found in `ember-runtime/utils` as we're
    currently unable to import non-exposed modules.
  
    This method was previously exposed as `Ember.isArray` but since
    https://github.com/emberjs/ember.js/pull/11463 `Ember.isArray` is an alias of
    `Array.isArray` hence removing the "array-like" part.
   */
  function isArrayLike(obj) {
    if (!obj || obj.setInterval) {
      return false;
    }
    if (Array.isArray(obj)) {
      return true;
    }
    if (_ember['default'].Array.detect(obj)) {
      return true;
    }

    var type = _ember['default'].typeOf(obj);
    if ('array' === type) {
      return true;
    }
    if (obj.length !== undefined && 'object' === type) {
      return true;
    }
    return false;
  }
});
define("ember-data/-private/system/many-array", ["exports", "ember", "ember-data/-private/debug", "ember-data/-private/system/promise-proxies", "ember-data/-private/system/store/common"], function (exports, _ember, _emberDataPrivateDebug, _emberDataPrivateSystemPromiseProxies, _emberDataPrivateSystemStoreCommon) {
  /**
    @module ember-data
  */
  "use strict";

  var get = _ember["default"].get;
  var set = _ember["default"].set;

  /**
    A `ManyArray` is a `MutableArray` that represents the contents of a has-many
    relationship.
  
    The `ManyArray` is instantiated lazily the first time the relationship is
    requested.
  
    ### Inverses
  
    Often, the relationships in Ember Data applications will have
    an inverse. For example, imagine the following models are
    defined:
  
    ```app/models/post.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      comments: DS.hasMany('comment')
    });
    ```
  
    ```app/models/comment.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      post: DS.belongsTo('post')
    });
    ```
  
    If you created a new instance of `App.Post` and added
    a `App.Comment` record to its `comments` has-many
    relationship, you would expect the comment's `post`
    property to be set to the post that contained
    the has-many.
  
    We call the record to which a relationship belongs the
    relationship's _owner_.
  
    @class ManyArray
    @namespace DS
    @extends Ember.Object
    @uses Ember.MutableArray, Ember.Evented
  */
  exports["default"] = _ember["default"].Object.extend(_ember["default"].MutableArray, _ember["default"].Evented, {
    init: function init() {
      this._super.apply(this, arguments);
      this.currentState = _ember["default"].A([]);
    },

    record: null,

    canonicalState: null,
    currentState: null,

    length: 0,

    objectAt: function objectAt(index) {
      //Ember observers such as 'firstObject', 'lastObject' might do out of bounds accesses
      if (!this.currentState[index]) {
        return undefined;
      }
      return this.currentState[index].getRecord();
    },

    flushCanonical: function flushCanonical() {
      //TODO make this smarter, currently its plenty stupid
      var toSet = this.canonicalState.filter(function (internalModel) {
        return !internalModel.isDeleted();
      });

      //a hack for not removing new records
      //TODO remove once we have proper diffing
      var newRecords = this.currentState.filter(
      // only add new records which are not yet in the canonical state of this
      // relationship (a new record can be in the canonical state if it has
      function (internalModel) {
        return internalModel.isNew() && toSet.indexOf(internalModel) === -1;
      });
      toSet = toSet.concat(newRecords);
      var oldLength = this.length;
      this.arrayContentWillChange(0, this.length, toSet.length);
      // It’s possible the parent side of the relationship may have been unloaded by this point
      if ((0, _emberDataPrivateSystemStoreCommon._objectIsAlive)(this)) {
        this.set('length', toSet.length);
      }
      this.currentState = toSet;
      this.arrayContentDidChange(0, oldLength, this.length);
      //TODO Figure out to notify only on additions and maybe only if unloaded
      this.relationship.notifyHasManyChanged();
      this.record.updateRecordArrays();
    },
    /**
      `true` if the relationship is polymorphic, `false` otherwise.
       @property {Boolean} isPolymorphic
      @private
    */
    isPolymorphic: false,

    /**
      The loading state of this array
       @property {Boolean} isLoaded
    */
    isLoaded: false,

    /**
      The relationship which manages this array.
       @property {ManyRelationship} relationship
      @private
    */
    relationship: null,

    /**
      Metadata associated with the request for async hasMany relationships.
       Example
       Given that the server returns the following JSON payload when fetching a
      hasMany relationship:
       ```js
      {
        "comments": [{
          "id": 1,
          "comment": "This is the first comment",
        }, {
          // ...
        }],
         "meta": {
          "page": 1,
          "total": 5
        }
      }
      ```
       You can then access the metadata via the `meta` property:
       ```js
      post.get('comments').then(function(comments) {
        var meta = comments.get('meta');
         // meta.page => 1
        // meta.total => 5
      });
      ```
       @property {Object} meta
      @public
    */
    meta: null,

    internalReplace: function internalReplace(idx, amt, objects) {
      if (!objects) {
        objects = [];
      }
      this.arrayContentWillChange(idx, amt, objects.length);
      this.currentState.splice.apply(this.currentState, [idx, amt].concat(objects));
      this.set('length', this.currentState.length);
      this.arrayContentDidChange(idx, amt, objects.length);
      if (objects) {
        //TODO(Igor) probably needed only for unloaded records
        this.relationship.notifyHasManyChanged();
      }
      this.record.updateRecordArrays();
    },

    //TODO(Igor) optimize
    internalRemoveRecords: function internalRemoveRecords(records) {
      var index;
      for (var i = 0; i < records.length; i++) {
        index = this.currentState.indexOf(records[i]);
        this.internalReplace(index, 1);
      }
    },

    //TODO(Igor) optimize
    internalAddRecords: function internalAddRecords(records, idx) {
      if (idx === undefined) {
        idx = this.currentState.length;
      }
      this.internalReplace(idx, 0, records);
    },

    replace: function replace(idx, amt, objects) {
      var records;
      if (amt > 0) {
        records = this.currentState.slice(idx, idx + amt);
        this.get('relationship').removeRecords(records);
      }
      if (objects) {
        this.get('relationship').addRecords(objects.map(function (obj) {
          return obj._internalModel;
        }), idx);
      }
    },
    /**
      Used for async `hasMany` arrays
      to keep track of when they will resolve.
       @property {Ember.RSVP.Promise} promise
      @private
    */
    promise: null,

    /**
      @method loadingRecordsCount
      @param {Number} count
      @private
    */
    loadingRecordsCount: function loadingRecordsCount(count) {
      this.loadingRecordsCount = count;
    },

    /**
      @method loadedRecord
      @private
    */
    loadedRecord: function loadedRecord() {
      this.loadingRecordsCount--;
      if (this.loadingRecordsCount === 0) {
        set(this, 'isLoaded', true);
        this.trigger('didLoad');
      }
    },

    /**
      @method reload
      @public
    */
    reload: function reload() {
      return this.relationship.reload();
    },

    /**
      Saves all of the records in the `ManyArray`.
       Example
       ```javascript
      store.findRecord('inbox', 1).then(function(inbox) {
        inbox.get('messages').then(function(messages) {
          messages.forEach(function(message) {
            message.set('isRead', true);
          });
          messages.save()
        });
      });
      ```
       @method save
      @return {DS.PromiseArray} promise
    */
    save: function save() {
      var manyArray = this;
      var promiseLabel = "DS: ManyArray#save " + get(this, 'type');
      var promise = _ember["default"].RSVP.all(this.invoke("save"), promiseLabel).then(function (array) {
        return manyArray;
      }, null, "DS: ManyArray#save return ManyArray");

      return _emberDataPrivateSystemPromiseProxies.PromiseArray.create({ promise: promise });
    },

    /**
      Create a child record within the owner
       @method createRecord
      @private
      @param {Object} hash
      @return {DS.Model} record
    */
    createRecord: function createRecord(hash) {
      var store = get(this, 'store');
      var type = get(this, 'type');
      var record;

      (0, _emberDataPrivateDebug.assert)("You cannot add '" + type.modelName + "' records to this polymorphic relationship.", !get(this, 'isPolymorphic'));
      record = store.createRecord(type.modelName, hash);
      this.pushObject(record);

      return record;
    }
  });
});
// been 'acknowleged' to be in the relationship via a store.push)
define("ember-data/-private/system/model", ["exports", "ember-data/-private/system/model/model", "ember-data/attr", "ember-data/-private/system/model/states", "ember-data/-private/system/model/errors"], function (exports, _emberDataPrivateSystemModelModel, _emberDataAttr, _emberDataPrivateSystemModelStates, _emberDataPrivateSystemModelErrors) {
  /**
    @module ember-data
  */

  "use strict";

  exports.RootState = _emberDataPrivateSystemModelStates["default"];
  exports.attr = _emberDataAttr["default"];
  exports.Errors = _emberDataPrivateSystemModelErrors["default"];
  exports["default"] = _emberDataPrivateSystemModelModel["default"];
});
define("ember-data/-private/system/model/attr", ["exports", "ember", "ember-data/-private/debug"], function (exports, _ember, _emberDataPrivateDebug) {
  "use strict";

  var get = _ember["default"].get;
  var Map = _ember["default"].Map;

  /**
    @module ember-data
  */

  /**
    @class Model
    @namespace DS
  */

  var AttrClassMethodsMixin = _ember["default"].Mixin.create({
    /**
      A map whose keys are the attributes of the model (properties
      described by DS.attr) and whose values are the meta object for the
      property.
       Example
       ```app/models/person.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        firstName: attr('string'),
        lastName: attr('string'),
        birthday: attr('date')
      });
      ```
       ```javascript
      import Ember from 'ember';
      import Person from 'app/models/person';
       var attributes = Ember.get(Person, 'attributes')
       attributes.forEach(function(meta, name) {
        console.log(name, meta);
      });
       // prints:
      // firstName {type: "string", isAttribute: true, options: Object, parentType: function, name: "firstName"}
      // lastName {type: "string", isAttribute: true, options: Object, parentType: function, name: "lastName"}
      // birthday {type: "date", isAttribute: true, options: Object, parentType: function, name: "birthday"}
      ```
       @property attributes
      @static
      @type {Ember.Map}
      @readOnly
    */
    attributes: _ember["default"].computed(function () {
      var _this = this;

      var map = Map.create();

      this.eachComputedProperty(function (name, meta) {
        if (meta.isAttribute) {
          (0, _emberDataPrivateDebug.assert)("You may not set `id` as an attribute on your model. Please remove any lines that look like: `id: DS.attr('<type>')` from " + _this.toString(), name !== 'id');

          meta.name = name;
          map.set(name, meta);
        }
      });

      return map;
    }).readOnly(),

    /**
      A map whose keys are the attributes of the model (properties
      described by DS.attr) and whose values are type of transformation
      applied to each attribute. This map does not include any
      attributes that do not have an transformation type.
       Example
       ```app/models/person.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        firstName: attr(),
        lastName: attr('string'),
        birthday: attr('date')
      });
      ```
       ```javascript
      import Ember from 'ember';
      import Person from 'app/models/person';
       var transformedAttributes = Ember.get(Person, 'transformedAttributes')
       transformedAttributes.forEach(function(field, type) {
        console.log(field, type);
      });
       // prints:
      // lastName string
      // birthday date
      ```
       @property transformedAttributes
      @static
      @type {Ember.Map}
      @readOnly
    */
    transformedAttributes: _ember["default"].computed(function () {
      var map = Map.create();

      this.eachAttribute(function (key, meta) {
        if (meta.type) {
          map.set(key, meta.type);
        }
      });

      return map;
    }).readOnly(),

    /**
      Iterates through the attributes of the model, calling the passed function on each
      attribute.
       The callback method you provide should have the following signature (all
      parameters are optional):
       ```javascript
      function(name, meta);
      ```
       - `name` the name of the current property in the iteration
      - `meta` the meta object for the attribute property in the iteration
       Note that in addition to a callback, you can also pass an optional target
      object that will be set as `this` on the context.
       Example
       ```javascript
      import DS from 'ember-data';
       var Person = DS.Model.extend({
        firstName: attr('string'),
        lastName: attr('string'),
        birthday: attr('date')
      });
       Person.eachAttribute(function(name, meta) {
        console.log(name, meta);
      });
       // prints:
      // firstName {type: "string", isAttribute: true, options: Object, parentType: function, name: "firstName"}
      // lastName {type: "string", isAttribute: true, options: Object, parentType: function, name: "lastName"}
      // birthday {type: "date", isAttribute: true, options: Object, parentType: function, name: "birthday"}
     ```
       @method eachAttribute
      @param {Function} callback The callback to execute
      @param {Object} [binding] the value to which the callback's `this` should be bound
      @static
    */
    eachAttribute: function eachAttribute(callback, binding) {
      get(this, 'attributes').forEach(function (meta, name) {
        callback.call(binding, name, meta);
      });
    },

    /**
      Iterates through the transformedAttributes of the model, calling
      the passed function on each attribute. Note the callback will not be
      called for any attributes that do not have an transformation type.
       The callback method you provide should have the following signature (all
      parameters are optional):
       ```javascript
      function(name, type);
      ```
       - `name` the name of the current property in the iteration
      - `type` a string containing the name of the type of transformed
        applied to the attribute
       Note that in addition to a callback, you can also pass an optional target
      object that will be set as `this` on the context.
       Example
       ```javascript
      import DS from 'ember-data';
       var Person = DS.Model.extend({
        firstName: attr(),
        lastName: attr('string'),
        birthday: attr('date')
      });
       Person.eachTransformedAttribute(function(name, type) {
        console.log(name, type);
      });
       // prints:
      // lastName string
      // birthday date
     ```
       @method eachTransformedAttribute
      @param {Function} callback The callback to execute
      @param {Object} [binding] the value to which the callback's `this` should be bound
      @static
    */
    eachTransformedAttribute: function eachTransformedAttribute(callback, binding) {
      get(this, 'transformedAttributes').forEach(function (type, name) {
        callback.call(binding, name, type);
      });
    }
  });

  exports.AttrClassMethodsMixin = AttrClassMethodsMixin;

  var AttrInstanceMethodsMixin = _ember["default"].Mixin.create({
    eachAttribute: function eachAttribute(callback, binding) {
      this.constructor.eachAttribute(callback, binding);
    }
  });
  exports.AttrInstanceMethodsMixin = AttrInstanceMethodsMixin;
});
define('ember-data/-private/system/model/errors', ['exports', 'ember', 'ember-data/-private/debug'], function (exports, _ember, _emberDataPrivateDebug) {
  'use strict';

  var get = _ember['default'].get;
  var set = _ember['default'].set;
  var isEmpty = _ember['default'].isEmpty;
  var makeArray = _ember['default'].makeArray;

  var MapWithDefault = _ember['default'].MapWithDefault;

  /**
  @module ember-data
  */

  /**
    Holds validation errors for a given record, organized by attribute names.
  
    Every `DS.Model` has an `errors` property that is an instance of
    `DS.Errors`. This can be used to display validation error
    messages returned from the server when a `record.save()` rejects.
  
    For Example, if you had a `User` model that looked like this:
  
    ```app/models/user.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      username: attr('string'),
      email: attr('string')
    });
    ```
    And you attempted to save a record that did not validate on the backend:
  
    ```javascript
    var user = store.createRecord('user', {
      username: 'tomster',
      email: 'invalidEmail'
    });
    user.save();
    ```
  
    Your backend would be expected to return an error response that described
    the problem, so that error messages can be generated on the app.
  
    API responses will be translated into instances of `DS.Errors` differently,
    depending on the specific combination of adapter and serializer used. You
    may want to check the documentation or the source code of the libraries
    that you are using, to know how they expect errors to be communicated.
  
    Errors can be displayed to the user by accessing their property name
    to get an array of all the error objects for that property. Each
    error object is a JavaScript object with two keys:
  
    - `message` A string containing the error message from the backend
    - `attribute` The name of the property associated with this error message
  
    ```handlebars
    <label>Username: {{input value=username}} </label>
    {{#each model.errors.username as |error|}}
      <div class="error">
        {{error.message}}
      </div>
    {{/each}}
  
    <label>Email: {{input value=email}} </label>
    {{#each model.errors.email as |error|}}
      <div class="error">
        {{error.message}}
      </div>
    {{/each}}
    ```
  
    You can also access the special `messages` property on the error
    object to get an array of all the error strings.
  
    ```handlebars
    {{#each model.errors.messages as |message|}}
      <div class="error">
        {{message}}
      </div>
    {{/each}}
    ```
  
    @class Errors
    @namespace DS
    @extends Ember.Object
    @uses Ember.Enumerable
    @uses Ember.Evented
   */
  exports['default'] = _ember['default'].ArrayProxy.extend(_ember['default'].Evented, {
    /**
      Register with target handler
       @method registerHandlers
      @param {Object} target
      @param {Function} becameInvalid
      @param {Function} becameValid
      @deprecated
    */
    registerHandlers: function registerHandlers(target, becameInvalid, becameValid) {
      (0, _emberDataPrivateDebug.deprecate)('Record errors will no longer be evented.', false, {
        id: 'ds.errors.registerHandlers',
        until: '3.0.0'
      });

      this._registerHandlers(target, becameInvalid, becameValid);
    },

    /**
      Register with target handler
       @method _registerHandlers
      @private
    */
    _registerHandlers: function _registerHandlers(target, becameInvalid, becameValid) {
      this.on('becameInvalid', target, becameInvalid);
      this.on('becameValid', target, becameValid);
    },

    /**
      @property errorsByAttributeName
      @type {Ember.MapWithDefault}
      @private
    */
    errorsByAttributeName: _ember['default'].computed(function () {
      return MapWithDefault.create({
        defaultValue: function defaultValue() {
          return _ember['default'].A();
        }
      });
    }),

    /**
      Returns errors for a given attribute
       ```javascript
      var user = store.createRecord('user', {
        username: 'tomster',
        email: 'invalidEmail'
      });
      user.save().catch(function(){
        user.get('errors').errorsFor('email'); // returns:
        // [{attribute: "email", message: "Doesn't look like a valid email."}]
      });
      ```
       @method errorsFor
      @param {String} attribute
      @return {Array}
    */
    errorsFor: function errorsFor(attribute) {
      return get(this, 'errorsByAttributeName').get(attribute);
    },

    /**
      An array containing all of the error messages for this
      record. This is useful for displaying all errors to the user.
       ```handlebars
      {{#each model.errors.messages as |message|}}
        <div class="error">
          {{message}}
        </div>
      {{/each}}
      ```
       @property messages
      @type {Array}
    */
    messages: _ember['default'].computed.mapBy('content', 'message'),

    /**
      @property content
      @type {Array}
      @private
    */
    content: _ember['default'].computed(function () {
      return _ember['default'].A();
    }),

    /**
      @method unknownProperty
      @private
    */
    unknownProperty: function unknownProperty(attribute) {
      var errors = this.errorsFor(attribute);
      if (isEmpty(errors)) {
        return null;
      }
      return errors;
    },

    /**
      Total number of errors.
       @property length
      @type {Number}
      @readOnly
    */

    /**
      @property isEmpty
      @type {Boolean}
      @readOnly
    */
    isEmpty: _ember['default'].computed.not('length').readOnly(),

    /**
      Adds error messages to a given attribute and sends
      `becameInvalid` event to the record.
       Example:
       ```javascript
      if (!user.get('username') {
        user.get('errors').add('username', 'This field is required');
      }
      ```
       @method add
      @param {String} attribute
      @param {(Array|String)} messages
      @deprecated
    */
    add: function add(attribute, messages) {
      (0, _emberDataPrivateDebug.warn)('Interacting with a record errors object will no longer change the record state.', false, {
        id: 'ds.errors.add'
      });

      var wasEmpty = get(this, 'isEmpty');

      this._add(attribute, messages);

      if (wasEmpty && !get(this, 'isEmpty')) {
        this.trigger('becameInvalid');
      }
    },

    /**
      Adds error messages to a given attribute without sending event.
       @method _add
      @private
    */
    _add: function _add(attribute, messages) {
      messages = this._findOrCreateMessages(attribute, messages);
      this.addObjects(messages);
      get(this, 'errorsByAttributeName').get(attribute).addObjects(messages);

      this.notifyPropertyChange(attribute);
    },

    /**
      @method _findOrCreateMessages
      @private
    */
    _findOrCreateMessages: function _findOrCreateMessages(attribute, messages) {
      var errors = this.errorsFor(attribute);
      var messagesArray = makeArray(messages);
      var _messages = new Array(messagesArray.length);

      for (var i = 0; i < messagesArray.length; i++) {
        var message = messagesArray[i];
        var err = errors.findBy('message', message);
        if (err) {
          _messages[i] = err;
        } else {
          _messages[i] = {
            attribute: attribute,
            message: message
          };
        }
      }

      return _messages;
    },

    /**
      Removes all error messages from the given attribute and sends
      `becameValid` event to the record if there no more errors left.
       Example:
       ```app/models/user.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        email: DS.attr('string'),
        twoFactorAuth: DS.attr('boolean'),
        phone: DS.attr('string')
      });
      ```
       ```app/routes/user/edit.js
      import Ember from 'ember';
       export default Ember.Route.extend({
        actions: {
          save: function(user) {
             if (!user.get('twoFactorAuth')) {
               user.get('errors').remove('phone');
             }
             user.save();
           }
        }
      });
      ```
       @method remove
      @param {String} attribute
      @deprecated
    */
    remove: function remove(attribute) {
      (0, _emberDataPrivateDebug.warn)('Interacting with a record errors object will no longer change the record state.', false, {
        id: 'ds.errors.remove'
      });

      if (get(this, 'isEmpty')) {
        return;
      }

      this._remove(attribute);

      if (get(this, 'isEmpty')) {
        this.trigger('becameValid');
      }
    },

    /**
      Removes all error messages from the given attribute without sending event.
       @method _remove
      @private
    */
    _remove: function _remove(attribute) {
      if (get(this, 'isEmpty')) {
        return;
      }

      var content = this.rejectBy('attribute', attribute);
      set(this, 'content', content);
      get(this, 'errorsByAttributeName')['delete'](attribute);

      this.notifyPropertyChange(attribute);
    },

    /**
      Removes all error messages and sends `becameValid` event
      to the record.
       Example:
       ```app/routes/user/edit.js
      import Ember from 'ember';
       export default Ember.Route.extend({
        actions: {
          retrySave: function(user) {
             user.get('errors').clear();
             user.save();
           }
        }
      });
      ```
       @method clear
      @deprecated
    */
    clear: function clear() {
      (0, _emberDataPrivateDebug.warn)('Interacting with a record errors object will no longer change the record state.', false, {
        id: 'ds.errors.clear'
      });

      if (get(this, 'isEmpty')) {
        return;
      }

      this._clear();
      this.trigger('becameValid');
    },

    /**
      Removes all error messages.
      to the record.
       @method _clear
      @private
    */
    _clear: function _clear() {
      if (get(this, 'isEmpty')) {
        return;
      }

      var errorsByAttributeName = get(this, 'errorsByAttributeName');
      var attributes = _ember['default'].A();

      errorsByAttributeName.forEach(function (_, attribute) {
        attributes.push(attribute);
      });

      errorsByAttributeName.clear();
      attributes.forEach(function (attribute) {
        this.notifyPropertyChange(attribute);
      }, this);

      _ember['default'].ArrayProxy.prototype.clear.call(this);
    },

    /**
      Checks if there is error messages for the given attribute.
       ```app/routes/user/edit.js
      import Ember from 'ember';
       export default Ember.Route.extend({
        actions: {
          save: function(user) {
             if (user.get('errors').has('email')) {
               return alert('Please update your email before attempting to save.');
             }
             user.save();
           }
        }
      });
      ```
       @method has
      @param {String} attribute
      @return {Boolean} true if there some errors on given attribute
    */
    has: function has(attribute) {
      return !isEmpty(this.errorsFor(attribute));
    }
  });
});
define("ember-data/-private/system/model/internal-model", ["exports", "ember", "ember-data/-private/debug", "ember-data/-private/system/model/states", "ember-data/-private/system/relationships/state/create", "ember-data/-private/system/snapshot", "ember-data/-private/system/empty-object", "ember-data/-private/features", "ember-data/-private/utils", "ember-data/-private/system/references"], function (exports, _ember, _emberDataPrivateDebug, _emberDataPrivateSystemModelStates, _emberDataPrivateSystemRelationshipsStateCreate, _emberDataPrivateSystemSnapshot, _emberDataPrivateSystemEmptyObject, _emberDataPrivateFeatures, _emberDataPrivateUtils, _emberDataPrivateSystemReferences) {
  "use strict";

  exports["default"] = InternalModel;

  var Promise = _ember["default"].RSVP.Promise;
  var get = _ember["default"].get;
  var set = _ember["default"].set;
  var copy = _ember["default"].copy;
  var assign = _ember["default"].assign || _ember["default"].merge;

  var _extractPivotNameCache = new _emberDataPrivateSystemEmptyObject["default"]();
  var _splitOnDotCache = new _emberDataPrivateSystemEmptyObject["default"]();

  function splitOnDot(name) {
    return _splitOnDotCache[name] || (_splitOnDotCache[name] = name.split('.'));
  }

  function extractPivotName(name) {
    return _extractPivotNameCache[name] || (_extractPivotNameCache[name] = splitOnDot(name)[0]);
  }

  function retrieveFromCurrentState(key) {
    return function () {
      return get(this.currentState, key);
    };
  }

  // this (and all heimdall instrumentation) will be stripped by a babel transform
  //  https://github.com/heimdalljs/babel5-plugin-strip-heimdall

  /*
    `InternalModel` is the Model class that we use internally inside Ember Data to represent models.
    Internal ED methods should only deal with `InternalModel` objects. It is a fast, plain Javascript class.
  
    We expose `DS.Model` to application code, by materializing a `DS.Model` from `InternalModel` lazily, as
    a performance optimization.
  
    `InternalModel` should never be exposed to application code. At the boundaries of the system, in places
    like `find`, `push`, etc. we convert between Models and InternalModels.
  
    We need to make sure that the properties from `InternalModel` are correctly exposed/proxied on `Model`
    if they are needed.
  
    @private
    @class InternalModel
  */
  function InternalModel(type, id, store, _, data) {
    this.type = type;
    this.id = id;
    this.store = store;
    this._data = data || new _emberDataPrivateSystemEmptyObject["default"]();
    this.modelName = type.modelName;
    this.dataHasInitialized = false;
    //Look into making this lazy
    this._deferredTriggers = [];
    this._attributes = new _emberDataPrivateSystemEmptyObject["default"]();
    this._inFlightAttributes = new _emberDataPrivateSystemEmptyObject["default"]();
    this._relationships = new _emberDataPrivateSystemRelationshipsStateCreate["default"](this);
    this._recordArrays = undefined;
    this.currentState = _emberDataPrivateSystemModelStates["default"].empty;
    this.recordReference = new _emberDataPrivateSystemReferences.RecordReference(store, this);
    this.references = {};
    this.isReloading = false;
    this.isError = false;
    this.error = null;
    this.__ember_meta__ = null;
    this[_ember["default"].GUID_KEY] = _ember["default"].guidFor(this);
    /*
      implicit relationships are relationship which have not been declared but the inverse side exists on
      another record somewhere
      For example if there was
       ```app/models/comment.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        name: DS.attr()
      })
      ```
       but there is also
       ```app/models/post.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        name: DS.attr(),
        comments: DS.hasMany('comment')
      })
      ```
       would have a implicit post relationship in order to be do things like remove ourselves from the post
      when we are deleted
    */
    this._implicitRelationships = new _emberDataPrivateSystemEmptyObject["default"]();
  }

  InternalModel.prototype = {
    isEmpty: retrieveFromCurrentState('isEmpty'),
    isLoading: retrieveFromCurrentState('isLoading'),
    isLoaded: retrieveFromCurrentState('isLoaded'),
    hasDirtyAttributes: retrieveFromCurrentState('hasDirtyAttributes'),
    isSaving: retrieveFromCurrentState('isSaving'),
    isDeleted: retrieveFromCurrentState('isDeleted'),
    isNew: retrieveFromCurrentState('isNew'),
    isValid: retrieveFromCurrentState('isValid'),
    dirtyType: retrieveFromCurrentState('dirtyType'),

    constructor: InternalModel,
    materializeRecord: function materializeRecord() {
      (0, _emberDataPrivateDebug.assert)("Materialized " + this.modelName + " record with id:" + this.id + "more than once", this.record === null || this.record === undefined);

      // lookupFactory should really return an object that creates
      // instances with the injections applied
      var createOptions = {
        store: this.store,
        _internalModel: this,
        id: this.id,
        currentState: get(this, 'currentState'),
        isError: this.isError,
        adapterError: this.error
      };

      if (_ember["default"].setOwner) {
        // ensure that `Ember.getOwner(this)` works inside a model instance
        _ember["default"].setOwner(createOptions, (0, _emberDataPrivateUtils.getOwner)(this.store));
      } else {
        createOptions.container = this.store.container;
      }

      this.record = this.type._create(createOptions);

      this._triggerDeferredTriggers();
    },

    recordObjectWillDestroy: function recordObjectWillDestroy() {
      this.record = null;
    },

    deleteRecord: function deleteRecord() {
      this.send('deleteRecord');
    },

    save: function save(options) {
      var promiseLabel = "DS: Model#save " + this;
      var resolver = _ember["default"].RSVP.defer(promiseLabel);

      this.store.scheduleSave(this, resolver, options);
      return resolver.promise;
    },

    startedReloading: function startedReloading() {
      this.isReloading = true;
      if (this.record) {
        set(this.record, 'isReloading', true);
      }
    },

    finishedReloading: function finishedReloading() {
      this.isReloading = false;
      if (this.record) {
        set(this.record, 'isReloading', false);
      }
    },

    reload: function reload() {
      this.startedReloading();
      var record = this;
      var promiseLabel = "DS: Model#reload of " + this;
      return new Promise(function (resolve) {
        record.send('reloadRecord', resolve);
      }, promiseLabel).then(function () {
        record.didCleanError();
        return record;
      }, function (error) {
        record.didError(error);
        throw error;
      }, "DS: Model#reload complete, update flags")["finally"](function () {
        record.finishedReloading();
        record.updateRecordArrays();
      });
    },

    getRecord: function getRecord() {
      if (!this.record) {
        this.materializeRecord();
      }
      return this.record;
    },

    unloadRecord: function unloadRecord() {
      this.send('unloadRecord');
    },

    eachRelationship: function eachRelationship(callback, binding) {
      return this.type.eachRelationship(callback, binding);
    },

    eachAttribute: function eachAttribute(callback, binding) {
      return this.type.eachAttribute(callback, binding);
    },

    inverseFor: function inverseFor(key) {
      return this.type.inverseFor(key);
    },

    setupData: function setupData(data) {
      var changedKeys = this._changedKeys(data.attributes);
      assign(this._data, data.attributes);
      this.pushedData();
      if (this.record) {
        this.record._notifyProperties(changedKeys);
      }
      this.didInitializeData();
    },

    becameReady: function becameReady() {
      _ember["default"].run.schedule('actions', this.store.recordArrayManager, this.store.recordArrayManager.recordWasLoaded, this);
    },

    didInitializeData: function didInitializeData() {
      if (!this.dataHasInitialized) {
        this.becameReady();
        this.dataHasInitialized = true;
      }
    },

    destroy: function destroy() {
      if (this.record) {
        return this.record.destroy();
      }
    },

    /*
      @method createSnapshot
      @private
    */
    createSnapshot: function createSnapshot(options) {
      return new _emberDataPrivateSystemSnapshot["default"](this, options);
    },

    /*
      @method loadingData
      @private
      @param {Promise} promise
    */
    loadingData: function loadingData(promise) {
      this.send('loadingData', promise);
    },

    /*
      @method loadedData
      @private
    */
    loadedData: function loadedData() {
      this.send('loadedData');
      this.didInitializeData();
    },

    /*
      @method notFound
      @private
    */
    notFound: function notFound() {
      this.send('notFound');
    },

    /*
      @method pushedData
      @private
    */
    pushedData: function pushedData() {
      this.send('pushedData');
    },

    flushChangedAttributes: function flushChangedAttributes() {
      this._inFlightAttributes = this._attributes;
      this._attributes = new _emberDataPrivateSystemEmptyObject["default"]();
    },

    hasChangedAttributes: function hasChangedAttributes() {
      return Object.keys(this._attributes).length > 0;
    },

    /*
      Checks if the attributes which are considered as changed are still
      different to the state which is acknowledged by the server.
       This method is needed when data for the internal model is pushed and the
      pushed data might acknowledge dirty attributes as confirmed.
       @method updateChangedAttributes
      @private
     */
    updateChangedAttributes: function updateChangedAttributes() {
      var changedAttributes = this.changedAttributes();
      var changedAttributeNames = Object.keys(changedAttributes);

      for (var i = 0, _length = changedAttributeNames.length; i < _length; i++) {
        var attribute = changedAttributeNames[i];
        var data = changedAttributes[attribute];
        var oldData = data[0];
        var newData = data[1];

        if (oldData === newData) {
          delete this._attributes[attribute];
        }
      }
    },

    /*
      Returns an object, whose keys are changed properties, and value is an
      [oldProp, newProp] array.
       @method changedAttributes
      @private
    */
    changedAttributes: function changedAttributes() {
      var oldData = this._data;
      var currentData = this._attributes;
      var inFlightData = this._inFlightAttributes;
      var newData = assign(copy(inFlightData), currentData);
      var diffData = new _emberDataPrivateSystemEmptyObject["default"]();

      var newDataKeys = Object.keys(newData);

      for (var i = 0, _length2 = newDataKeys.length; i < _length2; i++) {
        var key = newDataKeys[i];
        diffData[key] = [oldData[key], newData[key]];
      }

      return diffData;
    },

    /*
      @method adapterWillCommit
      @private
    */
    adapterWillCommit: function adapterWillCommit() {
      this.send('willCommit');
    },

    /*
      @method adapterDidDirty
      @private
    */
    adapterDidDirty: function adapterDidDirty() {
      this.send('becomeDirty');
      this.updateRecordArraysLater();
    },

    /*
      @method send
      @private
      @param {String} name
      @param {Object} context
    */
    send: function send(name, context) {
      var currentState = get(this, 'currentState');

      if (!currentState[name]) {
        this._unhandledEvent(currentState, name, context);
      }

      return currentState[name](this, context);
    },

    notifyHasManyAdded: function notifyHasManyAdded(key, record, idx) {
      if (this.record) {
        this.record.notifyHasManyAdded(key, record, idx);
      }
    },

    notifyHasManyRemoved: function notifyHasManyRemoved(key, record, idx) {
      if (this.record) {
        this.record.notifyHasManyRemoved(key, record, idx);
      }
    },

    notifyBelongsToChanged: function notifyBelongsToChanged(key, record) {
      if (this.record) {
        this.record.notifyBelongsToChanged(key, record);
      }
    },

    notifyPropertyChange: function notifyPropertyChange(key) {
      if (this.record) {
        this.record.notifyPropertyChange(key);
      }
    },

    rollbackAttributes: function rollbackAttributes() {
      var dirtyKeys = Object.keys(this._attributes);

      this._attributes = new _emberDataPrivateSystemEmptyObject["default"]();

      if (get(this, 'isError')) {
        this._inFlightAttributes = new _emberDataPrivateSystemEmptyObject["default"]();
        this.didCleanError();
      }

      //Eventually rollback will always work for relationships
      //For now we support it only out of deleted state, because we
      //have an explicit way of knowing when the server acked the relationship change
      if (this.isDeleted()) {
        //TODO: Should probably move this to the state machine somehow
        this.becameReady();
      }

      if (this.isNew()) {
        this.clearRelationships();
      }

      if (this.isValid()) {
        this._inFlightAttributes = new _emberDataPrivateSystemEmptyObject["default"]();
      }

      this.send('rolledBack');

      this.record._notifyProperties(dirtyKeys);
    },

    /*
      @method transitionTo
      @private
      @param {String} name
    */
    transitionTo: function transitionTo(name) {
      // POSSIBLE TODO: Remove this code and replace with
      // always having direct reference to state objects

      var pivotName = extractPivotName(name);
      var currentState = get(this, 'currentState');
      var state = currentState;

      do {
        if (state.exit) {
          state.exit(this);
        }
        state = state.parentState;
      } while (!state.hasOwnProperty(pivotName));

      var path = splitOnDot(name);
      var setups = [];
      var enters = [];
      var i, l;

      for (i = 0, l = path.length; i < l; i++) {
        state = state[path[i]];

        if (state.enter) {
          enters.push(state);
        }
        if (state.setup) {
          setups.push(state);
        }
      }

      for (i = 0, l = enters.length; i < l; i++) {
        enters[i].enter(this);
      }

      set(this, 'currentState', state);
      //TODO Consider whether this is the best approach for keeping these two in sync
      if (this.record) {
        set(this.record, 'currentState', state);
      }

      for (i = 0, l = setups.length; i < l; i++) {
        setups[i].setup(this);
      }

      this.updateRecordArraysLater();
    },

    _unhandledEvent: function _unhandledEvent(state, name, context) {
      var errorMessage = "Attempted to handle event `" + name + "` ";
      errorMessage += "on " + String(this) + " while in state ";
      errorMessage += state.stateName + ". ";

      if (context !== undefined) {
        errorMessage += "Called with " + _ember["default"].inspect(context) + ".";
      }

      throw new _ember["default"].Error(errorMessage);
    },

    triggerLater: function triggerLater() {
      var length = arguments.length;
      var args = new Array(length);

      for (var i = 0; i < length; i++) {
        args[i] = arguments[i];
      }

      if (this._deferredTriggers.push(args) !== 1) {
        return;
      }
      _ember["default"].run.scheduleOnce('actions', this, '_triggerDeferredTriggers');
    },

    _triggerDeferredTriggers: function _triggerDeferredTriggers() {
      //TODO: Before 1.0 we want to remove all the events that happen on the pre materialized record,
      //but for now, we queue up all the events triggered before the record was materialized, and flush
      //them once we have the record
      if (!this.record) {
        return;
      }
      for (var i = 0, l = this._deferredTriggers.length; i < l; i++) {
        this.record.trigger.apply(this.record, this._deferredTriggers[i]);
      }

      this._deferredTriggers.length = 0;
    },
    /*
      @method clearRelationships
      @private
    */
    clearRelationships: function clearRelationships() {
      var _this = this;

      this.eachRelationship(function (name, relationship) {
        if (_this._relationships.has(name)) {
          var rel = _this._relationships.get(name);
          rel.clear();
          rel.destroy();
        }
      });
      Object.keys(this._implicitRelationships).forEach(function (key) {
        _this._implicitRelationships[key].clear();
        _this._implicitRelationships[key].destroy();
      });
    },

    /*
      When a find request is triggered on the store, the user can optionally pass in
      attributes and relationships to be preloaded. These are meant to behave as if they
      came back from the server, except the user obtained them out of band and is informing
      the store of their existence. The most common use case is for supporting client side
      nested URLs, such as `/posts/1/comments/2` so the user can do
      `store.findRecord('comment', 2, { preload: { post: 1 } })` without having to fetch the post.
       Preloaded data can be attributes and relationships passed in either as IDs or as actual
      models.
       @method _preloadData
      @private
      @param {Object} preload
    */
    _preloadData: function _preloadData(preload) {
      var _this2 = this;

      //TODO(Igor) consider the polymorphic case
      Object.keys(preload).forEach(function (key) {
        var preloadValue = get(preload, key);
        var relationshipMeta = _this2.type.metaForProperty(key);
        if (relationshipMeta.isRelationship) {
          _this2._preloadRelationship(key, preloadValue);
        } else {
          _this2._data[key] = preloadValue;
        }
      });
    },

    _preloadRelationship: function _preloadRelationship(key, preloadValue) {
      var relationshipMeta = this.type.metaForProperty(key);
      var type = relationshipMeta.type;
      if (relationshipMeta.kind === 'hasMany') {
        this._preloadHasMany(key, preloadValue, type);
      } else {
        this._preloadBelongsTo(key, preloadValue, type);
      }
    },

    _preloadHasMany: function _preloadHasMany(key, preloadValue, type) {
      (0, _emberDataPrivateDebug.assert)("You need to pass in an array to set a hasMany property on a record", Array.isArray(preloadValue));
      var recordsToSet = new Array(preloadValue.length);

      for (var i = 0; i < preloadValue.length; i++) {
        var recordToPush = preloadValue[i];
        recordsToSet[i] = this._convertStringOrNumberIntoInternalModel(recordToPush, type);
      }

      //We use the pathway of setting the hasMany as if it came from the adapter
      //because the user told us that they know this relationships exists already
      this._relationships.get(key).updateRecordsFromAdapter(recordsToSet);
    },

    _preloadBelongsTo: function _preloadBelongsTo(key, preloadValue, type) {
      var recordToSet = this._convertStringOrNumberIntoInternalModel(preloadValue, type);

      //We use the pathway of setting the hasMany as if it came from the adapter
      //because the user told us that they know this relationships exists already
      this._relationships.get(key).setRecord(recordToSet);
    },

    _convertStringOrNumberIntoInternalModel: function _convertStringOrNumberIntoInternalModel(value, type) {
      if (typeof value === 'string' || typeof value === 'number') {
        return this.store._internalModelForId(type, value);
      }
      if (value._internalModel) {
        return value._internalModel;
      }
      return value;
    },

    /*
      @method updateRecordArrays
      @private
    */
    updateRecordArrays: function updateRecordArrays() {
      this._updatingRecordArraysLater = false;
      this.store.dataWasUpdated(this.type, this);
    },

    setId: function setId(id) {
      (0, _emberDataPrivateDebug.assert)('A record\'s id cannot be changed once it is in the loaded state', this.id === null || this.id === id || this.isNew());
      this.id = id;
      if (this.record.get('id') !== id) {
        this.record.set('id', id);
      }
    },

    didError: function didError(error) {
      this.error = error;
      this.isError = true;

      if (this.record) {
        this.record.setProperties({
          isError: true,
          adapterError: error
        });
      }
    },

    didCleanError: function didCleanError() {
      this.error = null;
      this.isError = false;

      if (this.record) {
        this.record.setProperties({
          isError: false,
          adapterError: null
        });
      }
    },
    /*
      If the adapter did not return a hash in response to a commit,
      merge the changed attributes and relationships into the existing
      saved data.
       @method adapterDidCommit
    */
    adapterDidCommit: function adapterDidCommit(data) {
      if (data) {
        data = data.attributes;
      }

      this.didCleanError();
      var changedKeys = this._changedKeys(data);

      assign(this._data, this._inFlightAttributes);
      if (data) {
        assign(this._data, data);
      }

      this._inFlightAttributes = new _emberDataPrivateSystemEmptyObject["default"]();

      this.send('didCommit');
      this.updateRecordArraysLater();

      if (!data) {
        return;
      }

      this.record._notifyProperties(changedKeys);
    },

    /*
      @method updateRecordArraysLater
      @private
    */
    updateRecordArraysLater: function updateRecordArraysLater() {
      // quick hack (something like this could be pushed into run.once
      if (this._updatingRecordArraysLater) {
        return;
      }
      this._updatingRecordArraysLater = true;
      _ember["default"].run.schedule('actions', this, this.updateRecordArrays);
    },

    addErrorMessageToAttribute: function addErrorMessageToAttribute(attribute, message) {
      var record = this.getRecord();
      get(record, 'errors')._add(attribute, message);
    },

    removeErrorMessageFromAttribute: function removeErrorMessageFromAttribute(attribute) {
      var record = this.getRecord();
      get(record, 'errors')._remove(attribute);
    },

    clearErrorMessages: function clearErrorMessages() {
      var record = this.getRecord();
      get(record, 'errors')._clear();
    },

    hasErrors: function hasErrors() {
      var record = this.getRecord();
      var errors = get(record, 'errors');

      return !_ember["default"].isEmpty(errors);
    },

    // FOR USE DURING COMMIT PROCESS

    /*
      @method adapterDidInvalidate
      @private
    */
    adapterDidInvalidate: function adapterDidInvalidate(errors) {
      var attribute;

      for (attribute in errors) {
        if (errors.hasOwnProperty(attribute)) {
          this.addErrorMessageToAttribute(attribute, errors[attribute]);
        }
      }

      this.send('becameInvalid');

      this._saveWasRejected();
    },

    /*
      @method adapterDidError
      @private
    */
    adapterDidError: function adapterDidError(error) {
      this.send('becameError');
      this.didError(error);
      this._saveWasRejected();
    },

    _saveWasRejected: function _saveWasRejected() {
      var keys = Object.keys(this._inFlightAttributes);
      for (var i = 0; i < keys.length; i++) {
        if (this._attributes[keys[i]] === undefined) {
          this._attributes[keys[i]] = this._inFlightAttributes[keys[i]];
        }
      }
      this._inFlightAttributes = new _emberDataPrivateSystemEmptyObject["default"]();
    },

    /*
      Ember Data has 3 buckets for storing the value of an attribute on an internalModel.
       `_data` holds all of the attributes that have been acknowledged by
      a backend via the adapter. When rollbackAttributes is called on a model all
      attributes will revert to the record's state in `_data`.
       `_attributes` holds any change the user has made to an attribute
      that has not been acknowledged by the adapter. Any values in
      `_attributes` are have priority over values in `_data`.
       `_inFlightAttributes`. When a record is being synced with the
      backend the values in `_attributes` are copied to
      `_inFlightAttributes`. This way if the backend acknowledges the
      save but does not return the new state Ember Data can copy the
      values from `_inFlightAttributes` to `_data`. Without having to
      worry about changes made to `_attributes` while the save was
      happenign.
        Changed keys builds a list of all of the values that may have been
      changed by the backend after a successful save.
       It does this by iterating over each key, value pair in the payload
      returned from the server after a save. If the `key` is found in
      `_attributes` then the user has a local changed to the attribute
      that has not been synced with the server and the key is not
      included in the list of changed keys.
    
      If the value, for a key differs from the value in what Ember Data
      believes to be the truth about the backend state (A merger of the
      `_data` and `_inFlightAttributes` objects where
      `_inFlightAttributes` has priority) then that means the backend
      has updated the value and the key is added to the list of changed
      keys.
       @method _changedKeys
      @private
    */
    _changedKeys: function _changedKeys(updates) {
      var changedKeys = [];

      if (updates) {
        var original, i, value, key;
        var keys = Object.keys(updates);
        var length = keys.length;

        original = assign(new _emberDataPrivateSystemEmptyObject["default"](), this._data);
        original = assign(original, this._inFlightAttributes);

        for (i = 0; i < length; i++) {
          key = keys[i];
          value = updates[key];

          // A value in _attributes means the user has a local change to
          // this attributes. We never override this value when merging
          // updates from the backend so we should not sent a change
          // notification if the server value differs from the original.
          if (this._attributes[key] !== undefined) {
            continue;
          }

          if (!_ember["default"].isEqual(original[key], value)) {
            changedKeys.push(key);
          }
        }
      }

      return changedKeys;
    },

    toString: function toString() {
      if (this.record) {
        return this.record.toString();
      } else {
        return "<" + this.modelName + ":" + this.id + ">";
      }
    },

    referenceFor: function referenceFor(type, name) {
      var _this3 = this;

      var reference = this.references[name];

      if (!reference) {
        var relationship = this._relationships.get(name);

        (0, _emberDataPrivateDebug.runInDebug)(function () {
          var modelName = _this3.modelName;
          (0, _emberDataPrivateDebug.assert)("There is no " + type + " relationship named '" + name + "' on a model of type '" + modelName + "'", relationship);

          var actualRelationshipKind = relationship.relationshipMeta.kind;
          (0, _emberDataPrivateDebug.assert)("You tried to get the '" + name + "' relationship on a '" + modelName + "' via record." + type + "('" + name + "'), but the relationship is of type '" + actualRelationshipKind + "'. Use record." + actualRelationshipKind + "('" + name + "') instead.", actualRelationshipKind === type);
        });

        if (type === "belongsTo") {
          reference = new _emberDataPrivateSystemReferences.BelongsToReference(this.store, this, relationship);
        } else if (type === "hasMany") {
          reference = new _emberDataPrivateSystemReferences.HasManyReference(this.store, this, relationship);
        }

        this.references[name] = reference;
      }

      return reference;
    }
  };

  if (false) {
    /*
       Returns the latest truth for an attribute - the canonical value, or the
       in-flight value.
        @method lastAcknowledgedValue
       @private
    */
    InternalModel.prototype.lastAcknowledgedValue = function lastAcknowledgedValue(key) {
      if (key in this._inFlightAttributes) {
        return this._inFlightAttributes[key];
      } else {
        return this._data[key];
      }
    };
  }
});
define("ember-data/-private/system/model/model", ["exports", "ember", "ember-data/-private/debug", "ember-data/-private/system/promise-proxies", "ember-data/-private/system/model/errors", "ember-data/-private/system/debug/debug-info", "ember-data/-private/system/relationships/belongs-to", "ember-data/-private/system/relationships/has-many", "ember-data/-private/system/relationships/ext", "ember-data/-private/system/model/attr", "ember-data/-private/features"], function (exports, _ember, _emberDataPrivateDebug, _emberDataPrivateSystemPromiseProxies, _emberDataPrivateSystemModelErrors, _emberDataPrivateSystemDebugDebugInfo, _emberDataPrivateSystemRelationshipsBelongsTo, _emberDataPrivateSystemRelationshipsHasMany, _emberDataPrivateSystemRelationshipsExt, _emberDataPrivateSystemModelAttr, _emberDataPrivateFeatures) {
  "use strict";

  /**
    @module ember-data
  */

  var get = _ember["default"].get;

  function intersection(array1, array2) {
    var result = [];
    array1.forEach(function (element) {
      if (array2.indexOf(element) >= 0) {
        result.push(element);
      }
    });

    return result;
  }

  var RESERVED_MODEL_PROPS = ['currentState', 'data', 'store'];

  var retrieveFromCurrentState = _ember["default"].computed('currentState', function (key) {
    return get(this._internalModel.currentState, key);
  }).readOnly();

  /**
  
    The model class that all Ember Data records descend from.
    This is the public API of Ember Data models. If you are using Ember Data
    in your application, this is the class you should use.
    If you are working on Ember Data internals, you most likely want to be dealing
    with `InternalModel`
  
    @class Model
    @namespace DS
    @extends Ember.Object
    @uses Ember.Evented
  */
  var Model = _ember["default"].Object.extend(_ember["default"].Evented, {
    _internalModel: null,
    store: null,

    /**
      If this property is `true` the record is in the `empty`
      state. Empty is the first state all records enter after they have
      been created. Most records created by the store will quickly
      transition to the `loading` state if data needs to be fetched from
      the server or the `created` state if the record is created on the
      client. A record can also enter the empty state if the adapter is
      unable to locate the record.
       @property isEmpty
      @type {Boolean}
      @readOnly
    */
    isEmpty: retrieveFromCurrentState,
    /**
      If this property is `true` the record is in the `loading` state. A
      record enters this state when the store asks the adapter for its
      data. It remains in this state until the adapter provides the
      requested data.
       @property isLoading
      @type {Boolean}
      @readOnly
    */
    isLoading: retrieveFromCurrentState,
    /**
      If this property is `true` the record is in the `loaded` state. A
      record enters this state when its data is populated. Most of a
      record's lifecycle is spent inside substates of the `loaded`
      state.
       Example
       ```javascript
      var record = store.createRecord('model');
      record.get('isLoaded'); // true
       store.findRecord('model', 1).then(function(model) {
        model.get('isLoaded'); // true
      });
      ```
       @property isLoaded
      @type {Boolean}
      @readOnly
    */
    isLoaded: retrieveFromCurrentState,
    /**
      If this property is `true` the record is in the `dirty` state. The
      record has local changes that have not yet been saved by the
      adapter. This includes records that have been created (but not yet
      saved) or deleted.
       Example
       ```javascript
      var record = store.createRecord('model');
      record.get('hasDirtyAttributes'); // true
       store.findRecord('model', 1).then(function(model) {
        model.get('hasDirtyAttributes'); // false
        model.set('foo', 'some value');
        model.get('hasDirtyAttributes'); // true
      });
      ```
       @since 1.13.0
      @property hasDirtyAttributes
      @type {Boolean}
      @readOnly
    */
    hasDirtyAttributes: _ember["default"].computed('currentState.isDirty', function () {
      return this.get('currentState.isDirty');
    }),
    /**
      If this property is `true` the record is in the `saving` state. A
      record enters the saving state when `save` is called, but the
      adapter has not yet acknowledged that the changes have been
      persisted to the backend.
       Example
       ```javascript
      var record = store.createRecord('model');
      record.get('isSaving'); // false
      var promise = record.save();
      record.get('isSaving'); // true
      promise.then(function() {
        record.get('isSaving'); // false
      });
      ```
       @property isSaving
      @type {Boolean}
      @readOnly
    */
    isSaving: retrieveFromCurrentState,
    /**
      If this property is `true` the record is in the `deleted` state
      and has been marked for deletion. When `isDeleted` is true and
      `hasDirtyAttributes` is true, the record is deleted locally but the deletion
      was not yet persisted. When `isSaving` is true, the change is
      in-flight. When both `hasDirtyAttributes` and `isSaving` are false, the
      change has persisted.
       Example
       ```javascript
      var record = store.createRecord('model');
      record.get('isDeleted');    // false
      record.deleteRecord();
       // Locally deleted
      record.get('isDeleted');           // true
      record.get('hasDirtyAttributes');  // true
      record.get('isSaving');            // false
       // Persisting the deletion
      var promise = record.save();
      record.get('isDeleted');    // true
      record.get('isSaving');     // true
       // Deletion Persisted
      promise.then(function() {
        record.get('isDeleted');          // true
        record.get('isSaving');           // false
        record.get('hasDirtyAttributes'); // false
      });
      ```
       @property isDeleted
      @type {Boolean}
      @readOnly
    */
    isDeleted: retrieveFromCurrentState,
    /**
      If this property is `true` the record is in the `new` state. A
      record will be in the `new` state when it has been created on the
      client and the adapter has not yet report that it was successfully
      saved.
       Example
       ```javascript
      var record = store.createRecord('model');
      record.get('isNew'); // true
       record.save().then(function(model) {
        model.get('isNew'); // false
      });
      ```
       @property isNew
      @type {Boolean}
      @readOnly
    */
    isNew: retrieveFromCurrentState,
    /**
      If this property is `true` the record is in the `valid` state.
       A record will be in the `valid` state when the adapter did not report any
      server-side validation failures.
       @property isValid
      @type {Boolean}
      @readOnly
    */
    isValid: retrieveFromCurrentState,
    /**
      If the record is in the dirty state this property will report what
      kind of change has caused it to move into the dirty
      state. Possible values are:
       - `created` The record has been created by the client and not yet saved to the adapter.
      - `updated` The record has been updated by the client and not yet saved to the adapter.
      - `deleted` The record has been deleted by the client and not yet saved to the adapter.
       Example
       ```javascript
      var record = store.createRecord('model');
      record.get('dirtyType'); // 'created'
      ```
       @property dirtyType
      @type {String}
      @readOnly
    */
    dirtyType: retrieveFromCurrentState,

    /**
      If `true` the adapter reported that it was unable to save local
      changes to the backend for any reason other than a server-side
      validation error.
       Example
       ```javascript
      record.get('isError'); // false
      record.set('foo', 'valid value');
      record.save().then(null, function() {
        record.get('isError'); // true
      });
      ```
       @property isError
      @type {Boolean}
      @readOnly
    */
    isError: false,

    /**
      If `true` the store is attempting to reload the record form the adapter.
       Example
       ```javascript
      record.get('isReloading'); // false
      record.reload();
      record.get('isReloading'); // true
      ```
       @property isReloading
      @type {Boolean}
      @readOnly
    */
    isReloading: false,

    /**
      All ember models have an id property. This is an identifier
      managed by an external source. These are always coerced to be
      strings before being used internally. Note when declaring the
      attributes for a model it is an error to declare an id
      attribute.
       ```javascript
      var record = store.createRecord('model');
      record.get('id'); // null
       store.findRecord('model', 1).then(function(model) {
        model.get('id'); // '1'
      });
      ```
       @property id
      @type {String}
    */
    id: null,

    /**
      @property currentState
      @private
      @type {Object}
    */

    /**
      When the record is in the `invalid` state this object will contain
      any errors returned by the adapter. When present the errors hash
      contains keys corresponding to the invalid property names
      and values which are arrays of Javascript objects with two keys:
       - `message` A string containing the error message from the backend
      - `attribute` The name of the property associated with this error message
       ```javascript
      record.get('errors.length'); // 0
      record.set('foo', 'invalid value');
      record.save().catch(function() {
        record.get('errors').get('foo');
        // [{message: 'foo should be a number.', attribute: 'foo'}]
      });
      ```
       The `errors` property us useful for displaying error messages to
      the user.
       ```handlebars
      <label>Username: {{input value=username}} </label>
      {{#each model.errors.username as |error|}}
        <div class="error">
          {{error.message}}
        </div>
      {{/each}}
      <label>Email: {{input value=email}} </label>
      {{#each model.errors.email as |error|}}
        <div class="error">
          {{error.message}}
        </div>
      {{/each}}
      ```
        You can also access the special `messages` property on the error
      object to get an array of all the error strings.
       ```handlebars
      {{#each model.errors.messages as |message|}}
        <div class="error">
          {{message}}
        </div>
      {{/each}}
      ```
       @property errors
      @type {DS.Errors}
    */
    errors: _ember["default"].computed(function () {
      var errors = _emberDataPrivateSystemModelErrors["default"].create();

      errors._registerHandlers(this._internalModel, function () {
        this.send('becameInvalid');
      }, function () {
        this.send('becameValid');
      });
      return errors;
    }).readOnly(),

    /**
      This property holds the `DS.AdapterError` object with which
      last adapter operation was rejected.
       @property adapterError
      @type {DS.AdapterError}
    */
    adapterError: null,

    /**
      Create a JSON representation of the record, using the serialization
      strategy of the store's adapter.
      `serialize` takes an optional hash as a parameter, currently
      supported options are:
      - `includeId`: `true` if the record's ID should be included in the
        JSON representation.
       @method serialize
      @param {Object} options
      @return {Object} an object whose values are primitive JSON values only
    */
    serialize: function serialize(options) {
      return this.store.serialize(this, options);
    },

    /**
      Use [DS.JSONSerializer](DS.JSONSerializer.html) to
      get the JSON representation of a record.
       `toJSON` takes an optional hash as a parameter, currently
      supported options are:
       - `includeId`: `true` if the record's ID should be included in the
        JSON representation.
       @method toJSON
      @param {Object} options
      @return {Object} A JSON representation of the object.
    */
    toJSON: function toJSON(options) {
      // container is for lazy transform lookups
      var serializer = this.store.serializerFor('-default');
      var snapshot = this._internalModel.createSnapshot();

      return serializer.serialize(snapshot, options);
    },

    /**
      Fired when the record is ready to be interacted with,
      that is either loaded from the server or created locally.
       @event ready
    */
    ready: _ember["default"].K,

    /**
      Fired when the record is loaded from the server.
       @event didLoad
    */
    didLoad: _ember["default"].K,

    /**
      Fired when the record is updated.
       @event didUpdate
    */
    didUpdate: _ember["default"].K,

    /**
      Fired when a new record is commited to the server.
       @event didCreate
    */
    didCreate: _ember["default"].K,

    /**
      Fired when the record is deleted.
       @event didDelete
    */
    didDelete: _ember["default"].K,

    /**
      Fired when the record becomes invalid.
       @event becameInvalid
    */
    becameInvalid: _ember["default"].K,

    /**
      Fired when the record enters the error state.
       @event becameError
    */
    becameError: _ember["default"].K,

    /**
      Fired when the record is rolled back.
       @event rolledBack
    */
    rolledBack: _ember["default"].K,

    //TODO Do we want to deprecate these?
    /**
      @method send
      @private
      @param {String} name
      @param {Object} context
    */
    send: function send(name, context) {
      return this._internalModel.send(name, context);
    },

    /**
      @method transitionTo
      @private
      @param {String} name
    */
    transitionTo: function transitionTo(name) {
      return this._internalModel.transitionTo(name);
    },

    /**
      Marks the record as deleted but does not save it. You must call
      `save` afterwards if you want to persist it. You might use this
      method if you want to allow the user to still `rollbackAttributes()`
      after a delete it was made.
       Example
       ```app/routes/model/delete.js
      import Ember from 'ember';
       export default Ember.Route.extend({
        actions: {
          softDelete: function() {
            this.controller.get('model').deleteRecord();
          },
          confirm: function() {
            this.controller.get('model').save();
          },
          undo: function() {
            this.controller.get('model').rollbackAttributes();
          }
        }
      });
      ```
       @method deleteRecord
    */
    deleteRecord: function deleteRecord() {
      this._internalModel.deleteRecord();
    },

    /**
      Same as `deleteRecord`, but saves the record immediately.
       Example
       ```app/routes/model/delete.js
      import Ember from 'ember';
       export default Ember.Route.extend({
        actions: {
          delete: function() {
            var controller = this.controller;
            controller.get('model').destroyRecord().then(function() {
              controller.transitionToRoute('model.index');
            });
          }
        }
      });
      ```
       If you pass an object on the `adapterOptions` property of the options
      argument it will be passed to you adapter via the snapshot
       ```js
      record.destroyRecord({ adapterOptions: { subscribe: false } });
      ```
       ```app/adapters/post.js
      import MyCustomAdapter from './custom-adapter';
       export default MyCustomAdapter.extend({
        deleteRecord: function(store, type, snapshot) {
          if (snapshot.adapterOptions.subscribe) {
            // ...
          }
          // ...
        }
      });
      ```
       @method destroyRecord
      @param {Object} options
      @return {Promise} a promise that will be resolved when the adapter returns
      successfully or rejected if the adapter returns with an error.
    */
    destroyRecord: function destroyRecord(options) {
      this.deleteRecord();
      return this.save(options);
    },

    /**
      @method unloadRecord
      @private
    */
    unloadRecord: function unloadRecord() {
      if (this.isDestroyed) {
        return;
      }
      this._internalModel.unloadRecord();
    },

    /**
      @method _notifyProperties
      @private
    */
    _notifyProperties: function _notifyProperties(keys) {
      _ember["default"].beginPropertyChanges();
      var key;
      for (var i = 0, length = keys.length; i < length; i++) {
        key = keys[i];
        this.notifyPropertyChange(key);
      }
      _ember["default"].endPropertyChanges();
    },

    /**
      Returns an object, whose keys are changed properties, and value is
      an [oldProp, newProp] array.
       The array represents the diff of the canonical state with the local state
      of the model. Note: if the model is created locally, the canonical state is
      empty since the adapter hasn't acknowledged the attributes yet:
       Example
       ```app/models/mascot.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        name: attr('string'),
        isAdmin: attr('boolean', {
          defaultValue: false
        })
      });
      ```
       ```javascript
      var mascot = store.createRecord('mascot');
       mascot.changedAttributes(); // {}
       mascot.set('name', 'Tomster');
      mascot.changedAttributes(); // { name: [undefined, 'Tomster'] }
       mascot.set('isAdmin', true);
      mascot.changedAttributes(); // { isAdmin: [undefined, true], name: [undefined, 'Tomster'] }
       mascot.save().then(function() {
        mascot.changedAttributes(); // {}
         mascot.set('isAdmin', false);
        mascot.changedAttributes(); // { isAdmin: [true, false] }
      });
      ```
       @method changedAttributes
      @return {Object} an object, whose keys are changed properties,
        and value is an [oldProp, newProp] array.
    */
    changedAttributes: function changedAttributes() {
      return this._internalModel.changedAttributes();
    },

    //TODO discuss with tomhuda about events/hooks
    //Bring back as hooks?
    /**
      @method adapterWillCommit
      @private
    adapterWillCommit: function() {
      this.send('willCommit');
    },
     /**
      @method adapterDidDirty
      @private
    adapterDidDirty: function() {
      this.send('becomeDirty');
      this.updateRecordArraysLater();
    },
    */

    /**
      If the model `hasDirtyAttributes` this function will discard any unsaved
      changes. If the model `isNew` it will be removed from the store.
       Example
       ```javascript
      record.get('name'); // 'Untitled Document'
      record.set('name', 'Doc 1');
      record.get('name'); // 'Doc 1'
      record.rollbackAttributes();
      record.get('name'); // 'Untitled Document'
      ```
       @since 1.13.0
      @method rollbackAttributes
    */
    rollbackAttributes: function rollbackAttributes() {
      this._internalModel.rollbackAttributes();
    },

    /*
      @method _createSnapshot
      @private
    */
    _createSnapshot: function _createSnapshot() {
      return this._internalModel.createSnapshot();
    },

    toStringExtension: function toStringExtension() {
      return get(this, 'id');
    },

    /**
      Save the record and persist any changes to the record to an
      external source via the adapter.
       Example
       ```javascript
      record.set('name', 'Tomster');
      record.save().then(function() {
        // Success callback
      }, function() {
        // Error callback
      });
      ```
      If you pass an object on the `adapterOptions` property of the options
     argument it will be passed to you adapter via the snapshot
       ```js
      record.save({ adapterOptions: { subscribe: false } });
      ```
       ```app/adapters/post.js
      import MyCustomAdapter from './custom-adapter';
       export default MyCustomAdapter.extend({
        updateRecord: function(store, type, snapshot) {
          if (snapshot.adapterOptions.subscribe) {
            // ...
          }
          // ...
        }
      });
      ```
       @method save
      @param {Object} options
      @return {Promise} a promise that will be resolved when the adapter returns
      successfully or rejected if the adapter returns with an error.
    */
    save: function save(options) {
      var _this = this;

      return _emberDataPrivateSystemPromiseProxies.PromiseObject.create({
        promise: this._internalModel.save(options).then(function () {
          return _this;
        })
      });
    },

    /**
      Reload the record from the adapter.
       This will only work if the record has already finished loading.
       Example
       ```app/routes/model/view.js
      import Ember from 'ember';
       export default Ember.Route.extend({
        actions: {
          reload: function() {
            this.controller.get('model').reload().then(function(model) {
              // do something with the reloaded model
            });
          }
        }
      });
      ```
       @method reload
      @return {Promise} a promise that will be resolved with the record when the
      adapter returns successfully or rejected if the adapter returns
      with an error.
    */
    reload: function reload() {
      var _this2 = this;

      return _emberDataPrivateSystemPromiseProxies.PromiseObject.create({
        promise: this._internalModel.reload().then(function () {
          return _this2;
        })
      });
    },

    /**
      Override the default event firing from Ember.Evented to
      also call methods with the given name.
       @method trigger
      @private
      @param {String} name
    */
    trigger: function trigger(name) {
      var length = arguments.length;
      var args = new Array(length - 1);

      for (var i = 1; i < length; i++) {
        args[i - 1] = arguments[i];
      }

      _ember["default"].tryInvoke(this, name, args);
      this._super.apply(this, arguments);
    },

    willDestroy: function willDestroy() {
      //TODO Move!
      this._super.apply(this, arguments);
      this._internalModel.clearRelationships();
      this._internalModel.recordObjectWillDestroy();
      //TODO should we set internalModel to null here?
    },

    // This is a temporary solution until we refactor DS.Model to not
    // rely on the data property.
    willMergeMixin: function willMergeMixin(props) {
      var constructor = this.constructor;
      (0, _emberDataPrivateDebug.assert)('`' + intersection(Object.keys(props), RESERVED_MODEL_PROPS)[0] + '` is a reserved property name on DS.Model objects. Please choose a different property name for ' + constructor.toString(), !intersection(Object.keys(props), RESERVED_MODEL_PROPS)[0]);
      (0, _emberDataPrivateDebug.assert)("You may not set `id` as an attribute on your model. Please remove any lines that look like: `id: DS.attr('<type>')` from " + constructor.toString(), Object.keys(props).indexOf('id') === -1);
    },

    attr: function attr() {
      (0, _emberDataPrivateDebug.assert)("The `attr` method is not available on DS.Model, a DS.Snapshot was probably expected. Are you passing a DS.Model instead of a DS.Snapshot to your serializer?", false);
    },

    /**
      Get the reference for the specified belongsTo relationship.
       Example
       ```javascript
      // models/blog.js
      export default DS.Model.extend({
        user: DS.belongsTo({ async: true })
      });
       var blog = store.push({
        type: 'blog',
        id: 1,
        relationships: {
          user: { type: 'user', id: 1 }
        }
      });
      var userRef = blog.belongsTo('user');
       // check if the user relationship is loaded
      var isLoaded = userRef.value() !== null;
       // get the record of the reference (null if not yet available)
      var user = userRef.value();
       // get the identifier of the reference
      if (userRef.remoteType() === "id") {
        var id = userRef.id();
      } else if (userRef.remoteType() === "link") {
        var link = userRef.link();
      }
       // load user (via store.findRecord or store.findBelongsTo)
      userRef.load().then(...)
       // or trigger a reload
      userRef.reload().then(...)
       // provide data for reference
      userRef.push({
        type: 'user',
        id: 1,
        attributes: {
          username: "@user"
        }
      }).then(function(user) {
        userRef.value() === user;
      });
      ```
       @method belongsTo
      @param {String} name of the relationship
      @since 2.5.0
      @return {BelongsToReference} reference for this relationship
    */
    belongsTo: function belongsTo(name) {
      return this._internalModel.referenceFor('belongsTo', name);
    },

    /**
      Get the reference for the specified hasMany relationship.
       Example
       ```javascript
      // models/blog.js
      export default DS.Model.extend({
        comments: DS.hasMany({ async: true })
      });
       var blog = store.push({
        type: 'blog',
        id: 1,
        relationships: {
          comments: {
            data: [
              { type: 'comment', id: 1 },
              { type: 'comment', id: 2 }
            ]
          }
        }
      });
      var commentsRef = blog.hasMany('comments');
       // check if the comments are loaded already
      var isLoaded = commentsRef.value() !== null;
       // get the records of the reference (null if not yet available)
      var comments = commentsRef.value();
       // get the identifier of the reference
      if (commentsRef.remoteType() === "ids") {
        var ids = commentsRef.ids();
      } else if (commentsRef.remoteType() === "link") {
        var link = commentsRef.link();
      }
       // load comments (via store.findMany or store.findHasMany)
      commentsRef.load().then(...)
       // or trigger a reload
      commentsRef.reload().then(...)
       // provide data for reference
      commentsRef.push([{ type: 'comment', id: 1 }, { type: 'comment', id: 2 }]).then(function(comments) {
        commentsRef.value() === comments;
      });
      ```
       @method hasMany
      @param {String} name of the relationship
      @since 2.5.0
      @return {HasManyReference} reference for this relationship
    */
    hasMany: function hasMany(name) {
      return this._internalModel.referenceFor('hasMany', name);
    },

    setId: _ember["default"].observer('id', function () {
      this._internalModel.setId(this.get('id'));
    })
  });

  /**
   @property data
   @private
   @type {Object}
   */
  Object.defineProperty(Model.prototype, 'data', {
    get: function get() {
      return this._internalModel._data;
    }
  });

  Model.reopenClass({
    /**
      Alias DS.Model's `create` method to `_create`. This allows us to create DS.Model
      instances from within the store, but if end users accidentally call `create()`
      (instead of `createRecord()`), we can raise an error.
       @method _create
      @private
      @static
    */
    _create: Model.create,

    /**
      Override the class' `create()` method to raise an error. This
      prevents end users from inadvertently calling `create()` instead
      of `createRecord()`. The store is still able to create instances
      by calling the `_create()` method. To create an instance of a
      `DS.Model` use [store.createRecord](DS.Store.html#method_createRecord).
       @method create
      @private
      @static
    */
    create: function create() {
      throw new _ember["default"].Error("You should not call `create` on a model. Instead, call `store.createRecord` with the attributes you would like to set.");
    },

    /**
     Represents the model's class name as a string. This can be used to look up the model through
     DS.Store's modelFor method.
      `modelName` is generated for you by Ember Data. It will be a lowercased, dasherized string.
     For example:
      ```javascript
     store.modelFor('post').modelName; // 'post'
     store.modelFor('blog-post').modelName; // 'blog-post'
     ```
      The most common place you'll want to access `modelName` is in your serializer's `payloadKeyFromModelName` method. For example, to change payload
     keys to underscore (instead of dasherized), you might use the following code:
      ```javascript
     export default var PostSerializer = DS.RESTSerializer.extend({
       payloadKeyFromModelName: function(modelName) {
         return Ember.String.underscore(modelName);
       }
     });
     ```
     @property modelName
     @type String
     @readonly
     @static
    */
    modelName: null
  });

  // if `Ember.setOwner` is defined, accessing `this.container` is
  // deprecated (but functional). In "standard" Ember usage, this
  // deprecation is actually created via an `.extend` of the factory
  // inside the container itself, but that only happens on models
  // with MODEL_FACTORY_INJECTIONS enabled :(
  if (_ember["default"].setOwner) {
    Object.defineProperty(Model.prototype, 'container', {
      configurable: true,
      enumerable: false,
      get: function get() {
        (0, _emberDataPrivateDebug.deprecate)('Using the injected `container` is deprecated. Please use the `getOwner` helper instead to access the owner of this object.', false, { id: 'ember-application.injected-container', until: '3.0.0' });

        return this.store.container;
      }
    });
  }

  if (false) {
    Model.reopen({
      /**
        Discards any unsaved changes to the given attribute.
         Example
         ```javascript
        record.get('name'); // 'Untitled Document'
        record.set('name', 'Doc 1');
        record.get('name'); // 'Doc 1'
        record.resetAttribute('name');
        record.get('name'); // 'Untitled Document'
        ```
         @method resetAttribute
      */
      resetAttribute: function resetAttribute(attributeName) {
        if (attributeName in this._internalModel._attributes) {
          this.set(attributeName, this._internalModel.lastAcknowledgedValue(attributeName));
        }
      }
    });
  }

  Model.reopenClass(_emberDataPrivateSystemRelationshipsExt.RelationshipsClassMethodsMixin);
  Model.reopenClass(_emberDataPrivateSystemModelAttr.AttrClassMethodsMixin);

  exports["default"] = Model.extend(_emberDataPrivateSystemDebugDebugInfo["default"], _emberDataPrivateSystemRelationshipsBelongsTo.BelongsToMixin, _emberDataPrivateSystemRelationshipsExt.DidDefinePropertyMixin, _emberDataPrivateSystemRelationshipsExt.RelationshipsInstanceMethodsMixin, _emberDataPrivateSystemRelationshipsHasMany.HasManyMixin, _emberDataPrivateSystemModelAttr.AttrInstanceMethodsMixin);
});
define('ember-data/-private/system/model/states', ['exports', 'ember', 'ember-data/-private/debug'], function (exports, _ember, _emberDataPrivateDebug) {
  /**
    @module ember-data
  */
  'use strict';

  var get = _ember['default'].get;
  /*
    This file encapsulates the various states that a record can transition
    through during its lifecycle.
  */
  /**
    ### State
  
    Each record has a `currentState` property that explicitly tracks what
    state a record is in at any given time. For instance, if a record is
    newly created and has not yet been sent to the adapter to be saved,
    it would be in the `root.loaded.created.uncommitted` state.  If a
    record has had local modifications made to it that are in the
    process of being saved, the record would be in the
    `root.loaded.updated.inFlight` state. (This state paths will be
    explained in more detail below.)
  
    Events are sent by the record or its store to the record's
    `currentState` property. How the state reacts to these events is
    dependent on which state it is in. In some states, certain events
    will be invalid and will cause an exception to be raised.
  
    States are hierarchical and every state is a substate of the
    `RootState`. For example, a record can be in the
    `root.deleted.uncommitted` state, then transition into the
    `root.deleted.inFlight` state. If a child state does not implement
    an event handler, the state manager will attempt to invoke the event
    on all parent states until the root state is reached. The state
    hierarchy of a record is described in terms of a path string. You
    can determine a record's current state by getting the state's
    `stateName` property:
  
    ```javascript
    record.get('currentState.stateName');
    //=> "root.created.uncommitted"
     ```
  
    The hierarchy of valid states that ship with ember data looks like
    this:
  
    ```text
    * root
      * deleted
        * saved
        * uncommitted
        * inFlight
      * empty
      * loaded
        * created
          * uncommitted
          * inFlight
        * saved
        * updated
          * uncommitted
          * inFlight
      * loading
    ```
  
    The `DS.Model` states are themselves stateless. What that means is
    that, the hierarchical states that each of *those* points to is a
    shared data structure. For performance reasons, instead of each
    record getting its own copy of the hierarchy of states, each record
    points to this global, immutable shared instance. How does a state
    know which record it should be acting on? We pass the record
    instance into the state's event handlers as the first argument.
  
    The record passed as the first parameter is where you should stash
    state about the record if needed; you should never store data on the state
    object itself.
  
    ### Events and Flags
  
    A state may implement zero or more events and flags.
  
    #### Events
  
    Events are named functions that are invoked when sent to a record. The
    record will first look for a method with the given name on the
    current state. If no method is found, it will search the current
    state's parent, and then its grandparent, and so on until reaching
    the top of the hierarchy. If the root is reached without an event
    handler being found, an exception will be raised. This can be very
    helpful when debugging new features.
  
    Here's an example implementation of a state with a `myEvent` event handler:
  
    ```javascript
    aState: DS.State.create({
      myEvent: function(manager, param) {
        console.log("Received myEvent with", param);
      }
    })
    ```
  
    To trigger this event:
  
    ```javascript
    record.send('myEvent', 'foo');
    //=> "Received myEvent with foo"
    ```
  
    Note that an optional parameter can be sent to a record's `send()` method,
    which will be passed as the second parameter to the event handler.
  
    Events should transition to a different state if appropriate. This can be
    done by calling the record's `transitionTo()` method with a path to the
    desired state. The state manager will attempt to resolve the state path
    relative to the current state. If no state is found at that path, it will
    attempt to resolve it relative to the current state's parent, and then its
    parent, and so on until the root is reached. For example, imagine a hierarchy
    like this:
  
        * created
          * uncommitted <-- currentState
          * inFlight
        * updated
          * inFlight
  
    If we are currently in the `uncommitted` state, calling
    `transitionTo('inFlight')` would transition to the `created.inFlight` state,
    while calling `transitionTo('updated.inFlight')` would transition to
    the `updated.inFlight` state.
  
    Remember that *only events* should ever cause a state transition. You should
    never call `transitionTo()` from outside a state's event handler. If you are
    tempted to do so, create a new event and send that to the state manager.
  
    #### Flags
  
    Flags are Boolean values that can be used to introspect a record's current
    state in a more user-friendly way than examining its state path. For example,
    instead of doing this:
  
    ```javascript
    var statePath = record.get('stateManager.currentPath');
    if (statePath === 'created.inFlight') {
      doSomething();
    }
    ```
  
    You can say:
  
    ```javascript
    if (record.get('isNew') && record.get('isSaving')) {
      doSomething();
    }
    ```
  
    If your state does not set a value for a given flag, the value will
    be inherited from its parent (or the first place in the state hierarchy
    where it is defined).
  
    The current set of flags are defined below. If you want to add a new flag,
    in addition to the area below, you will also need to declare it in the
    `DS.Model` class.
  
  
     * [isEmpty](DS.Model.html#property_isEmpty)
     * [isLoading](DS.Model.html#property_isLoading)
     * [isLoaded](DS.Model.html#property_isLoaded)
     * [isDirty](DS.Model.html#property_isDirty)
     * [isSaving](DS.Model.html#property_isSaving)
     * [isDeleted](DS.Model.html#property_isDeleted)
     * [isNew](DS.Model.html#property_isNew)
     * [isValid](DS.Model.html#property_isValid)
  
    @namespace DS
    @class RootState
  */

  function _didSetProperty(internalModel, context) {
    if (context.value === context.originalValue) {
      delete internalModel._attributes[context.name];
      internalModel.send('propertyWasReset', context.name);
    } else if (context.value !== context.oldValue) {
      internalModel.send('becomeDirty');
    }

    internalModel.updateRecordArraysLater();
  }

  // Implementation notes:
  //
  // Each state has a boolean value for all of the following flags:
  //
  // * isLoaded: The record has a populated `data` property. When a
  //   record is loaded via `store.find`, `isLoaded` is false
  //   until the adapter sets it. When a record is created locally,
  //   its `isLoaded` property is always true.
  // * isDirty: The record has local changes that have not yet been
  //   saved by the adapter. This includes records that have been
  //   created (but not yet saved) or deleted.
  // * isSaving: The record has been committed, but
  //   the adapter has not yet acknowledged that the changes have
  //   been persisted to the backend.
  // * isDeleted: The record was marked for deletion. When `isDeleted`
  //   is true and `isDirty` is true, the record is deleted locally
  //   but the deletion was not yet persisted. When `isSaving` is
  //   true, the change is in-flight. When both `isDirty` and
  //   `isSaving` are false, the change has persisted.
  // * isNew: The record was created on the client and the adapter
  //   did not yet report that it was successfully saved.
  // * isValid: The adapter did not report any server-side validation
  //   failures.

  // The dirty state is a abstract state whose functionality is
  // shared between the `created` and `updated` states.
  //
  // The deleted state shares the `isDirty` flag with the
  // subclasses of `DirtyState`, but with a very different
  // implementation.
  //
  // Dirty states have three child states:
  //
  // `uncommitted`: the store has not yet handed off the record
  //   to be saved.
  // `inFlight`: the store has handed off the record to be saved,
  //   but the adapter has not yet acknowledged success.
  // `invalid`: the record has invalid information and cannot be
  //   sent to the adapter yet.
  var DirtyState = {
    initialState: 'uncommitted',

    // FLAGS
    isDirty: true,

    // SUBSTATES

    // When a record first becomes dirty, it is `uncommitted`.
    // This means that there are local pending changes, but they
    // have not yet begun to be saved, and are not invalid.
    uncommitted: {
      // EVENTS
      didSetProperty: _didSetProperty,

      //TODO(Igor) reloading now triggers a
      //loadingData event, though it seems fine?
      loadingData: _ember['default'].K,

      propertyWasReset: function propertyWasReset(internalModel, name) {
        if (!internalModel.hasChangedAttributes()) {
          internalModel.send('rolledBack');
        }
      },

      pushedData: function pushedData(internalModel) {
        internalModel.updateChangedAttributes();

        if (!internalModel.hasChangedAttributes()) {
          internalModel.transitionTo('loaded.saved');
        }
      },

      becomeDirty: _ember['default'].K,

      willCommit: function willCommit(internalModel) {
        internalModel.transitionTo('inFlight');
      },

      reloadRecord: function reloadRecord(internalModel, resolve) {
        resolve(internalModel.store.reloadRecord(internalModel));
      },

      rolledBack: function rolledBack(internalModel) {
        internalModel.transitionTo('loaded.saved');
      },

      becameInvalid: function becameInvalid(internalModel) {
        internalModel.transitionTo('invalid');
      },

      rollback: function rollback(internalModel) {
        internalModel.rollbackAttributes();
        internalModel.triggerLater('ready');
      }
    },

    // Once a record has been handed off to the adapter to be
    // saved, it is in the 'in flight' state. Changes to the
    // record cannot be made during this window.
    inFlight: {
      // FLAGS
      isSaving: true,

      // EVENTS
      didSetProperty: _didSetProperty,
      becomeDirty: _ember['default'].K,
      pushedData: _ember['default'].K,

      unloadRecord: assertAgainstUnloadRecord,

      // TODO: More robust semantics around save-while-in-flight
      willCommit: _ember['default'].K,

      didCommit: function didCommit(internalModel) {
        var dirtyType = get(this, 'dirtyType');

        internalModel.transitionTo('saved');
        internalModel.send('invokeLifecycleCallbacks', dirtyType);
      },

      becameInvalid: function becameInvalid(internalModel) {
        internalModel.transitionTo('invalid');
        internalModel.send('invokeLifecycleCallbacks');
      },

      becameError: function becameError(internalModel) {
        internalModel.transitionTo('uncommitted');
        internalModel.triggerLater('becameError', internalModel);
      }
    },

    // A record is in the `invalid` if the adapter has indicated
    // the the record failed server-side invalidations.
    invalid: {
      // FLAGS
      isValid: false,

      // EVENTS
      deleteRecord: function deleteRecord(internalModel) {
        internalModel.transitionTo('deleted.uncommitted');
      },

      didSetProperty: function didSetProperty(internalModel, context) {
        internalModel.removeErrorMessageFromAttribute(context.name);

        _didSetProperty(internalModel, context);

        if (!internalModel.hasErrors()) {
          this.becameValid(internalModel);
        }
      },

      becameInvalid: _ember['default'].K,
      becomeDirty: _ember['default'].K,
      pushedData: _ember['default'].K,

      willCommit: function willCommit(internalModel) {
        internalModel.clearErrorMessages();
        internalModel.transitionTo('inFlight');
      },

      rolledBack: function rolledBack(internalModel) {
        internalModel.clearErrorMessages();
        internalModel.transitionTo('loaded.saved');
        internalModel.triggerLater('ready');
      },

      becameValid: function becameValid(internalModel) {
        internalModel.transitionTo('uncommitted');
      },

      invokeLifecycleCallbacks: function invokeLifecycleCallbacks(internalModel) {
        internalModel.triggerLater('becameInvalid', internalModel);
      }
    }
  };

  // The created and updated states are created outside the state
  // chart so we can reopen their substates and add mixins as
  // necessary.

  function deepClone(object) {
    var clone = {};
    var value;

    for (var prop in object) {
      value = object[prop];
      if (value && typeof value === 'object') {
        clone[prop] = deepClone(value);
      } else {
        clone[prop] = value;
      }
    }

    return clone;
  }

  function mixin(original, hash) {
    for (var prop in hash) {
      original[prop] = hash[prop];
    }

    return original;
  }

  function dirtyState(options) {
    var newState = deepClone(DirtyState);
    return mixin(newState, options);
  }

  var createdState = dirtyState({
    dirtyType: 'created',
    // FLAGS
    isNew: true
  });

  createdState.invalid.rolledBack = function (internalModel) {
    internalModel.transitionTo('deleted.saved');
  };
  createdState.uncommitted.rolledBack = function (internalModel) {
    internalModel.transitionTo('deleted.saved');
  };

  var updatedState = dirtyState({
    dirtyType: 'updated'
  });

  function createdStateDeleteRecord(internalModel) {
    internalModel.transitionTo('deleted.saved');
    internalModel.send('invokeLifecycleCallbacks');
  }

  createdState.uncommitted.deleteRecord = createdStateDeleteRecord;

  createdState.invalid.deleteRecord = createdStateDeleteRecord;

  createdState.uncommitted.rollback = function (internalModel) {
    DirtyState.uncommitted.rollback.apply(this, arguments);
    internalModel.transitionTo('deleted.saved');
  };

  createdState.uncommitted.pushedData = function (internalModel) {
    internalModel.transitionTo('loaded.updated.uncommitted');
    internalModel.triggerLater('didLoad');
  };

  createdState.uncommitted.propertyWasReset = _ember['default'].K;

  function assertAgainstUnloadRecord(internalModel) {
    (0, _emberDataPrivateDebug.assert)("You can only unload a record which is not inFlight. `" + internalModel + "`", false);
  }

  updatedState.inFlight.unloadRecord = assertAgainstUnloadRecord;

  updatedState.uncommitted.deleteRecord = function (internalModel) {
    internalModel.transitionTo('deleted.uncommitted');
  };

  var RootState = {
    // FLAGS
    isEmpty: false,
    isLoading: false,
    isLoaded: false,
    isDirty: false,
    isSaving: false,
    isDeleted: false,
    isNew: false,
    isValid: true,

    // DEFAULT EVENTS

    // Trying to roll back if you're not in the dirty state
    // doesn't change your state. For example, if you're in the
    // in-flight state, rolling back the record doesn't move
    // you out of the in-flight state.
    rolledBack: _ember['default'].K,
    unloadRecord: function unloadRecord(internalModel) {
      // clear relationships before moving to deleted state
      // otherwise it fails
      internalModel.clearRelationships();
      internalModel.transitionTo('deleted.saved');
    },

    propertyWasReset: _ember['default'].K,

    // SUBSTATES

    // A record begins its lifecycle in the `empty` state.
    // If its data will come from the adapter, it will
    // transition into the `loading` state. Otherwise, if
    // the record is being created on the client, it will
    // transition into the `created` state.
    empty: {
      isEmpty: true,

      // EVENTS
      loadingData: function loadingData(internalModel, promise) {
        internalModel._loadingPromise = promise;
        internalModel.transitionTo('loading');
      },

      loadedData: function loadedData(internalModel) {
        internalModel.transitionTo('loaded.created.uncommitted');
        internalModel.triggerLater('ready');
      },

      pushedData: function pushedData(internalModel) {
        internalModel.transitionTo('loaded.saved');
        internalModel.triggerLater('didLoad');
        internalModel.triggerLater('ready');
      }
    },

    // A record enters this state when the store asks
    // the adapter for its data. It remains in this state
    // until the adapter provides the requested data.
    //
    // Usually, this process is asynchronous, using an
    // XHR to retrieve the data.
    loading: {
      // FLAGS
      isLoading: true,

      exit: function exit(internalModel) {
        internalModel._loadingPromise = null;
      },

      // EVENTS
      pushedData: function pushedData(internalModel) {
        internalModel.transitionTo('loaded.saved');
        internalModel.triggerLater('didLoad');
        internalModel.triggerLater('ready');
        //TODO this seems out of place here
        internalModel.didCleanError();
      },

      becameError: function becameError(internalModel) {
        internalModel.triggerLater('becameError', internalModel);
      },

      notFound: function notFound(internalModel) {
        internalModel.transitionTo('empty');
      }
    },

    // A record enters this state when its data is populated.
    // Most of a record's lifecycle is spent inside substates
    // of the `loaded` state.
    loaded: {
      initialState: 'saved',

      // FLAGS
      isLoaded: true,

      //TODO(Igor) Reloading now triggers a loadingData event,
      //but it should be ok?
      loadingData: _ember['default'].K,

      // SUBSTATES

      // If there are no local changes to a record, it remains
      // in the `saved` state.
      saved: {
        setup: function setup(internalModel) {
          if (internalModel.hasChangedAttributes()) {
            internalModel.adapterDidDirty();
          }
        },

        // EVENTS
        didSetProperty: _didSetProperty,

        pushedData: _ember['default'].K,

        becomeDirty: function becomeDirty(internalModel) {
          internalModel.transitionTo('updated.uncommitted');
        },

        willCommit: function willCommit(internalModel) {
          internalModel.transitionTo('updated.inFlight');
        },

        reloadRecord: function reloadRecord(internalModel, resolve) {
          resolve(internalModel.store.reloadRecord(internalModel));
        },

        deleteRecord: function deleteRecord(internalModel) {
          internalModel.transitionTo('deleted.uncommitted');
        },

        unloadRecord: function unloadRecord(internalModel) {
          // clear relationships before moving to deleted state
          // otherwise it fails
          internalModel.clearRelationships();
          internalModel.transitionTo('deleted.saved');
        },

        didCommit: function didCommit(internalModel) {
          internalModel.send('invokeLifecycleCallbacks', get(internalModel, 'lastDirtyType'));
        },

        // loaded.saved.notFound would be triggered by a failed
        // `reload()` on an unchanged record
        notFound: _ember['default'].K

      },

      // A record is in this state after it has been locally
      // created but before the adapter has indicated that
      // it has been saved.
      created: createdState,

      // A record is in this state if it has already been
      // saved to the server, but there are new local changes
      // that have not yet been saved.
      updated: updatedState
    },

    // A record is in this state if it was deleted from the store.
    deleted: {
      initialState: 'uncommitted',
      dirtyType: 'deleted',

      // FLAGS
      isDeleted: true,
      isLoaded: true,
      isDirty: true,

      // TRANSITIONS
      setup: function setup(internalModel) {
        internalModel.updateRecordArrays();
      },

      // SUBSTATES

      // When a record is deleted, it enters the `start`
      // state. It will exit this state when the record
      // starts to commit.
      uncommitted: {

        // EVENTS

        willCommit: function willCommit(internalModel) {
          internalModel.transitionTo('inFlight');
        },

        rollback: function rollback(internalModel) {
          internalModel.rollbackAttributes();
          internalModel.triggerLater('ready');
        },

        pushedData: _ember['default'].K,
        becomeDirty: _ember['default'].K,
        deleteRecord: _ember['default'].K,

        rolledBack: function rolledBack(internalModel) {
          internalModel.transitionTo('loaded.saved');
          internalModel.triggerLater('ready');
        }
      },

      // After a record starts committing, but
      // before the adapter indicates that the deletion
      // has saved to the server, a record is in the
      // `inFlight` substate of `deleted`.
      inFlight: {
        // FLAGS
        isSaving: true,

        // EVENTS

        unloadRecord: assertAgainstUnloadRecord,

        // TODO: More robust semantics around save-while-in-flight
        willCommit: _ember['default'].K,
        didCommit: function didCommit(internalModel) {
          internalModel.transitionTo('saved');

          internalModel.send('invokeLifecycleCallbacks');
        },

        becameError: function becameError(internalModel) {
          internalModel.transitionTo('uncommitted');
          internalModel.triggerLater('becameError', internalModel);
        },

        becameInvalid: function becameInvalid(internalModel) {
          internalModel.transitionTo('invalid');
          internalModel.triggerLater('becameInvalid', internalModel);
        }
      },

      // Once the adapter indicates that the deletion has
      // been saved, the record enters the `saved` substate
      // of `deleted`.
      saved: {
        // FLAGS
        isDirty: false,

        setup: function setup(internalModel) {
          internalModel.clearRelationships();
          var store = internalModel.store;
          store._dematerializeRecord(internalModel);
        },

        invokeLifecycleCallbacks: function invokeLifecycleCallbacks(internalModel) {
          internalModel.triggerLater('didDelete', internalModel);
          internalModel.triggerLater('didCommit', internalModel);
        },

        willCommit: _ember['default'].K,

        didCommit: _ember['default'].K
      },

      invalid: {
        isValid: false,

        didSetProperty: function didSetProperty(internalModel, context) {
          internalModel.removeErrorMessageFromAttribute(context.name);

          _didSetProperty(internalModel, context);

          if (!internalModel.hasErrors()) {
            this.becameValid(internalModel);
          }
        },

        becameInvalid: _ember['default'].K,
        becomeDirty: _ember['default'].K,
        deleteRecord: _ember['default'].K,
        willCommit: _ember['default'].K,

        rolledBack: function rolledBack(internalModel) {
          internalModel.clearErrorMessages();
          internalModel.transitionTo('loaded.saved');
          internalModel.triggerLater('ready');
        },

        becameValid: function becameValid(internalModel) {
          internalModel.transitionTo('uncommitted');
        }

      }
    },

    invokeLifecycleCallbacks: function invokeLifecycleCallbacks(internalModel, dirtyType) {
      if (dirtyType === 'created') {
        internalModel.triggerLater('didCreate', internalModel);
      } else {
        internalModel.triggerLater('didUpdate', internalModel);
      }

      internalModel.triggerLater('didCommit', internalModel);
    }
  };

  function wireState(object, parent, name) {
    // TODO: Use Object.create and copy instead
    object = mixin(parent ? Object.create(parent) : {}, object);
    object.parentState = parent;
    object.stateName = name;

    for (var prop in object) {
      if (!object.hasOwnProperty(prop) || prop === 'parentState' || prop === 'stateName') {
        continue;
      }
      if (typeof object[prop] === 'object') {
        object[prop] = wireState(object[prop], object, name + "." + prop);
      }
    }

    return object;
  }

  RootState = wireState(RootState, null, "root");

  exports['default'] = RootState;
});
define('ember-data/-private/system/normalize-link', ['exports'], function (exports) {
  'use strict';

  exports['default'] = _normalizeLink;

  /*
    This method normalizes a link to an "links object". If the passed link is
    already an object it's returned without any modifications.
  
    See http://jsonapi.org/format/#document-links for more information.
  
    @method _normalizeLink
    @private
    @param {String} link
    @return {Object|null}
    @for DS
  */
  function _normalizeLink(link) {
    switch (typeof link) {
      case 'object':
        return link;
      case 'string':
        return { href: link };
    }
    return null;
  }
});
define('ember-data/-private/system/normalize-model-name', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  exports['default'] = normalizeModelName;

  // All modelNames are dasherized internally. Changing this function may
  // require changes to other normalization hooks (such as typeForRoot).

  /**
   This method normalizes a modelName into the format Ember Data uses
   internally.
  
    @method normalizeModelName
    @public
    @param {String} modelName
    @return {String} normalizedModelName
    @for DS
  */
  function normalizeModelName(modelName) {
    return _ember['default'].String.dasherize(modelName);
  }
});
define('ember-data/-private/system/ordered-set', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  exports['default'] = OrderedSet;

  var EmberOrderedSet = _ember['default'].OrderedSet;
  var guidFor = _ember['default'].guidFor;
  function OrderedSet() {
    this._super$constructor();
  }

  OrderedSet.create = function () {
    var Constructor = this;
    return new Constructor();
  };

  OrderedSet.prototype = Object.create(EmberOrderedSet.prototype);
  OrderedSet.prototype.constructor = OrderedSet;
  OrderedSet.prototype._super$constructor = EmberOrderedSet;

  OrderedSet.prototype.addWithIndex = function (obj, idx) {
    var guid = guidFor(obj);
    var presenceSet = this.presenceSet;
    var list = this.list;

    if (presenceSet[guid] === true) {
      return;
    }

    presenceSet[guid] = true;

    if (idx === undefined || idx === null) {
      list.push(obj);
    } else {
      list.splice(idx, 0, obj);
    }

    this.size += 1;

    return this;
  };
});
define('ember-data/-private/system/promise-proxies', ['exports', 'ember', 'ember-data/-private/debug'], function (exports, _ember, _emberDataPrivateDebug) {
  'use strict';

  var Promise = _ember['default'].RSVP.Promise;
  var get = _ember['default'].get;

  /**
    A `PromiseArray` is an object that acts like both an `Ember.Array`
    and a promise. When the promise is resolved the resulting value
    will be set to the `PromiseArray`'s `content` property. This makes
    it easy to create data bindings with the `PromiseArray` that will be
    updated when the promise resolves.
  
    For more information see the [Ember.PromiseProxyMixin
    documentation](/api/classes/Ember.PromiseProxyMixin.html).
  
    Example
  
    ```javascript
    var promiseArray = DS.PromiseArray.create({
      promise: $.getJSON('/some/remote/data.json')
    });
  
    promiseArray.get('length'); // 0
  
    promiseArray.then(function() {
      promiseArray.get('length'); // 100
    });
    ```
  
    @class PromiseArray
    @namespace DS
    @extends Ember.ArrayProxy
    @uses Ember.PromiseProxyMixin
  */
  var PromiseArray = _ember['default'].ArrayProxy.extend(_ember['default'].PromiseProxyMixin);

  /**
    A `PromiseObject` is an object that acts like both an `Ember.Object`
    and a promise. When the promise is resolved, then the resulting value
    will be set to the `PromiseObject`'s `content` property. This makes
    it easy to create data bindings with the `PromiseObject` that will
    be updated when the promise resolves.
  
    For more information see the [Ember.PromiseProxyMixin
    documentation](/api/classes/Ember.PromiseProxyMixin.html).
  
    Example
  
    ```javascript
    var promiseObject = DS.PromiseObject.create({
      promise: $.getJSON('/some/remote/data.json')
    });
  
    promiseObject.get('name'); // null
  
    promiseObject.then(function() {
      promiseObject.get('name'); // 'Tomster'
    });
    ```
  
    @class PromiseObject
    @namespace DS
    @extends Ember.ObjectProxy
    @uses Ember.PromiseProxyMixin
  */
  var PromiseObject = _ember['default'].ObjectProxy.extend(_ember['default'].PromiseProxyMixin);

  var promiseObject = function promiseObject(promise, label) {
    return PromiseObject.create({
      promise: Promise.resolve(promise, label)
    });
  };

  var promiseArray = function promiseArray(promise, label) {
    return PromiseArray.create({
      promise: Promise.resolve(promise, label)
    });
  };

  /**
    A PromiseManyArray is a PromiseArray that also proxies certain method calls
    to the underlying manyArray.
    Right now we proxy:
  
      * `reload()`
      * `createRecord()`
      * `on()`
      * `one()`
      * `trigger()`
      * `off()`
      * `has()`
  
    @class PromiseManyArray
    @namespace DS
    @extends Ember.ArrayProxy
  */

  function proxyToContent(method) {
    return function () {
      var content = get(this, 'content');
      return content[method].apply(content, arguments);
    };
  }

  var PromiseManyArray = PromiseArray.extend({
    reload: function reload() {
      //I don't think this should ever happen right now, but worth guarding if we refactor the async relationships
      (0, _emberDataPrivateDebug.assert)('You are trying to reload an async manyArray before it has been created', get(this, 'content'));
      return PromiseManyArray.create({
        promise: get(this, 'content').reload()
      });
    },

    createRecord: proxyToContent('createRecord'),

    on: proxyToContent('on'),

    one: proxyToContent('one'),

    trigger: proxyToContent('trigger'),

    off: proxyToContent('off'),

    has: proxyToContent('has')
  });

  var promiseManyArray = function promiseManyArray(promise, label) {
    return PromiseManyArray.create({
      promise: Promise.resolve(promise, label)
    });
  };

  exports.PromiseArray = PromiseArray;
  exports.PromiseObject = PromiseObject;
  exports.PromiseManyArray = PromiseManyArray;
  exports.promiseArray = promiseArray;
  exports.promiseObject = promiseObject;
  exports.promiseManyArray = promiseManyArray;
});
define("ember-data/-private/system/record-array-manager", ["exports", "ember", "ember-data/-private/system/record-arrays", "ember-data/-private/system/ordered-set"], function (exports, _ember, _emberDataPrivateSystemRecordArrays, _emberDataPrivateSystemOrderedSet) {
  /**
    @module ember-data
  */

  "use strict";

  var MapWithDefault = _ember["default"].MapWithDefault;var get = _ember["default"].get;

  /**
    @class RecordArrayManager
    @namespace DS
    @private
    @extends Ember.Object
  */
  exports["default"] = _ember["default"].Object.extend({
    init: function init() {
      var _this = this;

      this.filteredRecordArrays = MapWithDefault.create({
        defaultValue: function defaultValue() {
          return [];
        }
      });

      this.liveRecordArrays = MapWithDefault.create({
        defaultValue: function defaultValue(typeClass) {
          return _this.createRecordArray(typeClass);
        }
      });

      this.changedRecords = [];
      this._adapterPopulatedRecordArrays = [];
    },

    recordDidChange: function recordDidChange(record) {
      if (this.changedRecords.push(record) !== 1) {
        return;
      }

      _ember["default"].run.schedule('actions', this, this.updateRecordArrays);
    },

    recordArraysForRecord: function recordArraysForRecord(record) {
      record._recordArrays = record._recordArrays || _emberDataPrivateSystemOrderedSet["default"].create();
      return record._recordArrays;
    },

    /**
      This method is invoked whenever data is loaded into the store by the
      adapter or updated by the adapter, or when a record has changed.
       It updates all record arrays that a record belongs to.
       To avoid thrashing, it only runs at most once per run loop.
       @method updateRecordArrays
    */
    updateRecordArrays: function updateRecordArrays() {
      var _this2 = this;

      this.changedRecords.forEach(function (internalModel) {
        if (get(internalModel, 'record.isDestroyed') || get(internalModel, 'record.isDestroying') || get(internalModel, 'currentState.stateName') === 'root.deleted.saved') {
          _this2._recordWasDeleted(internalModel);
        } else {
          _this2._recordWasChanged(internalModel);
        }
      });

      this.changedRecords.length = 0;
    },

    _recordWasDeleted: function _recordWasDeleted(record) {
      var recordArrays = record._recordArrays;

      if (!recordArrays) {
        return;
      }

      recordArrays.forEach(function (array) {
        return array.removeInternalModel(record);
      });

      record._recordArrays = null;
    },

    _recordWasChanged: function _recordWasChanged(record) {
      var _this3 = this;

      var typeClass = record.type;
      var recordArrays = this.filteredRecordArrays.get(typeClass);
      var filter;
      recordArrays.forEach(function (array) {
        filter = get(array, 'filterFunction');
        _this3.updateFilterRecordArray(array, filter, typeClass, record);
      });
    },

    //Need to update live arrays on loading
    recordWasLoaded: function recordWasLoaded(record) {
      var _this4 = this;

      var typeClass = record.type;
      var recordArrays = this.filteredRecordArrays.get(typeClass);
      var filter;

      recordArrays.forEach(function (array) {
        filter = get(array, 'filterFunction');
        _this4.updateFilterRecordArray(array, filter, typeClass, record);
      });

      if (this.liveRecordArrays.has(typeClass)) {
        var liveRecordArray = this.liveRecordArrays.get(typeClass);
        this._addRecordToRecordArray(liveRecordArray, record);
      }
    },
    /**
      Update an individual filter.
       @method updateFilterRecordArray
      @param {DS.FilteredRecordArray} array
      @param {Function} filter
      @param {DS.Model} typeClass
      @param {InternalModel} record
    */
    updateFilterRecordArray: function updateFilterRecordArray(array, filter, typeClass, record) {
      var shouldBeInArray = filter(record.getRecord());
      var recordArrays = this.recordArraysForRecord(record);
      if (shouldBeInArray) {
        this._addRecordToRecordArray(array, record);
      } else {
        recordArrays["delete"](array);
        array.removeInternalModel(record);
      }
    },

    _addRecordToRecordArray: function _addRecordToRecordArray(array, record) {
      var recordArrays = this.recordArraysForRecord(record);
      if (!recordArrays.has(array)) {
        array.addInternalModel(record);
        recordArrays.add(array);
      }
    },

    populateLiveRecordArray: function populateLiveRecordArray(array, modelName) {
      var typeMap = this.store.typeMapFor(modelName);
      var records = typeMap.records;
      var record;

      for (var i = 0; i < records.length; i++) {
        record = records[i];

        if (!record.isDeleted() && !record.isEmpty()) {
          this._addRecordToRecordArray(array, record);
        }
      }
    },

    /**
      This method is invoked if the `filterFunction` property is
      changed on a `DS.FilteredRecordArray`.
       It essentially re-runs the filter from scratch. This same
      method is invoked when the filter is created in th first place.
       @method updateFilter
      @param {Array} array
      @param {String} modelName
      @param {Function} filter
    */
    updateFilter: function updateFilter(array, modelName, filter) {
      var typeMap = this.store.typeMapFor(modelName);
      var records = typeMap.records;
      var record;

      for (var i = 0; i < records.length; i++) {
        record = records[i];

        if (!record.isDeleted() && !record.isEmpty()) {
          this.updateFilterRecordArray(array, filter, modelName, record);
        }
      }
    },

    /**
      Get the `DS.RecordArray` for a type, which contains all loaded records of
      given type.
       @method liveRecordArrayFor
      @param {Class} typeClass
      @return {DS.RecordArray}
    */
    liveRecordArrayFor: function liveRecordArrayFor(typeClass) {
      return this.liveRecordArrays.get(typeClass);
    },

    /**
      Create a `DS.RecordArray` for a type.
       @method createRecordArray
      @param {Class} typeClass
      @return {DS.RecordArray}
    */
    createRecordArray: function createRecordArray(typeClass) {
      var array = _emberDataPrivateSystemRecordArrays.RecordArray.create({
        type: typeClass,
        content: _ember["default"].A(),
        store: this.store,
        isLoaded: true,
        manager: this
      });

      return array;
    },

    /**
      Create a `DS.FilteredRecordArray` for a type and register it for updates.
       @method createFilteredRecordArray
      @param {DS.Model} typeClass
      @param {Function} filter
      @param {Object} query (optional
      @return {DS.FilteredRecordArray}
    */
    createFilteredRecordArray: function createFilteredRecordArray(typeClass, filter, query) {
      var array = _emberDataPrivateSystemRecordArrays.FilteredRecordArray.create({
        query: query,
        type: typeClass,
        content: _ember["default"].A(),
        store: this.store,
        manager: this,
        filterFunction: filter
      });

      this.registerFilteredRecordArray(array, typeClass, filter);

      return array;
    },

    /**
      Create a `DS.AdapterPopulatedRecordArray` for a type with given query.
       @method createAdapterPopulatedRecordArray
      @param {DS.Model} typeClass
      @param {Object} query
      @return {DS.AdapterPopulatedRecordArray}
    */
    createAdapterPopulatedRecordArray: function createAdapterPopulatedRecordArray(typeClass, query) {
      var array = _emberDataPrivateSystemRecordArrays.AdapterPopulatedRecordArray.create({
        type: typeClass,
        query: query,
        content: _ember["default"].A(),
        store: this.store,
        manager: this
      });

      this._adapterPopulatedRecordArrays.push(array);

      return array;
    },

    /**
      Register a RecordArray for a given type to be backed by
      a filter function. This will cause the array to update
      automatically when records of that type change attribute
      values or states.
       @method registerFilteredRecordArray
      @param {DS.RecordArray} array
      @param {DS.Model} typeClass
      @param {Function} filter
    */
    registerFilteredRecordArray: function registerFilteredRecordArray(array, typeClass, filter) {
      var recordArrays = this.filteredRecordArrays.get(typeClass);
      recordArrays.push(array);

      this.updateFilter(array, typeClass, filter);
    },

    /**
      Unregister a RecordArray.
      So manager will not update this array.
       @method unregisterRecordArray
      @param {DS.RecordArray} array
    */
    unregisterRecordArray: function unregisterRecordArray(array) {
      var typeClass = array.type;

      // unregister filtered record array
      var recordArrays = this.filteredRecordArrays.get(typeClass);
      var removedFromFiltered = remove(recordArrays, array);

      // remove from adapter populated record array
      var removedFromAdapterPopulated = remove(this._adapterPopulatedRecordArrays, array);

      if (!removedFromFiltered && !removedFromAdapterPopulated) {

        // unregister live record array
        if (this.liveRecordArrays.has(typeClass)) {
          var liveRecordArrayForType = this.liveRecordArrayFor(typeClass);
          if (array === liveRecordArrayForType) {
            this.liveRecordArrays["delete"](typeClass);
          }
        }
      }
    },

    willDestroy: function willDestroy() {
      this._super.apply(this, arguments);

      this.filteredRecordArrays.forEach(function (value) {
        return flatten(value).forEach(destroy);
      });
      this.liveRecordArrays.forEach(destroy);
      this._adapterPopulatedRecordArrays.forEach(destroy);
    }
  });

  function destroy(entry) {
    entry.destroy();
  }

  function flatten(list) {
    var length = list.length;
    var result = _ember["default"].A();

    for (var i = 0; i < length; i++) {
      result = result.concat(list[i]);
    }

    return result;
  }

  function remove(array, item) {
    var index = array.indexOf(item);

    if (index !== -1) {
      array.splice(index, 1);
      return true;
    }

    return false;
  }
});
define("ember-data/-private/system/record-arrays", ["exports", "ember-data/-private/system/record-arrays/record-array", "ember-data/-private/system/record-arrays/filtered-record-array", "ember-data/-private/system/record-arrays/adapter-populated-record-array"], function (exports, _emberDataPrivateSystemRecordArraysRecordArray, _emberDataPrivateSystemRecordArraysFilteredRecordArray, _emberDataPrivateSystemRecordArraysAdapterPopulatedRecordArray) {
  /**
    @module ember-data
  */

  "use strict";

  exports.RecordArray = _emberDataPrivateSystemRecordArraysRecordArray["default"];
  exports.FilteredRecordArray = _emberDataPrivateSystemRecordArraysFilteredRecordArray["default"];
  exports.AdapterPopulatedRecordArray = _emberDataPrivateSystemRecordArraysAdapterPopulatedRecordArray["default"];
});
define("ember-data/-private/system/record-arrays/adapter-populated-record-array", ["exports", "ember", "ember-data/-private/system/record-arrays/record-array", "ember-data/-private/system/clone-null", "ember-data/-private/features"], function (exports, _ember, _emberDataPrivateSystemRecordArraysRecordArray, _emberDataPrivateSystemCloneNull, _emberDataPrivateFeatures) {
  "use strict";

  /**
    @module ember-data
  */

  var get = _ember["default"].get;

  /**
    Represents an ordered list of records whose order and membership is
    determined by the adapter. For example, a query sent to the adapter
    may trigger a search on the server, whose results would be loaded
    into an instance of the `AdapterPopulatedRecordArray`.
  
    ---
  
    If you want to update the array and get the latest records from the
    adapter, you can invoke [`update()`](#method_update):
  
    Example
  
    ```javascript
    // GET /users?isAdmin=true
    var admins = store.query('user', { isAdmin: true });
  
    admins.then(function() {
      console.log(admins.get("length")); // 42
    });
  
    // somewhere later in the app code, when new admins have been created
    // in the meantime
    //
    // GET /users?isAdmin=true
    admins.update().then(function() {
      admins.get('isUpdating'); // false
      console.log(admins.get("length")); // 123
    });
  
    admins.get('isUpdating'); // true
    ```
  
    @class AdapterPopulatedRecordArray
    @namespace DS
    @extends DS.RecordArray
  */
  exports["default"] = _emberDataPrivateSystemRecordArraysRecordArray["default"].extend({
    query: null,

    replace: function replace() {
      var type = get(this, 'type').toString();
      throw new Error("The result of a server query (on " + type + ") is immutable.");
    },

    _update: function _update() {
      var store = get(this, 'store');
      var modelName = get(this, 'type.modelName');
      var query = get(this, 'query');

      return store._query(modelName, query, this);
    },

    /**
      @method loadRecords
      @param {Array} records
      @param {Object} payload normalized payload
      @private
    */
    loadRecords: function loadRecords(records, payload) {
      var _this = this;

      //TODO Optimize
      var internalModels = _ember["default"].A(records).mapBy('_internalModel');
      this.setProperties({
        content: _ember["default"].A(internalModels),
        isLoaded: true,
        isUpdating: false,
        meta: (0, _emberDataPrivateSystemCloneNull["default"])(payload.meta)
      });

      if (true) {
        this.set('links', (0, _emberDataPrivateSystemCloneNull["default"])(payload.links));
      }

      internalModels.forEach(function (record) {
        _this.manager.recordArraysForRecord(record).add(_this);
      });

      // TODO: should triggering didLoad event be the last action of the runLoop?
      _ember["default"].run.once(this, 'trigger', 'didLoad');
    }
  });
});
define('ember-data/-private/system/record-arrays/filtered-record-array', ['exports', 'ember', 'ember-data/-private/system/record-arrays/record-array'], function (exports, _ember, _emberDataPrivateSystemRecordArraysRecordArray) {
  'use strict';

  /**
    @module ember-data
  */

  var get = _ember['default'].get;

  /**
    Represents a list of records whose membership is determined by the
    store. As records are created, loaded, or modified, the store
    evaluates them to determine if they should be part of the record
    array.
  
    @class FilteredRecordArray
    @namespace DS
    @extends DS.RecordArray
  */
  exports['default'] = _emberDataPrivateSystemRecordArraysRecordArray['default'].extend({
    /**
      The filterFunction is a function used to test records from the store to
      determine if they should be part of the record array.
       Example
       ```javascript
      var allPeople = store.peekAll('person');
      allPeople.mapBy('name'); // ["Tom Dale", "Yehuda Katz", "Trek Glowacki"]
       var people = store.filter('person', function(person) {
        if (person.get('name').match(/Katz$/)) { return true; }
      });
      people.mapBy('name'); // ["Yehuda Katz"]
       var notKatzFilter = function(person) {
        return !person.get('name').match(/Katz$/);
      };
      people.set('filterFunction', notKatzFilter);
      people.mapBy('name'); // ["Tom Dale", "Trek Glowacki"]
      ```
       @method filterFunction
      @param {DS.Model} record
      @return {Boolean} `true` if the record should be in the array
    */
    filterFunction: null,
    isLoaded: true,

    replace: function replace() {
      var type = get(this, 'type').toString();
      throw new Error("The result of a client-side filter (on " + type + ") is immutable.");
    },

    /**
      @method updateFilter
      @private
    */
    _updateFilter: function _updateFilter() {
      var manager = get(this, 'manager');
      manager.updateFilter(this, get(this, 'type'), get(this, 'filterFunction'));
    },

    updateFilter: _ember['default'].observer('filterFunction', function () {
      _ember['default'].run.once(this, this._updateFilter);
    })
  });
});
define("ember-data/-private/system/record-arrays/record-array", ["exports", "ember", "ember-data/-private/system/promise-proxies", "ember-data/-private/system/snapshot-record-array"], function (exports, _ember, _emberDataPrivateSystemPromiseProxies, _emberDataPrivateSystemSnapshotRecordArray) {
  /**
    @module ember-data
  */

  "use strict";

  var get = _ember["default"].get;
  var set = _ember["default"].set;

  /**
    A record array is an array that contains records of a certain type. The record
    array materializes records as needed when they are retrieved for the first
    time. You should not create record arrays yourself. Instead, an instance of
    `DS.RecordArray` or its subclasses will be returned by your application's store
    in response to queries.
  
    @class RecordArray
    @namespace DS
    @extends Ember.ArrayProxy
    @uses Ember.Evented
  */

  exports["default"] = _ember["default"].ArrayProxy.extend(_ember["default"].Evented, {
    /**
      The model type contained by this record array.
       @property type
      @type DS.Model
    */
    type: null,

    /**
      The array of client ids backing the record array. When a
      record is requested from the record array, the record
      for the client id at the same index is materialized, if
      necessary, by the store.
       @property content
      @private
      @type Ember.Array
    */
    content: null,

    /**
      The flag to signal a `RecordArray` is finished loading data.
       Example
       ```javascript
      var people = store.peekAll('person');
      people.get('isLoaded'); // true
      ```
       @property isLoaded
      @type Boolean
    */
    isLoaded: false,
    /**
      The flag to signal a `RecordArray` is currently loading data.
       Example
       ```javascript
      var people = store.peekAll('person');
      people.get('isUpdating'); // false
      people.update();
      people.get('isUpdating'); // true
      ```
       @property isUpdating
      @type Boolean
    */
    isUpdating: false,

    /**
      The store that created this record array.
       @property store
      @private
      @type DS.Store
    */
    store: null,

    replace: function replace() {
      var type = get(this, 'type').toString();
      throw new Error("The result of a server query (for all " + type + " types) is immutable. To modify contents, use toArray()");
    },

    /**
      Retrieves an object from the content by index.
       @method objectAtContent
      @private
      @param {Number} index
      @return {DS.Model} record
    */
    objectAtContent: function objectAtContent(index) {
      var content = get(this, 'content');
      var internalModel = content.objectAt(index);
      return internalModel && internalModel.getRecord();
    },

    /**
      Used to get the latest version of all of the records in this array
      from the adapter.
       Example
       ```javascript
      var people = store.peekAll('person');
      people.get('isUpdating'); // false
       people.update().then(function() {
        people.get('isUpdating'); // false
      });
       people.get('isUpdating'); // true
      ```
       @method update
    */
    update: function update() {
      if (get(this, 'isUpdating')) {
        return;
      }

      this.set('isUpdating', true);
      return this._update();
    },

    /*
      Update this RecordArray and return a promise which resolves once the update
      is finished.
     */
    _update: function _update() {
      var store = get(this, 'store');
      var modelName = get(this, 'type.modelName');

      return store.findAll(modelName, { reload: true });
    },

    /**
      Adds an internal model to the `RecordArray` without duplicates
       @method addInternalModel
      @private
      @param {InternalModel} internalModel
      @param {number} an optional index to insert at
    */
    addInternalModel: function addInternalModel(internalModel, idx) {
      var content = get(this, 'content');
      if (idx === undefined) {
        content.addObject(internalModel);
      } else if (!content.includes(internalModel)) {
        content.insertAt(idx, internalModel);
      }
    },

    /**
      Removes an internalModel to the `RecordArray`.
       @method removeInternalModel
      @private
      @param {InternalModel} internalModel
    */
    removeInternalModel: function removeInternalModel(internalModel) {
      get(this, 'content').removeObject(internalModel);
    },

    /**
      Saves all of the records in the `RecordArray`.
       Example
       ```javascript
      var messages = store.peekAll('message');
      messages.forEach(function(message) {
        message.set('hasBeenSeen', true);
      });
      messages.save();
      ```
       @method save
      @return {DS.PromiseArray} promise
    */
    save: function save() {
      var recordArray = this;
      var promiseLabel = "DS: RecordArray#save " + get(this, 'type');
      var promise = _ember["default"].RSVP.all(this.invoke("save"), promiseLabel).then(function (array) {
        return recordArray;
      }, null, "DS: RecordArray#save return RecordArray");

      return _emberDataPrivateSystemPromiseProxies.PromiseArray.create({ promise: promise });
    },

    _dissociateFromOwnRecords: function _dissociateFromOwnRecords() {
      var _this = this;

      this.get('content').forEach(function (record) {
        var recordArrays = record._recordArrays;

        if (recordArrays) {
          recordArrays["delete"](_this);
        }
      });
    },

    /**
      @method _unregisterFromManager
      @private
    */
    _unregisterFromManager: function _unregisterFromManager() {
      var manager = get(this, 'manager');
      manager.unregisterRecordArray(this);
    },

    willDestroy: function willDestroy() {
      this._unregisterFromManager();
      this._dissociateFromOwnRecords();
      set(this, 'content', undefined);
      set(this, 'length', 0);
      this._super.apply(this, arguments);
    },

    createSnapshot: function createSnapshot(options) {
      var meta = this.get('meta');
      return new _emberDataPrivateSystemSnapshotRecordArray["default"](this, meta, options);
    }
  });
});
define('ember-data/-private/system/references', ['exports', 'ember-data/-private/system/references/record', 'ember-data/-private/system/references/belongs-to', 'ember-data/-private/system/references/has-many'], function (exports, _emberDataPrivateSystemReferencesRecord, _emberDataPrivateSystemReferencesBelongsTo, _emberDataPrivateSystemReferencesHasMany) {
  'use strict';

  exports.RecordReference = _emberDataPrivateSystemReferencesRecord['default'];
  exports.BelongsToReference = _emberDataPrivateSystemReferencesBelongsTo['default'];
  exports.HasManyReference = _emberDataPrivateSystemReferencesHasMany['default'];
});
define('ember-data/-private/system/references/belongs-to', ['exports', 'ember-data/model', 'ember', 'ember-data/-private/system/references/reference', 'ember-data/-private/features', 'ember-data/-private/debug'], function (exports, _emberDataModel, _ember, _emberDataPrivateSystemReferencesReference, _emberDataPrivateFeatures, _emberDataPrivateDebug) {
  'use strict';

  var BelongsToReference = function BelongsToReference(store, parentInternalModel, belongsToRelationship) {
    this._super$constructor(store, parentInternalModel);
    this.belongsToRelationship = belongsToRelationship;
    this.type = belongsToRelationship.relationshipMeta.type;
    this.parent = parentInternalModel.recordReference;

    // TODO inverse
  };

  BelongsToReference.prototype = Object.create(_emberDataPrivateSystemReferencesReference['default'].prototype);
  BelongsToReference.prototype.constructor = BelongsToReference;
  BelongsToReference.prototype._super$constructor = _emberDataPrivateSystemReferencesReference['default'];

  BelongsToReference.prototype.remoteType = function () {
    if (this.belongsToRelationship.link) {
      return "link";
    }

    return "id";
  };

  BelongsToReference.prototype.id = function () {
    var inverseRecord = this.belongsToRelationship.inverseRecord;
    return inverseRecord && inverseRecord.id;
  };

  BelongsToReference.prototype.link = function () {
    return this.belongsToRelationship.link;
  };

  BelongsToReference.prototype.meta = function () {
    return this.belongsToRelationship.meta;
  };

  BelongsToReference.prototype.push = function (objectOrPromise) {
    var _this = this;

    return _ember['default'].RSVP.resolve(objectOrPromise).then(function (data) {
      var record;

      if (data instanceof _emberDataModel['default']) {
        if (false) {
          (0, _emberDataPrivateDebug.deprecate)("BelongsToReference#push(DS.Model) is deprecated. Update relationship via `model.set('relationshipName', value)` instead.", false, {
            id: 'ds.references.belongs-to.push-record',
            until: '3.0'
          });
        }
        record = data;
      } else {
        record = _this.store.push(data);
      }

      (0, _emberDataPrivateDebug.assertPolymorphicType)(_this.internalModel, _this.belongsToRelationship.relationshipMeta, record._internalModel);

      _this.belongsToRelationship.setCanonicalRecord(record._internalModel);

      return record;
    });
  };

  BelongsToReference.prototype.value = function () {
    var inverseRecord = this.belongsToRelationship.inverseRecord;

    if (inverseRecord && inverseRecord.record) {
      return inverseRecord.record;
    }

    return null;
  };

  BelongsToReference.prototype.load = function () {
    var _this2 = this;

    if (this.remoteType() === "id") {
      return this.belongsToRelationship.getRecord();
    }

    if (this.remoteType() === "link") {
      return this.belongsToRelationship.findLink().then(function (internalModel) {
        return _this2.value();
      });
    }
  };

  BelongsToReference.prototype.reload = function () {
    var _this3 = this;

    return this.belongsToRelationship.reload().then(function (internalModel) {
      return _this3.value();
    });
  };

  exports['default'] = BelongsToReference;
});
define('ember-data/-private/system/references/has-many', ['exports', 'ember', 'ember-data/-private/system/references/reference', 'ember-data/-private/debug', 'ember-data/-private/features'], function (exports, _ember, _emberDataPrivateSystemReferencesReference, _emberDataPrivateDebug, _emberDataPrivateFeatures) {
  'use strict';

  var get = _ember['default'].get;

  var HasManyReference = function HasManyReference(store, parentInternalModel, hasManyRelationship) {
    this._super$constructor(store, parentInternalModel);
    this.hasManyRelationship = hasManyRelationship;
    this.type = hasManyRelationship.relationshipMeta.type;
    this.parent = parentInternalModel.recordReference;

    // TODO inverse
  };

  HasManyReference.prototype = Object.create(_emberDataPrivateSystemReferencesReference['default'].prototype);
  HasManyReference.prototype.constructor = HasManyReference;
  HasManyReference.prototype._super$constructor = _emberDataPrivateSystemReferencesReference['default'];

  HasManyReference.prototype.remoteType = function () {
    if (this.hasManyRelationship.link) {
      return "link";
    }

    return "ids";
  };

  HasManyReference.prototype.link = function () {
    return this.hasManyRelationship.link;
  };

  HasManyReference.prototype.ids = function () {
    var members = this.hasManyRelationship.members;
    var ids = members.toArray().map(function (internalModel) {
      return internalModel.id;
    });

    return ids;
  };

  HasManyReference.prototype.meta = function () {
    return this.hasManyRelationship.manyArray.meta;
  };

  HasManyReference.prototype.push = function (objectOrPromise) {
    var _this = this;

    return _ember['default'].RSVP.resolve(objectOrPromise).then(function (payload) {
      var array = payload;

      if (false) {
        (0, _emberDataPrivateDebug.deprecate)("HasManyReference#push(array) is deprecated. Push a JSON-API document instead.", !Array.isArray(payload), {
          id: 'ds.references.has-many.push-array',
          until: '3.0'
        });
      }

      var useLegacyArrayPush = true;
      if (typeof payload === "object" && payload.data) {
        array = payload.data;
        useLegacyArrayPush = array.length && array[0].data;

        if (false) {
          (0, _emberDataPrivateDebug.deprecate)("HasManyReference#push() expects a valid JSON-API document.", !useLegacyArrayPush, {
            id: 'ds.references.has-many.push-invalid-json-api',
            until: '3.0'
          });
        }
      }

      if (!false) {
        useLegacyArrayPush = true;
      }

      var internalModels = undefined;
      if (useLegacyArrayPush) {
        internalModels = array.map(function (obj) {
          var record = _this.store.push(obj);

          (0, _emberDataPrivateDebug.runInDebug)(function () {
            var relationshipMeta = _this.hasManyRelationship.relationshipMeta;
            (0, _emberDataPrivateDebug.assertPolymorphicType)(_this.internalModel, relationshipMeta, record._internalModel);
          });

          return record._internalModel;
        });
      } else {
        var records = _this.store.push(payload);
        internalModels = _ember['default'].A(records).mapBy('_internalModel');

        (0, _emberDataPrivateDebug.runInDebug)(function () {
          internalModels.forEach(function (internalModel) {
            var relationshipMeta = _this.hasManyRelationship.relationshipMeta;
            (0, _emberDataPrivateDebug.assertPolymorphicType)(_this.internalModel, relationshipMeta, internalModel);
          });
        });
      }

      _this.hasManyRelationship.computeChanges(internalModels);

      return _this.hasManyRelationship.manyArray;
    });
  };

  HasManyReference.prototype._isLoaded = function () {
    var hasData = get(this.hasManyRelationship, 'hasData');
    if (!hasData) {
      return false;
    }

    var members = this.hasManyRelationship.members.toArray();
    var isEveryLoaded = members.every(function (internalModel) {
      return internalModel.isLoaded() === true;
    });

    return isEveryLoaded;
  };

  HasManyReference.prototype.value = function () {
    if (this._isLoaded()) {
      return this.hasManyRelationship.manyArray;
    }

    return null;
  };

  HasManyReference.prototype.load = function () {
    if (!this._isLoaded()) {
      return this.hasManyRelationship.getRecords();
    }

    var manyArray = this.hasManyRelationship.manyArray;
    return _ember['default'].RSVP.resolve(manyArray);
  };

  HasManyReference.prototype.reload = function () {
    return this.hasManyRelationship.reload();
  };

  exports['default'] = HasManyReference;
});
define('ember-data/-private/system/references/record', ['exports', 'ember', 'ember-data/-private/system/references/reference'], function (exports, _ember, _emberDataPrivateSystemReferencesReference) {
  'use strict';

  var RecordReference = function RecordReference(store, internalModel) {
    this._super$constructor(store, internalModel);
    this.type = internalModel.modelName;
    this._id = internalModel.id;
  };

  RecordReference.prototype = Object.create(_emberDataPrivateSystemReferencesReference['default'].prototype);
  RecordReference.prototype.constructor = RecordReference;
  RecordReference.prototype._super$constructor = _emberDataPrivateSystemReferencesReference['default'];

  RecordReference.prototype.id = function () {
    return this._id;
  };

  RecordReference.prototype.remoteType = function () {
    return 'identity';
  };

  RecordReference.prototype.push = function (objectOrPromise) {
    var _this = this;

    return _ember['default'].RSVP.resolve(objectOrPromise).then(function (data) {
      var record = _this.store.push(data);
      return record;
    });
  };

  RecordReference.prototype.value = function () {
    return this.internalModel.record;
  };

  RecordReference.prototype.load = function () {
    return this.store.findRecord(this.type, this._id);
  };

  RecordReference.prototype.reload = function () {
    var record = this.value();
    if (record) {
      return record.reload();
    }

    return this.load();
  };

  exports['default'] = RecordReference;
});
define("ember-data/-private/system/references/reference", ["exports"], function (exports) {
  "use strict";

  var Reference = function Reference(store, internalModel) {
    this.store = store;
    this.internalModel = internalModel;
  };

  Reference.prototype = {
    constructor: Reference
  };

  exports["default"] = Reference;
});
define('ember-data/-private/system/relationship-meta', ['exports', 'ember-inflector', 'ember-data/-private/system/normalize-model-name'], function (exports, _emberInflector, _emberDataPrivateSystemNormalizeModelName) {
  'use strict';

  exports.typeForRelationshipMeta = typeForRelationshipMeta;
  exports.relationshipFromMeta = relationshipFromMeta;

  function typeForRelationshipMeta(meta) {
    var modelName;

    modelName = meta.type || meta.key;
    if (meta.kind === 'hasMany') {
      modelName = (0, _emberInflector.singularize)((0, _emberDataPrivateSystemNormalizeModelName['default'])(modelName));
    }
    return modelName;
  }

  function relationshipFromMeta(meta) {
    return {
      key: meta.key,
      kind: meta.kind,
      type: typeForRelationshipMeta(meta),
      options: meta.options,
      parentType: meta.parentType,
      isRelationship: true
    };
  }
});
define("ember-data/-private/system/relationships/belongs-to", ["exports", "ember", "ember-data/-private/debug", "ember-data/-private/system/normalize-model-name"], function (exports, _ember, _emberDataPrivateDebug, _emberDataPrivateSystemNormalizeModelName) {
  "use strict";

  exports["default"] = belongsTo;

  /**
    `DS.belongsTo` is used to define One-To-One and One-To-Many
    relationships on a [DS.Model](/api/data/classes/DS.Model.html).
  
  
    `DS.belongsTo` takes an optional hash as a second parameter, currently
    supported options are:
  
    - `async`: A boolean value used to explicitly declare this to be an async relationship.
    - `inverse`: A string used to identify the inverse property on a
      related model in a One-To-Many relationship. See [Explicit Inverses](#toc_explicit-inverses)
  
    #### One-To-One
    To declare a one-to-one relationship between two models, use
    `DS.belongsTo`:
  
    ```app/models/user.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      profile: DS.belongsTo('profile')
    });
    ```
  
    ```app/models/profile.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      user: DS.belongsTo('user')
    });
    ```
  
    #### One-To-Many
    To declare a one-to-many relationship between two models, use
    `DS.belongsTo` in combination with `DS.hasMany`, like this:
  
    ```app/models/post.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      comments: DS.hasMany('comment')
    });
    ```
  
    ```app/models/comment.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      post: DS.belongsTo('post')
    });
    ```
  
    You can avoid passing a string as the first parameter. In that case Ember Data
    will infer the type from the key name.
  
    ```app/models/comment.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      post: DS.belongsTo()
    });
    ```
  
    will lookup for a Post type.
  
    @namespace
    @method belongsTo
    @for DS
    @param {String} modelName (optional) type of the relationship
    @param {Object} options (optional) a hash of options
    @return {Ember.computed} relationship
  */
  function belongsTo(modelName, options) {
    var opts, userEnteredModelName;
    if (typeof modelName === 'object') {
      opts = modelName;
      userEnteredModelName = undefined;
    } else {
      opts = options;
      userEnteredModelName = modelName;
    }

    if (typeof userEnteredModelName === 'string') {
      userEnteredModelName = (0, _emberDataPrivateSystemNormalizeModelName["default"])(userEnteredModelName);
    }

    (0, _emberDataPrivateDebug.assert)("The first argument to DS.belongsTo must be a string representing a model type key, not an instance of " + _ember["default"].inspect(userEnteredModelName) + ". E.g., to define a relation to the Person model, use DS.belongsTo('person')", typeof userEnteredModelName === 'string' || typeof userEnteredModelName === 'undefined');

    opts = opts || {};

    var meta = {
      type: userEnteredModelName,
      isRelationship: true,
      options: opts,
      kind: 'belongsTo',
      key: null
    };

    return _ember["default"].computed({
      get: function get(key) {
        if (opts.hasOwnProperty('serialize')) {
          (0, _emberDataPrivateDebug.warn)("You provided a serialize option on the \"" + key + "\" property in the \"" + this._internalModel.modelName + "\" class, this belongs in the serializer. See DS.Serializer and it's implementations http://emberjs.com/api/data/classes/DS.Serializer.html", false, {
            id: 'ds.model.serialize-option-in-belongs-to'
          });
        }

        if (opts.hasOwnProperty('embedded')) {
          (0, _emberDataPrivateDebug.warn)("You provided an embedded option on the \"" + key + "\" property in the \"" + this._internalModel.modelName + "\" class, this belongs in the serializer. See DS.EmbeddedRecordsMixin http://emberjs.com/api/data/classes/DS.EmbeddedRecordsMixin.html", false, {
            id: 'ds.model.embedded-option-in-belongs-to'
          });
        }

        return this._internalModel._relationships.get(key).getRecord();
      },
      set: function set(key, value) {
        if (value === undefined) {
          value = null;
        }
        if (value && value.then) {
          this._internalModel._relationships.get(key).setRecordPromise(value);
        } else if (value) {
          this._internalModel._relationships.get(key).setRecord(value._internalModel);
        } else {
          this._internalModel._relationships.get(key).setRecord(value);
        }

        return this._internalModel._relationships.get(key).getRecord();
      }
    }).meta(meta);
  }

  /*
    These observers observe all `belongsTo` relationships on the record. See
    `relationships/ext` to see how these observers get their dependencies.
  */
  var BelongsToMixin = _ember["default"].Mixin.create({
    notifyBelongsToChanged: function notifyBelongsToChanged(key) {
      this.notifyPropertyChange(key);
    }
  });
  exports.BelongsToMixin = BelongsToMixin;
});
define("ember-data/-private/system/relationships/ext", ["exports", "ember", "ember-data/-private/debug", "ember-data/-private/system/relationship-meta", "ember-data/-private/system/empty-object"], function (exports, _ember, _emberDataPrivateDebug, _emberDataPrivateSystemRelationshipMeta, _emberDataPrivateSystemEmptyObject) {
  "use strict";

  var get = _ember["default"].get;
  var Map = _ember["default"].Map;
  var MapWithDefault = _ember["default"].MapWithDefault;

  var relationshipsDescriptor = _ember["default"].computed(function () {
    if (_ember["default"].testing === true && relationshipsDescriptor._cacheable === true) {
      relationshipsDescriptor._cacheable = false;
    }

    var map = new MapWithDefault({
      defaultValue: function defaultValue() {
        return [];
      }
    });

    // Loop through each computed property on the class
    this.eachComputedProperty(function (name, meta) {
      // If the computed property is a relationship, add
      // it to the map.
      if (meta.isRelationship) {
        meta.key = name;
        var relationshipsForType = map.get((0, _emberDataPrivateSystemRelationshipMeta.typeForRelationshipMeta)(meta));

        relationshipsForType.push({
          name: name,
          kind: meta.kind
        });
      }
    });

    return map;
  }).readOnly();

  var relatedTypesDescriptor = _ember["default"].computed(function () {
    var _this = this;

    if (_ember["default"].testing === true && relatedTypesDescriptor._cacheable === true) {
      relatedTypesDescriptor._cacheable = false;
    }

    var modelName;
    var types = _ember["default"].A();

    // Loop through each computed property on the class,
    // and create an array of the unique types involved
    // in relationships
    this.eachComputedProperty(function (name, meta) {
      if (meta.isRelationship) {
        meta.key = name;
        modelName = (0, _emberDataPrivateSystemRelationshipMeta.typeForRelationshipMeta)(meta);

        (0, _emberDataPrivateDebug.assert)("You specified a hasMany (" + meta.type + ") on " + meta.parentType + " but " + meta.type + " was not found.", modelName);

        if (!types.includes(modelName)) {
          (0, _emberDataPrivateDebug.assert)("Trying to sideload " + name + " on " + _this.toString() + " but the type doesn't exist.", !!modelName);
          types.push(modelName);
        }
      }
    });

    return types;
  }).readOnly();

  var relationshipsByNameDescriptor = _ember["default"].computed(function () {
    if (_ember["default"].testing === true && relationshipsByNameDescriptor._cacheable === true) {
      relationshipsByNameDescriptor._cacheable = false;
    }

    var map = Map.create();

    this.eachComputedProperty(function (name, meta) {
      if (meta.isRelationship) {
        meta.key = name;
        var relationship = (0, _emberDataPrivateSystemRelationshipMeta.relationshipFromMeta)(meta);
        relationship.type = (0, _emberDataPrivateSystemRelationshipMeta.typeForRelationshipMeta)(meta);
        map.set(name, relationship);
      }
    });

    return map;
  }).readOnly();

  /**
    @module ember-data
  */

  /*
    This file defines several extensions to the base `DS.Model` class that
    add support for one-to-many relationships.
  */

  /**
    @class Model
    @namespace DS
  */
  var DidDefinePropertyMixin = _ember["default"].Mixin.create({

    /**
      This Ember.js hook allows an object to be notified when a property
      is defined.
       In this case, we use it to be notified when an Ember Data user defines a
      belongs-to relationship. In that case, we need to set up observers for
      each one, allowing us to track relationship changes and automatically
      reflect changes in the inverse has-many array.
       This hook passes the class being set up, as well as the key and value
      being defined. So, for example, when the user does this:
       ```javascript
      DS.Model.extend({
        parent: DS.belongsTo('user')
      });
      ```
       This hook would be called with "parent" as the key and the computed
      property returned by `DS.belongsTo` as the value.
       @method didDefineProperty
      @param {Object} proto
      @param {String} key
      @param {Ember.ComputedProperty} value
    */
    didDefineProperty: function didDefineProperty(proto, key, value) {
      // Check if the value being set is a computed property.
      if (value instanceof _ember["default"].ComputedProperty) {

        // If it is, get the metadata for the relationship. This is
        // populated by the `DS.belongsTo` helper when it is creating
        // the computed property.
        var meta = value.meta();

        meta.parentType = proto.constructor;
      }
    }
  });

  exports.DidDefinePropertyMixin = DidDefinePropertyMixin;

  /*
    These DS.Model extensions add class methods that provide relationship
    introspection abilities about relationships.
  
    A note about the computed properties contained here:
  
    **These properties are effectively sealed once called for the first time.**
    To avoid repeatedly doing expensive iteration over a model's fields, these
    values are computed once and then cached for the remainder of the runtime of
    your application.
  
    If your application needs to modify a class after its initial definition
    (for example, using `reopen()` to add additional attributes), make sure you
    do it before using your model with the store, which uses these properties
    extensively.
  */

  var RelationshipsClassMethodsMixin = _ember["default"].Mixin.create({

    /**
      For a given relationship name, returns the model type of the relationship.
       For example, if you define a model like this:
       ```app/models/post.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        comments: DS.hasMany('comment')
      });
     ```
       Calling `App.Post.typeForRelationship('comments')` will return `App.Comment`.
       @method typeForRelationship
      @static
      @param {String} name the name of the relationship
      @param {store} store an instance of DS.Store
      @return {DS.Model} the type of the relationship, or undefined
    */
    typeForRelationship: function typeForRelationship(name, store) {
      var relationship = get(this, 'relationshipsByName').get(name);
      return relationship && store.modelFor(relationship.type);
    },

    inverseMap: _ember["default"].computed(function () {
      return new _emberDataPrivateSystemEmptyObject["default"]();
    }),

    /**
      Find the relationship which is the inverse of the one asked for.
       For example, if you define models like this:
       ```app/models/post.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        comments: DS.hasMany('message')
      });
      ```
       ```app/models/message.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        owner: DS.belongsTo('post')
      });
      ```
       App.Post.inverseFor('comments') -> { type: App.Message, name: 'owner', kind: 'belongsTo' }
      App.Message.inverseFor('owner') -> { type: App.Post, name: 'comments', kind: 'hasMany' }
       @method inverseFor
      @static
      @param {String} name the name of the relationship
      @return {Object} the inverse relationship, or null
    */
    inverseFor: function inverseFor(name, store) {
      var inverseMap = get(this, 'inverseMap');
      if (inverseMap[name]) {
        return inverseMap[name];
      } else {
        var inverse = this._findInverseFor(name, store);
        inverseMap[name] = inverse;
        return inverse;
      }
    },

    //Calculate the inverse, ignoring the cache
    _findInverseFor: function _findInverseFor(name, store) {

      var inverseType = this.typeForRelationship(name, store);
      if (!inverseType) {
        return null;
      }

      var propertyMeta = this.metaForProperty(name);
      //If inverse is manually specified to be null, like  `comments: DS.hasMany('message', { inverse: null })`
      var options = propertyMeta.options;
      if (options.inverse === null) {
        return null;
      }

      var inverseName, inverseKind, inverse;

      //If inverse is specified manually, return the inverse
      if (options.inverse) {
        inverseName = options.inverse;
        inverse = _ember["default"].get(inverseType, 'relationshipsByName').get(inverseName);

        (0, _emberDataPrivateDebug.assert)("We found no inverse relationships by the name of '" + inverseName + "' on the '" + inverseType.modelName + "' model. This is most likely due to a missing attribute on your model definition.", !_ember["default"].isNone(inverse));

        inverseKind = inverse.kind;
      } else {
        //No inverse was specified manually, we need to use a heuristic to guess one
        if (propertyMeta.type === propertyMeta.parentType.modelName) {
          (0, _emberDataPrivateDebug.warn)("Detected a reflexive relationship by the name of '" + name + "' without an inverse option. Look at http://emberjs.com/guides/models/defining-models/#toc_reflexive-relation for how to explicitly specify inverses.", false, {
            id: 'ds.model.reflexive-relationship-without-inverse'
          });
        }

        var possibleRelationships = findPossibleInverses(this, inverseType);

        if (possibleRelationships.length === 0) {
          return null;
        }

        var filteredRelationships = possibleRelationships.filter(function (possibleRelationship) {
          var optionsForRelationship = inverseType.metaForProperty(possibleRelationship.name).options;
          return name === optionsForRelationship.inverse;
        });

        (0, _emberDataPrivateDebug.assert)("You defined the '" + name + "' relationship on " + this + ", but you defined the inverse relationships of type " + inverseType.toString() + " multiple times. Look at http://emberjs.com/guides/models/defining-models/#toc_explicit-inverses for how to explicitly specify inverses", filteredRelationships.length < 2);

        if (filteredRelationships.length === 1) {
          possibleRelationships = filteredRelationships;
        }

        (0, _emberDataPrivateDebug.assert)("You defined the '" + name + "' relationship on " + this + ", but multiple possible inverse relationships of type " + this + " were found on " + inverseType + ". Look at http://emberjs.com/guides/models/defining-models/#toc_explicit-inverses for how to explicitly specify inverses", possibleRelationships.length === 1);

        inverseName = possibleRelationships[0].name;
        inverseKind = possibleRelationships[0].kind;
      }

      function findPossibleInverses(type, inverseType, relationshipsSoFar) {
        var possibleRelationships = relationshipsSoFar || [];

        var relationshipMap = get(inverseType, 'relationships');
        if (!relationshipMap) {
          return possibleRelationships;
        }

        var relationships = relationshipMap.get(type.modelName);

        relationships = relationships.filter(function (relationship) {
          var optionsForRelationship = inverseType.metaForProperty(relationship.name).options;

          if (!optionsForRelationship.inverse) {
            return true;
          }

          return name === optionsForRelationship.inverse;
        });

        if (relationships) {
          possibleRelationships.push.apply(possibleRelationships, relationships);
        }

        //Recurse to support polymorphism
        if (type.superclass) {
          findPossibleInverses(type.superclass, inverseType, possibleRelationships);
        }

        return possibleRelationships;
      }

      return {
        type: inverseType,
        name: inverseName,
        kind: inverseKind
      };
    },

    /**
      The model's relationships as a map, keyed on the type of the
      relationship. The value of each entry is an array containing a descriptor
      for each relationship with that type, describing the name of the relationship
      as well as the type.
       For example, given the following model definition:
       ```app/models/blog.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        users: DS.hasMany('user'),
        owner: DS.belongsTo('user'),
        posts: DS.hasMany('post')
      });
      ```
       This computed property would return a map describing these
      relationships, like this:
       ```javascript
      import Ember from 'ember';
      import Blog from 'app/models/blog';
       var relationships = Ember.get(Blog, 'relationships');
      relationships.get(App.User);
      //=> [ { name: 'users', kind: 'hasMany' },
      //     { name: 'owner', kind: 'belongsTo' } ]
      relationships.get(App.Post);
      //=> [ { name: 'posts', kind: 'hasMany' } ]
      ```
       @property relationships
      @static
      @type Ember.Map
      @readOnly
    */

    relationships: relationshipsDescriptor,

    /**
      A hash containing lists of the model's relationships, grouped
      by the relationship kind. For example, given a model with this
      definition:
       ```app/models/blog.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        users: DS.hasMany('user'),
        owner: DS.belongsTo('user'),
         posts: DS.hasMany('post')
      });
      ```
       This property would contain the following:
       ```javascript
      import Ember from 'ember';
      import Blog from 'app/models/blog';
       var relationshipNames = Ember.get(Blog, 'relationshipNames');
      relationshipNames.hasMany;
      //=> ['users', 'posts']
      relationshipNames.belongsTo;
      //=> ['owner']
      ```
       @property relationshipNames
      @static
      @type Object
      @readOnly
    */
    relationshipNames: _ember["default"].computed(function () {
      var names = {
        hasMany: [],
        belongsTo: []
      };

      this.eachComputedProperty(function (name, meta) {
        if (meta.isRelationship) {
          names[meta.kind].push(name);
        }
      });

      return names;
    }),

    /**
      An array of types directly related to a model. Each type will be
      included once, regardless of the number of relationships it has with
      the model.
       For example, given a model with this definition:
       ```app/models/blog.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        users: DS.hasMany('user'),
        owner: DS.belongsTo('user'),
         posts: DS.hasMany('post')
      });
      ```
       This property would contain the following:
       ```javascript
      import Ember from 'ember';
      import Blog from 'app/models/blog';
       var relatedTypes = Ember.get(Blog, 'relatedTypes');
      //=> [ App.User, App.Post ]
      ```
       @property relatedTypes
      @static
      @type Ember.Array
      @readOnly
    */
    relatedTypes: relatedTypesDescriptor,

    /**
      A map whose keys are the relationships of a model and whose values are
      relationship descriptors.
       For example, given a model with this
      definition:
       ```app/models/blog.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        users: DS.hasMany('user'),
        owner: DS.belongsTo('user'),
         posts: DS.hasMany('post')
      });
      ```
       This property would contain the following:
       ```javascript
      import Ember from 'ember';
      import Blog from 'app/models/blog';
       var relationshipsByName = Ember.get(Blog, 'relationshipsByName');
      relationshipsByName.get('users');
      //=> { key: 'users', kind: 'hasMany', type: 'user', options: Object, isRelationship: true }
      relationshipsByName.get('owner');
      //=> { key: 'owner', kind: 'belongsTo', type: 'user', options: Object, isRelationship: true }
      ```
       @property relationshipsByName
      @static
      @type Ember.Map
      @readOnly
    */
    relationshipsByName: relationshipsByNameDescriptor,

    /**
      A map whose keys are the fields of the model and whose values are strings
      describing the kind of the field. A model's fields are the union of all of its
      attributes and relationships.
       For example:
       ```app/models/blog.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        users: DS.hasMany('user'),
        owner: DS.belongsTo('user'),
         posts: DS.hasMany('post'),
         title: DS.attr('string')
      });
      ```
       ```js
      import Ember from 'ember';
      import Blog from 'app/models/blog';
       var fields = Ember.get(Blog, 'fields');
      fields.forEach(function(kind, field) {
        console.log(field, kind);
      });
       // prints:
      // users, hasMany
      // owner, belongsTo
      // posts, hasMany
      // title, attribute
      ```
       @property fields
      @static
      @type Ember.Map
      @readOnly
    */
    fields: _ember["default"].computed(function () {
      var map = Map.create();

      this.eachComputedProperty(function (name, meta) {
        if (meta.isRelationship) {
          map.set(name, meta.kind);
        } else if (meta.isAttribute) {
          map.set(name, 'attribute');
        }
      });

      return map;
    }).readOnly(),

    /**
      Given a callback, iterates over each of the relationships in the model,
      invoking the callback with the name of each relationship and its relationship
      descriptor.
       @method eachRelationship
      @static
      @param {Function} callback the callback to invoke
      @param {any} binding the value to which the callback's `this` should be bound
    */
    eachRelationship: function eachRelationship(callback, binding) {
      get(this, 'relationshipsByName').forEach(function (relationship, name) {
        callback.call(binding, name, relationship);
      });
    },

    /**
      Given a callback, iterates over each of the types related to a model,
      invoking the callback with the related type's class. Each type will be
      returned just once, regardless of how many different relationships it has
      with a model.
       @method eachRelatedType
      @static
      @param {Function} callback the callback to invoke
      @param {any} binding the value to which the callback's `this` should be bound
    */
    eachRelatedType: function eachRelatedType(callback, binding) {
      var relationshipTypes = get(this, 'relatedTypes');

      for (var i = 0; i < relationshipTypes.length; i++) {
        var type = relationshipTypes[i];
        callback.call(binding, type);
      }
    },

    determineRelationshipType: function determineRelationshipType(knownSide, store) {
      var knownKey = knownSide.key;
      var knownKind = knownSide.kind;
      var inverse = this.inverseFor(knownKey, store);
      // let key;
      var otherKind = undefined;

      if (!inverse) {
        return knownKind === 'belongsTo' ? 'oneToNone' : 'manyToNone';
      }

      // key = inverse.name;
      otherKind = inverse.kind;

      if (otherKind === 'belongsTo') {
        return knownKind === 'belongsTo' ? 'oneToOne' : 'manyToOne';
      } else {
        return knownKind === 'belongsTo' ? 'oneToMany' : 'manyToMany';
      }
    }

  });

  exports.RelationshipsClassMethodsMixin = RelationshipsClassMethodsMixin;

  var RelationshipsInstanceMethodsMixin = _ember["default"].Mixin.create({
    /**
      Given a callback, iterates over each of the relationships in the model,
      invoking the callback with the name of each relationship and its relationship
      descriptor.
        The callback method you provide should have the following signature (all
      parameters are optional):
       ```javascript
      function(name, descriptor);
      ```
       - `name` the name of the current property in the iteration
      - `descriptor` the meta object that describes this relationship
       The relationship descriptor argument is an object with the following properties.
      - **key** <span class="type">String</span> the name of this relationship on the Model
     - **kind** <span class="type">String</span> "hasMany" or "belongsTo"
     - **options** <span class="type">Object</span> the original options hash passed when the relationship was declared
     - **parentType** <span class="type">DS.Model</span> the type of the Model that owns this relationship
     - **type** <span class="type">String</span> the type name of the related Model
       Note that in addition to a callback, you can also pass an optional target
      object that will be set as `this` on the context.
       Example
       ```app/serializers/application.js
      import DS from 'ember-data';
       export default DS.JSONSerializer.extend({
        serialize: function(record, options) {
          var json = {};
           record.eachRelationship(function(name, descriptor) {
            if (descriptor.kind === 'hasMany') {
              var serializedHasManyName = name.toUpperCase() + '_IDS';
              json[serializedHasManyName] = record.get(name).mapBy('id');
            }
          });
           return json;
        }
      });
      ```
       @method eachRelationship
      @param {Function} callback the callback to invoke
      @param {any} binding the value to which the callback's `this` should be bound
    */
    eachRelationship: function eachRelationship(callback, binding) {
      this.constructor.eachRelationship(callback, binding);
    },

    relationshipFor: function relationshipFor(name) {
      return get(this.constructor, 'relationshipsByName').get(name);
    },

    inverseFor: function inverseFor(key) {
      return this.constructor.inverseFor(key, this.store);
    }

  });
  exports.RelationshipsInstanceMethodsMixin = RelationshipsInstanceMethodsMixin;
});
define("ember-data/-private/system/relationships/has-many", ["exports", "ember", "ember-data/-private/debug", "ember-data/-private/system/normalize-model-name", "ember-data/-private/system/is-array-like"], function (exports, _ember, _emberDataPrivateDebug, _emberDataPrivateSystemNormalizeModelName, _emberDataPrivateSystemIsArrayLike) {
  "use strict";

  exports["default"] = hasMany;

  /**
    @module ember-data
  */

  /**
    `DS.hasMany` is used to define One-To-Many and Many-To-Many
    relationships on a [DS.Model](/api/data/classes/DS.Model.html).
  
    `DS.hasMany` takes an optional hash as a second parameter, currently
    supported options are:
  
    - `async`: A boolean value used to explicitly declare this to be an async relationship.
    - `inverse`: A string used to identify the inverse property on a related model.
  
    #### One-To-Many
    To declare a one-to-many relationship between two models, use
    `DS.belongsTo` in combination with `DS.hasMany`, like this:
  
    ```app/models/post.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      comments: DS.hasMany('comment')
    });
    ```
  
    ```app/models/comment.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      post: DS.belongsTo('post')
    });
    ```
  
    #### Many-To-Many
    To declare a many-to-many relationship between two models, use
    `DS.hasMany`:
  
    ```app/models/post.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      tags: DS.hasMany('tag')
    });
    ```
  
    ```app/models/tag.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      posts: DS.hasMany('post')
    });
    ```
  
    You can avoid passing a string as the first parameter. In that case Ember Data
    will infer the type from the singularized key name.
  
    ```app/models/post.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      tags: DS.hasMany()
    });
    ```
  
    will lookup for a Tag type.
  
    #### Explicit Inverses
  
    Ember Data will do its best to discover which relationships map to
    one another. In the one-to-many code above, for example, Ember Data
    can figure out that changing the `comments` relationship should update
    the `post` relationship on the inverse because post is the only
    relationship to that model.
  
    However, sometimes you may have multiple `belongsTo`/`hasManys` for the
    same type. You can specify which property on the related model is
    the inverse using `DS.hasMany`'s `inverse` option:
  
    ```app/models/comment.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      onePost: DS.belongsTo('post'),
      twoPost: DS.belongsTo('post'),
      redPost: DS.belongsTo('post'),
      bluePost: DS.belongsTo('post')
    });
    ```
  
    ```app/models/post.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      comments: DS.hasMany('comment', {
        inverse: 'redPost'
      })
    });
    ```
  
    You can also specify an inverse on a `belongsTo`, which works how
    you'd expect.
  
    @namespace
    @method hasMany
    @for DS
    @param {String} type (optional) type of the relationship
    @param {Object} options (optional) a hash of options
    @return {Ember.computed} relationship
  */
  function hasMany(type, options) {
    if (typeof type === 'object') {
      options = type;
      type = undefined;
    }

    (0, _emberDataPrivateDebug.assert)("The first argument to DS.hasMany must be a string representing a model type key, not an instance of " + _ember["default"].inspect(type) + ". E.g., to define a relation to the Comment model, use DS.hasMany('comment')", typeof type === 'string' || typeof type === 'undefined');

    options = options || {};

    if (typeof type === 'string') {
      type = (0, _emberDataPrivateSystemNormalizeModelName["default"])(type);
    }

    // Metadata about relationships is stored on the meta of
    // the relationship. This is used for introspection and
    // serialization. Note that `key` is populated lazily
    // the first time the CP is called.
    var meta = {
      type: type,
      isRelationship: true,
      options: options,
      kind: 'hasMany',
      key: null
    };

    return _ember["default"].computed({
      get: function get(key) {
        var relationship = this._internalModel._relationships.get(key);
        return relationship.getRecords();
      },
      set: function set(key, records) {
        (0, _emberDataPrivateDebug.assert)("You must pass an array of records to set a hasMany relationship", (0, _emberDataPrivateSystemIsArrayLike["default"])(records));
        (0, _emberDataPrivateDebug.assert)("All elements of a hasMany relationship must be instances of DS.Model, you passed " + _ember["default"].inspect(records), (function () {
          return _ember["default"].A(records).every(function (record) {
            return record.hasOwnProperty('_internalModel') === true;
          });
        })());

        var relationship = this._internalModel._relationships.get(key);
        relationship.clear();
        relationship.addRecords(_ember["default"].A(records).mapBy('_internalModel'));
        return relationship.getRecords();
      }
    }).meta(meta);
  }

  var HasManyMixin = _ember["default"].Mixin.create({
    notifyHasManyAdded: function notifyHasManyAdded(key) {
      //We need to notifyPropertyChange in the adding case because we need to make sure
      //we fetch the newly added record in case it is unloaded
      //TODO(Igor): Consider whether we could do this only if the record state is unloaded

      //Goes away once hasMany is double promisified
      this.notifyPropertyChange(key);
    }
  });
  exports.HasManyMixin = HasManyMixin;
});
define("ember-data/-private/system/relationships/state/belongs-to", ["exports", "ember", "ember-data/-private/debug", "ember-data/-private/system/promise-proxies", "ember-data/-private/system/relationships/state/relationship"], function (exports, _ember, _emberDataPrivateDebug, _emberDataPrivateSystemPromiseProxies, _emberDataPrivateSystemRelationshipsStateRelationship) {
  "use strict";

  exports["default"] = BelongsToRelationship;

  function BelongsToRelationship(store, record, inverseKey, relationshipMeta) {
    this._super$constructor(store, record, inverseKey, relationshipMeta);
    this.record = record;
    this.key = relationshipMeta.key;
    this.inverseRecord = null;
    this.canonicalState = null;
  }

  BelongsToRelationship.prototype = Object.create(_emberDataPrivateSystemRelationshipsStateRelationship["default"].prototype);
  BelongsToRelationship.prototype.constructor = BelongsToRelationship;
  BelongsToRelationship.prototype._super$constructor = _emberDataPrivateSystemRelationshipsStateRelationship["default"];

  BelongsToRelationship.prototype.setRecord = function (newRecord) {
    if (newRecord) {
      this.addRecord(newRecord);
    } else if (this.inverseRecord) {
      this.removeRecord(this.inverseRecord);
    }
    this.setHasData(true);
    this.setHasLoaded(true);
  };

  BelongsToRelationship.prototype.setCanonicalRecord = function (newRecord) {
    if (newRecord) {
      this.addCanonicalRecord(newRecord);
    } else if (this.canonicalState) {
      this.removeCanonicalRecord(this.canonicalState);
    }
    this.flushCanonicalLater();
    this.setHasData(true);
    this.setHasLoaded(true);
  };

  BelongsToRelationship.prototype._super$addCanonicalRecord = _emberDataPrivateSystemRelationshipsStateRelationship["default"].prototype.addCanonicalRecord;
  BelongsToRelationship.prototype.addCanonicalRecord = function (newRecord) {
    if (this.canonicalMembers.has(newRecord)) {
      return;
    }

    if (this.canonicalState) {
      this.removeCanonicalRecord(this.canonicalState);
    }

    this.canonicalState = newRecord;
    this._super$addCanonicalRecord(newRecord);
  };

  BelongsToRelationship.prototype._super$flushCanonical = _emberDataPrivateSystemRelationshipsStateRelationship["default"].prototype.flushCanonical;
  BelongsToRelationship.prototype.flushCanonical = function () {
    //temporary fix to not remove newly created records if server returned null.
    //TODO remove once we have proper diffing
    if (this.inverseRecord && this.inverseRecord.isNew() && !this.canonicalState) {
      return;
    }
    this.inverseRecord = this.canonicalState;
    this.record.notifyBelongsToChanged(this.key);
    this._super$flushCanonical();
  };

  BelongsToRelationship.prototype._super$addRecord = _emberDataPrivateSystemRelationshipsStateRelationship["default"].prototype.addRecord;
  BelongsToRelationship.prototype.addRecord = function (newRecord) {
    if (this.members.has(newRecord)) {
      return;
    }

    (0, _emberDataPrivateDebug.assertPolymorphicType)(this.record, this.relationshipMeta, newRecord);

    if (this.inverseRecord) {
      this.removeRecord(this.inverseRecord);
    }

    this.inverseRecord = newRecord;
    this._super$addRecord(newRecord);
    this.record.notifyBelongsToChanged(this.key);
  };

  BelongsToRelationship.prototype.setRecordPromise = function (newPromise) {
    var content = newPromise.get && newPromise.get('content');
    (0, _emberDataPrivateDebug.assert)("You passed in a promise that did not originate from an EmberData relationship. You can only pass promises that come from a belongsTo or hasMany relationship to the get call.", content !== undefined);
    this.setRecord(content ? content._internalModel : content);
  };

  BelongsToRelationship.prototype._super$removeRecordFromOwn = _emberDataPrivateSystemRelationshipsStateRelationship["default"].prototype.removeRecordFromOwn;
  BelongsToRelationship.prototype.removeRecordFromOwn = function (record) {
    if (!this.members.has(record)) {
      return;
    }
    this.inverseRecord = null;
    this._super$removeRecordFromOwn(record);
    this.record.notifyBelongsToChanged(this.key);
  };

  BelongsToRelationship.prototype._super$removeCanonicalRecordFromOwn = _emberDataPrivateSystemRelationshipsStateRelationship["default"].prototype.removeCanonicalRecordFromOwn;
  BelongsToRelationship.prototype.removeCanonicalRecordFromOwn = function (record) {
    if (!this.canonicalMembers.has(record)) {
      return;
    }
    this.canonicalState = null;
    this._super$removeCanonicalRecordFromOwn(record);
  };

  BelongsToRelationship.prototype.findRecord = function () {
    if (this.inverseRecord) {
      return this.store._findByInternalModel(this.inverseRecord);
    } else {
      return _ember["default"].RSVP.Promise.resolve(null);
    }
  };

  BelongsToRelationship.prototype.fetchLink = function () {
    var _this = this;

    return this.store.findBelongsTo(this.record, this.link, this.relationshipMeta).then(function (record) {
      if (record) {
        _this.addRecord(record);
      }
      return record;
    });
  };

  BelongsToRelationship.prototype.getRecord = function () {
    var _this2 = this;

    //TODO(Igor) flushCanonical here once our syncing is not stupid
    if (this.isAsync) {
      var promise;
      if (this.link) {
        if (this.hasLoaded) {
          promise = this.findRecord();
        } else {
          promise = this.findLink().then(function () {
            return _this2.findRecord();
          });
        }
      } else {
        promise = this.findRecord();
      }

      return _emberDataPrivateSystemPromiseProxies.PromiseObject.create({
        promise: promise,
        content: this.inverseRecord ? this.inverseRecord.getRecord() : null
      });
    } else {
      if (this.inverseRecord === null) {
        return null;
      }
      var toReturn = this.inverseRecord.getRecord();
      (0, _emberDataPrivateDebug.assert)("You looked up the '" + this.key + "' relationship on a '" + this.record.type.modelName + "' with id " + this.record.id + " but some of the associated records were not loaded. Either make sure they are all loaded together with the parent record, or specify that the relationship is async (`DS.belongsTo({ async: true })`)", toReturn === null || !toReturn.get('isEmpty'));
      return toReturn;
    }
  };

  BelongsToRelationship.prototype.reload = function () {
    // TODO handle case when reload() is triggered multiple times

    if (this.link) {
      return this.fetchLink();
    }

    // reload record, if it is already loaded
    if (this.inverseRecord && this.inverseRecord.record) {
      return this.inverseRecord.record.reload();
    }

    return this.findRecord();
  };
});
define("ember-data/-private/system/relationships/state/create", ["exports", "ember", "ember-data/-private/system/relationships/state/has-many", "ember-data/-private/system/relationships/state/belongs-to", "ember-data/-private/system/empty-object"], function (exports, _ember, _emberDataPrivateSystemRelationshipsStateHasMany, _emberDataPrivateSystemRelationshipsStateBelongsTo, _emberDataPrivateSystemEmptyObject) {
  "use strict";

  exports["default"] = Relationships;

  var get = _ember["default"].get;

  function shouldFindInverse(relationshipMeta) {
    var options = relationshipMeta.options;
    return !(options && options.inverse === null);
  }

  function createRelationshipFor(record, relationshipMeta, store) {
    var inverseKey = undefined;
    var inverse = null;
    if (shouldFindInverse(relationshipMeta)) {
      inverse = record.type.inverseFor(relationshipMeta.key, store);
    }

    if (inverse) {
      inverseKey = inverse.name;
    }

    if (relationshipMeta.kind === 'hasMany') {
      return new _emberDataPrivateSystemRelationshipsStateHasMany["default"](store, record, inverseKey, relationshipMeta);
    } else {
      return new _emberDataPrivateSystemRelationshipsStateBelongsTo["default"](store, record, inverseKey, relationshipMeta);
    }
  }
  function Relationships(record) {
    this.record = record;
    this.initializedRelationships = new _emberDataPrivateSystemEmptyObject["default"]();
  }

  Relationships.prototype.has = function (key) {
    return !!this.initializedRelationships[key];
  };

  Relationships.prototype.get = function (key) {
    var relationships = this.initializedRelationships;
    var relationshipsByName = get(this.record.type, 'relationshipsByName');
    if (!relationships[key] && relationshipsByName.get(key)) {
      relationships[key] = createRelationshipFor(this.record, relationshipsByName.get(key), this.record.store);
    }
    return relationships[key];
  };
});
define("ember-data/-private/system/relationships/state/has-many", ["exports", "ember-data/-private/debug", "ember-data/-private/system/promise-proxies", "ember-data/-private/system/relationships/state/relationship", "ember-data/-private/system/ordered-set", "ember-data/-private/system/many-array"], function (exports, _emberDataPrivateDebug, _emberDataPrivateSystemPromiseProxies, _emberDataPrivateSystemRelationshipsStateRelationship, _emberDataPrivateSystemOrderedSet, _emberDataPrivateSystemManyArray) {
  "use strict";

  exports["default"] = ManyRelationship;

  function ManyRelationship(store, record, inverseKey, relationshipMeta) {
    this._super$constructor(store, record, inverseKey, relationshipMeta);
    this.belongsToType = relationshipMeta.type;
    this.canonicalState = [];
    this.manyArray = _emberDataPrivateSystemManyArray["default"].create({
      canonicalState: this.canonicalState,
      store: this.store,
      relationship: this,
      type: this.store.modelFor(this.belongsToType),
      record: record
    });
    this.isPolymorphic = relationshipMeta.options.polymorphic;
    this.manyArray.isPolymorphic = this.isPolymorphic;
  }

  ManyRelationship.prototype = Object.create(_emberDataPrivateSystemRelationshipsStateRelationship["default"].prototype);
  ManyRelationship.prototype.constructor = ManyRelationship;
  ManyRelationship.prototype._super$constructor = _emberDataPrivateSystemRelationshipsStateRelationship["default"];

  ManyRelationship.prototype.destroy = function () {
    this.manyArray.destroy();
  };

  ManyRelationship.prototype._super$updateMeta = _emberDataPrivateSystemRelationshipsStateRelationship["default"].prototype.updateMeta;
  ManyRelationship.prototype.updateMeta = function (meta) {
    this._super$updateMeta(meta);
    this.manyArray.set('meta', meta);
  };

  ManyRelationship.prototype._super$addCanonicalRecord = _emberDataPrivateSystemRelationshipsStateRelationship["default"].prototype.addCanonicalRecord;
  ManyRelationship.prototype.addCanonicalRecord = function (record, idx) {
    if (this.canonicalMembers.has(record)) {
      return;
    }
    if (idx !== undefined) {
      this.canonicalState.splice(idx, 0, record);
    } else {
      this.canonicalState.push(record);
    }
    this._super$addCanonicalRecord(record, idx);
  };

  ManyRelationship.prototype._super$addRecord = _emberDataPrivateSystemRelationshipsStateRelationship["default"].prototype.addRecord;
  ManyRelationship.prototype.addRecord = function (record, idx) {
    if (this.members.has(record)) {
      return;
    }
    this._super$addRecord(record, idx);
    this.manyArray.internalAddRecords([record], idx);
  };

  ManyRelationship.prototype._super$removeCanonicalRecordFromOwn = _emberDataPrivateSystemRelationshipsStateRelationship["default"].prototype.removeCanonicalRecordFromOwn;
  ManyRelationship.prototype.removeCanonicalRecordFromOwn = function (record, idx) {
    var i = idx;
    if (!this.canonicalMembers.has(record)) {
      return;
    }
    if (i === undefined) {
      i = this.canonicalState.indexOf(record);
    }
    if (i > -1) {
      this.canonicalState.splice(i, 1);
    }
    this._super$removeCanonicalRecordFromOwn(record, idx);
  };

  ManyRelationship.prototype._super$flushCanonical = _emberDataPrivateSystemRelationshipsStateRelationship["default"].prototype.flushCanonical;
  ManyRelationship.prototype.flushCanonical = function () {
    this.manyArray.flushCanonical();
    this._super$flushCanonical();
  };

  ManyRelationship.prototype._super$removeRecordFromOwn = _emberDataPrivateSystemRelationshipsStateRelationship["default"].prototype.removeRecordFromOwn;
  ManyRelationship.prototype.removeRecordFromOwn = function (record, idx) {
    if (!this.members.has(record)) {
      return;
    }
    this._super$removeRecordFromOwn(record, idx);
    if (idx !== undefined) {
      //TODO(Igor) not used currently, fix
      this.manyArray.currentState.removeAt(idx);
    } else {
      this.manyArray.internalRemoveRecords([record]);
    }
  };

  ManyRelationship.prototype.notifyRecordRelationshipAdded = function (record, idx) {
    (0, _emberDataPrivateDebug.assertPolymorphicType)(this.record, this.relationshipMeta, record);

    this.record.notifyHasManyAdded(this.key, record, idx);
  };

  ManyRelationship.prototype.reload = function () {
    var _this = this;

    var manyArrayLoadedState = this.manyArray.get('isLoaded');

    if (this._loadingPromise) {
      if (this._loadingPromise.get('isPending')) {
        return this._loadingPromise;
      }
      if (this._loadingPromise.get('isRejected')) {
        this.manyArray.set('isLoaded', manyArrayLoadedState);
      }
    }

    if (this.link) {
      this._loadingPromise = (0, _emberDataPrivateSystemPromiseProxies.promiseManyArray)(this.fetchLink(), 'Reload with link');
      return this._loadingPromise;
    } else {
      this._loadingPromise = (0, _emberDataPrivateSystemPromiseProxies.promiseManyArray)(this.store.scheduleFetchMany(this.manyArray.toArray()).then(function () {
        return _this.manyArray;
      }), 'Reload with ids');
      return this._loadingPromise;
    }
  };

  ManyRelationship.prototype.computeChanges = function (records) {
    var members = this.canonicalMembers;
    var recordsToRemove = [];
    var length;
    var record;
    var i;

    records = setForArray(records);

    members.forEach(function (member) {
      if (records.has(member)) {
        return;
      }

      recordsToRemove.push(member);
    });

    this.removeCanonicalRecords(recordsToRemove);

    // Using records.toArray() since currently using
    // removeRecord can modify length, messing stuff up
    // forEach since it directly looks at "length" each
    // iteration
    records = records.toArray();
    length = records.length;
    for (i = 0; i < length; i++) {
      record = records[i];
      this.removeCanonicalRecord(record);
      this.addCanonicalRecord(record, i);
    }
  };

  ManyRelationship.prototype.fetchLink = function () {
    var _this2 = this;

    return this.store.findHasMany(this.record, this.link, this.relationshipMeta).then(function (records) {
      if (records.hasOwnProperty('meta')) {
        _this2.updateMeta(records.meta);
      }
      _this2.store._backburner.join(function () {
        _this2.updateRecordsFromAdapter(records);
        _this2.manyArray.set('isLoaded', true);
      });
      return _this2.manyArray;
    });
  };

  ManyRelationship.prototype.findRecords = function () {
    var _this3 = this;

    var manyArray = this.manyArray.toArray();
    var internalModels = new Array(manyArray.length);

    for (var i = 0; i < manyArray.length; i++) {
      internalModels[i] = manyArray[i]._internalModel;
    }

    //TODO CLEANUP
    return this.store.findMany(internalModels).then(function () {
      if (!_this3.manyArray.get('isDestroyed')) {
        //Goes away after the manyArray refactor
        _this3.manyArray.set('isLoaded', true);
      }
      return _this3.manyArray;
    });
  };
  ManyRelationship.prototype.notifyHasManyChanged = function () {
    this.record.notifyHasManyAdded(this.key);
  };

  ManyRelationship.prototype.getRecords = function () {
    var _this4 = this;

    //TODO(Igor) sync server here, once our syncing is not stupid
    if (this.isAsync) {
      var promise;
      if (this.link) {
        if (this.hasLoaded) {
          promise = this.findRecords();
        } else {
          promise = this.findLink().then(function () {
            return _this4.findRecords();
          });
        }
      } else {
        promise = this.findRecords();
      }
      this._loadingPromise = _emberDataPrivateSystemPromiseProxies.PromiseManyArray.create({
        content: this.manyArray,
        promise: promise
      });
      return this._loadingPromise;
    } else {
      (0, _emberDataPrivateDebug.assert)("You looked up the '" + this.key + "' relationship on a '" + this.record.type.modelName + "' with id " + this.record.id + " but some of the associated records were not loaded. Either make sure they are all loaded together with the parent record, or specify that the relationship is async (`DS.hasMany({ async: true })`)", this.manyArray.isEvery('isEmpty', false));

      //TODO(Igor) WTF DO I DO HERE?
      if (!this.manyArray.get('isDestroyed')) {
        this.manyArray.set('isLoaded', true);
      }
      return this.manyArray;
    }
  };

  function setForArray(array) {
    var set = new _emberDataPrivateSystemOrderedSet["default"]();

    if (array) {
      for (var i = 0, l = array.length; i < l; i++) {
        set.add(array[i]);
      }
    }

    return set;
  }
});
define("ember-data/-private/system/relationships/state/relationship", ["exports", "ember", "ember-data/-private/debug", "ember-data/-private/system/ordered-set"], function (exports, _ember, _emberDataPrivateDebug, _emberDataPrivateSystemOrderedSet) {
  "use strict";

  exports["default"] = Relationship;

  /* global heimdall */

  function Relationship(store, record, inverseKey, relationshipMeta) {
    var async = relationshipMeta.options.async;
    this.members = new _emberDataPrivateSystemOrderedSet["default"]();
    this.canonicalMembers = new _emberDataPrivateSystemOrderedSet["default"]();
    this.store = store;
    this.key = relationshipMeta.key;
    this.inverseKey = inverseKey;
    this.record = record;
    this.isAsync = typeof async === 'undefined' ? true : async;
    this.relationshipMeta = relationshipMeta;
    //This probably breaks for polymorphic relationship in complex scenarios, due to
    //multiple possible modelNames
    this.inverseKeyForImplicit = this.record.constructor.modelName + this.key;
    this.linkPromise = null;
    this.meta = null;
    this.hasData = false;
    this.hasLoaded = false;
  }

  Relationship.prototype = {
    constructor: Relationship,

    destroy: _ember["default"].K,

    updateMeta: function updateMeta(meta) {
      this.meta = meta;
    },

    clear: function clear() {
      var members = this.members.list;
      var member;

      while (members.length > 0) {
        member = members[0];
        this.removeRecord(member);
      }
    },

    removeRecords: function removeRecords(records) {
      var _this = this;

      records.forEach(function (record) {
        return _this.removeRecord(record);
      });
    },

    addRecords: function addRecords(records, idx) {
      var _this2 = this;

      records.forEach(function (record) {
        _this2.addRecord(record, idx);
        if (idx !== undefined) {
          idx++;
        }
      });
    },

    addCanonicalRecords: function addCanonicalRecords(records, idx) {
      for (var i = 0; i < records.length; i++) {
        if (idx !== undefined) {
          this.addCanonicalRecord(records[i], i + idx);
        } else {
          this.addCanonicalRecord(records[i]);
        }
      }
    },

    addCanonicalRecord: function addCanonicalRecord(record, idx) {
      if (!this.canonicalMembers.has(record)) {
        this.canonicalMembers.add(record);
        if (this.inverseKey) {
          record._relationships.get(this.inverseKey).addCanonicalRecord(this.record);
        } else {
          if (!record._implicitRelationships[this.inverseKeyForImplicit]) {
            record._implicitRelationships[this.inverseKeyForImplicit] = new Relationship(this.store, record, this.key, { options: {} });
          }
          record._implicitRelationships[this.inverseKeyForImplicit].addCanonicalRecord(this.record);
        }
      }
      this.flushCanonicalLater();
      this.setHasData(true);
    },

    removeCanonicalRecords: function removeCanonicalRecords(records, idx) {
      for (var i = 0; i < records.length; i++) {
        if (idx !== undefined) {
          this.removeCanonicalRecord(records[i], i + idx);
        } else {
          this.removeCanonicalRecord(records[i]);
        }
      }
    },

    removeCanonicalRecord: function removeCanonicalRecord(record, idx) {
      if (this.canonicalMembers.has(record)) {
        this.removeCanonicalRecordFromOwn(record);
        if (this.inverseKey) {
          this.removeCanonicalRecordFromInverse(record);
        } else {
          if (record._implicitRelationships[this.inverseKeyForImplicit]) {
            record._implicitRelationships[this.inverseKeyForImplicit].removeCanonicalRecord(this.record);
          }
        }
      }
      this.flushCanonicalLater();
    },

    addRecord: function addRecord(record, idx) {
      if (!this.members.has(record)) {
        this.members.addWithIndex(record, idx);
        this.notifyRecordRelationshipAdded(record, idx);
        if (this.inverseKey) {
          record._relationships.get(this.inverseKey).addRecord(this.record);
        } else {
          if (!record._implicitRelationships[this.inverseKeyForImplicit]) {
            record._implicitRelationships[this.inverseKeyForImplicit] = new Relationship(this.store, record, this.key, { options: {} });
          }
          record._implicitRelationships[this.inverseKeyForImplicit].addRecord(this.record);
        }
        this.record.updateRecordArraysLater();
      }
      this.setHasData(true);
    },

    removeRecord: function removeRecord(record) {
      if (this.members.has(record)) {
        this.removeRecordFromOwn(record);
        if (this.inverseKey) {
          this.removeRecordFromInverse(record);
        } else {
          if (record._implicitRelationships[this.inverseKeyForImplicit]) {
            record._implicitRelationships[this.inverseKeyForImplicit].removeRecord(this.record);
          }
        }
      }
    },

    removeRecordFromInverse: function removeRecordFromInverse(record) {
      var inverseRelationship = record._relationships.get(this.inverseKey);
      //Need to check for existence, as the record might unloading at the moment
      if (inverseRelationship) {
        inverseRelationship.removeRecordFromOwn(this.record);
      }
    },

    removeRecordFromOwn: function removeRecordFromOwn(record) {
      this.members["delete"](record);
      this.notifyRecordRelationshipRemoved(record);
      this.record.updateRecordArrays();
    },

    removeCanonicalRecordFromInverse: function removeCanonicalRecordFromInverse(record) {
      var inverseRelationship = record._relationships.get(this.inverseKey);
      //Need to check for existence, as the record might unloading at the moment
      if (inverseRelationship) {
        inverseRelationship.removeCanonicalRecordFromOwn(this.record);
      }
    },

    removeCanonicalRecordFromOwn: function removeCanonicalRecordFromOwn(record) {
      this.canonicalMembers["delete"](record);
      this.flushCanonicalLater();
    },

    flushCanonical: function flushCanonical() {
      this.willSync = false;
      //a hack for not removing new records
      //TODO remove once we have proper diffing
      var newRecords = [];
      for (var i = 0; i < this.members.list.length; i++) {
        if (this.members.list[i].isNew()) {
          newRecords.push(this.members.list[i]);
        }
      }
      //TODO(Igor) make this less abysmally slow
      this.members = this.canonicalMembers.copy();
      for (i = 0; i < newRecords.length; i++) {
        this.members.add(newRecords[i]);
      }
    },

    flushCanonicalLater: function flushCanonicalLater() {
      var _this3 = this;

      if (this.willSync) {
        return;
      }
      this.willSync = true;
      this.store._backburner.join(function () {
        return _this3.store._backburner.schedule('syncRelationships', _this3, _this3.flushCanonical);
      });
    },

    updateLink: function updateLink(link) {
      (0, _emberDataPrivateDebug.warn)("You have pushed a record of type '" + this.record.type.modelName + "' with '" + this.key + "' as a link, but the association is not an async relationship.", this.isAsync, {
        id: 'ds.store.push-link-for-sync-relationship'
      });
      (0, _emberDataPrivateDebug.assert)("You have pushed a record of type '" + this.record.type.modelName + "' with '" + this.key + "' as a link, but the value of that link is not a string.", typeof link === 'string' || link === null);
      if (link !== this.link) {
        this.link = link;
        this.linkPromise = null;
        this.setHasLoaded(false);
        this.record.notifyPropertyChange(this.key);
      }
    },

    findLink: function findLink() {
      if (this.linkPromise) {
        return this.linkPromise;
      } else {
        var promise = this.fetchLink();
        this.linkPromise = promise;
        return promise.then(function (result) {
          return result;
        });
      }
    },

    updateRecordsFromAdapter: function updateRecordsFromAdapter(records) {
      //TODO(Igor) move this to a proper place
      //TODO Once we have adapter support, we need to handle updated and canonical changes
      this.computeChanges(records);
      this.setHasData(true);
      this.setHasLoaded(true);
    },

    notifyRecordRelationshipAdded: _ember["default"].K,
    notifyRecordRelationshipRemoved: _ember["default"].K,

    /*
      `hasData` for a relationship is a flag to indicate if we consider the
      content of this relationship "known". Snapshots uses this to tell the
      difference between unknown (`undefined`) or empty (`null`). The reason for
      this is that we wouldn't want to serialize unknown relationships as `null`
      as that might overwrite remote state.
       All relationships for a newly created (`store.createRecord()`) are
      considered known (`hasData === true`).
     */
    setHasData: function setHasData(value) {
      this.hasData = value;
    },

    /*
      `hasLoaded` is a flag to indicate if we have gotten data from the adapter or
      not when the relationship has a link.
       This is used to be able to tell when to fetch the link and when to return
      the local data in scenarios where the local state is considered known
      (`hasData === true`).
       Updating the link will automatically set `hasLoaded` to `false`.
     */
    setHasLoaded: function setHasLoaded(value) {
      this.hasLoaded = value;
    }
  };
});
define('ember-data/-private/system/snapshot-record-array', ['exports'], function (exports) {
  'use strict';

  exports['default'] = SnapshotRecordArray;

  /**
    @module ember-data
  */

  /**
    @class SnapshotRecordArray
    @namespace DS
    @private
    @constructor
    @param {Array} snapshots An array of snapshots
    @param {Object} meta
  */
  function SnapshotRecordArray(recordArray, meta) {
    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    /**
      An array of snapshots
      @private
      @property _snapshots
      @type {Array}
    */
    this._snapshots = null;
    /**
      An array of records
      @private
      @property _recordArray
      @type {Array}
    */
    this._recordArray = recordArray;
    /**
      Number of records in the array
      @property length
      @type {Number}
    */
    this.length = recordArray.get('length');
    /**
      The type of the underlying records for the snapshots in the array, as a DS.Model
      @property type
      @type {DS.Model}
    */
    this.type = recordArray.get('type');
    /**
      Meta object
      @property meta
      @type {Object}
    */
    this.meta = meta;
    /**
      A hash of adapter options
      @property adapterOptions
      @type {Object}
    */
    this.adapterOptions = options.adapterOptions;

    this.include = options.include;
  }

  /**
    Get snapshots of the underlying record array
    @method snapshots
    @return {Array} Array of snapshots
  */
  SnapshotRecordArray.prototype.snapshots = function () {
    if (this._snapshots) {
      return this._snapshots;
    }
    var recordArray = this._recordArray;
    this._snapshots = recordArray.invoke('createSnapshot');

    return this._snapshots;
  };
});
define("ember-data/-private/system/snapshot", ["exports", "ember", "ember-data/-private/system/empty-object"], function (exports, _ember, _emberDataPrivateSystemEmptyObject) {
  "use strict";

  exports["default"] = Snapshot;

  /**
    @module ember-data
  */

  var get = _ember["default"].get;

  /**
    @class Snapshot
    @namespace DS
    @private
    @constructor
    @param {DS.Model} internalModel The model to create a snapshot from
  */
  function Snapshot(internalModel) {
    var _this = this;

    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    this._attributes = new _emberDataPrivateSystemEmptyObject["default"]();
    this._belongsToRelationships = new _emberDataPrivateSystemEmptyObject["default"]();
    this._belongsToIds = new _emberDataPrivateSystemEmptyObject["default"]();
    this._hasManyRelationships = new _emberDataPrivateSystemEmptyObject["default"]();
    this._hasManyIds = new _emberDataPrivateSystemEmptyObject["default"]();

    var record = internalModel.getRecord();
    this.record = record;
    record.eachAttribute(function (keyName) {
      return _this._attributes[keyName] = get(record, keyName);
    });

    this.id = internalModel.id;
    this._internalModel = internalModel;
    this.type = internalModel.type;
    this.modelName = internalModel.type.modelName;

    /**
      A hash of adapter options
      @property adapterOptions
      @type {Object}
    */
    this.adapterOptions = options.adapterOptions;

    this.include = options.include;

    this._changedAttributes = record.changedAttributes();
  }

  Snapshot.prototype = {
    constructor: Snapshot,

    /**
      The id of the snapshot's underlying record
       Example
       ```javascript
      // store.push('post', { id: 1, author: 'Tomster', title: 'Ember.js rocks' });
      postSnapshot.id; // => '1'
      ```
       @property id
      @type {String}
    */
    id: null,

    /**
      The underlying record for this snapshot. Can be used to access methods and
      properties defined on the record.
       Example
       ```javascript
      var json = snapshot.record.toJSON();
      ```
       @property record
      @type {DS.Model}
    */
    record: null,

    /**
      The type of the underlying record for this snapshot, as a DS.Model.
       @property type
      @type {DS.Model}
    */
    type: null,

    /**
      The name of the type of the underlying record for this snapshot, as a string.
       @property modelName
      @type {String}
    */
    modelName: null,

    /**
      Returns the value of an attribute.
       Example
       ```javascript
      // store.push('post', { id: 1, author: 'Tomster', title: 'Ember.js rocks' });
      postSnapshot.attr('author'); // => 'Tomster'
      postSnapshot.attr('title'); // => 'Ember.js rocks'
      ```
       Note: Values are loaded eagerly and cached when the snapshot is created.
       @method attr
      @param {String} keyName
      @return {Object} The attribute value or undefined
    */
    attr: function attr(keyName) {
      if (keyName in this._attributes) {
        return this._attributes[keyName];
      }
      throw new _ember["default"].Error("Model '" + _ember["default"].inspect(this.record) + "' has no attribute named '" + keyName + "' defined.");
    },

    /**
      Returns all attributes and their corresponding values.
       Example
       ```javascript
      // store.push('post', { id: 1, author: 'Tomster', title: 'Ember.js rocks' });
      postSnapshot.attributes(); // => { author: 'Tomster', title: 'Ember.js rocks' }
      ```
       @method attributes
      @return {Object} All attributes of the current snapshot
    */
    attributes: function attributes() {
      return _ember["default"].copy(this._attributes);
    },

    /**
      Returns all changed attributes and their old and new values.
       Example
       ```javascript
      // store.push('post', { id: 1, author: 'Tomster', title: 'Ember.js rocks' });
      postModel.set('title', 'Ember.js rocks!');
      postSnapshot.changedAttributes(); // => { title: ['Ember.js rocks', 'Ember.js rocks!'] }
      ```
       @method changedAttributes
      @return {Object} All changed attributes of the current snapshot
    */
    changedAttributes: function changedAttributes() {
      var changedAttributes = new _emberDataPrivateSystemEmptyObject["default"]();
      var changedAttributeKeys = Object.keys(this._changedAttributes);

      for (var i = 0, _length = changedAttributeKeys.length; i < _length; i++) {
        var key = changedAttributeKeys[i];
        changedAttributes[key] = _ember["default"].copy(this._changedAttributes[key]);
      }

      return changedAttributes;
    },

    /**
      Returns the current value of a belongsTo relationship.
       `belongsTo` takes an optional hash of options as a second parameter,
      currently supported options are:
      - `id`: set to `true` if you only want the ID of the related record to be
        returned.
       Example
       ```javascript
      // store.push('post', { id: 1, title: 'Hello World' });
      // store.createRecord('comment', { body: 'Lorem ipsum', post: post });
      commentSnapshot.belongsTo('post'); // => DS.Snapshot
      commentSnapshot.belongsTo('post', { id: true }); // => '1'
       // store.push('comment', { id: 1, body: 'Lorem ipsum' });
      commentSnapshot.belongsTo('post'); // => undefined
      ```
       Calling `belongsTo` will return a new Snapshot as long as there's any known
      data for the relationship available, such as an ID. If the relationship is
      known but unset, `belongsTo` will return `null`. If the contents of the
      relationship is unknown `belongsTo` will return `undefined`.
       Note: Relationships are loaded lazily and cached upon first access.
       @method belongsTo
      @param {String} keyName
      @param {Object} [options]
      @return {(DS.Snapshot|String|null|undefined)} A snapshot or ID of a known
        relationship or null if the relationship is known but unset. undefined
        will be returned if the contents of the relationship is unknown.
    */
    belongsTo: function belongsTo(keyName, options) {
      var id = options && options.id;
      var relationship, inverseRecord, hasData;
      var result;

      if (id && keyName in this._belongsToIds) {
        return this._belongsToIds[keyName];
      }

      if (!id && keyName in this._belongsToRelationships) {
        return this._belongsToRelationships[keyName];
      }

      relationship = this._internalModel._relationships.get(keyName);
      if (!(relationship && relationship.relationshipMeta.kind === 'belongsTo')) {
        throw new _ember["default"].Error("Model '" + _ember["default"].inspect(this.record) + "' has no belongsTo relationship named '" + keyName + "' defined.");
      }

      hasData = get(relationship, 'hasData');
      inverseRecord = get(relationship, 'inverseRecord');

      if (hasData) {
        if (inverseRecord && !inverseRecord.isDeleted()) {
          if (id) {
            result = get(inverseRecord, 'id');
          } else {
            result = inverseRecord.createSnapshot();
          }
        } else {
          result = null;
        }
      }

      if (id) {
        this._belongsToIds[keyName] = result;
      } else {
        this._belongsToRelationships[keyName] = result;
      }

      return result;
    },

    /**
      Returns the current value of a hasMany relationship.
       `hasMany` takes an optional hash of options as a second parameter,
      currently supported options are:
      - `ids`: set to `true` if you only want the IDs of the related records to be
        returned.
       Example
       ```javascript
      // store.push('post', { id: 1, title: 'Hello World', comments: [2, 3] });
      postSnapshot.hasMany('comments'); // => [DS.Snapshot, DS.Snapshot]
      postSnapshot.hasMany('comments', { ids: true }); // => ['2', '3']
       // store.push('post', { id: 1, title: 'Hello World' });
      postSnapshot.hasMany('comments'); // => undefined
      ```
       Note: Relationships are loaded lazily and cached upon first access.
       @method hasMany
      @param {String} keyName
      @param {Object} [options]
      @return {(Array|undefined)} An array of snapshots or IDs of a known
        relationship or an empty array if the relationship is known but unset.
        undefined will be returned if the contents of the relationship is unknown.
    */
    hasMany: function hasMany(keyName, options) {
      var ids = options && options.ids;
      var relationship, members, hasData;
      var results;

      if (ids && keyName in this._hasManyIds) {
        return this._hasManyIds[keyName];
      }

      if (!ids && keyName in this._hasManyRelationships) {
        return this._hasManyRelationships[keyName];
      }

      relationship = this._internalModel._relationships.get(keyName);
      if (!(relationship && relationship.relationshipMeta.kind === 'hasMany')) {
        throw new _ember["default"].Error("Model '" + _ember["default"].inspect(this.record) + "' has no hasMany relationship named '" + keyName + "' defined.");
      }

      hasData = get(relationship, 'hasData');
      members = get(relationship, 'members');

      if (hasData) {
        results = [];
        members.forEach(function (member) {
          if (!member.isDeleted()) {
            if (ids) {
              results.push(member.id);
            } else {
              results.push(member.createSnapshot());
            }
          }
        });
      }

      if (ids) {
        this._hasManyIds[keyName] = results;
      } else {
        this._hasManyRelationships[keyName] = results;
      }

      return results;
    },

    /**
      Iterates through all the attributes of the model, calling the passed
      function on each attribute.
       Example
       ```javascript
      snapshot.eachAttribute(function(name, meta) {
        // ...
      });
      ```
       @method eachAttribute
      @param {Function} callback the callback to execute
      @param {Object} [binding] the value to which the callback's `this` should be bound
    */
    eachAttribute: function eachAttribute(callback, binding) {
      this.record.eachAttribute(callback, binding);
    },

    /**
      Iterates through all the relationships of the model, calling the passed
      function on each relationship.
       Example
       ```javascript
      snapshot.eachRelationship(function(name, relationship) {
        // ...
      });
      ```
       @method eachRelationship
      @param {Function} callback the callback to execute
      @param {Object} [binding] the value to which the callback's `this` should be bound
    */
    eachRelationship: function eachRelationship(callback, binding) {
      this.record.eachRelationship(callback, binding);
    },

    /**
      @method serialize
      @param {Object} options
      @return {Object} an object whose values are primitive JSON values only
     */
    serialize: function serialize(options) {
      return this.record.store.serializerFor(this.modelName).serialize(this, options);
    }
  };
});
define('ember-data/-private/system/store', ['exports', 'ember', 'ember-data/model', 'ember-data/-private/debug', 'ember-data/-private/system/normalize-link', 'ember-data/-private/system/normalize-model-name', 'ember-data/adapters/errors', 'ember-data/-private/system/promise-proxies', 'ember-data/-private/system/store/common', 'ember-data/-private/system/store/serializer-response', 'ember-data/-private/system/store/serializers', 'ember-data/-private/system/store/finders', 'ember-data/-private/utils', 'ember-data/-private/system/coerce-id', 'ember-data/-private/system/record-array-manager', 'ember-data/-private/system/store/container-instance-cache', 'ember-data/-private/system/model/internal-model', 'ember-data/-private/system/empty-object', 'ember-data/-private/features'], function (exports, _ember, _emberDataModel, _emberDataPrivateDebug, _emberDataPrivateSystemNormalizeLink, _emberDataPrivateSystemNormalizeModelName, _emberDataAdaptersErrors, _emberDataPrivateSystemPromiseProxies, _emberDataPrivateSystemStoreCommon, _emberDataPrivateSystemStoreSerializerResponse, _emberDataPrivateSystemStoreSerializers, _emberDataPrivateSystemStoreFinders, _emberDataPrivateUtils, _emberDataPrivateSystemCoerceId, _emberDataPrivateSystemRecordArrayManager, _emberDataPrivateSystemStoreContainerInstanceCache, _emberDataPrivateSystemModelInternalModel, _emberDataPrivateSystemEmptyObject, _emberDataPrivateFeatures) {
  /**
    @module ember-data
  */

  'use strict';

  var badIdFormatAssertion = '`id` passed to `findRecord()` has to be non-empty string or number';

  exports.badIdFormatAssertion = badIdFormatAssertion;

  var Backburner = _ember['default']._Backburner;
  var Map = _ember['default'].Map;

  //Get the materialized model from the internalModel/promise that returns
  //an internal model and return it in a promiseObject. Useful for returning
  //from find methods
  function promiseRecord(internalModel, label) {
    var toReturn = internalModel.then(function (model) {
      return model.getRecord();
    });
    return (0, _emberDataPrivateSystemPromiseProxies.promiseObject)(toReturn, label);
  }

  var once = _ember['default'].run.once;
  var Promise = _ember['default'].RSVP.Promise;
  var Store;

  var copy = _ember['default'].copy;
  var get = _ember['default'].get;
  var GUID_KEY = _ember['default'].GUID_KEY;
  var isNone = _ember['default'].isNone;
  var isPresent = _ember['default'].isPresent;
  var set = _ember['default'].set;
  var Service = _ember['default'].Service;

  // Implementors Note:
  //
  //   The variables in this file are consistently named according to the following
  //   scheme:
  //
  //   * +id+ means an identifier managed by an external source, provided inside
  //     the data provided by that source. These are always coerced to be strings
  //     before being used internally.
  //   * +clientId+ means a transient numerical identifier generated at runtime by
  //     the data store. It is important primarily because newly created objects may
  //     not yet have an externally generated id.
  //   * +internalModel+ means a record internalModel object, which holds metadata about a
  //     record, even if it has not yet been fully materialized.
  //   * +type+ means a DS.Model.

  /**
    The store contains all of the data for records loaded from the server.
    It is also responsible for creating instances of `DS.Model` that wrap
    the individual data for a record, so that they can be bound to in your
    Handlebars templates.
  
    Define your application's store like this:
  
    ```app/services/store.js
    import DS from 'ember-data';
  
    export default DS.Store.extend({
    });
    ```
  
    Most Ember.js applications will only have a single `DS.Store` that is
    automatically created by their `Ember.Application`.
  
    You can retrieve models from the store in several ways. To retrieve a record
    for a specific id, use `DS.Store`'s `findRecord()` method:
  
    ```javascript
    store.findRecord('person', 123).then(function (person) {
    });
    ```
  
    By default, the store will talk to your backend using a standard
    REST mechanism. You can customize how the store talks to your
    backend by specifying a custom adapter:
  
    ```app/adapters/application.js
    import DS from 'ember-data';
  
    export default DS.Adapter.extend({
    });
    ```
  
    You can learn more about writing a custom adapter by reading the `DS.Adapter`
    documentation.
  
    ### Store createRecord() vs. push() vs. pushPayload()
  
    The store provides multiple ways to create new record objects. They have
    some subtle differences in their use which are detailed below:
  
    [createRecord](#method_createRecord) is used for creating new
    records on the client side. This will return a new record in the
    `created.uncommitted` state. In order to persist this record to the
    backend you will need to call `record.save()`.
  
    [push](#method_push) is used to notify Ember Data's store of new or
    updated records that exist in the backend. This will return a record
    in the `loaded.saved` state. The primary use-case for `store#push` is
    to notify Ember Data about record updates (full or partial) that happen
    outside of the normal adapter methods (for example
    [SSE](http://dev.w3.org/html5/eventsource/) or [Web
    Sockets](http://www.w3.org/TR/2009/WD-websockets-20091222/)).
  
    [pushPayload](#method_pushPayload) is a convenience wrapper for
    `store#push` that will deserialize payloads if the
    Serializer implements a `pushPayload` method.
  
    Note: When creating a new record using any of the above methods
    Ember Data will update `DS.RecordArray`s such as those returned by
    `store#peekAll()`, `store#findAll()` or `store#filter()`. This means any
    data bindings or computed properties that depend on the RecordArray
    will automatically be synced to include the new or updated record
    values.
  
    @class Store
    @namespace DS
    @extends Ember.Service
  */
  exports.Store = Store = Service.extend({

    /**
      @method init
      @private
    */
    init: function init() {
      this._super.apply(this, arguments);
      this._backburner = new Backburner(['normalizeRelationships', 'syncRelationships', 'finished']);
      // internal bookkeeping; not observable
      this.typeMaps = {};
      this.recordArrayManager = _emberDataPrivateSystemRecordArrayManager['default'].create({
        store: this
      });
      this._pendingSave = [];
      this._instanceCache = new _emberDataPrivateSystemStoreContainerInstanceCache['default']((0, _emberDataPrivateUtils.getOwner)(this));
      //Used to keep track of all the find requests that need to be coalesced
      this._pendingFetch = Map.create();
    },

    /**
      The adapter to use to communicate to a backend server or other persistence layer.
       This can be specified as an instance, class, or string.
       If you want to specify `app/adapters/custom.js` as a string, do:
       ```js
      adapter: 'custom'
      ```
       @property adapter
      @default DS.JSONAPIAdapter
      @type {(DS.Adapter|String)}
    */
    adapter: '-json-api',

    /**
      Returns a JSON representation of the record using a custom
      type-specific serializer, if one exists.
       The available options are:
       * `includeId`: `true` if the record's ID should be included in
        the JSON representation
       @method serialize
      @private
      @param {DS.Model} record the record to serialize
      @param {Object} options an options hash
    */
    serialize: function serialize(record, options) {
      var snapshot = record._internalModel.createSnapshot();
      return snapshot.serialize(options);
    },

    /**
      This property returns the adapter, after resolving a possible
      string key.
       If the supplied `adapter` was a class, or a String property
      path resolved to a class, this property will instantiate the
      class.
       This property is cacheable, so the same instance of a specified
      adapter class should be used for the lifetime of the store.
       @property defaultAdapter
      @private
      @return DS.Adapter
    */
    defaultAdapter: _ember['default'].computed('adapter', function () {
      var adapter = get(this, 'adapter');

      (0, _emberDataPrivateDebug.assert)('You tried to set `adapter` property to an instance of `DS.Adapter`, where it should be a name', typeof adapter === 'string');

      adapter = this.retrieveManagedInstance('adapter', adapter);

      return adapter;
    }),

    // .....................
    // . CREATE NEW RECORD .
    // .....................

    /**
      Create a new record in the current store. The properties passed
      to this method are set on the newly created record.
       To create a new instance of a `Post`:
       ```js
      store.createRecord('post', {
        title: "Rails is omakase"
      });
      ```
       To create a new instance of a `Post` that has a relationship with a `User` record:
       ```js
      var user = this.store.peekRecord('user', 1);
      store.createRecord('post', {
        title: "Rails is omakase",
        user: user
      });
      ```
       @method createRecord
      @param {String} modelName
      @param {Object} inputProperties a hash of properties to set on the
        newly created record.
      @return {DS.Model} record
    */
    createRecord: function createRecord(modelName, inputProperties) {
      (0, _emberDataPrivateDebug.assert)("You need to pass a model name to the store's createRecord method", isPresent(modelName));
      (0, _emberDataPrivateDebug.assert)('Passing classes to store methods has been removed. Please pass a dasherized string instead of ' + _ember['default'].inspect(modelName), typeof modelName === 'string');
      var typeClass = this.modelFor(modelName);
      var properties = copy(inputProperties) || new _emberDataPrivateSystemEmptyObject['default']();

      // If the passed properties do not include a primary key,
      // give the adapter an opportunity to generate one. Typically,
      // client-side ID generators will use something like uuid.js
      // to avoid conflicts.

      if (isNone(properties.id)) {
        properties.id = this._generateId(modelName, properties);
      }

      // Coerce ID to a string
      properties.id = (0, _emberDataPrivateSystemCoerceId['default'])(properties.id);

      var internalModel = this.buildInternalModel(typeClass, properties.id);
      var record = internalModel.getRecord();

      // Move the record out of its initial `empty` state into
      // the `loaded` state.
      internalModel.loadedData();

      // Set the properties specified on the record.
      record.setProperties(properties);

      internalModel.eachRelationship(function (key, descriptor) {
        internalModel._relationships.get(key).setHasData(true);
      });

      return record;
    },

    /**
      If possible, this method asks the adapter to generate an ID for
      a newly created record.
       @method _generateId
      @private
      @param {String} modelName
      @param {Object} properties from the new record
      @return {String} if the adapter can generate one, an ID
    */
    _generateId: function _generateId(modelName, properties) {
      var adapter = this.adapterFor(modelName);

      if (adapter && adapter.generateIdForRecord) {
        return adapter.generateIdForRecord(this, modelName, properties);
      }

      return null;
    },

    // .................
    // . DELETE RECORD .
    // .................

    /**
      For symmetry, a record can be deleted via the store.
       Example
       ```javascript
      var post = store.createRecord('post', {
        title: "Rails is omakase"
      });
       store.deleteRecord(post);
      ```
       @method deleteRecord
      @param {DS.Model} record
    */
    deleteRecord: function deleteRecord(record) {
      record.deleteRecord();
    },

    /**
      For symmetry, a record can be unloaded via the store. Only
      non-dirty records can be unloaded.
       Example
       ```javascript
      store.findRecord('post', 1).then(function(post) {
        store.unloadRecord(post);
      });
      ```
       @method unloadRecord
      @param {DS.Model} record
    */
    unloadRecord: function unloadRecord(record) {
      record.unloadRecord();
    },

    // ................
    // . FIND RECORDS .
    // ................

    /**
      @method find
      @param {String} modelName
      @param {String|Integer} id
      @param {Object} options
      @return {Promise} promise
      @private
    */
    find: function find(modelName, id, options) {
      // The default `model` hook in Ember.Route calls `find(modelName, id)`,
      // that's why we have to keep this method around even though `findRecord` is
      // the public way to get a record by modelName and id.

      if (arguments.length === 1) {
        (0, _emberDataPrivateDebug.assert)('Using store.find(type) has been removed. Use store.findAll(type) to retrieve all records for a given type.');
      }

      if (_ember['default'].typeOf(id) === 'object') {
        (0, _emberDataPrivateDebug.assert)('Calling store.find() with a query object is no longer supported. Use store.query() instead.');
      }

      if (options) {
        (0, _emberDataPrivateDebug.assert)('Calling store.find(type, id, { preload: preload }) is no longer supported. Use store.findRecord(type, id, { preload: preload }) instead.');
      }

      (0, _emberDataPrivateDebug.assert)("You need to pass the model name and id to the store's find method", arguments.length === 2);
      (0, _emberDataPrivateDebug.assert)("You cannot pass `" + _ember['default'].inspect(id) + "` as id to the store's find method", _ember['default'].typeOf(id) === 'string' || _ember['default'].typeOf(id) === 'number');
      (0, _emberDataPrivateDebug.assert)('Passing classes to store methods has been removed. Please pass a dasherized string instead of ' + _ember['default'].inspect(modelName), typeof modelName === 'string');

      return this.findRecord(modelName, id);
    },

    /**
      This method returns a record for a given type and id combination.
       The `findRecord` method will always resolve its promise with the same
      object for a given type and `id`.
       The `findRecord` method will always return a **promise** that will be
      resolved with the record.
       Example
       ```app/routes/post.js
      import Ember from 'ember';
       export default Ember.Route.extend({
        model: function(params) {
          return this.store.findRecord('post', params.post_id);
        }
      });
      ```
       If the record is not yet available, the store will ask the adapter's `find`
      method to find the necessary data. If the record is already present in the
      store, it depends on the reload behavior _when_ the returned promise
      resolves.
       ### Reloading
       The reload behavior is configured either via the passed `options` hash or
      the result of the adapter's `shouldReloadRecord`.
       If `{ reload: true }` is passed or `adapter.shouldReloadRecord` evaluates
      to `true`, then the returned promise resolves once the adapter returns
      data, regardless if the requested record is already in the store:
       ```js
      store.push({
        data: {
          id: 1,
          type: 'post',
          revision: 1
        }
      });
       // adapter#findRecord resolves with
      // [
      //   {
      //     id: 1,
      //     type: 'post',
      //     revision: 2
      //   }
      // ]
      store.findRecord('post', 1, { reload: true }).then(function(post) {
        post.get("revision"); // 2
      });
      ```
       If no reload is indicated via the abovementioned ways, then the promise
      immediately resolves with the cached version in the store.
       ### Background Reloading
       Optionally, if `adapter.shouldBackgroundReloadRecord` evaluates to `true`,
      then a background reload is started, which updates the records' data, once
      it is available:
       ```js
      // app/adapters/post.js
      import ApplicationAdapter from "./application";
       export default ApplicationAdapter.extend({
        shouldReloadRecord(store, snapshot) {
          return false;
        },
         shouldBackgroundReloadRecord(store, snapshot) {
          return true;
        }
      });
       // ...
       store.push({
        data: {
          id: 1,
          type: 'post',
          revision: 1
        }
      });
       var blogPost = store.findRecord('post', 1).then(function(post) {
        post.get('revision'); // 1
      });
       // later, once adapter#findRecord resolved with
      // [
      //   {
      //     id: 1,
      //     type: 'post',
      //     revision: 2
      //   }
      // ]
       blogPost.get('revision'); // 2
      ```
       If you would like to force or prevent background reloading, you can set a
      boolean value for `backgroundReload` in the options object for
      `findRecord`.
       ```app/routes/post/edit.js
      import Ember from 'ember';
       export default Ember.Route.extend({
        model: function(params) {
          return this.store.findRecord('post', params.post_id, { backgroundReload: false });
        }
      });
      ```
      If you pass an object on the `adapterOptions` property of the options
     argument it will be passed to you adapter via the snapshot
       ```app/routes/post/edit.js
      import Ember from 'ember';
       export default Ember.Route.extend({
        model: function(params) {
          return this.store.findRecord('post', params.post_id, {
            adapterOptions: { subscribe: false }
          });
        }
      });
      ```
       ```app/adapters/post.js
      import MyCustomAdapter from './custom-adapter';
       export default MyCustomAdapter.extend({
        findRecord: function(store, type, id, snapshot) {
          if (snapshot.adapterOptions.subscribe) {
            // ...
          }
          // ...
        }
      });
      ```
       See [peekRecord](#method_peekRecord) to get the cached version of a record.
       @since 1.13.0
      @method findRecord
      @param {String} modelName
      @param {(String|Integer)} id
      @param {Object} options
      @return {Promise} promise
    */
    findRecord: function findRecord(modelName, id, options) {
      (0, _emberDataPrivateDebug.assert)("You need to pass a model name to the store's findRecord method", isPresent(modelName));
      (0, _emberDataPrivateDebug.assert)('Passing classes to store methods has been removed. Please pass a dasherized string instead of ' + _ember['default'].inspect(modelName), typeof modelName === 'string');
      (0, _emberDataPrivateDebug.assert)(badIdFormatAssertion, typeof id === 'string' && id.length > 0 || typeof id === 'number' && !isNaN(id));

      var internalModel = this._internalModelForId(modelName, id);
      options = options || {};

      if (!this.hasRecordForId(modelName, id)) {
        return this._findByInternalModel(internalModel, options);
      }

      var fetchedInternalModel = this._findRecord(internalModel, options);

      return promiseRecord(fetchedInternalModel, "DS: Store#findRecord " + internalModel.typeKey + " with id: " + get(internalModel, 'id'));
    },

    _findRecord: function _findRecord(internalModel, options) {
      // Refetch if the reload option is passed
      if (options.reload) {
        return this.scheduleFetch(internalModel, options);
      }

      var snapshot = internalModel.createSnapshot(options);
      var typeClass = internalModel.type;
      var adapter = this.adapterFor(typeClass.modelName);

      // Refetch the record if the adapter thinks the record is stale
      if (adapter.shouldReloadRecord(this, snapshot)) {
        return this.scheduleFetch(internalModel, options);
      }

      if (options.backgroundReload === false) {
        return Promise.resolve(internalModel);
      }

      // Trigger the background refetch if backgroundReload option is passed
      if (options.backgroundReload || adapter.shouldBackgroundReloadRecord(this, snapshot)) {
        this.scheduleFetch(internalModel, options);
      }

      // Return the cached record
      return Promise.resolve(internalModel);
    },

    _findByInternalModel: function _findByInternalModel(internalModel, options) {
      options = options || {};

      if (options.preload) {
        internalModel._preloadData(options.preload);
      }

      var fetchedInternalModel = this._findEmptyInternalModel(internalModel, options);

      return promiseRecord(fetchedInternalModel, "DS: Store#findRecord " + internalModel.typeKey + " with id: " + get(internalModel, 'id'));
    },

    _findEmptyInternalModel: function _findEmptyInternalModel(internalModel, options) {
      if (internalModel.isEmpty()) {
        return this.scheduleFetch(internalModel, options);
      }

      //TODO double check about reloading
      if (internalModel.isLoading()) {
        return internalModel._loadingPromise;
      }

      return Promise.resolve(internalModel);
    },

    /**
      This method makes a series of requests to the adapter's `find` method
      and returns a promise that resolves once they are all loaded.
       @private
      @method findByIds
      @param {String} modelName
      @param {Array} ids
      @return {Promise} promise
    */
    findByIds: function findByIds(modelName, ids) {
      (0, _emberDataPrivateDebug.assert)("You need to pass a model name to the store's findByIds method", isPresent(modelName));
      (0, _emberDataPrivateDebug.assert)('Passing classes to store methods has been removed. Please pass a dasherized string instead of ' + _ember['default'].inspect(modelName), typeof modelName === 'string');
      var promises = new Array(ids.length);

      for (var i = 0; i < ids.length; i++) {
        promises[i] = this.findRecord(modelName, ids[i]);
      }

      return (0, _emberDataPrivateSystemPromiseProxies.promiseArray)(_ember['default'].RSVP.all(promises).then(_ember['default'].A, null, "DS: Store#findByIds of " + modelName + " complete"));
    },

    /**
      This method is called by `findRecord` if it discovers that a particular
      type/id pair hasn't been loaded yet to kick off a request to the
      adapter.
       @method fetchRecord
      @private
      @param {InternalModel} internalModel model
      @return {Promise} promise
     */
    // TODO rename this to have an underscore
    fetchRecord: function fetchRecord(internalModel, options) {
      var typeClass = internalModel.type;
      var id = internalModel.id;
      var adapter = this.adapterFor(typeClass.modelName);

      (0, _emberDataPrivateDebug.assert)("You tried to find a record but you have no adapter (for " + typeClass + ")", adapter);
      (0, _emberDataPrivateDebug.assert)("You tried to find a record but your adapter (for " + typeClass + ") does not implement 'findRecord'", typeof adapter.findRecord === 'function' || typeof adapter.find === 'function');

      var promise = (0, _emberDataPrivateSystemStoreFinders._find)(adapter, this, typeClass, id, internalModel, options);
      return promise;
    },

    scheduleFetchMany: function scheduleFetchMany(records) {
      var internalModels = new Array(records.length);
      var fetches = new Array(records.length);
      for (var i = 0; i < records.length; i++) {
        internalModels[i] = records[i]._internalModel;
      }

      for (var i = 0; i < internalModels.length; i++) {
        fetches[i] = this.scheduleFetch(internalModels[i]);
      }

      return _ember['default'].RSVP.Promise.all(fetches);
    },

    scheduleFetch: function scheduleFetch(internalModel, options) {
      var typeClass = internalModel.type;

      if (internalModel._loadingPromise) {
        return internalModel._loadingPromise;
      }

      var resolver = _ember['default'].RSVP.defer('Fetching ' + typeClass + 'with id: ' + internalModel.id);
      var pendingFetchItem = {
        record: internalModel,
        resolver: resolver,
        options: options
      };
      var promise = resolver.promise;

      internalModel.loadingData(promise);

      if (!this._pendingFetch.get(typeClass)) {
        this._pendingFetch.set(typeClass, [pendingFetchItem]);
      } else {
        this._pendingFetch.get(typeClass).push(pendingFetchItem);
      }
      _ember['default'].run.scheduleOnce('afterRender', this, this.flushAllPendingFetches);

      return promise;
    },

    flushAllPendingFetches: function flushAllPendingFetches() {
      if (this.isDestroyed || this.isDestroying) {
        return;
      }

      this._pendingFetch.forEach(this._flushPendingFetchForType, this);
      this._pendingFetch = Map.create();
    },

    _flushPendingFetchForType: function _flushPendingFetchForType(pendingFetchItems, typeClass) {
      var store = this;
      var adapter = store.adapterFor(typeClass.modelName);
      var shouldCoalesce = !!adapter.findMany && adapter.coalesceFindRequests;
      var records = _ember['default'].A(pendingFetchItems).mapBy('record');

      function _fetchRecord(recordResolverPair) {
        recordResolverPair.resolver.resolve(store.fetchRecord(recordResolverPair.record, recordResolverPair.options)); // TODO adapter options
      }

      function resolveFoundRecords(records) {
        records.forEach(function (record) {
          var pair = _ember['default'].A(pendingFetchItems).findBy('record', record);
          if (pair) {
            var resolver = pair.resolver;
            resolver.resolve(record);
          }
        });
        return records;
      }

      function makeMissingRecordsRejector(requestedRecords) {
        return function rejectMissingRecords(resolvedRecords) {
          resolvedRecords = _ember['default'].A(resolvedRecords);
          var missingRecords = requestedRecords.reject(function (record) {
            return resolvedRecords.includes(record);
          });
          if (missingRecords.length) {
            (0, _emberDataPrivateDebug.warn)('Ember Data expected to find records with the following ids in the adapter response but they were missing: ' + _ember['default'].inspect(_ember['default'].A(missingRecords).mapBy('id')), false, {
              id: 'ds.store.missing-records-from-adapter'
            });
          }
          rejectRecords(missingRecords);
        };
      }

      function makeRecordsRejector(records) {
        return function (error) {
          rejectRecords(records, error);
        };
      }

      function rejectRecords(records, error) {
        records.forEach(function (record) {
          var pair = _ember['default'].A(pendingFetchItems).findBy('record', record);
          if (pair) {
            var resolver = pair.resolver;
            resolver.reject(error);
          }
        });
      }

      if (pendingFetchItems.length === 1) {
        _fetchRecord(pendingFetchItems[0]);
      } else if (shouldCoalesce) {

        // TODO: Improve records => snapshots => records => snapshots
        //
        // We want to provide records to all store methods and snapshots to all
        // adapter methods. To make sure we're doing that we're providing an array
        // of snapshots to adapter.groupRecordsForFindMany(), which in turn will
        // return grouped snapshots instead of grouped records.
        //
        // But since the _findMany() finder is a store method we need to get the
        // records from the grouped snapshots even though the _findMany() finder
        // will once again convert the records to snapshots for adapter.findMany()

        var snapshots = _ember['default'].A(records).invoke('createSnapshot');
        var groups = adapter.groupRecordsForFindMany(this, snapshots);
        groups.forEach(function (groupOfSnapshots) {
          var groupOfRecords = _ember['default'].A(groupOfSnapshots).mapBy('_internalModel');
          var requestedRecords = _ember['default'].A(groupOfRecords);
          var ids = requestedRecords.mapBy('id');
          if (ids.length > 1) {
            (0, _emberDataPrivateSystemStoreFinders._findMany)(adapter, store, typeClass, ids, requestedRecords).then(resolveFoundRecords).then(makeMissingRecordsRejector(requestedRecords)).then(null, makeRecordsRejector(requestedRecords));
          } else if (ids.length === 1) {
            var pair = _ember['default'].A(pendingFetchItems).findBy('record', groupOfRecords[0]);
            _fetchRecord(pair);
          } else {
            (0, _emberDataPrivateDebug.assert)("You cannot return an empty array from adapter's method groupRecordsForFindMany", false);
          }
        });
      } else {
        pendingFetchItems.forEach(_fetchRecord);
      }
    },

    /**
      Get the reference for the specified record.
       Example
       ```javascript
      var userRef = store.getReference('user', 1);
       // check if the user is loaded
      var isLoaded = userRef.value() !== null;
       // get the record of the reference (null if not yet available)
      var user = userRef.value();
       // get the identifier of the reference
      if (userRef.remoteType() === "id") {
      var id = userRef.id();
      }
       // load user (via store.find)
      userRef.load().then(...)
       // or trigger a reload
      userRef.reload().then(...)
       // provide data for reference
      userRef.push({ id: 1, username: "@user" }).then(function(user) {
      userRef.value() === user;
      });
      ```
       @method getReference
      @param {String} type
      @param {String|Integer} id
      @since 2.5.0
      @return {RecordReference}
    */
    getReference: function getReference(type, id) {
      return this._internalModelForId(type, id).recordReference;
    },

    /**
      Get a record by a given type and ID without triggering a fetch.
       This method will synchronously return the record if it is available in the store,
      otherwise it will return `null`. A record is available if it has been fetched earlier, or
      pushed manually into the store.
       _Note: This is an synchronous method and does not return a promise._
       ```js
      var post = store.peekRecord('post', 1);
       post.get('id'); // 1
      ```
       @since 1.13.0
      @method peekRecord
      @param {String} modelName
      @param {String|Integer} id
      @return {DS.Model|null} record
    */
    peekRecord: function peekRecord(modelName, id) {
      (0, _emberDataPrivateDebug.assert)("You need to pass a model name to the store's peekRecord method", isPresent(modelName));
      (0, _emberDataPrivateDebug.assert)('Passing classes to store methods has been removed. Please pass a dasherized string instead of ' + _ember['default'].inspect(modelName), typeof modelName === 'string');
      if (this.hasRecordForId(modelName, id)) {
        return this._internalModelForId(modelName, id).getRecord();
      } else {
        return null;
      }
    },

    /**
      This method is called by the record's `reload` method.
       This method calls the adapter's `find` method, which returns a promise. When
      **that** promise resolves, `reloadRecord` will resolve the promise returned
      by the record's `reload`.
       @method reloadRecord
      @private
      @param {DS.Model} internalModel
      @return {Promise} promise
    */
    reloadRecord: function reloadRecord(internalModel) {
      var modelName = internalModel.type.modelName;
      var adapter = this.adapterFor(modelName);
      var id = internalModel.id;

      (0, _emberDataPrivateDebug.assert)("You cannot reload a record without an ID", id);
      (0, _emberDataPrivateDebug.assert)("You tried to reload a record but you have no adapter (for " + modelName + ")", adapter);
      (0, _emberDataPrivateDebug.assert)("You tried to reload a record but your adapter does not implement `findRecord`", typeof adapter.findRecord === 'function' || typeof adapter.find === 'function');

      return this.scheduleFetch(internalModel);
    },

    /**
      Returns true if a record for a given type and ID is already loaded.
       @method hasRecordForId
      @param {(String|DS.Model)} modelName
      @param {(String|Integer)} inputId
      @return {Boolean}
    */
    hasRecordForId: function hasRecordForId(modelName, inputId) {
      (0, _emberDataPrivateDebug.assert)("You need to pass a model name to the store's hasRecordForId method", isPresent(modelName));
      (0, _emberDataPrivateDebug.assert)('Passing classes to store methods has been removed. Please pass a dasherized string instead of ' + _ember['default'].inspect(modelName), typeof modelName === 'string');
      var typeClass = this.modelFor(modelName);
      var id = (0, _emberDataPrivateSystemCoerceId['default'])(inputId);
      var internalModel = this.typeMapFor(typeClass).idToRecord[id];
      return !!internalModel && internalModel.isLoaded();
    },

    /**
      Returns id record for a given type and ID. If one isn't already loaded,
      it builds a new record and leaves it in the `empty` state.
       @method recordForId
      @private
      @param {String} modelName
      @param {(String|Integer)} id
      @return {DS.Model} record
    */
    recordForId: function recordForId(modelName, id) {
      (0, _emberDataPrivateDebug.assert)("You need to pass a model name to the store's recordForId method", isPresent(modelName));
      (0, _emberDataPrivateDebug.assert)('Passing classes to store methods has been removed. Please pass a dasherized string instead of ' + _ember['default'].inspect(modelName), typeof modelName === 'string');
      return this._internalModelForId(modelName, id).getRecord();
    },

    _internalModelForId: function _internalModelForId(typeName, inputId) {
      var typeClass = this.modelFor(typeName);
      var id = (0, _emberDataPrivateSystemCoerceId['default'])(inputId);
      var idToRecord = this.typeMapFor(typeClass).idToRecord;
      var record = idToRecord[id];

      if (!record || !idToRecord[id]) {
        record = this.buildInternalModel(typeClass, id);
      }

      return record;
    },

    /**
      @method findMany
      @private
      @param {Array} internalModels
      @return {Promise} promise
    */
    findMany: function findMany(internalModels) {
      var finds = new Array(internalModels.length);

      for (var i = 0; i < internalModels.length; i++) {
        finds[i] = this._findByInternalModel(internalModels[i]);
      }

      return Promise.all(finds);
    },

    /**
      If a relationship was originally populated by the adapter as a link
      (as opposed to a list of IDs), this method is called when the
      relationship is fetched.
       The link (which is usually a URL) is passed through unchanged, so the
      adapter can make whatever request it wants.
       The usual use-case is for the server to register a URL as a link, and
      then use that URL in the future to make a request for the relationship.
       @method findHasMany
      @private
      @param {DS.Model} owner
      @param {any} link
      @param {(Relationship)} relationship
      @return {Promise} promise
    */
    findHasMany: function findHasMany(owner, link, relationship) {
      var adapter = this.adapterFor(owner.type.modelName);

      (0, _emberDataPrivateDebug.assert)("You tried to load a hasMany relationship but you have no adapter (for " + owner.type + ")", adapter);
      (0, _emberDataPrivateDebug.assert)("You tried to load a hasMany relationship from a specified `link` in the original payload but your adapter does not implement `findHasMany`", typeof adapter.findHasMany === 'function');

      return (0, _emberDataPrivateSystemStoreFinders._findHasMany)(adapter, this, owner, link, relationship);
    },

    /**
      @method findBelongsTo
      @private
      @param {DS.Model} owner
      @param {any} link
      @param {Relationship} relationship
      @return {Promise} promise
    */
    findBelongsTo: function findBelongsTo(owner, link, relationship) {
      var adapter = this.adapterFor(owner.type.modelName);

      (0, _emberDataPrivateDebug.assert)("You tried to load a belongsTo relationship but you have no adapter (for " + owner.type + ")", adapter);
      (0, _emberDataPrivateDebug.assert)("You tried to load a belongsTo relationship from a specified `link` in the original payload but your adapter does not implement `findBelongsTo`", typeof adapter.findBelongsTo === 'function');

      return (0, _emberDataPrivateSystemStoreFinders._findBelongsTo)(adapter, this, owner, link, relationship);
    },

    /**
      This method delegates a query to the adapter. This is the one place where
      adapter-level semantics are exposed to the application.
       Exposing queries this way seems preferable to creating an abstract query
      language for all server-side queries, and then require all adapters to
      implement them.
       ---
       If you do something like this:
       ```javascript
      store.query('person', { page: 1 });
      ```
       The call made to the server, using a Rails backend, will look something like this:
       ```
      Started GET "/api/v1/person?page=1"
      Processing by Api::V1::PersonsController#index as HTML
      Parameters: { "page"=>"1" }
      ```
       ---
       If you do something like this:
       ```javascript
      store.query('person', { ids: [1, 2, 3] });
      ```
       The call to the server, using a Rails backend, will look something like this:
       ```
      Started GET "/api/v1/person?ids%5B%5D=1&ids%5B%5D=2&ids%5B%5D=3"
      Processing by Api::V1::PersonsController#index as HTML
      Parameters: { "ids" => ["1", "2", "3"] }
      ```
       This method returns a promise, which is resolved with an
      [`AdapterPopulatedRecordArray`](http://emberjs.com/api/data/classes/DS.AdapterPopulatedRecordArray.html)
      once the server returns.
       @since 1.13.0
      @method query
      @param {String} modelName
      @param {any} query an opaque query to be used by the adapter
      @return {Promise} promise
    */
    query: function query(modelName, _query2) {
      return this._query(modelName, _query2);
    },

    _query: function _query(modelName, query, array) {
      (0, _emberDataPrivateDebug.assert)("You need to pass a model name to the store's query method", isPresent(modelName));
      (0, _emberDataPrivateDebug.assert)("You need to pass a query hash to the store's query method", query);
      (0, _emberDataPrivateDebug.assert)('Passing classes to store methods has been removed. Please pass a dasherized string instead of ' + _ember['default'].inspect(modelName), typeof modelName === 'string');
      var typeClass = this.modelFor(modelName);
      array = array || this.recordArrayManager.createAdapterPopulatedRecordArray(typeClass, query);

      var adapter = this.adapterFor(modelName);

      (0, _emberDataPrivateDebug.assert)("You tried to load a query but you have no adapter (for " + typeClass + ")", adapter);
      (0, _emberDataPrivateDebug.assert)("You tried to load a query but your adapter does not implement `query`", typeof adapter.query === 'function');

      var pA = (0, _emberDataPrivateSystemPromiseProxies.promiseArray)((0, _emberDataPrivateSystemStoreFinders._query)(adapter, this, typeClass, query, array));

      return pA;
    },

    /**
      This method makes a request for one record, where the `id` is not known
      beforehand (if the `id` is known, use `findRecord` instead).
       This method can be used when it is certain that the server will return a
      single object for the primary data.
       Let's assume our API provides an endpoint for the currently logged in user
      via:
       ```
      // GET /api/current_user
      {
        user: {
          id: 1234,
          username: 'admin'
        }
      }
      ```
       Since the specific `id` of the `user` is not known beforehand, we can use
      `queryRecord` to get the user:
       ```javascript
      store.queryRecord('user', {}).then(function(user) {
        let username = user.get('username');
        console.log(`Currently logged in as ${username}`);
      });
      ```
       The request is made through the adapters' `queryRecord`:
       ```javascript
      // app/adapters/user.js
      import DS from "ember-data";
       export default DS.Adapter.extend({
        queryRecord(modelName, query) {
          return Ember.$.getJSON("/api/current_user");
        }
      });
      ```
       Note: the primary use case for `store.queryRecord` is when a single record
      is queried and the `id` is not known beforehand. In all other cases
      `store.query` and using the first item of the array is likely the preferred
      way:
       ```
      // GET /users?username=unique
      {
        data: [{
          id: 1234,
          type: 'user',
          attributes: {
            username: "unique"
          }
        }]
      }
      ```
       ```javascript
      store.query('user', { username: 'unique' }).then(function(users) {
        return users.get('firstObject');
      }).then(function(user) {
        let id = user.get('id');
      });
      ```
       This method returns a promise, which resolves with the found record.
       If the adapter returns no data for the primary data of the payload, then
      `queryRecord` resolves with `null`:
       ```
      // GET /users?username=unique
      {
        data: null
      }
      ```
       ```javascript
      store.queryRecord('user', { username: 'unique' }).then(function(user) {
        console.log(user); // null
      });
      ```
       @since 1.13.0
      @method queryRecord
      @param {String} modelName
      @param {any} query an opaque query to be used by the adapter
      @return {Promise} promise which resolves with the found record or `null`
    */
    queryRecord: function queryRecord(modelName, query) {
      (0, _emberDataPrivateDebug.assert)("You need to pass a model name to the store's queryRecord method", isPresent(modelName));
      (0, _emberDataPrivateDebug.assert)("You need to pass a query hash to the store's queryRecord method", query);
      (0, _emberDataPrivateDebug.assert)('Passing classes to store methods has been removed. Please pass a dasherized string instead of ' + _ember['default'].inspect(modelName), typeof modelName === 'string');

      var typeClass = this.modelFor(modelName);
      var adapter = this.adapterFor(modelName);

      (0, _emberDataPrivateDebug.assert)("You tried to make a query but you have no adapter (for " + typeClass + ")", adapter);
      (0, _emberDataPrivateDebug.assert)("You tried to make a query but your adapter does not implement `queryRecord`", typeof adapter.queryRecord === 'function');

      return (0, _emberDataPrivateSystemPromiseProxies.promiseObject)((0, _emberDataPrivateSystemStoreFinders._queryRecord)(adapter, this, typeClass, query));
    },

    /**
      `findAll` asks the adapter's `findAll` method to find the records for the
      given type, and returns a promise which will resolve with all records of
      this type present in the store, even if the adapter only returns a subset
      of them.
       ```app/routes/authors.js
      import Ember from 'ember';
       export default Ember.Route.extend({
        model: function(params) {
          return this.store.findAll('author');
        }
      });
      ```
       _When_ the returned promise resolves depends on the reload behavior,
      configured via the passed `options` hash and the result of the adapter's
      `shouldReloadAll` method.
       ### Reloading
       If `{ reload: true }` is passed or `adapter.shouldReloadAll` evaluates to
      `true`, then the returned promise resolves once the adapter returns data,
      regardless if there are already records in the store:
       ```js
      store.push({
        data: {
          id: 'first',
          type: 'author'
        }
      });
       // adapter#findAll resolves with
      // [
      //   {
      //     id: 'second',
      //     type: 'author'
      //   }
      // ]
      store.findAll('author', { reload: true }).then(function(authors) {
        authors.getEach("id"); // ['first', 'second']
      });
      ```
       If no reload is indicated via the abovementioned ways, then the promise
      immediately resolves with all the records currently loaded in the store.
       ### Background Reloading
       Optionally, if `adapter.shouldBackgroundReloadAll` evaluates to `true`,
      then a background reload is started. Once this resolves, the array with
      which the promise resolves, is updated automatically so it contains all the
      records in the store:
       ```js
      // app/adapters/application.js
      export default DS.Adapter.extend({
        shouldReloadAll(store, snapshotsArray) {
          return false;
        },
         shouldBackgroundReloadAll(store, snapshotsArray) {
          return true;
        }
      });
       // ...
       store.push({
        data: {
          id: 'first',
          type: 'author'
        }
      });
       var allAuthors;
      store.findAll('author').then(function(authors) {
        authors.getEach('id'); // ['first']
         allAuthors = authors;
      });
       // later, once adapter#findAll resolved with
      // [
      //   {
      //     id: 'second',
      //     type: 'author'
      //   }
      // ]
       allAuthors.getEach('id'); // ['first', 'second']
      ```
       If you would like to force or prevent background reloading, you can set a
      boolean value for `backgroundReload` in the options object for
      `findAll`.
       ```app/routes/post/edit.js
      import Ember from 'ember';
       export default Ember.Route.extend({
        model: function() {
          return this.store.findAll('post', { backgroundReload: false });
        }
      });
      ```
       If you pass an object on the `adapterOptions` property of the options
      argument it will be passed to you adapter via the `snapshotRecordArray`
       ```app/routes/posts.js
      import Ember from 'ember';
       export default Ember.Route.extend({
        model: function(params) {
          return this.store.findAll('post', {
            adapterOptions: { subscribe: false }
          });
        }
      });
      ```
       ```app/adapters/post.js
      import MyCustomAdapter from './custom-adapter';
       export default MyCustomAdapter.extend({
        findAll: function(store, type, sinceToken, snapshotRecordArray) {
          if (snapshotRecordArray.adapterOptions.subscribe) {
            // ...
          }
          // ...
        }
      });
      ```
        See [peekAll](#method_peekAll) to get an array of current records in the
      store, without waiting until a reload is finished.
       See [query](#method_query) to only get a subset of records from the server.
       @since 1.13.0
      @method findAll
      @param {String} modelName
      @param {Object} options
      @return {Promise} promise
    */
    findAll: function findAll(modelName, options) {
      (0, _emberDataPrivateDebug.assert)("You need to pass a model name to the store's findAll method", isPresent(modelName));
      (0, _emberDataPrivateDebug.assert)('Passing classes to store methods has been removed. Please pass a dasherized string instead of ' + _ember['default'].inspect(modelName), typeof modelName === 'string');

      var typeClass = this.modelFor(modelName);

      var fetch = this._fetchAll(typeClass, this.peekAll(modelName), options);

      return fetch;
    },

    /**
      @method _fetchAll
      @private
      @param {DS.Model} typeClass
      @param {DS.RecordArray} array
      @return {Promise} promise
    */
    _fetchAll: function _fetchAll(typeClass, array, options) {
      options = options || {};
      var adapter = this.adapterFor(typeClass.modelName);
      var sinceToken = this.typeMapFor(typeClass).metadata.since;

      (0, _emberDataPrivateDebug.assert)("You tried to load all records but you have no adapter (for " + typeClass + ")", adapter);
      (0, _emberDataPrivateDebug.assert)("You tried to load all records but your adapter does not implement `findAll`", typeof adapter.findAll === 'function');

      if (options.reload) {
        set(array, 'isUpdating', true);
        return (0, _emberDataPrivateSystemPromiseProxies.promiseArray)((0, _emberDataPrivateSystemStoreFinders._findAll)(adapter, this, typeClass, sinceToken, options));
      }

      var snapshotArray = array.createSnapshot(options);

      if (adapter.shouldReloadAll(this, snapshotArray)) {
        set(array, 'isUpdating', true);
        return (0, _emberDataPrivateSystemPromiseProxies.promiseArray)((0, _emberDataPrivateSystemStoreFinders._findAll)(adapter, this, typeClass, sinceToken, options));
      }

      if (options.backgroundReload === false) {
        return (0, _emberDataPrivateSystemPromiseProxies.promiseArray)(Promise.resolve(array));
      }

      if (options.backgroundReload || adapter.shouldBackgroundReloadAll(this, snapshotArray)) {
        set(array, 'isUpdating', true);
        (0, _emberDataPrivateSystemStoreFinders._findAll)(adapter, this, typeClass, sinceToken, options);
      }

      return (0, _emberDataPrivateSystemPromiseProxies.promiseArray)(Promise.resolve(array));
    },

    /**
      @method didUpdateAll
      @param {DS.Model} typeClass
      @private
    */
    didUpdateAll: function didUpdateAll(typeClass) {
      var liveRecordArray = this.recordArrayManager.liveRecordArrayFor(typeClass);
      set(liveRecordArray, 'isUpdating', false);
    },

    /**
      This method returns a filtered array that contains all of the
      known records for a given type in the store.
       Note that because it's just a filter, the result will contain any
      locally created records of the type, however, it will not make a
      request to the backend to retrieve additional records. If you
      would like to request all the records from the backend please use
      [store.findAll](#method_findAll).
       Also note that multiple calls to `peekAll` for a given type will always
      return the same `RecordArray`.
       Example
       ```javascript
      var localPosts = store.peekAll('post');
      ```
       @since 1.13.0
      @method peekAll
      @param {String} modelName
      @return {DS.RecordArray}
    */
    peekAll: function peekAll(modelName) {
      (0, _emberDataPrivateDebug.assert)("You need to pass a model name to the store's peekAll method", isPresent(modelName));
      (0, _emberDataPrivateDebug.assert)('Passing classes to store methods has been removed. Please pass a dasherized string instead of ' + _ember['default'].inspect(modelName), typeof modelName === 'string');
      var typeClass = this.modelFor(modelName);

      var liveRecordArray = this.recordArrayManager.liveRecordArrayFor(typeClass);
      this.recordArrayManager.populateLiveRecordArray(liveRecordArray, typeClass);

      return liveRecordArray;
    },

    /**
     This method unloads all records in the store.
      Optionally you can pass a type which unload all records for a given type.
      ```javascript
     store.unloadAll();
     store.unloadAll('post');
     ```
      @method unloadAll
     @param {String} modelName
    */
    unloadAll: function unloadAll(modelName) {
      (0, _emberDataPrivateDebug.assert)('Passing classes to store methods has been removed. Please pass a dasherized string instead of ' + _ember['default'].inspect(modelName), !modelName || typeof modelName === 'string');
      if (arguments.length === 0) {
        var typeMaps = this.typeMaps;
        var keys = Object.keys(typeMaps);
        var types = new Array(keys.length);

        for (var i = 0; i < keys.length; i++) {
          types[i] = typeMaps[keys[i]]['type'].modelName;
        }

        types.forEach(this.unloadAll, this);
      } else {
        var typeClass = this.modelFor(modelName);
        var typeMap = this.typeMapFor(typeClass);
        var records = typeMap.records.slice();
        var record = undefined;

        for (var i = 0; i < records.length; i++) {
          record = records[i];
          record.unloadRecord();
          record.destroy(); // maybe within unloadRecord
        }

        typeMap.metadata = new _emberDataPrivateSystemEmptyObject['default']();
      }
    },

    /**
      Takes a type and filter function, and returns a live RecordArray that
      remains up to date as new records are loaded into the store or created
      locally.
       The filter function takes a materialized record, and returns true
      if the record should be included in the filter and false if it should
      not.
       Example
       ```javascript
      store.filter('post', function(post) {
        return post.get('unread');
      });
      ```
       The filter function is called once on all records for the type when
      it is created, and then once on each newly loaded or created record.
       If any of a record's properties change, or if it changes state, the
      filter function will be invoked again to determine whether it should
      still be in the array.
       Optionally you can pass a query, which is the equivalent of calling
      [query](#method_query) with that same query, to fetch additional records
      from the server. The results returned by the server could then appear
      in the filter if they match the filter function.
       The query itself is not used to filter records, it's only sent to your
      server for you to be able to do server-side filtering. The filter
      function will be applied on the returned results regardless.
       Example
       ```javascript
      store.filter('post', { unread: true }, function(post) {
        return post.get('unread');
      }).then(function(unreadPosts) {
        unreadPosts.get('length'); // 5
        var unreadPost = unreadPosts.objectAt(0);
        unreadPost.set('unread', false);
        unreadPosts.get('length'); // 4
      });
      ```
       @method filter
      @private
      @param {String} modelName
      @param {Object} query optional query
      @param {Function} filter
      @return {DS.PromiseArray}
      @deprecated
    */
    filter: function filter(modelName, query, _filter) {
      (0, _emberDataPrivateDebug.assert)("You need to pass a model name to the store's filter method", isPresent(modelName));
      (0, _emberDataPrivateDebug.assert)('Passing classes to store methods has been removed. Please pass a dasherized string instead of ' + _ember['default'].inspect(modelName), typeof modelName === 'string');

      if (!_ember['default'].ENV.ENABLE_DS_FILTER) {
        (0, _emberDataPrivateDebug.assert)('The filter API has been moved to a plugin. To enable store.filter using an environment flag, or to use an alternative, you can visit the ember-data-filter addon page. https://github.com/ember-data/ember-data-filter', false);
      }

      var promise;
      var length = arguments.length;
      var array;
      var hasQuery = length === 3;

      // allow an optional server query
      if (hasQuery) {
        promise = this.query(modelName, query);
      } else if (arguments.length === 2) {
        _filter = query;
      }

      modelName = this.modelFor(modelName);

      if (hasQuery) {
        array = this.recordArrayManager.createFilteredRecordArray(modelName, _filter, query);
      } else {
        array = this.recordArrayManager.createFilteredRecordArray(modelName, _filter);
      }

      promise = promise || Promise.resolve(array);

      return (0, _emberDataPrivateSystemPromiseProxies.promiseArray)(promise.then(function () {
        return array;
      }, null, 'DS: Store#filter of ' + modelName));
    },

    /**
      This method returns if a certain record is already loaded
      in the store. Use this function to know beforehand if a findRecord()
      will result in a request or that it will be a cache hit.
        Example
       ```javascript
      store.recordIsLoaded('post', 1); // false
      store.findRecord('post', 1).then(function() {
        store.recordIsLoaded('post', 1); // true
      });
      ```
       @method recordIsLoaded
      @param {String} modelName
      @param {string} id
      @return {boolean}
    */
    recordIsLoaded: function recordIsLoaded(modelName, id) {
      (0, _emberDataPrivateDebug.assert)("You need to pass a model name to the store's recordIsLoaded method", isPresent(modelName));
      (0, _emberDataPrivateDebug.assert)('Passing classes to store methods has been removed. Please pass a dasherized string instead of ' + _ember['default'].inspect(modelName), typeof modelName === 'string');
      return this.hasRecordForId(modelName, id);
    },

    // ............
    // . UPDATING .
    // ............

    /**
      If the adapter updates attributes the record will notify
      the store to update its  membership in any filters.
      To avoid thrashing, this method is invoked only once per
      run loop per record.
       @method dataWasUpdated
      @private
      @param {Class} type
      @param {InternalModel} internalModel
    */
    dataWasUpdated: function dataWasUpdated(type, internalModel) {
      this.recordArrayManager.recordDidChange(internalModel);
    },

    // ..............
    // . PERSISTING .
    // ..............

    /**
      This method is called by `record.save`, and gets passed a
      resolver for the promise that `record.save` returns.
       It schedules saving to happen at the end of the run loop.
       @method scheduleSave
      @private
      @param {InternalModel} internalModel
      @param {Resolver} resolver
      @param {Object} options
    */
    scheduleSave: function scheduleSave(internalModel, resolver, options) {
      var snapshot = internalModel.createSnapshot(options);
      internalModel.flushChangedAttributes();
      internalModel.adapterWillCommit();
      this._pendingSave.push({
        snapshot: snapshot,
        resolver: resolver
      });
      once(this, 'flushPendingSave');
    },

    /**
      This method is called at the end of the run loop, and
      flushes any records passed into `scheduleSave`
       @method flushPendingSave
      @private
    */
    flushPendingSave: function flushPendingSave() {
      var _this = this;

      var pending = this._pendingSave.slice();
      this._pendingSave = [];

      pending.forEach(function (pendingItem) {
        var snapshot = pendingItem.snapshot;
        var resolver = pendingItem.resolver;
        var record = snapshot._internalModel;
        var adapter = _this.adapterFor(record.type.modelName);
        var operation;

        if (get(record, 'currentState.stateName') === 'root.deleted.saved') {
          return resolver.resolve();
        } else if (record.isNew()) {
          operation = 'createRecord';
        } else if (record.isDeleted()) {
          operation = 'deleteRecord';
        } else {
          operation = 'updateRecord';
        }

        resolver.resolve(_commit(adapter, _this, operation, snapshot));
      });
    },

    /**
      This method is called once the promise returned by an
      adapter's `createRecord`, `updateRecord` or `deleteRecord`
      is resolved.
       If the data provides a server-generated ID, it will
      update the record and the store's indexes.
       @method didSaveRecord
      @private
      @param {InternalModel} internalModel the in-flight internal model
      @param {Object} data optional data (see above)
    */
    didSaveRecord: function didSaveRecord(internalModel, dataArg) {
      var data;
      if (dataArg) {
        data = dataArg.data;
      }
      if (data) {
        // normalize relationship IDs into records
        this._backburner.schedule('normalizeRelationships', this, '_setupRelationships', internalModel, data);
        this.updateId(internalModel, data);
      } else {
        (0, _emberDataPrivateDebug.assert)('Your ' + internalModel.type.modelName + ' record was saved to the server, but the response does not have an id and no id has been set client side. Records must have ids. Please update the server response to provide an id in the response or generate the id on the client side either before saving the record or while normalizing the response.', internalModel.id);
      }

      //We first make sure the primary data has been updated
      //TODO try to move notification to the user to the end of the runloop
      internalModel.adapterDidCommit(data);
    },

    /**
      This method is called once the promise returned by an
      adapter's `createRecord`, `updateRecord` or `deleteRecord`
      is rejected with a `DS.InvalidError`.
       @method recordWasInvalid
      @private
      @param {InternalModel} internalModel
      @param {Object} errors
    */
    recordWasInvalid: function recordWasInvalid(internalModel, errors) {
      internalModel.adapterDidInvalidate(errors);
    },

    /**
      This method is called once the promise returned by an
      adapter's `createRecord`, `updateRecord` or `deleteRecord`
      is rejected (with anything other than a `DS.InvalidError`).
       @method recordWasError
      @private
      @param {InternalModel} internalModel
      @param {Error} error
    */
    recordWasError: function recordWasError(internalModel, error) {
      internalModel.adapterDidError(error);
    },

    /**
      When an adapter's `createRecord`, `updateRecord` or `deleteRecord`
      resolves with data, this method extracts the ID from the supplied
      data.
       @method updateId
      @private
      @param {InternalModel} internalModel
      @param {Object} data
    */
    updateId: function updateId(internalModel, data) {
      var oldId = internalModel.id;
      var id = (0, _emberDataPrivateSystemCoerceId['default'])(data.id);

      // ID absolutely can't be missing if the oldID is empty (missing Id in response for a new record)
      (0, _emberDataPrivateDebug.assert)('\'' + internalModel.type.modelName + ':' + internalModel[GUID_KEY] + '\' was saved to the server, but the response does not have an id and your record does not either.', !(id === null && oldId === null));

      // ID absolutely can't be different than oldID if oldID is not null
      (0, _emberDataPrivateDebug.assert)('\'' + internalModel.type.modelName + ':' + oldId + '\' was saved to the server, but the response returned the new id \'' + id + '\'. The store cannot assign a new id to a record that already has an id.', !(oldId !== null && id !== oldId));

      // ID can be null if oldID is not null (altered ID in response for a record)
      // however, this is more than likely a developer error.
      if (oldId !== null && id === null) {
        (0, _emberDataPrivateDebug.warn)('Your ' + internalModel.type.modelName + ' record was saved to the server, but the response does not have an id.', !(oldId !== null && id === null));
        return;
      }

      this.typeMapFor(internalModel.type).idToRecord[id] = internalModel;

      internalModel.setId(id);
    },

    /**
      Returns a map of IDs to client IDs for a given type.
       @method typeMapFor
      @private
      @param {DS.Model} typeClass
      @return {Object} typeMap
    */
    typeMapFor: function typeMapFor(typeClass) {
      var typeMaps = get(this, 'typeMaps');
      var guid = _ember['default'].guidFor(typeClass);
      var typeMap = typeMaps[guid];

      if (typeMap) {
        return typeMap;
      }

      typeMap = {
        idToRecord: new _emberDataPrivateSystemEmptyObject['default'](),
        records: [],
        metadata: new _emberDataPrivateSystemEmptyObject['default'](),
        type: typeClass
      };

      typeMaps[guid] = typeMap;

      return typeMap;
    },

    // ................
    // . LOADING DATA .
    // ................

    /**
      This internal method is used by `push`.
       @method _load
      @private
      @param {(String|DS.Model)} type
      @param {Object} data
    */
    _load: function _load(data) {
      var internalModel = this._internalModelForId(data.type, data.id);

      internalModel.setupData(data);

      this.recordArrayManager.recordDidChange(internalModel);

      return internalModel;
    },

    /*
      In case someone defined a relationship to a mixin, for example:
      ```
        var Comment = DS.Model.extend({
          owner: belongsTo('commentable'. { polymorphic: true})
        });
        var Commentable = Ember.Mixin.create({
          comments: hasMany('comment')
        });
      ```
      we want to look up a Commentable class which has all the necessary
      relationship metadata. Thus, we look up the mixin and create a mock
      DS.Model, so we can access the relationship CPs of the mixin (`comments`)
      in this case
    */

    _modelForMixin: function _modelForMixin(modelName) {
      var normalizedModelName = (0, _emberDataPrivateSystemNormalizeModelName['default'])(modelName);
      // container.registry = 2.1
      // container._registry = 1.11 - 2.0
      // container = < 1.11
      var owner = (0, _emberDataPrivateUtils.getOwner)(this);

      var mixin = owner._lookupFactory('mixin:' + normalizedModelName);
      if (mixin) {
        //Cache the class as a model
        owner.register('model:' + normalizedModelName, _emberDataModel['default'].extend(mixin));
      }
      var factory = this.modelFactoryFor(normalizedModelName);
      if (factory) {
        factory.__isMixin = true;
        factory.__mixin = mixin;
      }

      return factory;
    },

    /**
      Returns the model class for the particular `modelName`.
       The class of a model might be useful if you want to get a list of all the
      relationship names of the model, see
      [`relationshipNames`](http://emberjs.com/api/data/classes/DS.Model.html#property_relationshipNames)
      for example.
       @method modelFor
      @param {String} modelName
      @return {DS.Model}
    */
    modelFor: function modelFor(modelName) {
      (0, _emberDataPrivateDebug.assert)("You need to pass a model name to the store's modelFor method", isPresent(modelName));
      (0, _emberDataPrivateDebug.assert)('Passing classes to store methods has been removed. Please pass a dasherized string instead of ' + _ember['default'].inspect(modelName), typeof modelName === 'string');

      var factory = this.modelFactoryFor(modelName);
      if (!factory) {
        //Support looking up mixins as base types for polymorphic relationships
        factory = this._modelForMixin(modelName);
      }
      if (!factory) {
        throw new _ember['default'].Error("No model was found for '" + modelName + "'");
      }
      factory.modelName = factory.modelName || (0, _emberDataPrivateSystemNormalizeModelName['default'])(modelName);

      return factory;
    },

    modelFactoryFor: function modelFactoryFor(modelName) {
      (0, _emberDataPrivateDebug.assert)("You need to pass a model name to the store's modelFactoryFor method", isPresent(modelName));
      (0, _emberDataPrivateDebug.assert)('Passing classes to store methods has been removed. Please pass a dasherized string instead of ' + _ember['default'].inspect(modelName), typeof modelName === 'string');
      var normalizedKey = (0, _emberDataPrivateSystemNormalizeModelName['default'])(modelName);

      var owner = (0, _emberDataPrivateUtils.getOwner)(this);

      return owner._lookupFactory('model:' + normalizedKey);
    },

    /**
      Push some data for a given type into the store.
       This method expects normalized [JSON API](http://jsonapi.org/) document. This means you have to follow [JSON API specification](http://jsonapi.org/format/) with few minor adjustments:
      - record's `type` should always be in singular, dasherized form
      - members (properties) should be camelCased
       [Your primary data should be wrapped inside `data` property](http://jsonapi.org/format/#document-top-level):
       ```js
      store.push({
        data: {
          // primary data for single record of type `Person`
          id: '1',
          type: 'person',
          attributes: {
            firstName: 'Daniel',
            lastName: 'Kmak'
          }
        }
      });
      ```
       [Demo.](http://ember-twiddle.com/fb99f18cd3b4d3e2a4c7)
       `data` property can also hold an array (of records):
       ```js
      store.push({
        data: [
          // an array of records
          {
            id: '1',
            type: 'person',
            attributes: {
              firstName: 'Daniel',
              lastName: 'Kmak'
            }
          },
          {
            id: '2',
            type: 'person',
            attributes: {
              firstName: 'Tom',
              lastName: 'Dale'
            }
          }
        ]
      });
      ```
       [Demo.](http://ember-twiddle.com/69cdbeaa3702159dc355)
       There are some typical properties for `JSONAPI` payload:
      * `id` - mandatory, unique record's key
      * `type` - mandatory string which matches `model`'s dasherized name in singular form
      * `attributes` - object which holds data for record attributes - `DS.attr`'s declared in model
      * `relationships` - object which must contain any of the following properties under each relationships' respective key (example path is `relationships.achievements.data`):
        - [`links`](http://jsonapi.org/format/#document-links)
        - [`data`](http://jsonapi.org/format/#document-resource-object-linkage) - place for primary data
        - [`meta`](http://jsonapi.org/format/#document-meta) - object which contains meta-information about relationship
       For this model:
       ```app/models/person.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        firstName: DS.attr('string'),
        lastName: DS.attr('string'),
         children: DS.hasMany('person')
      });
      ```
       To represent the children as IDs:
       ```js
      {
        data: {
          id: '1',
          type: 'person',
          attributes: {
            firstName: 'Tom',
            lastName: 'Dale'
          },
          relationships: {
            children: {
              data: [
                {
                  id: '2',
                  type: 'person'
                },
                {
                  id: '3',
                  type: 'person'
                },
                {
                  id: '4',
                  type: 'person'
                }
              ]
            }
          }
        }
      }
      ```
       [Demo.](http://ember-twiddle.com/343e1735e034091f5bde)
       To represent the children relationship as a URL:
       ```js
      {
        data: {
          id: '1',
          type: 'person',
          attributes: {
            firstName: 'Tom',
            lastName: 'Dale'
          },
          relationships: {
            children: {
              links: {
                related: '/people/1/children'
              }
            }
          }
        }
      }
      ```
       If you're streaming data or implementing an adapter, make sure
      that you have converted the incoming data into this form. The
      store's [normalize](#method_normalize) method is a convenience
      helper for converting a json payload into the form Ember Data
      expects.
       ```js
      store.push(store.normalize('person', data));
      ```
       This method can be used both to push in brand new
      records, as well as to update existing records.
       @method push
      @param {Object} data
      @return {DS.Model|Array} the record(s) that was created or
        updated.
    */
    push: function push(data) {
      var included = data.included;
      var i, length;
      if (included) {
        for (i = 0, length = included.length; i < length; i++) {
          this._pushInternalModel(included[i]);
        }
      }

      if (Array.isArray(data.data)) {
        length = data.data.length;
        var internalModels = new Array(length);
        for (i = 0; i < length; i++) {
          internalModels[i] = this._pushInternalModel(data.data[i]).getRecord();
        }

        return internalModels;
      }

      if (data.data === null) {
        return null;
      }

      (0, _emberDataPrivateDebug.assert)('Expected an object in the \'data\' property in a call to \'push\' for ' + data.type + ', but was ' + _ember['default'].typeOf(data.data), _ember['default'].typeOf(data.data) === 'object');

      var internalModel = this._pushInternalModel(data.data);

      var record = internalModel.getRecord();

      return record;
    },

    _hasModelFor: function _hasModelFor(type) {
      return !!(0, _emberDataPrivateUtils.getOwner)(this)._lookupFactory('model:' + type);
    },

    _pushInternalModel: function _pushInternalModel(data) {
      var _this2 = this;

      var modelName = data.type;
      (0, _emberDataPrivateDebug.assert)('You must include an \'id\' for ' + modelName + ' in an object passed to \'push\'', data.id !== null && data.id !== undefined && data.id !== '');
      (0, _emberDataPrivateDebug.assert)('You tried to push data with a type \'' + modelName + '\' but no model could be found with that name.', this._hasModelFor(modelName));

      (0, _emberDataPrivateDebug.runInDebug)(function () {
        // If Ember.ENV.DS_WARN_ON_UNKNOWN_KEYS is set to true and the payload
        // contains unknown attributes or relationships, log a warning.

        if (_ember['default'].ENV.DS_WARN_ON_UNKNOWN_KEYS) {
          (function () {
            var type = _this2.modelFor(modelName);

            // Check unknown attributes
            var unknownAttributes = Object.keys(data.attributes || {}).filter(function (key) {
              return !get(type, 'fields').has(key);
            });
            var unknownAttributesMessage = 'The payload for \'' + type.modelName + '\' contains these unknown attributes: ' + unknownAttributes + '. Make sure they\'ve been defined in your model.';
            (0, _emberDataPrivateDebug.warn)(unknownAttributesMessage, unknownAttributes.length === 0, { id: 'ds.store.unknown-keys-in-payload' });

            // Check unknown relationships
            var unknownRelationships = Object.keys(data.relationships || {}).filter(function (key) {
              return !get(type, 'fields').has(key);
            });
            var unknownRelationshipsMessage = 'The payload for \'' + type.modelName + '\' contains these unknown relationships: ' + unknownRelationships + '. Make sure they\'ve been defined in your model.';
            (0, _emberDataPrivateDebug.warn)(unknownRelationshipsMessage, unknownRelationships.length === 0, { id: 'ds.store.unknown-keys-in-payload' });
          })();
        }
      });

      // Actually load the record into the store.
      var internalModel = this._load(data);

      this._backburner.join(function () {
        _this2._backburner.schedule('normalizeRelationships', _this2, '_setupRelationships', internalModel, data);
      });

      return internalModel;
    },

    _setupRelationships: function _setupRelationships(record, data) {
      // This will convert relationships specified as IDs into DS.Model instances
      // (possibly unloaded) and also create the data structures used to track
      // relationships.
      setupRelationships(this, record, data);
    },

    /**
      Push some raw data into the store.
       This method can be used both to push in brand new
      records, as well as to update existing records. You
      can push in more than one type of object at once.
      All objects should be in the format expected by the
      serializer.
       ```app/serializers/application.js
      import DS from 'ember-data';
       export default DS.ActiveModelSerializer;
      ```
       ```js
      var pushData = {
        posts: [
          { id: 1, post_title: "Great post", comment_ids: [2] }
        ],
        comments: [
          { id: 2, comment_body: "Insightful comment" }
        ]
      }
       store.pushPayload(pushData);
      ```
       By default, the data will be deserialized using a default
      serializer (the application serializer if it exists).
       Alternatively, `pushPayload` will accept a model type which
      will determine which serializer will process the payload.
       ```app/serializers/application.js
      import DS from 'ember-data';
       export default DS.ActiveModelSerializer;
      ```
       ```app/serializers/post.js
      import DS from 'ember-data';
       export default DS.JSONSerializer;
      ```
       ```js
      store.pushPayload('comment', pushData); // Will use the application serializer
      store.pushPayload('post', pushData); // Will use the post serializer
      ```
       @method pushPayload
      @param {String} modelName Optionally, a model type used to determine which serializer will be used
      @param {Object} inputPayload
    */
    pushPayload: function pushPayload(modelName, inputPayload) {
      var _this3 = this;

      var serializer;
      var payload;
      if (!inputPayload) {
        payload = modelName;
        serializer = defaultSerializer(this);
        (0, _emberDataPrivateDebug.assert)("You cannot use `store#pushPayload` without a modelName unless your default serializer defines `pushPayload`", typeof serializer.pushPayload === 'function');
      } else {
        payload = inputPayload;
        (0, _emberDataPrivateDebug.assert)('Passing classes to store methods has been removed. Please pass a dasherized string instead of ' + _ember['default'].inspect(modelName), typeof modelName === 'string');
        serializer = this.serializerFor(modelName);
      }
      if (false) {
        return this._adapterRun(function () {
          return serializer.pushPayload(_this3, payload);
        });
      } else {
        this._adapterRun(function () {
          return serializer.pushPayload(_this3, payload);
        });
      }
    },

    /**
      `normalize` converts a json payload into the normalized form that
      [push](#method_push) expects.
       Example
       ```js
      socket.on('message', function(message) {
        var modelName = message.model;
        var data = message.data;
        store.push(store.normalize(modelName, data));
      });
      ```
       @method normalize
      @param {String} modelName The name of the model type for this payload
      @param {Object} payload
      @return {Object} The normalized payload
    */
    normalize: function normalize(modelName, payload) {
      (0, _emberDataPrivateDebug.assert)("You need to pass a model name to the store's normalize method", isPresent(modelName));
      (0, _emberDataPrivateDebug.assert)('Passing classes to store methods has been removed. Please pass a dasherized string instead of ' + _ember['default'].inspect(modelName), typeof modelName === 'string');
      var serializer = this.serializerFor(modelName);
      var model = this.modelFor(modelName);
      return serializer.normalize(model, payload);
    },

    /**
      Build a brand new record for a given type, ID, and
      initial data.
       @method buildRecord
      @private
      @param {DS.Model} type
      @param {String} id
      @param {Object} data
      @return {InternalModel} internal model
    */
    buildInternalModel: function buildInternalModel(type, id, data) {
      var typeMap = this.typeMapFor(type);
      var idToRecord = typeMap.idToRecord;

      (0, _emberDataPrivateDebug.assert)('The id ' + id + ' has already been used with another record of type ' + type.toString() + '.', !id || !idToRecord[id]);
      (0, _emberDataPrivateDebug.assert)('\'' + _ember['default'].inspect(type) + '\' does not appear to be an ember-data model', typeof type._create === 'function');

      // lookupFactory should really return an object that creates
      // instances with the injections applied
      var internalModel = new _emberDataPrivateSystemModelInternalModel['default'](type, id, this, null, data);

      // if we're creating an item, this process will be done
      // later, once the object has been persisted.
      if (id) {
        idToRecord[id] = internalModel;
      }

      typeMap.records.push(internalModel);

      return internalModel;
    },

    //Called by the state machine to notify the store that the record is ready to be interacted with
    recordWasLoaded: function recordWasLoaded(record) {
      this.recordArrayManager.recordWasLoaded(record);
    },

    // ...............
    // . DESTRUCTION .
    // ...............

    /**
      When a record is destroyed, this un-indexes it and
      removes it from any record arrays so it can be GCed.
       @method _dematerializeRecord
      @private
      @param {InternalModel} internalModel
    */
    _dematerializeRecord: function _dematerializeRecord(internalModel) {
      var type = internalModel.type;
      var typeMap = this.typeMapFor(type);
      var id = internalModel.id;

      internalModel.updateRecordArrays();

      if (id) {
        delete typeMap.idToRecord[id];
      }

      var loc = typeMap.records.indexOf(internalModel);
      typeMap.records.splice(loc, 1);
    },

    // ......................
    // . PER-TYPE ADAPTERS
    // ......................

    /**
      Returns an instance of the adapter for a given type. For
      example, `adapterFor('person')` will return an instance of
      `App.PersonAdapter`.
       If no `App.PersonAdapter` is found, this method will look
      for an `App.ApplicationAdapter` (the default adapter for
      your entire application).
       If no `App.ApplicationAdapter` is found, it will return
      the value of the `defaultAdapter`.
       @method adapterFor
      @public
      @param {String} modelName
      @return DS.Adapter
    */
    adapterFor: function adapterFor(modelName) {
      (0, _emberDataPrivateDebug.assert)("You need to pass a model name to the store's adapterFor method", isPresent(modelName));
      (0, _emberDataPrivateDebug.assert)('Passing classes to store.adapterFor has been removed. Please pass a dasherized string instead of ' + _ember['default'].inspect(modelName), typeof modelName === 'string');

      return this.lookupAdapter(modelName);
    },

    _adapterRun: function _adapterRun(fn) {
      return this._backburner.run(fn);
    },

    // ..............................
    // . RECORD CHANGE NOTIFICATION .
    // ..............................

    /**
      Returns an instance of the serializer for a given type. For
      example, `serializerFor('person')` will return an instance of
      `App.PersonSerializer`.
       If no `App.PersonSerializer` is found, this method will look
      for an `App.ApplicationSerializer` (the default serializer for
      your entire application).
       if no `App.ApplicationSerializer` is found, it will attempt
      to get the `defaultSerializer` from the `PersonAdapter`
      (`adapterFor('person')`).
       If a serializer cannot be found on the adapter, it will fall back
      to an instance of `DS.JSONSerializer`.
       @method serializerFor
      @public
      @param {String} modelName the record to serialize
      @return {DS.Serializer}
    */
    serializerFor: function serializerFor(modelName) {
      (0, _emberDataPrivateDebug.assert)("You need to pass a model name to the store's serializerFor method", isPresent(modelName));
      (0, _emberDataPrivateDebug.assert)('Passing classes to store.serializerFor has been removed. Please pass a dasherized string instead of ' + _ember['default'].inspect(modelName), typeof modelName === 'string');

      var fallbacks = ['application', this.adapterFor(modelName).get('defaultSerializer'), '-default'];

      var serializer = this.lookupSerializer(modelName, fallbacks);
      return serializer;
    },

    /**
      Retrieve a particular instance from the
      container cache. If not found, creates it and
      placing it in the cache.
       Enabled a store to manage local instances of
      adapters and serializers.
       @method retrieveManagedInstance
      @private
      @param {String} modelName the object modelName
      @param {String} name the object name
      @param {Array} fallbacks the fallback objects to lookup if the lookup for modelName or 'application' fails
      @return {Ember.Object}
    */
    retrieveManagedInstance: function retrieveManagedInstance(type, modelName, fallbacks) {
      var normalizedModelName = (0, _emberDataPrivateSystemNormalizeModelName['default'])(modelName);

      var instance = this._instanceCache.get(type, normalizedModelName, fallbacks);
      set(instance, 'store', this);
      return instance;
    },

    lookupAdapter: function lookupAdapter(name) {
      return this.retrieveManagedInstance('adapter', name, this.get('_adapterFallbacks'));
    },

    _adapterFallbacks: _ember['default'].computed('adapter', function () {
      var adapter = this.get('adapter');
      return ['application', adapter, '-json-api'];
    }),

    lookupSerializer: function lookupSerializer(name, fallbacks) {
      return this.retrieveManagedInstance('serializer', name, fallbacks);
    },

    willDestroy: function willDestroy() {
      this._super.apply(this, arguments);
      this.recordArrayManager.destroy();

      this.unloadAll();
    }

  });

  function deserializeRecordId(store, key, relationship, id) {
    if (isNone(id)) {
      return;
    }

    (0, _emberDataPrivateDebug.assert)('A ' + relationship.parentType + ' record was pushed into the store with the value of ' + key + ' being ' + _ember['default'].inspect(id) + ', but ' + key + ' is a belongsTo relationship so the value must not be an array. You should probably check your data payload or serializer.', !Array.isArray(id));

    //TODO:Better asserts
    return store._internalModelForId(id.type, id.id);
  }

  function deserializeRecordIds(store, key, relationship, ids) {
    if (isNone(ids)) {
      return;
    }

    (0, _emberDataPrivateDebug.assert)('A ' + relationship.parentType + ' record was pushed into the store with the value of ' + key + ' being \'' + _ember['default'].inspect(ids) + '\', but ' + key + ' is a hasMany relationship so the value must be an array. You should probably check your data payload or serializer.', Array.isArray(ids));
    var _ids = new Array(ids.length);

    for (var i = 0; i < ids.length; i++) {
      _ids[i] = deserializeRecordId(store, key, relationship, ids[i]);
    }

    return _ids;
  }

  // Delegation to the adapter and promise management

  function defaultSerializer(store) {
    return store.serializerFor('application');
  }

  function _commit(adapter, store, operation, snapshot) {
    var internalModel = snapshot._internalModel;
    var modelName = snapshot.modelName;
    var typeClass = store.modelFor(modelName);
    var promise = adapter[operation](store, typeClass, snapshot);
    var serializer = (0, _emberDataPrivateSystemStoreSerializers.serializerForAdapter)(store, adapter, modelName);
    var label = 'DS: Extract and notify about ' + operation + ' completion of ' + internalModel;

    (0, _emberDataPrivateDebug.assert)('Your adapter\'s \'' + operation + '\' method must return a value, but it returned \'undefined\'', promise !== undefined);

    promise = Promise.resolve(promise, label);
    promise = (0, _emberDataPrivateSystemStoreCommon._guard)(promise, (0, _emberDataPrivateSystemStoreCommon._bind)(_emberDataPrivateSystemStoreCommon._objectIsAlive, store));
    promise = (0, _emberDataPrivateSystemStoreCommon._guard)(promise, (0, _emberDataPrivateSystemStoreCommon._bind)(_emberDataPrivateSystemStoreCommon._objectIsAlive, internalModel));

    return promise.then(function (adapterPayload) {
      store._adapterRun(function () {
        var payload, data;
        if (adapterPayload) {
          payload = (0, _emberDataPrivateSystemStoreSerializerResponse.normalizeResponseHelper)(serializer, store, typeClass, adapterPayload, snapshot.id, operation);
          if (payload.included) {
            store.push({ data: payload.included });
          }
          data = payload.data;
        }
        store.didSaveRecord(internalModel, { data: data });
      });

      return internalModel;
    }, function (error) {
      if (error instanceof _emberDataAdaptersErrors.InvalidError) {
        var errors = serializer.extractErrors(store, typeClass, error, snapshot.id);
        store.recordWasInvalid(internalModel, errors);
      } else {
        store.recordWasError(internalModel, error);
      }

      throw error;
    }, label);
  }

  function setupRelationships(store, record, data) {
    if (!data.relationships) {
      return;
    }

    record.type.eachRelationship(function (key, descriptor) {
      var kind = descriptor.kind;

      if (!data.relationships[key]) {
        return;
      }

      var relationship;

      if (data.relationships[key].links && data.relationships[key].links.related) {
        var relatedLink = (0, _emberDataPrivateSystemNormalizeLink['default'])(data.relationships[key].links.related);
        if (relatedLink && relatedLink.href) {
          relationship = record._relationships.get(key);
          relationship.updateLink(relatedLink.href);
        }
      }

      if (data.relationships[key].meta) {
        relationship = record._relationships.get(key);
        relationship.updateMeta(data.relationships[key].meta);
      }

      // If the data contains a relationship that is specified as an ID (or IDs),
      // normalizeRelationship will convert them into DS.Model instances
      // (possibly unloaded) before we push the payload into the store.
      normalizeRelationship(store, key, descriptor, data.relationships[key]);

      var value = data.relationships[key].data;

      if (value !== undefined) {
        if (kind === 'belongsTo') {
          relationship = record._relationships.get(key);
          relationship.setCanonicalRecord(value);
        } else if (kind === 'hasMany') {
          relationship = record._relationships.get(key);
          relationship.updateRecordsFromAdapter(value);
        }
      }
    });
  }

  function normalizeRelationship(store, key, relationship, jsonPayload) {
    var data = jsonPayload.data;
    if (data) {
      var kind = relationship.kind;
      if (kind === 'belongsTo') {
        jsonPayload.data = deserializeRecordId(store, key, relationship, data);
      } else if (kind === 'hasMany') {
        jsonPayload.data = deserializeRecordIds(store, key, relationship, data);
      }
    }
  }

  exports.Store = Store;
  exports['default'] = Store;
});
define('ember-data/-private/system/store/common', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  exports._bind = _bind;
  exports._guard = _guard;
  exports._objectIsAlive = _objectIsAlive;

  var get = _ember['default'].get;

  function _bind(fn) {
    var args = Array.prototype.slice.call(arguments, 1);

    return function () {
      return fn.apply(undefined, args);
    };
  }

  function _guard(promise, test) {
    var guarded = promise['finally'](function () {
      if (!test()) {
        guarded._subscribers.length = 0;
      }
    });

    return guarded;
  }

  function _objectIsAlive(object) {
    return !(get(object, "isDestroyed") || get(object, "isDestroying"));
  }
});
define('ember-data/-private/system/store/container-instance-cache', ['exports', 'ember', 'ember-data/-private/system/empty-object'], function (exports, _ember, _emberDataPrivateSystemEmptyObject) {
  'use strict';

  exports['default'] = ContainerInstanceCache;

  /* global heimdall */

  var assign = _ember['default'].assign || _ember['default'].merge;

  /*
   * The `ContainerInstanceCache` serves as a lazy cache for looking up
   * instances of serializers and adapters. It has some additional logic for
   * finding the 'fallback' adapter or serializer.
   *
   * The 'fallback' adapter or serializer is an adapter or serializer that is looked up
   * when the preferred lookup fails. For example, say you try to look up `adapter:post`,
   * but there is no entry (app/adapters/post.js in EmberCLI) for `adapter:post` in the registry.
   *
   * The `fallbacks` array passed will then be used; the first entry in the fallbacks array
   * that exists in the container will then be cached for `adapter:post`. So, the next time you
   * look up `adapter:post`, you'll get the `adapter:application` instance (or whatever the fallback
   * was if `adapter:application` doesn't exist).
   *
   * @private
   * @class ContainerInstanceCache
   *
  */
  function ContainerInstanceCache(owner) {
    this._owner = owner;
    this._cache = new _emberDataPrivateSystemEmptyObject['default']();
  }

  ContainerInstanceCache.prototype = new _emberDataPrivateSystemEmptyObject['default']();

  assign(ContainerInstanceCache.prototype, {
    get: function get(type, preferredKey, fallbacks) {
      var cache = this._cache;
      var preferredLookupKey = type + ':' + preferredKey;

      if (!(preferredLookupKey in cache)) {
        var instance = this.instanceFor(preferredLookupKey) || this._findInstance(type, fallbacks);
        if (instance) {
          cache[preferredLookupKey] = instance;
        }
      }
      return cache[preferredLookupKey];
    },

    _findInstance: function _findInstance(type, fallbacks) {
      for (var i = 0, _length = fallbacks.length; i < _length; i++) {
        var fallback = fallbacks[i];
        var lookupKey = type + ':' + fallback;
        var instance = this.instanceFor(lookupKey);

        if (instance) {
          return instance;
        }
      }
    },

    instanceFor: function instanceFor(key) {
      var cache = this._cache;
      if (!cache[key]) {
        var instance = this._owner.lookup(key);
        if (instance) {
          cache[key] = instance;
        }
      }
      return cache[key];
    },

    destroy: function destroy() {
      var cache = this._cache;
      var cacheEntries = Object.keys(cache);

      for (var i = 0, _length2 = cacheEntries.length; i < _length2; i++) {
        var cacheKey = cacheEntries[i];
        var cacheEntry = cache[cacheKey];
        if (cacheEntry) {
          cacheEntry.destroy();
        }
      }
      this._owner = null;
    },

    constructor: ContainerInstanceCache,

    toString: function toString() {
      return 'ContainerInstanceCache';
    }
  });
});
define("ember-data/-private/system/store/finders", ["exports", "ember", "ember-data/-private/debug", "ember-data/-private/system/store/common", "ember-data/-private/system/store/serializer-response", "ember-data/-private/system/store/serializers"], function (exports, _ember, _emberDataPrivateDebug, _emberDataPrivateSystemStoreCommon, _emberDataPrivateSystemStoreSerializerResponse, _emberDataPrivateSystemStoreSerializers) {
  "use strict";

  exports._find = _find;
  exports._findMany = _findMany;
  exports._findHasMany = _findHasMany;
  exports._findBelongsTo = _findBelongsTo;
  exports._findAll = _findAll;
  exports._query = _query;
  exports._queryRecord = _queryRecord;

  var Promise = _ember["default"].RSVP.Promise;

  function payloadIsNotBlank(adapterPayload) {
    if (Array.isArray(adapterPayload)) {
      return true;
    } else {
      return Object.keys(adapterPayload || {}).length;
    }
  }

  function _find(adapter, store, typeClass, id, internalModel, options) {
    var snapshot = internalModel.createSnapshot(options);
    var promise = adapter.findRecord(store, typeClass, id, snapshot);
    var serializer = (0, _emberDataPrivateSystemStoreSerializers.serializerForAdapter)(store, adapter, internalModel.type.modelName);
    var label = "DS: Handle Adapter#findRecord of " + typeClass + " with id: " + id;

    promise = Promise.resolve(promise, label);
    promise = (0, _emberDataPrivateSystemStoreCommon._guard)(promise, (0, _emberDataPrivateSystemStoreCommon._bind)(_emberDataPrivateSystemStoreCommon._objectIsAlive, store));

    return promise.then(function (adapterPayload) {
      (0, _emberDataPrivateDebug.assert)("You made a `findRecord` request for a " + typeClass.modelName + " with id " + id + ", but the adapter's response did not have any data", payloadIsNotBlank(adapterPayload));
      return store._adapterRun(function () {
        var payload = (0, _emberDataPrivateSystemStoreSerializerResponse.normalizeResponseHelper)(serializer, store, typeClass, adapterPayload, id, 'findRecord');
        (0, _emberDataPrivateDebug.assert)('Ember Data expected the primary data returned from a `findRecord` response to be an object but instead it found an array.', !Array.isArray(payload.data));
        //TODO Optimize
        var record = store.push(payload);
        return record._internalModel;
      });
    }, function (error) {
      internalModel.notFound();
      if (internalModel.isEmpty()) {
        internalModel.unloadRecord();
      }

      throw error;
    }, "DS: Extract payload of '" + typeClass + "'");
  }

  function _findMany(adapter, store, typeClass, ids, internalModels) {
    var snapshots = _ember["default"].A(internalModels).invoke('createSnapshot');
    var promise = adapter.findMany(store, typeClass, ids, snapshots);
    var serializer = (0, _emberDataPrivateSystemStoreSerializers.serializerForAdapter)(store, adapter, typeClass.modelName);
    var label = "DS: Handle Adapter#findMany of " + typeClass;

    if (promise === undefined) {
      throw new Error('adapter.findMany returned undefined, this was very likely a mistake');
    }

    promise = Promise.resolve(promise, label);
    promise = (0, _emberDataPrivateSystemStoreCommon._guard)(promise, (0, _emberDataPrivateSystemStoreCommon._bind)(_emberDataPrivateSystemStoreCommon._objectIsAlive, store));

    return promise.then(function (adapterPayload) {
      (0, _emberDataPrivateDebug.assert)("You made a `findMany` request for " + typeClass.modelName + " records with ids " + ids + ", but the adapter's response did not have any data", payloadIsNotBlank(adapterPayload));
      return store._adapterRun(function () {
        var payload = (0, _emberDataPrivateSystemStoreSerializerResponse.normalizeResponseHelper)(serializer, store, typeClass, adapterPayload, null, 'findMany');
        //TODO Optimize, no need to materialize here
        var records = store.push(payload);
        var internalModels = new Array(records.length);

        for (var i = 0; i < records.length; i++) {
          internalModels[i] = records[i]._internalModel;
        }

        return internalModels;
      });
    }, null, "DS: Extract payload of " + typeClass);
  }

  function _findHasMany(adapter, store, internalModel, link, relationship) {
    var snapshot = internalModel.createSnapshot();
    var typeClass = store.modelFor(relationship.type);
    var promise = adapter.findHasMany(store, snapshot, link, relationship);
    var serializer = (0, _emberDataPrivateSystemStoreSerializers.serializerForAdapter)(store, adapter, relationship.type);
    var label = "DS: Handle Adapter#findHasMany of " + internalModel + " : " + relationship.type;

    promise = Promise.resolve(promise, label);
    promise = (0, _emberDataPrivateSystemStoreCommon._guard)(promise, (0, _emberDataPrivateSystemStoreCommon._bind)(_emberDataPrivateSystemStoreCommon._objectIsAlive, store));
    promise = (0, _emberDataPrivateSystemStoreCommon._guard)(promise, (0, _emberDataPrivateSystemStoreCommon._bind)(_emberDataPrivateSystemStoreCommon._objectIsAlive, internalModel));

    return promise.then(function (adapterPayload) {
      (0, _emberDataPrivateDebug.assert)("You made a `findHasMany` request for a " + internalModel.modelName + "'s `" + relationship.key + "` relationship, using link " + link + ", but the adapter's response did not have any data", payloadIsNotBlank(adapterPayload));
      return store._adapterRun(function () {
        var payload = (0, _emberDataPrivateSystemStoreSerializerResponse.normalizeResponseHelper)(serializer, store, typeClass, adapterPayload, null, 'findHasMany');
        //TODO Use a non record creating push
        var records = store.push(payload);
        var recordArray = records.map(function (record) {
          return record._internalModel;
        });
        recordArray.meta = payload.meta;
        return recordArray;
      });
    }, null, "DS: Extract payload of " + internalModel + " : hasMany " + relationship.type);
  }

  function _findBelongsTo(adapter, store, internalModel, link, relationship) {
    var snapshot = internalModel.createSnapshot();
    var typeClass = store.modelFor(relationship.type);
    var promise = adapter.findBelongsTo(store, snapshot, link, relationship);
    var serializer = (0, _emberDataPrivateSystemStoreSerializers.serializerForAdapter)(store, adapter, relationship.type);
    var label = "DS: Handle Adapter#findBelongsTo of " + internalModel + " : " + relationship.type;

    promise = Promise.resolve(promise, label);
    promise = (0, _emberDataPrivateSystemStoreCommon._guard)(promise, (0, _emberDataPrivateSystemStoreCommon._bind)(_emberDataPrivateSystemStoreCommon._objectIsAlive, store));
    promise = (0, _emberDataPrivateSystemStoreCommon._guard)(promise, (0, _emberDataPrivateSystemStoreCommon._bind)(_emberDataPrivateSystemStoreCommon._objectIsAlive, internalModel));

    return promise.then(function (adapterPayload) {
      return store._adapterRun(function () {
        var payload = (0, _emberDataPrivateSystemStoreSerializerResponse.normalizeResponseHelper)(serializer, store, typeClass, adapterPayload, null, 'findBelongsTo');

        if (!payload.data) {
          return null;
        }

        //TODO Optimize
        var record = store.push(payload);
        return record._internalModel;
      });
    }, null, "DS: Extract payload of " + internalModel + " : " + relationship.type);
  }

  function _findAll(adapter, store, typeClass, sinceToken, options) {
    var modelName = typeClass.modelName;
    var recordArray = store.peekAll(modelName);
    var snapshotArray = recordArray.createSnapshot(options);
    var promise = adapter.findAll(store, typeClass, sinceToken, snapshotArray);
    var serializer = (0, _emberDataPrivateSystemStoreSerializers.serializerForAdapter)(store, adapter, modelName);
    var label = "DS: Handle Adapter#findAll of " + typeClass;

    promise = Promise.resolve(promise, label);
    promise = (0, _emberDataPrivateSystemStoreCommon._guard)(promise, (0, _emberDataPrivateSystemStoreCommon._bind)(_emberDataPrivateSystemStoreCommon._objectIsAlive, store));

    return promise.then(function (adapterPayload) {
      (0, _emberDataPrivateDebug.assert)("You made a `findAll` request for " + typeClass.modelName + " records, but the adapter's response did not have any data", payloadIsNotBlank(adapterPayload));
      store._adapterRun(function () {
        var payload = (0, _emberDataPrivateSystemStoreSerializerResponse.normalizeResponseHelper)(serializer, store, typeClass, adapterPayload, null, 'findAll');
        //TODO Optimize
        store.push(payload);
      });

      store.didUpdateAll(typeClass);
      return store.peekAll(modelName);
    }, null, "DS: Extract payload of findAll " + typeClass);
  }

  function _query(adapter, store, typeClass, query, recordArray) {
    var modelName = typeClass.modelName;
    var promise = adapter.query(store, typeClass, query, recordArray);

    var serializer = (0, _emberDataPrivateSystemStoreSerializers.serializerForAdapter)(store, adapter, modelName);
    var label = "DS: Handle Adapter#query of " + typeClass;

    promise = Promise.resolve(promise, label);
    promise = (0, _emberDataPrivateSystemStoreCommon._guard)(promise, (0, _emberDataPrivateSystemStoreCommon._bind)(_emberDataPrivateSystemStoreCommon._objectIsAlive, store));

    return promise.then(function (adapterPayload) {
      var records, payload;
      store._adapterRun(function () {
        payload = (0, _emberDataPrivateSystemStoreSerializerResponse.normalizeResponseHelper)(serializer, store, typeClass, adapterPayload, null, 'query');
        //TODO Optimize
        records = store.push(payload);
      });

      (0, _emberDataPrivateDebug.assert)('The response to store.query is expected to be an array but it was a single record. Please wrap your response in an array or use `store.queryRecord` to query for a single record.', Array.isArray(records));
      recordArray.loadRecords(records, payload);

      return recordArray;
    }, null, "DS: Extract payload of query " + typeClass);
  }

  function _queryRecord(adapter, store, typeClass, query) {
    var modelName = typeClass.modelName;
    var promise = adapter.queryRecord(store, typeClass, query);
    var serializer = (0, _emberDataPrivateSystemStoreSerializers.serializerForAdapter)(store, adapter, modelName);
    var label = "DS: Handle Adapter#queryRecord of " + typeClass;

    promise = Promise.resolve(promise, label);
    promise = (0, _emberDataPrivateSystemStoreCommon._guard)(promise, (0, _emberDataPrivateSystemStoreCommon._bind)(_emberDataPrivateSystemStoreCommon._objectIsAlive, store));

    return promise.then(function (adapterPayload) {
      var record;
      store._adapterRun(function () {
        var payload = (0, _emberDataPrivateSystemStoreSerializerResponse.normalizeResponseHelper)(serializer, store, typeClass, adapterPayload, null, 'queryRecord');

        (0, _emberDataPrivateDebug.assert)("Expected the primary data returned by the serializer for a `queryRecord` response to be a single object or null but instead it was an array.", !Array.isArray(payload.data), {
          id: 'ds.store.queryRecord-array-response'
        });

        //TODO Optimize
        record = store.push(payload);
      });

      return record;
    }, null, "DS: Extract payload of queryRecord " + typeClass);
  }
});
define('ember-data/-private/system/store/serializer-response', ['exports', 'ember', 'ember-data/-private/debug'], function (exports, _ember, _emberDataPrivateDebug) {
  'use strict';

  exports.validateDocumentStructure = validateDocumentStructure;
  exports.normalizeResponseHelper = normalizeResponseHelper;

  /*
    This is a helper method that validates a JSON API top-level document
  
    The format of a document is described here:
    http://jsonapi.org/format/#document-top-level
  
    @method validateDocumentStructure
    @param {Object} doc JSON API document
    @return {array} An array of errors found in the document structure
  */

  function validateDocumentStructure(doc) {
    var errors = [];
    if (!doc || typeof doc !== 'object') {
      errors.push('Top level of a JSON API document must be an object');
    } else {
      if (!('data' in doc) && !('errors' in doc) && !('meta' in doc)) {
        errors.push('One or more of the following keys must be present: "data", "errors", "meta".');
      } else {
        if ('data' in doc && 'errors' in doc) {
          errors.push('Top level keys "errors" and "data" cannot both be present in a JSON API document');
        }
      }
      if ('data' in doc) {
        if (!(doc.data === null || Array.isArray(doc.data) || typeof doc.data === 'object')) {
          errors.push('data must be null, an object, or an array');
        }
      }
      if ('meta' in doc) {
        if (typeof doc.meta !== 'object') {
          errors.push('meta must be an object');
        }
      }
      if ('errors' in doc) {
        if (!Array.isArray(doc.errors)) {
          errors.push('errors must be an array');
        }
      }
      if ('links' in doc) {
        if (typeof doc.links !== 'object') {
          errors.push('links must be an object');
        }
      }
      if ('jsonapi' in doc) {
        if (typeof doc.jsonapi !== 'object') {
          errors.push('jsonapi must be an object');
        }
      }
      if ('included' in doc) {
        if (typeof doc.included !== 'object') {
          errors.push('included must be an array');
        }
      }
    }

    return errors;
  }

  /*
    This is a helper method that always returns a JSON-API Document.
  
    @method normalizeResponseHelper
    @param {DS.Serializer} serializer
    @param {DS.Store} store
    @param {subclass of DS.Model} modelClass
    @param {Object} payload
    @param {String|Number} id
    @param {String} requestType
    @return {Object} JSON-API Document
  */

  function normalizeResponseHelper(serializer, store, modelClass, payload, id, requestType) {
    var normalizedResponse = serializer.normalizeResponse(store, modelClass, payload, id, requestType);
    var validationErrors = [];
    (0, _emberDataPrivateDebug.runInDebug)(function () {
      validationErrors = validateDocumentStructure(normalizedResponse);
    });
    (0, _emberDataPrivateDebug.assert)('normalizeResponse must return a valid JSON API document:\n\t* ' + validationErrors.join('\n\t* '), _ember['default'].isEmpty(validationErrors));

    return normalizedResponse;
  }
});
define("ember-data/-private/system/store/serializers", ["exports"], function (exports) {
  "use strict";

  exports.serializerForAdapter = serializerForAdapter;

  function serializerForAdapter(store, adapter, type) {
    var serializer = adapter.serializer;

    if (serializer === undefined) {
      serializer = store.serializerFor(type);
    }

    if (serializer === null || serializer === undefined) {
      serializer = {
        extract: function extract(store, type, payload) {
          return payload;
        }
      };
    }

    return serializer;
  }
});
define("ember-data/-private/transforms", ["exports", "ember-data/transform", "ember-data/-private/transforms/number", "ember-data/-private/transforms/date", "ember-data/-private/transforms/string", "ember-data/-private/transforms/boolean"], function (exports, _emberDataTransform, _emberDataPrivateTransformsNumber, _emberDataPrivateTransformsDate, _emberDataPrivateTransformsString, _emberDataPrivateTransformsBoolean) {
  "use strict";

  exports.Transform = _emberDataTransform["default"];
  exports.NumberTransform = _emberDataPrivateTransformsNumber["default"];
  exports.DateTransform = _emberDataPrivateTransformsDate["default"];
  exports.StringTransform = _emberDataPrivateTransformsString["default"];
  exports.BooleanTransform = _emberDataPrivateTransformsBoolean["default"];
});
define('ember-data/-private/transforms/boolean', ['exports', 'ember', 'ember-data/transform', 'ember-data/-private/features'], function (exports, _ember, _emberDataTransform, _emberDataPrivateFeatures) {
  'use strict';

  var isNone = _ember['default'].isNone;

  /**
    The `DS.BooleanTransform` class is used to serialize and deserialize
    boolean attributes on Ember Data record objects. This transform is
    used when `boolean` is passed as the type parameter to the
    [DS.attr](../../data#method_attr) function.
  
    Usage
  
    ```app/models/user.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      isAdmin: DS.attr('boolean'),
      name: DS.attr('string'),
      email: DS.attr('string')
    });
    ```
  
    By default the boolean transform only allows for values of `true` or
    `false`. You can opt into allowing `null` values for
    boolean attributes via `DS.attr('boolean', { allowNull: true })`
  
    ```app/models/user.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      email: DS.attr('string'),
      username: DS.attr('string'),
      wantsWeeklyEmail: DS.attr('boolean', { allowNull: true })
    });
    ```
  
    @class BooleanTransform
    @extends DS.Transform
    @namespace DS
   */
  exports['default'] = _emberDataTransform['default'].extend({
    deserialize: function deserialize(serialized, options) {
      var type = typeof serialized;

      if (true) {
        if (isNone(serialized) && options.allowNull === true) {
          return null;
        }
      }

      if (type === "boolean") {
        return serialized;
      } else if (type === "string") {
        return serialized.match(/^true$|^t$|^1$/i) !== null;
      } else if (type === "number") {
        return serialized === 1;
      } else {
        return false;
      }
    },

    serialize: function serialize(deserialized, options) {
      if (true) {
        if (isNone(deserialized) && options.allowNull === true) {
          return null;
        }
      }

      return Boolean(deserialized);
    }
  });
});
define("ember-data/-private/transforms/date", ["exports", "ember-data/-private/ext/date", "ember-data/transform"], function (exports, _emberDataPrivateExtDate, _emberDataTransform) {
  "use strict";

  exports["default"] = _emberDataTransform["default"].extend({
    deserialize: function deserialize(serialized) {
      var type = typeof serialized;

      if (type === "string") {
        return new Date((0, _emberDataPrivateExtDate.parseDate)(serialized));
      } else if (type === "number") {
        return new Date(serialized);
      } else if (serialized === null || serialized === undefined) {
        // if the value is null return null
        // if the value is not present in the data return undefined
        return serialized;
      } else {
        return null;
      }
    },

    serialize: function serialize(date) {
      if (date instanceof Date && !isNaN(date)) {
        return date.toISOString();
      } else {
        return null;
      }
    }
  });
});

/**
  The `DS.DateTransform` class is used to serialize and deserialize
  date attributes on Ember Data record objects. This transform is used
  when `date` is passed as the type parameter to the
  [DS.attr](../../data#method_attr) function. It uses the [`ISO 8601`](https://en.wikipedia.org/wiki/ISO_8601)
  standard.

  ```app/models/score.js
  import DS from 'ember-data';

  export default DS.Model.extend({
    value: DS.attr('number'),
    player: DS.belongsTo('player'),
    date: DS.attr('date')
  });
  ```

  @class DateTransform
  @extends DS.Transform
  @namespace DS
 */
define("ember-data/-private/transforms/number", ["exports", "ember", "ember-data/transform"], function (exports, _ember, _emberDataTransform) {
  "use strict";

  var empty = _ember["default"].isEmpty;

  function isNumber(value) {
    return value === value && value !== Infinity && value !== -Infinity;
  }

  /**
    The `DS.NumberTransform` class is used to serialize and deserialize
    numeric attributes on Ember Data record objects. This transform is
    used when `number` is passed as the type parameter to the
    [DS.attr](../../data#method_attr) function.
  
    Usage
  
    ```app/models/score.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      value: DS.attr('number'),
      player: DS.belongsTo('player'),
      date: DS.attr('date')
    });
    ```
  
    @class NumberTransform
    @extends DS.Transform
    @namespace DS
   */
  exports["default"] = _emberDataTransform["default"].extend({
    deserialize: function deserialize(serialized) {
      var transformed;

      if (empty(serialized)) {
        return null;
      } else {
        transformed = Number(serialized);

        return isNumber(transformed) ? transformed : null;
      }
    },

    serialize: function serialize(deserialized) {
      var transformed;

      if (empty(deserialized)) {
        return null;
      } else {
        transformed = Number(deserialized);

        return isNumber(transformed) ? transformed : null;
      }
    }
  });
});
define("ember-data/-private/transforms/string", ["exports", "ember", "ember-data/transform"], function (exports, _ember, _emberDataTransform) {
  "use strict";

  var none = _ember["default"].isNone;

  /**
    The `DS.StringTransform` class is used to serialize and deserialize
    string attributes on Ember Data record objects. This transform is
    used when `string` is passed as the type parameter to the
    [DS.attr](../../data#method_attr) function.
  
    Usage
  
    ```app/models/user.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      isAdmin: DS.attr('boolean'),
      name: DS.attr('string'),
      email: DS.attr('string')
    });
    ```
  
    @class StringTransform
    @extends DS.Transform
    @namespace DS
   */
  exports["default"] = _emberDataTransform["default"].extend({
    deserialize: function deserialize(serialized) {
      return none(serialized) ? null : String(serialized);
    },
    serialize: function serialize(deserialized) {
      return none(deserialized) ? null : String(deserialized);
    }
  });
});
define('ember-data/-private/utils', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  var get = _ember['default'].get;

  /*
    Check if the passed model has a `type` attribute or a relationship named `type`.
  
    @method modelHasAttributeOrRelationshipNamedType
    @param modelClass
   */
  function modelHasAttributeOrRelationshipNamedType(modelClass) {
    return get(modelClass, 'attributes').has('type') || get(modelClass, 'relationshipsByName').has('type');
  }

  /*
    ember-container-inject-owner is a new feature in Ember 2.3 that finally provides a public
    API for looking items up.  This function serves as a super simple polyfill to avoid
    triggering deprecations.
  */
  function getOwner(context) {
    var owner;

    if (_ember['default'].getOwner) {
      owner = _ember['default'].getOwner(context);
    }

    if (!owner && context.container) {
      owner = context.container;
    }

    if (owner && owner.lookupFactory && !owner._lookupFactory) {
      // `owner` is a container, we are just making this work
      owner._lookupFactory = owner.lookupFactory;
      owner.register = function () {
        var registry = owner.registry || owner._registry || owner;

        return registry.register.apply(registry, arguments);
      };
    }

    return owner;
  }

  exports.modelHasAttributeOrRelationshipNamedType = modelHasAttributeOrRelationshipNamedType;
  exports.getOwner = getOwner;
});
define('ember-data/-private/utils/parse-response-headers', ['exports', 'ember-data/-private/system/empty-object'], function (exports, _emberDataPrivateSystemEmptyObject) {
  'use strict';

  exports['default'] = parseResponseHeaders;

  function _toArray(arr) {
    return Array.isArray(arr) ? arr : Array.from(arr);
  }

  var CLRF = '\r\n';
  function parseResponseHeaders(headersString) {
    var headers = new _emberDataPrivateSystemEmptyObject['default']();

    if (!headersString) {
      return headers;
    }

    var headerPairs = headersString.split(CLRF);

    headerPairs.forEach(function (header) {
      var _header$split = header.split(':');

      var _header$split2 = _toArray(_header$split);

      var field = _header$split2[0];

      var value = _header$split2.slice(1);

      field = field.trim();
      value = value.join(':').trim();

      if (value) {
        headers[field] = value;
      }
    });

    return headers;
  }
});
define('ember-data/adapter', ['exports', 'ember'], function (exports, _ember) {
  /**
    @module ember-data
  */

  'use strict';

  var get = _ember['default'].get;

  /**
    An adapter is an object that receives requests from a store and
    translates them into the appropriate action to take against your
    persistence layer. The persistence layer is usually an HTTP API, but
    may be anything, such as the browser's local storage. Typically the
    adapter is not invoked directly instead its functionality is accessed
    through the `store`.
  
    ### Creating an Adapter
  
    Create a new subclass of `DS.Adapter` in the `app/adapters` folder:
  
    ```app/adapters/application.js
    import DS from 'ember-data';
  
    export default DS.Adapter.extend({
      // ...your code here
    });
    ```
  
    Model-specific adapters can be created by putting your adapter
    class in an `app/adapters/` + `model-name` + `.js` file of the application.
  
    ```app/adapters/post.js
    import DS from 'ember-data';
  
    export default DS.Adapter.extend({
      // ...Post-specific adapter code goes here
    });
    ```
  
    `DS.Adapter` is an abstract base class that you should override in your
    application to customize it for your backend. The minimum set of methods
    that you should implement is:
  
      * `findRecord()`
      * `createRecord()`
      * `updateRecord()`
      * `deleteRecord()`
      * `findAll()`
      * `query()`
  
    To improve the network performance of your application, you can optimize
    your adapter by overriding these lower-level methods:
  
      * `findMany()`
  
  
    For an example implementation, see `DS.RESTAdapter`, the
    included REST adapter.
  
    @class Adapter
    @namespace DS
    @extends Ember.Object
  */

  exports['default'] = _ember['default'].Object.extend({

    /**
      If you would like your adapter to use a custom serializer you can
      set the `defaultSerializer` property to be the name of the custom
      serializer.
       Note the `defaultSerializer` serializer has a lower priority than
      a model specific serializer (i.e. `PostSerializer`) or the
      `application` serializer.
       ```app/adapters/django.js
      import DS from 'ember-data';
       export default DS.Adapter.extend({
        defaultSerializer: 'django'
      });
      ```
       @property defaultSerializer
      @type {String}
    */
    defaultSerializer: '-default',

    /**
      The `findRecord()` method is invoked when the store is asked for a record that
      has not previously been loaded. In response to `findRecord()` being called, you
      should query your persistence layer for a record with the given ID. The `findRecord`
      method should return a promise that will resolve to a JavaScript object that will be
      normalized by the serializer.
       Here is an example `findRecord` implementation:
       ```app/adapters/application.js
      import DS from 'ember-data';
       export default DS.Adapter.extend({
        findRecord: function(store, type, id, snapshot) {
           return new Ember.RSVP.Promise(function(resolve, reject) {
            Ember.$.getJSON(`/${type.modelName}/${id}`).then(function(data) {
              resolve(data);
            }, function(jqXHR) {
              reject(jqXHR);
            });
          });
        }
      });
      ```
       @method findRecord
      @param {DS.Store} store
      @param {DS.Model} type
      @param {String} id
      @param {DS.Snapshot} snapshot
      @return {Promise} promise
    */
    findRecord: null,

    /**
      The `findAll()` method is used to retrieve all records for a given type.
       Example
       ```app/adapters/application.js
      import DS from 'ember-data';
       export default DS.Adapter.extend({
        findAll: function(store, type, sinceToken) {
          var query = { since: sinceToken };
          return new Ember.RSVP.Promise(function(resolve, reject) {
            Ember.$.getJSON(`/${type.modelName}`, query).then(function(data) {
              resolve(data);
            }, function(jqXHR) {
              reject(jqXHR);
            });
          });
        }
      });
      ```
       @method findAll
      @param {DS.Store} store
      @param {DS.Model} type
      @param {String} sinceToken
      @param {DS.SnapshotRecordArray} snapshotRecordArray
      @return {Promise} promise
    */
    findAll: null,

    /**
      This method is called when you call `query` on the store.
       Example
       ```app/adapters/application.js
      import DS from 'ember-data';
       export default DS.Adapter.extend({
        query: function(store, type, query) {
          return new Ember.RSVP.Promise(function(resolve, reject) {
            Ember.$.getJSON(`/${type.modelName}`, query).then(function(data) {
              resolve(data);
            }, function(jqXHR) {
              reject(jqXHR);
            });
          });
        }
      });
      ```
       @method query
      @param {DS.Store} store
      @param {DS.Model} type
      @param {Object} query
      @param {DS.AdapterPopulatedRecordArray} recordArray
      @return {Promise} promise
    */
    query: null,

    /**
      The `queryRecord()` method is invoked when the store is asked for a single
      record through a query object.
       In response to `queryRecord()` being called, you should always fetch fresh
      data. Once found, you can asynchronously call the store's `push()` method
      to push the record into the store.
       Here is an example `queryRecord` implementation:
       Example
       ```app/adapters/application.js
      import DS from 'ember-data';
      import Ember from 'ember';
       export default DS.Adapter.extend(DS.BuildURLMixin, {
        queryRecord: function(store, type, query) {
          return new Ember.RSVP.Promise(function(resolve, reject) {
            Ember.$.getJSON(`/${type.modelName}`, query).then(function(data) {
              resolve(data);
            }, function(jqXHR) {
              reject(jqXHR);
            });
          });
        }
      });
      ```
       @method queryRecord
      @param {DS.Store} store
      @param {subclass of DS.Model} type
      @param {Object} query
      @return {Promise} promise
    */
    queryRecord: null,

    /**
      If the globally unique IDs for your records should be generated on the client,
      implement the `generateIdForRecord()` method. This method will be invoked
      each time you create a new record, and the value returned from it will be
      assigned to the record's `primaryKey`.
       Most traditional REST-like HTTP APIs will not use this method. Instead, the ID
      of the record will be set by the server, and your adapter will update the store
      with the new ID when it calls `didCreateRecord()`. Only implement this method if
      you intend to generate record IDs on the client-side.
       The `generateIdForRecord()` method will be invoked with the requesting store as
      the first parameter and the newly created record as the second parameter:
       ```javascript
      import DS from 'ember-data';
      import { v4 } from 'uuid';
       export default DS.Adapter.extend({
        generateIdForRecord: function(store, inputProperties) {
          return v4();
        }
      });
      ```
       @method generateIdForRecord
      @param {DS.Store} store
      @param {DS.Model} type   the DS.Model class of the record
      @param {Object} inputProperties a hash of properties to set on the
        newly created record.
      @return {(String|Number)} id
    */
    generateIdForRecord: null,

    /**
      Proxies to the serializer's `serialize` method.
       Example
       ```app/adapters/application.js
      import DS from 'ember-data';
       export default DS.Adapter.extend({
        createRecord: function(store, type, snapshot) {
          var data = this.serialize(snapshot, { includeId: true });
          var url = `/${type.modelName}`;
           // ...
        }
      });
      ```
       @method serialize
      @param {DS.Snapshot} snapshot
      @param {Object}   options
      @return {Object} serialized snapshot
    */
    serialize: function serialize(snapshot, options) {
      return get(snapshot.record, 'store').serializerFor(snapshot.modelName).serialize(snapshot, options);
    },

    /**
      Implement this method in a subclass to handle the creation of
      new records.
       Serializes the record and sends it to the server.
       Example
       ```app/adapters/application.js
      import DS from 'ember-data';
       export default DS.Adapter.extend({
        createRecord: function(store, type, snapshot) {
          var data = this.serialize(snapshot, { includeId: true });
           return new Ember.RSVP.Promise(function(resolve, reject) {
            Ember.$.ajax({
              type: 'POST',
              url: `/${type.modelName}`,
              dataType: 'json',
              data: data
            }).then(function(data) {
              Ember.run(null, resolve, data);
            }, function(jqXHR) {
              jqXHR.then = null; // tame jQuery's ill mannered promises
              Ember.run(null, reject, jqXHR);
            });
          });
        }
      });
      ```
       @method createRecord
      @param {DS.Store} store
      @param {DS.Model} type   the DS.Model class of the record
      @param {DS.Snapshot} snapshot
      @return {Promise} promise
    */
    createRecord: null,

    /**
      Implement this method in a subclass to handle the updating of
      a record.
       Serializes the record update and sends it to the server.
       The updateRecord method is expected to return a promise that will
      resolve with the serialized record. This allows the backend to
      inform the Ember Data store the current state of this record after
      the update. If it is not possible to return a serialized record
      the updateRecord promise can also resolve with `undefined` and the
      Ember Data store will assume all of the updates were successfully
      applied on the backend.
       Example
       ```app/adapters/application.js
      import DS from 'ember-data';
       export default DS.Adapter.extend({
        updateRecord: function(store, type, snapshot) {
          var data = this.serialize(snapshot, { includeId: true });
          var id = snapshot.id;
           return new Ember.RSVP.Promise(function(resolve, reject) {
            Ember.$.ajax({
              type: 'PUT',
              url: `/${type.modelName}/${id}`,
              dataType: 'json',
              data: data
            }).then(function(data) {
              Ember.run(null, resolve, data);
            }, function(jqXHR) {
              jqXHR.then = null; // tame jQuery's ill mannered promises
              Ember.run(null, reject, jqXHR);
            });
          });
        }
      });
      ```
       @method updateRecord
      @param {DS.Store} store
      @param {DS.Model} type   the DS.Model class of the record
      @param {DS.Snapshot} snapshot
      @return {Promise} promise
    */
    updateRecord: null,

    /**
      Implement this method in a subclass to handle the deletion of
      a record.
       Sends a delete request for the record to the server.
       Example
       ```app/adapters/application.js
      import DS from 'ember-data';
       export default DS.Adapter.extend({
        deleteRecord: function(store, type, snapshot) {
          var data = this.serialize(snapshot, { includeId: true });
          var id = snapshot.id;
           return new Ember.RSVP.Promise(function(resolve, reject) {
            Ember.$.ajax({
              type: 'DELETE',
              url: `/${type.modelName}/${id}`,
              dataType: 'json',
              data: data
            }).then(function(data) {
              Ember.run(null, resolve, data);
            }, function(jqXHR) {
              jqXHR.then = null; // tame jQuery's ill mannered promises
              Ember.run(null, reject, jqXHR);
            });
          });
        }
      });
      ```
       @method deleteRecord
      @param {DS.Store} store
      @param {DS.Model} type   the DS.Model class of the record
      @param {DS.Snapshot} snapshot
      @return {Promise} promise
    */
    deleteRecord: null,

    /**
      By default the store will try to coalesce all `fetchRecord` calls within the same runloop
      into as few requests as possible by calling groupRecordsForFindMany and passing it into a findMany call.
      You can opt out of this behaviour by either not implementing the findMany hook or by setting
      coalesceFindRequests to false.
       @property coalesceFindRequests
      @type {boolean}
    */
    coalesceFindRequests: true,

    /**
      The store will call `findMany` instead of multiple `findRecord`
      requests to find multiple records at once if coalesceFindRequests
      is true.
       ```app/adapters/application.js
      import DS from 'ember-data';
       export default DS.Adapter.extend({
        findMany(store, type, ids, snapshots) {
          return new Ember.RSVP.Promise(function(resolve, reject) {
            Ember.$.ajax({
              type: 'GET',
              url: `/${type.modelName}/`,
              dataType: 'json',
              data: { filter: { id: ids.join(',') } }
            }).then(function(data) {
              Ember.run(null, resolve, data);
            }, function(jqXHR) {
              jqXHR.then = null; // tame jQuery's ill mannered promises
              Ember.run(null, reject, jqXHR);
            });
          });
        }
      });
      ```
       @method findMany
      @param {DS.Store} store
      @param {DS.Model} type   the DS.Model class of the records
      @param {Array}    ids
      @param {Array} snapshots
      @return {Promise} promise
    */
    findMany: null,

    /**
      Organize records into groups, each of which is to be passed to separate
      calls to `findMany`.
       For example, if your api has nested URLs that depend on the parent, you will
      want to group records by their parent.
       The default implementation returns the records as a single group.
       @method groupRecordsForFindMany
      @param {DS.Store} store
      @param {Array} snapshots
      @return {Array}  an array of arrays of records, each of which is to be
                        loaded separately by `findMany`.
    */
    groupRecordsForFindMany: function groupRecordsForFindMany(store, snapshots) {
      return [snapshots];
    },

    /**
      This method is used by the store to determine if the store should
      reload a record from the adapter when a record is requested by
      `store.findRecord`.
       If this method returns `true`, the store will re-fetch a record from
      the adapter. If this method returns `false`, the store will resolve
      immediately using the cached record.
       For example, if you are building an events ticketing system, in which users
      can only reserve tickets for 20 minutes at a time, and want to ensure that
      in each route you have data that is no more than 20 minutes old you could
      write:
       ```javascript
      shouldReloadRecord: function(store, ticketSnapshot) {
        var timeDiff = moment().diff(ticketSnapshot.attr('lastAccessedAt'), 'minutes');
        if (timeDiff > 20) {
          return true;
        } else {
          return false;
        }
      }
      ```
       This method would ensure that whenever you do `store.findRecord('ticket',
      id)` you will always get a ticket that is no more than 20 minutes old. In
      case the cached version is more than 20 minutes old, `findRecord` will not
      resolve until you fetched the latest version.
       By default this hook returns `false`, as most UIs should not block user
      interactions while waiting on data update.
       Note that, with default settings, `shouldBackgroundReloadRecord` will always
      re-fetch the records in the background even if `shouldReloadRecord` returns
      `false`. You can override `shouldBackgroundReloadRecord` if this does not
      suit your use case.
       @since 1.13.0
      @method shouldReloadRecord
      @param {DS.Store} store
      @param {DS.Snapshot} snapshot
      @return {Boolean}
    */
    shouldReloadRecord: function shouldReloadRecord(store, snapshot) {
      return false;
    },

    /**
      This method is used by the store to determine if the store should
      reload all records from the adapter when records are requested by
      `store.findAll`.
       If this method returns `true`, the store will re-fetch all records from
      the adapter. If this method returns `false`, the store will resolve
      immediately using the cached records.
       For example, if you are building an events ticketing system, in which users
      can only reserve tickets for 20 minutes at a time, and want to ensure that
      in each route you have data that is no more than 20 minutes old you could
      write:
       ```javascript
      shouldReloadAll: function(store, snapshotArray) {
        var snapshots = snapshotArray.snapshots();
         return snapshots.any(function(ticketSnapshot) {
          var timeDiff = moment().diff(ticketSnapshot.attr('lastAccessedAt'), 'minutes');
          if (timeDiff > 20) {
            return true;
          } else {
            return false;
          }
        });
      }
      ```
       This method would ensure that whenever you do `store.findAll('ticket')` you
      will always get a list of tickets that are no more than 20 minutes old. In
      case a cached version is more than 20 minutes old, `findAll` will not
      resolve until you fetched the latest versions.
       By default this methods returns `true` if the passed `snapshotRecordArray`
      is empty (meaning that there are no records locally available yet),
      otherwise it returns `false`.
       Note that, with default settings, `shouldBackgroundReloadAll` will always
      re-fetch all the records in the background even if `shouldReloadAll` returns
      `false`. You can override `shouldBackgroundReloadAll` if this does not suit
      your use case.
       @since 1.13.0
      @method shouldReloadAll
      @param {DS.Store} store
      @param {DS.SnapshotRecordArray} snapshotRecordArray
      @return {Boolean}
    */
    shouldReloadAll: function shouldReloadAll(store, snapshotRecordArray) {
      return !snapshotRecordArray.length;
    },

    /**
      This method is used by the store to determine if the store should
      reload a record after the `store.findRecord` method resolves a
      cached record.
       This method is *only* checked by the store when the store is
      returning a cached record.
       If this method returns `true` the store will re-fetch a record from
      the adapter.
       For example, if you do not want to fetch complex data over a mobile
      connection, or if the network is down, you can implement
      `shouldBackgroundReloadRecord` as follows:
       ```javascript
      shouldBackgroundReloadRecord: function(store, snapshot) {
        var connection = window.navigator.connection;
        if (connection === 'cellular' || connection === 'none') {
          return false;
        } else {
          return true;
        }
      }
      ```
       By default this hook returns `true` so the data for the record is updated
      in the background.
       @since 1.13.0
      @method shouldBackgroundReloadRecord
      @param {DS.Store} store
      @param {DS.Snapshot} snapshot
      @return {Boolean}
    */
    shouldBackgroundReloadRecord: function shouldBackgroundReloadRecord(store, snapshot) {
      return true;
    },

    /**
      This method is used by the store to determine if the store should
      reload a record array after the `store.findAll` method resolves
      with a cached record array.
       This method is *only* checked by the store when the store is
      returning a cached record array.
       If this method returns `true` the store will re-fetch all records
      from the adapter.
       For example, if you do not want to fetch complex data over a mobile
      connection, or if the network is down, you can implement
      `shouldBackgroundReloadAll` as follows:
       ```javascript
      shouldBackgroundReloadAll: function(store, snapshotArray) {
        var connection = window.navigator.connection;
        if (connection === 'cellular' || connection === 'none') {
          return false;
        } else {
          return true;
        }
      }
      ```
       By default this method returns `true`, indicating that a background reload
      should always be triggered.
       @since 1.13.0
      @method shouldBackgroundReloadAll
      @param {DS.Store} store
      @param {DS.SnapshotRecordArray} snapshotRecordArray
      @return {Boolean}
    */
    shouldBackgroundReloadAll: function shouldBackgroundReloadAll(store, snapshotRecordArray) {
      return true;
    }
  });
});
define('ember-data/adapters/errors', ['exports', 'ember', 'ember-data/-private/debug', 'ember-data/-private/features'], function (exports, _ember, _emberDataPrivateDebug, _emberDataPrivateFeatures) {
  'use strict';

  exports.AdapterError = AdapterError;
  exports.errorsHashToArray = errorsHashToArray;
  exports.errorsArrayToHash = errorsArrayToHash;

  var EmberError = _ember['default'].Error;

  var SOURCE_POINTER_REGEXP = /^\/?data\/(attributes|relationships)\/(.*)/;
  var SOURCE_POINTER_PRIMARY_REGEXP = /^\/?data/;
  var PRIMARY_ATTRIBUTE_KEY = 'base';

  /**
    @class AdapterError
    @namespace DS
  */

  function AdapterError(errors) {
    var message = arguments.length <= 1 || arguments[1] === undefined ? 'Adapter operation failed' : arguments[1];

    this.isAdapterError = true;
    EmberError.call(this, message);

    this.errors = errors || [{
      title: 'Adapter Error',
      detail: message
    }];
  }

  var extendedErrorsEnabled = false;
  if (false) {
    extendedErrorsEnabled = true;
  }

  function extendFn(ErrorClass) {
    return function () {
      var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var defaultMessage = _ref.message;

      return extend(ErrorClass, defaultMessage);
    };
  }

  function extend(ParentErrorClass, defaultMessage) {
    var ErrorClass = function ErrorClass(errors, message) {
      (0, _emberDataPrivateDebug.assert)('`AdapterError` expects json-api formatted errors array.', Array.isArray(errors || []));
      ParentErrorClass.call(this, errors, message || defaultMessage);
    };
    ErrorClass.prototype = Object.create(ParentErrorClass.prototype);

    if (extendedErrorsEnabled) {
      ErrorClass.extend = extendFn(ErrorClass);
    }

    return ErrorClass;
  }

  AdapterError.prototype = Object.create(EmberError.prototype);

  if (extendedErrorsEnabled) {
    AdapterError.extend = extendFn(AdapterError);
  }

  /**
    A `DS.InvalidError` is used by an adapter to signal the external API
    was unable to process a request because the content was not
    semantically correct or meaningful per the API. Usually this means a
    record failed some form of server side validation. When a promise
    from an adapter is rejected with a `DS.InvalidError` the record will
    transition to the `invalid` state and the errors will be set to the
    `errors` property on the record.
  
    For Ember Data to correctly map errors to their corresponding
    properties on the model, Ember Data expects each error to be
    a valid json-api error object with a `source/pointer` that matches
    the property name. For example if you had a Post model that
    looked like this.
  
    ```app/models/post.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      title: DS.attr('string'),
      content: DS.attr('string')
    });
    ```
  
    To show an error from the server related to the `title` and
    `content` properties your adapter could return a promise that
    rejects with a `DS.InvalidError` object that looks like this:
  
    ```app/adapters/post.js
    import Ember from 'ember';
    import DS from 'ember-data';
  
    export default DS.RESTAdapter.extend({
      updateRecord: function() {
        // Fictional adapter that always rejects
        return Ember.RSVP.reject(new DS.InvalidError([
          {
            detail: 'Must be unique',
            source: { pointer: '/data/attributes/title' }
          },
          {
            detail: 'Must not be blank',
            source: { pointer: '/data/attributes/content'}
          }
        ]));
      }
    });
    ```
  
    Your backend may use different property names for your records the
    store will attempt extract and normalize the errors using the
    serializer's `extractErrors` method before the errors get added to
    the the model. As a result, it is safe for the `InvalidError` to
    wrap the error payload unaltered.
  
    @class InvalidError
    @namespace DS
  */
  var InvalidError = extend(AdapterError, 'The adapter rejected the commit because it was invalid');

  exports.InvalidError = InvalidError;

  /**
    @class TimeoutError
    @namespace DS
  */
  var TimeoutError = extend(AdapterError, 'The adapter operation timed out');

  exports.TimeoutError = TimeoutError;

  /**
    @class AbortError
    @namespace DS
  */
  var AbortError = extend(AdapterError, 'The adapter operation was aborted');

  exports.AbortError = AbortError;

  /**
    @class UnauthorizedError
    @namespace DS
  */
  var UnauthorizedError = extendedErrorsEnabled ? extend(AdapterError, 'The adapter operation is unauthorized') : null;

  exports.UnauthorizedError = UnauthorizedError;

  /**
    @class ForbiddenError
    @namespace DS
  */
  var ForbiddenError = extendedErrorsEnabled ? extend(AdapterError, 'The adapter operation is forbidden') : null;

  exports.ForbiddenError = ForbiddenError;

  /**
    @class NotFoundError
    @namespace DS
  */
  var NotFoundError = extendedErrorsEnabled ? extend(AdapterError, 'The adapter could not find the resource') : null;

  exports.NotFoundError = NotFoundError;

  /**
    @class ConflictError
    @namespace DS
  */
  var ConflictError = extendedErrorsEnabled ? extend(AdapterError, 'The adapter operation failed due to a conflict') : null;

  exports.ConflictError = ConflictError;

  /**
    @class ServerError
    @namespace DS
  */
  var ServerError = extendedErrorsEnabled ? extend(AdapterError, 'The adapter operation failed due to a server error') : null;

  exports.ServerError = ServerError;

  /**
    @method errorsHashToArray
    @private
  */

  function errorsHashToArray(errors) {
    var out = [];

    if (_ember['default'].isPresent(errors)) {
      Object.keys(errors).forEach(function (key) {
        var messages = _ember['default'].makeArray(errors[key]);
        for (var i = 0; i < messages.length; i++) {
          var title = 'Invalid Attribute';
          var pointer = '/data/attributes/' + key;
          if (key === PRIMARY_ATTRIBUTE_KEY) {
            title = 'Invalid Document';
            pointer = '/data';
          }
          out.push({
            title: title,
            detail: messages[i],
            source: {
              pointer: pointer
            }
          });
        }
      });
    }

    return out;
  }

  /**
    @method errorsArrayToHash
    @private
  */

  function errorsArrayToHash(errors) {
    var out = {};

    if (_ember['default'].isPresent(errors)) {
      errors.forEach(function (error) {
        if (error.source && error.source.pointer) {
          var key = error.source.pointer.match(SOURCE_POINTER_REGEXP);

          if (key) {
            key = key[2];
          } else if (error.source.pointer.search(SOURCE_POINTER_PRIMARY_REGEXP) !== -1) {
            key = PRIMARY_ATTRIBUTE_KEY;
          }

          if (key) {
            out[key] = out[key] || [];
            out[key].push(error.detail || error.title);
          }
        }
      });
    }

    return out;
  }
});
define('ember-data/adapters/json-api', ['exports', 'ember', 'ember-data/adapters/rest', 'ember-data/-private/features', 'ember-data/-private/debug'], function (exports, _ember, _emberDataAdaptersRest, _emberDataPrivateFeatures, _emberDataPrivateDebug) {
  /* global heimdall */
  /**
    @module ember-data
  */

  'use strict';

  /**
    @since 1.13.0
    @class JSONAPIAdapter
    @constructor
    @namespace DS
    @extends DS.RESTAdapter
  */
  var JSONAPIAdapter = _emberDataAdaptersRest['default'].extend({
    defaultSerializer: '-json-api',

    /**
      @method ajaxOptions
      @private
      @param {String} url
      @param {String} type The request type GET, POST, PUT, DELETE etc.
      @param {Object} options
      @return {Object}
    */
    ajaxOptions: function ajaxOptions(url, type, options) {
      var hash = this._super.apply(this, arguments);

      if (hash.contentType) {
        hash.contentType = 'application/vnd.api+json';
      }

      var beforeSend = hash.beforeSend;
      hash.beforeSend = function (xhr) {
        xhr.setRequestHeader('Accept', 'application/vnd.api+json');
        if (beforeSend) {
          beforeSend(xhr);
        }
      };

      return hash;
    },

    /**
      By default the JSONAPIAdapter will send each find request coming from a `store.find`
      or from accessing a relationship separately to the server. If your server supports passing
      ids as a query string, you can set coalesceFindRequests to true to coalesce all find requests
      within a single runloop.
       For example, if you have an initial payload of:
       ```javascript
      {
        post: {
          id: 1,
          comments: [1, 2]
        }
      }
      ```
       By default calling `post.get('comments')` will trigger the following requests(assuming the
      comments haven't been loaded before):
       ```
      GET /comments/1
      GET /comments/2
      ```
       If you set coalesceFindRequests to `true` it will instead trigger the following request:
       ```
      GET /comments?filter[id]=1,2
      ```
       Setting coalesceFindRequests to `true` also works for `store.find` requests and `belongsTo`
      relationships accessed within the same runloop. If you set `coalesceFindRequests: true`
       ```javascript
      store.findRecord('comment', 1);
      store.findRecord('comment', 2);
      ```
       will also send a request to: `GET /comments?filter[id]=1,2`
       Note: Requests coalescing rely on URL building strategy. So if you override `buildURL` in your app
      `groupRecordsForFindMany` more likely should be overridden as well in order for coalescing to work.
       @property coalesceFindRequests
      @type {boolean}
    */
    coalesceFindRequests: false,

    /**
      @method findMany
      @param {DS.Store} store
      @param {DS.Model} type
      @param {Array} ids
      @param {Array} snapshots
      @return {Promise} promise
    */
    findMany: function findMany(store, type, ids, snapshots) {
      if (false && !this._hasCustomizedAjax()) {
        return this._super.apply(this, arguments);
      } else {
        var url = this.buildURL(type.modelName, ids, snapshots, 'findMany');
        return this.ajax(url, 'GET', { data: { filter: { id: ids.join(',') } } });
      }
    },

    /**
      @method pathForType
      @param {String} modelName
      @return {String} path
    **/
    pathForType: function pathForType(modelName) {
      var dasherized = _ember['default'].String.dasherize(modelName);
      return _ember['default'].String.pluralize(dasherized);
    },

    // TODO: Remove this once we have a better way to override HTTP verbs.
    /**
      @method updateRecord
      @param {DS.Store} store
      @param {DS.Model} type
      @param {DS.Snapshot} snapshot
      @return {Promise} promise
    */
    updateRecord: function updateRecord(store, type, snapshot) {
      if (false && !this._hasCustomizedAjax()) {
        return this._super.apply(this, arguments);
      } else {
        var data = {};
        var serializer = store.serializerFor(type.modelName);

        serializer.serializeIntoHash(data, type, snapshot, { includeId: true });

        var id = snapshot.id;
        var url = this.buildURL(type.modelName, id, snapshot, 'updateRecord');

        return this.ajax(url, 'PATCH', { data: data });
      }
    },

    _hasCustomizedAjax: function _hasCustomizedAjax() {
      if (this.ajax !== JSONAPIAdapter.prototype.ajax) {
        (0, _emberDataPrivateDebug.deprecate)('JSONAPIAdapter#ajax has been deprecated please use. `methodForRequest`, `urlForRequest`, `headersForRequest` or `dataForRequest` instead.', false, {
          id: 'ds.json-api-adapter.ajax',
          until: '3.0.0'
        });
        return true;
      }

      if (this.ajaxOptions !== JSONAPIAdapter.prototype.ajaxOptions) {
        (0, _emberDataPrivateDebug.deprecate)('JSONAPIAdapterr#ajaxOptions has been deprecated please use. `methodForRequest`, `urlForRequest`, `headersForRequest` or `dataForRequest` instead.', false, {
          id: 'ds.json-api-adapter.ajax-options',
          until: '3.0.0'
        });
        return true;
      }

      return false;
    }
  });

  if (false) {

    JSONAPIAdapter.reopen({

      methodForRequest: function methodForRequest(params) {
        if (params.requestType === 'updateRecord') {
          return 'PATCH';
        }

        return this._super.apply(this, arguments);
      },

      dataForRequest: function dataForRequest(params) {
        var requestType = params.requestType;
        var ids = params.ids;

        if (requestType === 'findMany') {
          return {
            filter: { id: ids.join(',') }
          };
        }

        if (requestType === 'updateRecord') {
          var store = params.store;
          var type = params.type;
          var snapshot = params.snapshot;

          var data = {};
          var serializer = store.serializerFor(type.modelName);

          serializer.serializeIntoHash(data, type, snapshot, { includeId: true });

          return data;
        }

        return this._super.apply(this, arguments);
      },

      headersForRequest: function headersForRequest() {
        var headers = this._super.apply(this, arguments) || {};

        headers['Accept'] = 'application/vnd.api+json';

        return headers;
      },

      _requestToJQueryAjaxHash: function _requestToJQueryAjaxHash() {
        var hash = this._super.apply(this, arguments);

        if (hash.contentType) {
          hash.contentType = 'application/vnd.api+json';
        }

        return hash;
      }

    });
  }

  exports['default'] = JSONAPIAdapter;
});
define('ember-data/adapters/rest', ['exports', 'ember', 'ember-data/adapter', 'ember-data/adapters/errors', 'ember-data/-private/adapters/build-url-mixin', 'ember-data/-private/features', 'ember-data/-private/debug', 'ember-data/-private/utils/parse-response-headers'], function (exports, _ember, _emberDataAdapter, _emberDataAdaptersErrors, _emberDataPrivateAdaptersBuildUrlMixin, _emberDataPrivateFeatures, _emberDataPrivateDebug, _emberDataPrivateUtilsParseResponseHeaders) {
  /* global heimdall */
  /**
    @module ember-data
  */

  'use strict';

  var MapWithDefault = _ember['default'].MapWithDefault;
  var get = _ember['default'].get;

  var Promise = _ember['default'].RSVP.Promise;

  /**
    The REST adapter allows your store to communicate with an HTTP server by
    transmitting JSON via XHR. Most Ember.js apps that consume a JSON API
    should use the REST adapter.
  
    This adapter is designed around the idea that the JSON exchanged with
    the server should be conventional.
  
    ## Success and failure
  
    The REST adapter will consider a success any response with a status code
    of the 2xx family ("Success"), as well as 304 ("Not Modified"). Any other
    status code will be considered a failure.
  
    On success, the request promise will be resolved with the full response
    payload.
  
    Failed responses with status code 422 ("Unprocessable Entity") will be
    considered "invalid". The response will be discarded, except for the
    `errors` key. The request promise will be rejected with a `DS.InvalidError`.
    This error object will encapsulate the saved `errors` value.
  
    Any other status codes will be treated as an "adapter error". The request
    promise will be rejected, similarly to the "invalid" case, but with
    an instance of `DS.AdapterError` instead.
  
    ## JSON Structure
  
    The REST adapter expects the JSON returned from your server to follow
    these conventions.
  
    ### Object Root
  
    The JSON payload should be an object that contains the record inside a
    root property. For example, in response to a `GET` request for
    `/posts/1`, the JSON should look like this:
  
    ```js
    {
      "post": {
        "id": 1,
        "title": "I'm Running to Reform the W3C's Tag",
        "author": "Yehuda Katz"
      }
    }
    ```
  
    Similarly, in response to a `GET` request for `/posts`, the JSON should
    look like this:
  
    ```js
    {
      "posts": [
        {
          "id": 1,
          "title": "I'm Running to Reform the W3C's Tag",
          "author": "Yehuda Katz"
        },
        {
          "id": 2,
          "title": "Rails is omakase",
          "author": "D2H"
        }
      ]
    }
    ```
  
    Note that the object root can be pluralized for both a single-object response
    and an array response: the REST adapter is not strict on this. Further, if the
    HTTP server responds to a `GET` request to `/posts/1` (e.g. the response to a
    `findRecord` query) with more than one object in the array, Ember Data will
    only display the object with the matching ID.
  
    ### Conventional Names
  
    Attribute names in your JSON payload should be the camelCased versions of
    the attributes in your Ember.js models.
  
    For example, if you have a `Person` model:
  
    ```app/models/person.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      firstName: DS.attr('string'),
      lastName: DS.attr('string'),
      occupation: DS.attr('string')
    });
    ```
  
    The JSON returned should look like this:
  
    ```js
    {
      "person": {
        "id": 5,
        "firstName": "Barack",
        "lastName": "Obama",
        "occupation": "President"
      }
    }
    ```
  
    ### Errors
  
    If a response is considered a failure, the JSON payload is expected to include
    a top-level key `errors`, detailing any specific issues. For example:
  
    ```js
    {
      "errors": {
        "msg": "Something went wrong"
      }
    }
    ```
  
    This adapter does not make any assumptions as to the format of the `errors`
    object. It will simply be passed along as is, wrapped in an instance
    of `DS.InvalidError` or `DS.AdapterError`. The serializer can interpret it
    afterwards.
  
    ## Customization
  
    ### Endpoint path customization
  
    Endpoint paths can be prefixed with a `namespace` by setting the namespace
    property on the adapter:
  
    ```app/adapters/application.js
    import DS from 'ember-data';
  
    export default DS.RESTAdapter.extend({
      namespace: 'api/1'
    });
    ```
    Requests for the `Person` model would now target `/api/1/people/1`.
  
    ### Host customization
  
    An adapter can target other hosts by setting the `host` property.
  
    ```app/adapters/application.js
    import DS from 'ember-data';
  
    export default DS.RESTAdapter.extend({
      host: 'https://api.example.com'
    });
    ```
  
    ### Headers customization
  
    Some APIs require HTTP headers, e.g. to provide an API key. Arbitrary
    headers can be set as key/value pairs on the `RESTAdapter`'s `headers`
    object and Ember Data will send them along with each ajax request.
  
  
    ```app/adapters/application.js
    import DS from 'ember-data';
  
    export default DS.RESTAdapter.extend({
      headers: {
        "API_KEY": "secret key",
        "ANOTHER_HEADER": "Some header value"
      }
    });
    ```
  
    `headers` can also be used as a computed property to support dynamic
    headers. In the example below, the `session` object has been
    injected into an adapter by Ember's container.
  
    ```app/adapters/application.js
    import DS from 'ember-data';
  
    export default DS.RESTAdapter.extend({
      headers: Ember.computed('session.authToken', function() {
        return {
          "API_KEY": this.get("session.authToken"),
          "ANOTHER_HEADER": "Some header value"
        };
      })
    });
    ```
  
    In some cases, your dynamic headers may require data from some
    object outside of Ember's observer system (for example
    `document.cookie`). You can use the
    [volatile](/api/classes/Ember.ComputedProperty.html#method_volatile)
    function to set the property into a non-cached mode causing the headers to
    be recomputed with every request.
  
    ```app/adapters/application.js
    import DS from 'ember-data';
  
    export default DS.RESTAdapter.extend({
      headers: Ember.computed(function() {
        return {
          "API_KEY": Ember.get(document.cookie.match(/apiKey\=([^;]*)/), "1"),
          "ANOTHER_HEADER": "Some header value"
        };
      }).volatile()
    });
    ```
  
    @class RESTAdapter
    @constructor
    @namespace DS
    @extends DS.Adapter
    @uses DS.BuildURLMixin
  */
  var RESTAdapter = _emberDataAdapter['default'].extend(_emberDataPrivateAdaptersBuildUrlMixin['default'], {
    defaultSerializer: '-rest',

    /**
      By default, the RESTAdapter will send the query params sorted alphabetically to the
      server.
       For example:
       ```js
        store.query('posts', { sort: 'price', category: 'pets' });
      ```
       will generate a requests like this `/posts?category=pets&sort=price`, even if the
      parameters were specified in a different order.
       That way the generated URL will be deterministic and that simplifies caching mechanisms
      in the backend.
       Setting `sortQueryParams` to a falsey value will respect the original order.
       In case you want to sort the query parameters with a different criteria, set
      `sortQueryParams` to your custom sort function.
       ```app/adapters/application.js
      import DS from 'ember-data';
       export default DS.RESTAdapter.extend({
        sortQueryParams: function(params) {
          var sortedKeys = Object.keys(params).sort().reverse();
          var len = sortedKeys.length, newParams = {};
           for (var i = 0; i < len; i++) {
            newParams[sortedKeys[i]] = params[sortedKeys[i]];
          }
          return newParams;
        }
      });
      ```
       @method sortQueryParams
      @param {Object} obj
      @return {Object}
    */
    sortQueryParams: function sortQueryParams(obj) {
      var keys = Object.keys(obj);
      var len = keys.length;
      if (len < 2) {
        return obj;
      }
      var newQueryParams = {};
      var sortedKeys = keys.sort();

      for (var i = 0; i < len; i++) {
        newQueryParams[sortedKeys[i]] = obj[sortedKeys[i]];
      }
      return newQueryParams;
    },

    /**
      By default the RESTAdapter will send each find request coming from a `store.find`
      or from accessing a relationship separately to the server. If your server supports passing
      ids as a query string, you can set coalesceFindRequests to true to coalesce all find requests
      within a single runloop.
       For example, if you have an initial payload of:
       ```javascript
      {
        post: {
          id: 1,
          comments: [1, 2]
        }
      }
      ```
       By default calling `post.get('comments')` will trigger the following requests(assuming the
      comments haven't been loaded before):
       ```
      GET /comments/1
      GET /comments/2
      ```
       If you set coalesceFindRequests to `true` it will instead trigger the following request:
       ```
      GET /comments?ids[]=1&ids[]=2
      ```
       Setting coalesceFindRequests to `true` also works for `store.find` requests and `belongsTo`
      relationships accessed within the same runloop. If you set `coalesceFindRequests: true`
       ```javascript
      store.findRecord('comment', 1);
      store.findRecord('comment', 2);
      ```
       will also send a request to: `GET /comments?ids[]=1&ids[]=2`
       Note: Requests coalescing rely on URL building strategy. So if you override `buildURL` in your app
      `groupRecordsForFindMany` more likely should be overridden as well in order for coalescing to work.
       @property coalesceFindRequests
      @type {boolean}
    */
    coalesceFindRequests: false,

    /**
      Endpoint paths can be prefixed with a `namespace` by setting the namespace
      property on the adapter:
       ```app/adapters/application.js
      import DS from 'ember-data';
       export default DS.RESTAdapter.extend({
        namespace: 'api/1'
      });
      ```
       Requests for the `Post` model would now target `/api/1/post/`.
       @property namespace
      @type {String}
    */

    /**
      An adapter can target other hosts by setting the `host` property.
       ```app/adapters/application.js
      import DS from 'ember-data';
       export default DS.RESTAdapter.extend({
        host: 'https://api.example.com'
      });
      ```
       Requests for the `Post` model would now target `https://api.example.com/post/`.
       @property host
      @type {String}
    */

    /**
      Some APIs require HTTP headers, e.g. to provide an API
      key. Arbitrary headers can be set as key/value pairs on the
      `RESTAdapter`'s `headers` object and Ember Data will send them
      along with each ajax request. For dynamic headers see [headers
      customization](/api/data/classes/DS.RESTAdapter.html#toc_headers-customization).
       ```app/adapters/application.js
      import DS from 'ember-data';
       export default DS.RESTAdapter.extend({
        headers: {
          "API_KEY": "secret key",
          "ANOTHER_HEADER": "Some header value"
        }
      });
      ```
       @property headers
      @type {Object}
     */

    /**
      Called by the store in order to fetch the JSON for a given
      type and ID.
       The `findRecord` method makes an Ajax request to a URL computed by
      `buildURL`, and returns a promise for the resulting payload.
       This method performs an HTTP `GET` request with the id provided as part of the query string.
       @since 1.13.0
      @method findRecord
      @param {DS.Store} store
      @param {DS.Model} type
      @param {String} id
      @param {DS.Snapshot} snapshot
      @return {Promise} promise
    */
    findRecord: function findRecord(store, type, id, snapshot) {
      if (false && !this._hasCustomizedAjax()) {
        var request = this._requestFor({
          store: store, type: type, id: id, snapshot: snapshot,
          requestType: 'findRecord'
        });

        return this._makeRequest(request);
      } else {
        var url = this.buildURL(type.modelName, id, snapshot, 'findRecord');
        var query = this.buildQuery(snapshot);

        return this.ajax(url, 'GET', { data: query });
      }
    },

    /**
      Called by the store in order to fetch a JSON array for all
      of the records for a given type.
       The `findAll` method makes an Ajax (HTTP GET) request to a URL computed by `buildURL`, and returns a
      promise for the resulting payload.
       @method findAll
      @param {DS.Store} store
      @param {DS.Model} type
      @param {String} sinceToken
      @param {DS.SnapshotRecordArray} snapshotRecordArray
      @return {Promise} promise
    */
    findAll: function findAll(store, type, sinceToken, snapshotRecordArray) {
      var query = this.buildQuery(snapshotRecordArray);

      if (false && !this._hasCustomizedAjax()) {
        var request = this._requestFor({
          store: store, type: type, sinceToken: sinceToken, query: query,
          snapshots: snapshotRecordArray,
          requestType: 'findAll'
        });

        return this._makeRequest(request);
      } else {
        var url = this.buildURL(type.modelName, null, snapshotRecordArray, 'findAll');

        if (sinceToken) {
          query.since = sinceToken;
        }

        return this.ajax(url, 'GET', { data: query });
      }
    },

    /**
      Called by the store in order to fetch a JSON array for
      the records that match a particular query.
       The `query` method makes an Ajax (HTTP GET) request to a URL
      computed by `buildURL`, and returns a promise for the resulting
      payload.
       The `query` argument is a simple JavaScript object that will be passed directly
      to the server as parameters.
       @method query
      @param {DS.Store} store
      @param {DS.Model} type
      @param {Object} query
      @return {Promise} promise
    */
    query: function query(store, type, _query) {
      if (false && !this._hasCustomizedAjax()) {
        var request = this._requestFor({
          store: store, type: type, query: _query,
          requestType: 'query'
        });

        return this._makeRequest(request);
      } else {
        var url = this.buildURL(type.modelName, null, null, 'query', _query);

        if (this.sortQueryParams) {
          _query = this.sortQueryParams(_query);
        }

        return this.ajax(url, 'GET', { data: _query });
      }
    },

    /**
      Called by the store in order to fetch a JSON object for
      the record that matches a particular query.
       The `queryRecord` method makes an Ajax (HTTP GET) request to a URL
      computed by `buildURL`, and returns a promise for the resulting
      payload.
       The `query` argument is a simple JavaScript object that will be passed directly
      to the server as parameters.
       @since 1.13.0
      @method queryRecord
      @param {DS.Store} store
      @param {DS.Model} type
      @param {Object} query
      @return {Promise} promise
    */
    queryRecord: function queryRecord(store, type, query) {
      if (false && !this._hasCustomizedAjax()) {
        var request = this._requestFor({
          store: store, type: type, query: query,
          requestType: 'queryRecord'
        });

        return this._makeRequest(request);
      } else {
        var url = this.buildURL(type.modelName, null, null, 'queryRecord', query);

        if (this.sortQueryParams) {
          query = this.sortQueryParams(query);
        }

        return this.ajax(url, 'GET', { data: query });
      }
    },

    /**
      Called by the store in order to fetch several records together if `coalesceFindRequests` is true
       For example, if the original payload looks like:
       ```js
      {
        "id": 1,
        "title": "Rails is omakase",
        "comments": [ 1, 2, 3 ]
      }
      ```
       The IDs will be passed as a URL-encoded Array of IDs, in this form:
       ```
      ids[]=1&ids[]=2&ids[]=3
      ```
       Many servers, such as Rails and PHP, will automatically convert this URL-encoded array
      into an Array for you on the server-side. If you want to encode the
      IDs, differently, just override this (one-line) method.
       The `findMany` method makes an Ajax (HTTP GET) request to a URL computed by `buildURL`, and returns a
      promise for the resulting payload.
       @method findMany
      @param {DS.Store} store
      @param {DS.Model} type
      @param {Array} ids
      @param {Array} snapshots
      @return {Promise} promise
    */
    findMany: function findMany(store, type, ids, snapshots) {
      if (false && !this._hasCustomizedAjax()) {
        var request = this._requestFor({
          store: store, type: type, ids: ids, snapshots: snapshots,
          requestType: 'findMany'
        });

        return this._makeRequest(request);
      } else {
        var url = this.buildURL(type.modelName, ids, snapshots, 'findMany');
        return this.ajax(url, 'GET', { data: { ids: ids } });
      }
    },

    /**
      Called by the store in order to fetch a JSON array for
      the unloaded records in a has-many relationship that were originally
      specified as a URL (inside of `links`).
       For example, if your original payload looks like this:
       ```js
      {
        "post": {
          "id": 1,
          "title": "Rails is omakase",
          "links": { "comments": "/posts/1/comments" }
        }
      }
      ```
       This method will be called with the parent record and `/posts/1/comments`.
       The `findHasMany` method will make an Ajax (HTTP GET) request to the originally specified URL.
       The format of your `links` value will influence the final request URL via the `urlPrefix` method:
       * Links beginning with `//`, `http://`, `https://`, will be used as is, with no further manipulation.
       * Links beginning with a single `/` will have the current adapter's `host` value prepended to it.
       * Links with no beginning `/` will have a parentURL prepended to it, via the current adapter's `buildURL`.
       @method findHasMany
      @param {DS.Store} store
      @param {DS.Snapshot} snapshot
      @param {String} url
      @return {Promise} promise
    */
    findHasMany: function findHasMany(store, snapshot, url, relationship) {
      if (false && !this._hasCustomizedAjax()) {
        var request = this._requestFor({
          store: store, snapshot: snapshot, url: url, relationship: relationship,
          requestType: 'findHasMany'
        });

        return this._makeRequest(request);
      } else {
        var id = snapshot.id;
        var type = snapshot.modelName;

        url = this.urlPrefix(url, this.buildURL(type, id, snapshot, 'findHasMany'));

        return this.ajax(url, 'GET');
      }
    },

    /**
      Called by the store in order to fetch the JSON for the unloaded record in a
      belongs-to relationship that was originally specified as a URL (inside of
      `links`).
       For example, if your original payload looks like this:
       ```js
      {
        "person": {
          "id": 1,
          "name": "Tom Dale",
          "links": { "group": "/people/1/group" }
        }
      }
      ```
       This method will be called with the parent record and `/people/1/group`.
       The `findBelongsTo` method will make an Ajax (HTTP GET) request to the originally specified URL.
       The format of your `links` value will influence the final request URL via the `urlPrefix` method:
       * Links beginning with `//`, `http://`, `https://`, will be used as is, with no further manipulation.
       * Links beginning with a single `/` will have the current adapter's `host` value prepended to it.
       * Links with no beginning `/` will have a parentURL prepended to it, via the current adapter's `buildURL`.
       @method findBelongsTo
      @param {DS.Store} store
      @param {DS.Snapshot} snapshot
      @param {String} url
      @return {Promise} promise
    */
    findBelongsTo: function findBelongsTo(store, snapshot, url, relationship) {
      if (false && !this._hasCustomizedAjax()) {
        var request = this._requestFor({
          store: store, snapshot: snapshot, url: url, relationship: relationship,
          requestType: 'findBelongsTo'
        });

        return this._makeRequest(request);
      } else {
        var id = snapshot.id;
        var type = snapshot.modelName;

        url = this.urlPrefix(url, this.buildURL(type, id, snapshot, 'findBelongsTo'));
        return this.ajax(url, 'GET');
      }
    },

    /**
      Called by the store when a newly created record is
      saved via the `save` method on a model record instance.
       The `createRecord` method serializes the record and makes an Ajax (HTTP POST) request
      to a URL computed by `buildURL`.
       See `serialize` for information on how to customize the serialized form
      of a record.
       @method createRecord
      @param {DS.Store} store
      @param {DS.Model} type
      @param {DS.Snapshot} snapshot
      @return {Promise} promise
    */
    createRecord: function createRecord(store, type, snapshot) {
      if (false && !this._hasCustomizedAjax()) {
        var request = this._requestFor({
          store: store, type: type, snapshot: snapshot,
          requestType: 'createRecord'
        });

        return this._makeRequest(request);
      } else {
        var data = {};
        var serializer = store.serializerFor(type.modelName);
        var url = this.buildURL(type.modelName, null, snapshot, 'createRecord');

        serializer.serializeIntoHash(data, type, snapshot, { includeId: true });

        return this.ajax(url, "POST", { data: data });
      }
    },

    /**
      Called by the store when an existing record is saved
      via the `save` method on a model record instance.
       The `updateRecord` method serializes the record and makes an Ajax (HTTP PUT) request
      to a URL computed by `buildURL`.
       See `serialize` for information on how to customize the serialized form
      of a record.
       @method updateRecord
      @param {DS.Store} store
      @param {DS.Model} type
      @param {DS.Snapshot} snapshot
      @return {Promise} promise
    */
    updateRecord: function updateRecord(store, type, snapshot) {
      if (false && !this._hasCustomizedAjax()) {
        var request = this._requestFor({
          store: store, type: type, snapshot: snapshot,
          requestType: 'updateRecord'
        });

        return this._makeRequest(request);
      } else {
        var data = {};
        var serializer = store.serializerFor(type.modelName);

        serializer.serializeIntoHash(data, type, snapshot);

        var id = snapshot.id;
        var url = this.buildURL(type.modelName, id, snapshot, 'updateRecord');

        return this.ajax(url, "PUT", { data: data });
      }
    },

    /**
      Called by the store when a record is deleted.
       The `deleteRecord` method  makes an Ajax (HTTP DELETE) request to a URL computed by `buildURL`.
       @method deleteRecord
      @param {DS.Store} store
      @param {DS.Model} type
      @param {DS.Snapshot} snapshot
      @return {Promise} promise
    */
    deleteRecord: function deleteRecord(store, type, snapshot) {
      if (false && !this._hasCustomizedAjax()) {
        var request = this._requestFor({
          store: store, type: type, snapshot: snapshot,
          requestType: 'deleteRecord'
        });

        return this._makeRequest(request);
      } else {
        var id = snapshot.id;

        return this.ajax(this.buildURL(type.modelName, id, snapshot, 'deleteRecord'), "DELETE");
      }
    },

    _stripIDFromURL: function _stripIDFromURL(store, snapshot) {
      var url = this.buildURL(snapshot.modelName, snapshot.id, snapshot);

      var expandedURL = url.split('/');
      // Case when the url is of the format ...something/:id
      // We are decodeURIComponent-ing the lastSegment because if it represents
      // the id, it has been encodeURIComponent-ified within `buildURL`. If we
      // don't do this, then records with id having special characters are not
      // coalesced correctly (see GH #4190 for the reported bug)
      var lastSegment = expandedURL[expandedURL.length - 1];
      var id = snapshot.id;
      if (decodeURIComponent(lastSegment) === id) {
        expandedURL[expandedURL.length - 1] = "";
      } else if (endsWith(lastSegment, '?id=' + id)) {
        //Case when the url is of the format ...something?id=:id
        expandedURL[expandedURL.length - 1] = lastSegment.substring(0, lastSegment.length - id.length - 1);
      }

      return expandedURL.join('/');
    },

    // http://stackoverflow.com/questions/417142/what-is-the-maximum-length-of-a-url-in-different-browsers
    maxURLLength: 2048,

    /**
      Organize records into groups, each of which is to be passed to separate
      calls to `findMany`.
       This implementation groups together records that have the same base URL but
      differing ids. For example `/comments/1` and `/comments/2` will be grouped together
      because we know findMany can coalesce them together as `/comments?ids[]=1&ids[]=2`
       It also supports urls where ids are passed as a query param, such as `/comments?id=1`
      but not those where there is more than 1 query param such as `/comments?id=2&name=David`
      Currently only the query param of `id` is supported. If you need to support others, please
      override this or the `_stripIDFromURL` method.
       It does not group records that have differing base urls, such as for example: `/posts/1/comments/2`
      and `/posts/2/comments/3`
       @method groupRecordsForFindMany
      @param {DS.Store} store
      @param {Array} snapshots
      @return {Array}  an array of arrays of records, each of which is to be
                        loaded separately by `findMany`.
    */
    groupRecordsForFindMany: function groupRecordsForFindMany(store, snapshots) {
      var groups = MapWithDefault.create({ defaultValue: function defaultValue() {
          return [];
        } });
      var adapter = this;
      var maxURLLength = this.maxURLLength;

      snapshots.forEach(function (snapshot) {
        var baseUrl = adapter._stripIDFromURL(store, snapshot);
        groups.get(baseUrl).push(snapshot);
      });

      function splitGroupToFitInUrl(group, maxURLLength, paramNameLength) {
        var baseUrl = adapter._stripIDFromURL(store, group[0]);
        var idsSize = 0;
        var splitGroups = [[]];

        group.forEach(function (snapshot) {
          var additionalLength = encodeURIComponent(snapshot.id).length + paramNameLength;
          if (baseUrl.length + idsSize + additionalLength >= maxURLLength) {
            idsSize = 0;
            splitGroups.push([]);
          }

          idsSize += additionalLength;

          var lastGroupIndex = splitGroups.length - 1;
          splitGroups[lastGroupIndex].push(snapshot);
        });

        return splitGroups;
      }

      var groupsArray = [];
      groups.forEach(function (group, key) {
        var paramNameLength = '&ids%5B%5D='.length;
        var splitGroups = splitGroupToFitInUrl(group, maxURLLength, paramNameLength);

        splitGroups.forEach(function (splitGroup) {
          return groupsArray.push(splitGroup);
        });
      });

      return groupsArray;
    },

    /**
      Takes an ajax response, and returns the json payload or an error.
       By default this hook just returns the json payload passed to it.
      You might want to override it in two cases:
       1. Your API might return useful results in the response headers.
      Response headers are passed in as the second argument.
       2. Your API might return errors as successful responses with status code
      200 and an Errors text or object. You can return a `DS.InvalidError` or a
      `DS.AdapterError` (or a sub class) from this hook and it will automatically
      reject the promise and put your record into the invalid or error state.
       Returning a `DS.InvalidError` from this method will cause the
      record to transition into the `invalid` state and make the
      `errors` object available on the record. When returning an
      `DS.InvalidError` the store will attempt to normalize the error data
      returned from the server using the serializer's `extractErrors`
      method.
       @since 1.13.0
      @method handleResponse
      @param  {Number} status
      @param  {Object} headers
      @param  {Object} payload
      @param  {Object} requestData - the original request information
      @return {Object | DS.AdapterError} response
    */
    handleResponse: function handleResponse(status, headers, payload, requestData) {
      if (this.isSuccess(status, headers, payload)) {
        return payload;
      } else if (this.isInvalid(status, headers, payload)) {
        return new _emberDataAdaptersErrors.InvalidError(payload.errors);
      }

      var errors = this.normalizeErrorResponse(status, headers, payload);
      var detailedMessage = this.generatedDetailedMessage(status, headers, payload, requestData);

      if (false) {
        switch (status) {
          case 401:
            return new _emberDataAdaptersErrors.UnauthorizedError(errors, detailedMessage);
          case 403:
            return new _emberDataAdaptersErrors.ForbiddenError(errors, detailedMessage);
          case 404:
            return new _emberDataAdaptersErrors.NotFoundError(errors, detailedMessage);
          case 409:
            return new _emberDataAdaptersErrors.ConflictError(errors, detailedMessage);
          default:
            if (status >= 500) {
              return new _emberDataAdaptersErrors.ServerError(errors, detailedMessage);
            }
        }
      }

      return new _emberDataAdaptersErrors.AdapterError(errors, detailedMessage);
    },

    /**
      Default `handleResponse` implementation uses this hook to decide if the
      response is a success.
       @since 1.13.0
      @method isSuccess
      @param  {Number} status
      @param  {Object} headers
      @param  {Object} payload
      @return {Boolean}
    */
    isSuccess: function isSuccess(status, headers, payload) {
      return status >= 200 && status < 300 || status === 304;
    },

    /**
      Default `handleResponse` implementation uses this hook to decide if the
      response is a an invalid error.
       @since 1.13.0
      @method isInvalid
      @param  {Number} status
      @param  {Object} headers
      @param  {Object} payload
      @return {Boolean}
    */
    isInvalid: function isInvalid(status, headers, payload) {
      return status === 422;
    },

    /**
      Takes a URL, an HTTP method and a hash of data, and makes an
      HTTP request.
       When the server responds with a payload, Ember Data will call into `extractSingle`
      or `extractArray` (depending on whether the original query was for one record or
      many records).
       By default, `ajax` method has the following behavior:
       * It sets the response `dataType` to `"json"`
      * If the HTTP method is not `"GET"`, it sets the `Content-Type` to be
        `application/json; charset=utf-8`
      * If the HTTP method is not `"GET"`, it stringifies the data passed in. The
        data is the serialized record in the case of a save.
      * Registers success and failure handlers.
       @method ajax
      @private
      @param {String} url
      @param {String} type The request type GET, POST, PUT, DELETE etc.
      @param {Object} options
      @return {Promise} promise
    */
    ajax: function ajax(url, type, options) {
      var adapter = this;

      var requestData = {
        url: url,
        method: type
      };

      return new Promise(function (resolve, reject) {
        var hash = adapter.ajaxOptions(url, type, options);

        hash.success = function (payload, textStatus, jqXHR) {
          var response = ajaxSuccess(adapter, jqXHR, payload, requestData);
          _ember['default'].run.join(null, resolve, response);
        };

        hash.error = function (jqXHR, textStatus, errorThrown) {
          var responseData = {
            textStatus: textStatus,
            errorThrown: errorThrown
          };
          var error = ajaxError(adapter, jqXHR, requestData, responseData);
          _ember['default'].run.join(null, reject, error);
        };

        adapter._ajaxRequest(hash);
      }, 'DS: RESTAdapter#ajax ' + type + ' to ' + url);
    },

    /**
      @method _ajaxRequest
      @private
      @param {Object} options jQuery ajax options to be used for the ajax request
    */
    _ajaxRequest: function _ajaxRequest(options) {
      _ember['default'].$.ajax(options);
    },

    /**
      @method ajaxOptions
      @private
      @param {String} url
      @param {String} type The request type GET, POST, PUT, DELETE etc.
      @param {Object} options
      @return {Object}
    */
    ajaxOptions: function ajaxOptions(url, type, options) {
      var hash = options || {};
      hash.url = url;
      hash.type = type;
      hash.dataType = 'json';
      hash.context = this;

      if (hash.data && type !== 'GET') {
        hash.contentType = 'application/json; charset=utf-8';
        hash.data = JSON.stringify(hash.data);
      }

      var headers = get(this, 'headers');
      if (headers !== undefined) {
        hash.beforeSend = function (xhr) {
          Object.keys(headers).forEach(function (key) {
            return xhr.setRequestHeader(key, headers[key]);
          });
        };
      }

      return hash;
    },

    /**
      @method parseErrorResponse
      @private
      @param {String} responseText
      @return {Object}
    */
    parseErrorResponse: function parseErrorResponse(responseText) {
      var json = responseText;

      try {
        json = _ember['default'].$.parseJSON(responseText);
      } catch (e) {
        // ignored
      }

      return json;
    },

    /**
      @method normalizeErrorResponse
      @private
      @param  {Number} status
      @param  {Object} headers
      @param  {Object} payload
      @return {Array} errors payload
    */
    normalizeErrorResponse: function normalizeErrorResponse(status, headers, payload) {
      if (payload && typeof payload === 'object' && payload.errors) {
        return payload.errors;
      } else {
        return [{
          status: '' + status,
          title: "The backend responded with an error",
          detail: '' + payload
        }];
      }
    },

    /**
      Generates a detailed ("friendly") error message, with plenty
      of information for debugging (good luck!)
       @method generatedDetailedMessage
      @private
      @param  {Number} status
      @param  {Object} headers
      @param  {Object} payload
      @param  {Object} requestData
      @return {String} detailed error message
    */
    generatedDetailedMessage: function generatedDetailedMessage(status, headers, payload, requestData) {
      var shortenedPayload;
      var payloadContentType = headers["Content-Type"] || "Empty Content-Type";

      if (payloadContentType === "text/html" && payload.length > 250) {
        shortenedPayload = "[Omitted Lengthy HTML]";
      } else {
        shortenedPayload = payload;
      }

      var requestDescription = requestData.method + ' ' + requestData.url;
      var payloadDescription = 'Payload (' + payloadContentType + ')';

      return ['Ember Data Request ' + requestDescription + ' returned a ' + status, payloadDescription, shortenedPayload].join('\n');
    },

    // @since 2.5.0
    buildQuery: function buildQuery(snapshot) {
      var query = {};

      if (snapshot) {
        var include = snapshot.include;

        if (include) {
          query.include = include;
        }
      }

      return query;
    },

    _hasCustomizedAjax: function _hasCustomizedAjax() {
      if (this.ajax !== RESTAdapter.prototype.ajax) {
        (0, _emberDataPrivateDebug.deprecate)('RESTAdapter#ajax has been deprecated please use. `methodForRequest`, `urlForRequest`, `headersForRequest` or `dataForRequest` instead.', false, {
          id: 'ds.rest-adapter.ajax',
          until: '3.0.0'
        });
        return true;
      }

      if (this.ajaxOptions !== RESTAdapter.prototype.ajaxOptions) {
        (0, _emberDataPrivateDebug.deprecate)('RESTAdapter#ajaxOptions has been deprecated please use. `methodForRequest`, `urlForRequest`, `headersForRequest` or `dataForRequest` instead.', false, {
          id: 'ds.rest-adapter.ajax-options',
          until: '3.0.0'
        });
        return true;
      }

      return false;
    }
  });

  if (false) {

    RESTAdapter.reopen({

      /**
       * Get the data (body or query params) for a request.
       *
       * @public
       * @method dataForRequest
       * @param {Object} params
       * @return {Object} data
       */
      dataForRequest: function dataForRequest(params) {
        var store = params.store;
        var type = params.type;
        var snapshot = params.snapshot;
        var requestType = params.requestType;
        var query = params.query;

        // type is not passed to findBelongsTo and findHasMany
        type = type || snapshot && snapshot.type;

        var serializer = store.serializerFor(type.modelName);
        var data = {};

        switch (requestType) {
          case 'createRecord':
            serializer.serializeIntoHash(data, type, snapshot, { includeId: true });
            break;

          case 'updateRecord':
            serializer.serializeIntoHash(data, type, snapshot);
            break;

          case 'findRecord':
            data = this.buildQuery(snapshot);
            break;

          case 'findAll':
            if (params.sinceToken) {
              query = query || {};
              query.since = params.sinceToken;
            }
            data = query;
            break;

          case 'query':
          case 'queryRecord':
            if (this.sortQueryParams) {
              query = this.sortQueryParams(query);
            }
            data = query;
            break;

          case 'findMany':
            data = { ids: params.ids };
            break;

          default:
            data = undefined;
            break;
        }

        return data;
      },

      /**
       * Get the HTTP method for a request.
       *
       * @public
       * @method methodForRequest
       * @param {Object} params
       * @return {String} HTTP method
       */
      methodForRequest: function methodForRequest(params) {
        var requestType = params.requestType;

        switch (requestType) {
          case 'createRecord':
            return 'POST';
          case 'updateRecord':
            return 'PUT';
          case 'deleteRecord':
            return 'DELETE';
        }

        return 'GET';
      },

      /**
       * Get the URL for a request.
       *
       * @public
       * @method urlForRequest
       * @param {Object} params
       * @return {String} URL
       */
      urlForRequest: function urlForRequest(params) {
        var type = params.type;
        var id = params.id;
        var ids = params.ids;
        var snapshot = params.snapshot;
        var snapshots = params.snapshots;
        var requestType = params.requestType;
        var query = params.query;

        // type and id are not passed from updateRecord and deleteRecord, hence they
        // are defined if not set
        type = type || snapshot && snapshot.type;
        id = id || snapshot && snapshot.id;

        switch (requestType) {
          case 'findAll':
            return this.buildURL(type.modelName, null, snapshots, requestType);

          case 'query':
          case 'queryRecord':
            return this.buildURL(type.modelName, null, null, requestType, query);

          case 'findMany':
            return this.buildURL(type.modelName, ids, snapshots, requestType);

          case 'findHasMany':
          case 'findBelongsTo':
            {
              var url = this.buildURL(type.modelName, id, snapshot, requestType);
              return this.urlPrefix(params.url, url);
            }
        }

        return this.buildURL(type.modelName, id, snapshot, requestType, query);
      },

      /**
       * Get the headers for a request.
       *
       * By default the value of the `headers` property of the adapter is
       * returned.
       *
       * @public
       * @method headersForRequest
       * @param {Object} params
       * @return {Object} headers
       */
      headersForRequest: function headersForRequest(params) {
        return this.get('headers');
      },

      /**
       * Get an object which contains all properties for a request which should
       * be made.
       *
       * @private
       * @method _requestFor
       * @param {Object} params
       * @return {Object} request object
       */
      _requestFor: function _requestFor(params) {
        var method = this.methodForRequest(params);
        var url = this.urlForRequest(params);
        var headers = this.headersForRequest(params);
        var data = this.dataForRequest(params);

        return { method: method, url: url, headers: headers, data: data };
      },

      /**
       * Convert a request object into a hash which can be passed to `jQuery.ajax`.
       *
       * @private
       * @method _requestToJQueryAjaxHash
       * @param {Object} request
       * @return {Object} jQuery ajax hash
       */
      _requestToJQueryAjaxHash: function _requestToJQueryAjaxHash(request) {
        var hash = {};

        hash.type = request.method;
        hash.url = request.url;
        hash.dataType = 'json';
        hash.context = this;

        if (request.data) {
          if (request.method !== 'GET') {
            hash.contentType = 'application/json; charset=utf-8';
            hash.data = JSON.stringify(request.data);
          } else {
            hash.data = request.data;
          }
        }

        var headers = request.headers;
        if (headers !== undefined) {
          hash.beforeSend = function (xhr) {
            Object.keys(headers).forEach(function (key) {
              return xhr.setRequestHeader(key, headers[key]);
            });
          };
        }

        return hash;
      },

      /**
       * Make a request using `jQuery.ajax`.
       *
       * @private
       * @method _makeRequest
       * @param {Object} request
       * @return {Promise} promise
       */
      _makeRequest: function _makeRequest(request) {
        var adapter = this;
        var hash = this._requestToJQueryAjaxHash(request);

        var method = request.method;
        var url = request.url;

        var requestData = { method: method, url: url };

        return new _ember['default'].RSVP.Promise(function (resolve, reject) {

          hash.success = function (payload, textStatus, jqXHR) {
            var response = ajaxSuccess(adapter, jqXHR, payload, requestData);
            _ember['default'].run.join(null, resolve, response);
          };

          hash.error = function (jqXHR, textStatus, errorThrown) {
            var responseData = {
              textStatus: textStatus,
              errorThrown: errorThrown
            };
            var error = ajaxError(adapter, jqXHR, requestData, responseData);
            _ember['default'].run.join(null, reject, error);
          };

          adapter._ajaxRequest(hash);
        }, 'DS: RESTAdapter#makeRequest: ' + method + ' ' + url);
      }
    });
  }

  function ajaxSuccess(adapter, jqXHR, payload, requestData) {
    var response = undefined;
    try {
      response = adapter.handleResponse(jqXHR.status, (0, _emberDataPrivateUtilsParseResponseHeaders['default'])(jqXHR.getAllResponseHeaders()), payload, requestData);
    } catch (error) {
      return Promise.reject(error);
    }

    if (response && response.isAdapterError) {
      return Promise.reject(response);
    } else {
      return response;
    }
  }

  function ajaxError(adapter, jqXHR, requestData, responseData) {
    (0, _emberDataPrivateDebug.runInDebug)(function () {
      var message = 'The server returned an empty string for ' + requestData.method + ' ' + requestData.url + ', which cannot be parsed into a valid JSON. Return either null or {}.';
      var validJSONString = !(responseData.textStatus === "parsererror" && jqXHR.responseText === "");
      (0, _emberDataPrivateDebug.warn)(message, validJSONString, {
        id: 'ds.adapter.returned-empty-string-as-JSON'
      });
    });

    var error = undefined;

    if (responseData.errorThrown instanceof Error) {
      error = responseData.errorThrown;
    } else if (responseData.textStatus === 'timeout') {
      error = new _emberDataAdaptersErrors.TimeoutError();
    } else if (responseData.textStatus === 'abort' || jqXHR.status === 0) {
      error = new _emberDataAdaptersErrors.AbortError();
    } else {
      try {
        error = adapter.handleResponse(jqXHR.status, (0, _emberDataPrivateUtilsParseResponseHeaders['default'])(jqXHR.getAllResponseHeaders()), adapter.parseErrorResponse(jqXHR.responseText) || responseData.errorThrown, requestData);
      } catch (e) {
        error = e;
      }
    }

    return error;
  }

  //From http://stackoverflow.com/questions/280634/endswith-in-javascript
  function endsWith(string, suffix) {
    if (typeof String.prototype.endsWith !== 'function') {
      return string.indexOf(suffix, string.length - suffix.length) !== -1;
    } else {
      return string.endsWith(suffix);
    }
  }

  exports['default'] = RESTAdapter;
});
define('ember-data/attr', ['exports', 'ember', 'ember-data/-private/debug'], function (exports, _ember, _emberDataPrivateDebug) {
  'use strict';

  exports['default'] = attr;

  /**
    @module ember-data
  */

  function getDefaultValue(record, options, key) {
    if (typeof options.defaultValue === 'function') {
      return options.defaultValue.apply(null, arguments);
    } else {
      var defaultValue = options.defaultValue;
      (0, _emberDataPrivateDebug.deprecate)('Non primitive defaultValues are deprecated because they are shared between all instances. If you would like to use a complex object as a default value please provide a function that returns the complex object.', typeof defaultValue !== 'object' || defaultValue === null, {
        id: 'ds.defaultValue.complex-object',
        until: '3.0.0'
      });
      return defaultValue;
    }
  }

  function hasValue(record, key) {
    return key in record._attributes || key in record._inFlightAttributes || key in record._data;
  }

  function getValue(record, key) {
    if (key in record._attributes) {
      return record._attributes[key];
    } else if (key in record._inFlightAttributes) {
      return record._inFlightAttributes[key];
    } else {
      return record._data[key];
    }
  }

  /**
    `DS.attr` defines an attribute on a [DS.Model](/api/data/classes/DS.Model.html).
    By default, attributes are passed through as-is, however you can specify an
    optional type to have the value automatically transformed.
    Ember Data ships with four basic transform types: `string`, `number`,
    `boolean` and `date`. You can define your own transforms by subclassing
    [DS.Transform](/api/data/classes/DS.Transform.html).
  
    Note that you cannot use `attr` to define an attribute of `id`.
  
    `DS.attr` takes an optional hash as a second parameter, currently
    supported options are:
  
    - `defaultValue`: Pass a string or a function to be called to set the attribute
                      to a default value if none is supplied.
  
    Example
  
    ```app/models/user.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      username: DS.attr('string'),
      email: DS.attr('string'),
      verified: DS.attr('boolean', { defaultValue: false })
    });
    ```
  
    Default value can also be a function. This is useful it you want to return
    a new object for each attribute.
  
    ```app/models/user.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      username: attr('string'),
      email: attr('string'),
      settings: attr({defaultValue: function() {
        return {};
      }})
    });
    ```
  
    The `options` hash is passed as second argument to a transforms'
    `serialize` and `deserialize` method. This allows to configure a
    transformation and adapt the corresponding value, based on the config:
  
    ```app/models/post.js
    export default DS.Model.extend({
      text: DS.attr('text', {
        uppercase: true
      })
    });
    ```
  
    ```app/transforms/text.js
    export default DS.Transform.extend({
      serialize: function(value, options) {
        if (options.uppercase) {
          return value.toUpperCase();
        }
  
        return value;
      },
  
      deserialize: function(value) {
        return value;
      }
    })
    ```
  
    @namespace
    @method attr
    @for DS
    @param {String} type the attribute type
    @param {Object} options a hash of options
    @return {Attribute}
  */
  function attr(type, options) {
    if (typeof type === 'object') {
      options = type;
      type = undefined;
    } else {
      options = options || {};
    }

    var meta = {
      type: type,
      isAttribute: true,
      options: options
    };

    return _ember['default'].computed({
      get: function get(key) {
        var internalModel = this._internalModel;
        if (hasValue(internalModel, key)) {
          return getValue(internalModel, key);
        } else {
          return getDefaultValue(this, options, key);
        }
      },
      set: function set(key, value) {
        var internalModel = this._internalModel;
        var oldValue = getValue(internalModel, key);
        var originalValue;

        if (value !== oldValue) {
          // Add the new value to the changed attributes hash; it will get deleted by
          // the 'didSetProperty' handler if it is no different from the original value
          internalModel._attributes[key] = value;

          if (key in internalModel._inFlightAttributes) {
            originalValue = internalModel._inFlightAttributes[key];
          } else {
            originalValue = internalModel._data[key];
          }

          this._internalModel.send('didSetProperty', {
            name: key,
            oldValue: oldValue,
            originalValue: originalValue,
            value: value
          });
        }

        return value;
      }
    }).meta(meta);
  }
});
define("ember-data/index", ["exports", "ember", "ember-data/-private/debug", "ember-data/-private/features", "ember-data/-private/global", "ember-data/-private/core", "ember-data/-private/system/normalize-model-name", "ember-data/-private/system/model/internal-model", "ember-data/-private/system/promise-proxies", "ember-data/-private/system/store", "ember-data/-private/system/model", "ember-data/model", "ember-data/-private/system/snapshot", "ember-data/adapter", "ember-data/serializer", "ember-data/-private/system/debug", "ember-data/adapters/errors", "ember-data/-private/system/record-arrays", "ember-data/-private/system/many-array", "ember-data/-private/system/record-array-manager", "ember-data/-private/adapters", "ember-data/-private/adapters/build-url-mixin", "ember-data/-private/serializers", "ember-inflector", "ember-data/serializers/embedded-records-mixin", "ember-data/-private/transforms", "ember-data/relationships", "ember-data/setup-container", "ember-data/-private/instance-initializers/initialize-store-service", "ember-data/-private/system/relationships/state/relationship"], function (exports, _ember, _emberDataPrivateDebug, _emberDataPrivateFeatures, _emberDataPrivateGlobal, _emberDataPrivateCore, _emberDataPrivateSystemNormalizeModelName, _emberDataPrivateSystemModelInternalModel, _emberDataPrivateSystemPromiseProxies, _emberDataPrivateSystemStore, _emberDataPrivateSystemModel, _emberDataModel, _emberDataPrivateSystemSnapshot, _emberDataAdapter, _emberDataSerializer, _emberDataPrivateSystemDebug, _emberDataAdaptersErrors, _emberDataPrivateSystemRecordArrays, _emberDataPrivateSystemManyArray, _emberDataPrivateSystemRecordArrayManager, _emberDataPrivateAdapters, _emberDataPrivateAdaptersBuildUrlMixin, _emberDataPrivateSerializers, _emberInflector, _emberDataSerializersEmbeddedRecordsMixin, _emberDataPrivateTransforms, _emberDataRelationships, _emberDataSetupContainer, _emberDataPrivateInstanceInitializersInitializeStoreService, _emberDataPrivateSystemRelationshipsStateRelationship) {
  "use strict";

  if (_ember["default"].VERSION.match(/^1\.([0-9]|1[0-2])\./)) {
    throw new _ember["default"].Error("Ember Data requires at least Ember 1.13.0, but you have " + _ember["default"].VERSION + ". Please upgrade your version of Ember, then upgrade Ember Data.");
  }_emberDataPrivateCore["default"].Store = _emberDataPrivateSystemStore.Store;
  _emberDataPrivateCore["default"].PromiseArray = _emberDataPrivateSystemPromiseProxies.PromiseArray;
  _emberDataPrivateCore["default"].PromiseObject = _emberDataPrivateSystemPromiseProxies.PromiseObject;

  _emberDataPrivateCore["default"].PromiseManyArray = _emberDataPrivateSystemPromiseProxies.PromiseManyArray;

  _emberDataPrivateCore["default"].Model = _emberDataModel["default"];
  _emberDataPrivateCore["default"].RootState = _emberDataPrivateSystemModel.RootState;
  _emberDataPrivateCore["default"].attr = _emberDataPrivateSystemModel.attr;
  _emberDataPrivateCore["default"].Errors = _emberDataPrivateSystemModel.Errors;

  _emberDataPrivateCore["default"].InternalModel = _emberDataPrivateSystemModelInternalModel["default"];
  _emberDataPrivateCore["default"].Snapshot = _emberDataPrivateSystemSnapshot["default"];

  _emberDataPrivateCore["default"].Adapter = _emberDataAdapter["default"];

  _emberDataPrivateCore["default"].AdapterError = _emberDataAdaptersErrors.AdapterError;
  _emberDataPrivateCore["default"].InvalidError = _emberDataAdaptersErrors.InvalidError;
  _emberDataPrivateCore["default"].TimeoutError = _emberDataAdaptersErrors.TimeoutError;
  _emberDataPrivateCore["default"].AbortError = _emberDataAdaptersErrors.AbortError;

  if (false) {
    _emberDataPrivateCore["default"].UnauthorizedError = _emberDataAdaptersErrors.UnauthorizedError;
    _emberDataPrivateCore["default"].ForbiddenError = _emberDataAdaptersErrors.ForbiddenError;
    _emberDataPrivateCore["default"].NotFoundError = _emberDataAdaptersErrors.NotFoundError;
    _emberDataPrivateCore["default"].ConflictError = _emberDataAdaptersErrors.ConflictError;
    _emberDataPrivateCore["default"].ServerError = _emberDataAdaptersErrors.ServerError;
  }

  _emberDataPrivateCore["default"].errorsHashToArray = _emberDataAdaptersErrors.errorsHashToArray;
  _emberDataPrivateCore["default"].errorsArrayToHash = _emberDataAdaptersErrors.errorsArrayToHash;

  _emberDataPrivateCore["default"].Serializer = _emberDataSerializer["default"];

  _emberDataPrivateCore["default"].DebugAdapter = _emberDataPrivateSystemDebug["default"];

  _emberDataPrivateCore["default"].RecordArray = _emberDataPrivateSystemRecordArrays.RecordArray;
  _emberDataPrivateCore["default"].FilteredRecordArray = _emberDataPrivateSystemRecordArrays.FilteredRecordArray;
  _emberDataPrivateCore["default"].AdapterPopulatedRecordArray = _emberDataPrivateSystemRecordArrays.AdapterPopulatedRecordArray;
  _emberDataPrivateCore["default"].ManyArray = _emberDataPrivateSystemManyArray["default"];

  _emberDataPrivateCore["default"].RecordArrayManager = _emberDataPrivateSystemRecordArrayManager["default"];

  _emberDataPrivateCore["default"].RESTAdapter = _emberDataPrivateAdapters.RESTAdapter;
  _emberDataPrivateCore["default"].BuildURLMixin = _emberDataPrivateAdaptersBuildUrlMixin["default"];

  _emberDataPrivateCore["default"].RESTSerializer = _emberDataPrivateSerializers.RESTSerializer;
  _emberDataPrivateCore["default"].JSONSerializer = _emberDataPrivateSerializers.JSONSerializer;

  _emberDataPrivateCore["default"].JSONAPIAdapter = _emberDataPrivateAdapters.JSONAPIAdapter;
  _emberDataPrivateCore["default"].JSONAPISerializer = _emberDataPrivateSerializers.JSONAPISerializer;

  _emberDataPrivateCore["default"].Transform = _emberDataPrivateTransforms.Transform;
  _emberDataPrivateCore["default"].DateTransform = _emberDataPrivateTransforms.DateTransform;
  _emberDataPrivateCore["default"].StringTransform = _emberDataPrivateTransforms.StringTransform;
  _emberDataPrivateCore["default"].NumberTransform = _emberDataPrivateTransforms.NumberTransform;
  _emberDataPrivateCore["default"].BooleanTransform = _emberDataPrivateTransforms.BooleanTransform;

  _emberDataPrivateCore["default"].EmbeddedRecordsMixin = _emberDataSerializersEmbeddedRecordsMixin["default"];

  _emberDataPrivateCore["default"].belongsTo = _emberDataRelationships.belongsTo;
  _emberDataPrivateCore["default"].hasMany = _emberDataRelationships.hasMany;

  _emberDataPrivateCore["default"].Relationship = _emberDataPrivateSystemRelationshipsStateRelationship["default"];

  _emberDataPrivateCore["default"]._setupContainer = _emberDataSetupContainer["default"];
  _emberDataPrivateCore["default"]._initializeStoreService = _emberDataPrivateInstanceInitializersInitializeStoreService["default"];

  Object.defineProperty(_emberDataPrivateCore["default"], 'normalizeModelName', {
    enumerable: true,
    writable: false,
    configurable: false,
    value: _emberDataPrivateSystemNormalizeModelName["default"]
  });

  Object.defineProperty(_emberDataPrivateGlobal["default"], 'DS', {
    configurable: true,
    get: function get() {
      (0, _emberDataPrivateDebug.deprecate)('Using the global version of DS is deprecated. Please either import ' + 'the specific modules needed or `import DS from \'ember-data\';`.', false, { id: 'ember-data.global-ds', until: '3.0.0' });

      return _emberDataPrivateCore["default"];
    }
  });

  exports["default"] = _emberDataPrivateCore["default"];
});

/**
  Ember Data
  @module ember-data
  @main ember-data
*/
define("ember-data/model", ["exports", "ember-data/-private/system/model"], function (exports, _emberDataPrivateSystemModel) {
  "use strict";

  exports["default"] = _emberDataPrivateSystemModel["default"];
});
define("ember-data/relationships", ["exports", "ember-data/-private/system/relationships/belongs-to", "ember-data/-private/system/relationships/has-many"], function (exports, _emberDataPrivateSystemRelationshipsBelongsTo, _emberDataPrivateSystemRelationshipsHasMany) {
  /**
    @module ember-data
  */

  "use strict";

  exports.belongsTo = _emberDataPrivateSystemRelationshipsBelongsTo["default"];
  exports.hasMany = _emberDataPrivateSystemRelationshipsHasMany["default"];
});
define('ember-data/serializer', ['exports', 'ember'], function (exports, _ember) {
  /**
    @module ember-data
  */

  'use strict';

  /**
    `DS.Serializer` is an abstract base class that you should override in your
    application to customize it for your backend. The minimum set of methods
    that you should implement is:
  
      * `normalizeResponse()`
      * `serialize()`
  
    And you can optionally override the following methods:
  
      * `normalize()`
  
    For an example implementation, see
    [DS.JSONSerializer](DS.JSONSerializer.html), the included JSON serializer.
  
    @class Serializer
    @namespace DS
    @extends Ember.Object
  */

  exports['default'] = _ember['default'].Object.extend({

    /**
      The `store` property is the application's `store` that contains all records.
      It's injected as a service.
      It can be used to push records from a non flat data structure server
      response.
       @property store
      @type {DS.Store}
      @public
    */

    /**
      The `normalizeResponse` method is used to normalize a payload from the
      server to a JSON-API Document.
       http://jsonapi.org/format/#document-structure
       @since 1.13.0
      @method normalizeResponse
      @param {DS.Store} store
      @param {DS.Model} primaryModelClass
      @param {Object} payload
      @param {String|Number} id
      @param {String} requestType
      @return {Object} JSON-API Document
    */
    normalizeResponse: null,

    /**
      The `serialize` method is used when a record is saved in order to convert
      the record into the form that your external data source expects.
       `serialize` takes an optional `options` hash with a single option:
       - `includeId`: If this is `true`, `serialize` should include the ID
        in the serialized object it builds.
       @method serialize
      @param {DS.Model} record
      @param {Object} [options]
      @return {Object}
    */
    serialize: null,

    /**
      The `normalize` method is used to convert a payload received from your
      external data source into the normalized form `store.push()` expects. You
      should override this method, munge the hash and return the normalized
      payload.
       @method normalize
      @param {DS.Model} typeClass
      @param {Object} hash
      @return {Object}
    */
    normalize: function normalize(typeClass, hash) {
      return hash;
    }

  });
});
define('ember-data/serializers/embedded-records-mixin', ['exports', 'ember', 'ember-data/-private/debug'], function (exports, _ember, _emberDataPrivateDebug) {
  'use strict';

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var get = _ember['default'].get;
  var set = _ember['default'].set;
  var camelize = _ember['default'].String.camelize;

  /**
    ## Using Embedded Records
  
    `DS.EmbeddedRecordsMixin` supports serializing embedded records.
  
    To set up embedded records, include the mixin when extending a serializer,
    then define and configure embedded (model) relationships.
  
    Below is an example of a per-type serializer (`post` type).
  
    ```app/serializers/post.js
    import DS from 'ember-data';
  
    export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
      attrs: {
        author: { embedded: 'always' },
        comments: { serialize: 'ids' }
      }
    });
    ```
    Note that this use of `{ embedded: 'always' }` is unrelated to
    the `{ embedded: 'always' }` that is defined as an option on `DS.attr` as part of
    defining a model while working with the `ActiveModelSerializer`.  Nevertheless,
    using `{ embedded: 'always' }` as an option to `DS.attr` is not a valid way to setup
    embedded records.
  
    The `attrs` option for a resource `{ embedded: 'always' }` is shorthand for:
  
    ```js
    {
      serialize: 'records',
      deserialize: 'records'
    }
    ```
  
    ### Configuring Attrs
  
    A resource's `attrs` option may be set to use `ids`, `records` or false for the
    `serialize`  and `deserialize` settings.
  
    The `attrs` property can be set on the `ApplicationSerializer` or a per-type
    serializer.
  
    In the case where embedded JSON is expected while extracting a payload (reading)
    the setting is `deserialize: 'records'`, there is no need to use `ids` when
    extracting as that is the default behavior without this mixin if you are using
    the vanilla `EmbeddedRecordsMixin`. Likewise, to embed JSON in the payload while
    serializing `serialize: 'records'` is the setting to use. There is an option of
    not embedding JSON in the serialized payload by using `serialize: 'ids'`. If you
    do not want the relationship sent at all, you can use `serialize: false`.
  
  
    ### EmbeddedRecordsMixin defaults
    If you do not overwrite `attrs` for a specific relationship, the `EmbeddedRecordsMixin`
    will behave in the following way:
  
    BelongsTo: `{ serialize: 'id', deserialize: 'id' }`
    HasMany:   `{ serialize: false, deserialize: 'ids' }`
  
    ### Model Relationships
  
    Embedded records must have a model defined to be extracted and serialized. Note that
    when defining any relationships on your model such as `belongsTo` and `hasMany`, you
    should not both specify `async: true` and also indicate through the serializer's
    `attrs` attribute that the related model should be embedded for deserialization.
    If a model is declared embedded for deserialization (`embedded: 'always'` or `deserialize: 'records'`),
    then do not use `async: true`.
  
    To successfully extract and serialize embedded records the model relationships
    must be setup correcty. See the
    [defining relationships](/guides/models/defining-models/#toc_defining-relationships)
    section of the **Defining Models** guide page.
  
    Records without an `id` property are not considered embedded records, model
    instances must have an `id` property to be used with Ember Data.
  
    ### Example JSON payloads, Models and Serializers
  
    **When customizing a serializer it is important to grok what the customizations
    are. Please read the docs for the methods this mixin provides, in case you need
    to modify it to fit your specific needs.**
  
    For example review the docs for each method of this mixin:
    * [normalize](/api/data/classes/DS.EmbeddedRecordsMixin.html#method_normalize)
    * [serializeBelongsTo](/api/data/classes/DS.EmbeddedRecordsMixin.html#method_serializeBelongsTo)
    * [serializeHasMany](/api/data/classes/DS.EmbeddedRecordsMixin.html#method_serializeHasMany)
  
    @class EmbeddedRecordsMixin
    @namespace DS
  */
  exports['default'] = _ember['default'].Mixin.create({

    /**
      Normalize the record and recursively normalize/extract all the embedded records
      while pushing them into the store as they are encountered
       A payload with an attr configured for embedded records needs to be extracted:
       ```js
      {
        "post": {
          "id": "1"
          "title": "Rails is omakase",
          "comments": [{
            "id": "1",
            "body": "Rails is unagi"
          }, {
            "id": "2",
            "body": "Omakase O_o"
          }]
        }
      }
      ```
     @method normalize
     @param {DS.Model} typeClass
     @param {Object} hash to be normalized
     @param {String} prop the hash has been referenced by
     @return {Object} the normalized hash
    **/
    normalize: function normalize(typeClass, hash, prop) {
      var normalizedHash = this._super(typeClass, hash, prop);
      return this._extractEmbeddedRecords(this, this.store, typeClass, normalizedHash);
    },

    keyForRelationship: function keyForRelationship(key, typeClass, method) {
      if (method === 'serialize' && this.hasSerializeRecordsOption(key) || method === 'deserialize' && this.hasDeserializeRecordsOption(key)) {
        return this.keyForAttribute(key, method);
      } else {
        return this._super(key, typeClass, method) || key;
      }
    },

    /**
      Serialize `belongsTo` relationship when it is configured as an embedded object.
       This example of an author model belongs to a post model:
       ```js
      Post = DS.Model.extend({
        title:    DS.attr('string'),
        body:     DS.attr('string'),
        author:   DS.belongsTo('author')
      });
       Author = DS.Model.extend({
        name:     DS.attr('string'),
        post:     DS.belongsTo('post')
      });
      ```
       Use a custom (type) serializer for the post model to configure embedded author
       ```app/serializers/post.js
      import DS from 'ember-data';
       export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
        attrs: {
          author: { embedded: 'always' }
        }
      })
      ```
       A payload with an attribute configured for embedded records can serialize
      the records together under the root attribute's payload:
       ```js
      {
        "post": {
          "id": "1"
          "title": "Rails is omakase",
          "author": {
            "id": "2"
            "name": "dhh"
          }
        }
      }
      ```
       @method serializeBelongsTo
      @param {DS.Snapshot} snapshot
      @param {Object} json
      @param {Object} relationship
    */
    serializeBelongsTo: function serializeBelongsTo(snapshot, json, relationship) {
      var attr = relationship.key;
      if (this.noSerializeOptionSpecified(attr)) {
        this._super(snapshot, json, relationship);
        return;
      }
      var includeIds = this.hasSerializeIdsOption(attr);
      var includeRecords = this.hasSerializeRecordsOption(attr);
      var embeddedSnapshot = snapshot.belongsTo(attr);
      if (includeIds) {
        var serializedKey = this._getMappedKey(relationship.key, snapshot.type);
        if (serializedKey === relationship.key && this.keyForRelationship) {
          serializedKey = this.keyForRelationship(relationship.key, relationship.kind, "serialize");
        }

        if (!embeddedSnapshot) {
          json[serializedKey] = null;
        } else {
          json[serializedKey] = embeddedSnapshot.id;

          if (relationship.options.polymorphic) {
            this.serializePolymorphicType(snapshot, json, relationship);
          }
        }
      } else if (includeRecords) {
        this._serializeEmbeddedBelongsTo(snapshot, json, relationship);
      }
    },

    _serializeEmbeddedBelongsTo: function _serializeEmbeddedBelongsTo(snapshot, json, relationship) {
      var embeddedSnapshot = snapshot.belongsTo(relationship.key);
      var serializedKey = this._getMappedKey(relationship.key, snapshot.type);
      if (serializedKey === relationship.key && this.keyForRelationship) {
        serializedKey = this.keyForRelationship(relationship.key, relationship.kind, "serialize");
      }

      if (!embeddedSnapshot) {
        json[serializedKey] = null;
      } else {
        json[serializedKey] = embeddedSnapshot.serialize({ includeId: true });
        this.removeEmbeddedForeignKey(snapshot, embeddedSnapshot, relationship, json[serializedKey]);

        if (relationship.options.polymorphic) {
          this.serializePolymorphicType(snapshot, json, relationship);
        }
      }
    },

    /**
      Serializes `hasMany` relationships when it is configured as embedded objects.
       This example of a post model has many comments:
       ```js
      Post = DS.Model.extend({
        title:    DS.attr('string'),
        body:     DS.attr('string'),
        comments: DS.hasMany('comment')
      });
       Comment = DS.Model.extend({
        body:     DS.attr('string'),
        post:     DS.belongsTo('post')
      });
      ```
       Use a custom (type) serializer for the post model to configure embedded comments
       ```app/serializers/post.js
      import DS from 'ember-data;
       export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
        attrs: {
          comments: { embedded: 'always' }
        }
      })
      ```
       A payload with an attribute configured for embedded records can serialize
      the records together under the root attribute's payload:
       ```js
      {
        "post": {
          "id": "1"
          "title": "Rails is omakase",
          "body": "I want this for my ORM, I want that for my template language..."
          "comments": [{
            "id": "1",
            "body": "Rails is unagi"
          }, {
            "id": "2",
            "body": "Omakase O_o"
          }]
        }
      }
      ```
       The attrs options object can use more specific instruction for extracting and
      serializing. When serializing, an option to embed `ids`, `ids-and-types` or `records` can be set.
      When extracting the only option is `records`.
       So `{ embedded: 'always' }` is shorthand for:
      `{ serialize: 'records', deserialize: 'records' }`
       To embed the `ids` for a related object (using a hasMany relationship):
       ```app/serializers/post.js
      import DS from 'ember-data;
       export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
        attrs: {
          comments: { serialize: 'ids', deserialize: 'records' }
        }
      })
      ```
       ```js
      {
        "post": {
          "id": "1"
          "title": "Rails is omakase",
          "body": "I want this for my ORM, I want that for my template language..."
          "comments": ["1", "2"]
        }
      }
      ```
       To embed the relationship as a collection of objects with `id` and `type` keys, set
      `ids-and-types` for the related object.
       This is particularly useful for polymorphic relationships where records don't share
      the same table and the `id` is not enough information.
       By example having a user that has many pets:
       ```js
      User = DS.Model.extend({
        name:    DS.attr('string'),
        pets: DS.hasMany('pet', { polymorphic: true })
      });
       Pet = DS.Model.extend({
        name: DS.attr('string'),
      });
       Cat = Pet.extend({
        // ...
      });
       Parrot = Pet.extend({
        // ...
      });
      ```
       ```app/serializers/user.js
      import DS from 'ember-data;
       export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
        attrs: {
          pets: { serialize: 'ids-and-types', deserialize: 'records' }
        }
      });
      ```
       ```js
      {
        "user": {
          "id": "1"
          "name": "Bertin Osborne",
          "pets": [
            { "id": "1", "type": "Cat" },
            { "id": "1", "type": "Parrot"}
          ]
        }
      }
      ```
       @method serializeHasMany
      @param {DS.Snapshot} snapshot
      @param {Object} json
      @param {Object} relationship
    */
    serializeHasMany: function serializeHasMany(snapshot, json, relationship) {
      var attr = relationship.key;
      if (this.noSerializeOptionSpecified(attr)) {
        this._super(snapshot, json, relationship);
        return;
      }

      if (this.hasSerializeIdsOption(attr)) {
        var serializedKey = this._getMappedKey(relationship.key, snapshot.type);
        if (serializedKey === relationship.key && this.keyForRelationship) {
          serializedKey = this.keyForRelationship(relationship.key, relationship.kind, "serialize");
        }

        json[serializedKey] = snapshot.hasMany(attr, { ids: true });
      } else if (this.hasSerializeRecordsOption(attr)) {
        this._serializeEmbeddedHasMany(snapshot, json, relationship);
      } else {
        if (this.hasSerializeIdsAndTypesOption(attr)) {
          this._serializeHasManyAsIdsAndTypes(snapshot, json, relationship);
        }
      }
    },

    /**
      Serializes a hasMany relationship as an array of objects containing only `id` and `type`
      keys.
      This has its use case on polymorphic hasMany relationships where the server is not storing
      all records in the same table using STI, and therefore the `id` is not enough information
       TODO: Make the default in Ember-data 3.0??
    */
    _serializeHasManyAsIdsAndTypes: function _serializeHasManyAsIdsAndTypes(snapshot, json, relationship) {
      var serializedKey = this.keyForAttribute(relationship.key, 'serialize');
      var hasMany = snapshot.hasMany(relationship.key);

      json[serializedKey] = _ember['default'].A(hasMany).map(function (recordSnapshot) {
        //
        // I'm sure I'm being utterly naive here. Propably id is a configurate property and
        // type too, and the modelName has to be normalized somehow.
        //
        return { id: recordSnapshot.id, type: recordSnapshot.modelName };
      });
    },

    _serializeEmbeddedHasMany: function _serializeEmbeddedHasMany(snapshot, json, relationship) {
      var serializedKey = this._getMappedKey(relationship.key, snapshot.type);
      if (serializedKey === relationship.key && this.keyForRelationship) {
        serializedKey = this.keyForRelationship(relationship.key, relationship.kind, "serialize");
      }

      (0, _emberDataPrivateDebug.warn)('The embedded relationship \'' + serializedKey + '\' is undefined for \'' + snapshot.modelName + '\' with id \'' + snapshot.id + '\'. Please include it in your original payload.', _ember['default'].typeOf(snapshot.hasMany(relationship.key)) !== 'undefined', { id: 'ds.serializer.embedded-relationship-undefined' });

      json[serializedKey] = this._generateSerializedHasMany(snapshot, relationship);
    },

    /*
      Returns an array of embedded records serialized to JSON
    */
    _generateSerializedHasMany: function _generateSerializedHasMany(snapshot, relationship) {
      var hasMany = snapshot.hasMany(relationship.key);
      var manyArray = _ember['default'].A(hasMany);
      var ret = new Array(manyArray.length);

      for (var i = 0; i < manyArray.length; i++) {
        var embeddedSnapshot = manyArray[i];
        var embeddedJson = embeddedSnapshot.serialize({ includeId: true });
        this.removeEmbeddedForeignKey(snapshot, embeddedSnapshot, relationship, embeddedJson);
        ret[i] = embeddedJson;
      }

      return ret;
    },

    /**
      When serializing an embedded record, modify the property (in the json payload)
      that refers to the parent record (foreign key for relationship).
       Serializing a `belongsTo` relationship removes the property that refers to the
      parent record
       Serializing a `hasMany` relationship does not remove the property that refers to
      the parent record.
       @method removeEmbeddedForeignKey
      @param {DS.Snapshot} snapshot
      @param {DS.Snapshot} embeddedSnapshot
      @param {Object} relationship
      @param {Object} json
    */
    removeEmbeddedForeignKey: function removeEmbeddedForeignKey(snapshot, embeddedSnapshot, relationship, json) {
      if (relationship.kind === 'hasMany') {
        return;
      } else if (relationship.kind === 'belongsTo') {
        var parentRecord = snapshot.type.inverseFor(relationship.key, this.store);
        if (parentRecord) {
          var name = parentRecord.name;
          var embeddedSerializer = this.store.serializerFor(embeddedSnapshot.modelName);
          var parentKey = embeddedSerializer.keyForRelationship(name, parentRecord.kind, 'deserialize');
          if (parentKey) {
            delete json[parentKey];
          }
        }
      }
    },

    // checks config for attrs option to embedded (always) - serialize and deserialize
    hasEmbeddedAlwaysOption: function hasEmbeddedAlwaysOption(attr) {
      var option = this.attrsOption(attr);
      return option && option.embedded === 'always';
    },

    // checks config for attrs option to serialize ids
    hasSerializeRecordsOption: function hasSerializeRecordsOption(attr) {
      var alwaysEmbed = this.hasEmbeddedAlwaysOption(attr);
      var option = this.attrsOption(attr);
      return alwaysEmbed || option && option.serialize === 'records';
    },

    // checks config for attrs option to serialize records
    hasSerializeIdsOption: function hasSerializeIdsOption(attr) {
      var option = this.attrsOption(attr);
      return option && (option.serialize === 'ids' || option.serialize === 'id');
    },

    // checks config for attrs option to serialize records as objects containing id and types
    hasSerializeIdsAndTypesOption: function hasSerializeIdsAndTypesOption(attr) {
      var option = this.attrsOption(attr);
      return option && (option.serialize === 'ids-and-types' || option.serialize === 'id-and-type');
    },

    // checks config for attrs option to serialize records
    noSerializeOptionSpecified: function noSerializeOptionSpecified(attr) {
      var option = this.attrsOption(attr);
      return !(option && (option.serialize || option.embedded));
    },

    // checks config for attrs option to deserialize records
    // a defined option object for a resource is treated the same as
    // `deserialize: 'records'`
    hasDeserializeRecordsOption: function hasDeserializeRecordsOption(attr) {
      var alwaysEmbed = this.hasEmbeddedAlwaysOption(attr);
      var option = this.attrsOption(attr);
      return alwaysEmbed || option && option.deserialize === 'records';
    },

    attrsOption: function attrsOption(attr) {
      var attrs = this.get('attrs');
      return attrs && (attrs[camelize(attr)] || attrs[attr]);
    },

    /**
     @method _extractEmbeddedRecords
     @private
    */
    _extractEmbeddedRecords: function _extractEmbeddedRecords(serializer, store, typeClass, partial) {
      var _this = this;

      typeClass.eachRelationship(function (key, relationship) {
        if (serializer.hasDeserializeRecordsOption(key)) {
          if (relationship.kind === "hasMany") {
            _this._extractEmbeddedHasMany(store, key, partial, relationship);
          }
          if (relationship.kind === "belongsTo") {
            _this._extractEmbeddedBelongsTo(store, key, partial, relationship);
          }
        }
      });
      return partial;
    },

    /**
     @method _extractEmbeddedHasMany
     @private
    */
    _extractEmbeddedHasMany: function _extractEmbeddedHasMany(store, key, hash, relationshipMeta) {
      var relationshipHash = get(hash, 'data.relationships.' + key + '.data');

      if (!relationshipHash) {
        return;
      }

      var hasMany = new Array(relationshipHash.length);

      for (var i = 0; i < relationshipHash.length; i++) {
        var item = relationshipHash[i];

        var _normalizeEmbeddedRelationship2 = this._normalizeEmbeddedRelationship(store, relationshipMeta, item);

        var data = _normalizeEmbeddedRelationship2.data;
        var included = _normalizeEmbeddedRelationship2.included;

        hash.included = hash.included || [];
        hash.included.push(data);
        if (included) {
          var _hash$included;

          (_hash$included = hash.included).push.apply(_hash$included, _toConsumableArray(included));
        }

        hasMany[i] = { id: data.id, type: data.type };
      }

      var relationship = { data: hasMany };
      set(hash, 'data.relationships.' + key, relationship);
    },

    /**
     @method _extractEmbeddedBelongsTo
     @private
    */
    _extractEmbeddedBelongsTo: function _extractEmbeddedBelongsTo(store, key, hash, relationshipMeta) {
      var relationshipHash = get(hash, 'data.relationships.' + key + '.data');
      if (!relationshipHash) {
        return;
      }

      var _normalizeEmbeddedRelationship3 = this._normalizeEmbeddedRelationship(store, relationshipMeta, relationshipHash);

      var data = _normalizeEmbeddedRelationship3.data;
      var included = _normalizeEmbeddedRelationship3.included;

      hash.included = hash.included || [];
      hash.included.push(data);
      if (included) {
        var _hash$included2;

        (_hash$included2 = hash.included).push.apply(_hash$included2, _toConsumableArray(included));
      }

      var belongsTo = { id: data.id, type: data.type };
      var relationship = { data: belongsTo };

      set(hash, 'data.relationships.' + key, relationship);
    },

    /**
     @method _normalizeEmbeddedRelationship
     @private
    */
    _normalizeEmbeddedRelationship: function _normalizeEmbeddedRelationship(store, relationshipMeta, relationshipHash) {
      var modelName = relationshipMeta.type;
      if (relationshipMeta.options.polymorphic) {
        modelName = relationshipHash.type;
      }
      var modelClass = store.modelFor(modelName);
      var serializer = store.serializerFor(modelName);

      return serializer.normalize(modelClass, relationshipHash, null);
    },
    isEmbeddedRecordsMixin: true
  });
});
define('ember-data/serializers/json-api', ['exports', 'ember', 'ember-data/-private/debug', 'ember-data/serializers/json', 'ember-data/-private/system/normalize-model-name', 'ember-inflector', 'ember-data/-private/features'], function (exports, _ember, _emberDataPrivateDebug, _emberDataSerializersJson, _emberDataPrivateSystemNormalizeModelName, _emberInflector, _emberDataPrivateFeatures) {
  /**
    @module ember-data
  */

  'use strict';

  var dasherize = _ember['default'].String.dasherize;

  /**
    Ember Data 2.0 Serializer:
  
    In Ember Data a Serializer is used to serialize and deserialize
    records when they are transferred in and out of an external source.
    This process involves normalizing property names, transforming
    attribute values and serializing relationships.
  
    `JSONAPISerializer` supports the http://jsonapi.org/ spec and is the
    serializer recommended by Ember Data.
  
    This serializer normalizes a JSON API payload that looks like:
  
    ```js
  
      // models/player.js
      import DS from "ember-data";
  
      export default DS.Model.extend({
        name: DS.attr(),
        skill: DS.attr(),
        gamesPlayed: DS.attr(),
        club: DS.belongsTo('club')
      });
  
      // models/club.js
      import DS from "ember-data";
  
      export default DS.Model.extend({
        name: DS.attr(),
        location: DS.attr(),
        players: DS.hasMany('player')
      });
    ```
  
    ```js
  
      {
        "data": [
          {
            "attributes": {
              "name": "Benfica",
              "location": "Portugal"
            },
            "id": "1",
            "relationships": {
              "players": {
                "data": [
                  {
                    "id": "3",
                    "type": "players"
                  }
                ]
              }
            },
            "type": "clubs"
          }
        ],
        "included": [
          {
            "attributes": {
              "name": "Eusebio Silva Ferreira",
              "skill": "Rocket shot",
              "games-played": 431
            },
            "id": "3",
            "relationships": {
              "club": {
                "data": {
                  "id": "1",
                  "type": "clubs"
                }
              }
            },
            "type": "players"
          }
        ]
      }
    ```
  
    to the format that the Ember Data store expects.
  
    @since 1.13.0
    @class JSONAPISerializer
    @namespace DS
    @extends DS.JSONSerializer
  */
  var JSONAPISerializer = _emberDataSerializersJson['default'].extend({

    /**
      @method _normalizeDocumentHelper
      @param {Object} documentHash
      @return {Object}
      @private
    */
    _normalizeDocumentHelper: function _normalizeDocumentHelper(documentHash) {

      if (_ember['default'].typeOf(documentHash.data) === 'object') {
        documentHash.data = this._normalizeResourceHelper(documentHash.data);
      } else if (Array.isArray(documentHash.data)) {
        var ret = new Array(documentHash.data.length);

        for (var i = 0; i < documentHash.data.length; i++) {
          var data = documentHash.data[i];
          ret[i] = this._normalizeResourceHelper(data);
        }

        documentHash.data = ret;
      }

      if (Array.isArray(documentHash.included)) {
        var ret = new Array(documentHash.included.length);

        for (var i = 0; i < documentHash.included.length; i++) {
          var included = documentHash.included[i];
          ret[i] = this._normalizeResourceHelper(included);
        }

        documentHash.included = ret;
      }

      return documentHash;
    },

    /**
      @method _normalizeRelationshipDataHelper
      @param {Object} relationshipDataHash
      @return {Object}
      @private
    */
    _normalizeRelationshipDataHelper: function _normalizeRelationshipDataHelper(relationshipDataHash) {
      if (false) {
        var modelName = this.modelNameFromPayloadType(relationshipDataHash.type);
        var deprecatedModelNameLookup = this.modelNameFromPayloadKey(relationshipDataHash.type);

        if (modelName !== deprecatedModelNameLookup && this._hasCustomModelNameFromPayloadKey()) {
          (0, _emberDataPrivateDebug.deprecate)("You are using modelNameFromPayloadKey to normalize the type for a relationship. This has been deprecated in favor of modelNameFromPayloadType", false, {
            id: 'ds.json-api-serializer.deprecated-model-name-for-relationship',
            until: '3.0.0'
          });

          modelName = deprecatedModelNameLookup;
        }

        relationshipDataHash.type = modelName;
      } else {
        var type = this.modelNameFromPayloadKey(relationshipDataHash.type);
        relationshipDataHash.type = type;
      }

      return relationshipDataHash;
    },

    /**
      @method _normalizeResourceHelper
      @param {Object} resourceHash
      @return {Object}
      @private
    */
    _normalizeResourceHelper: function _normalizeResourceHelper(resourceHash) {
      (0, _emberDataPrivateDebug.assert)(this.warnMessageForUndefinedType(), !_ember['default'].isNone(resourceHash.type), {
        id: 'ds.serializer.type-is-undefined'
      });

      var modelName = undefined,
          usedLookup = undefined;

      if (false) {
        modelName = this.modelNameFromPayloadType(resourceHash.type);
        var deprecatedModelNameLookup = this.modelNameFromPayloadKey(resourceHash.type);

        usedLookup = 'modelNameFromPayloadType';

        if (modelName !== deprecatedModelNameLookup && this._hasCustomModelNameFromPayloadKey()) {
          (0, _emberDataPrivateDebug.deprecate)("You are using modelNameFromPayloadKey to normalize the type for a resource. This has been deprecated in favor of modelNameFromPayloadType", false, {
            id: 'ds.json-api-serializer.deprecated-model-name-for-resource',
            until: '3.0.0'
          });

          modelName = deprecatedModelNameLookup;
          usedLookup = 'modelNameFromPayloadKey';
        }
      } else {
        modelName = this.modelNameFromPayloadKey(resourceHash.type);
        usedLookup = 'modelNameFromPayloadKey';
      }

      if (!this.store._hasModelFor(modelName)) {
        (0, _emberDataPrivateDebug.warn)(this.warnMessageNoModelForType(modelName, resourceHash.type, usedLookup), false, {
          id: 'ds.serializer.model-for-type-missing'
        });
        return null;
      }

      var modelClass = this.store.modelFor(modelName);
      var serializer = this.store.serializerFor(modelName);

      var _serializer$normalize = serializer.normalize(modelClass, resourceHash);

      var data = _serializer$normalize.data;

      return data;
    },

    /**
      @method pushPayload
      @param {DS.Store} store
      @param {Object} payload
    */
    pushPayload: function pushPayload(store, payload) {
      var normalizedPayload = this._normalizeDocumentHelper(payload);
      if (false) {
        return store.push(normalizedPayload);
      } else {
        store.push(normalizedPayload);
      }
    },

    /**
      @method _normalizeResponse
      @param {DS.Store} store
      @param {DS.Model} primaryModelClass
      @param {Object} payload
      @param {String|Number} id
      @param {String} requestType
      @param {Boolean} isSingle
      @return {Object} JSON-API Document
      @private
    */
    _normalizeResponse: function _normalizeResponse(store, primaryModelClass, payload, id, requestType, isSingle) {
      var normalizedPayload = this._normalizeDocumentHelper(payload);
      return normalizedPayload;
    },

    normalizeQueryRecordResponse: function normalizeQueryRecordResponse() {
      var normalized = this._super.apply(this, arguments);

      (0, _emberDataPrivateDebug.assert)('Expected the primary data returned by the serializer for a `queryRecord` response to be a single object but instead it was an array.', !Array.isArray(normalized.data), {
        id: 'ds.serializer.json-api.queryRecord-array-response'
      });

      return normalized;
    },

    /**
      @method extractAttributes
      @param {DS.Model} modelClass
      @param {Object} resourceHash
      @return {Object}
    */
    extractAttributes: function extractAttributes(modelClass, resourceHash) {
      var _this = this;

      var attributes = {};

      if (resourceHash.attributes) {
        modelClass.eachAttribute(function (key) {
          var attributeKey = _this.keyForAttribute(key, 'deserialize');
          if (resourceHash.attributes[attributeKey] !== undefined) {
            attributes[key] = resourceHash.attributes[attributeKey];
          }
        });
      }

      return attributes;
    },

    /**
      @method extractRelationship
      @param {Object} relationshipHash
      @return {Object}
    */
    extractRelationship: function extractRelationship(relationshipHash) {

      if (_ember['default'].typeOf(relationshipHash.data) === 'object') {
        relationshipHash.data = this._normalizeRelationshipDataHelper(relationshipHash.data);
      }

      if (Array.isArray(relationshipHash.data)) {
        var ret = new Array(relationshipHash.data.length);

        for (var i = 0; i < relationshipHash.data.length; i++) {
          var data = relationshipHash.data[i];
          ret[i] = this._normalizeRelationshipDataHelper(data);
        }

        relationshipHash.data = ret;
      }

      return relationshipHash;
    },

    /**
      @method extractRelationships
      @param {Object} modelClass
      @param {Object} resourceHash
      @return {Object}
    */
    extractRelationships: function extractRelationships(modelClass, resourceHash) {
      var _this2 = this;

      var relationships = {};

      if (resourceHash.relationships) {
        modelClass.eachRelationship(function (key, relationshipMeta) {
          var relationshipKey = _this2.keyForRelationship(key, relationshipMeta.kind, 'deserialize');
          if (resourceHash.relationships[relationshipKey] !== undefined) {

            var relationshipHash = resourceHash.relationships[relationshipKey];
            relationships[key] = _this2.extractRelationship(relationshipHash);
          }
        });
      }

      return relationships;
    },

    /**
      @method _extractType
      @param {DS.Model} modelClass
      @param {Object} resourceHash
      @return {String}
      @private
    */
    _extractType: function _extractType(modelClass, resourceHash) {
      if (false) {
        var modelName = this.modelNameFromPayloadType(resourceHash.type);
        var deprecatedModelNameLookup = this.modelNameFromPayloadKey(resourceHash.type);

        if (modelName !== deprecatedModelNameLookup && this._hasCustomModelNameFromPayloadKey()) {
          (0, _emberDataPrivateDebug.deprecate)("You are using modelNameFromPayloadKey to normalize the type for a polymorphic relationship. This has been deprecated in favor of modelNameFromPayloadType", false, {
            id: 'ds.json-api-serializer.deprecated-model-name-for-polymorphic-type',
            until: '3.0.0'
          });

          modelName = deprecatedModelNameLookup;
        }

        return modelName;
      } else {
        return this.modelNameFromPayloadKey(resourceHash.type);
      }
    },

    /**
      @method modelNameFromPayloadKey
      @param {String} key
      @return {String} the model's modelName
    */
    // TODO @deprecated Use modelNameFromPayloadType instead
    modelNameFromPayloadKey: function modelNameFromPayloadKey(key) {
      return (0, _emberInflector.singularize)((0, _emberDataPrivateSystemNormalizeModelName['default'])(key));
    },

    /**
      @method payloadKeyFromModelName
      @param {String} modelName
      @return {String}
    */
    // TODO @deprecated Use payloadTypeFromModelName instead
    payloadKeyFromModelName: function payloadKeyFromModelName(modelName) {
      return (0, _emberInflector.pluralize)(modelName);
    },

    /**
      @method normalize
      @param {DS.Model} modelClass
      @param {Object} resourceHash the resource hash from the adapter
      @return {Object} the normalized resource hash
    */
    normalize: function normalize(modelClass, resourceHash) {
      if (resourceHash.attributes) {
        this.normalizeUsingDeclaredMapping(modelClass, resourceHash.attributes);
      }

      if (resourceHash.relationships) {
        this.normalizeUsingDeclaredMapping(modelClass, resourceHash.relationships);
      }

      var data = {
        id: this.extractId(modelClass, resourceHash),
        type: this._extractType(modelClass, resourceHash),
        attributes: this.extractAttributes(modelClass, resourceHash),
        relationships: this.extractRelationships(modelClass, resourceHash)
      };

      this.applyTransforms(modelClass, data.attributes);

      return { data: data };
    },

    /**
     `keyForAttribute` can be used to define rules for how to convert an
     attribute name in your model to a key in your JSON.
     By default `JSONAPISerializer` follows the format used on the examples of
     http://jsonapi.org/format and uses dashes as the word separator in the JSON
     attribute keys.
      This behaviour can be easily customized by extending this method.
      Example
      ```app/serializers/application.js
     import DS from 'ember-data';
      export default DS.JSONAPISerializer.extend({
       keyForAttribute: function(attr, method) {
         return Ember.String.dasherize(attr).toUpperCase();
       }
     });
     ```
      @method keyForAttribute
     @param {String} key
     @param {String} method
     @return {String} normalized key
    */
    keyForAttribute: function keyForAttribute(key, method) {
      return dasherize(key);
    },

    /**
     `keyForRelationship` can be used to define a custom key when
     serializing and deserializing relationship properties.
     By default `JSONAPISerializer` follows the format used on the examples of
     http://jsonapi.org/format and uses dashes as word separators in
     relationship properties.
      This behaviour can be easily customized by extending this method.
      Example
       ```app/serializers/post.js
      import DS from 'ember-data';
       export default DS.JSONAPISerializer.extend({
        keyForRelationship: function(key, relationship, method) {
          return Ember.String.underscore(key);
        }
      });
      ```
     @method keyForRelationship
     @param {String} key
     @param {String} typeClass
     @param {String} method
     @return {String} normalized key
    */
    keyForRelationship: function keyForRelationship(key, typeClass, method) {
      return dasherize(key);
    },

    /**
      @method serialize
      @param {DS.Snapshot} snapshot
      @param {Object} options
      @return {Object} json
    */
    serialize: function serialize(snapshot, options) {
      var data = this._super.apply(this, arguments);

      var payloadType = undefined;
      if (false) {
        payloadType = this.payloadTypeFromModelName(snapshot.modelName);
        var deprecatedPayloadTypeLookup = this.payloadKeyFromModelName(snapshot.modelName);

        if (payloadType !== deprecatedPayloadTypeLookup && this._hasCustomPayloadKeyFromModelName()) {
          (0, _emberDataPrivateDebug.deprecate)("You used payloadKeyFromModelName to customize how a type is serialized. Use payloadTypeFromModelName instead.", false, {
            id: 'ds.json-api-serializer.deprecated-payload-type-for-model',
            until: '3.0.0'
          });

          payloadType = deprecatedPayloadTypeLookup;
        }
      } else {
        payloadType = this.payloadKeyFromModelName(snapshot.modelName);
      }

      data.type = payloadType;
      return { data: data };
    },

    /**
     @method serializeAttribute
     @param {DS.Snapshot} snapshot
     @param {Object} json
     @param {String} key
     @param {Object} attribute
    */
    serializeAttribute: function serializeAttribute(snapshot, json, key, attribute) {
      var type = attribute.type;

      if (this._canSerialize(key)) {
        json.attributes = json.attributes || {};

        var value = snapshot.attr(key);
        if (type) {
          var transform = this.transformFor(type);
          value = transform.serialize(value, attribute.options);
        }

        var payloadKey = this._getMappedKey(key, snapshot.type);

        if (payloadKey === key) {
          payloadKey = this.keyForAttribute(key, 'serialize');
        }

        json.attributes[payloadKey] = value;
      }
    },

    /**
     @method serializeBelongsTo
     @param {DS.Snapshot} snapshot
     @param {Object} json
     @param {Object} relationship
    */
    serializeBelongsTo: function serializeBelongsTo(snapshot, json, relationship) {
      var key = relationship.key;

      if (this._canSerialize(key)) {
        var belongsTo = snapshot.belongsTo(key);
        if (belongsTo !== undefined) {

          json.relationships = json.relationships || {};

          var payloadKey = this._getMappedKey(key, snapshot.type);
          if (payloadKey === key) {
            payloadKey = this.keyForRelationship(key, 'belongsTo', 'serialize');
          }

          var data = null;
          if (belongsTo) {
            var payloadType = undefined;

            if (false) {
              payloadType = this.payloadTypeFromModelName(belongsTo.modelName);
              var deprecatedPayloadTypeLookup = this.payloadKeyFromModelName(belongsTo.modelName);

              if (payloadType !== deprecatedPayloadTypeLookup && this._hasCustomPayloadKeyFromModelName()) {
                (0, _emberDataPrivateDebug.deprecate)("You used payloadKeyFromModelName to serialize type for belongs-to relationship. Use payloadTypeFromModelName instead.", false, {
                  id: 'ds.json-api-serializer.deprecated-payload-type-for-belongs-to',
                  until: '3.0.0'
                });

                payloadType = deprecatedPayloadTypeLookup;
              }
            } else {
              payloadType = this.payloadKeyFromModelName(belongsTo.modelName);
            }

            data = {
              type: payloadType,
              id: belongsTo.id
            };
          }

          json.relationships[payloadKey] = { data: data };
        }
      }
    },

    /**
     @method serializeHasMany
     @param {DS.Snapshot} snapshot
     @param {Object} json
     @param {Object} relationship
    */
    serializeHasMany: function serializeHasMany(snapshot, json, relationship) {
      var key = relationship.key;
      var shouldSerializeHasMany = '_shouldSerializeHasMany';
      if (false) {
        shouldSerializeHasMany = 'shouldSerializeHasMany';
      }

      if (this[shouldSerializeHasMany](snapshot, key, relationship)) {
        var hasMany = snapshot.hasMany(key);
        if (hasMany !== undefined) {

          json.relationships = json.relationships || {};

          var payloadKey = this._getMappedKey(key, snapshot.type);
          if (payloadKey === key && this.keyForRelationship) {
            payloadKey = this.keyForRelationship(key, 'hasMany', 'serialize');
          }

          var data = new Array(hasMany.length);

          for (var i = 0; i < hasMany.length; i++) {
            var item = hasMany[i];

            var payloadType = undefined;

            if (false) {
              payloadType = this.payloadTypeFromModelName(item.modelName);
              var deprecatedPayloadTypeLookup = this.payloadKeyFromModelName(item.modelName);

              if (payloadType !== deprecatedPayloadTypeLookup && this._hasCustomPayloadKeyFromModelName()) {
                (0, _emberDataPrivateDebug.deprecate)("You used payloadKeyFromModelName to serialize type for belongs-to relationship. Use payloadTypeFromModelName instead.", false, {
                  id: 'ds.json-api-serializer.deprecated-payload-type-for-has-many',
                  until: '3.0.0'
                });

                payloadType = deprecatedPayloadTypeLookup;
              }
            } else {
              payloadType = this.payloadKeyFromModelName(item.modelName);
            }

            data[i] = {
              type: payloadType,
              id: item.id
            };
          }

          json.relationships[payloadKey] = { data: data };
        }
      }
    }
  });

  if (false) {

    JSONAPISerializer.reopen({

      /**
        `modelNameFromPayloadType` can be used to change the mapping for a DS model
        name, taken from the value in the payload.
         Say your API namespaces the type of a model and returns the following
        payload for the `post` model:
         ```javascript
        // GET /api/posts/1
        {
          "data": {
            "id": 1,
            "type: "api::v1::post"
          }
        }
        ```
         By overwriting `modelNameFromPayloadType` you can specify that the
        `post` model should be used:
         ```app/serializers/application.js
        import DS from "ember-data";
         export default DS.JSONAPISerializer.extend({
          modelNameFromPayloadType(payloadType) {
            return payloadType.replace('api::v1::', '');
          }
        });
        ```
         By default the modelName for a model is its singularized name in dasherized
        form.  Usually, Ember Data can use the correct inflection to do this for
        you. Most of the time, you won't need to override
        `modelNameFromPayloadType` for this purpose.
         Also take a look at
        [payloadTypeFromModelName](#method_payloadTypeFromModelName) to customize
        how the type of a record should be serialized.
         @method modelNameFromPayloadType
        @public
        @param {String} payloadType type from payload
        @return {String} modelName
      */
      modelNameFromPayloadType: function modelNameFromPayloadType(type) {
        return (0, _emberInflector.singularize)((0, _emberDataPrivateSystemNormalizeModelName['default'])(type));
      },

      /**
        `payloadTypeFromModelName` can be used to change the mapping for the type in
        the payload, taken from the model name.
         Say your API namespaces the type of a model and expects the following
        payload when you update the `post` model:
         ```javascript
        // POST /api/posts/1
        {
          "data": {
            "id": 1,
            "type": "api::v1::post"
          }
        }
        ```
         By overwriting `payloadTypeFromModelName` you can specify that the
        namespaces model name for the `post` should be used:
         ```app/serializers/application.js
        import DS from "ember-data";
         export default JSONAPISerializer.extend({
          payloadTypeFromModelName(modelName) {
            return "api::v1::" + modelName;
          }
        });
        ```
         By default the payload type is the pluralized model name. Usually, Ember
        Data can use the correct inflection to do this for you. Most of the time,
        you won't need to override `payloadTypeFromModelName` for this purpose.
         Also take a look at
        [modelNameFromPayloadType](#method_modelNameFromPayloadType) to customize
        how the model name from should be mapped from the payload.
         @method payloadTypeFromModelName
        @public
        @param {String} modelname modelName from the record
        @return {String} payloadType
      */
      payloadTypeFromModelName: function payloadTypeFromModelName(modelName) {
        return (0, _emberInflector.pluralize)(modelName);
      },

      _hasCustomModelNameFromPayloadKey: function _hasCustomModelNameFromPayloadKey() {
        return this.modelNameFromPayloadKey !== JSONAPISerializer.prototype.modelNameFromPayloadKey;
      },

      _hasCustomPayloadKeyFromModelName: function _hasCustomPayloadKeyFromModelName() {
        return this.payloadKeyFromModelName !== JSONAPISerializer.prototype.payloadKeyFromModelName;
      }

    });
  }

  (0, _emberDataPrivateDebug.runInDebug)(function () {
    JSONAPISerializer.reopen({
      willMergeMixin: function willMergeMixin(props) {
        (0, _emberDataPrivateDebug.warn)('The JSONAPISerializer does not work with the EmbeddedRecordsMixin because the JSON API spec does not describe how to format embedded resources.', !props.isEmbeddedRecordsMixin, {
          id: 'ds.serializer.embedded-records-mixin-not-supported'
        });
      },
      warnMessageForUndefinedType: function warnMessageForUndefinedType() {
        return 'Encountered a resource object with an undefined type (resolved resource using ' + this.constructor.toString() + ')';
      },
      warnMessageNoModelForType: function warnMessageNoModelForType(modelName, originalType, usedLookup) {
        return 'Encountered a resource object with type "' + originalType + '", but no model was found for model name "' + modelName + '" (resolved model name using \'' + this.constructor.toString() + '.' + usedLookup + '("' + originalType + '")).';
      }
    });
  });

  exports['default'] = JSONAPISerializer;
});
define('ember-data/serializers/json', ['exports', 'ember', 'ember-data/-private/debug', 'ember-data/serializer', 'ember-data/-private/system/coerce-id', 'ember-data/-private/system/normalize-model-name', 'ember-data/-private/utils', 'ember-data/-private/features', 'ember-data/adapters/errors'], function (exports, _ember, _emberDataPrivateDebug, _emberDataSerializer, _emberDataPrivateSystemCoerceId, _emberDataPrivateSystemNormalizeModelName, _emberDataPrivateUtils, _emberDataPrivateFeatures, _emberDataAdaptersErrors) {
  'use strict';

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var get = _ember['default'].get;
  var isNone = _ember['default'].isNone;
  var assign = _ember['default'].assign || _ember['default'].merge;

  /**
    Ember Data 2.0 Serializer:
  
    In Ember Data a Serializer is used to serialize and deserialize
    records when they are transferred in and out of an external source.
    This process involves normalizing property names, transforming
    attribute values and serializing relationships.
  
    By default, Ember Data uses and recommends the `JSONAPISerializer`.
  
    `JSONSerializer` is useful for simpler or legacy backends that may
    not support the http://jsonapi.org/ spec.
  
    For example, given the following `User` model and JSON payload:
  
    ```app/models/user.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      friends: DS.hasMany('user'),
      house: DS.belongsTo('location'),
  
      name: DS.attr('string')
    });
    ```
  
    ```js
    {
      id: 1,
      name: 'Sebastian',
      friends: [3, 4],
      links: {
        house: '/houses/lefkada'
      }
    }
    ```
  
    `JSONSerializer` will normalize the JSON payload to the JSON API format that the
    Ember Data store expects.
  
    You can customize how JSONSerializer processes its payload by passing options in
    the `attrs` hash or by subclassing the `JSONSerializer` and overriding hooks:
  
      - To customize how a single record is normalized, use the `normalize` hook.
      - To customize how `JSONSerializer` normalizes the whole server response, use the
        `normalizeResponse` hook.
      - To customize how `JSONSerializer` normalizes a specific response from the server,
        use one of the many specific `normalizeResponse` hooks.
      - To customize how `JSONSerializer` normalizes your id, attributes or relationships,
        use the `extractId`, `extractAttributes` and `extractRelationships` hooks.
  
    The `JSONSerializer` normalization process follows these steps:
  
      - `normalizeResponse` - entry method to the serializer.
      - `normalizeCreateRecordResponse` - a `normalizeResponse` for a specific operation is called.
      - `normalizeSingleResponse`|`normalizeArrayResponse` - for methods like `createRecord` we expect
        a single record back, while for methods like `findAll` we expect multiple methods back.
      - `normalize` - `normalizeArray` iterates and calls `normalize` for each of its records while `normalizeSingle`
        calls it once. This is the method you most likely want to subclass.
      - `extractId` | `extractAttributes` | `extractRelationships` - `normalize` delegates to these methods to
        turn the record payload into the JSON API format.
  
    @class JSONSerializer
    @namespace DS
    @extends DS.Serializer
  */
  var JSONSerializer = _emberDataSerializer['default'].extend({

    /**
      The `primaryKey` is used when serializing and deserializing
      data. Ember Data always uses the `id` property to store the id of
      the record. The external source may not always follow this
      convention. In these cases it is useful to override the
      `primaryKey` property to match the `primaryKey` of your external
      store.
       Example
       ```app/serializers/application.js
      import DS from 'ember-data';
       export default DS.JSONSerializer.extend({
        primaryKey: '_id'
      });
      ```
       @property primaryKey
      @type {String}
      @default 'id'
    */
    primaryKey: 'id',

    /**
      The `attrs` object can be used to declare a simple mapping between
      property names on `DS.Model` records and payload keys in the
      serialized JSON object representing the record. An object with the
      property `key` can also be used to designate the attribute's key on
      the response payload.
       Example
       ```app/models/person.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        firstName: DS.attr('string'),
        lastName: DS.attr('string'),
        occupation: DS.attr('string'),
        admin: DS.attr('boolean')
      });
      ```
       ```app/serializers/person.js
      import DS from 'ember-data';
       export default DS.JSONSerializer.extend({
        attrs: {
          admin: 'is_admin',
          occupation: { key: 'career' }
        }
      });
      ```
       You can also remove attributes by setting the `serialize` key to
      `false` in your mapping object.
       Example
       ```app/serializers/person.js
      import DS from 'ember-data';
       export default DS.JSONSerializer.extend({
        attrs: {
          admin: { serialize: false },
          occupation: { key: 'career' }
        }
      });
      ```
       When serialized:
       ```javascript
      {
        "firstName": "Harry",
        "lastName": "Houdini",
        "career": "magician"
      }
      ```
       Note that the `admin` is now not included in the payload.
       @property attrs
      @type {Object}
    */
    mergedProperties: ['attrs'],

    /**
     Given a subclass of `DS.Model` and a JSON object this method will
     iterate through each attribute of the `DS.Model` and invoke the
     `DS.Transform#deserialize` method on the matching property of the
     JSON object.  This method is typically called after the
     serializer's `normalize` method.
      @method applyTransforms
     @private
     @param {DS.Model} typeClass
     @param {Object} data The data to transform
     @return {Object} data The transformed data object
    */
    applyTransforms: function applyTransforms(typeClass, data) {
      var _this = this;

      var attributes = get(typeClass, 'attributes');

      typeClass.eachTransformedAttribute(function (key, typeClass) {
        if (data[key] === undefined) {
          return;
        }

        var transform = _this.transformFor(typeClass);
        var transformMeta = attributes.get(key);
        data[key] = transform.deserialize(data[key], transformMeta.options);
      });

      return data;
    },

    /**
      The `normalizeResponse` method is used to normalize a payload from the
      server to a JSON-API Document.
       http://jsonapi.org/format/#document-structure
       This method delegates to a more specific normalize method based on
      the `requestType`.
       To override this method with a custom one, make sure to call
      `return this._super(store, primaryModelClass, payload, id, requestType)` with your
      pre-processed data.
       Here's an example of using `normalizeResponse` manually:
       ```javascript
      socket.on('message', function(message) {
        var data = message.data;
        var modelClass = store.modelFor(data.modelName);
        var serializer = store.serializerFor(data.modelName);
        var normalized = serializer.normalizeSingleResponse(store, modelClass, data, data.id);
         store.push(normalized);
      });
      ```
       @since 1.13.0
      @method normalizeResponse
      @param {DS.Store} store
      @param {DS.Model} primaryModelClass
      @param {Object} payload
      @param {String|Number} id
      @param {String} requestType
      @return {Object} JSON-API Document
    */
    normalizeResponse: function normalizeResponse(store, primaryModelClass, payload, id, requestType) {
      switch (requestType) {
        case 'findRecord':
          return this.normalizeFindRecordResponse.apply(this, arguments);
        case 'queryRecord':
          return this.normalizeQueryRecordResponse.apply(this, arguments);
        case 'findAll':
          return this.normalizeFindAllResponse.apply(this, arguments);
        case 'findBelongsTo':
          return this.normalizeFindBelongsToResponse.apply(this, arguments);
        case 'findHasMany':
          return this.normalizeFindHasManyResponse.apply(this, arguments);
        case 'findMany':
          return this.normalizeFindManyResponse.apply(this, arguments);
        case 'query':
          return this.normalizeQueryResponse.apply(this, arguments);
        case 'createRecord':
          return this.normalizeCreateRecordResponse.apply(this, arguments);
        case 'deleteRecord':
          return this.normalizeDeleteRecordResponse.apply(this, arguments);
        case 'updateRecord':
          return this.normalizeUpdateRecordResponse.apply(this, arguments);
      }
    },

    /**
      @since 1.13.0
      @method normalizeFindRecordResponse
      @param {DS.Store} store
      @param {DS.Model} primaryModelClass
      @param {Object} payload
      @param {String|Number} id
      @param {String} requestType
      @return {Object} JSON-API Document
    */
    normalizeFindRecordResponse: function normalizeFindRecordResponse(store, primaryModelClass, payload, id, requestType) {
      return this.normalizeSingleResponse.apply(this, arguments);
    },

    /**
      @since 1.13.0
      @method normalizeQueryRecordResponse
      @param {DS.Store} store
      @param {DS.Model} primaryModelClass
      @param {Object} payload
      @param {String|Number} id
      @param {String} requestType
      @return {Object} JSON-API Document
    */
    normalizeQueryRecordResponse: function normalizeQueryRecordResponse(store, primaryModelClass, payload, id, requestType) {
      return this.normalizeSingleResponse.apply(this, arguments);
    },

    /**
      @since 1.13.0
      @method normalizeFindAllResponse
      @param {DS.Store} store
      @param {DS.Model} primaryModelClass
      @param {Object} payload
      @param {String|Number} id
      @param {String} requestType
      @return {Object} JSON-API Document
    */
    normalizeFindAllResponse: function normalizeFindAllResponse(store, primaryModelClass, payload, id, requestType) {
      return this.normalizeArrayResponse.apply(this, arguments);
    },

    /**
      @since 1.13.0
      @method normalizeFindBelongsToResponse
      @param {DS.Store} store
      @param {DS.Model} primaryModelClass
      @param {Object} payload
      @param {String|Number} id
      @param {String} requestType
      @return {Object} JSON-API Document
    */
    normalizeFindBelongsToResponse: function normalizeFindBelongsToResponse(store, primaryModelClass, payload, id, requestType) {
      return this.normalizeSingleResponse.apply(this, arguments);
    },

    /**
      @since 1.13.0
      @method normalizeFindHasManyResponse
      @param {DS.Store} store
      @param {DS.Model} primaryModelClass
      @param {Object} payload
      @param {String|Number} id
      @param {String} requestType
      @return {Object} JSON-API Document
    */
    normalizeFindHasManyResponse: function normalizeFindHasManyResponse(store, primaryModelClass, payload, id, requestType) {
      return this.normalizeArrayResponse.apply(this, arguments);
    },

    /**
      @since 1.13.0
      @method normalizeFindManyResponse
      @param {DS.Store} store
      @param {DS.Model} primaryModelClass
      @param {Object} payload
      @param {String|Number} id
      @param {String} requestType
      @return {Object} JSON-API Document
    */
    normalizeFindManyResponse: function normalizeFindManyResponse(store, primaryModelClass, payload, id, requestType) {
      return this.normalizeArrayResponse.apply(this, arguments);
    },

    /**
      @since 1.13.0
      @method normalizeQueryResponse
      @param {DS.Store} store
      @param {DS.Model} primaryModelClass
      @param {Object} payload
      @param {String|Number} id
      @param {String} requestType
      @return {Object} JSON-API Document
    */
    normalizeQueryResponse: function normalizeQueryResponse(store, primaryModelClass, payload, id, requestType) {
      return this.normalizeArrayResponse.apply(this, arguments);
    },

    /**
      @since 1.13.0
      @method normalizeCreateRecordResponse
      @param {DS.Store} store
      @param {DS.Model} primaryModelClass
      @param {Object} payload
      @param {String|Number} id
      @param {String} requestType
      @return {Object} JSON-API Document
    */
    normalizeCreateRecordResponse: function normalizeCreateRecordResponse(store, primaryModelClass, payload, id, requestType) {
      return this.normalizeSaveResponse.apply(this, arguments);
    },

    /**
      @since 1.13.0
      @method normalizeDeleteRecordResponse
      @param {DS.Store} store
      @param {DS.Model} primaryModelClass
      @param {Object} payload
      @param {String|Number} id
      @param {String} requestType
      @return {Object} JSON-API Document
    */
    normalizeDeleteRecordResponse: function normalizeDeleteRecordResponse(store, primaryModelClass, payload, id, requestType) {
      return this.normalizeSaveResponse.apply(this, arguments);
    },

    /**
      @since 1.13.0
      @method normalizeUpdateRecordResponse
      @param {DS.Store} store
      @param {DS.Model} primaryModelClass
      @param {Object} payload
      @param {String|Number} id
      @param {String} requestType
      @return {Object} JSON-API Document
    */
    normalizeUpdateRecordResponse: function normalizeUpdateRecordResponse(store, primaryModelClass, payload, id, requestType) {
      return this.normalizeSaveResponse.apply(this, arguments);
    },

    /**
      @since 1.13.0
      @method normalizeSaveResponse
      @param {DS.Store} store
      @param {DS.Model} primaryModelClass
      @param {Object} payload
      @param {String|Number} id
      @param {String} requestType
      @return {Object} JSON-API Document
    */
    normalizeSaveResponse: function normalizeSaveResponse(store, primaryModelClass, payload, id, requestType) {
      return this.normalizeSingleResponse.apply(this, arguments);
    },

    /**
      @since 1.13.0
      @method normalizeSingleResponse
      @param {DS.Store} store
      @param {DS.Model} primaryModelClass
      @param {Object} payload
      @param {String|Number} id
      @param {String} requestType
      @return {Object} JSON-API Document
    */
    normalizeSingleResponse: function normalizeSingleResponse(store, primaryModelClass, payload, id, requestType) {
      return this._normalizeResponse(store, primaryModelClass, payload, id, requestType, true);
    },

    /**
      @since 1.13.0
      @method normalizeArrayResponse
      @param {DS.Store} store
      @param {DS.Model} primaryModelClass
      @param {Object} payload
      @param {String|Number} id
      @param {String} requestType
      @return {Object} JSON-API Document
    */
    normalizeArrayResponse: function normalizeArrayResponse(store, primaryModelClass, payload, id, requestType) {
      return this._normalizeResponse(store, primaryModelClass, payload, id, requestType, false);
    },

    /**
      @method _normalizeResponse
      @param {DS.Store} store
      @param {DS.Model} primaryModelClass
      @param {Object} payload
      @param {String|Number} id
      @param {String} requestType
      @param {Boolean} isSingle
      @return {Object} JSON-API Document
      @private
    */
    _normalizeResponse: function _normalizeResponse(store, primaryModelClass, payload, id, requestType, isSingle) {
      var documentHash = {
        data: null,
        included: []
      };

      var meta = this.extractMeta(store, primaryModelClass, payload);
      if (meta) {
        (0, _emberDataPrivateDebug.assert)('The `meta` returned from `extractMeta` has to be an object, not "' + _ember['default'].typeOf(meta) + '".', _ember['default'].typeOf(meta) === 'object');
        documentHash.meta = meta;
      }

      if (isSingle) {
        var _normalize = this.normalize(primaryModelClass, payload);

        var data = _normalize.data;
        var included = _normalize.included;

        documentHash.data = data;
        if (included) {
          documentHash.included = included;
        }
      } else {
        var ret = new Array(payload.length);
        for (var i = 0, l = payload.length; i < l; i++) {
          var item = payload[i];

          var _normalize2 = this.normalize(primaryModelClass, item);

          var data = _normalize2.data;
          var included = _normalize2.included;

          if (included) {
            var _documentHash$included;

            (_documentHash$included = documentHash.included).push.apply(_documentHash$included, _toConsumableArray(included));
          }
          ret[i] = data;
        }

        documentHash.data = ret;
      }

      return documentHash;
    },

    /**
      Normalizes a part of the JSON payload returned by
      the server. You should override this method, munge the hash
      and call super if you have generic normalization to do.
       It takes the type of the record that is being normalized
      (as a DS.Model class), the property where the hash was
      originally found, and the hash to normalize.
       You can use this method, for example, to normalize underscored keys to camelized
      or other general-purpose normalizations.
       Example
       ```app/serializers/application.js
      import DS from 'ember-data';
       export default DS.JSONSerializer.extend({
        normalize: function(typeClass, hash) {
          var fields = Ember.get(typeClass, 'fields');
          fields.forEach(function(field) {
            var payloadField = Ember.String.underscore(field);
            if (field === payloadField) { return; }
             hash[field] = hash[payloadField];
            delete hash[payloadField];
          });
          return this._super.apply(this, arguments);
        }
      });
      ```
       @method normalize
      @param {DS.Model} typeClass
      @param {Object} hash
      @return {Object}
    */
    normalize: function normalize(modelClass, resourceHash) {
      var data = null;

      if (resourceHash) {
        this.normalizeUsingDeclaredMapping(modelClass, resourceHash);
        if (_ember['default'].typeOf(resourceHash.links) === 'object') {
          this.normalizeUsingDeclaredMapping(modelClass, resourceHash.links);
        }

        data = {
          id: this.extractId(modelClass, resourceHash),
          type: modelClass.modelName,
          attributes: this.extractAttributes(modelClass, resourceHash),
          relationships: this.extractRelationships(modelClass, resourceHash)
        };

        this.applyTransforms(modelClass, data.attributes);
      }

      return { data: data };
    },

    /**
      Returns the resource's ID.
       @method extractId
      @param {Object} modelClass
      @param {Object} resourceHash
      @return {String}
    */
    extractId: function extractId(modelClass, resourceHash) {
      var primaryKey = get(this, 'primaryKey');
      var id = resourceHash[primaryKey];
      return (0, _emberDataPrivateSystemCoerceId['default'])(id);
    },

    /**
      Returns the resource's attributes formatted as a JSON-API "attributes object".
       http://jsonapi.org/format/#document-resource-object-attributes
       @method extractAttributes
      @param {Object} modelClass
      @param {Object} resourceHash
      @return {Object}
    */
    extractAttributes: function extractAttributes(modelClass, resourceHash) {
      var _this2 = this;

      var attributeKey;
      var attributes = {};

      modelClass.eachAttribute(function (key) {
        attributeKey = _this2.keyForAttribute(key, 'deserialize');
        if (resourceHash[attributeKey] !== undefined) {
          attributes[key] = resourceHash[attributeKey];
        }
      });

      return attributes;
    },

    /**
      Returns a relationship formatted as a JSON-API "relationship object".
       http://jsonapi.org/format/#document-resource-object-relationships
       @method extractRelationship
      @param {Object} relationshipModelName
      @param {Object} relationshipHash
      @return {Object}
    */
    extractRelationship: function extractRelationship(relationshipModelName, relationshipHash) {
      if (_ember['default'].isNone(relationshipHash)) {
        return null;
      }
      /*
        When `relationshipHash` is an object it usually means that the relationship
        is polymorphic. It could however also be embedded resources that the
        EmbeddedRecordsMixin has be able to process.
      */
      if (_ember['default'].typeOf(relationshipHash) === 'object') {
        if (relationshipHash.id) {
          relationshipHash.id = (0, _emberDataPrivateSystemCoerceId['default'])(relationshipHash.id);
        }

        var modelClass = this.store.modelFor(relationshipModelName);
        if (relationshipHash.type && !(0, _emberDataPrivateUtils.modelHasAttributeOrRelationshipNamedType)(modelClass)) {

          if (false) {
            var modelName = this.modelNameFromPayloadType(relationshipHash.type);
            var deprecatedModelNameLookup = this.modelNameFromPayloadKey(relationshipHash.type);

            if (modelName !== deprecatedModelNameLookup && this._hasCustomModelNameFromPayloadKey()) {
              (0, _emberDataPrivateDebug.deprecate)("You used modelNameFromPayloadKey to customize how a type is normalized. Use modelNameFromPayloadType instead", false, {
                id: 'ds.json-serializer.deprecated-type-for-polymorphic-relationship',
                until: '3.0.0'
              });

              modelName = deprecatedModelNameLookup;
            }

            relationshipHash.type = modelName;
          } else {
            relationshipHash.type = this.modelNameFromPayloadKey(relationshipHash.type);
          }
        }
        return relationshipHash;
      }
      return { id: (0, _emberDataPrivateSystemCoerceId['default'])(relationshipHash), type: relationshipModelName };
    },

    /**
      Returns a polymorphic relationship formatted as a JSON-API "relationship object".
       http://jsonapi.org/format/#document-resource-object-relationships
       `relationshipOptions` is a hash which contains more information about the
      polymorphic relationship which should be extracted:
        - `resourceHash` complete hash of the resource the relationship should be
          extracted from
        - `relationshipKey` key under which the value for the relationship is
          extracted from the resourceHash
        - `relationshipMeta` meta information about the relationship
       @method extractPolymorphicRelationship
      @param {Object} relationshipModelName
      @param {Object} relationshipHash
      @param {Object} relationshipOptions
      @return {Object}
    */
    extractPolymorphicRelationship: function extractPolymorphicRelationship(relationshipModelName, relationshipHash, relationshipOptions) {
      return this.extractRelationship(relationshipModelName, relationshipHash);
    },

    /**
      Returns the resource's relationships formatted as a JSON-API "relationships object".
       http://jsonapi.org/format/#document-resource-object-relationships
       @method extractRelationships
      @param {Object} modelClass
      @param {Object} resourceHash
      @return {Object}
    */
    extractRelationships: function extractRelationships(modelClass, resourceHash) {
      var _this3 = this;

      var relationships = {};

      modelClass.eachRelationship(function (key, relationshipMeta) {
        var relationship = null;
        var relationshipKey = _this3.keyForRelationship(key, relationshipMeta.kind, 'deserialize');
        if (resourceHash[relationshipKey] !== undefined) {
          var data = null;
          var relationshipHash = resourceHash[relationshipKey];
          if (relationshipMeta.kind === 'belongsTo') {
            if (relationshipMeta.options.polymorphic) {
              // extracting a polymorphic belongsTo may need more information
              // than the type and the hash (which might only be an id) for the
              // relationship, hence we pass the key, resource and
              // relationshipMeta too
              data = _this3.extractPolymorphicRelationship(relationshipMeta.type, relationshipHash, { key: key, resourceHash: resourceHash, relationshipMeta: relationshipMeta });
            } else {
              data = _this3.extractRelationship(relationshipMeta.type, relationshipHash);
            }
          } else if (relationshipMeta.kind === 'hasMany') {
            if (!_ember['default'].isNone(relationshipHash)) {
              data = new Array(relationshipHash.length);
              for (var i = 0, l = relationshipHash.length; i < l; i++) {
                var item = relationshipHash[i];
                data[i] = _this3.extractRelationship(relationshipMeta.type, item);
              }
            }
          }
          relationship = { data: data };
        }

        var linkKey = _this3.keyForLink(key, relationshipMeta.kind);
        if (resourceHash.links && resourceHash.links[linkKey] !== undefined) {
          var related = resourceHash.links[linkKey];
          relationship = relationship || {};
          relationship.links = { related: related };
        }

        if (relationship) {
          relationships[key] = relationship;
        }
      });

      return relationships;
    },

    /**
      @method modelNameFromPayloadKey
      @param {String} key
      @return {String} the model's modelName
    */
    // TODO @deprecated Use modelNameFromPayloadType instead
    modelNameFromPayloadKey: function modelNameFromPayloadKey(key) {
      return (0, _emberDataPrivateSystemNormalizeModelName['default'])(key);
    },

    /**
      @method normalizeAttributes
      @private
    */
    normalizeAttributes: function normalizeAttributes(typeClass, hash) {
      var _this4 = this;

      var payloadKey;

      if (this.keyForAttribute) {
        typeClass.eachAttribute(function (key) {
          payloadKey = _this4.keyForAttribute(key, 'deserialize');
          if (key === payloadKey) {
            return;
          }
          if (hash[payloadKey] === undefined) {
            return;
          }

          hash[key] = hash[payloadKey];
          delete hash[payloadKey];
        });
      }
    },

    /**
      @method normalizeRelationships
      @private
    */
    normalizeRelationships: function normalizeRelationships(typeClass, hash) {
      var _this5 = this;

      var payloadKey;

      if (this.keyForRelationship) {
        typeClass.eachRelationship(function (key, relationship) {
          payloadKey = _this5.keyForRelationship(key, relationship.kind, 'deserialize');
          if (key === payloadKey) {
            return;
          }
          if (hash[payloadKey] === undefined) {
            return;
          }

          hash[key] = hash[payloadKey];
          delete hash[payloadKey];
        });
      }
    },

    /**
      @method normalizeUsingDeclaredMapping
      @private
    */
    normalizeUsingDeclaredMapping: function normalizeUsingDeclaredMapping(modelClass, hash) {
      var attrs = get(this, 'attrs');
      var normalizedKey, payloadKey, key;

      if (attrs) {
        for (key in attrs) {
          normalizedKey = payloadKey = this._getMappedKey(key, modelClass);

          if (hash[payloadKey] === undefined) {
            continue;
          }

          if (get(modelClass, 'attributes').has(key)) {
            normalizedKey = this.keyForAttribute(key);
          }

          if (get(modelClass, 'relationshipsByName').has(key)) {
            normalizedKey = this.keyForRelationship(key);
          }

          if (payloadKey !== normalizedKey) {
            hash[normalizedKey] = hash[payloadKey];
            delete hash[payloadKey];
          }
        }
      }
    },

    /**
      Looks up the property key that was set by the custom `attr` mapping
      passed to the serializer.
       @method _getMappedKey
      @private
      @param {String} key
      @return {String} key
    */
    _getMappedKey: function _getMappedKey(key, modelClass) {
      (0, _emberDataPrivateDebug.warn)('There is no attribute or relationship with the name `' + key + '` on `' + modelClass.modelName + '`. Check your serializers attrs hash.', get(modelClass, 'attributes').has(key) || get(modelClass, 'relationshipsByName').has(key), {
        id: 'ds.serializer.no-mapped-attrs-key'
      });

      var attrs = get(this, 'attrs');
      var mappedKey;
      if (attrs && attrs[key]) {
        mappedKey = attrs[key];
        //We need to account for both the { title: 'post_title' } and
        //{ title: { key: 'post_title' }} forms
        if (mappedKey.key) {
          mappedKey = mappedKey.key;
        }
        if (typeof mappedKey === 'string') {
          key = mappedKey;
        }
      }

      return key;
    },

    /**
      Check attrs.key.serialize property to inform if the `key`
      can be serialized
       @method _canSerialize
      @private
      @param {String} key
      @return {boolean} true if the key can be serialized
    */
    _canSerialize: function _canSerialize(key) {
      var attrs = get(this, 'attrs');

      return !attrs || !attrs[key] || attrs[key].serialize !== false;
    },

    /**
      When attrs.key.serialize is set to true then
      it takes priority over the other checks and the related
      attribute/relationship will be serialized
       @method _mustSerialize
      @private
      @param {String} key
      @return {boolean} true if the key must be serialized
    */
    _mustSerialize: function _mustSerialize(key) {
      var attrs = get(this, 'attrs');

      return attrs && attrs[key] && attrs[key].serialize === true;
    },

    /**
      Check if the given hasMany relationship should be serialized
       @method shouldSerializeHasMany
      @param {DS.Snapshot} snapshot
      @param {String} key
      @param {String} relationshipType
      @return {boolean} true if the hasMany relationship should be serialized
    */

    shouldSerializeHasMany: function shouldSerializeHasMany(snapshot, key, relationship) {
      if (this._shouldSerializeHasMany !== JSONSerializer.prototype._shouldSerializeHasMany) {
        (0, _emberDataPrivateDebug.deprecate)('The private method _shouldSerializeHasMany has been promoted to the public API. Please remove the underscore to use the public shouldSerializeHasMany method.', false, {
          id: 'ds.serializer.private-should-serialize-has-many',
          until: '3.0.0'
        });
      }

      return this._shouldSerializeHasMany(snapshot, key, relationship);
    },

    /**
      Check if the given hasMany relationship should be serialized
       @method _shouldSerializeHasMany
      @private
      @param {DS.Snapshot} snapshot
      @param {String} key
      @param {String} relationshipType
      @return {boolean} true if the hasMany relationship should be serialized
    */
    _shouldSerializeHasMany: function _shouldSerializeHasMany(snapshot, key, relationship) {
      var relationshipType = snapshot.type.determineRelationshipType(relationship, this.store);
      if (this._mustSerialize(key)) {
        return true;
      }
      return this._canSerialize(key) && (relationshipType === 'manyToNone' || relationshipType === 'manyToMany');
    },

    // SERIALIZE
    /**
      Called when a record is saved in order to convert the
      record into JSON.
       By default, it creates a JSON object with a key for
      each attribute and belongsTo relationship.
       For example, consider this model:
       ```app/models/comment.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        title: DS.attr(),
        body: DS.attr(),
         author: DS.belongsTo('user')
      });
      ```
       The default serialization would create a JSON object like:
       ```javascript
      {
        "title": "Rails is unagi",
        "body": "Rails? Omakase? O_O",
        "author": 12
      }
      ```
       By default, attributes are passed through as-is, unless
      you specified an attribute type (`DS.attr('date')`). If
      you specify a transform, the JavaScript value will be
      serialized when inserted into the JSON hash.
       By default, belongs-to relationships are converted into
      IDs when inserted into the JSON hash.
       ## IDs
       `serialize` takes an options hash with a single option:
      `includeId`. If this option is `true`, `serialize` will,
      by default include the ID in the JSON object it builds.
       The adapter passes in `includeId: true` when serializing
      a record for `createRecord`, but not for `updateRecord`.
       ## Customization
       Your server may expect a different JSON format than the
      built-in serialization format.
       In that case, you can implement `serialize` yourself and
      return a JSON hash of your choosing.
       ```app/serializers/post.js
      import DS from 'ember-data';
       export default DS.JSONSerializer.extend({
        serialize: function(snapshot, options) {
          var json = {
            POST_TTL: snapshot.attr('title'),
            POST_BDY: snapshot.attr('body'),
            POST_CMS: snapshot.hasMany('comments', { ids: true })
          }
           if (options.includeId) {
            json.POST_ID_ = snapshot.id;
          }
           return json;
        }
      });
      ```
       ## Customizing an App-Wide Serializer
       If you want to define a serializer for your entire
      application, you'll probably want to use `eachAttribute`
      and `eachRelationship` on the record.
       ```app/serializers/application.js
      import DS from 'ember-data';
       export default DS.JSONSerializer.extend({
        serialize: function(snapshot, options) {
          var json = {};
           snapshot.eachAttribute(function(name) {
            json[serverAttributeName(name)] = snapshot.attr(name);
          })
           snapshot.eachRelationship(function(name, relationship) {
            if (relationship.kind === 'hasMany') {
              json[serverHasManyName(name)] = snapshot.hasMany(name, { ids: true });
            }
          });
           if (options.includeId) {
            json.ID_ = snapshot.id;
          }
           return json;
        }
      });
       function serverAttributeName(attribute) {
        return attribute.underscore().toUpperCase();
      }
       function serverHasManyName(name) {
        return serverAttributeName(name.singularize()) + "_IDS";
      }
      ```
       This serializer will generate JSON that looks like this:
       ```javascript
      {
        "TITLE": "Rails is omakase",
        "BODY": "Yep. Omakase.",
        "COMMENT_IDS": [ 1, 2, 3 ]
      }
      ```
       ## Tweaking the Default JSON
       If you just want to do some small tweaks on the default JSON,
      you can call super first and make the tweaks on the returned
      JSON.
       ```app/serializers/post.js
      import DS from 'ember-data';
       export default DS.JSONSerializer.extend({
        serialize: function(snapshot, options) {
          var json = this._super.apply(this, arguments);
           json.subject = json.title;
          delete json.title;
           return json;
        }
      });
      ```
       @method serialize
      @param {DS.Snapshot} snapshot
      @param {Object} options
      @return {Object} json
    */
    serialize: function serialize(snapshot, options) {
      var _this6 = this;

      var json = {};

      if (options && options.includeId) {
        var id = snapshot.id;

        if (id) {
          json[get(this, 'primaryKey')] = id;
        }
      }

      snapshot.eachAttribute(function (key, attribute) {
        _this6.serializeAttribute(snapshot, json, key, attribute);
      });

      snapshot.eachRelationship(function (key, relationship) {
        if (relationship.kind === 'belongsTo') {
          _this6.serializeBelongsTo(snapshot, json, relationship);
        } else if (relationship.kind === 'hasMany') {
          _this6.serializeHasMany(snapshot, json, relationship);
        }
      });

      return json;
    },

    /**
      You can use this method to customize how a serialized record is added to the complete
      JSON hash to be sent to the server. By default the JSON Serializer does not namespace
      the payload and just sends the raw serialized JSON object.
      If your server expects namespaced keys, you should consider using the RESTSerializer.
      Otherwise you can override this method to customize how the record is added to the hash.
      The hash property should be modified by reference.
       For example, your server may expect underscored root objects.
       ```app/serializers/application.js
      import DS from 'ember-data';
       export default DS.RESTSerializer.extend({
        serializeIntoHash: function(data, type, snapshot, options) {
          var root = Ember.String.decamelize(type.modelName);
          data[root] = this.serialize(snapshot, options);
        }
      });
      ```
       @method serializeIntoHash
      @param {Object} hash
      @param {DS.Model} typeClass
      @param {DS.Snapshot} snapshot
      @param {Object} options
    */
    serializeIntoHash: function serializeIntoHash(hash, typeClass, snapshot, options) {
      assign(hash, this.serialize(snapshot, options));
    },

    /**
     `serializeAttribute` can be used to customize how `DS.attr`
     properties are serialized
      For example if you wanted to ensure all your attributes were always
     serialized as properties on an `attributes` object you could
     write:
      ```app/serializers/application.js
     import DS from 'ember-data';
      export default DS.JSONSerializer.extend({
       serializeAttribute: function(snapshot, json, key, attributes) {
         json.attributes = json.attributes || {};
         this._super(snapshot, json.attributes, key, attributes);
       }
     });
     ```
      @method serializeAttribute
     @param {DS.Snapshot} snapshot
     @param {Object} json
     @param {String} key
     @param {Object} attribute
    */
    serializeAttribute: function serializeAttribute(snapshot, json, key, attribute) {
      var type = attribute.type;

      if (this._canSerialize(key)) {
        var value = snapshot.attr(key);
        if (type) {
          var transform = this.transformFor(type);
          value = transform.serialize(value, attribute.options);
        }

        // if provided, use the mapping provided by `attrs` in
        // the serializer
        var payloadKey = this._getMappedKey(key, snapshot.type);

        if (payloadKey === key && this.keyForAttribute) {
          payloadKey = this.keyForAttribute(key, 'serialize');
        }

        json[payloadKey] = value;
      }
    },

    /**
     `serializeBelongsTo` can be used to customize how `DS.belongsTo`
     properties are serialized.
      Example
      ```app/serializers/post.js
     import DS from 'ember-data';
      export default DS.JSONSerializer.extend({
       serializeBelongsTo: function(snapshot, json, relationship) {
         var key = relationship.key;
          var belongsTo = snapshot.belongsTo(key);
          key = this.keyForRelationship ? this.keyForRelationship(key, "belongsTo", "serialize") : key;
          json[key] = Ember.isNone(belongsTo) ? belongsTo : belongsTo.record.toJSON();
       }
     });
     ```
      @method serializeBelongsTo
     @param {DS.Snapshot} snapshot
     @param {Object} json
     @param {Object} relationship
    */
    serializeBelongsTo: function serializeBelongsTo(snapshot, json, relationship) {
      var key = relationship.key;

      if (this._canSerialize(key)) {
        var belongsToId = snapshot.belongsTo(key, { id: true });

        // if provided, use the mapping provided by `attrs` in
        // the serializer
        var payloadKey = this._getMappedKey(key, snapshot.type);
        if (payloadKey === key && this.keyForRelationship) {
          payloadKey = this.keyForRelationship(key, "belongsTo", "serialize");
        }

        //Need to check whether the id is there for new&async records
        if (isNone(belongsToId)) {
          json[payloadKey] = null;
        } else {
          json[payloadKey] = belongsToId;
        }

        if (relationship.options.polymorphic) {
          this.serializePolymorphicType(snapshot, json, relationship);
        }
      }
    },

    /**
     `serializeHasMany` can be used to customize how `DS.hasMany`
     properties are serialized.
      Example
      ```app/serializers/post.js
     import DS from 'ember-data';
      export default DS.JSONSerializer.extend({
       serializeHasMany: function(snapshot, json, relationship) {
         var key = relationship.key;
         if (key === 'comments') {
           return;
         } else {
           this._super.apply(this, arguments);
         }
       }
     });
     ```
      @method serializeHasMany
     @param {DS.Snapshot} snapshot
     @param {Object} json
     @param {Object} relationship
    */
    serializeHasMany: function serializeHasMany(snapshot, json, relationship) {
      var key = relationship.key;
      var shouldSerializeHasMany = '_shouldSerializeHasMany';
      if (false) {
        shouldSerializeHasMany = 'shouldSerializeHasMany';
      }

      if (this[shouldSerializeHasMany](snapshot, key, relationship)) {
        var hasMany = snapshot.hasMany(key, { ids: true });
        if (hasMany !== undefined) {
          // if provided, use the mapping provided by `attrs` in
          // the serializer
          var payloadKey = this._getMappedKey(key, snapshot.type);
          if (payloadKey === key && this.keyForRelationship) {
            payloadKey = this.keyForRelationship(key, "hasMany", "serialize");
          }

          json[payloadKey] = hasMany;
          // TODO support for polymorphic manyToNone and manyToMany relationships
        }
      }
    },

    /**
      You can use this method to customize how polymorphic objects are
      serialized. Objects are considered to be polymorphic if
      `{ polymorphic: true }` is pass as the second argument to the
      `DS.belongsTo` function.
       Example
       ```app/serializers/comment.js
      import DS from 'ember-data';
       export default DS.JSONSerializer.extend({
        serializePolymorphicType: function(snapshot, json, relationship) {
          var key = relationship.key,
              belongsTo = snapshot.belongsTo(key);
          key = this.keyForAttribute ? this.keyForAttribute(key, "serialize") : key;
           if (Ember.isNone(belongsTo)) {
            json[key + "_type"] = null;
          } else {
            json[key + "_type"] = belongsTo.modelName;
          }
        }
      });
      ```
       @method serializePolymorphicType
      @param {DS.Snapshot} snapshot
      @param {Object} json
      @param {Object} relationship
    */
    serializePolymorphicType: _ember['default'].K,

    /**
      `extractMeta` is used to deserialize any meta information in the
      adapter payload. By default Ember Data expects meta information to
      be located on the `meta` property of the payload object.
       Example
       ```app/serializers/post.js
      import DS from 'ember-data';
       export default DS.JSONSerializer.extend({
        extractMeta: function(store, typeClass, payload) {
          if (payload && payload.hasOwnProperty('_pagination')) {
            let meta = payload._pagination;
            delete payload._pagination;
            return meta;
          }
        }
      });
      ```
       @method extractMeta
      @param {DS.Store} store
      @param {DS.Model} modelClass
      @param {Object} payload
    */
    extractMeta: function extractMeta(store, modelClass, payload) {
      if (payload && payload['meta'] !== undefined) {
        var meta = payload.meta;
        delete payload.meta;
        return meta;
      }
    },

    /**
      `extractErrors` is used to extract model errors when a call
      to `DS.Model#save` fails with an `InvalidError`. By default
      Ember Data expects error information to be located on the `errors`
      property of the payload object.
       This serializer expects this `errors` object to be an Array similar
      to the following, compliant with the JSON-API specification:
       ```js
      {
        "errors": [
          {
            "detail": "This username is already taken!",
            "source": {
              "pointer": "data/attributes/username"
            }
          }, {
            "detail": "Doesn't look like a valid email.",
            "source": {
              "pointer": "data/attributes/email"
            }
          }
        ]
      }
      ```
       The key `detail` provides a textual description of the problem.
      Alternatively, the key `title` can be used for the same purpose.
       The nested keys `source.pointer` detail which specific element
      of the request data was invalid.
       Note that JSON-API also allows for object-level errors to be placed
      in an object with pointer `data`, signifying that the problem
      cannot be traced to a specific attribute:
       ```javascript
      {
        "errors": [
          {
            "detail": "Some generic non property error message",
            "source": {
              "pointer": "data"
            }
          }
        ]
      }
      ```
       When turn into a `DS.Errors` object, you can read these errors
      through the property `base`:
       ```handlebars
      {{#each model.errors.base as |error|}}
        <div class="error">
          {{error.message}}
        </div>
      {{/each}}
      ```
       Example of alternative implementation, overriding the default
      behavior to deal with a different format of errors:
       ```app/serializers/post.js
      import DS from 'ember-data';
       export default DS.JSONSerializer.extend({
        extractErrors: function(store, typeClass, payload, id) {
          if (payload && typeof payload === 'object' && payload._problems) {
            payload = payload._problems;
            this.normalizeErrors(typeClass, payload);
          }
          return payload;
        }
      });
      ```
       @method extractErrors
      @param {DS.Store} store
      @param {DS.Model} typeClass
      @param {Object} payload
      @param {(String|Number)} id
      @return {Object} json The deserialized errors
    */
    extractErrors: function extractErrors(store, typeClass, payload, id) {
      var _this7 = this;

      if (payload && typeof payload === 'object' && payload.errors) {
        payload = (0, _emberDataAdaptersErrors.errorsArrayToHash)(payload.errors);

        this.normalizeUsingDeclaredMapping(typeClass, payload);

        typeClass.eachAttribute(function (name) {
          var key = _this7.keyForAttribute(name, 'deserialize');
          if (key !== name && payload[key] !== undefined) {
            payload[name] = payload[key];
            delete payload[key];
          }
        });

        typeClass.eachRelationship(function (name) {
          var key = _this7.keyForRelationship(name, 'deserialize');
          if (key !== name && payload[key] !== undefined) {
            payload[name] = payload[key];
            delete payload[key];
          }
        });
      }

      return payload;
    },

    /**
     `keyForAttribute` can be used to define rules for how to convert an
     attribute name in your model to a key in your JSON.
      Example
      ```app/serializers/application.js
     import DS from 'ember-data';
      export default DS.RESTSerializer.extend({
       keyForAttribute: function(attr, method) {
         return Ember.String.underscore(attr).toUpperCase();
       }
     });
     ```
      @method keyForAttribute
     @param {String} key
     @param {String} method
     @return {String} normalized key
    */
    keyForAttribute: function keyForAttribute(key, method) {
      return key;
    },

    /**
     `keyForRelationship` can be used to define a custom key when
     serializing and deserializing relationship properties. By default
     `JSONSerializer` does not provide an implementation of this method.
      Example
       ```app/serializers/post.js
      import DS from 'ember-data';
       export default DS.JSONSerializer.extend({
        keyForRelationship: function(key, relationship, method) {
          return 'rel_' + Ember.String.underscore(key);
        }
      });
      ```
      @method keyForRelationship
     @param {String} key
     @param {String} typeClass
     @param {String} method
     @return {String} normalized key
    */
    keyForRelationship: function keyForRelationship(key, typeClass, method) {
      return key;
    },

    /**
     `keyForLink` can be used to define a custom key when deserializing link
     properties.
      @method keyForLink
     @param {String} key
     @param {String} kind `belongsTo` or `hasMany`
     @return {String} normalized key
    */
    keyForLink: function keyForLink(key, kind) {
      return key;
    },

    // HELPERS

    /**
     @method transformFor
     @private
     @param {String} attributeType
     @param {Boolean} skipAssertion
     @return {DS.Transform} transform
    */
    transformFor: function transformFor(attributeType, skipAssertion) {
      var transform = (0, _emberDataPrivateUtils.getOwner)(this).lookup('transform:' + attributeType);

      (0, _emberDataPrivateDebug.assert)("Unable to find transform for '" + attributeType + "'", skipAssertion || !!transform);

      return transform;
    }
  });

  if (false) {

    JSONSerializer.reopen({

      /**
        @method modelNameFromPayloadType
        @public
        @param {String} type
        @return {String} the model's modelName
        */
      modelNameFromPayloadType: function modelNameFromPayloadType(type) {
        return (0, _emberDataPrivateSystemNormalizeModelName['default'])(type);
      },

      _hasCustomModelNameFromPayloadKey: function _hasCustomModelNameFromPayloadKey() {
        return this.modelNameFromPayloadKey !== JSONSerializer.prototype.modelNameFromPayloadKey;
      }

    });
  }

  exports['default'] = JSONSerializer;
});
define("ember-data/serializers/rest", ["exports", "ember", "ember-data/-private/debug", "ember-data/serializers/json", "ember-data/-private/system/normalize-model-name", "ember-inflector", "ember-data/-private/system/coerce-id", "ember-data/-private/utils", "ember-data/-private/features"], function (exports, _ember, _emberDataPrivateDebug, _emberDataSerializersJson, _emberDataPrivateSystemNormalizeModelName, _emberInflector, _emberDataPrivateSystemCoerceId, _emberDataPrivateUtils, _emberDataPrivateFeatures) {
  "use strict";

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];return arr2;
    } else {
      return Array.from(arr);
    }
  }

  /**
    @module ember-data
  */

  var camelize = _ember["default"].String.camelize;

  /**
    Normally, applications will use the `RESTSerializer` by implementing
    the `normalize` method.
  
    This allows you to do whatever kind of munging you need, and is
    especially useful if your server is inconsistent and you need to
    do munging differently for many different kinds of responses.
  
    See the `normalize` documentation for more information.
  
    ## Across the Board Normalization
  
    There are also a number of hooks that you might find useful to define
    across-the-board rules for your payload. These rules will be useful
    if your server is consistent, or if you're building an adapter for
    an infrastructure service, like Firebase, and want to encode service
    conventions.
  
    For example, if all of your keys are underscored and all-caps, but
    otherwise consistent with the names you use in your models, you
    can implement across-the-board rules for how to convert an attribute
    name in your model to a key in your JSON.
  
    ```app/serializers/application.js
    import DS from 'ember-data';
  
    export default DS.RESTSerializer.extend({
      keyForAttribute: function(attr, method) {
        return Ember.String.underscore(attr).toUpperCase();
      }
    });
    ```
  
    You can also implement `keyForRelationship`, which takes the name
    of the relationship as the first parameter, the kind of
    relationship (`hasMany` or `belongsTo`) as the second parameter, and
    the method (`serialize` or `deserialize`) as the third parameter.
  
    @class RESTSerializer
    @namespace DS
    @extends DS.JSONSerializer
  */
  var RESTSerializer = _emberDataSerializersJson["default"].extend({

    /**
     `keyForPolymorphicType` can be used to define a custom key when
     serializing and deserializing a polymorphic type. By default, the
     returned key is `${key}Type`.
      Example
       ```app/serializers/post.js
      import DS from 'ember-data';
       export default DS.RESTSerializer.extend({
        keyForPolymorphicType: function(key, relationship) {
          var relationshipKey = this.keyForRelationship(key);
           return 'type-' + relationshipKey;
        }
      });
      ```
      @method keyForPolymorphicType
     @param {String} key
     @param {String} typeClass
     @param {String} method
     @return {String} normalized key
    */
    keyForPolymorphicType: function keyForPolymorphicType(key, typeClass, method) {
      var relationshipKey = this.keyForRelationship(key);

      return relationshipKey + "Type";
    },

    /**
      Normalizes a part of the JSON payload returned by
      the server. You should override this method, munge the hash
      and call super if you have generic normalization to do.
       It takes the type of the record that is being normalized
      (as a DS.Model class), the property where the hash was
      originally found, and the hash to normalize.
       For example, if you have a payload that looks like this:
       ```js
      {
        "post": {
          "id": 1,
          "title": "Rails is omakase",
          "comments": [ 1, 2 ]
        },
        "comments": [{
          "id": 1,
          "body": "FIRST"
        }, {
          "id": 2,
          "body": "Rails is unagi"
        }]
      }
      ```
       The `normalize` method will be called three times:
       * With `App.Post`, `"posts"` and `{ id: 1, title: "Rails is omakase", ... }`
      * With `App.Comment`, `"comments"` and `{ id: 1, body: "FIRST" }`
      * With `App.Comment`, `"comments"` and `{ id: 2, body: "Rails is unagi" }`
       You can use this method, for example, to normalize underscored keys to camelized
      or other general-purpose normalizations. You will only need to implement
      `normalize` and manipulate the payload as desired.
       For example, if the `IDs` under `"comments"` are provided as `_id` instead of
      `id`, you can specify how to normalize just the comments:
       ```app/serializers/post.js
      import DS from 'ember-data';
       export default DS.RESTSerializer.extend({
        normalize(model, hash, prop) {
          if (prop === 'comments') {
            hash.id = hash._id;
            delete hash._id;
          }
           return this._super(...arguments);
        }
      });
      ```
       On each call to the `normalize` method, the third parameter (`prop`) is always
      one of the keys that were in the original payload or in the result of another
      normalization as `normalizeResponse`.
       @method normalize
      @param {DS.Model} modelClass
      @param {Object} resourceHash
      @param {String} prop
      @return {Object}
    */
    normalize: function normalize(modelClass, resourceHash, prop) {
      if (this.normalizeHash && this.normalizeHash[prop]) {
        (0, _emberDataPrivateDebug.deprecate)('`RESTSerializer.normalizeHash` has been deprecated. Please use `serializer.normalize` to modify the payload of single resources.', false, {
          id: 'ds.serializer.normalize-hash-deprecated',
          until: '3.0.0'
        });
        this.normalizeHash[prop](resourceHash);
      }
      return this._super(modelClass, resourceHash);
    },

    /**
      Normalizes an array of resource payloads and returns a JSON-API Document
      with primary data and, if any, included data as `{ data, included }`.
       @method _normalizeArray
      @param {DS.Store} store
      @param {String} modelName
      @param {Object} arrayHash
      @param {String} prop
      @return {Object}
      @private
    */
    _normalizeArray: function _normalizeArray(store, modelName, arrayHash, prop) {
      var _this = this;

      var documentHash = {
        data: [],
        included: []
      };

      var modelClass = store.modelFor(modelName);
      var serializer = store.serializerFor(modelName);

      _ember["default"].makeArray(arrayHash).forEach(function (hash) {
        var _normalizePolymorphicRecord2 = _this._normalizePolymorphicRecord(store, hash, prop, modelClass, serializer);

        var data = _normalizePolymorphicRecord2.data;
        var included = _normalizePolymorphicRecord2.included;

        documentHash.data.push(data);
        if (included) {
          var _documentHash$included;

          (_documentHash$included = documentHash.included).push.apply(_documentHash$included, _toConsumableArray(included));
        }
      });

      return documentHash;
    },

    _normalizePolymorphicRecord: function _normalizePolymorphicRecord(store, hash, prop, primaryModelClass, primarySerializer) {
      var serializer = primarySerializer;
      var modelClass = primaryModelClass;

      var primaryHasTypeAttribute = (0, _emberDataPrivateUtils.modelHasAttributeOrRelationshipNamedType)(primaryModelClass);

      if (!primaryHasTypeAttribute && hash.type) {
        // Support polymorphic records in async relationships
        var modelName = undefined;
        if (false) {
          modelName = this.modelNameFromPayloadType(hash.type);
          var deprecatedModelNameLookup = this.modelNameFromPayloadKey(hash.type);

          if (modelName !== deprecatedModelNameLookup && !this._hasCustomModelNameFromPayloadType() && this._hasCustomModelNameFromPayloadKey()) {
            (0, _emberDataPrivateDebug.deprecate)("You are using modelNameFromPayloadKey to normalize the type for a polymorphic relationship. This is has been deprecated in favor of modelNameFromPayloadType", false, {
              id: 'ds.rest-serializer.deprecated-model-name-for-polymorphic-type',
              until: '3.0.0'
            });

            modelName = deprecatedModelNameLookup;
          }
        } else {
          modelName = this.modelNameFromPayloadKey(hash.type);
        }

        if (store._hasModelFor(modelName)) {
          serializer = store.serializerFor(modelName);
          modelClass = store.modelFor(modelName);
        }
      }

      return serializer.normalize(modelClass, hash, prop);
    },

    /*
      @method _normalizeResponse
      @param {DS.Store} store
      @param {DS.Model} primaryModelClass
      @param {Object} payload
      @param {String|Number} id
      @param {String} requestType
      @param {Boolean} isSingle
      @return {Object} JSON-API Document
      @private
    */
    _normalizeResponse: function _normalizeResponse(store, primaryModelClass, payload, id, requestType, isSingle) {
      var documentHash = {
        data: null,
        included: []
      };

      var meta = this.extractMeta(store, primaryModelClass, payload);
      if (meta) {
        (0, _emberDataPrivateDebug.assert)('The `meta` returned from `extractMeta` has to be an object, not "' + _ember["default"].typeOf(meta) + '".', _ember["default"].typeOf(meta) === 'object');
        documentHash.meta = meta;
      }

      var keys = Object.keys(payload);

      for (var i = 0, _length = keys.length; i < _length; i++) {
        var prop = keys[i];
        var modelName = prop;
        var forcedSecondary = false;

        /*
          If you want to provide sideloaded records of the same type that the
          primary data you can do that by prefixing the key with `_`.
           Example
           ```
          {
            users: [
              { id: 1, title: 'Tom', manager: 3 },
              { id: 2, title: 'Yehuda', manager: 3 }
            ],
            _users: [
              { id: 3, title: 'Tomster' }
            ]
          }
          ```
           This forces `_users` to be added to `included` instead of `data`.
         */
        if (prop.charAt(0) === '_') {
          forcedSecondary = true;
          modelName = prop.substr(1);
        }

        var typeName = this.modelNameFromPayloadKey(modelName);
        if (!store.modelFactoryFor(typeName)) {
          (0, _emberDataPrivateDebug.warn)(this.warnMessageNoModelForKey(modelName, typeName), false, {
            id: 'ds.serializer.model-for-key-missing'
          });
          continue;
        }

        var isPrimary = !forcedSecondary && this.isPrimaryType(store, typeName, primaryModelClass);
        var value = payload[prop];

        if (value === null) {
          continue;
        }

        (0, _emberDataPrivateDebug.runInDebug)(function () {
          var isQueryRecordAnArray = requestType === 'queryRecord' && isPrimary && Array.isArray(value);
          var message = "The adapter returned an array for the primary data of a `queryRecord` response. This is deprecated as `queryRecord` should return a single record.";

          (0, _emberDataPrivateDebug.deprecate)(message, !isQueryRecordAnArray, {
            id: 'ds.serializer.rest.queryRecord-array-response',
            until: '3.0'
          });
        });

        /*
          Support primary data as an object instead of an array.
           Example
           ```
          {
            user: { id: 1, title: 'Tom', manager: 3 }
          }
          ```
         */
        if (isPrimary && _ember["default"].typeOf(value) !== 'array') {
          var _normalizePolymorphicRecord3 = this._normalizePolymorphicRecord(store, value, prop, primaryModelClass, this);

          var _data = _normalizePolymorphicRecord3.data;
          var _included = _normalizePolymorphicRecord3.included;

          documentHash.data = _data;
          if (_included) {
            var _documentHash$included2;

            (_documentHash$included2 = documentHash.included).push.apply(_documentHash$included2, _toConsumableArray(_included));
          }
          continue;
        }

        var _normalizeArray2 = this._normalizeArray(store, typeName, value, prop);

        var data = _normalizeArray2.data;
        var included = _normalizeArray2.included;

        if (included) {
          var _documentHash$included3;

          (_documentHash$included3 = documentHash.included).push.apply(_documentHash$included3, _toConsumableArray(included));
        }

        if (isSingle) {
          data.forEach(function (resource) {

            /*
              Figures out if this is the primary record or not.
               It's either:
               1. The record with the same ID as the original request
              2. If it's a newly created record without an ID, the first record
                 in the array
             */
            var isUpdatedRecord = isPrimary && (0, _emberDataPrivateSystemCoerceId["default"])(resource.id) === id;
            var isFirstCreatedRecord = isPrimary && !id && !documentHash.data;

            if (isFirstCreatedRecord || isUpdatedRecord) {
              documentHash.data = resource;
            } else {
              documentHash.included.push(resource);
            }
          });
        } else {
          if (isPrimary) {
            documentHash.data = data;
          } else {
            if (data) {
              var _documentHash$included4;

              (_documentHash$included4 = documentHash.included).push.apply(_documentHash$included4, _toConsumableArray(data));
            }
          }
        }
      }

      return documentHash;
    },

    isPrimaryType: function isPrimaryType(store, typeName, primaryTypeClass) {
      var typeClass = store.modelFor(typeName);
      return typeClass.modelName === primaryTypeClass.modelName;
    },

    /**
      This method allows you to push a payload containing top-level
      collections of records organized per type.
       ```js
      {
        "posts": [{
          "id": "1",
          "title": "Rails is omakase",
          "author", "1",
          "comments": [ "1" ]
        }],
        "comments": [{
          "id": "1",
          "body": "FIRST"
        }],
        "users": [{
          "id": "1",
          "name": "@d2h"
        }]
      }
      ```
       It will first normalize the payload, so you can use this to push
      in data streaming in from your server structured the same way
      that fetches and saves are structured.
       @method pushPayload
      @param {DS.Store} store
      @param {Object} payload
    */
    pushPayload: function pushPayload(store, payload) {
      var documentHash = {
        data: [],
        included: []
      };

      for (var prop in payload) {
        var modelName = this.modelNameFromPayloadKey(prop);
        if (!store.modelFactoryFor(modelName)) {
          (0, _emberDataPrivateDebug.warn)(this.warnMessageNoModelForKey(prop, modelName), false, {
            id: 'ds.serializer.model-for-key-missing'
          });
          continue;
        }
        var type = store.modelFor(modelName);
        var typeSerializer = store.serializerFor(type.modelName);

        _ember["default"].makeArray(payload[prop]).forEach(function (hash) {
          var _typeSerializer$normalize = typeSerializer.normalize(type, hash, prop);

          var data = _typeSerializer$normalize.data;
          var included = _typeSerializer$normalize.included;

          documentHash.data.push(data);
          if (included) {
            var _documentHash$included5;

            (_documentHash$included5 = documentHash.included).push.apply(_documentHash$included5, _toConsumableArray(included));
          }
        });
      }

      if (false) {
        return store.push(documentHash);
      } else {
        store.push(documentHash);
      }
    },

    /**
      This method is used to convert each JSON root key in the payload
      into a modelName that it can use to look up the appropriate model for
      that part of the payload.
       For example, your server may send a model name that does not correspond with
      the name of the model in your app. Let's take a look at an example model,
      and an example payload:
       ```app/models/post.js
      import DS from 'ember-data';
       export default DS.Model.extend({
      });
      ```
       ```javascript
        {
          "blog/post": {
            "id": "1
          }
        }
      ```
       Ember Data is going to normalize the payload's root key for the modelName. As a result,
      it will try to look up the "blog/post" model. Since we don't have a model called "blog/post"
      (or a file called app/models/blog/post.js in ember-cli), Ember Data will throw an error
      because it cannot find the "blog/post" model.
       Since we want to remove this namespace, we can define a serializer for the application that will
      remove "blog/" from the payload key whenver it's encountered by Ember Data:
       ```app/serializers/application.js
      import DS from 'ember-data';
       export default DS.RESTSerializer.extend({
        modelNameFromPayloadKey: function(payloadKey) {
          if (payloadKey === 'blog/post') {
            return this._super(payloadKey.replace('blog/', ''));
          } else {
           return this._super(payloadKey);
          }
        }
      });
      ```
       After refreshing, Ember Data will appropriately look up the "post" model.
       By default the modelName for a model is its
      name in dasherized form. This means that a payload key like "blogPost" would be
      normalized to "blog-post" when Ember Data looks up the model. Usually, Ember Data
      can use the correct inflection to do this for you. Most of the time, you won't
      need to override `modelNameFromPayloadKey` for this purpose.
       @method modelNameFromPayloadKey
      @param {String} key
      @return {String} the model's modelName
    */
    modelNameFromPayloadKey: function modelNameFromPayloadKey(key) {
      return (0, _emberInflector.singularize)((0, _emberDataPrivateSystemNormalizeModelName["default"])(key));
    },

    // SERIALIZE

    /**
      Called when a record is saved in order to convert the
      record into JSON.
       By default, it creates a JSON object with a key for
      each attribute and belongsTo relationship.
       For example, consider this model:
       ```app/models/comment.js
      import DS from 'ember-data';
       export default DS.Model.extend({
        title: DS.attr(),
        body: DS.attr(),
         author: DS.belongsTo('user')
      });
      ```
       The default serialization would create a JSON object like:
       ```js
      {
        "title": "Rails is unagi",
        "body": "Rails? Omakase? O_O",
        "author": 12
      }
      ```
       By default, attributes are passed through as-is, unless
      you specified an attribute type (`DS.attr('date')`). If
      you specify a transform, the JavaScript value will be
      serialized when inserted into the JSON hash.
       By default, belongs-to relationships are converted into
      IDs when inserted into the JSON hash.
       ## IDs
       `serialize` takes an options hash with a single option:
      `includeId`. If this option is `true`, `serialize` will,
      by default include the ID in the JSON object it builds.
       The adapter passes in `includeId: true` when serializing
      a record for `createRecord`, but not for `updateRecord`.
       ## Customization
       Your server may expect a different JSON format than the
      built-in serialization format.
       In that case, you can implement `serialize` yourself and
      return a JSON hash of your choosing.
       ```app/serializers/post.js
      import DS from 'ember-data';
       export default DS.RESTSerializer.extend({
        serialize: function(snapshot, options) {
          var json = {
            POST_TTL: snapshot.attr('title'),
            POST_BDY: snapshot.attr('body'),
            POST_CMS: snapshot.hasMany('comments', { ids: true })
          }
           if (options.includeId) {
            json.POST_ID_ = snapshot.id;
          }
           return json;
        }
      });
      ```
       ## Customizing an App-Wide Serializer
       If you want to define a serializer for your entire
      application, you'll probably want to use `eachAttribute`
      and `eachRelationship` on the record.
       ```app/serializers/application.js
      import DS from 'ember-data';
       export default DS.RESTSerializer.extend({
        serialize: function(snapshot, options) {
          var json = {};
           snapshot.eachAttribute(function(name) {
            json[serverAttributeName(name)] = snapshot.attr(name);
          })
           snapshot.eachRelationship(function(name, relationship) {
            if (relationship.kind === 'hasMany') {
              json[serverHasManyName(name)] = snapshot.hasMany(name, { ids: true });
            }
          });
           if (options.includeId) {
            json.ID_ = snapshot.id;
          }
           return json;
        }
      });
       function serverAttributeName(attribute) {
        return attribute.underscore().toUpperCase();
      }
       function serverHasManyName(name) {
        return serverAttributeName(name.singularize()) + "_IDS";
      }
      ```
       This serializer will generate JSON that looks like this:
       ```js
      {
        "TITLE": "Rails is omakase",
        "BODY": "Yep. Omakase.",
        "COMMENT_IDS": [ 1, 2, 3 ]
      }
      ```
       ## Tweaking the Default JSON
       If you just want to do some small tweaks on the default JSON,
      you can call super first and make the tweaks on the returned
      JSON.
       ```app/serializers/post.js
      import DS from 'ember-data';
       export default DS.RESTSerializer.extend({
        serialize: function(snapshot, options) {
          var json = this._super(snapshot, options);
           json.subject = json.title;
          delete json.title;
           return json;
        }
      });
      ```
       @method serialize
      @param {DS.Snapshot} snapshot
      @param {Object} options
      @return {Object} json
    */
    serialize: function serialize(snapshot, options) {
      return this._super.apply(this, arguments);
    },

    /**
      You can use this method to customize the root keys serialized into the JSON.
      The hash property should be modified by reference (possibly using something like _.extend)
      By default the REST Serializer sends the modelName of a model, which is a camelized
      version of the name.
       For example, your server may expect underscored root objects.
       ```app/serializers/application.js
      import DS from 'ember-data';
       export default DS.RESTSerializer.extend({
        serializeIntoHash: function(data, type, record, options) {
          var root = Ember.String.decamelize(type.modelName);
          data[root] = this.serialize(record, options);
        }
      });
      ```
       @method serializeIntoHash
      @param {Object} hash
      @param {DS.Model} typeClass
      @param {DS.Snapshot} snapshot
      @param {Object} options
    */
    serializeIntoHash: function serializeIntoHash(hash, typeClass, snapshot, options) {
      var normalizedRootKey = this.payloadKeyFromModelName(typeClass.modelName);
      hash[normalizedRootKey] = this.serialize(snapshot, options);
    },

    /**
      You can use `payloadKeyFromModelName` to override the root key for an outgoing
      request. By default, the RESTSerializer returns a camelized version of the
      model's name.
       For a model called TacoParty, its `modelName` would be the string `taco-party`. The RESTSerializer
      will send it to the server with `tacoParty` as the root key in the JSON payload:
       ```js
      {
        "tacoParty": {
          "id": "1",
          "location": "Matthew Beale's House"
        }
      }
      ```
       For example, your server may expect dasherized root objects:
       ```app/serializers/application.js
      import DS from 'ember-data';
       export default DS.RESTSerializer.extend({
        payloadKeyFromModelName: function(modelName) {
          return Ember.String.dasherize(modelName);
        }
      });
      ```
       Given a `TacoParty` model, calling `save` on it would produce an outgoing
      request like:
       ```js
      {
        "taco-party": {
          "id": "1",
          "location": "Matthew Beale's House"
        }
      }
      ```
       @method payloadKeyFromModelName
      @param {String} modelName
      @return {String}
    */
    payloadKeyFromModelName: function payloadKeyFromModelName(modelName) {
      return camelize(modelName);
    },

    /**
      You can use this method to customize how polymorphic objects are serialized.
      By default the REST Serializer creates the key by appending `Type` to
      the attribute and value from the model's camelcased model name.
       @method serializePolymorphicType
      @param {DS.Snapshot} snapshot
      @param {Object} json
      @param {Object} relationship
    */
    serializePolymorphicType: function serializePolymorphicType(snapshot, json, relationship) {
      var key = relationship.key;
      var belongsTo = snapshot.belongsTo(key);
      var typeKey = this.keyForPolymorphicType(key, relationship.type, 'serialize');

      // old way of getting the key for the polymorphic type
      key = this.keyForAttribute ? this.keyForAttribute(key, "serialize") : key;
      key = key + "Type";

      // The old way of serializing the type of a polymorphic record used
      // `keyForAttribute`, which is not correct. The next code checks if the old
      // way is used and if it differs from the new way of using
      // `keyForPolymorphicType`. If this is the case, a deprecation warning is
      // logged and the old way is restored (so nothing breaks).
      if (key !== typeKey && this.keyForPolymorphicType === RESTSerializer.prototype.keyForPolymorphicType) {
        (0, _emberDataPrivateDebug.deprecate)("The key to serialize the type of a polymorphic record is created via keyForAttribute which has been deprecated. Use the keyForPolymorphicType hook instead.", false, {
          id: 'ds.rest-serializer.deprecated-key-for-polymorphic-type',
          until: '3.0.0'
        });

        typeKey = key;
      }

      if (_ember["default"].isNone(belongsTo)) {
        json[typeKey] = null;
      } else {
        if (false) {
          json[typeKey] = this.payloadTypeFromModelName(belongsTo.modelName);
        } else {
          json[typeKey] = camelize(belongsTo.modelName);
        }
      }
    },

    /**
      You can use this method to customize how a polymorphic relationship should
      be extracted.
       @method extractPolymorphicRelationship
      @param {Object} relationshipType
      @param {Object} relationshipHash
      @param {Object} relationshipOptions
      @return {Object}
     */
    extractPolymorphicRelationship: function extractPolymorphicRelationship(relationshipType, relationshipHash, relationshipOptions) {
      var key = relationshipOptions.key;
      var resourceHash = relationshipOptions.resourceHash;
      var relationshipMeta = relationshipOptions.relationshipMeta;

      // A polymorphic belongsTo relationship can be present in the payload
      // either in the form where the `id` and the `type` are given:
      //
      //   {
      //     message: { id: 1, type: 'post' }
      //   }
      //
      // or by the `id` and a `<relationship>Type` attribute:
      //
      //   {
      //     message: 1,
      //     messageType: 'post'
      //   }
      //
      // The next code checks if the latter case is present and returns the
      // corresponding JSON-API representation. The former case is handled within
      // the base class JSONSerializer.
      var isPolymorphic = relationshipMeta.options.polymorphic;
      var typeProperty = this.keyForPolymorphicType(key, relationshipType, 'deserialize');

      if (isPolymorphic && resourceHash[typeProperty] !== undefined && typeof relationshipHash !== 'object') {

        if (false) {

          var payloadType = resourceHash[typeProperty];
          var type = this.modelNameFromPayloadType(payloadType);
          var deprecatedTypeLookup = this.modelNameFromPayloadKey(payloadType);

          if (payloadType !== deprecatedTypeLookup && !this._hasCustomModelNameFromPayloadType() && this._hasCustomModelNameFromPayloadKey()) {
            (0, _emberDataPrivateDebug.deprecate)("You are using modelNameFromPayloadKey to normalize the type for a polymorphic relationship. This has been deprecated in favor of modelNameFromPayloadType", false, {
              id: 'ds.rest-serializer.deprecated-model-name-for-polymorphic-type',
              until: '3.0.0'
            });

            type = deprecatedTypeLookup;
          }

          return {
            id: relationshipHash,
            type: type
          };
        } else {

          var type = this.modelNameFromPayloadKey(resourceHash[typeProperty]);
          return {
            id: relationshipHash,
            type: type
          };
        }
      }

      return this._super.apply(this, arguments);
    }
  });

  if (false) {

    RESTSerializer.reopen({

      /**
        `modelNameFromPayloadType` can be used to change the mapping for a DS model
        name, taken from the value in the payload.
         Say your API namespaces the type of a model and returns the following
        payload for the `post` model, which has a polymorphic `user` relationship:
         ```javascript
        // GET /api/posts/1
        {
          "post": {
            "id": 1,
            "user": 1,
            "userType: "api::v1::administrator"
          }
        }
        ```
         By overwriting `modelNameFromPayloadType` you can specify that the
        `administrator` model should be used:
         ```app/serializers/application.js
        import DS from "ember-data";
         export default DS.RESTSerializer.extend({
          modelNameFromPayloadType(payloadType) {
            return payloadType.replace('api::v1::', '');
          }
        });
        ```
         By default the modelName for a model is its name in dasherized form.
        Usually, Ember Data can use the correct inflection to do this for you. Most
        of the time, you won't need to override `modelNameFromPayloadType` for this
        purpose.
         Also take a look at
        [payloadTypeFromModelName](#method_payloadTypeFromModelName) to customize
        how the type of a record should be serialized.
         @method modelNameFromPayloadType
        @public
        @param {String} payloadType type from payload
        @return {String} modelName
      */
      modelNameFromPayloadType: function modelNameFromPayloadType(payloadType) {
        return (0, _emberInflector.singularize)((0, _emberDataPrivateSystemNormalizeModelName["default"])(payloadType));
      },

      /**
        `payloadTypeFromModelName` can be used to change the mapping for the type in
        the payload, taken from the model name.
         Say your API namespaces the type of a model and expects the following
        payload when you update the `post` model, which has a polymorphic `user`
        relationship:
         ```javascript
        // POST /api/posts/1
        {
          "post": {
            "id": 1,
            "user": 1,
            "userType": "api::v1::administrator"
          }
        }
        ```
         By overwriting `payloadTypeFromModelName` you can specify that the
        namespaces model name for the `administrator` should be used:
         ```app/serializers/application.js
        import DS from "ember-data";
         export default DS.RESTSerializer.extend({
          payloadTypeFromModelName(modelName) {
            return "api::v1::" + modelName;
          }
        });
        ```
         By default the payload type is the camelized model name. Usually, Ember
        Data can use the correct inflection to do this for you. Most of the time,
        you won't need to override `payloadTypeFromModelName` for this purpose.
         Also take a look at
        [modelNameFromPayloadType](#method_modelNameFromPayloadType) to customize
        how the model name from should be mapped from the payload.
         @method payloadTypeFromModelName
        @public
        @param {String} modelname modelName from the record
        @return {String} payloadType
      */
      payloadTypeFromModelName: function payloadTypeFromModelName(modelName) {
        return camelize(modelName);
      },

      _hasCustomModelNameFromPayloadKey: function _hasCustomModelNameFromPayloadKey() {
        return this.modelNameFromPayloadKey !== RESTSerializer.prototype.modelNameFromPayloadKey;
      },

      _hasCustomModelNameFromPayloadType: function _hasCustomModelNameFromPayloadType() {
        return this.modelNameFromPayloadType !== RESTSerializer.prototype.modelNameFromPayloadType;
      },

      _hasCustomPayloadTypeFromModelName: function _hasCustomPayloadTypeFromModelName() {
        return this.payloadTypeFromModelName !== RESTSerializer.prototype.payloadTypeFromModelName;
      },

      _hasCustomPayloadKeyFromModelName: function _hasCustomPayloadKeyFromModelName() {
        return this.payloadKeyFromModelName !== RESTSerializer.prototype.payloadKeyFromModelName;
      }

    });
  }

  (0, _emberDataPrivateDebug.runInDebug)(function () {
    RESTSerializer.reopen({
      warnMessageNoModelForKey: function warnMessageNoModelForKey(prop, typeKey) {
        return 'Encountered "' + prop + '" in payload, but no model was found for model name "' + typeKey + '" (resolved model name using ' + this.constructor.toString() + '.modelNameFromPayloadKey("' + prop + '"))';
      }
    });
  });

  exports["default"] = RESTSerializer;
});
define('ember-data/setup-container', ['exports', 'ember-data/-private/initializers/store', 'ember-data/-private/initializers/transforms', 'ember-data/-private/initializers/store-injections', 'ember-data/-private/initializers/data-adapter'], function (exports, _emberDataPrivateInitializersStore, _emberDataPrivateInitializersTransforms, _emberDataPrivateInitializersStoreInjections, _emberDataPrivateInitializersDataAdapter) {
  'use strict';

  exports['default'] = setupContainer;

  function setupContainer(application) {
    (0, _emberDataPrivateInitializersDataAdapter['default'])(application);
    (0, _emberDataPrivateInitializersTransforms['default'])(application);
    (0, _emberDataPrivateInitializersStoreInjections['default'])(application);
    (0, _emberDataPrivateInitializersStore['default'])(application);
  }
});
define("ember-data/store", ["exports", "ember-data/-private/system/store"], function (exports, _emberDataPrivateSystemStore) {
  "use strict";

  exports["default"] = _emberDataPrivateSystemStore["default"];
});
define('ember-data/transform', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  /**
    The `DS.Transform` class is used to serialize and deserialize model
    attributes when they are saved or loaded from an
    adapter. Subclassing `DS.Transform` is useful for creating custom
    attributes. All subclasses of `DS.Transform` must implement a
    `serialize` and a `deserialize` method.
  
    Example
  
    ```app/transforms/temperature.js
    import DS from 'ember-data';
  
    // Converts centigrade in the JSON to fahrenheit in the app
    export default DS.Transform.extend({
      deserialize: function(serialized, options) {
        return (serialized *  1.8) + 32;
      },
      serialize: function(deserialized, options) {
        return (deserialized - 32) / 1.8;
      }
    });
    ```
  
    The options passed into the `DS.attr` function when the attribute is
    declared on the model is also available in the transform.
  
    ```app/models/post.js
    export default DS.Model.extend({
      title: DS.attr('string'),
      markdown: DS.attr('markdown', {
        markdown: {
          gfm: false,
          sanitize: true
        }
      })
    });
    ```
  
    ```app/transforms/markdown.js
    export default DS.Transform.extend({
      serialize: function (deserialized, options) {
        return deserialized.raw;
      },
  
      deserialize: function (serialized, options) {
        var markdownOptions = options.markdown || {};
  
        return marked(serialized, markdownOptions);
      }
    });
    ```
  
    Usage
  
    ```app/models/requirement.js
    import DS from 'ember-data';
  
    export default DS.Model.extend({
      name: DS.attr('string'),
      temperature: DS.attr('temperature')
    });
    ```
  
    @class Transform
    @namespace DS
   */
  exports['default'] = _ember['default'].Object.extend({
    /**
      When given a deserialized value from a record attribute this
      method must return the serialized value.
       Example
       ```javascript
      serialize: function(deserialized, options) {
        return Ember.isEmpty(deserialized) ? null : Number(deserialized);
      }
      ```
       @method serialize
      @param deserialized The deserialized value
      @param options hash of options passed to `DS.attr`
      @return The serialized value
    */
    serialize: null,

    /**
      When given a serialize value from a JSON object this method must
      return the deserialized value for the record attribute.
       Example
       ```javascript
      deserialize: function(serialized, options) {
        return empty(serialized) ? null : Number(serialized);
      }
      ```
       @method deserialize
      @param serialized The serialized value
      @param options hash of options passed to `DS.attr`
      @return The deserialized value
    */
    deserialize: null
  });
});
define("ember-data/version", ["exports"], function (exports) {
  "use strict";

  exports["default"] = "2.10.0";
});
define("ember-inflector/index", ["exports", "ember", "ember-inflector/lib/system", "ember-inflector/lib/ext/string"], function (exports, _ember, _emberInflectorLibSystem, _emberInflectorLibExtString) {
  /* global define, module */

  "use strict";

  _emberInflectorLibSystem.Inflector.defaultRules = _emberInflectorLibSystem.defaultRules;
  _ember["default"].Inflector = _emberInflectorLibSystem.Inflector;

  _ember["default"].String.pluralize = _emberInflectorLibSystem.pluralize;
  _ember["default"].String.singularize = _emberInflectorLibSystem.singularize;exports["default"] = _emberInflectorLibSystem.Inflector;
  exports.pluralize = _emberInflectorLibSystem.pluralize;
  exports.singularize = _emberInflectorLibSystem.singularize;
  exports.defaultRules = _emberInflectorLibSystem.defaultRules;

  if (typeof define !== 'undefined' && define.amd) {
    define('ember-inflector', ['exports'], function (__exports__) {
      __exports__['default'] = _emberInflectorLibSystem.Inflector;
      return _emberInflectorLibSystem.Inflector;
    });
  } else if (typeof module !== 'undefined' && module['exports']) {
    module['exports'] = _emberInflectorLibSystem.Inflector;
  }
});
define('ember-inflector/lib/ext/string', ['exports', 'ember', 'ember-inflector/lib/system/string'], function (exports, _ember, _emberInflectorLibSystemString) {
  'use strict';

  if (_ember['default'].EXTEND_PROTOTYPES === true || _ember['default'].EXTEND_PROTOTYPES.String) {
    /**
      See {{#crossLink "Ember.String/pluralize"}}{{/crossLink}}
       @method pluralize
      @for String
    */
    String.prototype.pluralize = function () {
      return (0, _emberInflectorLibSystemString.pluralize)(this);
    };

    /**
      See {{#crossLink "Ember.String/singularize"}}{{/crossLink}}
       @method singularize
      @for String
    */
    String.prototype.singularize = function () {
      return (0, _emberInflectorLibSystemString.singularize)(this);
    };
  }
});
define('ember-inflector/lib/helpers/pluralize', ['exports', 'ember-inflector', 'ember-inflector/lib/utils/make-helper'], function (exports, _emberInflector, _emberInflectorLibUtilsMakeHelper) {
  'use strict';

  /**
   *
   * If you have Ember Inflector (such as if Ember Data is present),
   * pluralize a word. For example, turn "ox" into "oxen".
   *
   * Example:
   *
   * {{pluralize count myProperty}}
   * {{pluralize 1 "oxen"}}
   * {{pluralize myProperty}}
   * {{pluralize "ox"}}
   *
   * @for Ember.HTMLBars.helpers
   * @method pluralize
   * @param {Number|Property} [count] count of objects
   * @param {String|Property} word word to pluralize
  */
  exports['default'] = (0, _emberInflectorLibUtilsMakeHelper['default'])(function (params) {
    var count = undefined,
        word = undefined;

    if (params.length === 1) {
      word = params[0];
      return (0, _emberInflector.pluralize)(word);
    } else {
      count = params[0];
      word = params[1];

      if (parseFloat(count) !== 1) {
        word = (0, _emberInflector.pluralize)(word);
      }

      return count + " " + word;
    }
  });
});
define('ember-inflector/lib/helpers/singularize', ['exports', 'ember-inflector', 'ember-inflector/lib/utils/make-helper'], function (exports, _emberInflector, _emberInflectorLibUtilsMakeHelper) {
  'use strict';

  /**
   *
   * If you have Ember Inflector (such as if Ember Data is present),
   * singularize a word. For example, turn "oxen" into "ox".
   *
   * Example:
   *
   * {{singularize myProperty}}
   * {{singularize "oxen"}}
   *
   * @for Ember.HTMLBars.helpers
   * @method singularize
   * @param {String|Property} word word to singularize
  */
  exports['default'] = (0, _emberInflectorLibUtilsMakeHelper['default'])(function (params) {
    return (0, _emberInflector.singularize)(params[0]);
  });
});
define("ember-inflector/lib/system", ["exports", "ember-inflector/lib/system/inflector", "ember-inflector/lib/system/string", "ember-inflector/lib/system/inflections"], function (exports, _emberInflectorLibSystemInflector, _emberInflectorLibSystemString, _emberInflectorLibSystemInflections) {
  "use strict";

  _emberInflectorLibSystemInflector["default"].inflector = new _emberInflectorLibSystemInflector["default"](_emberInflectorLibSystemInflections["default"]);

  exports.Inflector = _emberInflectorLibSystemInflector["default"];
  exports.singularize = _emberInflectorLibSystemString.singularize;
  exports.pluralize = _emberInflectorLibSystemString.pluralize;
  exports.defaultRules = _emberInflectorLibSystemInflections["default"];
});
define('ember-inflector/lib/system/inflections', ['exports'], function (exports) {
  'use strict';

  exports['default'] = {
    plurals: [[/$/, 's'], [/s$/i, 's'], [/^(ax|test)is$/i, '$1es'], [/(octop|vir)us$/i, '$1i'], [/(octop|vir)i$/i, '$1i'], [/(alias|status|bonus)$/i, '$1es'], [/(bu)s$/i, '$1ses'], [/(buffal|tomat)o$/i, '$1oes'], [/([ti])um$/i, '$1a'], [/([ti])a$/i, '$1a'], [/sis$/i, 'ses'], [/(?:([^f])fe|([lr])f)$/i, '$1$2ves'], [/(hive)$/i, '$1s'], [/([^aeiouy]|qu)y$/i, '$1ies'], [/(x|ch|ss|sh)$/i, '$1es'], [/(matr|vert|ind)(?:ix|ex)$/i, '$1ices'], [/^(m|l)ouse$/i, '$1ice'], [/^(m|l)ice$/i, '$1ice'], [/^(ox)$/i, '$1en'], [/^(oxen)$/i, '$1'], [/(quiz)$/i, '$1zes']],

    singular: [[/s$/i, ''], [/(ss)$/i, '$1'], [/(n)ews$/i, '$1ews'], [/([ti])a$/i, '$1um'], [/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)(sis|ses)$/i, '$1sis'], [/(^analy)(sis|ses)$/i, '$1sis'], [/([^f])ves$/i, '$1fe'], [/(hive)s$/i, '$1'], [/(tive)s$/i, '$1'], [/([lr])ves$/i, '$1f'], [/([^aeiouy]|qu)ies$/i, '$1y'], [/(s)eries$/i, '$1eries'], [/(m)ovies$/i, '$1ovie'], [/(x|ch|ss|sh)es$/i, '$1'], [/^(m|l)ice$/i, '$1ouse'], [/(bus)(es)?$/i, '$1'], [/(o)es$/i, '$1'], [/(shoe)s$/i, '$1'], [/(cris|test)(is|es)$/i, '$1is'], [/^(a)x[ie]s$/i, '$1xis'], [/(octop|vir)(us|i)$/i, '$1us'], [/(alias|status|bonus)(es)?$/i, '$1'], [/^(ox)en/i, '$1'], [/(vert|ind)ices$/i, '$1ex'], [/(matr)ices$/i, '$1ix'], [/(quiz)zes$/i, '$1'], [/(database)s$/i, '$1']],

    irregularPairs: [['person', 'people'], ['man', 'men'], ['child', 'children'], ['sex', 'sexes'], ['move', 'moves'], ['cow', 'kine'], ['zombie', 'zombies']],

    uncountable: ['equipment', 'information', 'rice', 'money', 'species', 'series', 'fish', 'sheep', 'jeans', 'police']
  };
});
define('ember-inflector/lib/system/inflector', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  var capitalize = _ember['default'].String.capitalize;

  var BLANK_REGEX = /^\s*$/;
  var LAST_WORD_DASHED_REGEX = /([\w/-]+[_/\s-])([a-z\d]+$)/;
  var LAST_WORD_CAMELIZED_REGEX = /([\w/\s-]+)([A-Z][a-z\d]*$)/;
  var CAMELIZED_REGEX = /[A-Z][a-z\d]*$/;

  function loadUncountable(rules, uncountable) {
    for (var i = 0, length = uncountable.length; i < length; i++) {
      rules.uncountable[uncountable[i].toLowerCase()] = true;
    }
  }

  function loadIrregular(rules, irregularPairs) {
    var pair;

    for (var i = 0, length = irregularPairs.length; i < length; i++) {
      pair = irregularPairs[i];

      //pluralizing
      rules.irregular[pair[0].toLowerCase()] = pair[1];
      rules.irregular[pair[1].toLowerCase()] = pair[1];

      //singularizing
      rules.irregularInverse[pair[1].toLowerCase()] = pair[0];
      rules.irregularInverse[pair[0].toLowerCase()] = pair[0];
    }
  }

  /**
    Inflector.Ember provides a mechanism for supplying inflection rules for your
    application. Ember includes a default set of inflection rules, and provides an
    API for providing additional rules.
  
    Examples:
  
    Creating an inflector with no rules.
  
    ```js
    var inflector = new Ember.Inflector();
    ```
  
    Creating an inflector with the default ember ruleset.
  
    ```js
    var inflector = new Ember.Inflector(Ember.Inflector.defaultRules);
  
    inflector.pluralize('cow'); //=> 'kine'
    inflector.singularize('kine'); //=> 'cow'
    ```
  
    Creating an inflector and adding rules later.
  
    ```javascript
    var inflector = Ember.Inflector.inflector;
  
    inflector.pluralize('advice'); // => 'advices'
    inflector.uncountable('advice');
    inflector.pluralize('advice'); // => 'advice'
  
    inflector.pluralize('formula'); // => 'formulas'
    inflector.irregular('formula', 'formulae');
    inflector.pluralize('formula'); // => 'formulae'
  
    // you would not need to add these as they are the default rules
    inflector.plural(/$/, 's');
    inflector.singular(/s$/i, '');
    ```
  
    Creating an inflector with a nondefault ruleset.
  
    ```javascript
    var rules = {
      plurals:  [ /$/, 's' ],
      singular: [ /\s$/, '' ],
      irregularPairs: [
        [ 'cow', 'kine' ]
      ],
      uncountable: [ 'fish' ]
    };
  
    var inflector = new Ember.Inflector(rules);
    ```
  
    @class Inflector
    @namespace Ember
  */
  function Inflector(ruleSet) {
    ruleSet = ruleSet || {};
    ruleSet.uncountable = ruleSet.uncountable || makeDictionary();
    ruleSet.irregularPairs = ruleSet.irregularPairs || makeDictionary();

    var rules = this.rules = {
      plurals: ruleSet.plurals || [],
      singular: ruleSet.singular || [],
      irregular: makeDictionary(),
      irregularInverse: makeDictionary(),
      uncountable: makeDictionary()
    };

    loadUncountable(rules, ruleSet.uncountable);
    loadIrregular(rules, ruleSet.irregularPairs);

    this.enableCache();
  }

  if (!Object.create && !Object.create(null).hasOwnProperty) {
    throw new Error("This browser does not support Object.create(null), please polyfil with es5-sham: http://git.io/yBU2rg");
  }

  function makeDictionary() {
    var cache = Object.create(null);
    cache['_dict'] = null;
    delete cache['_dict'];
    return cache;
  }

  Inflector.prototype = {
    /**
      @public
       As inflections can be costly, and commonly the same subset of words are repeatedly
      inflected an optional cache is provided.
       @method enableCache
    */
    enableCache: function enableCache() {
      this.purgeCache();

      this.singularize = function (word) {
        this._cacheUsed = true;
        return this._sCache[word] || (this._sCache[word] = this._singularize(word));
      };

      this.pluralize = function (word) {
        this._cacheUsed = true;
        return this._pCache[word] || (this._pCache[word] = this._pluralize(word));
      };
    },

    /**
      @public
       @method purgedCache
    */
    purgeCache: function purgeCache() {
      this._cacheUsed = false;
      this._sCache = makeDictionary();
      this._pCache = makeDictionary();
    },

    /**
      @public
      disable caching
       @method disableCache;
    */
    disableCache: function disableCache() {
      this._sCache = null;
      this._pCache = null;
      this.singularize = function (word) {
        return this._singularize(word);
      };

      this.pluralize = function (word) {
        return this._pluralize(word);
      };
    },

    /**
      @method plural
      @param {RegExp} regex
      @param {String} string
    */
    plural: function plural(regex, string) {
      if (this._cacheUsed) {
        this.purgeCache();
      }
      this.rules.plurals.push([regex, string.toLowerCase()]);
    },

    /**
      @method singular
      @param {RegExp} regex
      @param {String} string
    */
    singular: function singular(regex, string) {
      if (this._cacheUsed) {
        this.purgeCache();
      }
      this.rules.singular.push([regex, string.toLowerCase()]);
    },

    /**
      @method uncountable
      @param {String} regex
    */
    uncountable: function uncountable(string) {
      if (this._cacheUsed) {
        this.purgeCache();
      }
      loadUncountable(this.rules, [string.toLowerCase()]);
    },

    /**
      @method irregular
      @param {String} singular
      @param {String} plural
    */
    irregular: function irregular(singular, plural) {
      if (this._cacheUsed) {
        this.purgeCache();
      }
      loadIrregular(this.rules, [[singular, plural]]);
    },

    /**
      @method pluralize
      @param {String} word
    */
    pluralize: function pluralize(word) {
      return this._pluralize(word);
    },

    _pluralize: function _pluralize(word) {
      return this.inflect(word, this.rules.plurals, this.rules.irregular);
    },
    /**
      @method singularize
      @param {String} word
    */
    singularize: function singularize(word) {
      return this._singularize(word);
    },

    _singularize: function _singularize(word) {
      return this.inflect(word, this.rules.singular, this.rules.irregularInverse);
    },

    /**
      @protected
       @method inflect
      @param {String} word
      @param {Object} typeRules
      @param {Object} irregular
    */
    inflect: function inflect(word, typeRules, irregular) {
      var inflection, substitution, result, lowercase, wordSplit, firstPhrase, lastWord, isBlank, isCamelized, rule, isUncountable;

      isBlank = !word || BLANK_REGEX.test(word);

      isCamelized = CAMELIZED_REGEX.test(word);
      firstPhrase = "";

      if (isBlank) {
        return word;
      }

      lowercase = word.toLowerCase();
      wordSplit = LAST_WORD_DASHED_REGEX.exec(word) || LAST_WORD_CAMELIZED_REGEX.exec(word);

      if (wordSplit) {
        firstPhrase = wordSplit[1];
        lastWord = wordSplit[2].toLowerCase();
      }

      isUncountable = this.rules.uncountable[lowercase] || this.rules.uncountable[lastWord];

      if (isUncountable) {
        return word;
      }

      for (rule in irregular) {
        if (lowercase.match(rule + "$")) {
          substitution = irregular[rule];

          if (isCamelized && irregular[lastWord]) {
            substitution = capitalize(substitution);
            rule = capitalize(rule);
          }

          return word.replace(new RegExp(rule, 'i'), substitution);
        }
      }

      for (var i = typeRules.length, min = 0; i > min; i--) {
        inflection = typeRules[i - 1];
        rule = inflection[0];

        if (rule.test(word)) {
          break;
        }
      }

      inflection = inflection || [];

      rule = inflection[0];
      substitution = inflection[1];

      result = word.replace(rule, substitution);

      return result;
    }
  };

  exports['default'] = Inflector;
});
define('ember-inflector/lib/system/string', ['exports', 'ember-inflector/lib/system/inflector'], function (exports, _emberInflectorLibSystemInflector) {
  'use strict';

  function pluralize(word) {
    return _emberInflectorLibSystemInflector['default'].inflector.pluralize(word);
  }

  function singularize(word) {
    return _emberInflectorLibSystemInflector['default'].inflector.singularize(word);
  }

  exports.pluralize = pluralize;
  exports.singularize = singularize;
});
define('ember-inflector/lib/utils/make-helper', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  exports['default'] = makeHelper;

  function makeHelper(helperFunction) {
    if (_ember['default'].Helper) {
      return _ember['default'].Helper.helper(helperFunction);
    }
    if (_ember['default'].HTMLBars) {
      return _ember['default'].HTMLBars.makeBoundHelper(helperFunction);
    }
    return _ember['default'].Handlebars.makeBoundHelper(helperFunction);
  }
});
define('ember-load-initializers/index', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  exports['default'] = function (app, prefix) {
    var regex = new RegExp('^' + prefix + '\/((?:instance-)?initializers)\/');
    var getKeys = Object.keys || _ember['default'].keys;

    getKeys(requirejs._eak_seen).map(function (moduleName) {
      return {
        moduleName: moduleName,
        matches: regex.exec(moduleName)
      };
    }).filter(function (dep) {
      return dep.matches && dep.matches.length === 2;
    }).forEach(function (dep) {
      var moduleName = dep.moduleName;

      var module = require(moduleName, null, null, true);
      if (!module) {
        throw new Error(moduleName + ' must export an initializer.');
      }

      var initializerType = _ember['default'].String.camelize(dep.matches[1].substring(0, dep.matches[1].length - 1));
      var initializer = module['default'];
      if (!initializer.name) {
        var initializerName = moduleName.match(/[^\/]+\/?$/)[0];
        initializer.name = initializerName;
      }

      if (app[initializerType]) {
        app[initializerType](initializer);
      }
    });
  };
});
define('ember-resolver/container-debug-adapter', ['exports', 'ember', 'ember-resolver/utils/module-registry'], function (exports, _ember, _emberResolverUtilsModuleRegistry) {
  'use strict';

  var ContainerDebugAdapter = _ember['default'].ContainerDebugAdapter;

  var ModulesContainerDebugAdapter = null;

  function getPod(type, key, prefix) {
    var match = key.match(new RegExp('^/?' + prefix + '/(.+)/' + type + '$'));
    if (match) {
      return match[1];
    }
  }

  // Support Ember < 1.5-beta.4
  // TODO: Remove this after 1.5.0 is released
  if (typeof ContainerDebugAdapter !== 'undefined') {

    /*
     * This module defines a subclass of Ember.ContainerDebugAdapter that adds two
     * important features:
     *
     *  1) is able provide injections to classes that implement `extend`
     *     (as is typical with Ember).
     */

    ModulesContainerDebugAdapter = ContainerDebugAdapter.extend({
      _moduleRegistry: null,

      init: function init() {
        this._super.apply(this, arguments);

        if (!this._moduleRegistry) {
          this._moduleRegistry = new _emberResolverUtilsModuleRegistry['default']();
        }
      },

      /**
        The container of the application being debugged.
        This property will be injected
        on creation.
         @property container
        @default null
      */

      /**
        The resolver instance of the application
        being debugged. This property will be injected
        on creation.
         @property resolver
        @default null
      */

      /**
        Returns true if it is possible to catalog a list of available
        classes in the resolver for a given type.
         @method canCatalogEntriesByType
        @param {string} type The type. e.g. "model", "controller", "route"
        @return {boolean} whether a list is available for this type.
      */
      canCatalogEntriesByType: function canCatalogEntriesByType() /* type */{
        return true;
      },

      /**
        Returns the available classes a given type.
         @method catalogEntriesByType
        @param {string} type The type. e.g. "model", "controller", "route"
        @return {Array} An array of classes.
      */
      catalogEntriesByType: function catalogEntriesByType(type) {
        var moduleNames = this._moduleRegistry.moduleNames();
        var types = _ember['default'].A();

        var prefix = this.namespace.modulePrefix;

        for (var i = 0, l = moduleNames.length; i < l; i++) {
          var key = moduleNames[i];

          if (key.indexOf(type) !== -1) {
            // Check if it's a pod module
            var name = getPod(type, key, this.namespace.podModulePrefix || prefix);
            if (!name) {
              // Not pod
              name = key.split(type + 's/').pop();

              // Support for different prefix (such as ember-cli addons).
              // Uncomment the code below when
              // https://github.com/ember-cli/ember-resolver/pull/80 is merged.

              //var match = key.match('^/?(.+)/' + type);
              //if (match && match[1] !== prefix) {
              // Different prefix such as an addon
              //name = match[1] + '@' + name;
              //}
            }
            types.addObject(name);
          }
        }
        return types;
      }
    });
  }

  exports['default'] = ModulesContainerDebugAdapter;
});
define('ember-resolver/index', ['exports', 'ember-resolver/resolver'], function (exports, _emberResolverResolver) {
  'use strict';

  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberResolverResolver['default'];
    }
  });
});
define('ember-resolver/resolver', ['exports', 'ember', 'ember-resolver/utils/module-registry', 'ember-resolver/utils/class-factory', 'ember-resolver/utils/make-dictionary'], function (exports, _ember, _emberResolverUtilsModuleRegistry, _emberResolverUtilsClassFactory, _emberResolverUtilsMakeDictionary) {
  /*globals require */

  'use strict';

  /*
   * This module defines a subclass of Ember.DefaultResolver that adds two
   * important features:
   *
   *  1) The resolver makes the container aware of es6 modules via the AMD
   *     output. The loader's _moduleEntries is consulted so that classes can be
   *     resolved directly via the module loader, without needing a manual
   *     `import`.
   *  2) is able to provide injections to classes that implement `extend`
   *     (as is typical with Ember).
   */

  var _Ember$String = _ember['default'].String;
  var underscore = _Ember$String.underscore;
  var classify = _Ember$String.classify;
  var get = _ember['default'].get;
  var DefaultResolver = _ember['default'].DefaultResolver;

  function parseName(fullName) {
    /*jshint validthis:true */

    if (fullName.parsedName === true) {
      return fullName;
    }

    var prefix, type, name;
    var fullNameParts = fullName.split('@');

    // HTMLBars uses helper:@content-helper which collides
    // with ember-cli namespace detection.
    // This will be removed in a future release of HTMLBars.
    if (fullName !== 'helper:@content-helper' && fullNameParts.length === 2) {
      var prefixParts = fullNameParts[0].split(':');

      if (prefixParts.length === 2) {
        prefix = prefixParts[1];
        type = prefixParts[0];
        name = fullNameParts[1];
      } else {
        var nameParts = fullNameParts[1].split(':');

        prefix = fullNameParts[0];
        type = nameParts[0];
        name = nameParts[1];
      }
    } else {
      fullNameParts = fullName.split(':');
      type = fullNameParts[0];
      name = fullNameParts[1];
    }

    var fullNameWithoutType = name;
    var namespace = get(this, 'namespace');
    var root = namespace;

    return {
      parsedName: true,
      fullName: fullName,
      prefix: prefix || this.prefix({ type: type }),
      type: type,
      fullNameWithoutType: fullNameWithoutType,
      name: name,
      root: root,
      resolveMethodName: "resolve" + classify(type)
    };
  }

  function resolveOther(parsedName) {
    /*jshint validthis:true */

    _ember['default'].assert('`modulePrefix` must be defined', this.namespace.modulePrefix);

    var normalizedModuleName = this.findModuleName(parsedName);

    if (normalizedModuleName) {
      var defaultExport = this._extractDefaultExport(normalizedModuleName, parsedName);

      if (defaultExport === undefined) {
        throw new Error(" Expected to find: '" + parsedName.fullName + "' within '" + normalizedModuleName + "' but got 'undefined'. Did you forget to `export default` within '" + normalizedModuleName + "'?");
      }

      if (this.shouldWrapInClassFactory(defaultExport, parsedName)) {
        defaultExport = (0, _emberResolverUtilsClassFactory['default'])(defaultExport);
      }

      return defaultExport;
    } else {
      return this._super(parsedName);
    }
  }

  // Ember.DefaultResolver docs:
  //   https://github.com/emberjs/ember.js/blob/master/packages/ember-application/lib/system/resolver.js
  var Resolver = DefaultResolver.extend({
    resolveOther: resolveOther,
    parseName: parseName,
    resolveTemplate: resolveOther,
    pluralizedTypes: null,
    moduleRegistry: null,

    makeToString: function makeToString(factory, fullName) {
      return '' + this.namespace.modulePrefix + '@' + fullName + ':';
    },

    shouldWrapInClassFactory: function shouldWrapInClassFactory() /* module, parsedName */{
      return false;
    },

    init: function init() {
      this._super();
      this.moduleBasedResolver = true;

      if (!this._moduleRegistry) {
        this._moduleRegistry = new _emberResolverUtilsModuleRegistry['default']();
      }

      this._normalizeCache = (0, _emberResolverUtilsMakeDictionary['default'])();

      this.pluralizedTypes = this.pluralizedTypes || (0, _emberResolverUtilsMakeDictionary['default'])();

      if (!this.pluralizedTypes.config) {
        this.pluralizedTypes.config = 'config';
      }

      this._deprecatedPodModulePrefix = false;
    },

    normalize: function normalize(fullName) {
      return this._normalizeCache[fullName] || (this._normalizeCache[fullName] = this._normalize(fullName));
    },

    _normalize: function _normalize(fullName) {
      // replace `.` with `/` in order to make nested controllers work in the following cases
      // 1. `needs: ['posts/post']`
      // 2. `{{render "posts/post"}}`
      // 3. `this.render('posts/post')` from Route
      var split = fullName.split(':');
      if (split.length > 1) {
        return split[0] + ':' + _ember['default'].String.dasherize(split[1].replace(/\./g, '/'));
      } else {
        return fullName;
      }
    },

    pluralize: function pluralize(type) {
      return this.pluralizedTypes[type] || (this.pluralizedTypes[type] = type + 's');
    },

    podBasedLookupWithPrefix: function podBasedLookupWithPrefix(podPrefix, parsedName) {
      var fullNameWithoutType = parsedName.fullNameWithoutType;

      if (parsedName.type === 'template') {
        fullNameWithoutType = fullNameWithoutType.replace(/^components\//, '');
      }

      return podPrefix + '/' + fullNameWithoutType + '/' + parsedName.type;
    },

    podBasedModuleName: function podBasedModuleName(parsedName) {
      var podPrefix = this.namespace.podModulePrefix || this.namespace.modulePrefix;

      return this.podBasedLookupWithPrefix(podPrefix, parsedName);
    },

    podBasedComponentsInSubdir: function podBasedComponentsInSubdir(parsedName) {
      var podPrefix = this.namespace.podModulePrefix || this.namespace.modulePrefix;
      podPrefix = podPrefix + '/components';

      if (parsedName.type === 'component' || parsedName.fullNameWithoutType.match(/^components/)) {
        return this.podBasedLookupWithPrefix(podPrefix, parsedName);
      }
    },

    resolveEngine: function resolveEngine(parsedName) {
      var engineName = parsedName.fullNameWithoutType;
      var engineModule = engineName + '/engine';

      if (this._moduleRegistry.has(engineModule)) {
        return this._extractDefaultExport(engineModule);
      }
    },

    resolveRouteMap: function resolveRouteMap(parsedName) {
      var engineName = parsedName.fullNameWithoutType;
      var engineRoutesModule = engineName + '/routes';

      if (this._moduleRegistry.has(engineRoutesModule)) {
        var routeMap = this._extractDefaultExport(engineRoutesModule);

        _ember['default'].assert('The route map for ' + engineName + ' should be wrapped by \'buildRoutes\' before exporting.', routeMap.isRouteMap);

        return routeMap;
      }
    },

    mainModuleName: function mainModuleName(parsedName) {
      // if router:main or adapter:main look for a module with just the type first
      var tmpModuleName = parsedName.prefix + '/' + parsedName.type;

      if (parsedName.fullNameWithoutType === 'main') {
        return tmpModuleName;
      }
    },

    defaultModuleName: function defaultModuleName(parsedName) {
      return parsedName.prefix + '/' + this.pluralize(parsedName.type) + '/' + parsedName.fullNameWithoutType;
    },

    prefix: function prefix(parsedName) {
      var tmpPrefix = this.namespace.modulePrefix;

      if (this.namespace[parsedName.type + 'Prefix']) {
        tmpPrefix = this.namespace[parsedName.type + 'Prefix'];
      }

      return tmpPrefix;
    },

    /**
      A listing of functions to test for moduleName's based on the provided
     `parsedName`. This allows easy customization of additional module based
     lookup patterns.
      @property moduleNameLookupPatterns
     @returns {Ember.Array}
     */
    moduleNameLookupPatterns: _ember['default'].computed(function () {
      return [this.podBasedModuleName, this.podBasedComponentsInSubdir, this.mainModuleName, this.defaultModuleName];
    }),

    findModuleName: function findModuleName(parsedName, loggingDisabled) {
      var moduleNameLookupPatterns = this.get('moduleNameLookupPatterns');
      var moduleName;

      for (var index = 0, _length = moduleNameLookupPatterns.length; index < _length; index++) {
        var item = moduleNameLookupPatterns[index];

        var tmpModuleName = item.call(this, parsedName);

        // allow treat all dashed and all underscored as the same thing
        // supports components with dashes and other stuff with underscores.
        if (tmpModuleName) {
          tmpModuleName = this.chooseModuleName(tmpModuleName);
        }

        if (tmpModuleName && this._moduleRegistry.has(tmpModuleName)) {
          moduleName = tmpModuleName;
        }

        if (!loggingDisabled) {
          this._logLookup(moduleName, parsedName, tmpModuleName);
        }

        if (moduleName) {
          return moduleName;
        }
      }
    },

    chooseModuleName: function chooseModuleName(moduleName) {
      var underscoredModuleName = underscore(moduleName);

      if (moduleName !== underscoredModuleName && this._moduleRegistry.has(moduleName) && this._moduleRegistry.has(underscoredModuleName)) {
        throw new TypeError("Ambiguous module names: `" + moduleName + "` and `" + underscoredModuleName + "`");
      }

      if (this._moduleRegistry.has(moduleName)) {
        return moduleName;
      } else if (this._moduleRegistry.has(underscoredModuleName)) {
        return underscoredModuleName;
      } else {
        // workaround for dasherized partials:
        // something/something/-something => something/something/_something
        var partializedModuleName = moduleName.replace(/\/-([^\/]*)$/, '/_$1');

        if (this._moduleRegistry.has(partializedModuleName)) {
          _ember['default'].deprecate('Modules should not contain underscores. ' + 'Attempted to lookup "' + moduleName + '" which ' + 'was not found. Please rename "' + partializedModuleName + '" ' + 'to "' + moduleName + '" instead.', false, { id: 'ember-resolver.underscored-modules', until: '3.0.0' });

          return partializedModuleName;
        } else {
          return moduleName;
        }
      }
    },

    // used by Ember.DefaultResolver.prototype._logLookup
    lookupDescription: function lookupDescription(fullName) {
      var parsedName = this.parseName(fullName);

      var moduleName = this.findModuleName(parsedName, true);

      return moduleName;
    },

    // only needed until 1.6.0-beta.2 can be required
    _logLookup: function _logLookup(found, parsedName, description) {
      if (!_ember['default'].ENV.LOG_MODULE_RESOLVER && !parsedName.root.LOG_RESOLVER) {
        return;
      }

      var symbol, padding;

      if (found) {
        symbol = '[✓]';
      } else {
        symbol = '[ ]';
      }

      if (parsedName.fullName.length > 60) {
        padding = '.';
      } else {
        padding = new Array(60 - parsedName.fullName.length).join('.');
      }

      if (!description) {
        description = this.lookupDescription(parsedName);
      }

      _ember['default'].Logger.info(symbol, parsedName.fullName, padding, description);
    },

    knownForType: function knownForType(type) {
      var moduleKeys = this._moduleRegistry.moduleNames();

      var items = (0, _emberResolverUtilsMakeDictionary['default'])();
      for (var index = 0, length = moduleKeys.length; index < length; index++) {
        var moduleName = moduleKeys[index];
        var fullname = this.translateToContainerFullname(type, moduleName);

        if (fullname) {
          items[fullname] = true;
        }
      }

      return items;
    },

    translateToContainerFullname: function translateToContainerFullname(type, moduleName) {
      var prefix = this.prefix({ type: type });

      // Note: using string manipulation here rather than regexes for better performance.
      // pod modules
      // '^' + prefix + '/(.+)/' + type + '$'
      var podPrefix = prefix + '/';
      var podSuffix = '/' + type;
      var start = moduleName.indexOf(podPrefix);
      var end = moduleName.indexOf(podSuffix);

      if (start === 0 && end === moduleName.length - podSuffix.length && moduleName.length > podPrefix.length + podSuffix.length) {
        return type + ':' + moduleName.slice(start + podPrefix.length, end);
      }

      // non-pod modules
      // '^' + prefix + '/' + pluralizedType + '/(.+)$'
      var pluralizedType = this.pluralize(type);
      var nonPodPrefix = prefix + '/' + pluralizedType + '/';

      if (moduleName.indexOf(nonPodPrefix) === 0 && moduleName.length > nonPodPrefix.length) {
        return type + ':' + moduleName.slice(nonPodPrefix.length);
      }
    },

    _extractDefaultExport: function _extractDefaultExport(normalizedModuleName) {
      var module = require(normalizedModuleName, null, null, true /* force sync */);

      if (module && module['default']) {
        module = module['default'];
      }

      return module;
    }
  });

  Resolver.reopenClass({
    moduleBasedResolver: true
  });

  exports['default'] = Resolver;
});
define('ember-resolver/utils/class-factory', ['exports'], function (exports) {
  'use strict';

  exports['default'] = classFactory;

  function classFactory(klass) {
    return {
      create: function create(injections) {
        if (typeof klass.extend === 'function') {
          return klass.extend(injections);
        } else {
          return klass;
        }
      }
    };
  }
});
define("ember-resolver/utils/create", ["exports", "ember"], function (exports, _ember) {
  "use strict";

  var create = Object.create || _ember["default"].create;
  if (!(create && !create(null).hasOwnProperty)) {
    throw new Error("This browser does not support Object.create(null), please polyfil with es5-sham: http://git.io/yBU2rg");
  }

  exports["default"] = create;
});
define('ember-resolver/utils/make-dictionary', ['exports', 'ember-resolver/utils/create'], function (exports, _emberResolverUtilsCreate) {
  'use strict';

  exports['default'] = makeDictionary;

  function makeDictionary() {
    var cache = (0, _emberResolverUtilsCreate['default'])(null);
    cache['_dict'] = null;
    delete cache['_dict'];
    return cache;
  }
});
define('ember-resolver/utils/module-registry', ['exports', 'ember'], function (exports, _ember) {
  /*globals requirejs, require */

  'use strict';

  if (typeof requirejs.entries === 'undefined') {
    requirejs.entries = requirejs._eak_seen;
  }

  function ModuleRegistry(entries) {
    this._entries = entries || requirejs.entries;
  }

  ModuleRegistry.prototype.moduleNames = function ModuleRegistry_moduleNames() {
    return (Object.keys || _ember['default'].keys)(this._entries);
  };

  ModuleRegistry.prototype.has = function ModuleRegistry_has(moduleName) {
    return moduleName in this._entries;
  };

  ModuleRegistry.prototype.get = function ModuleRegistry_get(moduleName) {
    var exportName = arguments.length <= 1 || arguments[1] === undefined ? 'default' : arguments[1];

    var module = require(moduleName);
    return module && module[exportName];
  };

  exports['default'] = ModuleRegistry;
});//# sourceMappingURL=addons.map

(function(undefined) {
  function Call(t, l) {
      var n = arguments.length > 2 ? arguments[2] : [];
      if (!1 === IsCallable(t))
          throw new TypeError(Object.prototype.toString.call(t) + "is not a function.");
      return t.apply(l, n)
  }
  function Get(n, t) {
      return n[t]
  }
  function IsCallable(n) {
      return "function" == typeof n
  }
  function ToBoolean(o) {
      return Boolean(o)
  }
  function ToInteger(n) {
      var i = Number(n);
      return isNaN(i) ? 0 : 1 / i === Infinity || 1 / i == -Infinity || i === Infinity || i === -Infinity ? i : (i < 0 ? -1 : 1) * Math.floor(Math.abs(i))
  }
  function ToLength(n) {
      var t = ToInteger(n);
      return t <= 0 ? 0 : Math.min(t, Math.pow(2, 53) - 1)
  }
  function ToObject(e) {
      if (null === e || e === undefined)
          throw TypeError();
      return Object(e)
  }
  function GetV(t, e) {
      return ToObject(t)[e]
  }
  function GetMethod(e, n) {
      var r = GetV(e, n);
      if (null === r || r === undefined)
          return undefined;
      if (!1 === IsCallable(r))
          throw new TypeError("Method not callable: " + n);
      return r
  }
  function Type(e) {
      switch (typeof e) {
      case "undefined":
          return "undefined";
      case "boolean":
          return "boolean";
      case "number":
          return "number";
      case "string":
          return "string";
      case "symbol":
          return "symbol";
      default:
          return null === e ? "null" : "Symbol"in this && e instanceof this.Symbol ? "symbol" : "object"
      }
  }
  function OrdinaryToPrimitive(r, t) {
      if ("string" === t)
          var e = ["toString", "valueOf"];
      else
          e = ["valueOf", "toString"];
      for (var i = 0; i < e.length; ++i) {
          var n = e[i]
            , a = Get(r, n);
          if (IsCallable(a)) {
              var o = Call(a, r);
              if ("object" !== Type(o))
                  return o
          }
      }
      throw new TypeError("Cannot convert to primitive.")
  }
  function ToPrimitive(e) {
      var t = arguments.length > 1 ? arguments[1] : undefined;
      if ("object" === Type(e)) {
          if (arguments.length < 2)
              var i = "default";
          else
              t === String ? i = "string" : t === Number && (i = "number");
          var r = "function" == typeof this.Symbol && "symbol" == typeof this.Symbol.toPrimitive ? GetMethod(e, this.Symbol.toPrimitive) : undefined;
          if (r !== undefined) {
              var n = Call(r, e, [i]);
              if ("object" !== Type(n))
                  return n;
              throw new TypeError("Cannot convert exotic object to primitive.")
          }
          return "default" === i && (i = "number"),
          OrdinaryToPrimitive(e, i)
      }
      return e
  }
  function ToString(t) {
      switch (Type(t)) {
      case "symbol":
          throw new TypeError("Cannot convert a Symbol value to a string");
      case "object":
          return ToString(ToPrimitive(t, "string"));
      default:
          return String(t)
      }
  }
  if (!("defineProperty"in Object && function() {
      try {
          var e = {}
          return Object.defineProperty(e, "test", {
              value: 42
          }),
          !0
      } catch (t) {
          return !1
      }
  }())) {
      !function(e) {
          var t = Object.prototype.hasOwnProperty("__defineGetter__")
            , r = "A property cannot both have accessors and be writable or have a value";
          Object.defineProperty = function n(o, i, c) {
              if (e && (o === window || o === document || o === Element.prototype || o instanceof Element))
                  return e(o, i, c);
              if (null === o || !(o instanceof Object || "object" == typeof o))
                  throw new TypeError("Object.defineProperty called on non-object");
              if (!(c instanceof Object))
                  throw new TypeError("Property description must be an object");
              var a = String(i)
                , f = "value"in c || "writable"in c
                , p = "get"in c && typeof c.get
                , s = "set"in c && typeof c.set;
              if (p) {
                  if ("function" !== p)
                      throw new TypeError("Getter must be a function");
                  if (!t)
                      throw new TypeError("Getters & setters cannot be defined on this javascript engine");
                  if (f)
                      throw new TypeError(r);
                  Object.__defineGetter__.call(o, a, c.get)
              } else
                  o[a] = c.value;
              if (s) {
                  if ("function" !== s)
                      throw new TypeError("Setter must be a function");
                  if (!t)
                      throw new TypeError("Getters & setters cannot be defined on this javascript engine");
                  if (f)
                      throw new TypeError(r);
                  Object.__defineSetter__.call(o, a, c.set)
              }
              return "value"in c && (o[a] = c.value),
              o
          }
      }(Object.defineProperty);
  }
  function CreateMethodProperty(e, r, t) {
      var a = {
          value: t,
          writable: !0,
          enumerable: !1,
          configurable: !0
      };
      Object.defineProperty(e, r, a)
  }
  if (!("find"in Array.prototype)) {
      CreateMethodProperty(Array.prototype, "find", function e(r) {
          var t = ToObject(this)
            , n = ToLength(Get(t, "length"));
          if (!1 === IsCallable(r))
              throw new TypeError(r + " is not a function");
          for (var o = arguments.length > 1 ? arguments[1] : undefined, a = 0; a < n; ) {
              var i = ToString(a)
                , f = Get(t, i);
              if (ToBoolean(Call(r, o, [f, a, t])))
                  return f;
              var a = a + 1
          }
          return undefined
      });
  }
}
).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});

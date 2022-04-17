
export type Conditional = (x: any) => boolean;

export const begin_dot_slash = /^\.+\/+/;
export const end_slash = /\/+$/;

export function remove_pattern(r: RegExp) {
  return function (s: string) {
    return s.replace(r, '');
  };
} // export function

export function UPCASE(s: string) {
  return s.toUpperCase();
} // export function

export function path_to_filename(replace: string) {
  return function (s: string) {
    return s
    .replace(begin_dot_slash, '')
    .replace(end_slash, '')
    .replaceAll(/[^a-z0-9\.\-\_]+/g, replace)
    .replaceAll(/\.+/g, '.');
  };
} // export function

export function if_string(f: Function) {
  return function (x: any) {
    if (typeof x === "string")
      return f(x);
    return x;
  }
} // export function

export function if_number(f: Function) {
  return function (x: any) {
    if (typeof x === "number")
      return f(x);
    return x;
  }
} // export function

export function is_length_0(x: {length: number}) : boolean {
  return(x.length === 0);
} // export function

export function is_null(x: any) : boolean {
  return(x === null);
} // export function

export function is_true(x: any) : boolean {
  return(x === true);
} // export function

export function is_false(x: any) : boolean {
  return(x === false);
} // export function

export function is_boolean(x: any) : boolean {
  return(typeof x === "boolean");
} // export function

export function is_string(x: any) : boolean {
  return(typeof x === "string");
} // export function

export function is_number(x: any) : boolean {
  return(typeof x === "number");
} // export function

export function is_null_or_undefined(x: any) : boolean {
  return(x === null || typeof x === "undefined");
} // export function

export function not(...funcs: Conditional[]) : Conditional {
  return function (x: any) {
    for (const f of funcs) {
      if (f(x))
        return false;
    }
    return true;
  };
} // export function

export function and(...funcs: Conditional[]) : Conditional {
  return function (x: any) {
    for (const f of funcs) {
      if (!f(x))
        return false;
    }
    return true;
  };
} // export function

export function or(...funcs: Conditional[]) : Conditional {
  return function (x: any) {
    for (const f of funcs) {
      if (f(x))
        return true;
    }
    return false;
  };
} // export function

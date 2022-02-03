


import * as path from "https://deno.land/std/path/mod.ts";
import {split_whitespace} from "./String.ts";

// // Colors from: https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
const COLORS = {
  "BOLD" : "\x1b[1m",
  "RED": "\x1b[31m",
  "GREEN": "\x1b[32m",
  "YELLOW": "\x1b[33m",
  "BLUE": "\x1b[34m",
  "RESET": "\x1b[0m"
}; // const

// const WHITESPACE = /(\s+)/; 

// function standard_keys(raw : string) {
//   return raw.split(WHITESPACE).filter((e) => e !== "" );
// }

// function color(color, ...args) {
//   const new_color = standard_keys(color).map((x) => DA_Spec[x]).join(" ");
//   return `${new_color}${args.join(" ")}${RESET}`;
// }

// function bold(txt) {
//   return color("BOLD", txt);
// }

// function green(txt) {
//   return color("GREEN", txt);
// }

// function red(txt) {
//   return color("RED", txt);
// }

// function yellow(txt) {
//   return color("YELLOW", txt);
// }

// green.bold  = function (...args) { return color("GREEN BOLD", args); };
// red.bold    = function (...args) { return color("RED BOLD", args); };
// yellow.bold = function (...args) { return color("YELLOW BOLD", args); };

//

const CHECK_MARK = "✓";
const X_MARK = "✗";

type Action = (...args: string[]) => void;
type Pattern_Element = string | 0 | string[];
type Pattern = Array<Pattern_Element>;

interface Command {
  raw_cmd: string;
  pattern: Array<Pattern_Element>;
  action: Action;
} // interface

function arg_match(pattern: Array<Pattern_Element>, user_input: string[]) {
  if (pattern.length !== user_input.length)
    return false;
  const vars: string[] = [];
  const is_a_match = pattern.every((x, i) => {
    const u = user_input[i];
    if (x === u ) { return true; }
    if (x === 0) {
      vars.push(u);
      return true;
    }
    if (Array.isArray(x) && x.includes(u)) {
      vars.push(u);
      return true
    }
  });
  if (is_a_match)
    return vars;
  return false;
} // function

let _user_input: string[] = [];
let _vars: string[] = [];
let is_found = false;
let is_help = false;
let filename = path.basename(import.meta.url);
let main_mod = path.basename(Deno.mainModule);

command(Deno.args);

export function values() {
  return _vars;
} // export

export function command(i: string[]) {
  _user_input = i;
  switch(_user_input[0]) {
    case "-h":
      case "help":
      case "--help": {
      is_help = true;
      break;
    }
    default:
      is_help = false;
  } // switch
} // export

export function print_help(raw_cmd: string) {
  const search = _user_input[1];
  if (search && raw_cmd.indexOf(search) === -1) {
    return false;
  }

  const pieces = split_whitespace(raw_cmd).map((x, i) => {
    if (i === 0)
      return`${COLORS.BLUE}${COLORS.BOLD}${x}${COLORS.RESET}`;
    if (x.indexOf('|') > 0)
      return`${COLORS.YELLOW}${x}${COLORS.RESET}`;
    if (x.indexOf('<') > -1)
      return`${COLORS.GREEN}${x}${COLORS.RESET}`;
    return x;
  });
  console.log(`  ${main_mod} ${pieces.join(" ")}`);
  return true;
} // export

export function match(raw_cmd: string) {
  if (is_help) {
    print_help(raw_cmd);
  } // if is_help

  if (is_found)
    return false;

  const pattern = split_whitespace(raw_cmd).map((x: string) => {
    if (x.indexOf('<') === 0 && x.indexOf('>') === (x.length - 1)) {
      if (x.indexOf('|') > 1) {
        return x.substring(1, x.length - 1).split('|').map(x => x.trim());
      }
      return 0;
    }
    return x;
  }); // pattern

  const new_vars = arg_match(pattern, _user_input);
  if (new_vars) {
    _vars = new_vars;
    is_found = true;
  }
  return !!new_vars;
} // function

export function not_found() {
  match("help|--help|-h");
  match("help|--help|-h <search>");
  if (is_found || is_help)
    return false;
  console.error(`Command not reconized: ${_user_input.map(x => Deno.inspect(x)).join(" ")}`);
  Deno.exit(1);
}


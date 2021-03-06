// @flow
import {parserLogger, tag} from "../Logger";
import type {TypedefTag} from "@webdoc/types";
import {parseDataType} from "@webdoc/model";

// @typedef {<DATA_TYPE>} <NAME>

// Parse the "@typedef {of} alias" tag
export function parseTypedef(value: string, options: any): $Shape<TypedefTag> {
  // Get {ReferredType}
  const refClosure = /{([^{}])+}/.exec(value);
  let of;
  let alias;

  if (!refClosure) {
    // eslint-disable-next-line max-len
    parserLogger.warn(tag.TagParser, "@typedef has not defined the {OriginalType}; defaulting to {any}");
    alias = value.trim();
  } else {
    of = refClosure[0].slice(1, -1);
    alias = value.replace(
      new RegExp(`(.{${refClosure.index}}).{${refClosure.index + refClosure[0].length}}`), "$1")
      .trim();
  }

  options.dataType = of ? parseDataType(of) : undefined;
  options.alias = alias;
  options.name = alias;

  // $FlowFixMe
  return {
    dataType: [of],
    alias,
    type: "TypedefTag",
  };
}

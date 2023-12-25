import type { Array2DictOptions } from "../types";

/**
 * a array to dictionary
 * @param data
 * @param  config
 * @returns Object
 *
 * @case1
 *  [value1, value2] => [value1, value2]
 * @case2
 *  [{key: key1,name: name1}, {key: key2,name: name2}] => {key1: name1, key2:name2}
 */
export function Array2Dict<T extends Array<any>>(data: T, config: Array2DictOptions) {

  config = Object.assign({ deep: true, del_key: true, children: 'children' }, config)

  return data.reduce(function (obj, item) {
    const keys = Object.keys(item)
    if (!keys.includes(config.key))
      throw new Error(`the key \`${config.key}\` not exists`)

    if (['object', 'function', 'undefined', 'symbol'].includes(typeof item[config.key]))
      throw new Error(`the value of key \`${config.key}\` typeof \`${typeof item[config.key]}\`, is not acceptable type`)

    if (typeof item[config.key] === 'number' && Number.isNaN(item[config.key]))
      throw new Error(`the value of key \`${config.key}\` is NaN, is not acceptable type`)

   if (config.deep && config.children && item[config.children])
      item[config.children] = Array2Dict(item[config.children], config)

    if (keys.length == 1) { // do nothing => [item1, item2]
      return item

    } else if (keys.length == 2) { // transform [{key: value}]

      let value_key = keys.find(i => i != config.key) as string;
      obj[item[config.key]] = item[value_key];

    } else {  // transform [{ key: { key1: value1, key2: value2, ...} }]
      obj[item[config.key]] = item;
      if (config.del_key) delete item[config.key];  // delete the value corresponding to key
    }
    return obj;
  }, {});
}



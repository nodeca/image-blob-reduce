function assign (to) {
  let from

  for (let s = 1; s < arguments.length; s++) {
    from = Object(arguments[s])

    for (const key in from) {
      if (Object.prototype.hasOwnProperty.call(from, key)) to[key] = from[key]
    }
  }

  return to
}

function pick (from, props) {
  const to = {}

  props.forEach(function (key) {
    if (Object.prototype.hasOwnProperty.call(from, key)) to[key] = from[key]
  })

  return to
}

function pick_pica_resize_options (from) {
  return pick(from, [
    'alpha',
    'unsharpAmount',
    'unsharpRadius',
    'unsharpThreshold',
    'cancelToken'
  ])
}

export {
  assign,
  pick,
  pick_pica_resize_options
}

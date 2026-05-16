function assign (to: any, ...sources: any[]) {
  let from

  for (let s = 0; s < sources.length; s++) {
    from = Object(sources[s])

    for (const key in from) {
      if (Object.prototype.hasOwnProperty.call(from, key)) to[key] = from[key]
    }
  }

  return to
}

function pick (from: any, props: string[]) {
  const to = {}

  props.forEach(function (key) {
    if (Object.prototype.hasOwnProperty.call(from, key)) to[key] = from[key]
  })

  return to
}

function pick_pica_resize_options (from: any) {
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

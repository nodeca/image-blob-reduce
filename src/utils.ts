function assign<T extends object> (to: T, ...sources: Array<object | null | undefined>): T {
  let from: object

  for (let s = 0; s < sources.length; s++) {
    from = Object(sources[s])

    for (const key in from) {
      if (Object.prototype.hasOwnProperty.call(from, key)) {
        ;(to as Record<string, unknown>)[key] = (from as Record<string, unknown>)[key]
      }
    }
  }

  return to
}

function pick<T extends object, K extends keyof T> (from: T, props: K[]): Partial<Pick<T, K>> {
  const to: Partial<Pick<T, K>> = {}

  props.forEach(function (key) {
    if (Object.prototype.hasOwnProperty.call(from, key)) to[key] = from[key]
  })

  return to
}

export {
  assign,
  pick
}

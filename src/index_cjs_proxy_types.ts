import imageBlobReduce, { ImageBlobReduce, image_traverse, pica, Pica } from './index'

export {
  ImageBlobReduce,
  image_traverse,
  pica,
  Pica
} from './index'

export type {
  ImageBlobReduceEnv,
  ImageBlobReduceHook,
  ImageBlobReduceHookMethodName,
  ImageBlobReduceOptions,
  ImageBlobReducePlugin,
  ImageBlobReduceResizeOptions
} from './index'

declare const imageBlobReduceWithStatic: typeof imageBlobReduce & {
  ImageBlobReduce: typeof ImageBlobReduce
  image_traverse: typeof image_traverse
  pica: typeof pica
  Pica: typeof Pica
}

export default imageBlobReduceWithStatic

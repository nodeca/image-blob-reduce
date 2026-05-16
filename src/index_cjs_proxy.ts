import imageBlobReduce, { ImageBlobReduce, image_traverse, pica, Pica } from './index'

const imageBlobReduceWithStatic = imageBlobReduce as typeof imageBlobReduce & {
  ImageBlobReduce: typeof ImageBlobReduce
  image_traverse: typeof image_traverse
  pica: typeof pica
  Pica: typeof Pica
}

imageBlobReduceWithStatic.ImageBlobReduce = ImageBlobReduce
imageBlobReduceWithStatic.image_traverse = image_traverse
imageBlobReduceWithStatic.pica = pica
imageBlobReduceWithStatic.Pica = Pica

export default imageBlobReduceWithStatic

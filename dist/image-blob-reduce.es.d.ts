import { Pica, ResizeOptions, PicaCanvas } from 'pica';
export { Pica, default as pica } from 'pica';

interface ErrorWithCode extends Error {
    code?: string;
}
interface JpegSegment {
    code: number;
    offset: number;
    length: number;
}
interface ExifEntry {
    is_big_endian: boolean;
    ifd: number;
    tag: number;
    format: number;
    count: number;
    entry_offset: number;
    data_length: number;
    data_offset: number;
    value: number[] | string | null;
    is_subifd_link: boolean;
}
type JpegSegmentIterator = (segment: JpegSegment) => unknown;
type JpegSegmentFilter = (segment: JpegSegment) => unknown;
type ExifEntryIterator = (entry: ExifEntry) => unknown;
declare function is_jpeg(jpeg_bin: Uint8Array): boolean;
declare function jpeg_segments_each(jpeg_bin: Uint8Array, on_segment: JpegSegmentIterator): void;
declare function jpeg_segments_filter(jpeg_bin: Uint8Array, on_segment: JpegSegmentFilter): Uint8Array;
declare function jpeg_exif_tags_each(jpeg_bin: Uint8Array, on_exif_entry: ExifEntryIterator): void;
declare function jpeg_exif_tags_filter(jpeg_bin: Uint8Array, on_exif_entry: ExifEntryIterator): Uint8Array;
declare function jpeg_add_comment(jpeg_bin: Uint8Array, comment: string): Uint8Array;

type image_traverse_ErrorWithCode = ErrorWithCode;
type image_traverse_ExifEntry = ExifEntry;
type image_traverse_ExifEntryIterator = ExifEntryIterator;
type image_traverse_JpegSegment = JpegSegment;
type image_traverse_JpegSegmentFilter = JpegSegmentFilter;
type image_traverse_JpegSegmentIterator = JpegSegmentIterator;
declare const image_traverse_is_jpeg: typeof is_jpeg;
declare const image_traverse_jpeg_add_comment: typeof jpeg_add_comment;
declare const image_traverse_jpeg_exif_tags_each: typeof jpeg_exif_tags_each;
declare const image_traverse_jpeg_exif_tags_filter: typeof jpeg_exif_tags_filter;
declare const image_traverse_jpeg_segments_each: typeof jpeg_segments_each;
declare const image_traverse_jpeg_segments_filter: typeof jpeg_segments_filter;
declare namespace image_traverse {
  export { image_traverse_is_jpeg as is_jpeg, image_traverse_jpeg_add_comment as jpeg_add_comment, image_traverse_jpeg_exif_tags_each as jpeg_exif_tags_each, image_traverse_jpeg_exif_tags_filter as jpeg_exif_tags_filter, image_traverse_jpeg_segments_each as jpeg_segments_each, image_traverse_jpeg_segments_filter as jpeg_segments_filter };
  export type { image_traverse_ErrorWithCode as ErrorWithCode, image_traverse_ExifEntry as ExifEntry, image_traverse_ExifEntryIterator as ExifEntryIterator, image_traverse_JpegSegment as JpegSegment, image_traverse_JpegSegmentFilter as JpegSegmentFilter, image_traverse_JpegSegmentIterator as JpegSegmentIterator };
}

interface ImageBlobReduceOptions {
    pica?: Pica;
}
type ImageBlobReduceResizeOptions = ResizeOptions & {
    max?: number;
};
interface ImageBlobReduceEnv {
    blob: Blob;
    opts: ImageBlobReduceResizeOptions & {
        max: number;
    };
    image?: HTMLImageElement | null;
    image_url?: string | null;
    transform_width?: number | null;
    transform_height?: number | null;
    scale_factor?: number;
    out_canvas?: PicaCanvas;
    out_blob?: Blob;
    is_jpeg?: boolean;
    orig_blob?: Blob;
    orientation?: number;
}
type HookMethodName = '_blob_to_image' | '_calculate_size' | '_transform' | '_cleanup' | '_create_blob';
type Hook = (this: ImageBlobReduce, env: ImageBlobReduceEnv) => Promise<ImageBlobReduceEnv>;
type Plugin = (reducer: ImageBlobReduce, ...params: unknown[]) => void;
declare class ImageBlobReduce {
    pica: Pica;
    private initialized;
    private _initPromise?;
    constructor(options?: ImageBlobReduceOptions);
    use(plugin: Plugin, ...params: unknown[]): this;
    setup(): void;
    private _ensureInitialized;
    toBlob(blob: Blob, options?: ImageBlobReduceResizeOptions): Promise<Blob>;
    toCanvas(blob: Blob, options?: ImageBlobReduceResizeOptions): Promise<PicaCanvas>;
    before(method_name: HookMethodName, fn: Hook): this;
    after(method_name: HookMethodName, fn: Hook): this;
    _blob_to_image(env: ImageBlobReduceEnv): Promise<ImageBlobReduceEnv>;
    _calculate_size(env: ImageBlobReduceEnv): Promise<ImageBlobReduceEnv>;
    _transform(env: ImageBlobReduceEnv): Promise<ImageBlobReduceEnv>;
    _cleanup(env: ImageBlobReduceEnv): Promise<ImageBlobReduceEnv>;
    _create_blob(env: ImageBlobReduceEnv): Promise<ImageBlobReduceEnv>;
    _getUint8Array(blob: Blob): Promise<Uint8Array>;
}
declare function imageBlobReduce(options?: ImageBlobReduceOptions): ImageBlobReduce;

export { ImageBlobReduce, imageBlobReduce as default, image_traverse };
export type { ImageBlobReduceEnv, Hook as ImageBlobReduceHook, HookMethodName as ImageBlobReduceHookMethodName, ImageBlobReduceOptions, Plugin as ImageBlobReducePlugin, ImageBlobReduceResizeOptions };

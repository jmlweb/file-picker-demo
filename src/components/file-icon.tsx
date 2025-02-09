import Image from 'next/image';

const getIconName = (fileName: string) => {
  const extension = fileName?.split('.').pop();
  if (extension) {
    return ['mp4'].includes(extension) ? 'video' : extension;
  }
  return 'file';
};

export default function FileIcon({ path }: { path: string }) {
  return (
    <Image
      alt="pdf"
      width="18"
      height="18"
      className="h-[18px] w-[18px]"
      src={`/file-types/${getIconName(path)}.svg`}
    />
  );
}

import React from 'react';
import Image from 'next/image';
interface IProps {
  src: string;
  className: string;
  tittle?: string;
}

const NextImage: React.FC<IProps> = ({ src, className }) => {
  return (
    <React.Fragment>
      <Image
        height={1080}
        width={1920}
        src={src}
        alt={''}
        className={className}
      />
    </React.Fragment>
  );
};
export default NextImage;

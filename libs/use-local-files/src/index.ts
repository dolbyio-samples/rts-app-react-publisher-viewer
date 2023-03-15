import { useState } from 'react';

import { LocalFile } from './types';

/**
 * This hook handles locally uploaded media files such as MP4s. As it is not possible to capture
 * the real-time content of a local file, this hook creates and stores object URLs alongside the
 * original filename for each file.
 */
const useLocalFiles = () => {
  const [files, setFiles] = useState<LocalFile[]>([]);

  const add = (file: File) => {
    const newFile = { label: file.name, objectUrl: URL.createObjectURL(file) };

    setFiles((prevFiles) => [...prevFiles, newFile]);
  };

  const remove = (objectUrl: string) => {
    setFiles((prevFiles) => prevFiles.filter((localFile) => localFile.objectUrl !== objectUrl));
  };

  return { add, files, remove };
};

export * from './types';
export default useLocalFiles;

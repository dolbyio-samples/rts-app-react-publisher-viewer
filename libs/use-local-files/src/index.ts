import { useState } from 'react';

import { LocalFile } from './types';

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

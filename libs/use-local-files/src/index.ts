import { useState } from 'react';

import { LocalFile } from './types';

const useLocalFiles = () => {
  const [files, setFiles] = useState<LocalFile[]>([]);

  const addLocalFile = (file: FormDataEntryValue) => {
    if (file && file instanceof File) {
      const newFile = { label: file.name, objectUrl: URL.createObjectURL(file) };

      setFiles((prevFiles) => [...prevFiles, newFile]);
    }
  };

  const removeLocalFile = (objectUrl: string) => {
    setFiles((prevFiles) => prevFiles.filter((localFile) => localFile.objectUrl !== objectUrl));
  };

  return { addLocalFile, files, removeLocalFile };
};

export * from './types';
export default useLocalFiles;

import { ChangeEventHandler, DetailedHTMLProps, InputHTMLAttributes, useState } from 'react';

import { LocalFile } from './types';

const useLocalFile = () => {
  const [localFile, setLocalFile] = useState<LocalFile>();

  const register = (): DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> => {
    const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
      const [file] = event.target.files ?? [];

      if (file) {
        const objectUrl = URL.createObjectURL(file);

        setLocalFile({ name: file.name, objectUrl });
      }
    };

    return {
      accept: 'video/*',
      multiple: false,
      onChange,
      type: 'file',
    };
  };

  return { localFile, register };
};

export * from './types';
export default useLocalFile;

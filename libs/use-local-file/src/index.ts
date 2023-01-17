import { ChangeEventHandler, DetailedHTMLProps, InputHTMLAttributes, useState } from 'react';

const useLocalFile = () => {
  const [file, setFile] = useState<string | undefined>(undefined);

  const register = (): DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> => {
    const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      const { files } = e.target;
      if (files?.length) {
        setFile(URL.createObjectURL(files[0]));
      }
    };

    return {
      type: 'file',
      accept: 'video/*',
      multiple: false,
      onChange,
    };
  };

  return { register, file };
};

export default useLocalFile;

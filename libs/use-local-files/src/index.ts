import { ChangeEventHandler, DetailedHTMLProps, InputHTMLAttributes, useState } from 'react';

const useLocalFiles = () => {
  const [files, setFiles] = useState<string[]>([]);

  const register = (): DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> => {
    const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      const { files } = e.target;
      if (files) {
        const temp: string[] = [];
        for (const file of files) {
          temp.push(URL.createObjectURL(file));
        }
        setFiles((prev) => [...prev, ...temp]);
      }
    };

    return {
      type: 'file',
      accept: 'video/*',
      multiple: false,
      value: [],
      onChange,
    };
  };

  const remove = (url: string) => {
    setFiles((prev) => prev.filter((item) => item !== url));
  };

  const reset = () => {
    setFiles([]);
  };

  return { register, files, remove, reset };
};

export default useLocalFiles;

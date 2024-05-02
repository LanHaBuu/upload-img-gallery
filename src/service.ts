export const getFileName = (file: any, webp: any) => {
  const timestamp = Date.now(); // Unique timestamp

  const originalFileName = file.name.split(".").shift(); // Extract original filename without extension
  const convertedFileName = `${originalFileName}_${timestamp}.${webp.fileName
    .split(".")
    .pop()}`;

  return convertedFileName;
};

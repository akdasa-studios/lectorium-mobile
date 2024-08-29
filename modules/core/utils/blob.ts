export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
          // @ts-ignore
          resolve(reader.result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
  });
}

// What React Native's FormData takes for a file: the picker gives the uri, name and type.
export interface IUploadFile {
  uri: string;
  name: string;
  type: string;
}

export function toFormData(field: string, file: IUploadFile): FormData {
  const formData = new FormData();
  // React Native's FormData accepts this object in place of a Blob.
  formData.append(field, file as unknown as Blob);
  return formData;
}

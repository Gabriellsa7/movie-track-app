export interface IUploadFile {
  uri: string;
  name: string;
  type: string;
}

export function toFormData(field: string, file: IUploadFile): FormData {
  const formData = new FormData();
  formData.append(field, file as unknown as Blob);
  return formData;
}

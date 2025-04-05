import { api } from '../../../boot/axios'

export const detachFileFromProduct = (productId: number, fileId: number) =>
  api.delete(`/products/${productId}/detach_file/${fileId}`)

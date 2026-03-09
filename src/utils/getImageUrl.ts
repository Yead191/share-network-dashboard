import { imageUrl } from '../redux/api/baseApi';

export function getImageUrl(imageurl: string) {
    if (imageurl?.startsWith('http')) return imageurl;
    return imageUrl + imageurl;
}

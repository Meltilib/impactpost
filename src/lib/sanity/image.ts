import imageUrlBuilder from '@sanity/image-url';
import { client } from './client';

const builder = client ? imageUrlBuilder(client) : null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  if (!builder) {
    // Return a dummy object that returns the source URL if Sanity not configured
    return {
      url: () => typeof source === 'string' ? source : '',
      width: () => ({ url: () => typeof source === 'string' ? source : '', height: () => ({ url: () => typeof source === 'string' ? source : '' }) }),
      height: () => ({ url: () => typeof source === 'string' ? source : '' }),
    };
  }
  return builder.image(source);
}

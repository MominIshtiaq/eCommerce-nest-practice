import { SetMetadata } from '@nestjs/common';

export default function AllowAnonymous() {
  return SetMetadata('isPublic', true);
}

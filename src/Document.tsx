import type { ParentProps } from 'solid-js';
import { HTML } from '@dasig';

export default function Document(props: ParentProps) {
  return (
    <HTML>{props.children}</HTML>
  );
}

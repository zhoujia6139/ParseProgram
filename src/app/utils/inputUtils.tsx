import * as React from 'react';

export function getInputFromType<T>(type: UI.InputType, props: T) {
  switch (type) {
    case 'TextInput':
      return <input type="text" {...props} />;
  }
  return null;
}

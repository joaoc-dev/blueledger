import { expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import HelloWorld from './HelloWorld.jsx';

it('renders name', async () => {
  const { getByText } = render(<HelloWorld name="Vitest" />);
  await expect.element(getByText('Hello Vitest!')).toBeInTheDocument();
});

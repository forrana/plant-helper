import { MemoryRouter } from 'react-router-dom';
import Logout from '../Logout';
import { customRender } from '../TestUtils';

test('Match snapshot', async () => {
    const providerProps = {
        value: () => undefined,
      }

    const {container} = customRender(
      <MemoryRouter>
          <Logout />
      </MemoryRouter>,
      {providerProps}
    );

    expect(container).toMatchSnapshot()
  });